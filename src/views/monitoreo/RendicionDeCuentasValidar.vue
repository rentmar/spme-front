<template>
  <v-container class="rendicion-de-cuentas-container">
    <!-- Overlay de carga -->
    <v-overlay
      :model-value="cargandoGeneral"
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
        <p class="mt-4 text-h6">Cargando formulario de rendicion...</p>
      </div>
    </v-overlay>

    <div v-if="!cargandoGeneral">
      <PaginaTituloIcono
        :titulo="'Validar Rendición de Cuentas'"
        :icon="'mdi-file-document-check'"
      ></PaginaTituloIcono>
      <ProyectoIdHeader
        v-if="datosFormulario"
        :proyecto-id="datosFormulario.actividad?.proyecto ?? '999999'"
      ></ProyectoIdHeader>
      <br />
      <ActividadInformacion
        v-if="datosFormulario && datosFormulario.actividad"
        :actividad-id="idActividad"
      />

      <v-row>
        <!-- Panel lateral de información -->

        <v-col cols="12" md="4" lg="3" v-if="datosFormulario && datosFormulario.actividad">
          <v-card elevation="2" rounded="lg" class="mb-4">
            <v-toolbar color="primary" density="compact">
              <v-toolbar-title class="text-white">Información General</v-toolbar-title>
            </v-toolbar>
            <v-card-text class="pa-4">
              <div class="info-item mb-3">
                <div class="text-subtitle-2 text-medium-emphasis">Actividad:</div>
                <div class="text-body-1 font-weight-medium">
                  {{ datosFormulario.actividad?.nombreCorto || 'No disponible' }}
                </div>
              </div>
              <div class="info-item mb-3">
                <div class="text-subtitle-2 text-medium-emphasis">Estado:</div>
                <v-chip color="warning" size="small" class="mt-1">
                  <v-icon small class="mr-1">mdi-progress-clock</v-icon>
                  {{ datosFormulario.actividad?.estado || 'Pendiente' }}
                </v-chip>
              </div>
            </v-card-text>
          </v-card>

          <RevisorRendicionCuentas></RevisorRendicionCuentas>
          <RedactorRendicionCuentas></RedactorRendicionCuentas>

          <!--Componente para el estado y validacion -->
          <!-- <v-card elevation="2" rounded="lg" class="mb-4">
            <v-toolbar color="secondary" density="compact">
              <v-toolbar-title class="text-white">Estado de Validación</v-toolbar-title>
            </v-toolbar>
            <v-card-text class="pa-4 text-center">
              <p class="text-caption text-medium-emphasis">
                Aquí se integrará el componente de estado de validación
              </p>
            </v-card-text>
          </v-card> -->

          <!-- Tarjeta de resumen rápido -->
          <!-- <v-card elevation="2" rounded="lg" class="mb-4">
            <v-toolbar color="secondary" density="compact">
              <v-toolbar-title class="text-white">Resumen de Rendición</v-toolbar-title>
            </v-toolbar>
            <v-card-text class="pa-4">
              <div class="d-flex justify-space-between align-center mb-2">
                <span class="text-subtitle-2 text-medium-emphasis">Monto asignado:</span>
                <span class="text-body-1 font-weight-bold text-primary">
                  Bs. {{ Number(formData.monto_asignado || 0).toLocaleString() }}
                </span>
              </div>
              <div class="d-flex justify-space-between align-center mb-2">
                <span class="text-subtitle-2 text-medium-emphasis">Monto descargado:</span>
                <span class="text-body-1 font-weight-bold text-error">
                  Bs. {{ Number(formData.monto_gastado || 0).toLocaleString() }}
                </span>
              </div>
              <v-divider class="my-2"></v-divider>
              <div class="d-flex justify-space-between align-center mb-2">
                <span class="text-subtitle-2 text-medium-emphasis">Saldo:</span>
                <span class="text-body-1 font-weight-medium"> Bs. {{ saldoPorReembolsar }} </span>
              </div>
              <div class="d-flex justify-space-between align-center">
                <span class="text-subtitle-2 text-medium-emphasis">Items de gasto:</span>
                <span class="text-body-1 font-weight-medium">
                  {{ formDataRC.detalle_gastos.length }}
                </span>
              </div>
            </v-card-text>
          </v-card> -->
        </v-col>

        <!-- Formulario principal -->
        <v-col cols="12" md="8" lg="9">
          <v-card elevation="2" rounded="lg">
            <v-toolbar color="primary" density="compact">
              <v-toolbar-title class="text-white">
                <v-icon class="mr-2">mdi-form-textbox</v-icon>
                Formulario de Rendición
              </v-toolbar-title>
            </v-toolbar>

            <v-card-text class="pa-4">
              <v-form ref="form" @submit.prevent="submitForm">
                <!-- Sección: Responsable del Cargo de Cuenta -->
                <div class="form-section mb-6">
                  <h3 class="text-h6 mb-4 primary--text">
                    <v-icon color="primary" class="mr-2">mdi-account-details</v-icon>
                    Responsable del Cargo de Cuenta
                  </h3>
                  <v-row>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="formData.nombre"
                        label="Nombre"
                        variant="outlined"
                        density="compact"
                        bg-color="grey-lighten-4"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="formData.paterno"
                        label="Apellido paterno"
                        variant="outlined"
                        density="compact"
                        bg-color="grey-lighten-4"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="formData.materno"
                        label="Apellido materno"
                        variant="outlined"
                        density="compact"
                        bg-color="grey-lighten-4"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="formData.documento_identidad"
                        label="Documento de Identidad"
                        variant="outlined"
                        density="compact"
                        bg-color="grey-lighten-4"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="formData.cargo"
                        label="Cargo"
                        variant="outlined"
                        density="compact"
                        bg-color="grey-lighten-4"
                        readonly
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </div>

                <v-divider class="my-4"></v-divider>

                <!-- Sección: Cargo de Cuenta -->
                <div class="form-section mb-6">
                  <h3 class="text-h6 mb-4 primary--text">
                    <v-icon color="primary" class="mr-2">mdi-cash-register</v-icon>
                    Cargo de Cuenta
                  </h3>

                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="formDataRC.cpte_diario"
                        label="Cpte. Diario"
                        variant="outlined"
                        density="compact"
                        bg-color="blue-lighten-5"
                        :readonly="soloLectura"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="formDataRC.fecha_desembolso"
                        label="Fecha de Desembolso"
                        variant="outlined"
                        density="compact"
                        bg-color="blue-lighten-5"
                        type="date"
                        :readonly="soloLectura"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        v-model="formDataRC.descripcion_actividadRC"
                        label="Descripción de la Actividad que se realizo"
                        variant="outlined"
                        bg-color="blue-lighten-5"
                        rows="3"
                        :readonly="soloLectura"
                      ></v-textarea>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="formData.fuente_financiamiento"
                        label="Fuente de Financiamiento"
                        variant="outlined"
                        density="compact"
                        bg-color="grey-lighten-4"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="formDataRC.lugar_actividadRC"
                        label="Lugar donde se realizo la Actividad"
                        variant="outlined"
                        density="compact"
                        bg-color="blue-lighten-5"
                        :readonly="soloLectura"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="formDataRC.fecha_actividadRC"
                        label="Fecha de la realización de Actividad"
                        variant="outlined"
                        density="compact"
                        bg-color="blue-lighten-5"
                        type="date"
                        :readonly="soloLectura"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="formData.monto_asignado"
                        label="Monto Asignado (Bs.)"
                        variant="outlined"
                        density="compact"
                        bg-color="blue-lighten-5"
                        :readonly="soloLectura"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="formData.monto_gastado"
                        label="Monto Descargado (Bs.)"
                        variant="outlined"
                        density="compact"
                        bg-color="grey-lighten-4"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="saldoPorReembolsar"
                        label="Saldo por Reembolsar (Bs.)"
                        variant="outlined"
                        density="compact"
                        bg-color="grey-lighten-4"
                        readonly
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </div>

                <v-divider class="my-4"></v-divider>

                <!-- Sección: Detalle de Gastos -->
                <div class="form-section mb-6">
                  <h3 class="text-h6 mb-4 primary--text">
                    <v-icon color="primary" class="mr-2">mdi-cash</v-icon>
                    Detalle del Gasto
                  </h3>

                  <div class="d-flex justify-space-between align-center mb-4">
                    <v-btn
                      color="primary"
                      variant="outlined"
                      prepend-icon="mdi-plus"
                      @click="agregarGasto"
                      :disabled="soloLectura"
                    >
                      Agregar Item
                    </v-btn>
                    <v-chip class="text-subtitle-1" color="primary" variant="outlined">
                      Monto Total de Gasto (Bs.): {{ totalMontoGastado }}
                    </v-chip>
                  </div>

                  <v-table class="elevation-1 rounded-lg mb-4 users-table">
                    <thead>
                      <tr>
                        <th class="text-subtitle-2 font-weight-bold fecha-column">Fecha</th>
                        <th class="text-subtitle-2 font-weight-bold">Partida</th>
                        <th class="text-subtitle-2 font-weight-bold">Fuente</th>
                        <th class="text-subtitle-2 font-weight-bold">Factura/Recibo</th>
                        <th class="text-subtitle-2 font-weight-bold">Descripción</th>
                        <th class="text-subtitle-2 font-weight-bold">Monto (Bs.)</th>
                        <th class="text-subtitle-2 font-weight-bold text-center">Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(gasto, index) in formDataRC.detalle_gastos" :key="index">
                        <td class="fecha-column">
                          <v-text-field
                            v-model="gasto.fecha"
                            type="date"
                            variant="outlined"
                            density="compact"
                            hide-details
                            bg-color="blue-lighten-5"
                            class="fecha-input"
                            :readonly="soloLectura"
                          ></v-text-field>
                        </td>
                        <td class="narrow-column">
                          <v-text-field
                            v-model="gasto.partida"
                            variant="outlined"
                            density="compact"
                            hide-details
                            bg-color="blue-lighten-5"
                            placeholder="1.1.1"
                            class="compact-field"
                            :readonly="soloLectura"
                          ></v-text-field>
                        </td>
                        <td class="narrow-column">
                          <v-text-field
                            v-model="gasto.fuente"
                            variant="outlined"
                            density="compact"
                            hide-details
                            bg-color="blue-lighten-5"
                            placeholder="Financiador"
                            :readonly="soloLectura"
                          ></v-text-field>
                        </td>
                        <td>
                          <v-text-field
                            v-model="gasto.factura_recibo"
                            variant="outlined"
                            density="compact"
                            hide-details
                            bg-color="blue-lighten-5"
                            :readonly="soloLectura"
                          ></v-text-field>
                        </td>
                        <td class="wide-column">
                          <v-text-field
                            v-model="gasto.descripcion_gasto"
                            variant="outlined"
                            density="compact"
                            hide-details
                            bg-color="blue-lighten-5"
                            placeholder="Descripción del gasto"
                            :readonly="soloLectura"
                          ></v-text-field>
                        </td>
                        <td class="narrow-column">
                          <v-text-field
                            v-model.number="gasto.monto"
                            type="number"
                            variant="outlined"
                            density="compact"
                            hide-details
                            bg-color="blue-lighten-5"
                            placeholder="0.00"
                            min="0"
                            class="compact-field"
                            :readonly="soloLectura"
                          ></v-text-field>
                        </td>
                        <td class="text-center action-column">
                          <v-btn
                            icon
                            color="error"
                            size="small"
                            variant="text"
                            @click="eliminarGasto(index)"
                            :disabled="soloLectura"
                          >
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </td>
                        onMo
                      </tr>
                    </tbody>
                  </v-table>
                </div>

                <v-divider class="my-4"></v-divider>

                <!-- Sección: Información Adicional -->
                <div class="form-section mb-6">
                  <h3 class="text-h6 mb-4 primary--text">
                    <v-icon color="primary" class="mr-2">mdi-information</v-icon>
                    Información Adicional
                  </h3>

                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.lugar_solicitud"
                        label="Lugar donde se realiza la Rendición de Cuentas"
                        variant="outlined"
                        bg-color="blue-lighten-5"
                        :readonly="soloLectura"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.fecha_solicitud"
                        label="Fecha de Rendición de Cuentas"
                        type="date"
                        variant="outlined"
                        density="compact"
                        bg-color="grey-lighten-4"
                        readonly
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </div>

                <v-divider class="my-4"></v-divider>

                <!-- Sección: Firmas -->
                <!-- <div class="form-section mb-6">
                  <h3 class="text-h6 mb-4 primary--text">
                    <v-icon color="primary" class="mr-2">mdi-signature</v-icon>
                    Firmas y Validaciones
                  </h3>

                  <v-row>
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="formDataRC.idcoordinador"
                        :items="coordinadoresList"
                        :item-title="getNombreCompleto"
                        item-value="id"
                        label="Responsable Coordinación"
                        variant="outlined"
                        bg-color="blue-lighten-5"
                        :readonly="soloLectura"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" md="6" class="d-flex align-center">
                      <v-checkbox
                        v-model="formData.validacion_coordinador"
                        :label="`Aprobado por Coordinación ${puedeValidarCoordinador ? '(Usted)' : ''}`"
                        :disabled="!puedeValidarCoordinador || formData.validacion_coordinador"
                        :readonly="!puedeValidarCoordinador || formData.validacion_coordinador"
                        :color="puedeValidarCoordinador ? 'primary' : 'grey'"
                        @update:modelValue="
                          (newValue) => {
                            if (newValue) {
                              nextTick(() => {
                                validarRendicion(
                                  'coordinador',
                                  formDataRC.idcoordinador,
                                  coordinadoresList,
                                )
                              })
                            }
                          }
                        "
                      ></v-checkbox>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="formDataRC.idcontador"
                        :items="contadoresList"
                        :item-title="getNombreCompleto"
                        item-value="id"
                        label="Responsable Contable"
                        variant="outlined"
                        bg-color="blue-lighten-5"
                        :readonly="soloLectura"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" md="6" class="d-flex align-center">
                      <v-checkbox
                        v-model="formData.validacion_contador"
                        :label="`Aprobado por Contable ${puedeValidarContador ? '(Usted)' : ''}`"
                        :disabled="!puedeValidarContador || formData.validacion_contador"
                        :readonly="!puedeValidarContador || formData.validacion_contador"
                        :color="puedeValidarContador ? 'primary' : 'grey'"
                        @update:modelValue="
                          (newValue) => {
                            if (newValue) {
                              nextTick(() => {
                                validarRendicion('contador', formDataRC.idcontador, contadoresList)
                              })
                            }
                          }
                        "
                      ></v-checkbox>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="formDataRC.idadministrador"
                        :items="administradoresList"
                        :item-title="getNombreCompleto"
                        item-value="id"
                        label="Responsable Dirección Administrativa"
                        variant="outlined"
                        bg-color="blue-lighten-5"
                        :readonly="soloLectura"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" md="6" class="d-flex align-center">
                      <v-checkbox
                        v-model="formData.validacion_administrador"
                        :label="`Aprobado por Dirección Administrativa ${puedeValidarAdministrador ? '(Usted)' : ''}`"
                        :disabled="!puedeValidarAdministrador || formData.validacion_administrador"
                        :readonly="!puedeValidarAdministrador || formData.validacion_administrador"
                        :color="puedeValidarAdministrador ? 'primary' : 'grey'"
                        @update:modelValue="
                          (newValue) => {
                            if (newValue) {
                              nextTick(() => {
                                validarRendicion(
                                  'administrador',
                                  formDataRC.idadministrador,
                                  administradoresList,
                                )
                              })
                            }
                          }
                        "
                      ></v-checkbox>
                    </v-col>
                  </v-row>
                </div> -->

                <!-- Botones de acción -->
                <div class="d-flex justify-end gap-3 mt-8">
                  <v-btn
                    color="error"
                    variant="outlined"
                    size="large"
                    prepend-icon="mdi-cancel"
                    :to="`/pei/listaactividades?showButton=2`"
                  >
                    Cancelar
                  </v-btn>
                  <v-btn
                    v-if="idActividad && !idTarea"
                    color="info"
                    variant="outlined"
                    size="large"
                    prepend-icon="mdi-file-pdf-box"
                    @click="generarPdfSolicitudFondosFunc"
                    :loading="loadingPdfSolicitud"
                    :disabled="!idActividad || loadingPdfSolicitud"
                  >
                    SF
                  </v-btn>

                  <v-btn
                    v-if="idActividad && idTarea"
                    color="info"
                    variant="outlined"
                    size="large"
                    prepend-icon="mdi-file-pdf-box"
                    @click="generarPdfSolicitudSubactividadFunc"
                    :loading="loadingPdfSubactividad"
                    :disabled="!idActividad || !idTarea || loadingPdfSubactividad"
                  >
                    SFS
                  </v-btn>
                  <v-btn
                    color="secondary"
                    variant="outlined"
                    size="large"
                    prepend-icon="mdi-backspace-outline"
                    @click="resetForm"
                    disabled
                  >
                    Limpiar
                  </v-btn>
                  <v-btn
                    color="primary"
                    variant="flat"
                    size="large"
                    prepend-icon="mdi-send"
                    disabled
                  >
                    Enviar Rendicion
                  </v-btn>
                  <v-btn
                    color="primary"
                    variant="flat"
                    size="large"
                    prepend-icon="mdi-update"
                    type="submit"
                    :loading="loading"
                    :disabled="soloLectura"
                  >
                    Actualizar
                  </v-btn>
                </div>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'
