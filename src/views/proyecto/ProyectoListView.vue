<template>
  <v-container>
    <!-- Indicador de carga lineal -->
    <v-progress-linear
      v-if="loading"
      indeterminate
      color="primary"
      height="4"
      class="mb-4"
    ></v-progress-linear>

    <!-- Mensaje cuando no hay proyectos -->
    <v-card v-if="emptyResponse && !loading" class="mb-4">
      <v-card-text class="text-center py-8">
        <v-icon size="64" color="grey lighten-1">mdi-database-remove</v-icon>
        <h3 class="text-h5 mt-4">
          {{ esAdmin ? 'No hay proyectos registrados' : 'No tienes proyectos accesibles' }}
        </h3>
        <p class="text-grey mt-2">
          {{
            esAdmin
              ? 'Parece que aún no has creado ningún proyecto'
              : 'No tienes acceso a ningún proyecto actualmente'
          }}
        </p>
        <v-btn
          v-if="puedeCrearProyecto"
          color="primary"
          @click="dialogNuevoProyecto = true"
          class="mt-4"
        >
          <v-icon left>mdi-plus</v-icon>
          {{ esAdmin ? 'Crear primer proyecto' : 'Crear nuevo proyecto' }}
        </v-btn>
      </v-card-text>
    </v-card>

    <v-row v-else>
      <!-- Columna principal -->
      <v-col cols="12" md="9" lg="9">
        <v-card class="pa-4" elevation="2">
          <v-card-title class="d-flex justify-space-between align-center">
            <span>
              Lista de Proyectos
              <v-chip v-if="!esAdmin" size="small" color="info" class="ml-2">
                {{ proyectosAccesiblesCount }} accesibles
              </v-chip>
            </span>
            <span class="text-caption text-grey">Total: {{ filteredProyectos.length }}</span>
          </v-card-title>

          <!-- Información de acceso para usuarios normales -->
          <v-alert
            v-if="!esAdmin && filteredProyectos.length > 0"
            type="info"
            variant="tonal"
            class="mx-4 mb-4"
          >
            <div class="d-flex align-center">
              <v-icon class="mr-2">mdi-information</v-icon>
              <span>
                Tienes acceso a <strong>{{ proyectosAccesiblesCount }}</strong> proyectos a través
                de tus instancias gestoras y permisos específicos
              </span>
            </div>
          </v-alert>

          <!-- Botón para cambiar modo de prueba -->
          <v-alert v-if="modoPrueba" type="warning" variant="tonal" class="mx-4 mb-4">
            <div class="d-flex align-center justify-space-between">
              <span>
                <strong>MODO PRUEBA ACTIVADO</strong> -
                {{ esAdmin ? 'Vista de Administrador' : 'Vista de Usuario Normal' }}
              </span>
              <v-btn size="small" @click="cambiarModoPrueba" color="warning">
                Cambiar a {{ esAdmin ? 'Usuario Normal' : 'Administrador' }}
              </v-btn>
            </div>
          </v-alert>

          <!-- Buscador -->
          <v-card-text class="pt-0 pb-4">
            <v-text-field
              v-model="searchQuery"
              label="Buscar proyectos (por código o título)"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              clearable
              density="comfortable"
              @input="currentPage = 1"
            ></v-text-field>

            <!-- Filtros por estado -->
            <v-chip-group v-model="statusFilters" multiple column class="mt-2">
              <v-chip
                v-for="status in availableStatuses"
                :key="status.value"
                :value="status.value"
                filter
                :color="getStatusColor(status.value)"
                variant="outlined"
              >
                {{ status.text }}
              </v-chip>
            </v-chip-group>

            <!-- Filtro por nivel de acceso (solo para usuarios normales) -->
            <v-chip-group
              v-if="!esAdmin && filteredProyectos.length > 0"
              v-model="nivelAccesoFilters"
              multiple
              column
              class="mt-2"
            >
              <v-chip value="1" filter color="blue-lighten-4" variant="outlined">
                <v-icon left small>mdi-eye</v-icon>
                Lectura
              </v-chip>
              <v-chip value="2" filter color="green-lighten-4" variant="outlined">
                <v-icon left small>mdi-pencil</v-icon>
                Edición
              </v-chip>
              <v-chip value="3" filter color="red-lighten-4" variant="outlined">
                <v-icon left small>mdi-cog</v-icon>
                Administración
              </v-chip>
            </v-chip-group>
          </v-card-text>

          <v-list v-if="!loading" class="py-0">
            <template v-for="item in proyectosPaginados" :key="item.id">
              <v-list-item :value="item" class="mb-2">
                <template v-slot:prepend>
                  <v-avatar :color="getStatusColor(item.estado)" class="mr-4">
                    <v-icon dark>mdi-notebook</v-icon>
                  </v-avatar>
                </template>

                <v-list-item-title class="font-weight-bold">{{ item.titulo }}</v-list-item-title>
                <v-list-item-subtitle class="mt-1">
                  <div class="d-flex align-center flex-wrap">
                    <v-chip
                      small
                      :color="getStatusColor(item.estado)"
                      text-color="white"
                      class="mr-2 mb-1"
                    >
                      {{ getEstadoTexto(item.estado) }}
                    </v-chip>
                    <span class="mr-2 mb-1">Código: {{ item.codigo }}</span>

                    <!-- Badge de nivel de acceso -->
                    <v-chip
                      v-if="!esAdmin"
                      small
                      :color="getNivelAccesoColor(item.nivel_acceso)"
                      class="mb-1"
                    >
                      <v-icon left small>{{ getNivelAccesoIcon(item.nivel_acceso) }}</v-icon>
                      {{ item.nivel_acceso_display }}
                    </v-chip>

                    <!-- Badge de admin -->
                    <v-chip v-else small color="red-lighten-4" class="mb-1">
                      <v-icon left small>mdi-shield-account</v-icon>
                      Administración
                    </v-chip>
                  </div>
                  <div class="text-caption mt-1">{{ item.descripcion }}</div>
                </v-list-item-subtitle>

                <template v-slot:append>
                  <div class="d-flex">
                    <!-- Botón Ver detalles - Siempre visible si tiene acceso -->
                    <v-tooltip text="Ver detalles" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon="mdi-eye-outline"
                          variant="text"
                          color="primary"
                          :to="`/proyecto/${item.id}/detalle`"
                        ></v-btn>
                      </template>
                    </v-tooltip>

                    <!-- Botón Editar - Solo si tiene permisos -->
                    <v-tooltip v-if="puedeEditarProyecto(item.id)" text="Editar" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon="mdi-pencil"
                          variant="text"
                          color="warning"
                          :to="`/proyecto/${item.id}/editar`"
                        ></v-btn>
                      </template>
                    </v-tooltip>

                    <!-- Botón Eliminar - Solo admin -->
                    <v-tooltip v-if="puedeEliminarProyecto(item.id)" text="Eliminar" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon="mdi-delete"
                          variant="text"
                          color="error"
                          @click="confirmDelete(item)"
                        ></v-btn>
                      </template>
                    </v-tooltip>

                    <!-- Botones funcionales - Solo si tiene permisos de edición -->
                    <template v-if="puedeEditarProyecto(item.id)">
                      <v-tooltip text="Marco Lógico" location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            v-bind="props"
                            icon="mdi-sitemap"
                            variant="text"
                            color="secondary"
                            :to="`/proyecto/${item.id}/marco-logico`"
                          ></v-btn>
                        </template>
                      </v-tooltip>

                      <v-tooltip text="Estructura" location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            v-bind="props"
                            icon="mdi-file-cog"
                            variant="text"
                            color="secondary"
                            :to="`/proyecto/${item.id}/estructura`"
                          ></v-btn>
                        </template>
                      </v-tooltip>

                      <v-tooltip text="Cargar documentos" location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            v-bind="props"
                            icon="mdi-upload"
                            variant="text"
                            color="teal"
                            @click="openUploadDialog(item)"
                          ></v-btn>
                        </template>
                      </v-tooltip>
                    </template>

                    <v-tooltip text="Vista rápida" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon="mdi-chevron-down"
                          variant="text"
                          color="info"
                          @click="toggleExpanded(item.id)"
                          :class="{ 'rotate-180': expandedProyectoId === item.id }"
                        ></v-btn>
                      </template>
                    </v-tooltip>
                  </div>
                </template>
              </v-list-item>

              <!-- Tarjeta de detalles desplegable con Tabs -->
              <v-expand-transition>
                <div v-if="expandedProyectoId === item.id">
                  <v-card elevation="0" class="ml-10 mr-4 mb-4 bg-grey-lighten-4">
                    <v-tabs v-model="activeTab" color="primary" grow>
                      <v-tab value="datos">
                        <v-icon left>mdi-information</v-icon>
                        Datos
                      </v-tab>
                      <v-tab value="objetivos">
                        <v-icon left>mdi-target</v-icon>
                        Objetivos
                      </v-tab>
                      <v-tab value="resultados">
                        <v-icon left>mdi-check-all</v-icon>
                        Resultados
                      </v-tab>
                      <v-tab value="productos">
                        <v-icon left>mdi-package-variant</v-icon>
                        Productos
                      </v-tab>
                      <v-tab value="indicadores">
                        <v-icon left>mdi-chart-bar</v-icon>
                        Indicadores
                      </v-tab>
                      <v-tab v-if="!esAdmin" value="permisos">
                        <v-icon left>mdi-shield-account</v-icon>
                        Mis Permisos
                      </v-tab>
                    </v-tabs>

                    <v-card-text class="pt-4">
                      <v-window v-model="activeTab">
                        <!-- Tab Datos del Proyecto -->
                        <v-window-item value="datos">
                          <v-row>
                            <v-col cols="12" md="6">
                              <p><strong>Descripción:</strong> {{ item.descripcion }}</p>
                              <p><strong>Estado:</strong> {{ getEstadoTexto(item.estado) }}</p>
                              <p><strong>Código:</strong> {{ item.codigo }}</p>
                              <p>
                                <strong>Instancia gestora:</strong> {{ item.instancia_gestora }}
                              </p>
                            </v-col>
                            <v-col cols="12" md="6">
                              <p>
                                <strong>Fecha de creación:</strong>
                                {{ formatDate(item.fecha_creacion) }}
                              </p>
                              <p><strong>Creado por:</strong> {{ item.creado_por }}</p>
                              <p v-if="item.fecha_inicio">
                                <strong>Fecha inicio:</strong> {{ formatDate(item.fecha_inicio) }}
                              </p>
                              <p v-if="item.fecha_finalizacion">
                                <strong>Fecha finalización:</strong>
                                {{ formatDate(item.fecha_finalizacion) }}
                              </p>
                            </v-col>
                          </v-row>
                        </v-window-item>

                        <!-- Tab Permisos (solo para usuarios normales) -->
                        <v-window-item v-if="!esAdmin" value="permisos">
                          <v-alert
                            :type="getNivelAccesoAlertType(item.nivel_acceso)"
                            variant="tonal"
                          >
                            <div class="d-flex align-center">
                              <v-icon class="mr-2">{{
                                getNivelAccesoIcon(item.nivel_acceso)
                              }}</v-icon>
                              <div>
                                <strong>Nivel de acceso: {{ item.nivel_acceso_display }}</strong>
                                <div class="text-caption mt-1">
                                  {{ getDescripcionPermisos(item.nivel_acceso) }}
                                </div>
                              </div>
                            </div>
                          </v-alert>

                          <v-list class="mt-3">
                            <v-list-item>
                              <template v-slot:prepend>
                                <v-icon :color="item.nivel_acceso >= 1 ? 'success' : 'grey'">
                                  mdi-eye
                                </v-icon>
                              </template>
                              <v-list-item-title>Ver información del proyecto</v-list-item-title>
                            </v-list-item>

                            <v-list-item>
                              <template v-slot:prepend>
                                <v-icon :color="item.nivel_acceso >= 2 ? 'success' : 'grey'">
                                  mdi-pencil
                                </v-icon>
                              </template>
                              <v-list-item-title>Editar información</v-list-item-title>
                            </v-list-item>

                            <v-list-item>
                              <template v-slot:prepend>
                                <v-icon :color="item.nivel_acceso >= 3 ? 'success' : 'grey'">
                                  mdi-cog
                                </v-icon>
                              </template>
                              <v-list-item-title>Administrar proyecto</v-list-item-title>
                            </v-list-item>
                          </v-list>
                        </v-window-item>

                        <!-- Resto de tabs -->
                        <v-window-item value="objetivos">
                          <v-alert type="info" variant="tonal">
                            Información de objetivos disponible en la vista completa
                          </v-alert>
                        </v-window-item>

                        <v-window-item value="resultados">
                          <v-alert type="info" variant="tonal">
                            Información de resultados disponible en la vista completa
                          </v-alert>
                        </v-window-item>

                        <v-window-item value="productos">
                          <v-alert type="info" variant="tonal">
                            Información de productos disponible en la vista completa
                          </v-alert>
                        </v-window-item>

                        <v-window-item value="indicadores">
                          <v-alert type="info" variant="tonal">
                            Información de indicadores disponible en la vista completa
                          </v-alert>
                        </v-window-item>
                      </v-window>

                      <div class="d-flex justify-end mt-4">
                        <v-btn
                          color="primary"
                          variant="text"
                          size="small"
                          :to="`/proyecto/${item.id}/detalle`"
                        >
                          Ver detalles completos
                        </v-btn>
                      </div>
                    </v-card-text>
                  </v-card>
                </div>
              </v-expand-transition>
            </template>

            <v-list-item v-if="filteredProyectos.length === 0 && !loading">
              <v-list-item-title class="text-grey">No se encontraron proyectos</v-list-item-title>
            </v-list-item>
          </v-list>

          <!-- Paginación -->
          <v-pagination
            v-if="totalPages > 1"
            v-model="currentPage"
            :length="totalPages"
            :total-visible="7"
            class="mt-4"
          ></v-pagination>

          <div
            v-if="filteredProyectos.length > 0"
            class="d-flex align-center justify-space-between mt-2"
          >
            <span class="text-caption text-grey">
              Mostrando {{ startItem }}-{{ endItem }} de {{ filteredProyectos.length }}
            </span>
            <v-select
              v-model="itemsPerPage"
              :items="[5, 10, 20, 50]"
              label="Items por página"
              density="compact"
              style="max-width: 150px"
              variant="outlined"
            ></v-select>
          </div>
        </v-card>
      </v-col>

      <!-- Columna lateral -->
      <v-col cols="12" md="3" lg="3">
        <!-- Tarjeta de acciones -->
        <v-card class="mb-4" elevation="2">
          <v-card-title class="primary white--text">
            <v-icon left>mdi-cog</v-icon>
            Acciones
          </v-card-title>

          <v-list density="comfortable">
            <v-list-item
              v-if="puedeCrearProyecto"
              @click="dialogNuevoProyecto = true"
              title="Nuevo Proyecto"
              prepend-icon="mdi-plus-circle"
              class="text-primary"
            ></v-list-item>

            <v-list-item
              title="Exportar lista"
              prepend-icon="mdi-file-export"
              @click="exportToExcel"
            ></v-list-item>

            <!-- Botón para recargar datos de prueba -->
            <v-list-item
              v-if="modoPrueba"
              title="Recargar datos prueba"
              prepend-icon="mdi-refresh"
              @click="cargarDatosPrueba"
            ></v-list-item>
          </v-list>
        </v-card>

        <!-- Tarjeta de estadísticas -->
        <v-card elevation="2">
          <v-card-title class="primary white--text">
            <v-icon left>mdi-chart-box</v-icon>
            Estadísticas
          </v-card-title>

          <v-list density="comfortable">
            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="primary">mdi-file-document-multiple</v-icon>
              </template>
              <v-list-item-title>Total proyectos</v-list-item-title>
              <v-list-item-subtitle class="text-right">{{
                filteredProyectos.length
              }}</v-list-item-subtitle>
            </v-list-item>

            <!-- Estadísticas de niveles de acceso (solo para usuarios normales) -->
            <template v-if="!esAdmin">
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="blue">mdi-eye</v-icon>
                </template>
                <v-list-item-title>Con acceso de lectura</v-list-item-title>
                <v-list-item-subtitle class="text-right">
                  {{ countByNivelAcceso(1) }}
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="green">mdi-pencil</v-icon>
                </template>
                <v-list-item-title>Con acceso de edición</v-list-item-title>
                <v-list-item-subtitle class="text-right">
                  {{ countByNivelAcceso(2) }}
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="red">mdi-cog</v-icon>
                </template>
                <v-list-item-title>Con acceso de administración</v-list-item-title>
                <v-list-item-subtitle class="text-right">
                  {{ countByNivelAcceso(3) }}
                </v-list-item-subtitle>
              </v-list-item>
            </template>

            <!-- Resto de estadísticas de estado -->
            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="warning">mdi-cog-box</v-icon>
              </template>
              <v-list-item-title>En Estructuración</v-list-item-title>
              <v-list-item-subtitle class="text-right">
                {{ countByStatus('ES') }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="success">mdi-play-circle</v-icon>
              </template>
              <v-list-item-title>En ejecucion</v-list-item-title>
              <v-list-item-subtitle class="text-right">
                {{ countByStatus('EJ') }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="info">mdi-check-circle</v-icon>
              </template>
              <v-list-item-title>Completados</v-list-item-title>
              <v-list-item-subtitle class="text-right">
                {{ countByStatus('CO') }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="error">mdi-pause-octagon</v-icon>
              </template>
              <v-list-item-title>Suspendido</v-list-item-title>
              <v-list-item-subtitle class="text-right">
                {{ countByStatus('SU') }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <!-- Diálogo de confirmación -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5">Confirmar eliminación</v-card-title>
        <v-card-text>
          ¿Estás seguro de que deseas eliminar el PROYECTO: "{{ proyectoToDelete?.titulo }}", con
          CODIGO:"{{ proyectoToDelete?.codigo }}"?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" @click="deleteProyecto">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo de carga de documentos -->
    <v-dialog v-model="uploadDialog" max-width="600">
      <v-card>
        <v-card-title class="text-h5">
          <v-icon left>mdi-upload</v-icon>
          Cargar documentos
        </v-card-title>
        <v-card-subtitle> Proyecto: {{ proyectoSeleccionado?.titulo }} </v-card-subtitle>

        <v-card-text>
          <v-file-input
            v-model="filesToUpload"
            multiple
            label="Seleccionar archivos"
            prepend-icon="mdi-paperclip"
            variant="outlined"
            :rules="fileRules"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
          ></v-file-input>

          <v-alert v-if="uploadError" type="error" variant="tonal" class="mt-3">
            {{ uploadError }}
          </v-alert>

          <v-progress-linear
            v-if="uploadProgress > 0 && uploadProgress < 100"
            :model-value="uploadProgress"
            height="20"
            color="light-blue"
            class="mt-3"
          >
            <template v-slot:default="{ value }">
              <strong>{{ Math.ceil(value) }}%</strong>
            </template>
          </v-progress-linear>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="closeUploadDialog">Cancelar</v-btn>
          <v-btn
            color="primary"
            @click="uploadFiles"
            :disabled="!filesToUpload || filesToUpload.length === 0"
          >
            Subir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo de nuevo proyecto -->
    <div class="text-center pa-4">
      <v-dialog v-model="dialogNuevoProyecto" max-width="800" persistent>
        <v-card>
          <v-toolbar color="primary" title="Nuevo Proyecto"></v-toolbar>

          <v-card-text>
            <v-form ref="form" v-model="formValid" @submit.prevent="openConfirmation">
              <v-container>
                <!-- Primera fila: Código y Título -->
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="proyecto.codigo"
                      label="Código *"
                      :rules="codigoRules"
                      counter="20"
                      required
                      variant="outlined"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12">
                    <v-text-field
                      v-model="proyecto.titulo"
                      label="Título *"
                      :rules="tituloRules"
                      counter="200"
                      required
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <!-- Descripción -->
                <v-row>
                  <v-col cols="12">
                    <v-textarea
                      v-model="proyecto.descripcion"
                      label="Descripción"
                      rows="3"
                      variant="outlined"
                    ></v-textarea>
                  </v-col>
                </v-row>

                <!-- Segunda fila: PEI e Instancia Gestora -->
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      variant="outlined"
                      v-model="peiVigente.titulo"
                      label="Pertenece a"
                      readonly
                    >
                    </v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-select
                      variant="outlined"
                      v-model="proyecto.instancia_gestora"
                      label="Instancia gestora*"
                      :items="instancias"
                      item-title="instancia"
                      item-value="id"
                      multiple
                      chips
                      :return-object="false"
                      :rules="instanciaGestoraRules"
                    ></v-select>
                  </v-col>
                </v-row>

                <!-- Tercera fila: Creado por -->
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="proyecto.creado_por"
                      label="Creado por"
                      counter="150"
                      variant="outlined"
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-number-input
                      :reverse="false"
                      v-model="proyecto.presupuesto"
                      controlVariant="default"
                      label="Presupuesto"
                      :hideInput="false"
                      :inset="false"
                      variant="outlined"
                      :precision="2"
                    ></v-number-input>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-select
                      variant="outlined"
                      v-model="proyecto.procedencia_fondos"
                      label="Procedencia de Fondos*"
                      :items="opcionesEntidadFinanciera"
                      item-title="financiera"
                      item-value="id"
                      multiple
                      chips
                      :return-object="false"
                      :rules="procedenciaFondosRules"
                    ></v-select>
                  </v-col>
                </v-row>

                <v-divider class="my-4"></v-divider>

                <!-- Cuarta fila: Fechas -->
                <v-row>
                  <v-col cols="12" md="4">
                    <v-text-field
                      label="Fecha de creación"
                      v-model="proyecto.fecha_creacion"
                      type="date"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-text-field
                      label="Fecha de inicio"
                      v-model="proyecto.fecha_inicio"
                      type="date"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-text-field
                      label="Fecha de finalización"
                      v-model="proyecto.fecha_finalizacion"
                      type="date"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" variant="text" @click="closeDialog"> Cancelar </v-btn>
            <v-btn
              color="success"
              variant="elevated"
              :disabled="!formValid"
              @click="openConfirmation"
            >
              Guardar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <!-- Diálogo de confirmación -->
    <v-dialog v-model="confirmDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5">Confirmar creación</v-card-title>
        <v-card-text> ¿Está seguro que desea crear este proyecto? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" variant="text" @click="confirmDialog = false"> No </v-btn>
          <v-btn color="primary" variant="elevated" @click="submitProyecto"> Sí, crear </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Mensaje de confirmacion -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.text }}

      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false"> Cerrar </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed, reactive, inject } from 'vue'
import { useRouter } from 'vue-router'
import { formatDate, getStatusColor, getEstadoTexto } from '@/utility/formatters'

// Stores - NUEVOS IMPORTS
import { useUserStore } from '@/stores/user'
import { useProjectsAccessStore } from '@/modules/proyecto/store/useProjectsAccessStore'

// Servicios y composables existentes
import { useProyectoStore } from '@/modules/proyecto/store/proyectoStore'
import { proyectoServicios } from '@/modules/proyecto/services/proyectoService'
import { useInstanciaGestora } from '@/modules/instanciaGestora/composables/useInstanciaGestora'
import { useProcedenciaFondos } from '@/modules/proyecto/composables/useProcedenciaFondos'

// Stores - INICIALIZACIÓN
const userStore = useUserStore()
const projectsAccessStore = useProjectsAccessStore()
const proyectoStore = useProyectoStore()

// Enrutador
const router = useRouter()

// MODO PRUEBA - NUEVO ESTADO
const modoPrueba = ref(true)
const esAdmin = ref(true) // Por defecto en modo admin para probar

// Computed properties para permisos - MODIFICADOS para modo prueba
const puedeCrearProyecto = computed(() => projectsAccessStore.puedeCrearProyecto)
const proyectosAccesiblesCount = computed(() => projectsAccessStore.proyectos.length)

// Métodos de verificación de permisos - MODIFICADOS para modo prueba
const puedeEditarProyecto = (proyectoId) => {
  if (esAdmin.value) return true
  return projectsAccessStore.puedeEditarProyecto(proyectoId)
}

const puedeEliminarProyecto = (proyectoId) => {
  if (esAdmin.value) return true
  return projectsAccessStore.puedeEliminarProyecto(proyectoId)
}

// Estados existentes
const loading = ref(false)
const error = ref(null)
const deleteDialog = ref(false)
const proyectoToDelete = ref(null)
const expandedProyectoId = ref(null)
const searchQuery = ref('')
const activeTab = ref('datos')
const emptyResponse = ref(false)

// Paginación
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Nuevos estados para filtros
const statusFilters = ref([])
const nivelAccesoFilters = ref([])
const availableStatuses = [
  { text: 'En Estructuración', value: 'ES' },
  { text: 'En Planificacion', value: 'EP' },
  { text: 'En Ejecución', value: 'EJ' },
  { text: 'Completado', value: 'CO' },
  { text: 'Suspendido', value: 'SU' },
]

// Computed properties modificados
const proyectos = computed(() => projectsAccessStore.proyectos)

const filteredProyectos = computed(() => {
  if (emptyResponse.value) return []

  let filtered = proyectos.value

  // Filtro por búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (proyecto) =>
        proyecto.codigo?.toLowerCase().includes(query) ||
        proyecto.titulo?.toLowerCase().includes(query),
    )
  }

  // Filtro por estado
  if (statusFilters.value.length > 0) {
    filtered = filtered.filter((proyecto) => statusFilters.value.includes(proyecto.estado))
  }

  // Filtro por nivel de acceso (solo para usuarios normales)
  if (!esAdmin.value && nivelAccesoFilters.value.length > 0) {
    filtered = filtered.filter((proyecto) =>
      nivelAccesoFilters.value.includes(proyecto.nivel_acceso?.toString()),
    )
  }

  return filtered
})

