<template>
  <v-container class="solicitud-viaje-container">
    <!-- Overlay de carga -->
    <v-overlay :model-value="cargando" class="align-center justify-center" persistent opacity="0.8">
      <v-progress-circular indeterminate color="primary" size="64" width="6" />
      <p class="mt-3 text-white">Cargando formulario...</p>
    </v-overlay>

    <div v-if="!cargando">
      <PaginaTituloIcono titulo="Validar Solicitud de Viaje" icon="mdi-file-document-multiple" />
      <ProyectoIdHeader v-if="actividad" :proyecto-id="actividad.proyecto" />
      <ActividadInformacion v-if="actividad" :actividad-id="actividad.id" />

      <v-row>
        <v-col cols="12" md="4" lg="3">
          <v-card elevation="2" rounded="lg" class="mb-4">
            <v-toolbar color="primary" density="compact">
              <v-toolbar-title class="text-white">Información General</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <div class="mb-2"><strong>Solicitud de Viaje</strong></div>
              <div class="mb-2">
                <strong>CODIGO:</strong> {{ datosOriginales.numeroFormulario }}
              </div>
            </v-card-text>
          </v-card>
          <!--Revisor de la Solicitud-->
          <RevisorSolicitudViajes></RevisorSolicitudViajes>
          <!-- Redactor de la solicitud-->
          <RedactorSolicitudViajes></RedactorSolicitudViajes>
        </v-col>

        <v-col cols="12" md="8" lg="9">
          <v-card elevation="2" rounded="lg">
            <v-toolbar color="primary" density="compact">
              <v-toolbar-title class="text-white">
                <v-icon class="mr-2">mdi-form-textbox</v-icon> Formulario de Solicitud
              </v-toolbar-title>
              <v-spacer />
              <v-chip
                v-if="soloLectura"
                color="grey"
                size="x-small"
                variant="flat"
                prepend-icon="mdi-lock"
                class="mr-2"
                >Solo lectura</v-chip
              >
              <v-chip
                v-else
                color="success"
                size="x-small"
                variant="flat"
                prepend-icon="mdi-pencil"
                class="mr-2"
                >Editable</v-chip
              >
            </v-toolbar>

            <v-card-text>
              <v-form @submit.prevent="submitForm">
                <!-- Sección 1: Evento -->
                <div class="form-section mb-4">
                  <h3 class="text-h6 mb-3 primary--text">
                    <v-icon color="primary" class="mr-2">mdi-calendar-text</v-icon> Información del
                    Evento
                  </h3>
                  <v-text-field
                    v-model="formData.evento"
                    label="Nombre del Evento"
                    variant="outlined"
                    density="compact"
                    bg-color="blue-lighten-5"
                    :readonly="soloLectura"
                  />
                  <v-row>
                    <v-col cols="6">
                      <v-text-field
                        v-model="formData.fecha_evento"
                        label="Fecha de Evento"
                        type="date"
                        variant="outlined"
                        density="compact"
                        bg-color="blue-lighten-5"
                        :readonly="soloLectura"
                      />
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        v-model="formData.lugar_evento"
                        label="Lugar"
                        variant="outlined"
                        density="compact"
                        bg-color="blue-lighten-5"
                        :readonly="soloLectura"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="6">
                      <v-text-field
                        v-model="formData.instituciones_participantes"
                        label="Organizaciones Participantes"
                        variant="outlined"
                        density="compact"
                        bg-color="blue-lighten-5"
                        :readonly="soloLectura"
                      />
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        v-model="formData.organizador"
                        label="Institución que invita"
                        variant="outlined"
                        density="compact"
                        bg-color="blue-lighten-5"
                        :readonly="soloLectura"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="6">
                      <v-textarea
                        v-model="formData.quien_cubregastos"
                        label="Quién cubre los gastos"
                        variant="outlined"
                        bg-color="blue-lighten-5"
                        rows="2"
                        :readonly="soloLectura"
                      />
                    </v-col>
                    <v-col cols="6">
                      <v-textarea
                        v-model="formData.fondos_unitas"
                        label="Fondos UNITAS"
                        variant="outlined"
                        bg-color="blue-lighten-5"
                        rows="2"
                        :readonly="soloLectura"
                      />
                    </v-col>
                  </v-row>
                  <div class="solicitante-field">
                    <div class="solicitante-label">Persona que presenta la solicitud</div>
                    <UsuarioBadge
                      v-if="datosOriginales?.usuario"
                      :user-id="datosOriginales.usuario"
                    />
                    <span v-else class="text-grey text-caption">Cargando...</span>
                  </div>

                  <v-textarea
                    v-model="formData.justificacion_asistencia"
                    label="Justificación"
                    variant="outlined"
                    bg-color="blue-lighten-5"
                    rows="2"
                    :readonly="soloLectura"
                  />
                  <v-textarea
                    v-model="formData.tareas_previas"
                    label="Tareas previas"
                    variant="outlined"
                    bg-color="blue-lighten-5"
                    rows="2"
                    :readonly="soloLectura"
                  />
                </div>

                <v-divider class="my-3" />

                <!-- Sección 2: Detalle de Gastos -->
                <div class="form-section mb-4">
                  <h3 class="text-h6 mb-3 primary--text">
                    <v-icon color="primary" class="mr-2">mdi-cash</v-icon> Detalle de Gastos
                  </h3>
                  <div class="d-flex justify-space-between align-center mb-3">
                    <v-btn
                      color="primary"
                      variant="outlined"
                      prepend-icon="mdi-plus"
                      @click="addGasto"
                      :disabled="soloLectura"
                      >Agregar Item</v-btn
                    >
                    <div class="d-flex align-center" style="gap: 12px">
                      <v-chip :color="excedePresupuesto ? 'error' : 'primary'" variant="outlined"
                        >Total: Bs. {{ totalMonto.toLocaleString() }}</v-chip
                      >
                      <v-chip
                        v-if="limitePresupuesto > 0"
                        color="success"
                        variant="tonal"
                        size="small"
                        >Límite: Bs. {{ limitePresupuesto.toLocaleString() }}</v-chip
                      >
                    </div>
                  </div>
                  <v-alert
                    v-if="excedePresupuesto"
                    type="error"
                    variant="tonal"
                    density="compact"
                    class="mb-3"
                    icon="mdi-alert-circle"
                  >
                    ¡Excedido! El monto total supera el presupuesto disponible por Bs.
                    {{ montoExcedido.toLocaleString() }}
                  </v-alert>

                  <v-table class="elevation-1 rounded-lg users-table">
                    <thead>
                      <tr>
                        <th style="width: 12%">Partida</th>
                        <th style="width: 22%">Fuente</th>
                        <!-- 16% → 22% -->
                        <th style="width: 38%">Descripción</th>
                        <!-- 44% → 38% -->
                        <th style="width: 18%" class="text-right">Monto (Bs.)</th>
                        <th style="width: 10%" class="text-center">Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(gasto, i) in formData.detalle_destino_fondos" :key="i">
                        <td>
                          <v-text-field
                            v-model="gasto.partida"
                            variant="outlined"
                            density="compact"
                            hide-details
                            bg-color="blue-lighten-5"
                            placeholder="1.1.1"
                            :readonly="soloLectura"
                            :rules="[validarPartida]"
                          />
                        </td>
                        <td>
                          <v-select
                            v-model="gasto.fuente"
                            :items="procedenciaFondosActividad"
                            item-title="financiera"
                            return-object
                            variant="outlined"
                            density="compact"
                            hide-details
                            bg-color="blue-lighten-5"
                            placeholder="Financiador"
                            :readonly="soloLectura"
                            :rules="[validarFuente]"
                          >
                            <template #item="{ item, props }">
                              <v-list-item v-bind="props" density="compact">
                                <template #title>{{ item.raw.financiera }}</template>
                                <template #subtitle>{{ item.raw.sigla }}</template>
                              </v-list-item>
                            </template>
                            <template #selection="{ item }">{{ item.raw.sigla }}</template>
                          </v-select>
                        </td>
                        <td>
                          <v-text-field
                            v-model="gasto.descripcion_gasto"
                            variant="outlined"
                            density="compact"
                            hide-details
                            bg-color="blue-lighten-5"
                            placeholder="Descripción del gasto"
                            :readonly="soloLectura"
                            :rules="[validarDescripcionGasto]"
                          />
                        </td>
                        <td>
                          <v-text-field
                            v-model.number="gasto.monto"
                            type="number"
                            variant="outlined"
                            density="compact"
                            hide-details
                            bg-color="blue-lighten-5"
                            placeholder="0.00"
                            min="0"
                            :readonly="soloLectura"
                            :rules="[validarMontoGasto]"
                            class="text-right"
                          />
                        </td>
                        <td class="text-center">
                          <v-btn
                            icon="mdi-delete-outline"
                            color="error"
                            size="x-small"
                            variant="text"
                            @click="removeGasto(i)"
                            :disabled="soloLectura"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </div>

                <v-divider class="my-3" />

                <!-- Sección 3: Información Adicional -->
                <div class="form-section mb-4">
                  <h3 class="text-h6 mb-3 primary--text">
                    <v-icon color="primary" class="mr-2">mdi-information</v-icon> Información
                    Adicional
                  </h3>
                  <InformacionAdicionalEdicion
                    ref="infoRef"
                    :lugar="formData.lugar_solicitud"
                    :fecha="formData.fecha_solicitud"
                    :forma-pago="formData.forma_pago"
                    :datos-forma-pago="formData.datos_forma_pago"
                    :readonly="soloLectura"
                  />
                </div>

                <!-- Botonera -->
                <div class="d-flex justify-end mt-4" style="gap: 8px">
                  <v-btn
                    color="error"
                    variant="outlined"
                    prepend-icon="mdi-cancel"
                    to="/monitoreo/actividades-formularios/"
                    >Cancelar</v-btn
                  >
                  <v-btn
                    v-if="mostrarPdfActividad"
                    color="info"
                    variant="outlined"
                    prepend-icon="mdi-file-pdf-box"
                    @click="generarPdfActividad"
                    :loading="loadingPdfActividad"
                    >PDF SV</v-btn
                  >
                  <v-btn
                    v-if="mostrarPdfTarea"
                    color="info"
                    variant="outlined"
                    prepend-icon="mdi-file-pdf-box"
                    @click="generarPdfTarea"
                    :loading="loadingPdfTarea"
                    >PDF SVS</v-btn
                  >
                  <v-btn
                    color="primary"
                    variant="flat"
                    prepend-icon="mdi-content-save"
                    type="submit"
                    :loading="loading"
                    :disabled="soloLectura"
                    >Actualizar</v-btn
                  >
                </div>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
  <!-- <pre>{{ datosOriginales }}</pre> -->
  <!-- <pre>{{ soloLectura }}</pre> -->
  <!-- <pre>{{ formData }}</pre>
  <pre>{{ procedenciaFondosActividad }}</pre> -->
  <!-- <pre>Logueado: {{ storeUser.id }}</pre>
  <pre>Dueño: {{ datosOriginales }} </pre> -->
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Componentes
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'
import ProyectoIdHeader from '@/modules/proyecto/components/partials/ProyectoIdHeader.vue'
import ActividadInformacion from '@/modules/proyecto/components/partials/ActividadInformacion.vue'
import InformacionAdicionalEdicion from '@/modules/formularios/components/vinculacion/InformacionAdicionalEdicion.vue'
import UsuarioBadge from '@/modules/formularios/components/partials/UsuarioBadge.vue'
import RevisorSolicitudViajes from '@/modules/formularios/components/validadores/componenteEstadoVotacion/RevisorSolicitudViajes.vue'
import RedactorSolicitudViajes from '@/modules/formularios/components/validadores/componenteRedactorEstadoValidacion/RedactorSolicitudViajes.vue'
// Composables
import { useImpresionFormularios } from '@/modules/impresiones/composables/useImpresionFormularios'
import { useSolicitudViajeEditarValidar } from '@/modules/formularios/composables/useSolicitudViajeEditarValidar'
import { useActividadFormulaioPresupuesto } from '@/modules/formularios/composables/useActividadFormularioPresupuesto'
import { useTareaFormularioPresupuesto } from '@/modules/formularios/composables/useTareaFormularioPresupuesto'
import { useSnackbar } from '@/composables/useSnackbar'
//stores
import { useSolicitudDeViajesStore } from '@/modules/formularios/store/useSolicitudDeViajesStore'