import ProyectoIdHeader from '@/modules/proyecto/components/partials/ProyectoIdHeader.vue'
import ActividadInformacion from '@/modules/proyecto/components/partials/ActividadInformacion.vue'
import { useImpresionFormularios } from '@/modules/impresiones/composables/useImpresionFormularios'
import { useUsuario } from '@/modules/usuarios/composables/useUsuario'
import { useUserStore } from '@/stores/user'
import * as XLSX from 'xlsx'
import { useRoute, useRouter } from 'vue-router'
import { useNotificaciones } from '@/modules/notificacion/composables/useNotificaciones'
import { useRendicionCuentasStore } from '@/modules/formularios/store/useRendicionCuentasStore'
import RevisorRendicionCuentas from '@/modules/formularios/components/validadores/componenteEstadoVotacion/RevisorRendicionCuentas.vue'
import RedactorRendicionCuentas from '@/modules/formularios/components/validadores/componenteRedactorEstadoValidacion/RedactorRendicionCuentas.vue'

//Iniciar el store
const storeRendicion = useRendicionCuentasStore()

//Inicar Composable
const { enviarMensajeAutomatico } = useNotificaciones()
//Inicializar el composable
const { generarPdfRendicionCuentas, generarPdfRendicionCuentasTareas } = useImpresionFormularios()
/*************************** Generar PDFs *******************************************/
const loadingPdfSolicitud = ref(false)
const loadingPdfSubactividad = ref(false)

const generarPdfSolicitudFondosFunc = async () => {
  if (!idActividad) return

  loadingPdfSolicitud.value = true
  try {
    // Aquí iría tu lógica para generar el PDF de solicitud de fondos
    console.log('Generando PDF Solicitud de Fondos para actividad:', idActividad)
    await generarPdfRendicionCuentas(idSolicitud)
  } catch (error) {
    console.error('Error al generar PDF Solicitud de Fondos:', error)
    alert('Error al generar el PDF: ' + error.message)
  } finally {
    loadingPdfSolicitud.value = false
  }
}