// Paginación
const proyectosPaginados = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredProyectos.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredProyectos.value.length / itemsPerPage.value))
const startItem = computed(() => (currentPage.value - 1) * itemsPerPage.value + 1)
const endItem = computed(() => {
  const end = currentPage.value * itemsPerPage.value
  return end > filteredProyectos.value.length ? filteredProyectos.value.length : end
})

// ========== DATOS DE PRUEBA ==========
const datosPruebaAdmin = [
  {
    id: 1,
    codigo: 'PROY-2024-001',
    titulo: 'Sistema de Gestión Documental',
    descripcion: 'Implementación de sistema integral para gestión documental de la organización',
    estado: 'ES',
    instancia_gestora: 'Dirección de Tecnología',
    creado_por: 'admin@empresa.com',
    fecha_creacion: '2024-01-15',
    fecha_inicio: '2024-02-01',
    fecha_finalizacion: '2024-12-31',
    nivel_acceso: 3,
    nivel_acceso_display: 'Administración',
  },
  {
    id: 2,
    codigo: 'PROY-2024-002',
    titulo: 'Modernización Infraestructura TI',
    descripcion: 'Actualización de servidores y equipos de cómputo para mejorar rendimiento',
    estado: 'EJ',
    instancia_gestora: 'Dirección de Tecnología',
    creado_por: 'admin@empresa.com',
    fecha_creacion: '2024-01-10',
    fecha_inicio: '2024-01-20',
    fecha_finalizacion: '2024-06-30',
    nivel_acceso: 3,
    nivel_acceso_display: 'Administración',
  },
  {
    id: 3,
    codigo: 'PROY-2024-003',
    titulo: 'Capacitación Personal Nuevo',
    descripcion: 'Programa de inducción y capacitación para nuevo personal contratado',
    estado: 'EP',
    instancia_gestora: 'Recursos Humanos',
    creado_por: 'admin@empresa.com',
    fecha_creacion: '2024-02-01',
    fecha_inicio: null,
    fecha_finalizacion: '2024-03-15',
    nivel_acceso: 3,
    nivel_acceso_display: 'Administración',
  },
  {
    id: 4,
    codigo: 'PROY-2023-045',
    titulo: 'Auditoría Interna Anual',
    descripcion: 'Proceso de auditoría interna para verificación de cumplimiento normativo',
    estado: 'CO',
    instancia_gestora: 'Auditoría Interna',
    creado_por: 'admin@empresa.com',
    fecha_creacion: '2023-11-01',
    fecha_inicio: '2023-11-15',
    fecha_finalizacion: '2023-12-20',
    nivel_acceso: 3,
    nivel_acceso_display: 'Administración',
  },
  {
    id: 5,
    codigo: 'PROY-2024-004',
    titulo: 'Expansión Oficina Regional',
    descripcion: 'Apertura y equipamiento de nueva oficina en región norte',
    estado: 'SU',
    instancia_gestora: 'Dirección Administrativa',
    creado_por: 'admin@empresa.com',
    fecha_creacion: '2024-01-20',
    fecha_inicio: null,
    fecha_finalizacion: null,
    nivel_acceso: 3,
    nivel_acceso_display: 'Administración',
  },
]