// ── Parámetros de ruta ────────────────────
const route = useRoute()
const idSolicitud = route.query.solicitud_id || null
const idActividad = route.params.id || null
const idTarea = route.query.tarea_id || null
const infoRef = ref()

const router = useRouter()

//Iniciaar el store
const storeSolViajes = useSolicitudDeViajesStore()

// ── Composable ────────────────────────────
//Composable para mensajes
const { successMsg } = useSnackbar()
//composable para impresion
const { generarPdfSolicitudViaje, generarPdfSolicitudViajeTareas } = useImpresionFormularios()

//Logica de actualizacion
const {
  esTarea,
  cargando,
  loading,
  formData,
  actividad,
  soloLectura,
  totalMonto,
  datosOriginales,
  addGasto,
  removeGasto,
  inicializar,
  actualizar,
} = useSolicitudViajeEditarValidar(idSolicitud, idActividad, idTarea)
//Presupuesto de la actividad
const {
  //loading: loadingActividad, //bandera de carga
  //actividadNodoInformacion, //Nodo Actividad - Informacion de la actividad
  //actividadPresupuestoAsignado, //Presupuesto asignado a la actividad
  //tareasPresupuestoAsignado, //Presupuesto asignado a las tareas
  //numeroSolicitudesActividad, //numero de solicitudes de la actividad
  //totalSolicitudesSinRendicion, //cantidad asignada a las solicitudes
  actividadPresupuestoDisponible, //Cantidad disponible
  //totalSolicitudesPorTipo, //Desglose de las solicitudes por tipo
  procedenciaFondosActividad, //procedencia fondos de la actividad
} = useActividadFormulaioPresupuesto(idActividad)