const generarPdfSolicitudSubactividadFunc = async () => {
  if (!idActividad || !idTarea) return

  loadingPdfSubactividad.value = true
  try {
    await generarPdfRendicionCuentasTareas(idSolicitud)
  } catch (error) {
    console.error('Error al generar PDF Subactividad:', error)
    alert('Error al generar el PDF de subactividad: ' + error.message)
  } finally {
    loadingPdfSubactividad.value = false
  }
}
/*************************** Fin Generar PDFs *******************************************/

const router = useRouter()
const route = useRoute()
const idActividad = route.params.id || null
const idTarea = route.query.tarea_id || null
const idSolicitud = route.query.solicitud_id || null
console.log('ID Solicitud:', idSolicitud)
console.log('ID Actividad:', idActividad)
console.log('ID Tarea:', idTarea)

const userStore = useUserStore()
const usuario1 = computed(() => {
  return {
    nombre: userStore.usuario,
    role: userStore.rol,
    id: userStore.id,
  }
})
console.log('ID Usuario:', usuario1.value.id)

const baseurl = import.meta.env.VITE_API_BASE

const { usuario } = useUsuario()

const idRendicionCreada = ref(null)

// --- NUEVAS VARIABLES PARA SOLICITUDES DE FONDOS ---
const solicitudesFondos = ref([])
const loadingSolicitudes = ref(false)
const solicitud = ref(null)

// Notificaciones
const snackbar = ref({ show: false, text: '', color: 'success' })

// Variables de estado
const loading = ref(false)

//variables para carga de datos
const datosFormulario = ref(null)
const datosSolicitudDeFondo = ref(null)
const datosRendicionDeCuenta = ref(null)
const numeroFormularioSF = ref(null)
const datosSolicitante = ref([])
const error = ref(null)
const isLoading = ref(false)

// Estado reactivo
const cargandoGeneral = ref(true)
const responsablesList = ref([])
const coordinadoresList = ref([])
const contadoresList = ref([])
const administradoresList = ref([])

const numeroFormulario = ref(null)

const formData = ref({
  // Campos del usuario (se llenarán automáticamente)
  nombre: '',
  paterno: '',
  materno: '',
  cargo: '',
  documento_identidad: '',
  // Campos de la actividad
  descripcion_actividad: '',
  lugar_actividad: '',
  fecha_actividad: '',
  objetivo_actividad: '',
  fecha_irealizacion: '',
  fecha_frealizacion: '',
  fuente_financiamiento: '',
  id_actividad: 0,
  id_usuario: 0,
  // Resto de campos del formulario
  detalle_destino_fondos: [
    { fecha: '', partida: '', factura_recibo: '', descripcion: '', monto: 0 },
  ],
  forma_pago: null,
  lugar_solicitud: '',
  fecha_solicitud: getCurrentDate(),
  monto_solicitado: 0,
  validacion_responsable: false,
  idresponsable: null,
  validacion_coordinador: false,
  idcoordinador: null,
  monto_asignado: 0,
  formulario_numero: '',
  validacion_contador: false,
  validacion_administrador: false,
  idcontador: null,
  idadministrador: null,
})

const formDatSF = ref({
  // Propiedades existentes...
  actividad: null,
  usuario: null,
  validadores: [],
  formaPago: [],

  // Nuevas propiedades para la solicitud de fondos
  idsf: 0,
  numeroFormulariosf: '',
  detalleDestinoFondossf: '{"items":[]}',
  formaPago_idsf: null,
  lugarSolicitudsf: '',
  fechaSolicitudsf: '',
  montoSolicitadosf: 0,
  validacionResponsablesf: false,
  responsable_idsf: null,
  validacionCoordinadorsf: false,
  coordinador_idsf: null,
  usuario_idsf: null,
  actividad_idsf: null,
  fechaRealizacionActividadsf: '',
  bloquearIconosSolFondossf: true,
})

const formDataRC = ref({
  cpte_diario: '',
  fecha_desembolso: '',
  descripcion_actividadRC: '',
  lugar_actividadRC: '',
  fecha_actividadRC: '',

  detalle_gastos: [
    { fecha: '', partida: '', fuente: '', factura_recibo: '', descripcion: '', monto: 0 },
  ],
  lugar_solicitudRC: '',
  fecha_solicitudRC: '',

  idresponsable: null,
  idcoordinador: null,
  idcontador: null,
  idadministrador: null,
  usuario_id: null,

  validacionResponsable: false,
  validacionCoordinador: false,
  validacionContador: false,
  validacionAdministrador: false,
})

const fuente_financiamiento0 = ref()
// Agrega esta propiedad computada
const soloLectura = computed(() => {
  // Si no hay datos del formulario o no hay usuario actual, por defecto true por seguridad
  if (!datosRendicionDeCuenta.value || !usuario1.value?.id) {
    return true
  }

  // Si el usuario actual es el creador de la solicitud, puede editar (soloLectura = false)
  // Si NO es el creador, solo lectura (soloLectura = true)
  return Number(datosRendicionDeCuenta.value.usuario) !== Number(usuario1.value.id)
})

const actividadData = ref({
  codigo: 'ACT-2023-005',
  descripcion: 'Capacitación en gestión de proyectos para equipos técnicos',
  estado: 'EJEC',
  tipo: [{ nombre: 'Actividad de Capacitación' }, { nombre: 'Actividad de Articulación' }],
  fecha_programada: '2023-05-15',
  fecha_cierre: '2023-06-30',
  responsable: { nombre: 'María González' },
  presupuesto: 2500,
})

// Propiedades computadas
const saldoPorReembolsar = computed(() => {
  //const montoAsignado = Number(formData.value.monto_solicitado) || 0;
  //const montoGastado = Number(totalMontoGastado.value) || 0;
  const montoAsignado = Number(formData.value.monto_asignado) || 0
  const montoGastado = Number(formData.value.monto_gastado) || 0
  //console.log('montoAsignado', montoAsignado)
  //console.log('montoGastado', montoGastado)
  return (montoAsignado - montoGastado).toFixed(2)
})

const totalMontoGastado = computed(() => {
  return formDataRC.value.detalle_gastos
    .reduce((total, gasto) => total + Number(gasto.monto || 0), 0)
    .toFixed(2)
})

const nombreCompletoSolicitante = computed(() => {
  return `${formData.value.nombre} ${formData.value.paterno} ${formData.value.materno}`.trim()
})

//Watcher para actualizar monto_gastado en formData
watch(totalMontoGastado, (newValue) => {
  formData.value.monto_gastado = Number(newValue)
})

// WATCH PARA AUTO-LLENAR FORMULARIO CUANDO LLEGUEN LOS DATOS
watch(
  datosFormulario,
  (newVal) => {
    if (newVal && newVal.usuario) {
      //console.log('Auto-llenando formulario con datos del usuario:', newVal.usuario)

      const usuario = newVal.usuario

      // Llenar campos del usuario
      //formData.value.nombre = usuario.nombre || ''
      //formData.value.paterno = usuario.paterno || ''
      //formData.value.materno = usuario.materno || ''
      //formData.value.cargo = usuario.cargo || ''
      //formData.value.documento_identidad = usuario.ci || ''
      //formData.value.id_usuario = usuario.id || 0

      // Llenar campos de la actividad si existen
      if (newVal.actividad) {
        //console.log('Auto-llenando datos de actividad:', newVal.actividad)

        //formData.value.descripcion_actividad = newVal.actividad.descripcion || ''
        formData.value.objetivo_actividad = newVal.actividad.objetivo_de_actividad || ''
        formData.value.fecha_irealizacion = newVal.actividad.fecha_inicio || ''
        formData.value.fecha_frealizacion = newVal.actividad.fecha_cierre || ''
        formData.value.id_actividad = newVal.actividad.id || 0

        if (Array.isArray(newVal.actividad.procedencia_fondos)) {
          formData.value.fuente_financiamiento = newVal.actividad.procedencia_fondos.map(
            (item) => item.nombre,
          )
        } else {
          // Si no es un array (es null, undefined, o un objeto), lo inicializa como array vacío.
          // También puedes intentar asignar el valor directamente si es una cadena o un objeto simple:
          // formData.value.fuente_financiamiento = [newVal.actividad.procedencia_fondos];
          // PERO la opción de array vacío es la más segura si esperas una lista de fuentes.
          formData.value.fuente_financiamiento = []
        }

        if (newVal.formaPago && Array.isArray(newVal.formaPago)) {
          //console.log('Formas de pago disponibles:', newVal.formaPago)
        }

        // También actualizar actividadData para el componente ActividadInformacion
        actividadData.value = {
          ...actividadData.value,
          descripcion: newVal.actividad.descripcion || actividadData.value.descripcion,
          fecha_programada: newVal.actividad.fecha_inicio || actividadData.value.fecha_programada,
          fecha_cierre: newVal.actividad.fecha_cierre || actividadData.value.fecha_cierre,
        }
      }

      // Llenar lista de validadores si existen
      if (newVal.validadores && Array.isArray(newVal.validadores)) {
        responsablesList.value = newVal.validadores.filter((user) => user.cargo === 'responsable')
        coordinadoresList.value = newVal.validadores.filter((user) => user.cargo === 'coordinador')
        contadoresList.value = newVal.validadores.filter((user) => user.cargo === 'contable')
        administradoresList.value = newVal.validadores.filter(
          (user) => user.cargo === 'dir-administrativo',
        ) //'admin')
      }
    }
  },
  { deep: true },
)

