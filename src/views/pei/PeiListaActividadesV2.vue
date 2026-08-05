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

    <!-- Mensaje cuando no hay actividades -->
    <v-card v-if="emptyResponse && !loading" class="mb-4">
      <v-card-text class="text-center py-8">
        <v-icon size="64" color="grey lighten-1">mdi-calendar-remove</v-icon>
        <h3 class="text-h5 mt-4">No hay actividades registradas</h3>
        <p class="text-grey mt-2">Parece que aún no has creado ninguna actividad</p>
        <v-btn color="primary" @click="dialogNuevaActividad = true" class="mt-4">
          <v-icon left>mdi-plus</v-icon>
          Crear primera actividad
        </v-btn>
      </v-card-text>
    </v-card>

    <v-row v-else>
      <!-- Columna principal -->
      <v-col cols="12" md="9" lg="9">
        <v-card class="pa-4" elevation="2">
          <v-card-title class="d-flex justify-space-between align-center">
            <span>Solicitudes de Actividades</span>
            <span class="text-caption text-grey">Total: {{ actividadesFiltradas.length }}</span>
          </v-card-title>

          <!-- Buscador y filtros -->
          <v-card-text class="pt-0 pb-4">
            <v-text-field
              v-model="searchQuery"
              label="Buscar por código o nombre corto"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              clearable
              density="comfortable"
              @input="currentPage = 1"
            ></v-text-field>

            <div class="d-flex flex-wrap gap-2 mt-2 align-center">
              <!-- Selector de vista -->
              <v-btn-group density="comfortable" class="mr-4">
                <v-btn
                  :variant="vistaActual === 'lista' ? 'tonal' : 'outlined'"
                  size="small"
                  @click="vistaActual = 'lista'"
                >
                  <v-icon left size="small">mdi-format-list-bulleted</v-icon>
                  Lista
                </v-btn>
                <v-btn
                  :variant="vistaActual === 'proyecto' ? 'tonal' : 'outlined'"
                  size="small"
                  @click="vistaActual = 'proyecto'"
                >
                  <v-icon left size="small">mdi-folder-outline</v-icon>
                  Proyecto
                </v-btn>
                <v-btn
                  :variant="vistaActual === 'responsable' ? 'tonal' : 'outlined'"
                  size="small"
                  @click="vistaActual = 'responsable'"
                >
                  <v-icon left size="small">mdi-account-outline</v-icon>
                  Responsable
                </v-btn>
              </v-btn-group>

              <!-- Filtros por estado -->
              <v-chip-group v-model="statusFilters" multiple column>
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
            </div>
          </v-card-text>
          <v-divider class="my-4"></v-divider>

          <!-- VISTA: LISTA -->
          <v-list v-if="!loading && vistaActual === 'lista'" class="py-0">
            <template
              v-for="(actividad, index) in actividadesPaginadasOrdenadas"
              :key="`actividad-${actividad.id}-${index}`"
            >
              <v-list-item :value="actividad.id" @click="toggleExpanded(actividad.id)" class="mb-2">
                <template v-slot:prepend>
                  <v-avatar :color="getStatusColor(actividad.estado)" size="40" class="mr-3">
                    <v-icon dark size="20">{{ getTipoIcon(actividad.estado) }}</v-icon>
                  </v-avatar>
                </template>

                <v-list-item-title class="font-weight-bold">
                  {{ actividad.codigo }}
                </v-list-item-title>
                <v-list-item-subtitle class="mt-1">
                  <div class="text-body-2 font-weight-medium">{{ actividad.nombre_corto }}</div>
                  <div class="d-flex align-center flex-wrap mt-1">
                    <v-chip
                      size="x-small"
                      :color="getStatusColor(actividad.estado)"
                      text-color="white"
                      class="mr-2"
                    >
                      {{ getEstadoTexto(actividad.estado) }}
                    </v-chip>
                    <span class="text-caption mr-2">
                      Presupuesto: {{ formatCurrency(actividad.presupuesto) }}
                    </span>
                    <span class="text-caption">
                      Fondos: {{ getProcedenciaTexto(actividad.procedencia_fondos) }}
                    </span>
                  </div>
                  <div class="text-caption mt-1" v-if="actividad.fecha_programada">
                    <strong>Programada:</strong> {{ formatDate(actividad.fecha_programada) }}
                    <span v-if="actividad.duracion">({{ actividad.duracion }} días)</span>
                  </div>
                </v-list-item-subtitle>

                <!-- BOTONERAS DE ACTIVIDAD -->
                <template v-slot:append>
                  <BotoneraSolicitudes
                    :actividad-id="actividad.id"
                    :tipo="'actividad'"
                    :badges="getBadgesActividad(actividad.id)"
                    @crear-fondos="navegarFormulario('formulario01', actividad.id)"
                    @validar-fondos="abrirDialogValidar(actividad.id, null)"
                    @crear-viaje="navegarFormulario('formulario05', actividad.id)"
                    @validar-viaje="abrirDialogViajeValidar(actividad.id, null)"
                    @crear-pago-directo="navegarFormulario('formulario08', actividad.id)"
                    @validar-pago-directo="abrirDialogPagoDirectoValidar(actividad.id, null)"
                    @crear-reposicion="navegarFormulario('formulario03', actividad.id)"
                    @validar-reposicion="abrirDialogReposicionValidar(actividad.id, null)"
                  />
                </template>
              </v-list-item>

              <!-- Tarjeta de detalles desplegable (TAREAS) -->
              <v-expand-transition>
                <div v-if="expandedActividadId === actividad.id">
                  <v-card elevation="0" class="ml-10 mr-4 mb-4 bg-grey-lighten-4">
                    <v-card-text class="pt-4">
                      <div class="d-flex justify-space-between align-center mb-4">
                        <span class="text-subtitle-1">
                          Sub Actividades ({{ actividad.tareas?.length || 0 }})
                        </span>
                        <v-btn
                          color="primary"
                          variant="text"
                          size="small"
                          @click="openTareaDialog(actividad.id)"
                        >
                          <v-icon left size="small">mdi-plus</v-icon>
                          Añadir Sub Actividad
                        </v-btn>
                      </div>
                      <v-list density="compact" class="py-0">
                        <v-list-item
                          v-for="tarea in actividad.tareas"
                          :key="`tarea-${actividad.id}-${tarea.id}`"
                          class="mb-1"
                        >
                          <template v-slot:prepend>
                            <v-icon :color="getStatusColorTarea(tarea.estado)" size="small">
                              mdi-checkbox-blank-circle
                            </v-icon>
                          </template>
                          <v-list-item-title class="text-body-2">
                            {{ tarea.titulo || tarea.descripcion || 'Tarea sin título' }}
                          </v-list-item-title>

                          <!-- BOTONERAS DE TAREA (IDÉNTICAS A ACTIVIDAD) -->
                          <template v-slot:append>
                            <BotoneraSolicitudes
                              :actividad-id="actividad.id"
                              :tarea-id="tarea.id"
                              :tipo="'tarea'"
                              :badges="getBadgesTarea(actividad.id, tarea.id)"
                              @crear-fondos="
                                navegarFormulario('formulario01', actividad.id, tarea.id)
                              "
                              @validar-fondos="abrirDialogValidar(actividad.id, tarea.id)"
                              @crear-viaje="
                                navegarFormulario('formulario05', actividad.id, tarea.id)
                              "
                              @validar-viaje="abrirDialogViajeValidar(actividad.id, tarea.id)"
                              @crear-pago-directo="
                                navegarFormulario('formulario08', actividad.id, tarea.id)
                              "
                              @validar-pago-directo="
                                abrirDialogPagoDirectoValidar(actividad.id, tarea.id)
                              "
                              @crear-reposicion="
                                navegarFormulario('formulario03', actividad.id, tarea.id)
                              "
                              @validar-reposicion="
                                abrirDialogReposicionValidar(actividad.id, tarea.id)
                              "
                            />
                          </template>
                        </v-list-item>
                        <v-list-item v-if="!actividad.tareas || actividad.tareas.length === 0">
                          <v-list-item-title class="text-grey text-caption">
                            No hay Sub Actividades
                          </v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-card-text>
                  </v-card>
                </div>
              </v-expand-transition>
            </template>

            <v-list-item v-if="actividadesFiltradas.length === 0 && !loading">
              <v-list-item-title class="text-grey">No se encontraron actividades</v-list-item-title>
            </v-list-item>
          </v-list>

          <!-- VISTA: PROYECTO (placeholder) -->
          <div v-if="vistaActual === 'proyecto'" class="pa-4 text-center text-grey">
            <v-icon size="48" class="mb-2">mdi-folder-outline</v-icon>
            <p>Vista agrupada por Proyecto (en desarrollo)</p>
          </div>

          <!-- VISTA: RESPONSABLE (placeholder) -->
          <div v-if="vistaActual === 'responsable'" class="pa-4 text-center text-grey">
            <v-icon size="48" class="mb-2">mdi-account-outline</v-icon>
            <p>Vista agrupada por Responsable (en desarrollo)</p>
          </div>

          <!-- Paginación -->
          <v-pagination
            v-if="totalPages > 1 && vistaActual === 'lista'"
            v-model="currentPage"
            :length="totalPages"
            :total-visible="7"
            class="mt-4"
          ></v-pagination>

          <div
            v-if="actividadesFiltradas.length > 0 && vistaActual === 'lista'"
            class="d-flex align-center justify-space-between mt-2"
          >
            <span class="text-caption text-grey">
              Mostrando {{ startItem }}-{{ endItem }} de {{ actividadesFiltradas.length }}
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

      <!-- Columna lateral - Estadísticas -->
      <v-col cols="12" md="3" lg="3">
        <v-card elevation="2">
          <v-card-title class="bg-primary text-white py-3">
            <v-icon left class="mr-2">mdi-chart-box</v-icon>
            Estadísticas
          </v-card-title>

          <v-list density="comfortable" class="py-0">
            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="primary">mdi-calendar-check</v-icon>
              </template>
              <v-list-item-title>Total actividades</v-list-item-title>
              <v-list-item-subtitle class="text-right font-weight-bold">
                {{ actividadesFiltradas.length }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="light-blue">mdi-calendar-edit</v-icon>
              </template>
              <v-list-item-title>Planificación</v-list-item-title>
              <v-list-item-subtitle class="text-right">
                {{ countByStatus('PLAN') }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="yellow">mdi-calendar-refresh</v-icon>
              </template>
              <v-list-item-title>Reprogramación</v-list-item-title>
              <v-list-item-subtitle class="text-right">
                {{ countByStatus('REPROG') }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="orange">mdi-progress-clock</v-icon>
              </template>
              <v-list-item-title>En Ejecución</v-list-item-title>
              <v-list-item-subtitle class="text-right">
                {{ countByStatus('EJEC') }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="green">mdi-check-circle</v-icon>
              </template>
              <v-list-item-title>Finalizado</v-list-item-title>
              <v-list-item-subtitle class="text-right">
                {{ countByStatus('FIN') }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="primary">mdi-cash-multiple</v-icon>
              </template>
              <v-list-item-title>Presupuesto Total</v-list-item-title>
              <v-list-item-subtitle class="text-right font-weight-bold">
                {{ formatCurrency(presupuestoTotal) }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="deep-purple">mdi-file-document-edit</v-icon>
              </template>
              <v-list-item-title>Solicitudes Pendientes</v-list-item-title>
              <v-list-item-subtitle class="text-right">
                {{ solicitudesPendientesTotal }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="success">mdi-check-all</v-icon>
              </template>
              <v-list-item-title>Validaciones Pendientes</v-list-item-title>
              <v-list-item-subtitle class="text-right">
                {{ validacionesPendientesTotal }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <!-- DIÁLOGOS DE VALIDACIÓN -->

    <!-- Validar Fondos -->
    <DialogValidarSolicitud
      v-model="dialogValidarFondos"
      titulo="Validar Solicitud de Fondos"
      subtitulo="Seleccione una solicitud de fondos para validar"
      icono="mdi-cash-plus"
      color="primary"
      mensaje-vacio="No tienes solicitudes de fondos pendientes de validación"
      :actividad-id="dialogActividadId"
      :tarea-id="dialogTareaId"
      tipo-solicitud="fondos"
      ruta-formulario="/monitoreo/formulario011"
    />

    <!-- Validar Viaje -->
    <DialogValidarSolicitud
      v-model="dialogValidarViaje"
      titulo="Validar Solicitud de Viaje"
      subtitulo="Seleccione una solicitud de viaje para validar"
      icono="mdi-bag-suitcase"
      color="deep-purple"
      mensaje-vacio="No tienes solicitudes de viaje pendientes de validación"
      :actividad-id="dialogActividadId"
      :tarea-id="dialogTareaId"
      tipo-solicitud="viajes"
      ruta-formulario="/monitoreo/formulario055"
    />

    <!-- Validar Pago Directo -->
    <DialogValidarSolicitud
      v-model="dialogValidarPagoDirecto"
      titulo="Validar Solicitud de Pago Directo"
      subtitulo="Seleccione una solicitud de pago directo para validar"
      icono="mdi-credit-card-check"
      color="teal-lighten-2"
      mensaje-vacio="No tienes solicitudes de pago directo pendientes de validación"
      :actividad-id="dialogActividadId"
      :tarea-id="dialogTareaId"
      tipo-solicitud="pagos-directos"
      ruta-formulario="/monitoreo/formulario088"
    />

    <!-- Validar Reposición -->
    <DialogValidarSolicitud
      v-model="dialogValidarReposicion"
      titulo="Validar Solicitud de Reposición"
      subtitulo="Seleccione una solicitud de reposición para validar"
      icono="mdi-cash-refund"
      color="warning"
      mensaje-vacio="No tienes solicitudes de reposición pendientes de validación"
      :actividad-id="dialogActividadId"
      :tarea-id="dialogTareaId"
      tipo-solicitud="reposiciones"
      ruta-formulario="/monitoreo/formulario033"
    />

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">Cerrar</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import BotoneraSolicitudes from './BotoneraSolicitudes.vue'
import DialogValidarSolicitud from './DialogValidarSolicitud.vue'

const router = useRouter()

// ─── DATOS DE PRUEBA ───
const actividadesMock = [
  {
    id: 1,
    codigo: 'ACT-001',
    nombre_corto: 'Construcción Aula Norte',
    descripcion: 'Construcción de aula escolar en la zona norte del municipio',
    estado: 'PLAN',
    presupuesto: 50000.0,
    procedencia_fondos: 'PROY',
    fecha_programada: '2024-03-15',
    duracion: 30,
    fecha_inicio: null,
    fecha_cierre: null,
    responsable: { id: 10, nombre: 'Juan Pérez' },
    proyecto: { id: 1, nombre: 'Proyecto Norte' },
    tareas: [
      { id: 101, titulo: 'Excavación del terreno', descripcion: 'Preparar base', estado: 'PEN' },
      { id: 102, titulo: 'Cimentación', descripcion: 'Vertido de concreto', estado: 'EPROG' },
      { id: 103, titulo: 'Levantamiento de muros', descripcion: '', estado: 'PEN' },
      { id: 104, titulo: 'Instalación eléctrica', descripcion: '', estado: 'COMPL' },
      { id: 105, titulo: 'Acabados', descripcion: 'Pintura y detalles finales', estado: 'PEN' },
    ],
  },
  {
    id: 2,
    codigo: 'ACT-002',
    nombre_corto: 'Reparación de Techos',
    descripcion: 'Reparación de techos en escuelas rurales',
    estado: 'EJEC',
    presupuesto: 15000.0,
    procedencia_fondos: 'PRESP',
    fecha_programada: '2024-02-01',
    duracion: 45,
    fecha_inicio: '2024-03-01',
    fecha_cierre: null,
    responsable: { id: 11, nombre: 'María García' },
    proyecto: { id: 1, nombre: 'Proyecto Norte' },
    tareas: [
      { id: 201, titulo: 'Inspección de techos', descripcion: '', estado: 'COMPL' },
      { id: 202, titulo: 'Reemplazo de láminas', descripcion: '', estado: 'EPROG' },
    ],
  },
  {
    id: 3,
    codigo: 'ACT-003',
    nombre_corto: 'Capacitación Docente',
    descripcion: 'Programa de capacitación para docentes',
    estado: 'FIN',
    presupuesto: 8000.0,
    procedencia_fondos: 'PROY',
    fecha_programada: '2024-01-10',
    duracion: 5,
    fecha_inicio: '2024-01-10',
    fecha_cierre: '2024-01-15',
    responsable: { id: 10, nombre: 'Juan Pérez' },
    proyecto: { id: 2, nombre: 'Proyecto Sur' },
    tareas: [],
  },
  {
    id: 4,
    codigo: 'ACT-004',
    nombre_corto: 'Sistema de Agua Potable',
    descripcion: 'Instalación de sistema de agua potable',
    estado: 'EJEC',
    presupuesto: 120000.0,
    procedencia_fondos: 'PROY',
    fecha_programada: '2024-04-01',
    duracion: 90,
    fecha_inicio: '2024-04-15',
    fecha_cierre: null,
    responsable: { id: 12, nombre: 'Carlos López' },
    proyecto: { id: 1, nombre: 'Proyecto Norte' },
    tareas: [
      { id: 401, titulo: 'Estudio de suelo', descripcion: '', estado: 'COMPL' },
      { id: 402, titulo: 'Excavación de zanjas', descripcion: '', estado: 'COMPL' },
      { id: 403, titulo: 'Tendido de tuberías', descripcion: '', estado: 'EPROG' },
    ],
  },
  {
    id: 5,
    codigo: 'ACT-005',
    nombre_corto: 'Cerco Perimetral Escuela',
    descripcion: 'Construcción de cerco perimetral',
    estado: 'FIN',
    presupuesto: 35000.0,
    procedencia_fondos: 'PRESP',
    fecha_programada: '2023-11-01',
    duracion: 60,
    fecha_inicio: '2023-11-05',
    fecha_cierre: '2024-01-05',
    responsable: { id: 11, nombre: 'María García' },
    proyecto: { id: 2, nombre: 'Proyecto Sur' },
    tareas: [
      { id: 501, titulo: 'Replanteo', descripcion: '', estado: 'COMPL' },
      { id: 502, titulo: 'Cimentación', descripcion: '', estado: 'COMPL' },
      { id: 503, titulo: 'Muros', descripcion: '', estado: 'COMPL' },
    ],
  },
  {
    id: 6,
    codigo: 'ACT-006',
    nombre_corto: 'Remodelación Aula Sur',
    descripcion: 'Remodelación completa de aula en zona sur',
    estado: 'REPROG',
    presupuesto: 25000.0,
    procedencia_fondos: 'PROY',
    fecha_programada: '2024-05-01',
    duracion: 45,
    fecha_inicio: null,
    fecha_cierre: null,
    responsable: { id: 12, nombre: 'Carlos López' },
    proyecto: { id: 2, nombre: 'Proyecto Sur' },
    tareas: [{ id: 601, titulo: 'Demolición', descripcion: '', estado: 'PEN' }],
  },
]

// Badges de prueba para actividades
const badgesMock = {
  1: {
    fondos: { creadas: 3, aprobadas: 3, pendientes: 0 },
    viajes: { creadas: 1, aprobadas: 1, pendientes: 0 },
    pagosDirectos: { creadas: 0, aprobadas: 0, pendientes: 0 },
    reposiciones: { creadas: 2, aprobadas: 1, pendientes: 1 },
  },
  2: {
    fondos: { creadas: 1, aprobadas: 1, pendientes: 0 },
    viajes: { creadas: 0, aprobadas: 0, pendientes: 0 },
    pagosDirectos: { creadas: 0, aprobadas: 0, pendientes: 0 },
    reposiciones: { creadas: 0, aprobadas: 0, pendientes: 0 },
  },
  3: {
    fondos: { creadas: 4, aprobadas: 4, pendientes: 0 },
    viajes: { creadas: 0, aprobadas: 0, pendientes: 0 },
    pagosDirectos: { creadas: 1, aprobadas: 1, pendientes: 0 },
    reposiciones: { creadas: 0, aprobadas: 0, pendientes: 0 },
  },
  4: {
    fondos: { creadas: 2, aprobadas: 1, pendientes: 1 },
    viajes: { creadas: 1, aprobadas: 0, pendientes: 1 },
    pagosDirectos: { creadas: 0, aprobadas: 0, pendientes: 0 },
    reposiciones: { creadas: 1, aprobadas: 1, pendientes: 0 },
  },
  5: {
    fondos: { creadas: 2, aprobadas: 2, pendientes: 0 },
    viajes: { creadas: 0, aprobadas: 0, pendientes: 0 },
    pagosDirectos: { creadas: 0, aprobadas: 0, pendientes: 0 },
    reposiciones: { creadas: 1, aprobadas: 1, pendientes: 0 },
  },
  6: {
    fondos: { creadas: 0, aprobadas: 0, pendientes: 0 },
    viajes: { creadas: 0, aprobadas: 0, pendientes: 0 },
    pagosDirectos: { creadas: 0, aprobadas: 0, pendientes: 0 },
    reposiciones: { creadas: 0, aprobadas: 0, pendientes: 0 },
  },
}

// Badges de prueba para tareas
const badgesTareasMock = {
  '1-101': {
    fondos: { creadas: 1, aprobadas: 1, pendientes: 0 },
    viajes: { creadas: 0, aprobadas: 0, pendientes: 0 },
    pagosDirectos: { creadas: 0, aprobadas: 0, pendientes: 0 },
    reposiciones: { creadas: 0, aprobadas: 0, pendientes: 0 },
  },
  '1-102': {
    fondos: { creadas: 2, aprobadas: 1, pendientes: 1 },
    viajes: { creadas: 0, aprobadas: 0, pendientes: 0 },
    pagosDirectos: { creadas: 0, aprobadas: 0, pendientes: 0 },
    reposiciones: { creadas: 1, aprobadas: 1, pendientes: 0 },
  },
  '1-103': {
    fondos: { creadas: 0, aprobadas: 0, pendientes: 0 },
    viajes: { creadas: 0, aprobadas: 0, pendientes: 0 },
    pagosDirectos: { creadas: 0, aprobadas: 0, pendientes: 0 },
    reposiciones: { creadas: 0, aprobadas: 0, pendientes: 0 },
  },
  '1-104': {
    fondos: { creadas: 0, aprobadas: 0, pendientes: 0 },
    viajes: { creadas: 1, aprobadas: 1, pendientes: 0 },
    pagosDirectos: { creadas: 0, aprobadas: 0, pendientes: 0 },
    reposiciones: { creadas: 1, aprobadas: 1, pendientes: 0 },
  },
  '1-105': {
    fondos: { creadas: 0, aprobadas: 0, pendientes: 0 },
    viajes: { creadas: 0, aprobadas: 0, pendientes: 0 },
    pagosDirectos: { creadas: 0, aprobadas: 0, pendientes: 0 },
    reposiciones: { creadas: 0, aprobadas: 0, pendientes: 0 },
  },
  '4-401': {
    fondos: { creadas: 1, aprobadas: 1, pendientes: 0 },
    viajes: { creadas: 0, aprobadas: 0, pendientes: 0 },
    pagosDirectos: { creadas: 0, aprobadas: 0, pendientes: 0 },
    reposiciones: { creadas: 0, aprobadas: 0, pendientes: 0 },
  },
  '4-402': {
    fondos: { creadas: 0, aprobadas: 0, pendientes: 0 },
    viajes: { creadas: 1, aprobadas: 0, pendientes: 1 },
    pagosDirectos: { creadas: 0, aprobadas: 0, pendientes: 0 },
    reposiciones: { creadas: 0, aprobadas: 0, pendientes: 0 },
  },
  '4-403': {
    fondos: { creadas: 1, aprobadas: 0, pendientes: 1 },
    viajes: { creadas: 0, aprobadas: 0, pendientes: 0 },
    pagosDirectos: { creadas: 0, aprobadas: 0, pendientes: 0 },
    reposiciones: { creadas: 0, aprobadas: 0, pendientes: 0 },
  },
}

// ─── ESTADOS REACTIVOS ───
const loading = ref(false)
const emptyResponse = ref(false)
const searchQuery = ref('')
const statusFilters = ref([])
const expandedActividadId = ref(null)
const vistaActual = ref('lista')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const snackbar = ref({ show: false, text: '', color: 'success' })
const dialogNuevaActividad = ref(false)

// Estados de diálogos de validación
const dialogValidarFondos = ref(false)
const dialogValidarViaje = ref(false)
const dialogValidarPagoDirecto = ref(false)
const dialogValidarReposicion = ref(false)
const dialogActividadId = ref(null)
const dialogTareaId = ref(null)

const actividades = ref(actividadesMock)

// ─── CONFIGURACIONES ───
const availableStatuses = [
  { value: 'PLAN', text: 'Planificación' },
  { value: 'RETR', text: 'Retraso' },
  { value: 'REPROG', text: 'Reprogramación' },
  { value: 'EJEC', text: 'En Ejecución' },
  { value: 'REP', text: 'En Reporte' },
  { value: 'FIN', text: 'Finalizado' },
]

const procedenciaFondos = [
  { value: 'PROY', text: 'Proyecto' },
  { value: 'PRESP', text: 'Presupuesto' },
  { value: 'NODEF', text: 'No Definido' },
]

// ─── FUNCIONES DE BADGES ───
const getBadgesActividad = (actividadId) => {
  return (
    badgesMock[actividadId] || {
      fondos: { creadas: 0, aprobadas: 0, pendientes: 0 },
      viajes: { creadas: 0, aprobadas: 0, pendientes: 0 },
      pagosDirectos: { creadas: 0, aprobadas: 0, pendientes: 0 },
      reposiciones: { creadas: 0, aprobadas: 0, pendientes: 0 },
    }
  )
}

const getBadgesTarea = (actividadId, tareaId) => {
  const key = `${actividadId}-${tareaId}`
  return (
    badgesTareasMock[key] || {
      fondos: { creadas: 0, aprobadas: 0, pendientes: 0 },
      viajes: { creadas: 0, aprobadas: 0, pendientes: 0 },
      pagosDirectos: { creadas: 0, aprobadas: 0, pendientes: 0 },
      reposiciones: { creadas: 0, aprobadas: 0, pendientes: 0 },
    }
  )
}

// ─── NAVEGACIÓN ───
const navegarFormulario = (formulario, actividadId, tareaId = null) => {
  let path = `/monitoreo/${formulario}/${actividadId}`
  if (tareaId) path += `?tarea_id=${tareaId}`
  router.push(path)
}

// ─── APERTURA DE DIÁLOGOS ───
const abrirDialogValidar = (actividadId, tareaId) => {
  dialogActividadId.value = actividadId
  dialogTareaId.value = tareaId
  dialogValidarFondos.value = true
}

const abrirDialogViajeValidar = (actividadId, tareaId) => {
  dialogActividadId.value = actividadId
  dialogTareaId.value = tareaId
  dialogValidarViaje.value = true
}

const abrirDialogPagoDirectoValidar = (actividadId, tareaId) => {
  dialogActividadId.value = actividadId
  dialogTareaId.value = tareaId
  dialogValidarPagoDirecto.value = true
}

const abrirDialogReposicionValidar = (actividadId, tareaId) => {
  dialogActividadId.value = actividadId
  dialogTareaId.value = tareaId
  dialogValidarReposicion.value = true
}

// ─── COMPUTADAS ───
const actividadesFiltradas = computed(() => {
  let filtered = [...actividades.value]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (a) =>
        (a.codigo && a.codigo.toLowerCase().includes(query)) ||
        (a.nombre_corto && a.nombre_corto.toLowerCase().includes(query)),
    )
  }

  if (statusFilters.value.length > 0) {
    filtered = filtered.filter((a) => statusFilters.value.includes(a.estado))
  }

  return filtered
})

const actividadesPaginadas = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return actividadesFiltradas.value.slice(start, end)
})

const actividadesPaginadasOrdenadas = computed(() => {
  return [...actividadesPaginadas.value].sort((a, b) => b.id - a.id)
})

const totalPages = computed(() => Math.ceil(actividadesFiltradas.value.length / itemsPerPage.value))
const startItem = computed(() => (currentPage.value - 1) * itemsPerPage.value + 1)
const endItem = computed(() => {
  const end = currentPage.value * itemsPerPage.value
  return end > actividadesFiltradas.value.length ? actividadesFiltradas.value.length : end
})

const presupuestoTotal = computed(() =>
  actividadesFiltradas.value.reduce((sum, a) => sum + (Number(a.presupuesto) || 0), 0),
)

const solicitudesPendientesTotal = computed(() => {
  let total = 0
  actividadesFiltradas.value.forEach((a) => {
    const badge = badgesMock[a.id]
    if (badge) {
      Object.values(badge).forEach((tipo) => {
        total += tipo.pendientes || 0
      })
    }
  })
  return total
})

const validacionesPendientesTotal = computed(() => solicitudesPendientesTotal.value)

// ─── FUNCIONES AUXILIARES ───
const getStatusColor = (status) => {
  const colors = {
    PLAN: 'light-blue',
    RETR: 'red',
    REPROG: 'yellow',
    EJEC: 'orange',
    REP: 'light-green',
    FIN: 'green',
  }
  return colors[status] || 'grey'
}

const getStatusColorTarea = (status) => {
  const colors = { PEN: 'grey', EPROG: 'warning', COMPL: 'success' }
  return colors[status] || 'grey'
}

const getEstadoTexto = (status) => {
  const found = availableStatuses.find((s) => s.value === status)
  return found ? found.text : 'Desconocido'
}

const getTipoIcon = (status) => {
  const icons = {
    PLAN: 'mdi-calendar-check-outline',
    RETR: 'mdi-calendar-alert',
    REPROG: 'mdi-calendar-refresh',
    EJEC: 'mdi-calendar-arrow-right',
    REP: 'mdi-calendar-edit',
    FIN: 'mdi-calendar-check',
  }
  return icons[status] || 'mdi-help-circle'
}

const getProcedenciaTexto = (procedencia) => {
  const found = procedenciaFondos.find((p) => p.value === procedencia)
  return found ? found.text : 'Desconocido'
}

const formatCurrency = (value) => {
  const num = Number(value)
  return !isNaN(num) ? `Bs. ${num.toFixed(2)}` : 'N/A'
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('es-ES')
}

const countByStatus = (status) =>
  actividadesFiltradas.value.filter((a) => a.estado === status).length

const toggleExpanded = (id) => {
  expandedActividadId.value = expandedActividadId.value === id ? null : id
}

const openTareaDialog = (actividadId, tarea = null) => {
  console.log('Abrir diálogo tarea:', { actividadId, tarea })
}
</script>