const datosPruebaUsuario = [
  {
    id: 1,
    codigo: 'PROY-2024-001',
    titulo: 'Sistema de Gestión Documental',
    descripcion: 'Implementación de sistema integral para gestión documental de la organización',
    estado: 'ES',
    instancia_gestora: 'Dirección de Tecnología',
    creado_por: 'admin@empresa.com',
    fecha_creacion: '2024-01-15',
    fecha_inicio: '2024-02-01',
    fecha_finalizacion: '2024-12-31',
    nivel_acceso: 1,
    nivel_acceso_display: 'Solo lectura',
  },
  {
    id: 2,
    codigo: 'PROY-2024-002',
    titulo: 'Modernización Infraestructura TI',
    descripcion: 'Actualización de servidores y equipos de cómputo para mejorar rendimiento',
    estado: 'EJ',
    instancia_gestora: 'Dirección de Tecnología',
    creado_por: 'admin@empresa.com',
    fecha_creacion: '2024-01-10',
    fecha_inicio: '2024-01-20',
    fecha_finalizacion: '2024-06-30',
    nivel_acceso: 2,
    nivel_acceso_display: 'Edición',
  },
  {
    id: 6,
    codigo: 'PROY-2024-006',
    titulo: 'Desarrollo App Móvil Clientes',
    descripcion: 'Creación de aplicación móvil para interacción con clientes',
    estado: 'ES',
    instancia_gestora: 'Desarrollo de Software',
    creado_por: 'lider.proyectos@empresa.com',
    fecha_creacion: '2024-02-05',
    fecha_inicio: null,
    fecha_finalizacion: '2024-08-30',
    nivel_acceso: 3,
    nivel_acceso_display: 'Administración',
  },
  {
    id: 7,
    codigo: 'PROY-2024-007',
    titulo: 'Análisis Mercado Internacional',
    descripcion: 'Estudio de viabilidad para expansión a mercados internacionales',
    estado: 'EP',
    instancia_gestora: 'Planificación Estratégica',
    creado_por: 'analista@empresa.com',
    fecha_creacion: '2024-02-10',
    fecha_inicio: null,
    fecha_finalizacion: '2024-04-30',
    nivel_acceso: 1,
    nivel_acceso_display: 'Solo lectura',
  },
]