const filtrarProcedenciaFondos = () => {
  if (
    datosFormulario.value.actividad &&
    Array.isArray(datosFormulario.value.actividad.procedencia_fondos) // <= CAMBIO AQUÍ
  ) {
    fuente_financiamiento0.value = datosFormulario.value.actividad.procedencia_fondos.map(
      (item) => item.nombre,
    )
  } else {
    // Es bueno asegurarse de que siempre sea un array en caso de no encontrar datos
    fuente_financiamiento0.value = []
  }
}

watch(
  datosFormulario,
  (newVal) => {
    if (newVal) {
      filtrarProcedenciaFondos()
    }
  },
  { immediate: true },
)

// Métodos
function getNombreCompleto(user) {
  return `${user.nombre || ''} ${user.paterno || ''} ${user.materno || ''}`.trim()
}

function getCurrentDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

async function cargarDatos() {
  isLoading.value = true
  error.value = null
  try {
    const response = await fetch(baseurl + '/api/monitoreo/obtener-datos-formulario/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id_actividad: idActividad,
        usuario: usuario1.value.nombre,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(
        `Error en la solicitud: ${response.status} - ${errorData.detail || 'Error desconocido'}`,
      )
    }

    const data = await response.json()
    datosFormulario.value = data
    //console.log('Datos Para Formulario:', datosFormulario.value)
  } catch (err) {
    error.value = err.message
    console.error('Ha ocurrido un error:', err)
  } finally {
    isLoading.value = false
    //cargandoGeneral.value = false
  }
}

// Alternativa usando fetch en lugar de axios
const cargarSolicitudesFondos = async () => {
  loadingSolicitudes.value = true
  try {
    //console.log('Cargando solicitudes de fondos con fetch...')

    const response = await fetch(baseurl + '/api/solicitud-fondos/', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`)
    }

    const data = await response.json()
    //console.log('Datos recibidos con fetch:', data)
    solicitudesFondos.value = data
  } catch (error) {
    console.error('Error con fetch:', error)
    mostrarSnackbar(`Error al cargar solicitudes: ${error.message}`, 'error')
  } finally {
    loadingSolicitudes.value = false
  }
}

async function cargarRendicionesDeCuenta() {
  isLoading.value = true
  error.value = null
  try {
    const response = await fetch(baseurl + 'api/rendicion-cuentas/' + idSolicitud + '/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    //console.log('00000000000000000000000000000', actividadIdParaValidar.value, usuario.value, tareaIdParaValidar.value )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(
        `Error en la solicitud: ${response.status} - ${errorData.detail || 'Error desconocido'}`,
      )
    }

    const rawData = await response.json()
    datosRendicionDeCuenta.value = strictSanitizeData(rawData)
    //console.log('Datos Rendicion De Cuentas:', JSON.stringify(rawData, null, 2))
  } catch (err) {
    error.value = err.message
    console.error('Ha ocurrido un error:', err)
  } finally {
    isLoading.value = false
    cargandoGeneral.value = false
  }
}

async function cargarSolicitudFondos() {
  isLoading.value = true
  error.value = null
  try {
    const response = await fetch(baseurl + '/monitoreo_api/obtenerSolicitudFondos/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`)
    }

    const data = await response.json()

    // Filtrar las solicitudes por actividad_id y tarea_id
    const solicitudesFiltradas = data.solicitudes.filter((solicitud) => {
      // Convertir a string para comparación segura, o comparar convirtiendo ambos al mismo tipo
      const coincideActividad = solicitud.actividad_id?.toString() === idActividad?.toString()
      const coincideTarea = solicitud.tarea_id?.toString() === idTarea?.toString()
      const coincideSolicitud = solicitud.id?.toString() === idSolicitud?.toString()

      return coincideActividad && coincideTarea && coincideSolicitud
    })

    datosSolicitudDeFondo.value = strictSanitizeData(solicitudesFiltradas[0])
    actualizarDatosFormulario(solicitudesFiltradas[0])
  } catch (err) {
    error.value = err.message
    console.error('Error al cargar solicitudes:', err)
  } finally {
    isLoading.value = false
    //cargandoGeneral.value = false
  }
}

function sanitizeData(data) {
  if (data === null || data === undefined) {
    return ''
  }

  if (typeof data === 'string') {
    // Limpiar strings: trim y convertir empty strings a ''
    const trimmed = data.trim()
    return trimmed === '' ? '' : trimmed
  }

  if (typeof data === 'number') {
    // Validar que sea un número finito
    return isFinite(data) ? data : 0
  }

  if (typeof data === 'boolean') {
    return data
  }

  if (Array.isArray(data)) {
    // Sanitizar cada elemento del array
    return data
      .map((item) => sanitizeData(item))
      .filter((item) => item !== null && item !== undefined && item !== '')
  }

  if (typeof data === 'object') {
    const sanitized = {}
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const value = data[key]
        // Solo incluir propiedades con valores válidos
        if (value !== null && value !== undefined && value !== '') {
          sanitized[key] = sanitizeData(value)
        }
      }
    }
    return sanitized
  }

  // Para cualquier otro tipo de dato, retornar string vacío
  return ''
}

function strictSanitizeData(data) {
  const sanitized = sanitizeData(data)

  // Si el resultado es un objeto vacío, retornar string vacío
  if (typeof sanitized === 'object' && !Array.isArray(sanitized)) {
    if (Object.keys(sanitized).length === 0) {
      return ''
    }
  }

  return sanitized
}

// Agrega este watch para actualizar automáticamente cuando cambien los datosSolicituDeFondo
watch(
  datosSolicitudDeFondo,
  (newVal) => {
    if (newVal && newVal.detalleDestinoFondos) {
      actualizarDetalleDestinoFondos(newVal.detalleDestinoFondos)
    }
  },
  { deep: true },
)

watch(
  datosRendicionDeCuenta,
  (newVal) => {
    if (newVal) {
      //console.log('@@@@@@@@@@@@@', JSON.stringify(newVal, null, 2));
      const idSolicitante = newVal.usuario
      //console.log('ID Solicitante:', idSolicitante)
      datosSolicitante.value = datosFormulario.value?.validadores?.find(
        (fp) => fp.id === idSolicitante,
      )
      //console.log('Datos Solicitante:', JSON.stringify(datosSolicitante.value, null, 2))
      if (datosSolicitante.value) {
        formData.value.nombre = datosSolicitante.value.nombre
        formData.value.paterno = datosSolicitante.value.paterno
        formData.value.materno = datosSolicitante.value.materno
        formData.value.documento_identidad = datosSolicitante.value.ci
        formData.value.cargo = datosSolicitante.value.cargo
        formData.value.correo = datosSolicitante.value.correo
      } else {
        console.warn('No se encontró el solicitante con ID:', idSolicitante)
      }
      // Función helper para manejar valores null/undefined
      const getSafeValue = (value, defaultValue = '') => {
        return value !== null && value !== undefined ? value : defaultValue
      }
      formData.value.lugar_solicitud = newVal.lugarRendicion
      formDataRC.value.idadministrador = newVal.administrador
      formDataRC.value.idcoordinador = newVal.coordinador
      formDataRC.value.idcontador = newVal.contador

      formDataRC.value.cpte_diario = getSafeValue(newVal.cpteDiario)
      formData.value.cpte_diario = getSafeValue(newVal.cpteDiario)
      formDataRC.value.fecha_desembolso = getSafeValue(newVal.fechaDesembolso)
      formDataRC.value.descripcion_actividadRC = getSafeValue(newVal.descripcionActividad)
      formDataRC.value.lugar_actividadRC = getSafeValue(newVal.lugarActividad)
      formDataRC.value.fecha_actividadRC = getSafeValue(newVal.fechaActividad)
      formDataRC.value.lugar_solicitudRC = getSafeValue(newVal.lugarRendicion)
      formDataRC.value.fecha_solicitudRC = getSafeValue(newVal.fechaRendicion)
      formData.value.monto_asignado = newVal.montoAsignado

      // Asignar detalles de gastos
      if (newVal.detalleDestinoFondos) {
        formDataRC.value.detalle_gastos = actualizarDetalleGastos(newVal.detalleDestinoFondos)
      }

      formData.value.validacion_responsable = getSafeValue(newVal.validacionResponsable, false)
      formData.value.validacion_coordinador = getSafeValue(newVal.validacionCoordinador, false)
      formData.value.validacion_contador = getSafeValue(newVal.validacionContador, false)
      formData.value.validacion_administrador = getSafeValue(newVal.validacionAdministrador, false)

      if (newVal.responsable_id) {
        formDataRC.value.idresponsable = getSafeValue(newVal.responsable_id)
        formData.value.idresponsable = getSafeValue(newVal.responsable_id)
      }
      if (newVal.coordinador_id) {
        formDataRC.value.idcoordinador = getSafeValue(newVal.coordinador_id)
        formData.value.idcoordinador = getSafeValue(newVal.coordinador_id)
      }
      if (newVal.contador_id) {
        formDataRC.value.idcontador = getSafeValue(newVal.contador_id)
        formData.value.idcontador = getSafeValue(newVal.contador_id)
      }
      if (newVal.administrador_id) {
        formDataRC.value.idadministrador = getSafeValue(newVal.administrador_id)
        formData.value.idadministrador = getSafeValue(newVal.administrador_id)
      }
      if (newVal.usuario) {
        formDataRC.value.usuario_id = getSafeValue(newVal.usuario)
        formData.value.usuario = getSafeValue(newVal.usuario)
      }
    }
  },
  { deep: true, immediate: true },
)