//Composable para conexion al nodo tareas, inicializacion condicional
const composableTarea = idTarea ? useTareaFormularioPresupuesto(idTarea) : null

//Extraer datos de la Tarea
// const tareaPresupuestoAsignado = computed(() => composableTarea?.tareaPresupuestoAsignado?.value)
// const tareaNodoInformacion = computed(() => composableTarea?.tareaNodoInformacion?.value || null)
// const tareaNodoPresupuesto = computed(() => composableTarea?.tareaNodoPresupuesto?.value || null)
// const tareaTotalSolicitudesSinRendicion = computed(
//   () => composableTarea?.totalSolicitudesSinRendicion?.value || null,
// )
// const tareaTotalSolicitudesPorTipo = computed(() => composableTarea.totalSolicitudesPorTipo.value)

const tareaPresupuestoDisponible = computed(
  () => composableTarea?.tareaPresupuestoDisponible?.value || 0,
)
//Asignaro el limite del presupuesto
const limitePresupuesto = computed(() => {
  //Si hay idTarea, el limite es el presupuesto disponible de la tarea
  if (idTarea) {
    return tareaPresupuestoDisponible.value
  }
  //Si hay idActividad el limte es el presupuesto disponible de la actividad
  return actividadPresupuestoDisponible.value
})
//----------------------- Edicion/Revision--------------------