// Métodos para modo prueba
const cargarDatosPrueba = () => {
  loading.value = true
  setTimeout(() => {
    if (esAdmin.value) {
      projectsAccessStore.proyectos = [...datosPruebaAdmin]
    } else {
      projectsAccessStore.proyectos = [...datosPruebaUsuario]
    }
    emptyResponse.value = projectsAccessStore.proyectos.length === 0
    loading.value = false

    snackbar.value = {
      show: true,
      text: `Datos de prueba cargados (${esAdmin.value ? 'Admin' : 'Usuario'})`,
      color: 'success',
    }
  }, 1000)
}

const cambiarModoPrueba = () => {
  esAdmin.value = !esAdmin.value
  cargarDatosPrueba()
}

// Rutina de carga de proyectos MODIFICADA para usar datos de prueba
const cargarProyectos = async () => {
  try {
    loading.value = true
    error.value = null
    emptyResponse.value = false

    if (modoPrueba.value) {
      // Usar datos de prueba
      await cargarDatosPrueba()
    } else {
      // Usar el store real (comentado para pruebas)
      // await projectsAccessStore.cargarProyectosConAcceso()

      // Cargar datos adicionales
      cargarInstancias()
      fetchOptions()

      if (projectsAccessStore.proyectos.length === 0) {
        emptyResponse.value = true
      }
    }
  } catch (err) {
    error.value =
      'Error al cargar los proyectos: ' + (err.message || 'Intente nuevamente más tarde')
    console.error('Error al cargar los proyectos', err)
  } finally {
    loading.value = false
  }
}