// Función para actualizar datosFormulario con los valores de la solicitud
function actualizarDatosFormulario(solicitud) {
  if (!solicitud) return

  // Actualizar las propiedades de datosFormulario con los valores de la solicitud
  formDatSF.value.idsf = solicitud.id || 0
  formDatSF.value.numeroFormulariosf = solicitud.numeroFormulario || ''
  formDatSF.value.detalleDestinoFondossf = solicitud.detalleDestinoFondos || '{"items":[]}'
  formDatSF.value.formaPago_idsf = solicitud.formaPago_id || null
  formDatSF.value.lugarSolicitudsf = solicitud.lugarSolicitud || ''
  formDatSF.value.fechaSolicitudsf = solicitud.fechaSolicitud || ''
  formDatSF.value.montoSolicitadosf = solicitud.montoSolicitado || 0
  formDatSF.value.validacionResponsablesf = solicitud.validacionResponsable || false
  formDatSF.value.responsable_idsf = solicitud.responsable_id || null
  formDatSF.value.validacionCoordinadorsf = solicitud.validacionCoordinador || false
  formDatSF.value.coordinador_idsf = solicitud.coordinador_id || null
  formDatSF.value.usuario_idsf = solicitud.usuario_id || null
  formDatSF.value.actividad_idsf = solicitud.actividad_id || null
  formDatSF.value.fechaRealizacionActividadsf = solicitud.fechaRealizacionActividad || ''
  formDatSF.value.bloquearIconosSolFondossf = solicitud.bloquearIconosSolFondos || true

  //console.log('datosFormulario actualizado con los valores de la solicitud:', datosFormulario.value)

  actualizarDetalleDestinoFondos(solicitud.detalleDestinoFondos)

  // Actualizar los campos de Información Adicional
  actualizarInformacionAdicional()
  actualizarValidadores()
}

function actualizarDetalleGastos(detalleDestinoFondos) {
  try {
    if (!detalleDestinoFondos) {
      return []
    }

    // Si es un string JSON, parsearlo
    let detalleParseado = detalleDestinoFondos
    if (typeof detalleDestinoFondos === 'string') {
      detalleParseado = JSON.parse(detalleDestinoFondos)
    }

    // Mapear al formato que espera formDataRC
    if (Array.isArray(detalleParseado)) {
      return detalleParseado.map((item, index) => ({
        fecha: item.fecha || '',
        partida: item.partida || `${index + 1}.${index + 1}.${index + 1}`,
        fuente: item.fuente || '',
        factura_recibo: item.factura_recibo || '',
        descripcion_gasto: item.descripcion || item.descripcion_gasto || '',
        monto: item.monto || 0,
      }))
    } else if (detalleParseado.items && Array.isArray(detalleParseado.items)) {
      return detalleParseado.items.map((item, index) => ({
        fecha: item.fecha || '',
        partida: item.partida || `${index + 1}.${index + 1}.${index + 1}`,
        fuente: item.fuente || '',
        factura_recibo: item.factura_recibo || item.numero_factura || '',
        descripcion_gasto: item.descripcion || item.concepto || '',
        monto: item.monto || 0,
      }))
    }

    return []
  } catch (error) {
    console.error('Error al parsear detalle de gastos:', error)
    return []
  }
}

// Función para parsear y actualizar el detalle de destino de fondos
function actualizarDetalleDestinoFondos(detalleDestinoFondos) {
  try {
    if (!detalleDestinoFondos) {
      formData.value.detalle_destino_fondos = []
      return
    }

    // Parsear el JSON string
    const detalleParseado = JSON.parse(detalleDestinoFondos)

    // Mapear al formato que espera la tabla
    formData.value.detalle_destino_fondos = detalleParseado.items.map((item, index) => ({
      partida: `${index + 1}.${index + 1}.${index + 1}`, // Generar partida automáticamente o usar una lógica específica
      descripcion_gasto: item.concepto || '',
      monto: item.monto || 0,
    }))

    //console.log('Detalle de destino de fondos actualizado:', formData.value.detalle_destino_fondos)
  } catch (error) {
    console.error('Error al parsear detalleDestinoFondos:', error)
    formData.value.detalle_destino_fondos = []
  }
}

async function validarRendicion(tipoValidador, idValidador, ListaValidadores) {
  // Verificar permisos según el tipo de validador
  let tienePermiso = false
  let claveValidacion = ''
  let nombreValidador = ''

  console.log('ListaValidadores:', JSON.stringify(idValidador, null, 2))
  console.log('ListaValidadores:', JSON.stringify(ListaValidadores, null, 2))

  const validadorEncontrado = ListaValidadores.find((validador) => validador.id === idValidador)
  console.log('validador', validadorEncontrado)
  const validador = getNombreCompleto(validadorEncontrado)
  console.log('VALIDADOR SELECCIONADO:', validador)

  switch (tipoValidador) {
    case 'responsable':
      tienePermiso = puedeValidarResponsable.value
      claveValidacion = 'validacionResponsable'
      nombreValidador = validador
      break
    case 'coordinador':
      tienePermiso = puedeValidarCoordinador.value
      claveValidacion = 'validacionCoordinador'
      nombreValidador = validador
      break
    case 'contador':
      tienePermiso = puedeValidarContador.value
      claveValidacion = 'validacionContador'
      nombreValidador = validador
      break
    case 'administrador':
      tienePermiso = puedeValidarAdministrador.value
      claveValidacion = 'validacionAdministrador'
      nombreValidador = validador
      break
    default:
      alert('Tipo de validador no reconocido.')
      return
  }

  if (!tienePermiso) {
    alert('Usted no está autorizado para validar esta rendición como ' + tipoValidador + '.')
    formData.value[claveValidacion] = false
    return
  }

  // Crear el payload específico para la validación
  const payload = {
    //id: datosRendicionDeCuenta.value?.id || idSolicitud,
    [claveValidacion]: true,
  }

  console.log('Payload Validar:', JSON.stringify(payload, null, 2))

  // Ejecutar la llamada PATCH
  loading.value = true
  try {
    const response = await fetch(baseurl + 'api/rendicion-cuentas/' + idSolicitud + '/', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(
        `Error al actualizar: ${response.status} - ${errorData.detail || errorData.mensaje || 'Error desconocido'}`,
      )
    }

    //console.log('blalalb',JSON.stringify(datosRendicionDeCuenta.value, null, 2))
    //console.log('blalalb',JSON.stringify(formData.value.correo, null, 2))
    ////////////////////////envio de mensajes y correo//////////////////////
    const data = await response.json()
    //console.log('Rendición enviada con éxito:', responseData);
    numeroFormulario.value = data.numero_formulario
    const urlForm = `${window.location.origin}/monitoreo/formulario022/${formData.value.id_actividad}?solicitud_id=${data.id}${formData.value.id_tarea ? `&tarea_id=${formData.value.id_tarea}` : ''}`

    const cuerpoMensaje = {
      destinatario_id: datosRendicionDeCuenta.value.usuario,
      asunto: 'Rendicion de Cuentas',
      contenido: 'Solicitud Aprobada ' + numeroFormulario.value + '. URL: ' + urlForm,
      tipo: 'sistema',
      prioridad: 3,
    }
    await enviarMensajeAutomatico(cuerpoMensaje)
    console.log('mensaje ok')

    //////////////////////////// correo a solicitante////////////////////////
    //Bandera de carga
    const isLoading = ref(false)

    //Incializar el composable
    const { enviarEmailAprobacion, enviarEmailRechazo } = useNotificaciones()

    const datosAprobacion = {
      emails: [formData.value.correo], //['gaboowill@protonmail.com', 'olivguil9@gmail.com'],
      datos_aprobacion: {
        codigo: 'SOL-2024',
        titulo: 'Actividad Talleres',
        solicitante_nombre: nombreCompletoSolicitante.value,
        aprobador_nombre: nombreValidador,
        numero_aprobacion: 'No de aprov',
        url_detalles: 'Aqui va la URL',
      },
    }

    console.log('mmmmmmmmmmmmmmmmmmmm', JSON.stringify(datosAprobacion, null, 2))

    // //Metodo de prueba
    // const probarEnvioEmail = async () => {
    //   console.log('🔄 Ejecutando prueba...')
    //   isLoading.value = true

    //   //Datos para el email de Aprobacion
    //   const datosAprobacion = {
    //     emails: ['gaboowill@protonmail.com'],//[formData.value.correo],//['gaboowill@protonmail.com', 'olivguil9@gmail.com'],
    //     datos_aprobacion: {
    //       codigo: 'SOL-2024',
    //       titulo: 'Actividad Talleres',
    //       solicitante_nombre: nombreCompletoSolicitante.value,
    //       aprobador_nombre: nombreValidador,
    //       numero_aprobacion: 'No de aprov',
    //       url_detalles: 'Aqui va la URL',
    //     },
    //   }

    //   const datosRechazo = {
    //     emails: ['rolquezamarcelo@gmail.com', 'olivguil9@gmail.com'],
    //     datos_rechazo: {
    //       codigo: 'SOL-2024',
    //       titulo: 'Actividad Talleres',
    //       solicitante_nombre: 'Marky Mark',
    //       aprobador_nombre: 'Ale Carvajal',
    //       motivo_rechazo: 'se rechazo la solicitud por',
    //       url_detalles: 'URL',
    //     },
    //   }

    try {
      await enviarEmailAprobacion(datosAprobacion)
      await enviarEmailRechazo(datosRechazo)
      console.log('Prueba ejecutada')
    } catch (error) {
      console.error(error)
    } finally {
      isLoading.value = false
    }
    //}
    ////////////////////////////////////////////////////////////////////

    ///////// Enviar notificación por correo a solicitante//////////
    // try {
    //   const emailPayload = {
    //     emails: [formData.value.correo].filter(
    //       (email) => email,
    //     ),
    //     datos_solicitud: {
    //       codigo: numeroFormulario.value || 'SOL-PROV',
    //       titulo: 'Validacion de Rendicion de Cuentas',
    //       solicitante: nombreCompletoSolicitante.value,
    //       tipo: 'Rendicion de Cuentas',
    //       prioridad: 'alta',
    //       descripcion:
    //         formData.value.descripcion_actividad || 'Rendicion de Cuentas para actividad',
    //       url_revision: `${window.location.origin}/monitoreo/formulario022/${formData.value.id_actividad}?solicitud_id=${data.id}${formData.value.id_tarea ? `&tarea_id=${formData.value.id_tarea}` : ''}`,
    //     },
    //   }

    //   console.log('emailPayload enviado:', JSON.stringify(emailPayload, null, 2))

    //   const emailResponse = await fetch(baseurl + 'api-msg/correos/solicitud-pendiente/', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(emailPayload),
    //   })

    //   if (emailResponse.ok) {
    //     console.log('Correo de notificación enviado exitosamente')
    //   } else {
    //     console.warn('No se pudo enviar el correo de notificación')
    //   }
    // } catch (emailError) {
    //   console.error('Error al enviar correo de notificación:', emailError)
    //   // No detenemos el flujo si falla el envío del correo
    // }
    ////////////////////////////////////////////////////////////////////
    //const result = await response.json();
    alert('Rendición validada exitosamente.')

    // Recargar los datos para reflejar los cambios
    await cargarRendicionesDeCuenta()
  } catch (err) {
    console.error('Error al validar la rendición:', err)
    alert(`Error al validar la rendición: ${err.message}`)

    // Revertir el cambio en caso de error
    formData.value[claveValidacion] = false
  } finally {
    loading.value = false
  }
}

