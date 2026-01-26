<template>
  <v-dialog v-model="valorLocal" max-width="1400" fullscreen>
    <v-card>
      <!-- Header -->
      <v-toolbar color="primary" dark flat>
        <v-toolbar-title>
          <v-icon start>mdi-history</v-icon>
          Cambios Registrados
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="cerrar">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <!-- Contenido principal -->
      <v-card-text class="pa-0">
        <!-- Resumen superior -->
        <v-card variant="flat" class="pa-4 border-b">
          <v-row align="center">
            <v-col cols="auto">
              <v-avatar color="primary" size="56">
                <v-icon size="28" dark>mdi-sync</v-icon>
              </v-avatar>
            </v-col>
            <v-col>
              <div class="text-h5 font-weight-bold">
                {{ totalCambiosReales }} Cambio{{ totalCambiosReales !== 1 ? 's' : '' }} Pendiente{{
                  totalCambiosReales !== 1 ? 's' : ''
                }}
              </div>
              <div class="text-caption text-medium-emphasis">
                Última actualización: {{ formatearFechaCompleta(props.cambiosData.timestamp) }}
              </div>
            </v-col>
            <v-col cols="auto">
              <div class="d-flex flex-wrap gap-2">
                <v-chip
                  v-for="(cantidad, propiedad) in cambiosPorPropiedad"
                  :key="propiedad"
                  :color="cantidad > 0 ? coloresPropiedades[propiedad] : 'grey'"
                  variant="flat"
                  size="small"
                >
                  <v-icon start size="small">{{ iconosPropiedades[propiedad] }}</v-icon>
                  {{ cantidad }}
                </v-chip>
              </div>
            </v-col>
          </v-row>
        </v-card>

        <!-- Tabs principales -->
        <v-tabs v-model="tabPrincipal" color="primary" grow class="px-4 pt-2">
          <v-tab>
            <v-icon start>mdi-file-document-edit</v-icon>
            Cambios ({{ totalCambiosReales }})
          </v-tab>
          <v-tab>
            <v-icon start>mdi-database-eye</v-icon>
            Datos Originales
            <v-badge
              v-if="datosOriginalesStore.length > 0"
              :content="datosOriginalesStore.length"
              color="blue"
              inline
              class="ml-2"
            ></v-badge>
          </v-tab>
          <v-tab>
            <v-icon start>mdi-database-check</v-icon>
            Datos Actuales (a enviar)
            <v-badge
              v-if="tableDataStore.length > 0"
              :content="tableDataStore.length"
              color="green"
              inline
              class="ml-2"
            ></v-badge>
          </v-tab>
          <v-tab>
            <v-icon start>mdi-api</v-icon>
            Resumen Envío API
          </v-tab>
        </v-tabs>

        <!-- Contenido de tabs principales -->
        <v-window v-model="tabPrincipal" class="pa-4">
          <!-- Tab 1: Cambios -->
          <v-window-item>
            <!-- Tabs para cada tipo de cambio -->
            <v-tabs v-model="tabActual" color="primary" grow v-if="totalCambiosReales > 0">
              <v-tab v-for="(cantidad, propiedad) in propiedadesConCambios" :key="propiedad">
                <v-badge :content="cantidad" color="red" inline>
                  <span class="text-capitalize">{{ propiedad.replace('_', ' ') }}</span>
                </v-badge>
              </v-tab>
            </v-tabs>

            <!-- Contenido de cada tab de cambios -->
            <v-window v-model="tabActual" class="pt-4">
              <!-- Si no hay cambios -->
              <v-window-item v-if="totalCambiosReales === 0">
                <div class="text-center py-8">
                  <v-icon size="64" color="grey-lighten-1">mdi-check-circle-outline</v-icon>
                  <div class="text-h6 text-grey mt-4">No hay cambios registrados</div>
                </div>
              </v-window-item>

              <!-- Si hay cambios -->
              <v-window-item
                v-for="(cantidad, propiedad) in propiedadesConCambios"
                :key="propiedad"
                v-else
              >
                <div>
                  <!-- Lista de cambios para esta propiedad -->
                  <div
                    v-for="cambio in cambiosPorPropiedadLista(propiedad)"
                    :key="`${cambio.fila}-${cambio.fecha}`"
                    class="mb-4"
                  >
                    <v-card
                      variant="outlined"
                      :color="coloresPropiedades[propiedad] + '-lighten-5'"
                    >
                      <v-card-text class="pa-3">
                        <!-- Encabezado del cambio -->
                        <div class="d-flex align-center mb-3">
                          <v-avatar :color="coloresPropiedades[propiedad]" size="36" class="mr-3">
                            <v-icon size="18" dark>{{ iconosPropiedades[propiedad] }}</v-icon>
                          </v-avatar>
                          <div>
                            <div class="text-subtitle-1 font-weight-bold">
                              {{ cambio.actividad_nombre }}
                            </div>
                            <div class="text-caption text-medium-emphasis">
                              ID: {{ cambio.actividad_id }} • Fila: {{ cambio.fila + 1 }} •
                              {{ formatearHora(cambio.fecha) }}
                            </div>
                          </div>
                        </div>

                        <!-- Comparación antes/después -->
                        <v-row dense>
                          <v-col cols="5">
                            <v-card variant="flat" color="grey-lighten-4" class="pa-2 rounded">
                              <div class="text-caption text-medium-emphasis mb-1">
                                Valor Anterior
                              </div>
                              <div class="text-body-1 font-weight-medium">
                                <span
                                  v-if="
                                    cambio.anterior === null ||
                                    cambio.anterior === '' ||
                                    cambio.anterior === 'NODEF'
                                  "
                                  class="text-grey"
                                >
                                  <v-icon size="small">mdi-minus-circle</v-icon>
                                  {{ cambio.anterior === 'NODEF' ? 'No definido' : 'Vacío' }}
                                </span>
                                <span v-else>{{ cambio.anterior }}</span>
                              </div>
                            </v-card>
                          </v-col>

                          <v-col cols="2" class="d-flex align-center justify-center">
                            <v-icon color="primary" size="24">mdi-arrow-right-bold</v-icon>
                          </v-col>

                          <v-col cols="5">
                            <v-card
                              variant="flat"
                              :color="coloresPropiedades[propiedad] + '-lighten-4'"
                              class="pa-2 rounded"
                            >
                              <div class="text-caption text-medium-emphasis mb-1">Valor Nuevo</div>
                              <div class="text-body-1 font-weight-medium">
                                <span
                                  v-if="cambio.nuevo === null || cambio.nuevo === ''"
                                  class="text-grey"
                                >
                                  <v-icon size="small">mdi-minus-circle</v-icon> Vacío
                                </span>
                                <span v-else>{{ cambio.nuevo }}</span>
                              </div>
                            </v-card>
                          </v-col>
                        </v-row>

                        <!-- Información específica según propiedad -->
                        <div v-if="esFecha(propiedad) && cambio.nuevo" class="mt-2">
                          <v-chip size="small" variant="outlined" color="blue">
                            <v-icon start size="small">mdi-calendar</v-icon>
                            {{ formatearFecha(cambio.nuevo) }}
                          </v-chip>
                        </div>
                      </v-card-text>
                    </v-card>
                  </div>
                </div>
              </v-window-item>
            </v-window>
          </v-window-item>

          <!-- Tab 2: Datos Originales -->
          <v-window-item>
            <div class="datos-container">
              <!-- Resumen de datos originales -->
              <v-card variant="flat" class="mb-4 pa-4" color="blue-lighten-5">
                <v-row align="center">
                  <v-col cols="auto">
                    <v-avatar color="blue" size="48">
                      <v-icon size="24" dark>mdi-database</v-icon>
                    </v-avatar>
                  </v-col>
                  <v-col>
                    <div class="text-h6 font-weight-bold">Datos Originales (Estado Inicial)</div>
                    <div class="text-caption text-medium-emphasis">
                      Desde base de datos - {{ datosOriginalesStore.length }} actividades
                    </div>
                  </v-col>
                  <v-col cols="auto">
                    <v-chip color="blue" variant="flat" size="small">
                      <v-icon start size="small">mdi-database-import</v-icon>
                      Original
                    </v-chip>
                  </v-col>
                </v-row>
              </v-card>

              <!-- Lista de actividades originales -->
              <div class="actividades-lista">
                <v-card
                  v-for="actividad in datosOriginalesStore"
                  :key="`original-${actividad.id}`"
                  variant="outlined"
                  class="mb-3"
                >
                  <v-card-text class="pa-3">
                    <!-- Encabezado de la actividad -->
                    <div class="d-flex align-start mb-3">
                      <v-avatar color="blue-lighten-3" size="40" class="mr-3">
                        <v-icon size="20" dark>mdi-database-outline</v-icon>
                      </v-avatar>
                      <div class="flex-grow-1">
                        <div class="d-flex align-center justify-space-between">
                          <div>
                            <div class="text-subtitle-1 font-weight-bold">
                              {{ actividad.codigo }}
                            </div>
                            <div class="text-body-2">{{ actividad.nombreCorto }}</div>
                          </div>
                          <v-chip
                            size="small"
                            :color="getColorEstado(actividad.estado)"
                            variant="flat"
                          >
                            {{ actividad.estado }}
                          </v-chip>
                        </div>
                      </div>
                    </div>

                    <!-- Información principal -->
                    <v-row dense class="mt-2">
                      <v-col cols="12" md="6">
                        <div class="d-flex flex-column gap-2">
                          <!-- Tipo -->
                          <div class="d-flex align-center">
                            <v-icon size="small" color="green" class="mr-2">mdi-tag</v-icon>
                            <span class="text-caption text-medium-emphasis mr-2">Tipo:</span>
                            <v-chip
                              v-if="actividad.tipo && actividad.tipo !== 'NODEF'"
                              size="x-small"
                              color="green"
                              variant="flat"
                            >
                              {{ actividad.tipo }}
                            </v-chip>
                            <span v-else class="text-caption text-grey">No definido</span>
                          </div>

                          <!-- Responsable -->
                          <div class="d-flex align-center">
                            <v-icon size="small" color="orange" class="mr-2">mdi-account</v-icon>
                            <span class="text-caption text-medium-emphasis mr-2">Responsable:</span>
                            <span class="text-body-2">
                              {{ actividad.responsable || 'Sin asignar' }}
                            </span>
                          </div>

                          <!-- Fechas -->
                          <div class="d-flex align-center">
                            <v-icon size="small" color="blue" class="mr-2">mdi-calendar</v-icon>
                            <span class="text-caption text-medium-emphasis mr-2">Fechas:</span>
                            <div class="d-flex gap-1">
                              <v-chip
                                v-if="actividad.fecha_inicio"
                                size="x-small"
                                variant="outlined"
                                color="blue"
                              >
                                Inicio: {{ formatearFechaSimple(actividad.fecha_inicio) }}
                              </v-chip>
                              <v-chip
                                v-if="actividad.fecha_cierre"
                                size="x-small"
                                variant="outlined"
                                color="purple"
                              >
                                Cierre: {{ formatearFechaSimple(actividad.fecha_cierre) }}
                              </v-chip>
                            </div>
                          </div>
                        </div>
                      </v-col>

                      <v-col cols="12" md="6">
                        <div class="d-flex flex-column gap-2">
                          <!-- Presupuesto -->
                          <div class="d-flex align-center">
                            <v-icon size="small" color="teal" class="mr-2">mdi-cash</v-icon>
                            <span class="text-caption text-medium-emphasis mr-2">Presupuesto:</span>
                            <span class="text-body-2">
                              {{ formatCurrency(actividad.presupuesto) }}
                            </span>
                          </div>
                        </div>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </div>

              <!-- Mensaje si no hay datos -->
              <div v-if="datosOriginalesStore.length === 0" class="text-center py-8">
                <v-icon size="64" color="grey-lighten-2">mdi-database-off</v-icon>
                <div class="text-h6 text-grey mt-4">No hay datos originales disponibles</div>
              </div>
            </div>
          </v-window-item>

          <!-- Tab 3: Datos Actuales (tableData) -->
          <v-window-item>
            <div class="datos-container">
              <!-- Resumen de datos actuales -->
              <v-card variant="flat" class="mb-4 pa-4" color="green-lighten-5">
                <v-row align="center">
                  <v-col cols="auto">
                    <v-avatar color="green" size="48">
                      <v-icon size="24" dark>mdi-database-check</v-icon>
                    </v-avatar>
                  </v-col>
                  <v-col>
                    <div class="text-h6 font-weight-bold">Datos Actuales (TableData)</div>
                    <div class="text-caption text-medium-emphasis">
                      Estado actual con cambios - {{ tableDataStore.length }} actividades
                    </div>
                    <div class="text-caption text-green-darken-2 mt-1">
                      <v-icon size="small">mdi-information</v-icon>
                      Estos datos serán enviados al REST API
                    </div>
                  </v-col>
                  <v-col cols="auto">
                    <v-chip color="green" variant="flat" size="small">
                      <v-icon start size="small">mdi-send</v-icon>
                      Para API
                    </v-chip>
                  </v-col>
                </v-row>
              </v-card>

              <!-- Lista de actividades actuales -->
              <div class="actividades-lista">
                <v-card
                  v-for="actividad in tableDataStore"
                  :key="`actual-${actividad.id}`"
                  variant="outlined"
                  class="mb-3"
                  :class="esActividadModificada(actividad.id) ? 'border-modified' : ''"
                >
                  <v-card-text class="pa-3">
                    <!-- Encabezado de la actividad -->
                    <div class="d-flex align-start mb-3">
                      <v-avatar
                        :color="
                          esActividadModificada(actividad.id)
                            ? 'orange-lighten-3'
                            : 'green-lighten-3'
                        "
                        size="40"
                        class="mr-3"
                      >
                        <v-icon size="20" dark>
                          {{ esActividadModificada(actividad.id) ? 'mdi-pencil' : 'mdi-check' }}
                        </v-icon>
                      </v-avatar>
                      <div class="flex-grow-1">
                        <div class="d-flex align-center justify-space-between">
                          <div>
                            <div class="text-subtitle-1 font-weight-bold">
                              {{ actividad.codigo }}
                              <v-chip
                                v-if="esActividadModificada(actividad.id)"
                                color="orange"
                                size="x-small"
                                class="ml-2"
                              >
                                MODIFICADA
                              </v-chip>
                            </div>
                            <div class="text-body-2">{{ actividad.nombreCorto }}</div>
                          </div>
                          <v-chip
                            size="small"
                            :color="getColorEstado(actividad.estado)"
                            variant="flat"
                          >
                            {{ actividad.estado }}
                          </v-chip>
                        </div>
                      </div>
                    </div>

                    <!-- Información principal -->
                    <v-row dense class="mt-2">
                      <v-col cols="12" md="6">
                        <div class="d-flex flex-column gap-2">
                          <!-- Tipo -->
                          <div class="d-flex align-center">
                            <v-icon size="small" color="green" class="mr-2">mdi-tag</v-icon>
                            <span class="text-caption text-medium-emphasis mr-2">Tipo:</span>
                            <v-chip
                              v-if="actividad.tipo && actividad.tipo !== 'NODEF'"
                              size="x-small"
                              color="green"
                              variant="flat"
                            >
                              {{ actividad.tipo }}
                            </v-chip>
                            <span v-else class="text-caption text-grey">No definido</span>
                          </div>

                          <!-- Responsable -->
                          <div class="d-flex align-center">
                            <v-icon size="small" color="orange" class="mr-2">mdi-account</v-icon>
                            <span class="text-caption text-medium-emphasis mr-2">Responsable:</span>
                            <span class="text-body-2">
                              {{ actividad.responsable || 'Sin asignar' }}
                            </span>
                          </div>

                          <!-- Fechas -->
                          <div class="d-flex align-center">
                            <v-icon size="small" color="blue" class="mr-2">mdi-calendar</v-icon>
                            <span class="text-caption text-medium-emphasis mr-2">Fechas:</span>
                            <div class="d-flex gap-1">
                              <v-chip
                                v-if="actividad.fecha_inicio"
                                size="x-small"
                                variant="outlined"
                                color="blue"
                              >
                                Inicio: {{ formatearFechaSimple(actividad.fecha_inicio) }}
                              </v-chip>
                              <v-chip
                                v-if="actividad.fecha_cierre"
                                size="x-small"
                                variant="outlined"
                                color="purple"
                              >
                                Cierre: {{ formatearFechaSimple(actividad.fecha_cierre) }}
                              </v-chip>
                            </div>
                          </div>
                        </div>
                      </v-col>

                      <v-col cols="12" md="6">
                        <div class="d-flex flex-column gap-2">
                          <!-- Presupuesto -->
                          <div class="d-flex align-center">
                            <v-icon size="small" color="teal" class="mr-2">mdi-cash</v-icon>
                            <span class="text-caption text-medium-emphasis mr-2">Presupuesto:</span>
                            <span class="text-body-2">
                              {{ formatCurrency(actividad.presupuesto) }}
                            </span>
                          </div>

                          <!-- Estado -->
                          <div class="d-flex align-center">
                            <v-icon size="small" color="indigo" class="mr-2">mdi-flag</v-icon>
                            <span class="text-caption text-medium-emphasis mr-2">Estado:</span>
                            <v-chip
                              size="x-small"
                              :color="getColorEstado(actividad.estado)"
                              variant="flat"
                            >
                              {{ actividad.estado }}
                            </v-chip>
                          </div>
                        </div>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </div>

              <!-- Mensaje si no hay datos -->
              <div v-if="tableDataStore.length === 0" class="text-center py-8">
                <v-icon size="64" color="grey-lighten-2">mdi-database-off</v-icon>
                <div class="text-h6 text-grey mt-4">No hay datos actuales disponibles</div>
              </div>
            </div>
          </v-window-item>

          <!-- Tab 4: Resumen Envío API -->
          <v-window-item>
            <div class="resumen-api-container">
              <!-- Resumen del envío -->
              <v-card variant="flat" class="mb-4 pa-4" color="purple-lighten-5">
                <v-row align="center">
                  <v-col cols="auto">
                    <v-avatar color="purple" size="48">
                      <v-icon size="24" dark>mdi-api</v-icon>
                    </v-avatar>
                  </v-col>
                  <v-col>
                    <div class="text-h6 font-weight-bold">Resumen de Envío al REST API</div>
                    <div class="text-caption text-medium-emphasis">
                      Formato y estructura de datos a enviar
                    </div>
                  </v-col>
                  <v-col cols="auto">
                    <v-chip color="purple" variant="flat" size="small">
                      <v-icon start size="small">mdi-code-json</v-icon>
                      Formato API
                    </v-chip>
                  </v-col>
                </v-row>
              </v-card>

              <!-- Estructura del envío -->
              <v-card variant="outlined" class="mb-4">
                <v-card-title class="pa-4">
                  <v-icon start color="purple">mdi-format-list-bulleted</v-icon>
                  Estructura del Payload
                </v-card-title>
                <v-card-text class="pa-4">
                  <div class="d-flex flex-column gap-3">
                    <div>
                      <div class="text-subtitle-2 font-weight-bold mb-2">
                        1. Actividades (tableData)
                      </div>
                      <div class="text-caption text-medium-emphasis">
                        {{ tableDataStore.length }} actividades que serán enviadas
                      </div>
                      <v-chip color="green" size="small" class="mt-1">
                        <v-icon start size="small">mdi-check</v-icon>
                        Incluidas en el payload
                      </v-chip>
                    </div>

                    <div>
                      <div class="text-subtitle-2 font-weight-bold mb-2">
                        2. Objeto "seguimiento"
                      </div>
                      <div class="d-flex flex-column gap-2">
                        <div class="d-flex align-center">
                          <v-icon size="small" color="blue" class="mr-2">mdi-database</v-icon>
                          <span class="text-caption"
                            >datos_tabla_actual: {{ datosOriginalesStore.length }} actividades</span
                          >
                        </div>
                        <div class="d-flex align-center">
                          <v-icon size="small" color="green" class="mr-2"
                            >mdi-database-check</v-icon
                          >
                          <span class="text-caption"
                            >datos_tabla_actualizado: {{ tableDataStore.length }} actividades</span
                          >
                        </div>
                        <div class="d-flex align-center">
                          <v-icon size="small" color="orange" class="mr-2">mdi-history</v-icon>
                          <span class="text-caption"
                            >cambios_efectuados: {{ totalCambiosReales }} cambios</span
                          >
                        </div>
                        <div class="d-flex align-center">
                          <v-icon size="small" color="teal" class="mr-2">mdi-cash</v-icon>
                          <span class="text-caption"
                            >total_presupuesto: {{ totalPresupuestoFormateado }}</span
                          >
                        </div>
                        <div class="d-flex align-center">
                          <v-icon size="small" color="blue" class="mr-2">mdi-flag-checkered</v-icon>
                          <span class="text-caption"
                            >actividades_planificadas:
                            {{ actividadesPlanificadas }} actividades</span
                          >
                        </div>
                        <div class="d-flex align-center">
                          <v-icon size="small" color="indigo" class="mr-2">mdi-account</v-icon>
                          <span class="text-caption"
                            >creado_por: {{ usuarioActual?.id || 'No disponible' }}</span
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>

              <!-- Vista previa del payload -->
              <v-card variant="outlined">
                <v-card-title class="pa-4">
                  <v-icon start color="purple">mdi-eye</v-icon>
                  Vista Previa del Payload
                </v-card-title>
                <v-card-text class="pa-4">
                  <v-textarea
                    v-model="payloadPreview"
                    label="Payload a enviar"
                    readonly
                    rows="15"
                    variant="outlined"
                    auto-grow
                    hide-details
                    class="monospace-text"
                  ></v-textarea>
                  <div class="text-caption text-medium-emphasis mt-2">
                    <v-icon size="small">mdi-information</v-icon>
                    Este es el formato que se enviará al REST API
                  </div>
                </v-card-text>
              </v-card>
            </div>
          </v-window-item>
        </v-window>
      </v-card-text>

      <!-- Footer -->
      <v-divider></v-divider>
      <v-card-actions class="pa-3">
        <div class="text-caption text-grey">
          {{ actividadesAfectadas.length }} actividad{{
            actividadesAfectadas.length !== 1 ? 'es' : ''
          }}
          afectada{{ actividadesAfectadas.length !== 1 ? 's' : '' }} • Envío:
          {{ tableDataStore.length }} actividades, {{ totalCambiosReales }} cambios
        </div>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="cerrar" class="mr-2"> Cancelar </v-btn>
        <v-btn color="primary" @click="guardarPlanificacion" :disabled="totalCambiosReales === 0">
          <v-icon start>mdi-send</v-icon>
          Enviar al API ({{ totalCambiosReales }} cambios)
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, ref } from 'vue'
import { usePlanificacionPeiStore } from '../store/usePlanificacionPeiStore'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const props = defineProps({
  modelValue: Boolean,
  cambiosData: {
    type: Object,
    default: () => ({
      timestamp: '',
      total_cambios: 0,
      cambios_por_propiedad: {},
      detalles: {},
    }),
  },
  configuracion: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:modelValue', 'guardarPlanificacion'])

// Estados
const tabPrincipal = ref(0)
const tabActual = ref(0)

// Iniciar el store
const storePlanificacion = usePlanificacionPeiStore()
const { tableData, datosOriginales, usuarioActual } = storeToRefs(storePlanificacion)

// Iconos y colores
const iconosPropiedades = {
  responsable: 'mdi-account',
  tipo: 'mdi-tag',
  fecha_inicio: 'mdi-calendar-start',
  fecha_cierre: 'mdi-calendar-end',
  presupuesto: 'mdi-cash',
  otros: 'mdi-dots-horizontal',
}

const coloresPropiedades = {
  responsable: 'orange',
  tipo: 'green',
  fecha_inicio: 'blue',
  fecha_cierre: 'purple',
  presupuesto: 'teal',
  otros: 'grey',
}

// Computed para manejar v-model
const valorLocal = computed({
  get: () => props.modelValue,
  set: (valor) => emit('update:modelValue', valor),
})

// Datos del store
const datosOriginalesStore = computed(() => {
  return datosOriginales.value || []
})

const tableDataStore = computed(() => {
  return tableData.value || []
})

// Cálculos para el seguimiento
const totalPresupuesto = computed(() => {
  if (!tableDataStore.value.length) return 0
  return tableDataStore.value.reduce((total, actividad) => {
    const presupuesto = parseFloat(actividad.presupuesto) || 0
    return total + presupuesto
  }, 0)
})

const totalPresupuestoFormateado = computed(() => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'BOB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(totalPresupuesto.value)
})

const actividadesPlanificadas = computed(() => {
  if (!tableDataStore.value.length) return 0
  return tableDataStore.value.filter((actividad) => actividad.estado === 'PLAN').length
})

// Identificar actividades modificadas
const actividadesModificadas = computed(() => {
  const modificadas = new Set()
  const detalles = props.cambiosData?.detalles || {}

  Object.values(detalles).forEach((lista) => {
    if (Array.isArray(lista)) {
      lista.forEach((cambio) => {
        if (cambio.actividad_id) {
          modificadas.add(cambio.actividad_id)
        }
      })
    }
  })

  return Array.from(modificadas)
})

const esActividadModificada = (id) => {
  return actividadesModificadas.value.includes(id)
}

// 🔥 CALCULAR TOTALES REALES desde los detalles (ignorar total_cambios)
const totalCambiosReales = computed(() => {
  const detalles = props.cambiosData?.detalles || {}
  let total = 0
  Object.values(detalles).forEach((lista) => {
    if (Array.isArray(lista)) {
      total += lista.length
    }
  })
  return total
})

// 🔥 CALCULAR CAMBIOS POR PROPIEDAD desde los detalles
const cambiosPorPropiedad = computed(() => {
  const detalles = props.cambiosData?.detalles || {}
  const conteo = {}

  const propiedades = [
    'responsable',
    'tipo',
    'fecha_inicio',
    'fecha_cierre',
    'presupuesto',
    'otros',
  ]

  propiedades.forEach((prop) => {
    const lista = detalles[prop]
    conteo[prop] = Array.isArray(lista) ? lista.length : 0
  })

  return conteo
})

// 🔥 Solo propiedades que tienen cambios
const propiedadesConCambios = computed(() => {
  const resultado = {}
  Object.entries(cambiosPorPropiedad.value).forEach(([prop, cantidad]) => {
    if (cantidad > 0) {
      resultado[prop] = cantidad
    }
  })
  return resultado
})

// Actividades únicas afectadas
const actividadesAfectadas = computed(() => {
  const actividades = new Set()
  const detalles = props.cambiosData?.detalles || {}

  Object.values(detalles).forEach((lista) => {
    if (Array.isArray(lista)) {
      lista.forEach((cambio) => {
        if (cambio.actividad_nombre) {
          actividades.add(cambio.actividad_nombre)
        }
      })
    }
  })

  return Array.from(actividades)
})

// Generar payload preview
const payloadPreview = computed(() => {
  const payload = {
    actividades: tableDataStore.value,
    seguimiento: {
      datos_tabla_actual: datosOriginalesStore.value,
      datos_tabla_actualizado: tableDataStore.value,
      cambios_efectuados: props.cambiosData?.detalles || {},
      configuracion: props.configuracion || {},
      total_actividades: tableDataStore.value.length,
      total_presupuesto: totalPresupuesto.value,
      actividades_planificadas: actividadesPlanificadas.value,
      pei: 1, // Asumiendo que siempre es 1
      creado_por: usuarioActual.value?.id || null,
      actualizado_por: usuarioActual.value?.id || null,
    },
  }

  return JSON.stringify(payload, null, 2)
})

// Métodos
const cerrar = () => {
  valorLocal.value = false
}

const guardarPlanificacion = () => {
  // Construir el payload en el formato requerido
  const payload = {
    actividades: tableDataStore.value,
    seguimiento: {
      datos_tabla_actual: datosOriginalesStore.value,
      datos_tabla_actualizado: tableDataStore.value,
      cambios_efectuados: props.cambiosData || {},
      configuracion: props.configuracion || {},
      total_actividades: tableDataStore.value.length,
      total_presupuesto: totalPresupuesto.value,
      actividades_planificadas: actividadesPlanificadas.value,
      pei: storePlanificacion.peiSeleccionado.id,
      creado_por: usuarioActual.value?.id || null,
      actualizado_por: usuarioActual.value?.id || null,
    },
  }

  emit('guardarPlanificacion', payload)
  cerrar()
}

const cambiosPorPropiedadLista = (propiedad) => {
  const lista = props.cambiosData?.detalles?.[propiedad] || []
  return [...lista].sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
}

const esFecha = (propiedad) => {
  return propiedad.includes('fecha')
}

const formatearFecha = (fechaString) => {
  if (!fechaString) return ''
  try {
    const fecha = new Date(fechaString)
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  } catch {
    return fechaString
  }
}

const formatearFechaSimple = (fechaString) => {
  if (!fechaString) return ''
  try {
    const fecha = new Date(fechaString)
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
    })
  } catch {
    return fechaString
  }
}

