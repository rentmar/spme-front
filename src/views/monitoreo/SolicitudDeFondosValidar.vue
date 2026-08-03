<template>
  <v-container class="solicitud-fondos-container">
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
        <p class="mt-4 text-h6">Cargando formulario de solicitud...</p>
      </div>
    </v-overlay>

    <div v-if="!cargandoGeneral">
      <!--Titulo de la pagina-->
      <PaginaTituloIcono
        :titulo="'Validar Solicitud de Fondos'"
        :icon="'mdi-cash-check'"
      ></PaginaTituloIcono>
      <!--Encabezado del Proyecto-->
      <ProyectoIdHeader
        v-if="datosFormulario"
        :proyecto-id="datosFormulario.actividad?.proyecto ?? '99999'"
      ></ProyectoIdHeader>
      <br />
      <!--Encabezado de la Actividad-->
      <ActividadInformacion v-if="datosFormulario.actividad" :actividad-id="idActividad" />

      <v-row>
        <!-- Panel lateral de información -->
        <v-col cols="12" md="4" lg="3">
          <v-card elevation="2" rounded="lg" class="mb-4">
            <v-toolbar color="primary" density="compact">
              <v-toolbar-title class="text-white">Información General</v-toolbar-title>
            </v-toolbar>
            <v-card-text class="pa-4">
              <div class="info-item mb-3">
                <div class="text-subtitle-2 text-medium-emphasis">Actividad:</div>
                <div class="text-body-1 font-weight-medium">
                  {{ datosFormulario.actividad.nombreCorto }}
                </div>
              </div>
              <div class="info-item mb-3">
                <div class="text-subtitle-2 text-medium-emphasis">Estado:</div>
                <v-chip color="warning" size="small" class="mt-1">
                  <v-icon small class="mr-1">mdi-progress-clock</v-icon>
                  {{ datosFormulario.actividad.estado }}
                </v-chip>
              </div>
            </v-card-text>
          </v-card>
          <!--Componente Revisores Estado y Aprovacion Rechazo-->
          <RevisorSolicitudFondos></RevisorSolicitudFondos>
          <!-- Componente Redactores, peticion de revision y estado consolidado del documento-->
          <RedactorSolicitudFondos></RedactorSolicitudFondos>

          <!--Componente para el estado y validdacion de la Solicitud-->
          <!-- <ValidacionRedactorSolFondos></ValidacionRedactorSolFondos> -->

          <!-- Tarjeta de resumen rápido -->
          <!-- <v-card elevation="2" rounded="lg" class="mb-4">
            <v-toolbar color="secondary" density="compact">
              <v-toolbar-title class="text-white">Resumen Rápido</v-toolbar-title>
            </v-toolbar>
            <v-card-text class="pa-4">
              <div class="d-flex justify-space-between align-center mb-2">
                <span class="text-subtitle-2 text-medium-emphasis">Monto solicitado:</span>
                <span class="text-body-1 font-weight-bold text-primary"
                  >Bs. {{ totalMontoSolicitado.toLocaleString() }}</span
                >
              </div>
              <div class="d-flex justify-space-between align-center mb-2">
                <span class="text-subtitle-2 text-medium-emphasis">Items de gasto:</span>
                <span class="text-body-1 font-weight-medium">{{
                  formData.detalle_destino_fondos.length
                }}</span>
              </div>
              <v-divider class="my-2"></v-divider>
              <div class="d-flex justify-space-between align-center">
                <span class="text-subtitle-2 text-medium-emphasis">Presupuesto disponible:</span>
                <span class="text-body-1 font-weight-medium text-success"
                  >Bs. {{ actividadData.presupuesto.toLocaleString() }}</span
                >
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
                Formulario de Solicitud
              </v-toolbar-title>
            </v-toolbar>

            <v-card-text class="pa-4">
              <v-form ref="form" @submit.prevent="submitForm">
                <!-- Sección 1: Información del Solicitante -->
                <div class="form-section mb-6">
                  <h3 class="text-h6 mb-4 primary--text">
                    <v-icon color="primary" class="mr-2">mdi-account</v-icon>
                    Información del Solicitante
                  </h3>
                  <v-row>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="formData.nombre"
                        label="Nombre del Solicitante"
                        variant="outlined"
                        density="compact"
                        bg-color="grey-lighten-4"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="formData.paterno"
                        label="Apellido paterno del Solicitante"
                        variant="outlined"
                        density="compact"
                        bg-color="grey-lighten-4"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="formData.materno"
                        label="Apellido materno del Solicitante"
                        variant="outlined"
                        density="compact"
                        bg-color="grey-lighten-4"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="formData.documento_identidad"
                        label="Carnet de Identidad"
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

                <!-- Sección 2: Información de la Actividad -->
                <div class="form-section mb-6">
                  <h3 class="text-h6 mb-4 primary--text">
                    <v-icon color="primary" class="mr-2">mdi-calendar-text</v-icon>
                    Información de la Actividad
                  </h3>
                  <v-textarea
                    v-model="formData.descripcion_actividad"
                    label="Descripción de la Actividad"
                    variant="outlined"
                    rows="3"
                    bg-color="blue-lighten-5"
                    :readonly="soloLectura"
                  ></v-textarea>
                  <v-row>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="formData.fecha_irealizacion"
                        label="Inicio de Fecha de Realización"
                        type="date"
                        variant="outlined"
                        density="compact"
                        bg-color="grey-lighten-4"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="formData.fecha_frealizacion"
                        label="Fin de Fecha de Realización"
                        type="date"
                        variant="outlined"
                        density="compact"
                        bg-color="grey-lighten-4"
                        readonly
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-textarea
                    v-model="formData.objetivo_actividad"
                    label="Objetivo de la Actividad"
                    variant="outlined"
                    rows="3"
                    bg-color="blue-lighten-5"
                    :readonly="soloLectura"
                  ></v-textarea>
                  <v-text-field
                    v-model="textoProcedencia"
                    label="Fuente de Financiamiento"
                    variant="outlined"
                    density="compact"
                    bg-color="grey-lighten-4"
                    readonly
                  ></v-text-field>

                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="formData.fecha_ejecucion"
                      label="Fecha de ejecucion de actividad"
                      type="date"
                      variant="outlined"
                      density="compact"
                      bg-color="blue-lighten-5"
                      :readonly="soloLectura"
                    ></v-text-field>
                  </v-col>
                  <!-- <v-col cols="12">
                    <v-file-input
                      v-model="formData.medios_archivos"
                      label="Adjuntar Medios de verificacion"
                      multiple
                      chips
                      show-size
                      :accept="acceptedFormats.medios"
                      prepend-icon="mdi-paperclip"
                    ></v-file-input>
                  </v-col> -->
                </div>

                <v-divider class="my-4"></v-divider>

                <!-- Sección 3: Detalle de Gastos -->
                <div class="form-section mb-6">
                  <h3 class="text-h6 mb-4 primary--text">
                    <v-icon color="primary" class="mr-2">mdi-cash</v-icon>
                    Detalle de Gastos Solicitados
                  </h3>

                  <div class="d-flex justify-space-between align-center mb-4">
                    <v-btn
                      color="primary"
                      variant="outlined"
                      prepend-icon="mdi-plus"
                      @click="addGasto"
                      :disabled="soloLectura"
                    >
                      Agregar Item
                    </v-btn>
                    <v-chip class="text-subtitle-1" color="primary" variant="outlined">
                      Monto Total Solicitado (Bs.): {{ totalMontoSolicitado.toLocaleString() }}
                    </v-chip>
                  </div>

                  <v-table class="elevation-1 rounded-lg mb-4 users-table">
                    <thead>
                      <tr>
                        <th class="text-subtitle-2 font-weight-bold">Partida</th>
                        <th class="text-subtitle-2 font-weight-bold">Fuente</th>
                        <th class="text-subtitle-2 font-weight-bold">Descripción</th>
                        <th class="text-subtitle-2 font-weight-bold">Monto (Bs.)</th>
                        <th class="text-subtitle-2 font-weight-bold text-center">Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(gasto, index) in formData.detalle_destino_fondos" :key="index">
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
                          <v-select
                            v-model="gasto.fuente"
                            :items="procedenciaFondosActividad"
                            item-title="financiera"
                            return-object
                            variant="outlined"
                            density="compact"
                            placeholder="Financiador"
                            bg-color="blue-lighten-5"
                            :rules="[validarFuente]"
                          >
                            <template #item="{ item: option, props: optionProps }">
                              <v-list-item v-bind="optionProps" density="compact">
                                <template #title>
                                  <span class="text-caption">{{ option.raw.financiera }}</span>
                                </template>
                                <template #subtitle>
                                  <span class="text-caption text-medium-emphasis">{{
                                    option.raw.sigla
                                  }}</span>
                                </template>
                              </v-list-item>
                            </template>
                            <template #selection="{ item: selected }">
                              <span class="text-caption">{{ selected?.raw?.financiera }}</span>
                            </template>
                          </v-select>
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
                            @click="removeGasto(index)"
                            :disabled="soloLectura"
                          >
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </div>

                <v-divider class="my-4"></v-divider>

                <!-- Sección 4: Información Adicional -->
                <!-- <div class="form-section mb-6">
                  <h3 class="text-h6 mb-4 primary--text">
                    <v-icon color="primary" class="mr-2">mdi-information</v-icon>
                    Información Adicional
                  </h3>

                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.lugar_solicitud"
                        label="Lugar de la Solicitud"
                        variant="outlined"
                        bg-color="blue-lighten-5"
                        :readonly="soloLectura"
                      ></v-text-field>
                       <v-select
                        v-model="formData.forma_pago"
                        :items="formasPagoOptions"
                        item-title="formaPago"
                        item-value="id"
                        label="Forma de Pago"
                        variant="outlined"
                        readonly
                      ></v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.fecha_solicitud"
                        label="Fecha de la Solicitud"
                        type="date"
                        variant="outlined"
                        density="compact"
                        bg-color="grey-lighten-4"
                        readonly
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="formData.forma_pago"
                        :items="formasPagoOptions"
                        item-title="formaPago"
                        item-value="id"
                        label="Forma de Pago"
                        variant="outlined"
                        bg-color="blue-lighten-5"
                        :readonly="soloLectura"
                      ></v-select>
                    </v-col>
                  </v-row>

                  <div v-if="MostrarCamposOtros">
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="formData.datos_forma_pago.otros.nombre_otros"
                          label="Nombre a quien se realiza el pago"
                          variant="outlined"
                          bg-color="blue-lighten-5"
                          :readonly="soloLectura"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="formData.datos_forma_pago.otros.ci_otros"
                          label="Documento de Identidad C.I."
                          variant="outlined"
                          bg-color="blue-lighten-5"
                          :readonly="soloLectura"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </div>

                  <div v-if="MostrarCamposTransferencia">
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="formData.datos_forma_pago.transferencia.nombre_transferencia"
                          label="Nombre completo a quien se realiza la transferencia"
                          variant="outlined"
                          bg-color="blue-lighten-5"
                          :readonly="soloLectura"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="formData.datos_forma_pago.transferencia.ci_transferencia"
                          label="Documento de Identidad C.I."
                          variant="outlined"
                          bg-color="blue-lighten-5"
                          :readonly="soloLectura"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="formData.datos_forma_pago.transferencia.entidad_bancaria"
                          label="Nombre de Entidad Bancaria"
                          variant="outlined"
                          bg-color="blue-lighten-5"
                          :readonly="soloLectura"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="formData.datos_forma_pago.transferencia.tipo_cuenta"
                          :items="['Ahorro', 'Corriente']"
                          label="Tipo de Cuenta (Ahorro/ Corriente)"
                          variant="outlined"
                          bg-color="blue-lighten-5"
                          :readonly="soloLectura"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="formData.datos_forma_pago.transferencia.numero_cuenta"
                          label="Número de Cuenta Bancaria"
                          variant="outlined"
                          bg-color="blue-lighten-5"
                          :readonly="soloLectura"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </div>
                </div>

                <v-divider class="my-4"></v-divider>

                <div class="form-section mb-6">
                  <h3 class="text-h6 mb-4 primary--text">
                    <v-icon color="primary" class="mr-2">mdi-signature</v-icon>
                    Informacion Adicional
                  </h3>
                  <v-row>
                    <v-col cols="12">
                      <InformacionAdicionalEdicion
                        ref="infoRef"
                        :lugar="formData.lugar_solicitud"
                        :fecha="formData.fecha_solicitud"
                        :forma-pago="formData.forma_pago"
                        :datos-forma-pago="formData.datos_forma_pago"
                      ></InformacionAdicionalEdicion>
                    </v-col>
                  </v-row>
                </div> -->

                <!-- Sección 5: Firmas -->
                <!-- <div class="form-section mb-6">
                  <h3 class="text-h6 mb-4 primary--text">
                    <v-icon color="primary" class="mr-2">mdi-signature</v-icon>
                    Firmas y Validaciones
                  </h3>

                  <v-row>
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="formData.idresponsable"
                        :items="responsablesList"
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
                        v-model="formDatSF.validacionResponsablesf"
                        :label="`Aprobado por Coordinación ${puedeValidarResponsable ? '(Usted)' : ''}`"
                        :disabled="!puedeValidarResponsable || formDatSF.validacionResponsablesf"
                        :readonly="!puedeValidarResponsable || formDatSF.validacionResponsablesf"
                        :color="puedeValidarResponsable ? 'primary' : 'grey'"
                        @update:modelValue="
                          (newValue) => {
                            if (newValue) {
                              nextTick(() => {
                                validarSolicitud(formData.idresponsable, responsablesList)
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
                        v-model="formData.idcoordinador"
                        :items="coordinadoresList"
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
                        v-model="formDatSF.validacionCoordinadorsf"
                        :label="`Aprobado por Dirección Administrativa ${puedeValidarCoordinador ? '(Usted)' : ''}`"
                        :disabled="!puedeValidarCoordinador || formDatSF.validacionCoordinadorsf"
                        :readonly="!puedeValidarCoordinador || formDatSF.validacionCoordinadorsf"
                        :color="puedeValidarCoordinador ? 'primary' : 'grey'"
                        @update:modelValue="
                          (newValue) => {
                            if (newValue) {
                              nextTick(() => {
                                validarSolicitud(formData.idcoordinador, coordinadoresList)
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
                  <!-- <v-btn
                    color="success"
                    variant="flat"
                    size="large"
                    prepend-icon="mdi-check-circle-outline"
                    @click="validarSolicitud"
                    :disabled="loading || (!puedeValidarResponsable && !puedeValidarCoordinador)"
                  >
                    Validar
                  </v-btn> -->
                  <v-btn
                    color="error"
                    variant="outlined"
                    size="large"
                    prepend-icon="mdi-cancel"
                    :to="`/pei/listaactividades?showButton=1`"
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
                    :loading="loadingPdfSolicitud"
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
                    Enviar Solicitud
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
  <!-- <pre>{{ formData.detalle_destino_fondos }}</pre> -->
  <!-- {{ '***************************************B' }}
  <pre>{{ datosFormulario1 }}</pre> -->
  <!-- <pre>{{ procedenciaFondosActividad }}</pre> -->
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'
import ProyectoIdHeader from '@/modules/proyecto/components/partials/ProyectoIdHeader.vue'
import ActividadInformacion from '@/modules/proyecto/components/partials/ActividadInformacion.vue'
import { useImpresionFormularios } from '@/modules/impresiones/composables/useImpresionFormularios'
import { useUserStore } from '@/stores/user'
import * as XLSX from 'xlsx'
import { useRoute, useRouter } from 'vue-router'
import { useNotificaciones } from '@/modules/notificacion/composables/useNotificaciones'
//Componente Validacion
import EstadoValidacionSolicitudFondos from '@/modules/formularios/components/validadores/componenteEstadoVotacion/EstadoValidacionSolicitudFondos.vue'
import ValidacionRedactorSolFondos from '@/modules/formularios/components/validadores/componenteRedactorEstadoValidacion/ValidacionRedactorSolFondos.vue'
import InformacionAdicionalEdicion from '@/modules/formularios/components/vinculacion/InformacionAdicionalEdicion.vue'
//Iniciar el estore
import { useSolicitudFondosStore } from '@/modules/formularios/store/useSolicitudDeFondosStore'
import RevisorSolicitudFondos from '@/modules/formularios/components/validadores/componenteEstadoVotacion/RevisorSolicitudFondos.vue'
import RedactorSolicitudFondos from '@/modules/formularios/components/validadores/componenteRedactorEstadoValidacion/RedactorSolicitudFondos.vue'
import { useActividadFormulaioPresupuesto } from '@/modules/formularios/composables/useActividadFormularioPresupuesto'

//Inicar Composable
const { enviarMensajeAutomatico } = useNotificaciones()
// Inciar el store
const storeSolFondos = useSolicitudFondosStore()

/*************************** Generar PDFs *******************************************/
const loadingPdfSolicitud = ref(false)
const loadingPdfSubactividad = ref(false)

//Inicializar el composable
const { generarPdfSolicitudFondos, generarPdfSolicitudFondosTareas } = useImpresionFormularios()

const generarPdfSolicitudFondosFunc = async () => {
  if (!idActividad) return

  loadingPdfSolicitud.value = true
  try {
    // Aquí iría tu lógica para generar el PDF de solicitud de fondos
    console.log('Generando PDF Solicitud de Fondos para actividad:', idActividad)
    await generarPdfSolicitudFondos(idSolicitud)
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
    await generarPdfSolicitudFondosTareas(idSolicitud)
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
//console.log('ID aaaaaaa', JSON.stringify(route,null,2))

const { procedenciaFondosActividad } = useActividadFormulaioPresupuesto(idActividad)

const userStore = useUserStore()
const usuario = computed(() => {
  return {
    nombre: userStore.usuario,
    role: userStore.rol,
    id: userStore.id,
  }
})
console.log('ID Usuario:', usuario.value.id)

const baseurl = import.meta.env.VITE_API_BASE

//variables para carga de datos
const datosFormulario = ref(null) //viene de funcion cargarDatos y actualiza formData
const datosFormulario1 = ref(null) //viene de funcion cargarSolicitudFondos y actualiza detalle_destino_fondos
const error = ref(null)
const isLoading = ref(false)

// Estado reactivo
const cargandoGeneral = ref(true)
const loading = ref(false)
const form = ref(null)
const responsablesList = ref([])
const coordinadoresList = ref([])

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
  objetivo_actividad: '',
  fecha_irealizacion: '',
  fecha_frealizacion: '',
  fecha_ejecucion: '',
  fuente_financiamiento: '',
  id_actividad: 0,
  id_usuario: 0,
  // Resto de campos del formulario
  detalle_destino_fondos: [{ partida: '', fuente: '', descripcion_gasto: '', monto: 0 }],
  forma_pago: null,
  datos_forma_pago: {
    otros: { nombre_otros: '', ci_otros: '' },
    transferencia: {
      nombre_transferencia: '',
      ci_transferencia: '',
      entidad_bancaria: '',
      tipo_cuenta: '',
      numero_cuenta: '',
    },
  },
  lugar_solicitud: '',
  fecha_solicitud: getCurrentDate(),
  monto_solicitado: 0,
  validacion_responsable: false,
  idresponsable: null,
  validacion_coordinador: false,
  idcoordinador: null,
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

// Agrega esta propiedad computada
const soloLectura = computed(() => {
  // Si no hay datos del formulario o no hay usuario actual, por defecto true por seguridad
  if (!datosFormulario1.value || !usuario.value?.id) {
    return true
  }

  // Si el usuario actual es el creador de la solicitud, puede editar (soloLectura = false)
  // Si NO es el creador, solo lectura (soloLectura = true)
  return datosFormulario1.value.usuario_id !== usuario.value.id
})

//datos para abrir Solicitud de Fondos
const idSolicitudFondos = ref(null)
const numeroFormularioSF = ref(null)
// Nuevo estado para controlar el bloqueo

const textoProcedencia = computed(() => {
  const fuentes = Array.isArray(formData.value?.fuente_financiamiento)
    ? formData.value.fuente_financiamiento
    : []

  return fuentes.map(({ nombre = '', monto = 0 } = {}) => `${nombre} : Bs. ${monto}`).join(', ')
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
const nombreCoordinadorElegido = computed(() => {
  const coordinador = coordinadoresList.value.find(
    (user) => user.id === formData.value.idcoordinador,
  )
  return coordinador ? getNombreCompleto(coordinador) : ''
})

const nombreResponsableElegido = computed(() => {
  const responsable = responsablesList.value.find(
    (user) => user.id === formData.value.idresponsable,
  )
  return responsable ? getNombreCompleto(responsable) : ''
})

const totalMontoSolicitado = computed(() => {
  return formData.value.detalle_destino_fondos.reduce(
    (total, gasto) => total + Number(gasto.monto || 0),
    0,
  )
})

const nombreCompletoSolicitante = computed(() => {
  return `${formData.value.nombre} ${formData.value.paterno} ${formData.value.materno}`.trim()
})

// WATCH PARA AUTO-LLENAR FORMULARIO CUANDO LLEGUEN LOS DATOS
watch(
  datosFormulario,
  (newVal) => {
    if (newVal && newVal.usuario) {
      //console.log('Auto-llenando formulario con datos del usuario:', newVal.usuario)

      const usuario = newVal.usuario

      // Función helper para manejar valores null/undefined
      const getSafeValue = (value, defaultValue = '') => {
        return value !== null && value !== undefined ? value : defaultValue
      }

      // Llenar campos del usuario
      // formData.value.nombre = getSafeValue(usuario.nombre)
      // formData.value.paterno = getSafeValue(usuario.paterno)
      // formData.value.materno = getSafeValue(usuario.materno)
      // formData.value.cargo = getSafeValue(usuario.cargo)
      // formData.value.documento_identidad = getSafeValue(usuario.ci)
      // formData.value.id_usuario = getSafeValue(usuario.id,0)

      // Llenar campos de la actividad si existen
      if (newVal.actividad) {
        formData.value.descripcion_actividad = getSafeValue(newVal.actividad.descripcion)
        formData.value.objetivo_actividad = getSafeValue(newVal.actividad.objetivo_de_actividad)
        formData.value.fecha_irealizacion = getSafeValue(newVal.actividad.fecha_inicio)
        formData.value.fecha_frealizacion = getSafeValue(newVal.actividad.fecha_cierre)
        formData.value.fecha_ejecucion = getSafeValue(newVal.actividad.fecha_programada)
        formData.value.id_actividad = getSafeValue(newVal.actividad.id, 0)
        formData.value.fuente_financiamiento = getSafeValue(newVal.actividad.procedencia_fondos)

        if (newVal.formaPago && Array.isArray(newVal.formaPago)) {
          //console.log('Formas de pago disponibles:', newVal.formaPago)
        }

        // También actualizar actividadData para el componente ActividadInformacion
        actividadData.value = {
          ...actividadData.value,
          descripcion: getSafeValue(newVal.actividad.descripcion, actividadData.value.descripcion),
          fecha_programada: getSafeValue(
            newVal.actividad.fecha_inicio,
            actividadData.value.fecha_programada,
          ),
          fecha_cierre: getSafeValue(
            newVal.actividad.fecha_cierre,
            actividadData.value.fecha_cierre,
          ),
        }
      }

      // Llenar lista de validadores si existen
      if (newVal.validadores && Array.isArray(newVal.validadores)) {
        //console.log('Cargando validadores:', newVal.validadores)
        responsablesList.value =
          newVal.validadores.filter((user) => user && user.cargo === 'coordinador') || []
        coordinadoresList.value =
          newVal.validadores.filter((user) => user && user.cargo === 'dir-administrativo') || [] //'coordinador') || []
      } else {
        responsablesList.value = []
        coordinadoresList.value = []
      }
    }
  },
  { deep: true },
)

// Agrega este watch para actualizar automáticamente cuando cambien los datosFormulario1
watch(
  datosFormulario1,
  (newVal) => {
    if (newVal && newVal.detalleDestinoFondos) {
      actualizarDetalleDestinoFondos(newVal.detalleDestinoFondos)
    }
    const getSafeValue = (value, defaultValue = '') => {
      return value !== null && value !== undefined ? value : defaultValue
    }
    const idSolicitante = newVal.usuario_id
    //console.log('uuuuuuuu', idSolicitante)
    //console.log('uuuuuuu9', datosFormulario.value)
    const datosSolicitante = datosFormulario.value.validadores.find((fp) => fp.id === idSolicitante)
    //console.log('uuuuuu2', JSON.stringify(datosSolicitante,null,2))
    //return datosSolicitante

    formData.value.nombre = getSafeValue(datosSolicitante.nombre)
    formData.value.paterno = getSafeValue(datosSolicitante.paterno)
    formData.value.materno = getSafeValue(datosSolicitante.materno)
    formData.value.cargo = getSafeValue(datosSolicitante.cargo)
    formData.value.documento_identidad = getSafeValue(datosSolicitante.ci)
    formData.value.id_usuario = getSafeValue(datosSolicitante.id, 0)
    formData.value.correo = getSafeValue(datosSolicitante.correo)
  },
  { deep: true },
)

// borra los campos no seleccionados en "forma de pago"
// ejemplo, si seleccionas "otros", se borran los campos "transferencia_bancaria"
watch(
  () => formData.value.forma_pago,
  (newVal, oldVal) => {
    if (newVal === oldVal) return // No hacer nada si no cambió

    // Obtener el nombre de la forma de pago seleccionada
    const formaPagoSeleccionada = formasPagoOptions.value.find((fp) => fp.id === newVal)
    const nombreFormaPago = formaPagoSeleccionada ? formaPagoSeleccionada.formaPago : ''

    // Resetear campos según la opción seleccionada
    if (nombreFormaPago === 'Transferencia Bancaria') {
      // Si seleccionó Transferencia, resetear campos de Otros
      formData.value.datos_forma_pago.otros = {
        nombre_otros: '',
        ci_otros: '',
      }
    } else {
      // Si seleccionó cualquier otra opción, resetear campos de Transferencia
      formData.value.datos_forma_pago.transferencia = {
        nombre_transferencia: '',
        ci_transferencia: '',
        entidad_bancaria: '',
        tipo_cuenta: '',
        numero_cuenta: '',
      }
    }
  },
)

const formasPagoOptions = computed(() => {
  if (datosFormulario.value && datosFormulario.value.formaPago) {
    return datosFormulario.value.formaPago
  }
  return []
})

// Computed property to determine which payment method was selected
const formaPagoElegido = computed(() => {
  if (formData.value.forma_pago && formasPagoOptions.value.length > 0) {
    const formaPago = formasPagoOptions.value.find((fp) => fp.id === formData.value.forma_pago)
    return formaPago ? formaPago.formaPago : ''
  }
  return ''
})

// Show "Otros" fields when payment method is NOT "Transferencia Bancaria"
const MostrarCamposOtros = computed(() => {
  return formaPagoElegido.value !== 'Transferencia Bancaria'
})

// Show "Transferencia" fields when payment method IS "Transferencia Bancaria"
const MostrarCamposTransferencia = computed(() => {
  return formaPagoElegido.value === 'Transferencia Bancaria'
})

// 6. Para la función exportToExcel, necesitas obtener el texto de la forma de pago:
const formasPagoTexto = computed(() => {
  if (formData.value.forma_pago && formasPagoOptions.value.length > 0) {
    const formaPago = formasPagoOptions.value.find((fp) => fp.id === formData.value.forma_pago)
    return formaPago ? formaPago.formaPago : ''
  }
  return ''
})

// Métodos
function getNombreCompleto(user) {
  return `${user.nombre} ${user.paterno} ${user.materno}`.trim()
}

function getCurrentDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// async function cargarDatos() {
//   isLoading.value = true
//   error.value = null
//   try {
//     const response = await fetch(baseurl+'/api/monitoreo/obtener-datos-formulario/', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         id_actividad: idActividad,
//         usuario: usuario.value.nombre,
//       }),
//     })

//     if (!response.ok) {
//       const errorData = await response.json()
//       throw new Error(
//         `Error en la solicitud: ${response.status} - ${errorData.detail || 'Error desconocido'}`,
//       )
//     }

//     const rawData = await response.json()
//     datosFormulario.value = strictSanitizeData(rawData)
//     console.log('Datos cargados exitosamente:', rawData)
//   } catch (err) {
//     error.value = err.message
//     console.error('Ha ocurrido un error:', err)
//   } finally {
//     isLoading.value = false
//     cargandoGeneral.value = false
//   }
// }

async function cargarDatos() {
  //console.log('Iniciando cargarDatos...')

  isLoading.value = true
  error.value = null

  try {
    // Verificar que tengamos los datos necesarios
    if (!idActividad || !usuario.value?.nombre) {
      throw new Error('Faltan datos requeridos para cargar el formulario')
    }

    // console.log('Enviando solicitud con:', {
    //   id_actividad: idActividad,
    //   usuario: usuario.value.nombre,
    // })

    // Usar URL completa para debugging
    const url = baseurl + 'api/monitoreo/obtener-datos-formulario/'
    //console.log('URL completa:', url)

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id_actividad: idActividad,
        usuario: usuario.value.nombre,
      }),
    })

    //console.log('Respuesta cargarDatos:', response.status, response.statusText)

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Endpoint no encontrado (404). Verifica la URL del API.')
      }
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        `Error en la solicitud: ${response.status} - ${errorData.detail || 'Error desconocido'}`,
      )
    }

    const rawData = await response.json()
    //console.log('Datos recibidos en cargarDatos:', rawData)

    datosFormulario.value = rawData
    //console.log('DatosFormulario asignado exitosamente')
  } catch (err) {
    console.error('Error en cargarDatos:', err)
    error.value = err.message
    // Mostrar mensaje al usuario
    alert(`Error: ${err.message}\n\nPor favor, contacta al administrador del sistema.`)
    throw err
  } finally {
    isLoading.value = false
    //console.log('cargarDatos - isLoading establecido en:', isLoading.value)
  }
}

// function sanitizeData(data) {
//   if (data === null || data === undefined) {
//     return '';
//   }

//   if (typeof data === 'string') {
//     // Limpiar strings: trim y convertir empty strings a ''
//     const trimmed = data.trim();
//     return trimmed === '' ? '' : trimmed;
//   }

//   if (typeof data === 'number') {
//     // Validar que sea un número finito
//     return isFinite(data) ? data : 0;
//   }

//   if (typeof data === 'boolean') {
//     return data;
//   }

//   if (Array.isArray(data)) {
//     // Sanitizar cada elemento del array
//     return data.map(item => sanitizeData(item)).filter(item =>
//       item !== null && item !== undefined && item !== ''
//     );
//   }

//   if (typeof data === 'object') {
//     const sanitized = {};
//     for (const key in data) {
//       if (Object.prototype.hasOwnProperty.call(data, key)) {
//         const value = data[key];
//         // Solo incluir propiedades con valores válidos
//         if (value !== null && value !== undefined && value !== '') {
//           sanitized[key] = sanitizeData(value);
//         }
//       }
//     }
//     return sanitized;
//   }

//   // Para cualquier otro tipo de dato, retornar string vacío
//   return '';
// }

// function strictSanitizeData(data) {
//   const sanitized = sanitizeData(data);

//   // Si el resultado es un objeto vacío, retornar string vacío
//   if (typeof sanitized === 'object' && !Array.isArray(sanitized)) {
//     if (Object.keys(sanitized).length === 0) {
//       return '';
//     }
//   }

//   return sanitized;
// }

// async function cargarSolicitudFondos() {
//   isLoading.value = true
//   error.value = null
//   try {
//     const response = await fetch(baseurl+'/monitoreo_api/obtenerSolicitudFondos/', {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     })

//     if (!response.ok) {
//       throw new Error(`Error en la solicitud: ${response.status}`)
//     }

//     const data = await response.json()

//     // Filtrar las solicitudes por actividad_id y tarea_id
//     const solicitudesFiltradas = data.solicitudes.filter(solicitud => {

//       // Convertir a string para comparación segura, o comparar convirtiendo ambos al mismo tipo
//       const coincideActividad = solicitud.actividad_id?.toString() === idActividad?.toString()
//       const coincideTarea = solicitud.tarea_id?.toString() === idTarea?.toString()
//       const coincideSolicitud = solicitud.id?.toString() === idSolicitud?.toString()

//       //console.log('Coincidencias:', { coincideActividad, coincideTarea, coincideSolicitud })

//       return coincideActividad && coincideTarea && coincideSolicitud
//     })

//     datosFormulario1.value = strictSanitizeData(solicitudesFiltradas[0])
//     actualizarDatosFormulario(solicitudesFiltradas[0])

//   } catch (err) {
//     error.value = err.message
//     console.error('Error al cargar solicitudes:', err)
//   } finally {
//     isLoading.value = false
//     cargandoGeneral.value = false
//   }
// }

async function cargarSolicitudFondos() {
  //console.log('Iniciando cargarSolicitudFondos...')

  isLoading.value = true
  error.value = null

  try {
    const response = await fetch(baseurl + '/monitoreo_api/obtenerSolicitudFondos/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    //console.log('Respuesta recibida:', response.status, response.ok)

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`)
    }

    const data = await response.json()
    //console.log('Datos recibidos de la tabla solicitudfondosactpei:', JSON.stringify(data, null, 2))

    // Validar que la respuesta tenga el formato correcto
    if (!data || !data.solicitudes || !Array.isArray(data.solicitudes)) {
      throw new Error('Formato de respuesta inválido del servidor')
    }

    // Buscar la solicitud por ID (parámetro de URL)
    const solicitudEncontrada = data.solicitudes.find(
      (solicitud) => solicitud.id?.toString() === idSolicitud?.toString(),
    )

    //console.log('Solicitud encontrada:', solicitudEncontrada)

    if (!solicitudEncontrada) {
      throw new Error(`No se encontró la solicitud con ID: ${idSolicitud}`)
    }

    datosFormulario1.value = solicitudEncontrada
    actualizarDatosFormulario(solicitudEncontrada)

    //console.log('cargarSolicitudFondos completado exitosamente')
  } catch (err) {
    console.error('Error en cargarSolicitudFondos:', err)
    error.value = err.message
    throw err // Re-lanzar el error para que onMounted lo capture
  } finally {
    isLoading.value = false
    //console.log('cargarSolicitudFondos - isLoading establecido en:', isLoading.value)
  }
}

function addGasto() {
  formData.value.detalle_destino_fondos.push({
    partida: '',
    fuente: '',
    descripcion_gasto: '',
    monto: 0,
  })
}

function removeGasto(index) {
  if (formData.value.detalle_destino_fondos.length > 1) {
    formData.value.detalle_destino_fondos.splice(index, 1)
  }
}

async function submitForm() {
  loading.value = true
  try {
    //Validar si el formulario está completo
    if (
      !formData.value.lugar_solicitud ||
      !formData.value.forma_pago ||
      !formData.value.idresponsable ||
      !formData.value.idcoordinador
    ) {
      throw new Error('Por favor, completa todos los campos obligatorios del formulario.')
    }
    if (totalMontoSolicitado.value <= 0) {
      throw new Error('El monto total solicitado debe ser mayor a cero.')
    }

    // OBTENER LOS CORREOS ACTUALES ANTES DE ENVIAR
    const coordinadorSeleccionado = coordinadoresList.value.find(
      (coordinador) => coordinador.id === formData.value.idcoordinador,
    )
    const contadorSeleccionado = responsablesList.value.find(
      (contador) => contador.id === formData.value.idresponsable,
    )

    const correoCoordinadorActual = coordinadorSeleccionado?.correo || ''
    const correoContadorActual = contadorSeleccionado?.correo || ''

    // Actualizar los valores en formData
    formData.value.correo_coordinador = correoCoordinadorActual
    formData.value.correo_contador = correoContadorActual

    const payload = {
      // detalle_destino_fondos should be an object, not a stringified JSON
      detalleDestinoFondos: {
        items: formData.value.detalle_destino_fondos.map((gasto) => ({
          partida_sf: gasto.partida, // Changed from 'partida' to 'partida_sf'
          fuente: gasto.fuente,
          concepto: gasto.descripcion_gasto,
          monto: Number(gasto.monto),
        })),
      },
      formaPago: formData.value.forma_pago,
      lugarSolicitud: formData.value.lugar_solicitud,
      fechaSolicitud: formData.value.fecha_solicitud,
      fechaRealizacionActividad: formData.value.fecha_ejecucion,
      montoSolicitado: totalMontoSolicitado.value,
      validacionResponsable: false, //formData.value.validacion_contador,
      contador: formData.value.idresponsable,
      validacionCoordinador: false, //formData.value.validacion_coordinador,
      coordinador: formData.value.idcoordinador,
      usuario: formData.value.id_usuario,
      actividad: formData.value.id_actividad,
      descripcion_actividad: formData.value.descripcion_actividad,
      objetivo_actividad: formData.value.objetivo_actividad,
      // Solo incluir id_tarea si tiene un valor válido (cuando es una solicitud para tarea)
      ...(formData.value.id_tarea &&
        formData.value.id_tarea > 0 && { tarea: formData.value.id_tarea }),
      datos_forma_pago: formData.value.datos_forma_pago,
      bloquearIconosSolFondos: true,
      //codigo_actividad: formData.value.codigo_actividad,
    }

    //console.log('payload enviado', JSON.stringify(payload, null, 2))
    const response = await fetch(baseurl + 'api/solicitud-fondos-crud/' + idSolicitud + '/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`)
    }

    const data = await response.json()
    idSolicitudFondos.value = data.id
    numeroFormularioSF.value = data.numero_formulario

    const urlForm = `${window.location.origin}/monitoreo/formulario011/${formData.value.id_actividad}?solicitud_id=${data.id}${formData.value.id_tarea ? `&tarea_id=${formData.value.id_tarea}` : ''}`
    const cuerpoMensaje = {
      destinatario_id: payload.coordinador,
      asunto: 'Solicitud de Fondos - Coordinado',
      contenido:
        'Solicitud de Fondos pediente del formulario ' +
        numeroFormularioSF.value +
        '. URL: ' +
        urlForm,
      tipo: 'sistema',
      prioridad: 3,
    }
    await enviarMensajeAutomatico(cuerpoMensaje)

    const cuerpoMensaje2 = {
      destinatario_id: payload.contador,
      asunto: 'Solicitud de Fondos - Contador',
      contenido:
        'Solicitud de Fondos pediente del formulario ' +
        numeroFormularioSF.value +
        '. URL: ' +
        urlForm,
      tipo: 'sistema',
      prioridad: 3,
    }

    exportToExcel()
    resetForm()

    await enviarMensajeAutomatico(cuerpoMensaje2)

    ///////// Enviar notificación por correo al coordinador y al contador//////////
    try {
      const emailPayload = {
        emails: [correoCoordinadorActual, correoContadorActual].filter((email) => email),
        datos_solicitud: {
          codigo: numeroFormularioSF.value || 'SOL-PROV',
          titulo: 'Formulario Sol. Fondos',
          solicitante: nombreCompletoSolicitante.value,
          tipo: 'Solicitud de Actividad',
          prioridad: 'alta',
          descripcion: formData.value.descripcion_actividad || 'Solicitud de fondos para actividad',
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

    //console.log('Respuesta del servidor:',  JSON.stringify(data, null, 2))

    setTimeout(() => {
      router.push('/pei/listaactividades?showButton=1')
    }, 1000)

    return data
  } catch (error) {
    console.error('Error completo:', error.response?.data || error.message)
    alert(`Error: ${error.response?.data?.mensaje || error.message}`)
  } finally {
    loading.value = false
  }
}

async function validarSolicitud(idValidador, ListaValidadores) {
  const validadorEncontrado = ListaValidadores.find((validador) => validador.id === idValidador)
  console.log('validador', validadorEncontrado)
  const validador = getNombreCompleto(validadorEncontrado)
  console.log('VALIDADOR SELECCIONADO:', validador)

  if (!puedeValidarResponsable.value && !puedeValidarCoordinador.value) {
    alert('Usted no está autorizado para validar esta solicitud.')
    return
  }

  // 1. Determinar qué validación enviar
  let validacionData = {}

  if (puedeValidarResponsable.value) {
    // Si el usuario es el Responsable, se envía su validación
    validacionData = {
      validacionResponsable: formDatSF.value.validacionResponsablesf,
    }
  } else if (puedeValidarCoordinador.value) {
    // Si el usuario es el Coordinador, se envía su validación
    validacionData = {
      validacionCoordinador: formDatSF.value.validacionCoordinadorsf,
    }
  } else {
    alert('No tiene permisos de validación para esta solicitud.')
    return
  }

  // 2. Verificar que se haya marcado el checkbox
  const claveValidacion = Object.keys(validacionData)[0]
  if (!validacionData[claveValidacion]) {
    alert('Debe marcar la casilla para realizar la validación.')
    return
  }

  // 3. Crear el payload final con el ID de la solicitud
  const payload = {
    //id_solicitud: formDatSF.value.idsf || idSolicitud, // Usar idsf o idSolicitud de la URL
    ...validacionData, // Incluye solo validacion_responsable O validacion_coordinador
  }

  loading.value = true
  try {
    const response = await fetch(baseurl + 'api/solicitud-fondos-crud/' + idSolicitud + '/', {
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

    console.log('blalalb', JSON.stringify(datosFormulario1.value, null, 2))
    /////////////////////envio de mensaje y correo///////////////////////
    const data = await response.json()
    //console.log("Rendicion enviada con exitos", responseData)
    numeroFormulario.value = data.numero_formulario
    const urlForm = `${window.location.origin}/monitoreo/formulario011/${formData.value.id_actividad}?solicitud_id=${data.id}${formData.value.id_tarea ? `&tarea_id=${formData.value.id_tarea}` : ''}`

    const cuerpoMensaje = {
      destinatario_id: datosFormulario1.value.usuario_id,
      asunto: 'Solicitud de Fondos',
      contenido: 'Solicitud Aprobada' + numeroFormulario.value + '. URL: ' + urlForm,
      tipo: 'sistema',
      prioridad: 3,
    }
    await enviarMensajeAutomatico(cuerpoMensaje)

    //////////////////////////// correo a solicitante////////////////////////
    //Bandera de carga
    const isLoading = ref(false)

    //Incializar el composable
    const { enviarEmailAprobacion, enviarEmailRechazo } = useNotificaciones()

    //Metodo de prueba
    const probarEnvioEmail = async () => {
      console.log('🔄 Ejecutando prueba...')
      isLoading.value = true

      //Datos para el email de Aprobacion
      const datosAprobacion = {
        emails: [formData.value.correo], //[formData.value.correo],//['gaboowill@protonmail.com', 'olivguil9@gmail.com'],
        datos_aprobacion: {
          codigo: 'SOL-2024',
          titulo: 'Solicitud de Fondos Aprobado',
          solicitante_nombre: nombreCompletoSolicitante.value,
          aprobador_nombre: validador,
          numero_aprobacion: 'No de aprov',
          url_detalles: `${window.location.origin}/monitoreo/formulario011/${formData.value.id_actividad}?solicitud_id=${data.id}${formData.value.id_tarea ? `&tarea_id=${formData.value.id_tarea}` : ''}`,
        },
      }

      try {
        await enviarEmailAprobacion(datosAprobacion)
        //await enviarEmailRechazo(datosRechazo)
        console.log('Prueba ejecutada')
      } catch (error) {
        console.error(error)
      } finally {
        isLoading.value = false
      }
    }

    /////////// Enviar notificacion por correo a solicitante//////////
    // try{
    //   const emailPayload = {
    //     emails: [formData.value.correo].filter((email) => email),
    //     datos_solicitud: {
    //       codigo: numeroFormulario.value || 'SQL-PROV',
    //       titulo: 'Validacion de Solicitud de Fondos',
    //       solicitante: nombreCompletoSolicitante.value,
    //       tipo: 'Solicitud de Fondos',
    //       prioridad: 'alta',
    //       descripcion: formData.value.descripcion_actividad || 'Solicitud de Fondos para actividad',
    //       url_revision: `${window.location.origin}/monitoreo/formulario022/${formData.value.id_actividad}?solicitud_id=${data.id}${formData.value.id_tarea ? `&tarea_id=${formData.value.id_tarea}` : ''}`,
    //     }
    //   }
    //   console.log('emailPayload enviado:', JSON.stringify(emailPayload, null, 2))

    //   const emailResponse = await fetch(baseurl + 'api-msg/correos/solicitud-pendiente/', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(emailPayload),
    //   })

    //   if (emailResponse.ok) {
    //     console.log('Correo de notificacion enviado exitosamente')
    //   } else {
    //     console.warm('No se pudo enviar el correo de notificacion')
    //   }
    // } catch (emailError){
    //   console.error('Error al enviar correo de notificacion:', emailError)
    // }
    //////////////////////////////////////////////////////////////////

    alert('Solicitud validada exitosamente.')

    // Redireccionar
    router.push('/pei/listaactividades?showButton=1')
  } catch (err) {
    console.error('Error al validar la solicitud:', err)
    alert(`Error al validar la solicitud: ${err.message}`)
  } finally {
    loading.value = false
  }
}

function resetForm() {
  Object.assign(formData.value, {
    descripcion_actividad: '',
    objetivo_actividad: '',
    detalle_destino_fondos: [{ partida: '', descripcion_gasto: '', monto: 0 }],
    forma_pago: '',
    lugar_solicitud: '',
    fecha_solicitud: getCurrentDate(),
    monto_solicitado: 0,
    validacion_responsable: false,
    idresponsable: null,
    validacion_coordinador: false,
    idcoordinador: null,
  })
}

function exportToExcel() {
  // 1. Crear datos principales con formato de formulario
  const mainData = [
    ['FORMULARIO F-01: SOLICITUD DE FONDOS EN AVANCE CON CARGO A RENDICIÓN DE CUENTA', '', '', ''],
    [''],
    ['FORMULARIO Nro:', numeroFormularioSF.value, '', ''],
    ['INFORMACIÓN DEL SOLICITANTE', '', '', ''],
    ['Nombre Completo:', nombreCompletoSolicitante.value, '', ''],
    ['Documento de Identidad:', formData.value.documento_identidad, '', ''],
    ['Cargo:', formData.value.cargo, '', ''],
    [''],
    ['INFORMACIÓN DE LA ACTIVIDAD', '', '', ''],
    ['Descripción:', formData.value.descripcion_actividad, '', ''],
    [
      'Fecha Inicio:',
      formData.value.fecha_irealizacion,
      'Fecha Fin:',
      formData.value.fecha_frealizacion,
    ],
    ['Objetivo:', formData.value.objetivo_actividad, '', ''],
    ['Fuente de Financiamiento:', formData.value.fuente_financiamiento, '', ''],
    [''],
    ['INFORMACIÓN DE LA SOLICITUD', '', '', ''],
    ['Forma de Pago:', formasPagoTexto.value, '', ''],
    ['Lugar de Solicitud:', formData.value.lugar_solicitud, '', ''],
    ['Fecha de Solicitud:', getCurrentDate1(), '', ''],
    [''],
    ['FIRMAS Y VALIDACIONES', '', '', ''],
    [
      'Responsable:',
      nombreResponsableElegido.value,
      'Aprobado:',
      formData.value.validacion_responsable ? '✓' : '✗',
    ],
    [
      'Coordinador:',
      nombreCoordinadorElegido.value,
      'Aprobado:',
      formData.value.validacion_coordinador ? '✓' : '✗',
    ],
    [''],
    ['DETALLE DEL DESTINO DE FONDOS', '', '', ''],
  ]

  // 2. Encabezados de la tabla de gastos
  const expensesHeaders = ['PARTIDA', 'DESCRIPCIÓN DEL GASTO', 'MONTO (BS.)', 'OBSERVACIONES']

  // 3. Datos de gastos
  const expensesData = formData.value.detalle_destino_fondos.map((gasto) => [
    gasto.partida,
    gasto.fuente,
    gasto.descripcion_gasto,
    gasto.monto,
    '',
  ])

  // 4. Total al final de la tabla
  const totalRow = ['TOTAL', '', totalMontoSolicitado.value, '']

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
  XLSX.utils.book_append_sheet(wb, wsMain, 'Solicitud de Fondos')
  XLSX.writeFile(wb, `Solicitud_Fondos_F-01_${getCurrentDate1()}.xlsx`)
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

function getCurrentDate1() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${day}/${month}/${year}`
}

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
  formDatSF.value.responsable_idsf = solicitud.contador_id || null
  formDatSF.value.validacionCoordinadorsf = solicitud.validacionCoordinador || false
  formDatSF.value.coordinador_idsf = solicitud.coordinador_id || null
  formDatSF.value.usuario_idsf = solicitud.usuario_id || null
  formDatSF.value.actividad_idsf = solicitud.actividad_id || null
  formDatSF.value.fechaRealizacionActividadsf = solicitud.fechaRealizacionActividad || ''
  formDatSF.value.bloquearIconosSolFondossf = solicitud.bloquearIconosSolFondos || true

  // Actualizar descripcion_actividad y objetivo_actividad desde la solicitud
  if (solicitud.descripcion_actividad) {
    formData.value.descripcion_actividad = solicitud.descripcion_actividad
  }
  if (solicitud.objetivo_actividad) {
    formData.value.objetivo_actividad = solicitud.objetivo_actividad
  }
  if (solicitud.fechaRealizacionActividad) {
    formData.value.fecha_ejecucion = solicitud.fechaRealizacionActividad
  }

  //console.log('datosFormulario actualizado con los valores de la solicitud:', datosFormulario.value)

  actualizarDetalleDestinoFondos(formDatSF.value.detalleDestinoFondossf)

  // Actualizar los campos de Información Adicional - pasar solicitud directamente
  actualizarInformacionAdicional(solicitud)
  actualizarValidadores()
}

// Función para parsear y actualizar el detalle de destino de fondos
function actualizarDetalleDestinoFondos(detalleDestinoFondos) {
  try {
    //console.log('Detalle de destino de fondos recibido:', JSON.stringify(detalleDestinoFondos,null,2))
    if (!detalleDestinoFondos) {
      formData.value.detalle_destino_fondos = []
      return
    }

    // Determinar si es un string JSON o ya un objeto
    let detalleParseado
    if (typeof detalleDestinoFondos === 'string') {
      detalleParseado = JSON.parse(detalleDestinoFondos)
    } else {
      detalleParseado = detalleDestinoFondos
    }

    //console.log('Detalle de destino de fondos parseado:', detalleParseado)

    // Mapear al formato que espera la tabla
    formData.value.detalle_destino_fondos = detalleParseado.items.map((item, index) => ({
      partida: item.partida_sf || `${index + 1}.${index + 1}.${index + 1}`, // Usar partida_sf del backend o generar automáticamente
      fuente: item.fuente,
      descripcion_gasto: item.concepto || '',
      monto: item.monto || 0,
    }))

    //console.log('Detalle de destino de fondos actualizado:', formData.value.detalle_destino_fondos)
  } catch (error) {
    console.error('Error al parsear detalleDestinoFondos:', error)
    formData.value.detalle_destino_fondos = []
  }
}

// Función para actualizar los campos de Información Adicional
function actualizarInformacionAdicional(solicitud) {
  // Actualizar forma_pago
  formData.value.forma_pago = formDatSF.value.formaPago_idsf

  // Actualizar lugar_solicitud
  formData.value.lugar_solicitud = formDatSF.value.lugarSolicitudsf

  // Actualizar fecha_solicitud
  formData.value.fecha_solicitud = formDatSF.value.fechaSolicitudsf

  // Actualizar datos_forma_pago desde solicitud directamente

  if (solicitud && solicitud.datos_forma_pago) {
    const datosPago = solicitud.datos_forma_pago

    // Los datos ya vienen en el formato correcto desde el backend
    // Solo necesitamos asignarlos directamente
    if (datosPago.transferencia) {
      formData.value.datos_forma_pago.transferencia = {
        nombre_transferencia: datosPago.transferencia.nombre_transferencia || '',
        ci_transferencia: datosPago.transferencia.ci_transferencia || '',
        entidad_bancaria: datosPago.transferencia.entidad_bancaria || '',
        tipo_cuenta: datosPago.transferencia.tipo_cuenta || '',
        numero_cuenta: datosPago.transferencia.numero_cuenta || '',
      }
    }

    if (datosPago.otros) {
      formData.value.datos_forma_pago.otros = {
        nombre_otros: datosPago.otros.nombre_otros || '',
        ci_otros: datosPago.otros.ci_otros || '',
      }
    }
  }
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

  //Actualizar formData con los IDs encontrados
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
    (validador) => validador.cargo && validador.cargo.toLowerCase().includes('coordinador'),
  )

  // Filtrar coordinadores (puedes ajustar la lógica según el cargo)
  coordinadoresList.value = datosFormulario.value.validadores.filter(
    (validador) => validador.cargo && validador.cargo.toLowerCase().includes('dir-administrativo'), //'coordinador'),
  )
}

// Verificación mejorada con roles
const puedeValidarResponsable = computed(() => {
  const usuarioActualId = datosFormulario.value?.usuario?.id
  const usuarioActualCargo = datosFormulario.value?.usuario?.cargo?.toLowerCase()
  const responsableAsignadoId = datosFormulario1.value?.contador_id //se cambio esta seccion para habilitar validadores
  // El usuario puede validar si:
  // 1. Es el responsable asignado
  // 2. Tiene el cargo correspondiente
  return usuarioActualId === responsableAsignadoId && usuarioActualCargo?.includes('coordinador') //('contable')
})

const puedeValidarCoordinador = computed(() => {
  const usuarioActualId = datosFormulario.value?.usuario?.id
  const usuarioActualCargo = datosFormulario.value?.usuario?.cargo?.toLowerCase()
  const coordinadorAsignadoId = formData.value.idcoordinador
  // El usuario puede validar si:
  // 1. Es el coordinador asignado
  //  2. Tiene el cargo correspondiente
  return (
    usuarioActualId === coordinadorAsignadoId && usuarioActualCargo?.includes('dir-administrativo')
  ) //('coordinador')
})

// Ciclo de vida
// onMounted(async () => {
//   await cargarDatos()
//   await cargarSolicitudFondos()
//   await textoProcedencia.value
// })

// Ciclo de vida
onMounted(async () => {
  //console.log('Iniciando carga del formulario...', { idActividad, idSolicitud, idTarea })

  // Verificar parámetros mínimos
  if (!idActividad || !idSolicitud) {
    alert('Error: Faltan parámetros necesarios en la URL')
    router.push('/pei/listaactividades?showButton=1')
    return
  }

  try {
    //console.log('1. Cargando datos del formulario...')
    await cargarDatos()

    // Si cargarDatos falla, no continuar
    if (error.value) {
      throw new Error(error.value)
    }

    await nextTick()
    //console.log('2. Datos del formulario cargados:', datosFormulario.value ? 'OK' : 'ERROR')

    //console.log('3. Cargando solicitud de fondos...')
    await cargarSolicitudFondos()

    //console.log('4. Carga completa. Mostrando formulario...')

    //Cargar el store para la solicitud de fondos
    await storeSolFondos.cargarSolicitud(idSolicitud)
  } catch (error) {
    console.error('Error durante la carga:', error)
    // Redirigir si hay error
    router.push('/pei/listaactividades?showButton=1')
  } finally {
    // Siempre ocultar el overlay de carga después de 3 segundos máximo
    cargandoGeneral.value = false
    loading.value = false
    //console.log('5. Estado final - cargandoGeneral:', cargandoGeneral.value)
  }
})
</script>

<style scoped>
.solicitud-fondos-container {
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

/* Ajustes responsivos */
@media (max-width: 960px) {
  .solicitud-fondos-container {
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

/* Arreglar el select de fuente en la tabla */
:deep(.v-select .v-field__input) {
  min-height: auto !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

:deep(.v-select .v-select__selection-text) {
  font-size: 14px !important;
  line-height: 1.2 !important;
  white-space: normal !important;
  word-break: break-word !important;
}

:deep(.v-select.compact-select .v-field) {
  min-height: 40px !important;
}

:deep(.v-select.compact-select .v-field__input) {
  padding: 4px 8px !important;
}

:deep(.v-select .v-list-item-title) {
  font-size: 13px !important;
  white-space: normal !important;
}

:deep(.v-select .v-list-item-subtitle) {
  font-size: 11px !important;
}
/* Mejorar el aspecto de los selects en la tabla */
.users-table :deep(td) {
  vertical-align: middle !important;
}

.users-table :deep(.v-select) {
  min-width: 120px;
}

.users-table :deep(.v-field__outline) {
  --v-field-border-opacity: 0.3;
}

/* Ajuste específico para la columna de fuente */
.narrow-column {
  width: 15%;
  min-width: 130px;
}

/* Asegurar que el texto en el select no se corte */
:deep(.v-select__selection) {
  overflow: visible !important;
  text-overflow: clip !important;
  white-space: normal !important;
}
/* Altura uniforme para inputs y selects en la tabla */
.users-table :deep(.v-field) {
  min-height: 40px !important;
  max-height: 40px !important;
}

.users-table :deep(.v-field__input) {
  min-height: 40px !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  display: flex;
  align-items: center;
}

.users-table :deep(.v-select .v-field__input) {
  min-height: 40px !important;
  padding: 0 8px !important;
}

.users-table :deep(.v-text-field .v-field__input) {
  min-height: 40px !important;
  padding: 0 8px !important;
}

/* Ajustar el texto del select */
:deep(.v-select__selection-text) {
  font-size: 14px !important;
  line-height: 1.2 !important;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/* Alinear verticalmente el select con los text-fields */
.users-table :deep(.v-select) {
  position: relative;
  top: 10px; /* Baja el select completo - ajusta este valor */
}

.users-table :deep(.v-select .v-field__input) {
  padding-top: 2px !important; /* Ajuste fino del texto */
}

.users-table :deep(.v-select .v-field) {
  margin-top: 0 !important;
}
</style>