// Función para actualizar los campos de Información Adicional
function actualizarInformacionAdicional() {
  // Actualizar forma_pago
  formData.value.forma_pago = formDatSF.value.formaPago_idsf

  // Actualizar lugar_solicitud
  formData.value.lugar_solicitud = formDatSF.value.lugarSolicitudsf

  // Actualizar fecha_solicitud
  formData.value.fecha_solicitud = formDatSF.value.fechaSolicitudsf
}

// Función para extraer y formatear los validadores por ID
function actualizarValidadores() {
  if (!datosFormulario.value || !datosFormulario.value.validadores) return

  // Buscar responsable por ID
  const responsable = datosFormulario.value.validadores.find(
    (validador) => validador.id === formDatSF.value.responsable_idsf,
  )

  // Buscar coordinador por ID
  const coordinador = datosFormulario.value.validadores.find(
    (validador) => validador.id === formDatSF.value.coordinador_idsf,
  )

  // Actualizar formData con los IDs encontrados
  if (responsable) {
    formData.value.idresponsable = responsable.id
    //console.log('Responsable encontrado:', getNombreCompleto(responsable))
  } else {
    console.warn('No se encontró responsable con ID:', formDatSF.value.responsable_idsf)
  }

  if (coordinador) {
    formData.value.idcoordinador = coordinador.id
    //console.log('Coordinador encontrado:', getNombreCompleto(coordinador))
  } else {
    console.warn('No se encontró coordinador con ID:', formDatSF.value.coordinador_idsf)
  }

  // También actualizar las listas de responsables y coordinadores si es necesario
  actualizarListasValidadores()
}

// Función para actualizar las listas de responsables y coordinadores
function actualizarListasValidadores() {
  if (!datosFormulario.value || !datosFormulario.value.validadores) return

  // Filtrar responsables (puedes ajustar la lógica según el cargo)
  responsablesList.value = datosFormulario.value.validadores.filter(
    (validador) => validador.cargo && validador.cargo.toLowerCase().includes('responsable'),
  )

  // Filtrar coordinadores (puedes ajustar la lógica según el cargo)
  coordinadoresList.value = datosFormulario.value.validadores.filter(
    (validador) => validador.cargo && validador.cargo.toLowerCase().includes('coordinador'),
  )
}

// Obtener información de solicitud de fondos para una actividad (y opcionalmente una tarea)
const getSolicitudFondosInfo = (actividadId, tareaId = null) => {
  if (!solicitudesFondos.value.length) return null

  // console.log('Buscando solicitud para actividad:', actividadId, 'tarea:', tareaId)

  // Buscar solicitud que coincida con actividad y tarea (si se proporciona)
  const solicitudEncontrada = solicitudesFondos.value.find((sf) => {
    // Convertir a números para comparación segura
    const sfActividadId = sf.actividad ? parseInt(sf.actividad) : null
    const sfTareaId = sf.tarea ? parseInt(sf.tarea) : null
    const buscarActividadId = actividadId ? parseInt(actividadId) : null
    const buscarTareaId = tareaId ? parseInt(tareaId) : null

    // Si se busca por tarea, debe coincidir actividad Y tarea
    if (buscarTareaId !== null) {
      return sfActividadId === buscarActividadId && sfTareaId === buscarTareaId
    }
    // Si no se busca por tarea, solo coincidir por actividad
    else {
      return sfActividadId === buscarActividadId
    }
  })

  // console.log('Solicitud encontrada:', solicitudEncontrada)
  return solicitudEncontrada || null
}

watch(
  solicitudesFondos,
  (newSolicitudes) => {
    if (newSolicitudes.length > 0) {
      //console.log('Solicitudes cargadas, buscando coincidencia...')

      // Buscar la solicitud que coincida con los parámetros de la ruta
      const solicitudEncontrada = getSolicitudFondosInfo(idActividad, idTarea)
      solicitud.value = solicitudEncontrada

      if (solicitudEncontrada) {
        //console.log('Solicitud encontrada, pre-llenando datos:', solicitudEncontrada)

        // Pre-llenar campos con los datos de la solicitud
        //formData.value.monto_solicitado = solicitudEncontrada.montoSolicitado || 0
        //formData.value.monto_asignado = solicitudEncontrada.montoSolicitado || 0 // Asumiendo que monto asignado = monto solicitado

        // También puedes pre-llenar otros campos si es necesario
        if (solicitudEncontrada.numeroFormulario) {
          formData.value.formulario_numero = solicitudEncontrada.numeroFormulario
        }

        // console.log('Monto solicitado asignado:', formData.value.monto_solicitado)
      } else {
        console.log('No se encontró solicitud para actividad:', idActividad, 'tarea:', idTarea)
      }
    }
  },
  { deep: true, immediate: true },
)

onMounted(async () => {
  try {
    cargandoGeneral.value = true

    // Ejecutar todas las cargas de datos en paralelo
    await Promise.all([
      cargarDatos(),
      cargarRendicionesDeCuenta(),
      cargarSolicitudFondos(),
      cargarSolicitudesFondos(),
      getSolicitudFondosInfo(idActividad, idTarea),
      storeRendicion.cargarSolicitud(idSolicitud),
    ])
  } catch (error) {
    console.error('Error al cargar todos los datos iniciales:', error)
  } finally {
    cargandoGeneral.value = false // Solo apagar aquí
  }
})

watch(
  solicitudesFondos,
  (newSolicitudes) => {
    if (newSolicitudes.length > 0) {
      const solicitudEncontrada = getSolicitudFondosInfo(idActividad, idTarea || 0)
      solicitud.value = solicitudEncontrada

      if (solicitudEncontrada) {
        //formData.value.monto_solicitado = solicitudEncontrada.montoSolicitado || 0
        //formData.value.monto_asignado = solicitudEncontrada.formaPago || 0
      }
    }
  },
  { deep: true },
)

// Función helper para mostrar notificaciones
const mostrarSnackbar = (texto, color = 'success') => {
  snackbar.value = {
    show: true,
    text: texto,
    color: color,
  }
}

function agregarGasto() {
  formDataRC.value.detalle_gastos.push({
    fecha: '',
    partida: '',
    factura_recibo: '',
    descripcion_gasto: '',
    monto: 0,
  })
}

function eliminarGasto(index) {
  if (formDataRC.value.detalle_gastos.length > 1) {
    formDataRC.value.detalle_gastos.splice(index, 1)
  }
}