const formatearHora = (fechaString) => {
  try {
    const fecha = new Date(fechaString)
    return fecha.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return ''
  }
}

const formatearFechaCompleta = (fechaString) => {
  try {
    const fecha = new Date(fechaString)
    return fecha.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return ''
  }
}

const formatCurrency = (value) => {
  const num = parseFloat(value) || 0
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'BOB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)
}

const getColorEstado = (estado) => {
  const colores = {
    CRD: 'grey',
    PLAN: 'blue',
    EJEC: 'orange',
    CERR: 'green',
  }
  return colores[estado] || 'grey'
}
</script>

<style scoped>
.border-b {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.gap-1 {
  gap: 4px;
}

.gap-2 {
  gap: 8px;
}

.gap-3 {
  gap: 12px;
}

.datos-container,
.resumen-api-container {
  max-height: calc(100vh - 300px);
  overflow-y: auto;
}

.actividades-lista {
  max-height: calc(100vh - 400px);
  overflow-y: auto;
  padding-right: 4px;
}

.border-modified {
  border-left: 4px solid #ff9800 !important;
}

.monospace-text {
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
}

/* Scrollbar personalizado */
.datos-container::-webkit-scrollbar,
.resumen-api-container::-webkit-scrollbar,
.actividades-lista::-webkit-scrollbar {
  width: 6px;
}

.datos-container::-webkit-scrollbar-track,
.resumen-api-container::-webkit-scrollbar-track,
.actividades-lista::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.datos-container::-webkit-scrollbar-thumb,
.resumen-api-container::-webkit-scrollbar-thumb,
.actividades-lista::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.datos-container::-webkit-scrollbar-thumb:hover,
.resumen-api-container::-webkit-scrollbar-thumb:hover,
.actividades-lista::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
