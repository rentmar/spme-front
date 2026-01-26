<template>
  <div>
    <v-container class="marco-logico-container">
      <!-- Overlay de carga -->
      <v-overlay
        :model-value="loading"
        class="align-center justify-center"
        persistent
        opacity="0.8"
      >
        <div class="text-center">
          <v-progress-circular
            indeterminate
            color="primary"
            size="64"
            width="6"
          ></v-progress-circular>
          <p class="mt-4 text-h6">Cargando información del proyecto...</p>
        </div>
      </v-overlay>

      <!-- CONTENIDO PRINCIPAL -->
      <template v-if="!loading && proyectoFonFosc">
        <PaginaTituloIcono :titulo="'PROYECTO FONFOSC'" :icon="'mdi-file-chart'" />

        <!-- Header del Proyecto -->
        <v-card variant="outlined" class="mb-6">
          <v-card-title class="bg-primary text-white">
            <v-icon left>mdi-file-tree</v-icon>
            MARCO LÓGICO DEL PROYECTO
            <v-chip color="white" size="small" class="ml-3">
              {{ proyectoFonFosc.proyecto.codigo }}
            </v-chip>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="8">
                <h3 class="text-h6 mb-2">{{ proyectoFonFosc.proyecto.titulo }}</h3>
                <p class="text-body-2 text-grey mb-3">
                  <strong>Categoría:</strong> {{ proyectoFonFosc.proyecto.categoria }}
                </p>
                <p class="text-body-2 text-grey">
                  <strong>Institución:</strong>
                  {{ proyectoFonFosc.proyecto.institucion.nombre }} ({{
                    proyectoFonFosc.proyecto.institucion.sigla
                  }})
                </p>
              </v-col>
              <v-col cols="12" md="4">
                <div class="d-flex flex-column align-end">
                  <v-chip :color="getEstadoColor(proyectoFonFosc.proyecto.estado)" size="small">
                    {{ proyectoFonFosc.proyecto.estado }}
                  </v-chip>
                  <p class="text-caption mt-2">
                    <strong>Vigencia:</strong> {{ proyectoFonFosc.proyecto.fechas.inicio }} -
                    {{ proyectoFonFosc.proyecto.fechas.finalizacion }}
                  </p>
                  <p class="text-caption">
                    <strong>Responsable:</strong>
                    {{ proyectoFonFosc.proyecto.responsable.nombre_completo }}
                  </p>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Nivel 1: OBJETIVO DEL PROYECTO -->
        <v-card variant="outlined" class="mb-6">
          <v-toolbar color="deep-purple" density="compact">
            <v-toolbar-title class="text-white">
              <v-icon left>mdi-target</v-icon>
              OBJETIVO DEL PROYECTO
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn
              color="white"
              variant="tonal"
              @click="abrirModalNuevoIndicadorObjetivo"
              prepend-icon="mdi-plus"
              size="small"
            >
              Nuevo Indicador
            </v-btn>
          </v-toolbar>

          <v-card-text>
            <v-table class="marco-logico-table nivel-1">
              <thead>
                <tr>
                  <th width="35%">OBJETIVO</th>
                  <th width="40%">INDICADORES DE OBJETIVO</th>
                  <th width="25%">MEDIOS DE VERIFICACIÓN</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <!-- Columna 1: Objetivo -->
                  <td class="objetivo-cell">
                    <div class="d-flex align-center mb-2">
                      <v-chip size="small" color="deep-purple" class="mr-2">
                        {{ proyectoFonFosc.proyecto.objetivo.codigo }}
                      </v-chip>
                      <span class="text-caption text-grey"
                        >ID: {{ proyectoFonFosc.proyecto.objetivo.id }}</span
                      >
                    </div>

                    <div class="objetivo-descripcion mb-3">
                      <strong>{{ proyectoFonFosc.proyecto.objetivo.redaccion }}</strong>
                    </div>

                    <div class="supuestos-riesgos">
                      <v-expansion-panels variant="accordion">
                        <v-expansion-panel>
                          <v-expansion-panel-title>
                            <v-icon left size="small">mdi-alert-circle</v-icon>
                            Supuestos y Riesgos
                          </v-expansion-panel-title>
                          <v-expansion-panel-text>
                            {{ proyectoFonFosc.proyecto.objetivo.supuestosRiesgos }}
                          </v-expansion-panel-text>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </div>
                  </td>

                  <!-- Columna 2: Indicadores de Objetivo -->
                  <td class="indicadores-cell">
                    <div class="mb-2">
                      <v-chip size="x-small" color="info" variant="outlined" class="mb-1">
                        {{ proyectoFonFosc.proyecto.objetivo.indicadores_objetivo?.length || 0 }}
                        indicadores
                      </v-chip>
                    </div>

                    <template v-if="proyectoFonFosc.proyecto.objetivo.indicadores_objetivo?.length">
                      <div class="indicadores-container">
                        <v-list lines="two" class="pa-0">
                          <template
                            v-for="(indicador, indIndex) in proyectoFonFosc.proyecto.objetivo
                              .indicadores_objetivo"
                            :key="indicador.id"
                          >
                            <v-list-item class="mb-2 indicador-item indicador-objetivo">
                              <template v-slot:prepend>
                                <v-chip size="small" color="deep-purple" class="mr-2">
                                  {{ indicador.codigo }}
                                </v-chip>
                              </template>

                              <v-list-item-title class="font-weight-bold text-body-2">
                                <div class="texto-contenedor">
                                  <span class="texto-truncado">
                                    {{ truncarTexto(indicador.descripcion, 60) }}
                                  </span>
                                  <v-tooltip location="top">
                                    <template v-slot:activator="{ props }">
                                      <v-btn
                                        v-bind="props"
                                        icon
                                        size="x-small"
                                        variant="text"
                                        color="primary"
                                        @click.stop="verDetalleIndicadorObjetivo(indicador)"
                                        class="ml-1"
                                      >
                                        <v-icon size="small">mdi-eye</v-icon>
                                      </v-btn>
                                    </template>
                                    <span>Ver detalles completos</span>
                                  </v-tooltip>
                                </div>
                              </v-list-item-title>

                              <v-list-item-subtitle class="text-caption">
                                <div>
                                  <v-icon size="x-small">mdi-chart-bar</v-icon>
                                  <span class="text-grey ml-1">{{
                                    getTipoIndicadorTexto(indicador.tipo)
                                  }}</span>
                                </div>
                                <div v-if="indicador.frecuencia">
                                  <v-icon size="x-small">mdi-calendar</v-icon>
                                  {{ indicador.frecuencia }}
                                </div>
                              </v-list-item-subtitle>

                              <template v-slot:append>
                                <div class="d-flex">
                                  <v-btn
                                    icon
                                    size="x-small"
                                    color="primary"
                                    @click.stop="editarIndicadorObjetivo(indicador)"
                                    variant="text"
                                    class="mr-1"
                                  >
                                    <v-icon>mdi-pencil</v-icon>
                                  </v-btn>
                                  <v-btn
                                    icon
                                    size="x-small"
                                    color="error"
                                    @click.stop="confirmarEliminarIndicadorObjetivo(indicador)"
                                    :loading="cargandoEliminacionIndicador"
                                    variant="text"
                                  >
                                    <v-icon>mdi-delete</v-icon>
                                  </v-btn>
                                </div>
                              </template>
                            </v-list-item>
                            <v-divider
                              v-if="
                                indIndex <
                                proyectoFonFosc.proyecto.objetivo.indicadores_objetivo.length - 1
                              "
                              :key="`div-${indicador.id}`"
                            ></v-divider>
                          </template>
                        </v-list>
                      </div>
                    </template>
                    <template v-else>
                      <div class="text-center py-4 text-grey">
                        <v-icon size="small">mdi-chart-line-off</v-icon>
                        <p class="text-caption mt-1">No hay indicadores</p>
                      </div>
                    </template>
                  </td>

                  <!-- Columna 3: Medios de Verificación -->
                  <td class="medios-cell">
                    <div class="text-center py-4 text-grey">
                      <v-icon size="small">mdi-file-document-outline</v-icon>
                      <p class="text-caption mt-1">Por definir</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>

        <!-- Nivel 2: RESULTADOS -->
        <v-card variant="outlined" class="mb-6">
          <v-toolbar color="green" density="compact">
            <v-toolbar-title class="text-white">
              <v-icon left>mdi-flag-checkered</v-icon>
              RESULTADOS
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn
              color="white"
              variant="tonal"
              @click="abrirModalNuevoResultado"
              prepend-icon="mdi-plus"
              size="small"
            >
              Nuevo Resultado
            </v-btn>
          </v-toolbar>

          <v-card-text>
            <v-table class="marco-logico-table nivel-2">
              <thead>
                <tr>
                  <th width="35%">RESULTADOS</th>
                  <th width="40%">INDICADORES DE RESULTADO</th>
                  <th width="25%">MEDIOS DE VERIFICACIÓN</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="proyectoFonFosc.proyecto.objetivo.resultados?.length">
                  <tr
                    v-for="resultado in proyectoFonFosc.proyecto.objetivo.resultados"
                    :key="`resultado-${resultado.id}`"
                    class="resultado-row"
                  >
                    <!-- Columna 1: Resultado -->
                    <td class="resultado-cell">
                      <div class="d-flex align-center mb-2">
                        <v-chip size="small" color="green" class="mr-2">
                          {{ resultado.codigo }}
                        </v-chip>
                        <span class="text-caption text-grey">ID: {{ resultado.id }}</span>
                      </div>

                      <div class="resultado-descripcion mb-3">
                        <strong>{{ resultado.descripcion }}</strong>
                      </div>

                      <div class="supuestos-riesgos">
                        <v-expansion-panels variant="accordion">
                          <v-expansion-panel>
                            <v-expansion-panel-title>
                              <v-icon left size="small">mdi-alert-circle</v-icon>
                              Supuestos y Riesgos
                            </v-expansion-panel-title>
                            <v-expansion-panel-text>
                              {{ resultado.supuestosRiesgos }}
                            </v-expansion-panel-text>
                          </v-expansion-panel>
                        </v-expansion-panels>
                      </div>

                      <div class="d-flex mt-3">
                        <v-btn
                          icon
                          size="small"
                          color="primary"
                          @click.stop="editarResultado(resultado)"
                          :loading="cargandoEdicion"
                          variant="tonal"
                          class="mr-1"
                        >
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn
                          icon
                          size="small"
                          color="error"
                          @click.stop="solicitarEliminarResultado(resultado)"
                          :loading="cargandoEliminacion"
                          variant="tonal"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                        <v-btn
                          size="small"
                          color="green"
                          variant="tonal"
                          @click.stop="abrirModalNuevoIndicadorResultado(resultado.id)"
                          prepend-icon="mdi-plus"
                          class="ml-2"
                        >
                          Indicador
                        </v-btn>
                      </div>
                    </td>

                    <!-- Columna 2: Indicadores de Resultado -->
                    <td class="indicadores-cell">
                      <div class="mb-2">
                        <v-chip size="x-small" color="info" variant="outlined" class="mb-1">
                          {{ resultado.indicadores_resultado?.length || 0 }} indicadores
                        </v-chip>
                      </div>

                      <template v-if="resultado.indicadores_resultado?.length">
                        <div class="indicadores-container">
                          <v-list lines="two" class="pa-0">
                            <template
                              v-for="(indicador, indIndex) in resultado.indicadores_resultado"
                              :key="indicador.id"
                            >
                              <v-list-item class="mb-2 indicador-item indicador-resultado">
                                <template v-slot:prepend>
                                  <v-chip size="small" color="green" class="mr-2">
                                    {{ indicador.codigo }}
                                  </v-chip>
                                </template>

                                <v-list-item-title class="font-weight-bold text-body-2">
                                  <div class="texto-contenedor">
                                    <span class="texto-truncado">
                                      {{ truncarTexto(indicador.descripcion, 60) }}
                                    </span>
                                    <v-tooltip location="top">
                                      <template v-slot:activator="{ props }">
                                        <v-btn
                                          v-bind="props"
                                          icon
                                          size="x-small"
                                          variant="text"
                                          color="primary"
                                          @click.stop="verDetalleIndicadorResultado(indicador)"
                                          class="ml-1"
                                        >
                                          <v-icon size="small">mdi-eye</v-icon>
                                        </v-btn>
                                      </template>
                                      <span>Ver detalles completos</span>
                                    </v-tooltip>
                                  </div>
                                </v-list-item-title>

                                <v-list-item-subtitle class="text-caption">
                                  <div>
                                    <v-icon size="x-small">mdi-chart-bar</v-icon>
                                    <span class="text-grey ml-1">{{
                                      getTipoIndicadorTexto(indicador.tipo)
                                    }}</span>
                                  </div>
                                  <div v-if="indicador.frecuencia">
                                    <v-icon size="x-small">mdi-calendar</v-icon>
                                    {{ indicador.frecuencia }}
                                  </div>
                                </v-list-item-subtitle>

                                <template v-slot:append>
                                  <div class="d-flex">
                                    <v-btn
                                      icon
                                      size="x-small"
                                      color="primary"
                                      @click.stop="
                                        editarIndicadorResultado(indicador, resultado.id)
                                      "
                                      variant="text"
                                      class="mr-1"
                                    >
                                      <v-icon>mdi-pencil</v-icon>
                                    </v-btn>
                                    <v-btn
                                      icon
                                      size="x-small"
                                      color="error"
                                      @click.stop="
                                        confirmarEliminarIndicadorResultado(indicador, resultado.id)
                                      "
                                      :loading="cargandoEliminacionIndicador"
                                      variant="text"
                                    >
                                      <v-icon>mdi-delete</v-icon>
                                    </v-btn>
                                  </div>
                                </template>
                              </v-list-item>
                              <v-divider
                                v-if="indIndex < resultado.indicadores_resultado.length - 1"
                                :key="`div-${indicador.id}`"
                              ></v-divider>
                            </template>
                          </v-list>
                        </div>
                      </template>
                      <template v-else>
                        <div class="text-center py-4 text-grey">
                          <v-icon size="small">mdi-chart-line-off</v-icon>
                          <p class="text-caption mt-1">No hay indicadores</p>
                        </div>
                      </template>

                      <div class="text-center mt-2">
                        <v-btn
                          size="x-small"
                          color="green"
                          variant="text"
                          @click.stop="abrirModalNuevoIndicadorResultado(resultado.id)"
                          :loading="cargandoAccion"
                          prepend-icon="mdi-plus"
                        >
                          Agregar indicador
                        </v-btn>
                      </div>
                    </td>

                    <!-- Columna 3: Medios de Verificación -->
                    <td class="medios-cell">
                      <div class="text-center py-4 text-grey">
                        <v-icon size="small">mdi-file-document-outline</v-icon>
                        <p class="text-caption mt-1">Por definir</p>
                      </div>

                      <!-- Datos de muestra para medios de verificación -->
                      <div class="mt-2">
                        <v-list lines="one" class="pa-0">
                          <v-list-item class="medios-item">
                            <template v-slot:prepend>
                              <v-icon color="blue" size="small">mdi-file-document</v-icon>
                            </template>
                            <v-list-item-title class="text-body-2">
                              Informes trimestrales
                            </v-list-item-title>
                          </v-list-item>
                          <v-divider></v-divider>
                          <v-list-item class="medios-item">
                            <template v-slot:prepend>
                              <v-icon color="blue" size="small">mdi-camera</v-icon>
                            </template>
                            <v-list-item-title class="text-body-2">
                              Fotografías de avance
                            </v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </div>
                    </td>
                  </tr>
                </template>
                <tr v-else>
                  <td colspan="3" class="text-center py-8 text-grey">
                    <v-icon size="large">mdi-flag-off</v-icon>
                    <p class="text-h6 mt-2">No hay resultados registrados</p>
                    <v-btn
                      color="green"
                      class="mt-4"
                      @click="abrirModalNuevoResultado"
                      prepend-icon="mdi-plus"
                    >
                      Crear primer resultado
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>

        <!-- Nivel 3: ACTIVIDADES -->
        <v-card variant="outlined">
          <v-toolbar color="orange" density="compact">
            <v-toolbar-title class="text-white">
              <v-icon left>mdi-checkbox-multiple-marked</v-icon>
              ACTIVIDADES
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn
              color="white"
              variant="tonal"
              @click="abrirModalNuevaActividad"
              prepend-icon="mdi-plus"
              size="small"
            >
              Nueva Actividad
            </v-btn>
          </v-toolbar>

          <v-card-text>
            <v-table class="marco-logico-table nivel-3">
              <thead>
                <tr>
                  <th width="35%">ACTIVIDADES</th>
                  <th width="40%">INDICADORES DE ACTIVIDAD</th>
                  <th width="25%">MEDIOS DE VERIFICACIÓN</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="actividades.length">
                  <tr
                    v-for="actividad in actividades"
                    :key="`actividad-${actividad.id}`"
                    class="actividad-row"
                  >
                    <!-- Columna 1: Actividad -->
                    <td class="actividad-cell">
                      <div class="d-flex align-center mb-2">
                        <v-chip size="small" color="orange" class="mr-2">
                          {{ actividad.codigo }}
                        </v-chip>
                        <span class="text-caption text-grey"
                          >Resultado: {{ actividad.resultado }}</span
                        >
                      </div>

                      <div class="actividad-descripcion mb-3">
                        <strong>{{ actividad.descripcion }}</strong>
                      </div>

                      <div class="actividad-info">
                        <div class="d-flex align-center mb-1">
                          <v-icon size="small" class="mr-1">mdi-calendar</v-icon>
                          <span class="text-caption"
                            >{{ actividad.fecha_inicio }} - {{ actividad.fecha_fin }}</span
                          >
                        </div>
                        <div class="d-flex align-center">
                          <v-icon size="small" class="mr-1">mdi-account</v-icon>
                          <span class="text-caption">Responsable: {{ actividad.responsable }}</span>
                        </div>
                      </div>

                      <div class="d-flex mt-3">
                        <v-btn
                          icon
                          size="small"
                          color="primary"
                          @click.stop="editarActividad(actividad)"
                          variant="tonal"
                          class="mr-1"
                        >
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn
                          icon
                          size="small"
                          color="error"
                          @click.stop="confirmarEliminarActividad(actividad)"
                          variant="tonal"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                        <v-btn
                          size="small"
                          color="orange"
                          variant="tonal"
                          @click.stop="abrirModalNuevoIndicadorActividad(actividad.id)"
                          prepend-icon="mdi-plus"
                          class="ml-2"
                        >
                          Indicador
                        </v-btn>
                      </div>
                    </td>

                    <!-- Columna 2: Indicadores de Actividad -->
                    <td class="indicadores-cell">
                      <div class="mb-2">
                        <v-chip size="x-small" color="info" variant="outlined" class="mb-1">
                          {{ actividad.indicadores?.length || 0 }} indicadores
                        </v-chip>
                      </div>

                      <template v-if="actividad.indicadores?.length">
                        <div class="indicadores-container">
                          <v-list lines="two" class="pa-0">
                            <template
                              v-for="(indicador, indIndex) in actividad.indicadores"
                              :key="indicador.id"
                            >
                              <v-list-item class="mb-2 indicador-item indicador-actividad">
                                <template v-slot:prepend>
                                  <v-chip size="small" color="orange" class="mr-2">
                                    {{ indicador.codigo }}
                                  </v-chip>
                                </template>

                                <v-list-item-title class="font-weight-bold text-body-2">
                                  <div class="texto-contenedor">
                                    <span class="texto-truncado">
                                      {{ truncarTexto(indicador.descripcion, 60) }}
                                    </span>
                                    <v-tooltip location="top">
                                      <template v-slot:activator="{ props }">
                                        <v-btn
                                          v-bind="props"
                                          icon
                                          size="x-small"
                                          variant="text"
                                          color="primary"
                                          @click.stop="verDetalleIndicadorActividad(indicador)"
                                          class="ml-1"
                                        >
                                          <v-icon size="small">mdi-eye</v-icon>
                                        </v-btn>
                                      </template>
                                      <span>Ver detalles completos</span>
                                    </v-tooltip>
                                  </div>
                                </v-list-item-title>

                                <v-list-item-subtitle class="text-caption">
                                  <div>
                                    <v-icon size="x-small">mdi-chart-bar</v-icon>
                                    <span class="text-grey ml-1">{{
                                      getTipoIndicadorTexto(indicador.tipo)
                                    }}</span>
                                  </div>
                                  <div v-if="indicador.frecuencia">
                                    <v-icon size="x-small">mdi-calendar</v-icon>
                                    {{ indicador.frecuencia }}
                                  </div>
                                </v-list-item-subtitle>

                                <template v-slot:append>
                                  <div class="d-flex">
                                    <v-btn
                                      icon
                                      size="x-small"
                                      color="primary"
                                      @click.stop="
                                        editarIndicadorActividad(indicador, actividad.id)
                                      "
                                      variant="text"
                                      class="mr-1"
                                    >
                                      <v-icon>mdi-pencil</v-icon>
                                    </v-btn>
                                    <v-btn
                                      icon
                                      size="x-small"
                                      color="error"
                                      @click.stop="
                                        confirmarEliminarIndicadorActividad(indicador, actividad.id)
                                      "
                                      variant="text"
                                    >
                                      <v-icon>mdi-delete</v-icon>
                                    </v-btn>
                                  </div>
                                </template>
                              </v-list-item>
                              <v-divider
                                v-if="indIndex < actividad.indicadores.length - 1"
                                :key="`div-${indicador.id}`"
                              ></v-divider>
                            </template>
                          </v-list>
                        </div>
                      </template>
                      <template v-else>
                        <div class="text-center py-4 text-grey">
                          <v-icon size="small">mdi-chart-line-off</v-icon>
                          <p class="text-caption mt-1">No hay indicadores</p>
                        </div>
                      </template>

                      <div class="text-center mt-2">
                        <v-btn
                          size="x-small"
                          color="orange"
                          variant="text"
                          @click.stop="abrirModalNuevoIndicadorActividad(actividad.id)"
                          :loading="cargandoAccion"
                          prepend-icon="mdi-plus"
                        >
                          Agregar indicador
                        </v-btn>
                      </div>
                    </td>

                    <!-- Columna 3: Medios de Verificación -->
                    <td class="medios-cell">
                      <!-- Datos de muestra para medios de verificación -->
                      <div class="medios-container">
                        <v-list lines="one" class="pa-0">
                          <v-list-item class="medios-item">
                            <template v-slot:prepend>
                              <v-icon color="blue" size="small">mdi-clipboard-check</v-icon>
                            </template>
                            <v-list-item-title class="text-body-2">
                              Listas de asistencia
                            </v-list-item-title>
                          </v-list-item>
                          <v-divider></v-divider>
                          <v-list-item class="medios-item">
                            <template v-slot:prepend>
                              <v-icon color="blue" size="small">mdi-receipt</v-icon>
                            </template>
                            <v-list-item-title class="text-body-2">
                              Informes de actividad
                            </v-list-item-title>
                          </v-list-item>
                          <v-divider></v-divider>
                          <v-list-item class="medios-item">
                            <template v-slot:prepend>
                              <v-icon color="blue" size="small">mdi-image</v-icon>
                            </template>
                            <v-list-item-title class="text-body-2">
                              Evidencia fotográfica
                            </v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </div>

                      <div class="text-center mt-2">
                        <v-btn size="x-small" color="blue" variant="text" prepend-icon="mdi-plus">
                          Agregar medio
                        </v-btn>
                      </div>
                    </td>
                  </tr>
                </template>
                <tr v-else>
                  <td colspan="3" class="text-center py-8 text-grey">
                    <v-icon size="large">mdi-checkbox-multiple-blank-outline</v-icon>
                    <p class="text-h6 mt-2">No hay actividades registradas</p>
                    <v-btn
                      color="orange"
                      class="mt-4"
                      @click="abrirModalNuevaActividad"
                      prepend-icon="mdi-plus"
                    >
                      Crear primera actividad
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>

        <!-- MODALES -->
        <!-- Modal: Nuevo/Editar Resultado -->
        <v-dialog v-model="dialogResultado" max-width="800" persistent>
          <v-card>
            <v-card-title :class="`text-white ${resultadoEdit.id ? 'bg-primary' : 'bg-green'}`">
              <v-icon left>{{ resultadoEdit.id ? 'mdi-pencil' : 'mdi-plus' }}</v-icon>
              {{ resultadoEdit.id ? 'Editar' : 'Nuevo' }} Resultado
            </v-card-title>
            <v-card-text class="pt-4">
              <v-form ref="formResultado">
                <v-text-field
                  variant="outlined"
                  v-model="resultadoEdit.codigo"
                  label="Código *"
                  required
                  :rules="[(v) => !!v || 'El código es requerido']"
                  :disabled="cargandoAccion"
                  placeholder="Ej: R1, R2"
                ></v-text-field>
                <v-textarea
                  variant="outlined"
                  v-model="resultadoEdit.descripcion"
                  label="Descripción *"
                  rows="4"
                  required
                  :rules="[(v) => !!v || 'La descripción es requerida']"
                  :disabled="cargandoAccion"
                  placeholder="Describa el resultado esperado..."
                ></v-textarea>
                <v-textarea
                  variant="outlined"
                  v-model="resultadoEdit.supuestosRiesgos"
                  label="Supuestos y Riesgos"
                  rows="3"
                  :disabled="cargandoAccion"
                  placeholder="Describa los supuestos y riesgos..."
                ></v-textarea>
              </v-form>
            </v-card-text>
            <v-card-actions class="pa-4 justify-end">
              <v-btn color="grey" @click="cerrarModalResultado" :disabled="cargandoAccion">
                Cancelar
              </v-btn>
              <v-btn
                :color="resultadoEdit.id ? 'primary' : 'green'"
                @click="guardarResultado"
                :loading="cargandoAccion"
              >
                {{ resultadoEdit.id ? 'Actualizar' : 'Guardar' }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Modal: Nuevo/Editar Indicador (para Objetivo, Resultado y Actividad) -->
        <v-dialog v-model="dialogIndicador" max-width="800" persistent>
          <v-card>
            <v-card-title :class="`text-white ${indicadorEdit.id ? 'bg-primary' : 'bg-info'}`">
              <v-icon left>{{ indicadorEdit.id ? 'mdi-pencil' : 'mdi-plus' }}</v-icon>
              {{ indicadorEdit.id ? 'Editar' : 'Nuevo' }} Indicador
              <v-chip color="white" size="small" class="ml-3">
                {{ indicadorContexto.nombre }}
              </v-chip>
            </v-card-title>
            <v-card-text class="pt-4">
              <v-form ref="formIndicador">
                <v-text-field
                  v-model="indicadorEdit.codigo"
                  variant="outlined"
                  label="Código *"
                  required
                  :rules="[(v) => !!v || 'El código es requerido']"
                  placeholder="Ej: IND001"
                ></v-text-field>
                <v-textarea
                  v-model="indicadorEdit.descripcion"
                  variant="outlined"
                  label="Descripción del Indicador *"
                  rows="3"
                  required
                  :rules="[(v) => !!v || 'La descripción es requerida']"
                  placeholder="Describa el indicador..."
                ></v-textarea>
                <v-select
                  v-model="indicadorEdit.tipo"
                  :items="tiposIndicador"
                  variant="outlined"
                  label="Tipo de Indicador *"
                  required
                  :rules="[(v) => !!v || 'El tipo es requerido']"
                ></v-select>
                <v-select
                  v-model="indicadorEdit.frecuencia"
                  :items="frecuencias"
                  variant="outlined"
                  label="Frecuencia de medición"
                  placeholder="Seleccione frecuencia"
                ></v-select>
                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      v-model="indicadorEdit.baseline"
                      variant="outlined"
                      label="Línea Base"
                      type="number"
                      placeholder="Valor inicial"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model="indicadorEdit.target"
                      variant="outlined"
                      label="Meta"
                      type="number"
                      placeholder="Valor esperado"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
            <v-card-actions class="pa-4 justify-end">
              <v-btn color="grey" @click="cerrarModalIndicador" :disabled="cargandoAccion">
                Cancelar
              </v-btn>
              <v-btn color="green" @click="guardarIndicador" :loading="cargandoAccion">
                {{ indicadorEdit.id ? 'Actualizar' : 'Guardar' }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Modal: Nueva/Editar Actividad -->
        <v-dialog v-model="dialogActividad" max-width="800" persistent>
          <v-card>
            <v-card-title :class="`text-white ${actividadEdit.id ? 'bg-primary' : 'bg-orange'}`">
              <v-icon left>{{ actividadEdit.id ? 'mdi-pencil' : 'mdi-plus' }}</v-icon>
              {{ actividadEdit.id ? 'Editar' : 'Nueva' }} Actividad
            </v-card-title>
            <v-card-text class="pt-4">
              <v-form ref="formActividad">
                <v-text-field
                  variant="outlined"
                  v-model="actividadEdit.codigo"
                  label="Código *"
                  required
                  :rules="[(v) => !!v || 'El código es requerido']"
                  placeholder="Ej: ACT001"
                ></v-text-field>
                <v-textarea
                  variant="outlined"
                  v-model="actividadEdit.descripcion"
                  label="Descripción *"
                  rows="3"
                  required
                  :rules="[(v) => !!v || 'La descripción es requerida']"
                  placeholder="Describa la actividad..."
                ></v-textarea>
                <v-select
                  v-model="actividadEdit.resultado_id"
                  :items="resultadosOptions"
                  item-title="text"
                  item-value="value"
                  variant="outlined"
                  label="Resultado Asociado *"
                  required
                  :rules="[(v) => !!v || 'El resultado es requerido']"
                ></v-select>
                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      v-model="actividadEdit.fecha_inicio"
                      variant="outlined"
                      label="Fecha Inicio"
                      type="date"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model="actividadEdit.fecha_fin"
                      variant="outlined"
                      label="Fecha Fin"
                      type="date"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-text-field
                  v-model="actividadEdit.responsable"
                  variant="outlined"
                  label="Responsable"
                  placeholder="Nombre del responsable"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions class="pa-4 justify-end">
              <v-btn color="grey" @click="cerrarModalActividad" :disabled="cargandoAccion">
                Cancelar
              </v-btn>
              <v-btn color="orange" @click="guardarActividad" :loading="cargandoAccion">
                {{ actividadEdit.id ? 'Actualizar' : 'Guardar' }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Modal: Detalle Completo del Indicador -->
        <v-dialog v-model="dialogDetalleIndicador" max-width="600">
          <v-card>
            <v-card-title class="bg-info text-white">
              <v-icon left>mdi-chart-line</v-icon>
              Detalle del Indicador
              <v-chip color="white" size="small" class="ml-3">
                {{ indicadorDetalle?.codigo }}
              </v-chip>
            </v-card-title>
            <v-card-text class="pt-4">
              <div v-if="indicadorDetalle">
                <h4 class="text-h6 mb-2">Descripción</h4>
                <p class="text-body-1 mb-4">{{ indicadorDetalle.descripcion }}</p>

                <v-divider class="my-4"></v-divider>

                <h4 class="text-h6 mb-2">Información Adicional</h4>
                <v-table>
                  <tbody>
                    <tr v-if="indicadorDetalle.tipo">
                      <td class="font-weight-bold">Tipo:</td>
                      <td>{{ getTipoIndicadorTexto(indicadorDetalle.tipo) }}</td>
                    </tr>
                    <tr v-if="indicadorDetalle.frecuencia">
                      <td class="font-weight-bold">Frecuencia:</td>
                      <td>{{ indicadorDetalle.frecuencia }}</td>
                    </tr>
                    <tr
                      v-if="
                        indicadorDetalle.baseline !== null &&
                        indicadorDetalle.baseline !== undefined
                      "
                    >
                      <td class="font-weight-bold">Línea Base:</td>
                      <td>{{ indicadorDetalle.baseline }}</td>
                    </tr>
                    <tr
                      v-if="
                        indicadorDetalle.target !== null && indicadorDetalle.target !== undefined
                      "
                    >
                      <td class="font-weight-bold">Meta:</td>
                      <td>{{ indicadorDetalle.target }}</td>
                    </tr>
                  </tbody>
                </v-table>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="grey" @click="dialogDetalleIndicador = false"> Cerrar </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>

      <v-alert v-if="error && !loading" type="error" variant="tonal" class="mt-4">
        No se pudo cargar la información del proyecto. Por favor intente nuevamente.
      </v-alert>
    </v-container>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useFonFoscStore } from '../store/useFonFoscStore'
import { onMounted, ref, computed } from 'vue'
import { useSnackbar } from '@/composables/useSnackbar'
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'

const { successMsg, errorMsg } = useSnackbar()

//Estados
const proyectoFonFosc = ref(null)

//Capturar el id del proyecto
const router = useRoute()
const idproyff = router.params.id

//Inicializar el store
const storeProyff = useFonFoscStore()

// Estados de UI
const loading = ref(false)
const cargandoAccion = ref(false)
const cargandoEdicion = ref(false)
const cargandoEliminacion = ref(false)
const cargandoEliminacionIndicador = ref(false)

// Estados de modales
const dialogResultado = ref(false)
const dialogIndicador = ref(false)
const dialogActividad = ref(false)
const dialogDetalleIndicador = ref(false)

// Configuración
const frecuencias = [
  'Diaria',
  'Semanal',
  'Quincenal',
  'Mensual',
  'Bimestral',
  'Trimestral',
  'Semestral',
  'Anual',
]

const tiposIndicador = ['Literal', 'Numérico', 'Porcentaje', 'Cualitativo', 'Cuantitativo']

// Datos para formularios
const resultadoEdit = ref({
  id: '',
  codigo: '',
  descripcion: '',
  supuestosRiesgos: '',
})

const indicadorEdit = ref({
  id: '',
  codigo: '',
  descripcion: '',
  tipo: '',
  frecuencia: '',
  baseline: null,
  target: null,
  contexto: '', // 'objetivo', 'resultado', 'actividad'
  contexto_id: '', // id del objetivo, resultado o actividad
})

const indicadorContexto = ref({
  tipo: '',
  id: '',
  nombre: '',
})

const actividadEdit = ref({
  id: '',
  codigo: '',
  descripcion: '',
  resultado_id: '',
  fecha_inicio: '',
  fecha_fin: '',
  responsable: '',
})

const indicadorDetalle = ref(null)

// Referencias a formularios
const formResultado = ref(null)
const formIndicador = ref(null)
const formActividad = ref(null)

// Datos de muestra para actividades
const actividades = ref([
  {
    id: 1,
    codigo: 'ACT001',
    descripcion:
      'Diseño e instalación del sistema de riego tecnificado para las parcelas familiares',
    resultado: 'R1',
    resultado_id: 1,
    fecha_inicio: '2026-01-15',
    fecha_fin: '2026-02-15',
    responsable: 'Ing. Juan Pérez',
    indicadores: [
      {
        id: 101,
        codigo: 'IND001.ACT',
        descripcion: 'Número de sistemas de riego instalados',
        tipo: 'Numérico',
        frecuencia: 'Mensual',
        baseline: 0,
        target: 10,
      },
      {
        id: 102,
        codigo: 'IND002.ACT',
        descripcion: 'Porcentaje de familias capacitadas en el uso del sistema',
        tipo: 'Porcentaje',
        frecuencia: 'Mensual',
        baseline: 0,
        target: 100,
      },
    ],
  },
  {
    id: 2,
    codigo: 'ACT002',
    descripcion: 'Capacitación en técnicas agroecológicas para la producción hortícola',
    resultado: 'R1',
    resultado_id: 1,
    fecha_inicio: '2026-02-01',
    fecha_fin: '2026-03-15',
    responsable: 'Ing. María López',
    indicadores: [
      {
        id: 103,
        codigo: 'IND003.ACT',
        descripcion: 'Número de talleres realizados',
        tipo: 'Numérico',
        frecuencia: 'Mensual',
        baseline: 0,
        target: 4,
      },
      {
        id: 104,
        codigo: 'IND004.ACT',
        descripcion: 'Número de participantes capacitados',
        tipo: 'Numérico',
        frecuencia: 'Mensual',
        baseline: 0,
        target: 40,
      },
    ],
  },
  {
    id: 3,
    codigo: 'ACT003',
    descripcion:
      'Construcción e instalación del biofiltro artesanal para tratamiento de aguas residuales',
    resultado: 'R2',
    resultado_id: 2,
    fecha_inicio: '2026-03-01',
    fecha_fin: '2026-04-30',
    responsable: 'Ing. Carlos Rodríguez',
    indicadores: [
      {
        id: 105,
        codigo: 'IND005.ACT',
        descripcion: 'Número de biofiltros instalados',
        tipo: 'Numérico',
        frecuencia: 'Mensual',
        baseline: 0,
        target: 1,
      },
      {
        id: 106,
        codigo: 'IND006.ACT',
        descripcion: 'Capacidad de tratamiento del biofiltro (litros/día)',
        tipo: 'Numérico',
        frecuencia: 'Mensual',
        baseline: 0,
        target: 500,
      },
    ],
  },
])

// Computed
const resultadosOptions = computed(() => {
  if (!proyectoFonFosc.value?.proyecto?.objetivo?.resultados) return []
  return proyectoFonFosc.value.proyecto.objetivo.resultados.map((r) => ({
    text: `${r.codigo} - ${truncarTexto(r.descripcion, 50)}`,
    value: r.id,
  }))
})

// Métodos
const getEstadoColor = (estado) => {
  const colores = {
    Estructuracion: 'orange',
    Ejecucion: 'green',
    Finalizado: 'blue',
    Suspendido: 'red',
    Cancelado: 'grey',
  }
  return colores[estado] || 'grey'
}

const getTipoIndicadorTexto = (tipo) => {
  return tipo || 'No especificado'
}

const truncarTexto = (texto, longitud) => {
  if (!texto) return ''
  if (texto.length <= longitud) return texto
  return texto.substring(0, longitud) + '...'
}

/*************************Carga de datos*******************************/
const error = ref(null)
const cargarDatos = async () => {
  loading.value = true
  try {
    await Promise.all([storeProyff.cargarEstrcuturaFonfosc(idproyff)])
    proyectoFonFosc.value = storeProyff.fonfoscEstructura
  } catch (err) {
    console.error('Error al cargar la informacion', err)
    error.value = err
  } finally {
    loading.value = false
  }
}

//hook
onMounted(() => {
  cargarDatos()
})

// Métodos para Resultados
const abrirModalNuevoResultado = () => {
  resultadoEdit.value = {
    id: '',
    codigo: '',
    descripcion: '',
    supuestosRiesgos: '',
  }
  dialogResultado.value = true
}

const editarResultado = (resultado) => {
  resultadoEdit.value = {
    id: resultado.id,
    codigo: resultado.codigo,
    descripcion: resultado.descripcion,
    supuestosRiesgos: resultado.supuestosRiesgos,
  }
  dialogResultado.value = true
}

const guardarResultado = async () => {
  if (formResultado.value) {
    const { valid } = await formResultado.value.validate()
    if (!valid) return
  }

  try {
    cargandoAccion.value = true

    // Aquí iría la lógica para guardar en el backend
    // Por ahora, solo mostramos un mensaje de éxito
    if (resultadoEdit.value.id) {
      successMsg('Resultado actualizado correctamente')
    } else {
      successMsg('Resultado creado correctamente')
    }

    await cargarDatos() // Recargar datos
    cerrarModalResultado()
  } catch (err) {
    console.error('Error al guardar resultado', err)
    errorMsg('No se pudo guardar el resultado')
  } finally {
    cargandoAccion.value = false
  }
}

const cerrarModalResultado = () => {
  dialogResultado.value = false
  resultadoEdit.value = {
    id: '',
    codigo: '',
    descripcion: '',
    supuestosRiesgos: '',
  }
  if (formResultado.value) formResultado.value.reset()
}

const solicitarEliminarResultado = async (resultado) => {
  if (confirm(`¿Está seguro que desea eliminar el resultado "${resultado.codigo}"?`)) {
    try {
      cargandoEliminacion.value = true
      // Aquí iría la lógica para eliminar en el backend
      successMsg('Resultado eliminado correctamente')
      await cargarDatos()
    } catch (err) {
      console.error('Error al eliminar resultado', err)
      errorMsg('No se pudo eliminar el resultado')
    } finally {
      cargandoEliminacion.value = false
    }
  }
}

// Métodos para Indicadores de Objetivo
const abrirModalNuevoIndicadorObjetivo = () => {
  indicadorEdit.value = {
    id: '',
    codigo: '',
    descripcion: '',
    tipo: '',
    frecuencia: '',
    baseline: null,
    target: null,
    contexto: 'objetivo',
    contexto_id: proyectoFonFosc.value?.proyecto?.objetivo?.id || '',
  }
  indicadorContexto.value = {
    tipo: 'objetivo',
    id: proyectoFonFosc.value?.proyecto?.objetivo?.id || '',
    nombre: proyectoFonFosc.value?.proyecto?.objetivo?.codigo || 'Objetivo',
  }
  dialogIndicador.value = true
}

const editarIndicadorObjetivo = (indicador) => {
  indicadorEdit.value = {
    id: indicador.id,
    codigo: indicador.codigo,
    descripcion: indicador.descripcion,
    tipo: indicador.tipo,
    frecuencia: indicador.frecuencia,
    baseline: indicador.baseline,
    target: indicador.target,
    contexto: 'objetivo',
    contexto_id: proyectoFonFosc.value?.proyecto?.objetivo?.id || '',
  }
  indicadorContexto.value = {
    tipo: 'objetivo',
    id: proyectoFonFosc.value?.proyecto?.objetivo?.id || '',
    nombre: proyectoFonFosc.value?.proyecto?.objetivo?.codigo || 'Objetivo',
  }
  dialogIndicador.value = true
}

const verDetalleIndicadorObjetivo = (indicador) => {
  indicadorDetalle.value = indicador
  dialogDetalleIndicador.value = true
}

const confirmarEliminarIndicadorObjetivo = async (indicador) => {
  if (confirm(`¿Está seguro que desea eliminar el indicador "${indicador.codigo}"?`)) {
    try {
      cargandoEliminacionIndicador.value = true
      // Aquí iría la lógica para eliminar en el backend
      successMsg('Indicador eliminado correctamente')
      await cargarDatos()
    } catch (err) {
      console.error('Error al eliminar indicador', err)
      errorMsg('No se pudo eliminar el indicador')
    } finally {
      cargandoEliminacionIndicador.value = false
    }
  }
}

// Métodos para Indicadores de Resultado
const abrirModalNuevoIndicadorResultado = (resultadoId) => {
  const resultado = proyectoFonFosc.value?.proyecto?.objetivo?.resultados?.find(
    (r) => r.id === resultadoId,
  )
  indicadorEdit.value = {
    id: '',
    codigo: '',
    descripcion: '',
    tipo: '',
    frecuencia: '',
    baseline: null,
    target: null,
    contexto: 'resultado',
    contexto_id: resultadoId,
  }
  indicadorContexto.value = {
    tipo: 'resultado',
    id: resultadoId,
    nombre: resultado?.codigo || 'Resultado',
  }
  dialogIndicador.value = true
}

const editarIndicadorResultado = (indicador, resultadoId) => {
  const resultado = proyectoFonFosc.value?.proyecto?.objetivo?.resultados?.find(
    (r) => r.id === resultadoId,
  )
  indicadorEdit.value = {
    id: indicador.id,
    codigo: indicador.codigo,
    descripcion: indicador.descripcion,
    tipo: indicador.tipo,
    frecuencia: indicador.frecuencia,
    baseline: indicador.baseline,
    target: indicador.target,
    contexto: 'resultado',
    contexto_id: resultadoId,
  }
  indicadorContexto.value = {
    tipo: 'resultado',
    id: resultadoId,
    nombre: resultado?.codigo || 'Resultado',
  }
  dialogIndicador.value = true
}

const verDetalleIndicadorResultado = (indicador) => {
  indicadorDetalle.value = indicador
  dialogDetalleIndicador.value = true
}

const confirmarEliminarIndicadorResultado = async (indicador, resultadoId) => {
  if (confirm(`¿Está seguro que desea eliminar el indicador "${indicador.codigo}"?`)) {
    try {
      cargandoEliminacionIndicador.value = true
      // Aquí iría la lógica para eliminar en el backend
      successMsg('Indicador eliminado correctamente')
      await cargarDatos()
    } catch (err) {
      console.error('Error al eliminar indicador', err)
      errorMsg('No se pudo eliminar el indicador')
    } finally {
      cargandoEliminacionIndicador.value = false
    }
  }
}

// Métodos para Actividades
const abrirModalNuevaActividad = () => {
  actividadEdit.value = {
    id: '',
    codigo: '',
    descripcion: '',
    resultado_id: '',
    fecha_inicio: '',
    fecha_fin: '',
    responsable: '',
  }
  dialogActividad.value = true
}

const editarActividad = (actividad) => {
  actividadEdit.value = {
    id: actividad.id,
    codigo: actividad.codigo,
    descripcion: actividad.descripcion,
    resultado_id: actividad.resultado_id,
    fecha_inicio: actividad.fecha_inicio,
    fecha_fin: actividad.fecha_fin,
    responsable: actividad.responsable,
  }
  dialogActividad.value = true
}

const guardarActividad = async () => {
  if (formActividad.value) {
    const { valid } = await formActividad.value.validate()
    if (!valid) return
  }

  try {
    cargandoAccion.value = true

    if (actividadEdit.value.id) {
      // Actualizar actividad existente
      const index = actividades.value.findIndex((a) => a.id === actividadEdit.value.id)
      if (index !== -1) {
        actividades.value[index] = { ...actividadEdit.value }
        successMsg('Actividad actualizada correctamente')
      }
    } else {
      // Crear nueva actividad
      const nuevaActividad = {
        ...actividadEdit.value,
        id: actividades.value.length + 1,
        resultado:
          proyectoFonFosc.value?.proyecto?.objetivo?.resultados?.find(
            (r) => r.id === actividadEdit.value.resultado_id,
          )?.codigo || 'R?',
        indicadores: [],
      }
      actividades.value.push(nuevaActividad)
      successMsg('Actividad creada correctamente')
    }

    cerrarModalActividad()
  } catch (err) {
    console.error('Error al guardar actividad', err)
    errorMsg('No se pudo guardar la actividad')
  } finally {
    cargandoAccion.value = false
  }
}

const cerrarModalActividad = () => {
  dialogActividad.value = false
  actividadEdit.value = {
    id: '',
    codigo: '',
    descripcion: '',
    resultado_id: '',
    fecha_inicio: '',
    fecha_fin: '',
    responsable: '',
  }
  if (formActividad.value) formActividad.value.reset()
}

const confirmarEliminarActividad = async (actividad) => {
  if (confirm(`¿Está seguro que desea eliminar la actividad "${actividad.codigo}"?`)) {
    try {
      cargandoEliminacion.value = true
      actividades.value = actividades.value.filter((a) => a.id !== actividad.id)
      successMsg('Actividad eliminada correctamente')
    } catch (err) {
      console.error('Error al eliminar actividad', err)
      errorMsg('No se pudo eliminar la actividad')
    } finally {
      cargandoEliminacion.value = false
    }
  }
}

// Métodos para Indicadores de Actividad
const abrirModalNuevoIndicadorActividad = (actividadId) => {
  const actividad = actividades.value.find((a) => a.id === actividadId)
  indicadorEdit.value = {
    id: '',
    codigo: '',
    descripcion: '',
    tipo: '',
    frecuencia: '',
    baseline: null,
    target: null,
    contexto: 'actividad',
    contexto_id: actividadId,
  }
  indicadorContexto.value = {
    tipo: 'actividad',
    id: actividadId,
    nombre: actividad?.codigo || 'Actividad',
  }
  dialogIndicador.value = true
}

const editarIndicadorActividad = (indicador, actividadId) => {
  const actividad = actividades.value.find((a) => a.id === actividadId)
  indicadorEdit.value = {
    id: indicador.id,
    codigo: indicador.codigo,
    descripcion: indicador.descripcion,
    tipo: indicador.tipo,
    frecuencia: indicador.frecuencia,
    baseline: indicador.baseline,
    target: indicador.target,
    contexto: 'actividad',
    contexto_id: actividadId,
  }
  indicadorContexto.value = {
    tipo: 'actividad',
    id: actividadId,
    nombre: actividad?.codigo || 'Actividad',
  }
  dialogIndicador.value = true
}

const verDetalleIndicadorActividad = (indicador) => {
  indicadorDetalle.value = indicador
  dialogDetalleIndicador.value = true
}

const confirmarEliminarIndicadorActividad = async (indicador, actividadId) => {
  if (confirm(`¿Está seguro que desea eliminar el indicador "${indicador.codigo}"?`)) {
    try {
      cargandoEliminacionIndicador.value = true
      const actividad = actividades.value.find((a) => a.id === actividadId)
      if (actividad && actividad.indicadores) {
        actividad.indicadores = actividad.indicadores.filter((i) => i.id !== indicador.id)
        successMsg('Indicador eliminado correctamente')
      }
    } catch (err) {
      console.error('Error al eliminar indicador', err)
      errorMsg('No se pudo eliminar el indicador')
    } finally {
      cargandoEliminacionIndicador.value = false
    }
  }
}

// Método genérico para guardar indicador
const guardarIndicador = async () => {
  if (formIndicador.value) {
    const { valid } = await formIndicador.value.validate()
    if (!valid) return
  }

  try {
    cargandoAccion.value = true

    switch (indicadorEdit.value.contexto) {
      case 'objetivo':
        // Lógica para guardar indicador de objetivo
        if (indicadorEdit.value.id) {
          successMsg('Indicador de objetivo actualizado')
        } else {
          successMsg('Indicador de objetivo creado')
        }
        await cargarDatos()
        break

      case 'resultado':
        // Lógica para guardar indicador de resultado
        if (indicadorEdit.value.id) {
          successMsg('Indicador de resultado actualizado')
        } else {
          successMsg('Indicador de resultado creado')
        }
        await cargarDatos()
        break

      case 'actividad':
        // Lógica para guardar indicador de actividad
        const actividad = actividades.value.find((a) => a.id === indicadorEdit.value.contexto_id)
        if (actividad) {
          if (!actividad.indicadores) actividad.indicadores = []

          if (indicadorEdit.value.id) {
            const index = actividad.indicadores.findIndex((i) => i.id === indicadorEdit.value.id)
            if (index !== -1) {
              actividad.indicadores[index] = { ...indicadorEdit.value }
              successMsg('Indicador de actividad actualizado')
            }
          } else {
            const nuevoIndicador = {
              ...indicadorEdit.value,
              id: actividad.indicadores.length + 1,
            }
            actividad.indicadores.push(nuevoIndicador)
            successMsg('Indicador de actividad creado')
          }
        }
        break
    }

    cerrarModalIndicador()
  } catch (err) {
    console.error('Error al guardar indicador', err)
    errorMsg('No se pudo guardar el indicador')
  } finally {
    cargandoAccion.value = false
  }
}

const cerrarModalIndicador = () => {
  dialogIndicador.value = false
  indicadorEdit.value = {
    id: '',
    codigo: '',
    descripcion: '',
    tipo: '',
    frecuencia: '',
    baseline: null,
    target: null,
    contexto: '',
    contexto_id: '',
  }
  indicadorContexto.value = {
    tipo: '',
    id: '',
    nombre: '',
  }
  if (formIndicador.value) formIndicador.value.reset()
}
</script>

<style scoped>
.marco-logico-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 16px;
}

.v-card {
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.v-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.marco-logico-table {
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
}

.marco-logico-table thead th {
  background-color: #f5f5f5;
  position: sticky;
  top: 0;
  z-index: 2;
  font-weight: 600;
  padding: 16px;
  border-bottom: 2px solid #e0e0e0;
  text-align: left;
}

.marco-logico-table tbody tr {
  transition: background-color 0.2s ease;
}

.marco-logico-table tbody tr:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

/* Nivel 1: Objetivo */
.nivel-1 thead th {
  background-color: rgba(103, 58, 183, 0.1);
  border-bottom: 2px solid #673ab7;
}

.objetivo-row td {
  padding: 16px;
  vertical-align: top;
  border-bottom: 1px solid #e0e0e0;
}

.objetivo-cell {
  border-right: 1px solid #e0e0e0;
}

/* Nivel 2: Resultados */
.nivel-2 thead th {
  background-color: rgba(76, 175, 80, 0.1);
  border-bottom: 2px solid #4caf50;
}

.resultado-row td {
  padding: 16px;
  vertical-align: top;
  border-bottom: 1px solid #e0e0e0;
}

.resultado-cell {
  border-right: 1px solid #e0e0e0;
}

/* Nivel 3: Actividades */
.nivel-3 thead th {
  background-color: rgba(255, 152, 0, 0.1);
  border-bottom: 2px solid #ff9800;
}

.actividad-row td {
  padding: 16px;
  vertical-align: top;
  border-bottom: 1px solid #e0e0e0;
}

.actividad-cell {
  border-right: 1px solid #e0e0e0;
}

.indicadores-cell {
  border-right: 1px solid #e0e0e0;
}

.medios-cell {
  /* Última columna, sin borde derecho */
}

.objetivo-descripcion,
.resultado-descripcion,
.actividad-descripcion {
  max-height: 100px;
  overflow-y: auto;
  padding-right: 8px;
}

.indicadores-container,
.medios-container {
  max-height: 300px;
  overflow-y: auto;
  padding-right: 8px;
}

.indicador-item {
  border-radius: 6px;
  transition: all 0.2s ease;
  padding: 8px;
}

.indicador-objetivo {
  background-color: rgba(103, 58, 183, 0.08);
  border-left: 3px solid #673ab7;
}

.indicador-resultado {
  background-color: rgba(76, 175, 80, 0.08);
  border-left: 3px solid #4caf50;
}

.indicador-actividad {
  background-color: rgba(255, 152, 0, 0.08);
  border-left: 3px solid #ff9800;
}

.medios-item {
  border-radius: 6px;
  padding: 8px;
  background-color: rgba(33, 150, 243, 0.05);
  border-left: 3px solid #2196f3;
}

.indicador-item:hover,
.medios-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.supuestos-riesgos {
  margin-top: 8px;
}

.actividad-info {
  background-color: rgba(0, 0, 0, 0.02);
  padding: 8px;
  border-radius: 4px;
  margin-top: 8px;
}

/* Estilos para el texto con vista detallada */
.texto-contenedor {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.texto-truncado {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Scroll personalizado */
.indicadores-container::-webkit-scrollbar,
.medios-container::-webkit-scrollbar,
.objetivo-descripcion::-webkit-scrollbar,
.resultado-descripcion::-webkit-scrollbar,
.actividad-descripcion::-webkit-scrollbar {
  width: 6px;
}

.indicadores-container::-webkit-scrollbar-track,
.medios-container::-webkit-scrollbar-track,
.objetivo-descripcion::-webkit-scrollbar-track,
.resultado-descripcion::-webkit-scrollbar-track,
.actividad-descripcion::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.indicadores-container::-webkit-scrollbar-thumb,
.medios-container::-webkit-scrollbar-thumb,
.objetivo-descripcion::-webkit-scrollbar-thumb,
.resultado-descripcion::-webkit-scrollbar-thumb,
.actividad-descripcion::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.indicadores-container::-webkit-scrollbar-thumb:hover,
.medios-container::-webkit-scrollbar-thumb:hover,
.objetivo-descripcion::-webkit-scrollbar-thumb:hover,
.resultado-descripcion::-webkit-scrollbar-thumb:hover,
.actividad-descripcion::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Responsive */
@media (max-width: 960px) {
  .marco-logico-container {
    padding: 16px 12px;
  }

  .marco-logico-table {
    display: block;
    overflow-x: auto;
  }

  .marco-logico-table thead th {
    font-size: 0.875rem;
    padding: 12px 8px;
  }

  .objetivo-row td,
  .resultado-row td,
  .actividad-row td {
    padding: 12px 8px;
  }

  .texto-contenedor {
    flex-direction: column;
    align-items: flex-start;
  }

  .texto-truncado {
    margin-bottom: 4px;
  }
}

@media (max-width: 600px) {
  .marco-logico-container {
    padding: 12px 8px;
  }
}
</style>