async function submitForm() {
  loading.value = true
  try {
    // Validar campos requeridos
    const requiredFields = [
      'cpte_diario',
      'fecha_desembolso',
      'descripcion_actividadRC',
      'lugar_actividadRC',
      'fecha_actividadRC',
      // 'idresponsable',
      // 'idcoordinador',
      // 'idcontador',
      // 'idadministrador'
    ]

    for (const field of requiredFields) {
      if (!formDataRC.value[field]) {
        throw new Error(`El campo '${field}' es requerido.`)
      }
    }

    if (!formDataRC.value.detalle_gastos || formDataRC.value.detalle_gastos.length === 0) {
      throw new Error('Debe agregar al menos un gasto.')
    }
    if (
      formDataRC.value.detalle_gastos.some(
        (gasto) =>
          !gasto.fecha ||
          !gasto.partida ||
          !gasto.factura_recibo ||
          !gasto.descripcion_gasto ||
          gasto.monto <= 0,
      )
    ) {
      throw new Error('Todos los gastos deben tener partida, descripción y un monto mayor a cero.')
    }

    const hasInvalidGasto = formDataRC.value.detalle_gastos.some(
      (gasto) =>
        !gasto.fecha || // <--- AÑADIR: Verifica que la fecha exista
        !gasto.partida ||
        !gasto.factura_recibo || // <--- AÑADIR: Verifica que el número de factura/recibo exista
        !gasto.descripcion_gasto ||
        Number(gasto.monto) <= 0, // <--- Asegúrate de convertir a número para la comparación
    )

    if (hasInvalidGasto) {
      throw new Error(
        'Todos los gastos deben tener fecha, partida, factura/recibo, descripción y un monto mayor a cero.',
      )
    }

    // Obtener información de la solicitud de fondos
    const solicitudInfo = getSolicitudFondosInfo(idActividad, idTarea)

    // OBTENER LOS CORREOS ACTUALES ANTES DE ENVIAR
    const coordinadorSeleccionado = coordinadoresList.value.find(
      (coordinador) => coordinador.id === formDataRC.value.idcoordinador,
    )
    const contadorSeleccionado = contadoresList.value.find(
      (contador) => contador.id === formDataRC.value.idcontador,
    )
    const administradorSeleccionado = administradoresList.value.find(
      (responsable) => responsable.id === formDataRC.value.idadministrador,
    )
    const correoCoordinadorActual = coordinadorSeleccionado?.correo || ''
    const correoContadorActual = contadorSeleccionado?.correo || ''
    const correoAdministradorActual = administradorSeleccionado?.correo || ''

    // Actualizar los valores en formData
    formData.value.correo_coordinador = correoCoordinadorActual
    formData.value.correo_contador = correoContadorActual
    formData.value.correo_administrador = correoAdministradorActual

    // Preparar payload para la rendición de cuentas
    const payload = {
      //numeroFormulario: formData.value.formulario_numero || '',
      montoAsignado: formData.value.monto_asignado,
      montoDescargado: Number(totalMontoGastado.value),
      cpteDiario: formDataRC.value.cpte_diario,
      fechaDesembolso: formDataRC.value.fecha_desembolso,
      saldo: Number(saldoPorReembolsar.value),
      detalleDestinoFondos: formDataRC.value.detalle_gastos.map((gasto) => ({
        fecha: gasto.fecha,
        partida: gasto.partida,
        fuente: gasto.fuente,
        factura_recibo: gasto.factura_recibo || '',
        descripcion: gasto.descripcion_gasto || '',
        monto: Number(gasto.monto) || 0,
      })),
      validacionResponsable: false, //Boolean(formData.value.validacion_responsable),
      validacionCoordinador: false, //Boolean(formData.value.validacion_coordinador),
      validacionContador: false, //Boolean(formData.value.validacion_contador),
      validacionAdministrador: false, //Boolean(formData.value.validacion_administrador),
      administrador: Number(formDataRC.value.idadministrador),
      contador: Number(formDataRC.value.idcontador),
      coordinador: Number(formDataRC.value.idcoordinador),
      //idresponsable: Number(formData.value.idresponsable),
      usuario: formDataRC.value.usuario_id || (usuario.value ? usuario.value.id : null),
      idActividad: idActividad ? parseInt(idActividad) : null,
      idTarea: idTarea ? parseInt(idTarea) : null,
      descripcionActividad: formDataRC.value.descripcion_actividadRC,
      lugarActividad: formDataRC.value.lugar_actividadRC,
      fechaActividad: formDataRC.value.fecha_actividadRC,
      lugarRendicion: formData.value.lugar_solicitud,
      //fechaRendicion: formData.value.fecha_solicitudRC,   //se crea automaticamente en el backend con la fecha actual
      bloquearIconoRC: true,
      idSolicitudReembolso: null,
      idSolicitudViaje: null,
      idSolicitudPagoDirecto: null,
      idSolicitudFondos: solicitudInfo ? solicitudInfo.id : null,
    }

    //console.log('Payload a enviar:', JSON.stringify(payload, null, 2))

    // Enviar la solicitud
    const response = await fetch(baseurl + 'api/rendicion-cuentas/' + idSolicitud + '/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `Error HTTP: ${response.status}`)
    }

    const responseData = await response.json()
    //console.log('Rendición enviada con éxito:', responseData)

    // GUARDAR EL ID DE LA RENDICIÓN CREADA
    idRendicionCreada.value = responseData.id || responseData.rendicion_id
    numeroFormularioSF.value = responseData.numero_formulario

    const urlForm = `${window.location.origin}/monitoreo/formulario022/${formData.value.id_actividad}?solicitud_id=${responseData.id}${formData.value.id_tarea ? `&tarea_id=${formData.value.id_tarea}` : ''}`
    const cuerpoMensaje = {
      destinatario_id: payload.coordinador,
      asunto: 'Rendicion de Cuentas - Coordinador',
      contenido:
        'Rendicion de cuentas pediente del formulario ' +
        numeroFormularioSF.value +
        '. URL: ' +
        urlForm,
      tipo: 'sistema',
      prioridad: 3,
    }
    await enviarMensajeAutomatico(cuerpoMensaje)

    const cuerpoMensaje2 = {
      destinatario_id: payload.contador,
      asunto: 'Rendicion de Cuentas - Contador',
      contenido:
        'Rendicion de Cuentas pediente del formulario ' +
        numeroFormularioSF.value +
        '. URL: ' +
        urlForm,
      tipo: 'sistema',
      prioridad: 3,
    }
    await enviarMensajeAutomatico(cuerpoMensaje2)

    const cuerpoMensaje3 = {
      destinatario_id: payload.administrador,
      asunto: 'Rendicion de Cuentas - Administrador',
      contenido:
        'Rendicion de Cuentas pediente del formulario ' +
        numeroFormularioSF.value +
        '. URL: ' +
        urlForm,
      tipo: 'sistema',
      prioridad: 3,
    }

    exportToExcel()
    resetForm()

    await enviarMensajeAutomatico(cuerpoMensaje3)

    ///////// Enviar notificación por correo al coordinador y al contador//////////
    try {
      const emailPayload = {
        emails: [correoCoordinadorActual, correoContadorActual, correoAdministradorActual].filter(
          (email) => email,
        ),
        datos_solicitud: {
          codigo: numeroFormularioSF.value || 'SOL-PROV',
          titulo: 'Rendicion de Cuentas',
          solicitante: nombreCompletoSolicitante.value,
          tipo: 'Rendicion de Actividad',
          prioridad: 'alta',
          descripcion:
            formData.value.descripcion_actividad || 'Rendicion de Cuentas para actividad',
          url_revision: urlForm,
        },
      }
      //console.log('emailPayload enviado al servidor:', JSON.stringify(emailPayload, null, 2))
      const emailResponse = await fetch(baseurl + 'api-msg/correos/solicitud-pendiente/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailPayload),
      })

      if (emailResponse.ok) {
        console.log('Correo de notificación enviado exitosamente')
      } else {
        console.warn('No se pudo enviar el correo de notificación')
      }
    } catch (emailError) {
      console.error('Error al enviar correo de notificación:', emailError)
    }
    ///////////////////////////////////////////////////////////////////////////////

    //console.log('Respuesta del servidor:',  JSON.stringify(responseData, null, 2))
    // console.log('Respuesta del servidor:',  JSON.stringify(formData.value.correo_coordinador, null, 2))
    // console.log('Respuesta del servidor:',  JSON.stringify(formData.value.correo_contador, null, 2))

    setTimeout(() => {
      router.push('/pei/listaactividades?showButton=2')
      //router.go(0)
    }, 1000)
  } catch (error) {
    console.error('Error completo:', error)
    alert(`Error: ${error.message}`)
  } finally {
    loading.value = false
  }
}

function resetForm() {
  Object.assign(formData.value, {
    cpte_diario: '',
    fecha_desembolso: '',
    descripcion_actividad: '',
    lugar_actividad: '',
    fecha_actividad: '',
    detalle_destino_fondos: [
      { fecha: '', partida: '', factura_recibo: '', descripcion_gasto: '', monto: 0 },
    ],
    idresponsable: null,
    idcoordinador: null,
    idcontador: null,
    idadministrador: null,
  })
}

function exportToExcel() {
  // 1. Crear datos principales con formato de formulario
  const mainData = [
    ['FORMULARIO F-02: RENDICION DE CUENTAS', '', '', ''],
    [''],
    [
      'Nombre del Solicitante:',
      formData.value.nombre,
      formData.value.paterno,
      formData.value.materno,
    ],
    ['Documento de Identidad:', formData.value.documento_identidad, '', ''],
    ['Cargo:', formData.value.cargo, '', ''],
    ['Formulario Número:', formData.value.formulario_numero || '', '', ''],
    ['Cpte. Diario:', formData.value.cpte_diario, '', ''],
    ['Fecha de Desembolso:', formData.value.fecha_desembolso, '', ''],
    ['Monto Asignado (Bs.):', formData.value.monto_solicitado, '', ''],
    ['Monto Gastado (Bs.):', Number(totalMontoGastado.value), '', ''],
    ['Saldo por Reembolsar (Bs.):', Number(saldoPorReembolsar.value), '', ''],
    ['Fuente de Financiamiento:', formData.value.fuente_financiamiento, '', ''],
    ['Descripcion de Actividad:', formData.value.descripcion_actividad, '', ''],
    ['Lugar de Actividad:', formData.value.lugar_actividad, '', ''],
    ['Fecha de Actividad:', formData.value.fecha_actividad, '', ''],
    ['Responsable:', formData.value.idresponsable, '', ''],
    ['Coordinador:', formData.value.idcoordinador, '', ''],
    ['Contador:', formData.value.idcontador, '', ''],
    ['Administrador', formData.value.idadministrador, '', ''],
    [''],
    ['DETALLE DEL DESTINO DE FONDOS', '', '', ''],
  ]

  // 2. Encabezados de la tabla de gastos
  const expensesHeaders = [
    'Fecha',
    'PARTIDA',
    'Factura/Recibo',
    'DESCRIPCIÓN DEL GASTO',
    'MONTO (BS.)',
  ]

  // 3. Datos de gastos
  const expensesData = formData.value.detalle_destino_fondos.map((gasto) => [
    gasto.fecha,
    gasto.partida,
    gasto.factura_recibo,
    gasto.descripcion_gasto,
    gasto.monto,
  ])

  // 4. Total al final de la tabla
  const totalRow = ['TOTAL', '', '', '', Number(totalMontoGastado.value), '']

  // 5. Crear workbook
  const wb = XLSX.utils.book_new()

  // 6. Hoja principal con formato de formulario
  const wsMain = XLSX.utils.aoa_to_sheet([...mainData, expensesHeaders, ...expensesData, totalRow])

  // 7. Aplicar estilos y formatos
  applyExcelStyles(
    wsMain,
    mainData.length,
    expensesData.length,
    formData.value.descripcion_actividad,
    formData.value.objetivo_actividad,
  )

  // 8. Agregar hoja al workbook y guardar
  XLSX.utils.book_append_sheet(wb, wsMain, 'Rendicion de Cuentas')
  XLSX.writeFile(wb, `Rendicion_Cuentas_F-02_${getCurrentDate1()}.xlsx`)
}