//Enviar modificaciones
async function submitForm() {
  // Sincronizar datos del componente InformacionAdicionalEdicion
  if (infoRef.value) {
    formData.value.lugar_solicitud = infoRef.value.localLugar
    formData.value.fecha_solicitud = infoRef.value.localFecha
    formData.value.forma_pago = infoRef.value.localFormaPago
    formData.value.datos_forma_pago = { ...infoRef.value.localDatosFormaPago }
  }
  const ok = await actualizar()
  if (ok) {
    successMsg('Formulario actualizado')
    router.push('/monitoreo/actividades-formularios/')
  }
}

// ── Botones PDF ───────────────────────────
const mostrarPdfActividad = computed(() => !esTarea.value)
const mostrarPdfTarea = computed(() => esTarea.value)
const loadingPdfActividad = ref(false)
const loadingPdfTarea = ref(false)

// ── Presupuesto ───────────────────────────
const excedePresupuesto = computed(() => totalMonto.value > limitePresupuesto.value)
const montoExcedido = computed(() =>
  excedePresupuesto.value ? totalMonto.value - limitePresupuesto.value : 0,
)

// ── Validaciones ──────────────────────────
const validarPartida = (v) => (!v || !v.trim() ? 'La partida es requerida' : true)
const validarFuente = (v) => {
  if (!v) return 'La fuente es requerida'
  if (typeof v === 'object' && Object.keys(v).length === 0) return 'La fuente es requerida'
  if (typeof v === 'string' && !v.trim()) return 'La fuente es requerida'
  return true
}
const validarDescripcionGasto = (v) => (!v || !v.trim() ? 'La descripción es requerida' : true)
const validarMontoGasto = (v) => {
  if (!v && v !== 0) return 'El monto es requerido'
  if (Number(v) <= 0) return 'El monto debe ser mayor a 0'
  return true
}