// Nuevos métodos helper
const getNivelAccesoColor = (nivel) => {
  const colores = { 1: 'blue', 2: 'green', 3: 'red' }
  return `${colores[nivel]}-lighten-4` || 'grey-lighten-4'
}

const getNivelAccesoIcon = (nivel) => {
  const iconos = { 1: 'mdi-eye', 2: 'mdi-pencil', 3: 'mdi-cog' }
  return iconos[nivel] || 'mdi-eye-off'
}

const getNivelAccesoAlertType = (nivel) => {
  const tipos = { 1: 'info', 2: 'warning', 3: 'success' }
  return tipos[nivel] || 'info'
}

const getDescripcionPermisos = (nivel) => {
  const descripciones = {
    1: 'Puedes ver la información del proyecto pero no modificarla',
    2: 'Puedes editar la información del proyecto y cargar documentos',
    3: 'Tienes control completo sobre el proyecto, incluyendo la gestión de permisos',
  }
  return descripciones[nivel] || 'Sin acceso al proyecto'
}

const countByNivelAcceso = (nivel) => {
  return filteredProyectos.value.filter((p) => p.nivel_acceso === nivel).length
}

// Contador por estado (se mantiene)
const countByStatus = (status) => {
  return filteredProyectos.value.filter((p) => p.estado === status).length
}