function applyExcelStyles(
  worksheet,
  mainDataRows,
  expensesRows,
  descripcionActividad,
  objetivoActividad,
) {
  if (!worksheet['!merges']) worksheet['!merges'] = []

  // Fusionar celdas para títulos y secciones
  worksheet['!merges'].push(
    { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: 3 } },
    { s: { r: 7, c: 0 }, e: { r: 7, c: 3 } },
    { s: { r: 12, c: 0 }, e: { r: 12, c: 3 } },
    { s: { r: 18, c: 0 }, e: { r: 18, c: 3 } },
    { s: { r: 21 + mainDataRows, c: 0 }, e: { r: 21 + mainDataRows, c: 3 } },
  )

  // Configurar anchos de columnas
  worksheet['!cols'] = [{ wch: 30 }, { wch: 40 }, { wch: 20 }, { wch: 25 }]

  // Aplicar formatos a celdas específicas
  Object.keys(worksheet).forEach((cellAddress) => {
    if (cellAddress !== '!ref' && cellAddress !== '!merges' && cellAddress !== '!cols') {
      const cell = worksheet[cellAddress]
      const cellRef = XLSX.utils.decode_cell(cellAddress)

      // Estilo para títulos y encabezados de sección
      if (
        cellRef.r === 0 ||
        cellRef.r === 2 ||
        cellRef.r === 7 ||
        cellRef.r === 12 ||
        cellRef.r === 18 ||
        cellRef.r === 21 + mainDataRows
      ) {
        cell.s = {
          font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 14 },
          fill: { fgColor: { rgb: '4472C4' } },
          alignment: { horizontal: 'center', vertical: 'center' },
        }
      }

      // Estilo para etiquetas
      else if (cellRef.c === 0 && cellRef.r > 0 && cellRef.r < 21 + mainDataRows) {
        cell.s = {
          font: { bold: true, color: { rgb: '000000' } },
          fill: { fgColor: { rgb: 'D9E1F2' } },
        }
      }

      // Estilo para encabezados de tabla
      else if (cellRef.r === 22 + mainDataRows) {
        cell.s = {
          font: { bold: true, color: { rgb: 'FFFFFF' } },
          fill: { fgColor: { rgb: '5B9BD5' } },
          alignment: { horizontal: 'center' },
        }
      }

      // Estilo para la fila total
      else if (cellRef.r === 23 + mainDataRows + expensesRows) {
        cell.s = {
          font: { bold: true },
          fill: { fgColor: { rgb: 'F2F2F2' } },
        }
      }

      // Formato de moneda para columna de montos (columna C)
      else if (
        cellRef.c === 2 &&
        cellRef.r >= 23 + mainDataRows &&
        cellRef.r <= 22 + mainDataRows + expensesRows
      ) {
        cell.z = '"Bs." #,##0.00'
      }

      // Formato de fecha para celdas de fecha
      else if (
        (cell.v && typeof cell.v === 'string' && cell.v.match(/\d{4}-\d{2}-\d{2}/)) ||
        (cellRef.c === 2 && cellRef.r === 9)
      ) {
        cell.z = 'dd/mm/yyyy'
      }

      // Estilo específico para la celda de descripción de actividad (B9)
      if (cellRef.r === 8 && cellRef.c === 1) {
        if (!cell.s) cell.s = {}
        cell.s.alignment = cell.s.alignment || {}
        cell.s.alignment.wrapText = true
        cell.s.alignment.vertical = 'top'
      }

      // Estilo específico para la celda de objetivo de actividad (B11)
      if (cellRef.r === 10 && cellRef.c === 1) {
        if (!cell.s) cell.s = {}
        cell.s.alignment = cell.s.alignment || {}
        cell.s.alignment.wrapText = true
        cell.s.alignment.vertical = 'top'
      }
    }
  })

  // Agregar bordes a la tabla de gastos
  const tableStartRow = 22 + mainDataRows
  const tableEndRow = 23 + mainDataRows + expensesRows

  for (let r = tableStartRow; r <= tableEndRow; r++) {
    for (let c = 0; c < 4; c++) {
      const cellAddress = XLSX.utils.encode_cell({ r, c })
      if (!worksheet[cellAddress]) worksheet[cellAddress] = { v: '' }
      if (!worksheet[cellAddress].s) worksheet[cellAddress].s = {}
      worksheet[cellAddress].s.border = {
        top: { style: 'thin', color: { rgb: '000000' } },
        right: { style: 'thin', color: { rgb: '000000' } },
        bottom: { style: 'thin', color: { rgb: '000000' } },
        left: { style: 'thin', color: { rgb: '000000' } },
      }
    }
  }

  // Ajustar altura de filas para las celdas con texto largo
  if (!worksheet['!rows']) worksheet['!rows'] = []

  // Ajustar altura de la fila de descripción (fila 9)
  if (descripcionActividad && descripcionActividad.length > 100) {
    worksheet['!rows'][8] = { hpt: 60 }
  }

  // Ajustar altura de la fila de objetivo (fila 11)
  if (objetivoActividad && objetivoActividad.length > 100) {
    worksheet['!rows'][10] = { hpt: 60 }
  }
}

const puedeValidarResponsable = computed(() => {
  const usuarioActualId = datosFormulario.value?.usuario?.id
  const usuarioActualCargo = datosFormulario.value?.usuario?.cargo?.toLowerCase()
  const responsableAsignadoId = formDataRC.value.idresponsable || formData.value.idresponsable

  return usuarioActualId === responsableAsignadoId && usuarioActualCargo?.includes('responsable')
})

const puedeValidarCoordinador = computed(() => {
  const usuarioActualId = datosFormulario.value?.usuario?.id
  const usuarioActualCargo = datosFormulario.value?.usuario?.cargo?.toLowerCase()
  const coordinadorAsignadoId = formDataRC.value.idcoordinador || formData.value.idcoordinador

  return usuarioActualId === coordinadorAsignadoId && usuarioActualCargo?.includes('coordinador')
})

const puedeValidarContador = computed(() => {
  const usuarioActualId = datosFormulario.value?.usuario?.id
  const usuarioActualCargo = datosFormulario.value?.usuario?.cargo?.toLowerCase()
  const contadorAsignadoId = formDataRC.value.idcontador || formData.value.idcontador

  return usuarioActualId === contadorAsignadoId && usuarioActualCargo?.includes('contable')
})

const puedeValidarAdministrador = computed(() => {
  const usuarioActualId = datosFormulario.value?.usuario?.id
  const usuarioActualCargo = datosFormulario.value?.usuario?.cargo?.toLowerCase()
  const administradorAsignadoId = formDataRC.value.idadministrador || formData.value.idadministrador

  return usuarioActualId === administradorAsignadoId && usuarioActualCargo?.includes('admin')
})

function getCurrentDate1() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${day}/${month}/${year}`
}

// Hooks de ciclo de vida
// onMounted(() => {
//   cargarDatos()
//   cargarRendicionesDeCuenta()
//   cargarSolicitudesFondos()
//   getSolicitudFondosInfo(idActividad, idTarea)
// })
</script>

<style scoped>
.rendicion-de-cuentas-container {
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
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.form-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 24px;
  border: 1px solid #e0e0e0;
}

.form-section h3 {
  color: #1976d2;
  border-bottom: 2px solid #1976d2;
  padding-bottom: 12px;
  margin-bottom: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.info-item {
  padding: 8px 0;
}

.gap-3 {
  gap: 12px;
}

.users-table {
  width: 100%;
}

.users-table th {
  background-color: #f5f5f5;
  position: sticky;
  top: 0;
  z-index: 2;
}

.fecha-column {
  width: 180px;
  min-width: 180px;
  max-width: 200px;
}

.fecha-input {
  width: 100%;
}

/* Ajustes responsivos */
@media (max-width: 960px) {
  .rendicion-de-cuentas-container {
    padding: 16px 12px;
  }

  .form-section {
    padding: 20px;
    margin-bottom: 20px;
  }

  .d-flex.justify-end {
    flex-direction: column;
    gap: 8px;
  }

  .d-flex.justify-end .v-btn {
    width: 100%;
  }
}

@media (max-width: 600px) {
  .v-card {
    margin: 8px 0;
  }

  .form-section {
    padding: 16px;
  }
}

/* Mejora el aspecto de la tabla */
:deep(.v-table) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.v-table th) {
  background-color: #1976d2 !important;
  color: white !important;
  font-weight: 600;
  font-size: 14px;
  padding: 16px 12px;
}

:deep(.v-table td) {
  padding: 12px;
  background-color: #fafafa;
}

.narrow-column {
  width: 15%;
}

.wide-column {
  width: 50%;
}

.action-column {
  width: 15%;
}

.compact-field {
  font-size: 14px;
  max-width: 100px;
}
</style>