// ── Inicializar ───────────────────────────
onMounted(async () => {
  await Promise.all([inicializar(), storeSolViajes.cargarSolicitud(idSolicitud)])
})

// ── Generar PDFs ──────────────────────────
async function generarPdfActividad() {
  if (!idActividad) return
  loadingPdfActividad.value = true
  try {
    await generarPdfSolicitudViaje(idSolicitud)
  } catch (error) {
    console.error('Error al generar PDF Solicitud de Fondos:', error)
    alert('Error al generar el PDF: ' + error.message)
  } finally {
    loadingPdfActividad.value = false
  }
}

async function generarPdfTarea() {
  loadingPdfTarea.value = true
  try {
    await generarPdfSolicitudViajeTareas(idSolicitud)
  } catch (error) {
    console.error('Error al generar PDF Subactividad:', error)
    alert('Error al generar el PDF de subactividad: ' + error.message)
  } finally {
    loadingPdfTarea.value = false
  }
}
</script>

<style scoped>
.solicitud-viaje-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 16px;
}
.form-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 16px;
  border: 1px solid #e0e0e0;
}
.form-section h3 {
  color: #1976d2;
  border-bottom: 2px solid #1976d2;
  padding-bottom: 10px;
  margin-bottom: 16px;
  font-weight: 600;
}
.users-table :deep(th) {
  background-color: #1976d2 !important;
  color: white !important;
  font-weight: 600;
  font-size: 12px;
  padding: 8px 6px;
}
.users-table :deep(td) {
  padding: 3px;
}
.users-table :deep(tbody tr:hover) {
  background: #f5f5f5;
}
.solicitante-field {
  padding: 8px 12px;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  margin-bottom: 16px;
}
.solicitante-label {
  font-size: 10px;
  color: #999;
  margin-bottom: 4px;
}
</style>