// Resto de métodos se mantienen igual
const confirmDelete = (proyecto) => {
  proyectoToDelete.value = proyecto
  deleteDialog.value = true
}

const deleteProyecto = async () => {
  try {
    loading.value = true
    // En modo prueba, solo simulamos la eliminación
    if (modoPrueba.value) {
      projectsAccessStore.proyectos = projectsAccessStore.proyectos.filter(
        (p) => p.id !== proyectoToDelete.value.id,
      )
      snackbar.value = {
        show: true,
        text: 'Proyecto eliminado exitosamente (modo prueba)',
        color: 'success',
      }
    } else {
      await proyectoServicios.eliminar(proyectoToDelete.value.id)
      snackbar.value = {
        show: true,
        text: 'Proyecto eliminado exitosamente',
        color: 'success',
      }
      await cargarProyectos()
    }
  } catch (err) {
    error.value =
      'Error al eliminar el proyecto: ' + (err.message || 'Intente nuevamente más tarde')
    console.error('Error al eliminar proyecto', err)
    snackbar.value = {
      show: true,
      text: err.response?.data?.message || 'Error al eliminar el proyecto',
      color: 'error',
    }
  } finally {
    loading.value = false
    deleteDialog.value = false
  }
}

const exportToExcel = () => {
  snackbar.value = {
    show: true,
    text: 'Exportación a Excel simulada (modo prueba)',
    color: 'info',
  }
}

const toggleExpanded = (id) => {
  expandedProyectoId.value = expandedProyectoId.value === id ? null : id
}

// Estados para upload de documentos
const uploadDialog = ref(false)
const proyectoSeleccionado = ref(null)
const filesToUpload = ref([])
const uploadProgress = ref(0)
const uploadError = ref(null)

// Reglas de validación de archivos
const fileRules = [
  (value) => {
    if (!value || value.length === 0) return true
    const maxSize = 10 * 1024 * 1024 // 10MB
    for (const file of value) {
      if (file.size > maxSize) {
        return 'El tamaño máximo por archivo es 10MB'
      }
    }
    return true
  },
]

// Métodos para upload
const openUploadDialog = (proyecto) => {
  proyectoSeleccionado.value = proyecto
  uploadDialog.value = true
  filesToUpload.value = []
  uploadProgress.value = 0
  uploadError.value = null
}

const closeUploadDialog = () => {
  uploadDialog.value = false
  filesToUpload.value = []
  uploadProgress.value = 0
  uploadError.value = null
}

const uploadFiles = async () => {
  if (!filesToUpload.value || filesToUpload.value.length === 0) return

  try {
    uploadError.value = null
    uploadProgress.value = 0

    // Simulamos el progreso de carga
    const interval = setInterval(() => {
      uploadProgress.value += 10
      if (uploadProgress.value >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          closeUploadDialog()
          snackbar.value = {
            show: true,
            text: 'Documentos subidos exitosamente (modo prueba)',
            color: 'success',
          }
        }, 500)
      }
    }, 300)
  } catch (error) {
    uploadError.value = 'Error al subir los documentos: ' + (error.message || 'Intente nuevamente')
    console.error('Error al subir documentos', error)
  }
}

// Estados para creación de proyectos
const dialogNuevoProyecto = ref(false)
const confirmDialog = ref(false)
const form = ref(null)
const formValid = ref(false)

// Datos mock para PEI
const peiVigente = ref({
  id: 1,
  titulo: 'Plan Estratégico Institucional 2024-2028',
})

// Datos del proyecto
const proyecto = reactive({
  codigo: '',
  titulo: '',
  descripcion: '',
  pei: peiVigente.value.id,
  estado: 'ES',
  instancia_gestora: [],
  creado_por: 'usuario@empresa.com',
  fecha_inicio: null,
  fecha_finalizacion: null,
  presupuesto: null,
  procedencia_fondos: [],
})

// Datos mock para composables
const instancias = ref([
  { id: 1, instancia: 'Dirección de Tecnología' },
  { id: 2, instancia: 'Recursos Humanos' },
  { id: 3, instancia: 'Auditoría Interna' },
  { id: 4, instancia: 'Dirección Administrativa' },
  { id: 5, instancia: 'Desarrollo de Software' },
  { id: 6, instancia: 'Planificación Estratégica' },
])

const opcionesEntidadFinanciera = ref([
  { id: 1, financiera: 'Fondo Nacional de Desarrollo' },
  { id: 2, financiera: 'Banco Interamericano de Desarrollo' },
  { id: 3, financiera: 'Presupuesto Interno' },
  { id: 4, financiera: 'Cooperación Internacional' },
])

// Mock de funciones de composables
const cargarInstancias = () => {
  console.log('Cargando instancias gestoras...')
}

const fetchOptions = () => {
  console.log('Cargando opciones de financiamiento...')
}

// Snackbar
const snackbar = ref({
  show: false,
  text: '',
  color: 'success',
})

// Reglas de validación
const codigoRules = [
  (v) => !!v || 'El código es requerido',
  (v) => (v && v.length <= 20) || 'Máximo 20 caracteres',
  (v) => /^[A-Z0-9-]+$/.test(v) || 'Solo mayúsculas, números y guiones',
]

const tituloRules = [
  (v) => !!v || 'El título es requerido',
  (v) => (v && v.length <= 200) || 'Máximo 200 caracteres',
  (v) => /^[\w\sáéíóúÁÉÍÓÚñÑ.,;:¿?¡!()-]+$/.test(v) || 'Caracteres no válidos',
]

const instanciaGestoraRules = [
  (v) => !!v || 'La instancia gestora es requerida',
  (v) => (v && v.length > 0) || 'Debe seleccionar al menos una instancia gestora',
  (v) => (v && v.length <= 5) || 'Máximo 5 instancias gestoras',
]

const procedenciaFondosRules = [
  (v) => !!v || 'La procedencia de fondos es requerida',
  (v) => (v && v.length > 0) || 'Debe seleccionar al menos una fuente de financiamiento',
  (v) => (v && v.length <= 3) || 'Máximo 3 fuentes de financiamiento',
]

// Métodos para creación de proyectos
const openConfirmation = async () => {
  const { valid } = await form.value.validate()
  if (valid) {
    confirmDialog.value = true
  }
}

const submitProyecto = async () => {
  try {
    // En modo prueba, simulamos la creación
    if (modoPrueba.value) {
      const nuevoProyecto = {
        id: Date.now(),
        ...proyecto,
        instancia_gestora:
          instancias.value.find((i) => i.id === proyecto.instancia_gestora[0])?.instancia ||
          'Sin asignar',
        fecha_creacion: new Date().toISOString().split('T')[0],
        nivel_acceso: esAdmin.value ? 3 : 1,
        nivel_acceso_display: esAdmin.value ? 'Administración' : 'Solo lectura',
      }

      projectsAccessStore.proyectos.unshift(nuevoProyecto)

      snackbar.value = {
        show: true,
        text: 'Proyecto creado exitosamente (modo prueba)',
        color: 'success',
      }

      setTimeout(() => {
        router.push(`/proyecto/${nuevoProyecto.id}/estructura/`)
      }, 1500)
    } else {
      // Código real para crear proyecto
      const response = await proyectoServicios.crear(proyecto)
      if (!response?.data?.id) {
        throw new Error('No se recibió un ID válido')
      }
      const proyectoID = response.data.id

      snackbar.value = {
        show: true,
        text: 'Proyecto creado exitosamente',
        color: 'success',
      }
      setTimeout(() => {
        router.push(`/proyecto/${proyectoID}/estructura/`)
      }, 1500)
    }

    confirmDialog.value = false
    dialogNuevoProyecto.value = false
    resetForm()
  } catch (error) {
    console.error('Error al crear proyecto:', error)
    snackbar.value = {
      show: true,
      text: error.response?.data?.message || 'Error al crear el proyecto',
      color: 'error',
    }
  }
}

const resetForm = () => {
  Object.assign(proyecto, {
    codigo: '',
    titulo: '',
    descripcion: '',
    pei: peiVigente.value.id,
    estado: 'ES',
    instancia_gestora: [],
    creado_por: 'usuario@empresa.com',
    fecha_inicio: null,
    fecha_finalizacion: null,
    presupuesto: null,
    procedencia_fondos: [],
  })
}

const closeDialog = () => {
  resetForm()
  dialogNuevoProyecto.value = false
}

// Ciclo de vida
onMounted(async () => {
  await cargarProyectos()
})
</script>

<style scoped>
.v-list-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.v-list-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.v-list-item:last-child {
  border-bottom: none;
}

.v-card-title {
  font-size: 1.25rem;
  font-weight: 500;
}

.text-right {
  text-align: right;
}

.v-pagination {
  justify-content: center;
}

.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}

.bg-grey-lighten-4 {
  background-color: #f5f5f5;
}

.v-tab {
  font-size: 0.75rem;
  min-width: 0;
}

/* Upload de files */
.v-file-input .v-input__details {
  display: none;
}

.v-file-input .v-input__control {
  min-height: 56px;
}
</style>
