<template>
  <v-container class="solicitud-viaje-container">
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
        :titulo="'Validar Solicitud de Reposición'"
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

          <RevisorSolicitudReposicion></RevisorSolicitudReposicion>
          <RedactorSolicitudReposicion></RedactorSolicitudReposicion>

          <!--Componente para el estado y validacion de la Solicitud (placeholder) -->
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

          <!-- Tarjeta de resumen rápido de la solicitud -->
          <!-- <v-card elevation="2" rounded="lg" class="mb-4">
            <v-toolbar color="secondary" density="compact">
              <v-toolbar-title class="text-white">Resumen de Solicitud</v-toolbar-title>
            </v-toolbar>
            <v-card-text class="pa-4">
              <div class="d-flex justify-space-between align-center mb-2">
                <span class="text-subtitle-2 text-medium-emphasis">Monto solicitado:</span>
                <span class="text-body-1 font-weight-bold text-primary">
                  Bs. {{ totalMontoSolicitado.toLocaleString() }}
                </span>
              </div>
              <div class="d-flex justify-space-between align-center mb-2">
                <span class="text-subtitle-2 text-medium-emphasis">Items de gasto:</span>
                <span class="text-body-1 font-weight-medium">
                  {{ formData.detalle_destino_fondos.length }}
                </span>
              </div>
              <v-divider class="my-2"></v-divider>
              <div class="d-flex justify-space-between align-center mb-2">
                <span class="text-subtitle-2 text-medium-emphasis">Fecha de Solicitud:</span>
                <span class="text-body-1 font-weight-medium">
                  {{ formData.fecha_solicitud || 'No especificada' }}
                </span>
              </div>
              <div class="d-flex justify-space-between align-center">
                <span class="text-subtitle-2 text-medium-emphasis">Lugar:</span>
                <span class="text-body-1 font-weight-medium text-truncate" style="max-width: 150px">
                  {{ formData.lugar_solicitud || 'No especificado' }}
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
                    v-model="formData.objetivo_actividad"
                    label="Objetivo de la Actividad"
                    variant="outlined"
                    rows="3"
                    bg-color="blue-lighten-5"
                    :readonly="soloLectura"
                  ></v-textarea>
                  <v-textarea
                    v-model="formData.descripcion_actividad"
                    label="Descripción de la Actividad"
                    variant="outlined"
                    rows="3"
                    bg-color="blue-lighten-5"
                    :readonly="soloLectura"
                  ></v-textarea>
                  <v-row v-if="false">
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

                  <!-- <v-text-field
                    v-model="textoProcedencia"
                    label="Fuente de Financiamiento"
                    variant="outlined"
                    density="compact"
                    bg-color="grey-lighten-4"
                    readonly
                  ></v-text-field> -->
                  <!-- Fuentes de Financiamiento -->
                  <div class="mb-4">
                    <v-label class="text-subtitle-2 mb-2">Fuentes de Financiamiento</v-label>

                    <!-- Si NO hay fuente_financiamiento -->
                    <v-alert
                      v-if="
                        !formData.fuente_financiamiento ||
                        formData.fuente_financiamiento === '' ||
                        formData.fuente_financiamiento.length === 0
                      "
                      type="info"
                      variant="tonal"
                      class="mb-3"
                      icon="mdi-information"
                      density="compact"
                    >
                      <strong>No existe Desglose</strong><br />
                      No se realizó un desglose de fuentes de financiamiento para esta actividad.
                    </v-alert>

                    <!-- Si hay fuente_financiamiento, mostrarlo -->
                    <v-text-field
                      v-else
                      v-model="textoProcedencia"
                      label="Fuentes de Financiamiento"
                      variant="outlined"
                      density="compact"
                      bg-color="grey-lighten-4"
                      readonly
                    ></v-text-field>

                    <!-- Lista de financiadores disponibles -->
                    <div
                      v-if="procedenciaFondosActividad && procedenciaFondosActividad.length > 0"
                      class="mt-2"
                    >
                      <div class="text-caption text-medium-emphasis mb-1">
                        Financiadores disponibles:
                      </div>
                      <div class="d-flex flex-wrap gap-2">
                        <v-chip
                          v-for="fuente in procedenciaFondosActividad"
                          :key="fuente.id"
                          color="primary"
                          variant="outlined"
                          size="small"
                          class="mr-2 mb-1"
                        >
                          <v-icon start size="x-small">mdi-currency-usd</v-icon>
                          {{ fuente.financiera }} ({{ fuente.sigla }})
                        </v-chip>
                      </div>
                    </div>

                    <!-- Si NO hay financiadores -->
                    <v-alert
                      v-else
                      type="warning"
                      variant="tonal"
                      class="mt-2"
                      icon="mdi-alert"
                      density="compact"
                    >
                      No hay fuentes de financiamiento configuradas para esta actividad.
                    </v-alert>
                  </div>

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

                  <div class="tabla-scroll">
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
                        <tr v-for="(gasto, index) in formData.detalle_destino_fondos" :key="index">
                          <td class="fecha-column">
                            <v-text-field
                              v-model="gasto.fecha"
                              variant="outlined"
                              type="date"
                              bg-color="blue-lighten-5"
                              hide-details
                              density="compact"
                              required
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
                            <!-- <v-text-field
                            v-model="gasto.fuente"
                            variant="outlined"
                            density="compact"
                            hide-details
                            bg-color="blue-lighten-5"
                            placeholder="Financiador"
                            :readonly="soloLectura"
                          ></v-text-field> -->
                            <v-select
                              v-model="gasto.fuente"
                              :items="procedenciaFondosActividad"
                              item-title="financiera"
                              return-object
                              variant="outlined"
                              density="compact"
                              placeholder="Financiador"
                              bg-color="blue-lighten-5"
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
                          <td>
                            <v-text-field
                              v-model="gasto.factura_recibo"
                              variant="outlined"
                              bg-color="blue-lighten-5"
                              hide-details
                              density="compact"
                              placeholder="Factura/Recibo"
                              :readonly="soloLectura"
                            ></v-text-field>
                          </td>
                          <td class="wide-column">
                            <v-text-field
                              v-model="gasto.concepto"
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
                </div>

                <v-divider class="my-4"></v-divider>

                <!-- Sección 4: Información Adicional -->
                <!-- Sección 4: Información Adicional -->
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
                        :readonly="soloLectura"
                      />
                    </v-col>
                  </v-row>
                </div>
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
                </div> -->

                <v-divider class="my-4"></v-divider>

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
                    SR
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
                    SRS
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
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'
import ProyectoIdHeader from '@/modules/proyecto/components/partials/ProyectoIdHeader.vue'
import ActividadInformacion from '@/modules/proyecto/components/partials/ActividadInformacion.vue'
import InformacionAdicionalEdicion from '@/modules/formularios/components/vinculacion/InformacionAdicionalEdicion.vue'
import { useImpresionFormularios } from '@/modules/impresiones/composables/useImpresionFormularios'
import { useUserStore } from '@/stores/user'
import * as XLSX from 'xlsx'
import { useRoute, useRouter } from 'vue-router'
import { useNotificaciones } from '@/modules/notificacion/composables/useNotificaciones'
import { useSnackbar } from '@/composables/useSnackbar'
//store
import { useSolicitudDeReposicionStore } from '@/modules/formularios/store/useSolicitudDeReposicionStore'
import RevisorSolicitudReposicion from '@/modules/formularios/components/validadores/componenteEstadoVotacion/RevisorSolicitudReposicion.vue'
import RedactorSolicitudReposicion from '@/modules/formularios/components/validadores/componenteRedactorEstadoValidacion/RedactorSolicitudReposicion.vue'
import { useActividadFormulaioPresupuesto } from '@/modules/formularios/composables/useActividadFormularioPresupuesto'
//Inciciar el store
const storeSolReposicion = useSolicitudDeReposicionStore()
//Referencia al componente
const infoRef = ref()
//Inicar Composable
const { enviarMensajeAutomatico } = useNotificaciones()
/*************************** Generar PDFs *******************************************/
const loadingPdfSolicitud = ref(false)
const loadingPdfSubactividad = ref(false)

//Inicializar el composable
const { generarPdfSolicitudReposicion, generarPdfSolicitudReposicionTareas } =
  useImpresionFormularios()

const generarPdfSolicitudFondosFunc = async () => {
  if (!idActividad) return

  loadingPdfSolicitud.value = true
  try {
    console.log('Generando PDF Solicitud de Fondos para actividad:', idActividad)
    await generarPdfSolicitudReposicion(idSolicitud)
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
    await generarPdfSolicitudReposicionTareas(idSolicitud)
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
const usuario = computed(() => {
  return {
    nombre: userStore.usuario,
    role: userStore.rol,
    id: userStore.id,
  }
})
console.log('ID Usuario:', usuario.value.id)
const { procedenciaFondosActividad } = useActividadFormulaioPresupuesto(idActividad)
//COmposable
const { warningMsg, successMsg } = useSnackbar()
const baseurl = import.meta.env.VITE_API_BASE

//variables para carga de datos
const datosFormulario = ref(null)
const datosFormulario1 = ref(null)
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
  nombre: '',
  paterno: '',
  materno: '',
  cargo: '',
  documento_identidad: '',
  descripcion_actividad: '',
  objetivo_actividad: '',
  fecha_irealizacion: '',
  fecha_frealizacion: '',
  fecha_ejecucion: '',
  fuente_financiamiento: '',
  id_actividad: 0,
  id_usuario: 0,
  detalle_destino_fondos: [
    { fecha: '', partida: '', fuente: null, factura_recibo: '', concepto: '', monto: 0 },
  ],
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
  actividad: null,
  usuario: null,
  validadores: [],
  formaPago: [],
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

const datosSolicitudDeReposicion = ref({
  descripcion_actividad: '',
  objetivo_actividad: '',
  fecha_ejecucion: '',
  detalleGastos: '{"items":[]}',
  forma_pago: null,
  fecha_solicitud: '',
  lugar_solicitud: '',
  validacionResponsable: false,
  responsable_id: null,
  validacionCoordinador: false,
  coordinador_id: null,
  usuario_id: null,
  actividad_id: null,
})

const soloLectura = computed(() => {
  if (!datosFormulario1.value || !usuario.value?.id) {
    return true
  }
  return datosFormulario1.value.usuario_id !== usuario.value.id
})

const idSolicitudFondos = ref(null)
const numeroFormularioSF = ref(null)

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

watch(
  datosFormulario,
  (newVal) => {
    if (newVal && newVal.usuario) {
      const usuario = newVal.usuario
      const getSafeValue = (value, defaultValue = '') => {
        return value !== null && value !== undefined ? value : defaultValue
      }

      if (newVal.actividad) {
        formData.value.descripcion_actividad = getSafeValue(newVal.actividad.descripcion)
        formData.value.objetivo_actividad = getSafeValue(newVal.actividad.objetivo_de_actividad)
        formData.value.fecha_irealizacion = getSafeValue(newVal.actividad.fecha_inicio)
        formData.value.fecha_frealizacion = getSafeValue(newVal.actividad.fecha_cierre)
        formData.value.fecha_ejecucion = getSafeValue(newVal.actividad.fecha_programada)
        formData.value.id_actividad = getSafeValue(newVal.actividad.id, 0)
        formData.value.fuente_financiamiento = getSafeValue(newVal.actividad.procedencia_fondos)

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

      if (newVal.validadores && Array.isArray(newVal.validadores)) {
        responsablesList.value =
          newVal.validadores.filter((user) => user && user.cargo === 'coordinador') || []
        coordinadoresList.value =
          newVal.validadores.filter((user) => user && user.cargo === 'dir-administrativo') || []
      } else {
        responsablesList.value = []
        coordinadoresList.value = []
      }
    }
  },
  { deep: true },
)

watch(
  datosFormulario1,
  (newVal) => {
    if (newVal && newVal.detalleDestinoFondos) {
      actualizarDetalleDestinoFondos(newVal.detalleDestinoFondos)
    }
    formData.value.idresponsable = newVal.responsable_id
    const getSafeValue = (value, defaultValue = '') => {
      return value !== null && value !== undefined ? value : defaultValue
    }
    const idSolicitante = newVal.usuario_id
    const datosSolicitante = datosFormulario.value.validadores.find((fp) => fp.id === idSolicitante)

    formData.value.nombre = getSafeValue(datosSolicitante.nombre)
    formData.value.paterno = getSafeValue(datosSolicitante.paterno)
    formData.value.materno = getSafeValue(datosSolicitante.materno)
    formData.value.cargo = getSafeValue(datosSolicitante.cargo)
    formData.value.documento_identidad = getSafeValue(datosSolicitante.ci)
    formData.value.id_usuario = getSafeValue(datosSolicitante.id, 0)
  },
  { deep: true },
)

watch(
  () => formData.value.forma_pago,
  (newVal, oldVal) => {
    if (newVal === oldVal) return
    const formaPagoSeleccionada = formasPagoOptions.value.find((fp) => fp.id === newVal)
    const nombreFormaPago = formaPagoSeleccionada ? formaPagoSeleccionada.formaPago : ''

    if (nombreFormaPago === 'Transferencia Bancaria') {
      formData.value.datos_forma_pago.otros = {
        nombre_otros: '',
        ci_otros: '',
      }
    } else {
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

const formaPagoElegido = computed(() => {
  if (formData.value.forma_pago && formasPagoOptions.value.length > 0) {
    const formaPago = formasPagoOptions.value.find((fp) => fp.id === formData.value.forma_pago)
    return formaPago ? formaPago.formaPago : ''
  }
  return ''
})

const MostrarCamposOtros = computed(() => {
  return formaPagoElegido.value !== 'Transferencia Bancaria'
})

const MostrarCamposTransferencia = computed(() => {
  return formaPagoElegido.value === 'Transferencia Bancaria'
})

const formasPagoTexto = computed(() => {
  if (formData.value.forma_pago && formasPagoOptions.value.length > 0) {
    const formaPago = formasPagoOptions.value.find((fp) => fp.id === formData.value.forma_pago)
    return formaPago ? formaPago.formaPago : ''
  }
  return ''
})

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

async function cargarDatos() {
  isLoading.value = true
  error.value = null
  try {
    const response = await fetch(baseurl + 'api/monitoreo/obtener-datos-formulario/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id_actividad: idActividad,
        usuario: usuario.value.nombre,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(
        `Error en la solicitud: ${response.status} - ${errorData.detail || 'Error desconocido'}`,
      )
    }

    const rawData = await response.json()
    datosFormulario.value = strictSanitizeData(rawData)
  } catch (err) {
    error.value = err.message
    console.error('Ha ocurrido un error:', err)
  } finally {
    isLoading.value = false
    cargandoGeneral.value = false
  }
}

function sanitizeData(data) {
  if (data === null || data === undefined) {
    return ''
  }
  if (typeof data === 'string') {
    const trimmed = data.trim()
    return trimmed === '' ? '' : trimmed
  }
  if (typeof data === 'number') {
    return isFinite(data) ? data : 0
  }
  if (typeof data === 'boolean') {
    return data
  }
  if (Array.isArray(data)) {
    return data
      .map((item) => sanitizeData(item))
      .filter((item) => item !== null && item !== undefined && item !== '')
  }
  if (typeof data === 'object') {
    const sanitized = {}
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const value = data[key]
        if (value !== null && value !== undefined && value !== '') {
          sanitized[key] = sanitizeData(value)
        }
      }
    }
    return sanitized
  }
  return ''
}

function strictSanitizeData(data) {
  const sanitized = sanitizeData(data)
  if (typeof sanitized === 'object' && !Array.isArray(sanitized)) {
    if (Object.keys(sanitized).length === 0) {
      return ''
    }
  }
  return sanitized
}

async function cargarSolicitudDeReposicion() {
  isLoading.value = true
  error.value = null
  try {
    const response = await fetch(baseurl + '/monitoreo_api/obtenerSolicitudReembolso/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`)
    }

    const data = await response.json()

    const solicitudesFiltradas = data.solicitudes.filter((solicitud) => {
      const coincideActividad = solicitud.actividad_id?.toString() === idActividad?.toString()
      const coincideTarea = solicitud.tarea_id?.toString() === idTarea?.toString()
      const coincideSolicitud = solicitud.id?.toString() === idSolicitud?.toString()
      return coincideActividad && coincideTarea && coincideSolicitud
    })

    datosFormulario1.value = strictSanitizeData(solicitudesFiltradas[0])
    actualizarDatosFormulario(solicitudesFiltradas[0])
  } catch (err) {
    error.value = err.message
    console.error('Error al cargar Reposiciones', err)
  } finally {
    isLoading.value = false
    cargandoGeneral.value = false
  }
}

function addGasto() {
  formData.value.detalle_destino_fondos.push({
    fecha: '',
    partida: '',
    fuente: null,
    factura_recibo: '',
    concepto: '',
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
    if (infoRef.value) {
      formData.value.lugar_solicitud = infoRef.value.localLugar
      formData.value.fecha_solicitud = infoRef.value.localFecha
      formData.value.forma_pago = infoRef.value.localFormaPago
      formData.value.datos_forma_pago = { ...infoRef.value.localDatosFormaPago }
    }
    if (!infoRef.value?.validacionCompleta) {
      warningMsg(
        'Por favor, complete todos los campos de Información Adicional (lugar, forma de pago y datos del beneficiario)',
      )
      return
    }

    if (!formData.value.lugar_solicitud || !formData.value.forma_pago) {
      throw new Error('Por favor, completa todos los campos obligatorios del formulario.')
    }
    if (totalMontoSolicitado.value <= 0) {
      throw new Error('El monto total solicitado debe ser mayor a cero.')
    }

    const coordinadorSeleccionado = coordinadoresList.value.find(
      (coordinador) => coordinador.id === formData.value.idcoordinador,
    )
    const contadorSeleccionado = responsablesList.value.find(
      (contador) => contador.id === formData.value.idresponsable,
    )

    const correoCoordinadorActual = coordinadorSeleccionado?.correo || ''
    const correoContadorActual = contadorSeleccionado?.correo || ''

    formData.value.correo_coordinador = correoCoordinadorActual
    formData.value.correo_contador = correoContadorActual

    const payload = {
      detalleDestinoFondos: {
        items: formData.value.detalle_destino_fondos.map((gasto) => ({
          fecha: gasto.fecha,
          partida: gasto.partida,
          fuente: gasto.fuente,
          factura_recibo: gasto.factura_recibo,
          concepto: gasto.concepto,
          monto: Number(gasto.monto),
        })),
      },
      formaPago: formData.value.forma_pago,
      lugarSolicitud: formData.value.lugar_solicitud,
      fechaSolicitud: formData.value.fecha_solicitud,
      fechaRealizacionActividad: formData.value.fecha_ejecucion,
      montoSolicitado: totalMontoSolicitado.value,
      validacionResponsable: false,
      responsable: formData.value.idresponsable,
      validacionCoordinador: false,
      coordinador: formData.value.idcoordinador,
      usuario: formData.value.id_usuario,
      actividad: formData.value.id_actividad,
      descripcion_actividad: formData.value.descripcion_actividad,
      objetivo_actividad: formData.value.objetivo_actividad,
      tarea: idTarea || null,
      datos_forma_pago: formData.value.datos_forma_pago,
    }

    const response = await fetch(baseurl + 'api/solicitud-reembolso/' + idSolicitud + '/', {
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

    // const urlForm = `${window.location.origin}/monitoreo/formulario033/${formData.value.id_actividad}?solicitud_id=${data.id}${formData.value.id_tarea ? `&tarea_id=${formData.value.id_tarea}` : ''}`
    // const cuerpoMensaje = {
    //   destinatario_id: payload.coordinador,
    //   asunto: 'Solicitud de Fondos - Coordinado',
    //   contenido:
    //     'Solicitud de Fondos pediente del formulario ' +
    //     numeroFormularioSF.value +
    //     '. URL: ' +
    //     urlForm,
    //   tipo: 'sistema',
    //   prioridad: 3,
    // }
    //await enviarMensajeAutomatico(cuerpoMensaje)

    // const cuerpoMensaje2 = {
    //   destinatario_id: payload.responsable,
    //   asunto: 'Solicitud de Fondos - Contador',
    //   contenido:
    //     'Solicitud de Fondos pediente del formulario ' +
    //     numeroFormularioSF.value +
    //     '. URL: ' +
    //     urlForm,
    //   tipo: 'sistema',
    //   prioridad: 3,
    // }

    exportToExcel()
    resetForm()

    //await enviarMensajeAutomatico(cuerpoMensaje2)

    // try {
    //   const emailPayload = {
    //     emails: [correoCoordinadorActual, correoContadorActual].filter((email) => email),
    //     datos_solicitud: {
    //       codigo: numeroFormularioSF.value || 'SOL-PROV',
    //       titulo: 'Formulario Sol. Fondos',
    //       solicitante: nombreCompletoSolicitante.value,
    //       tipo: 'Solicitud de Actividad',
    //       prioridad: 'alta',
    //       descripcion: formData.value.descripcion_actividad || 'Solicitud de fondos para actividad',
    //       url_revision: `${window.location.origin}/monitoreo/formulario033/${formData.value.id_actividad}?solicitud_id=${data.id}${formData.value.id_tarea ? `&tarea_id=${formData.value.id_tarea}` : ''}`,
    //     },
    //   }
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
    // }

    setTimeout(() => {
      // router.push('/pei/listaactividades?showButton=1')
      router.push('/monitoreo/actividades-formularios/')
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

  let validacionData = {}

  if (puedeValidarResponsable.value) {
    validacionData = {
      validacion_responsable: formDatSF.value.validacionResponsablesf,
    }
  } else if (puedeValidarCoordinador.value) {
    validacionData = {
      validacion_coordinador: formDatSF.value.validacionCoordinadorsf,
    }
  } else {
    alert('No tiene permisos de validación para esta solicitud.')
    return
  }

  const claveValidacion = Object.keys(validacionData)[0]
  if (!validacionData[claveValidacion]) {
    alert('Debe marcar la casilla para realizar la validación.')
    return
  }

  const payload = {
    id_solicitud: formDatSF.value.idsf || idSolicitud,
    ...validacionData,
  }

  if (!payload.id_solicitud) {
    alert('Error: No se encontró el ID de la solicitud para validar.')
    return
  }

  loading.value = true
  try {
    const response = await fetch(
      baseurl + '/monitoreo_api/actualizar-validacion-solicitud-reembolso/',
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      },
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(
        `Error al actualizar: ${response.status} - ${errorData.detail || errorData.mensaje || 'Error desconocido'}`,
      )
    }

    const data = await response.json()
    numeroFormulario.value = data.numero_formulario
    const urlForm = `${window.location.origin}/monitoreo/formulario033/${formData.value.id_actividad}?solicitud_id=${data.id}${formData.value.id_tarea ? `&tarea_id=${formData.value.id_tarea}` : ''}`

    const cuerpoMensaje = {
      destinatario_id: datosFormulario1.value.usuario_id,
      asunto: 'Solicitud de Reposición',
      contenido: 'Solicitud Aprobada' + numeroFormulario.value + '. URL: ' + urlForm,
      tipo: 'sistema',
      prioridad: 3,
    }
    await enviarMensajeAutomatico(cuerpoMensaje)

    const isLoading = ref(false)
    const { enviarEmailAprobacion, enviarEmailRechazo } = useNotificaciones()

    const probarEnvioEmail = async () => {
      console.log('🔄 Ejecutando prueba...')
      isLoading.value = true

      const datosAprobacion = {
        emails: [formData.value.correo],
        datos_aprobacion: {
          codigo: 'SOL-2024',
          titulo: 'Solicitud de Reposición Aprobado',
          solicitante_nombre: nombreCompletoSolicitante.value,
          aprobador_nombre: validador,
          numero_aprobacion: 'No de aprov',
          url_detalles: `${window.location.origin}/monitoreo/formulario033/${formData.value.id_actividad}?solicitud_id=${data.id}${formData.value.id_tarea ? `&tarea_id=${formData.value.id_tarea}` : ''}`,
        },
      }

      try {
        await enviarEmailAprobacion(datosAprobacion)
        console.log('Prueba ejecutada')
      } catch (error) {
        console.error(error)
      } finally {
        isLoading.value = false
      }
    }

    alert('Solicitud validada exitosamente.')
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
    detalle_destino_fondos: [
      { fecha: '', partida: '', factura_recibo: '', concepto: '', monto: 0 },
    ],
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
  const mainData = [
    ['FORMULARIO F-03: SOLICITUD DE REPOSICION', '', '', ''],
    [''],
    ['FORMULARIO Nro:', numeroFormularioSF, '', ''],
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

  const expensesHeaders = [
    'FECHA',
    'PARTIDA',
    'FUENTE',
    'FACTURA/RECIBO',
    'DESCRIPCIÓN DEL GASTO',
    'MONTO (BS.)',
    'OBSERVACIONES',
  ]

  const expensesData = formData.value.detalle_destino_fondos.map((gasto) => [
    gasto.fecha,
    gasto.partida,
    gasto.fuente,
    gasto.factura_recibo,
    gasto.concepto,
    gasto.monto,
    '',
  ])

  const totalRow = ['TOTAL', '', '', '', '', totalMontoSolicitado.value, '']

  const wb = XLSX.utils.book_new()
  const wsMain = XLSX.utils.aoa_to_sheet([...mainData, expensesHeaders, ...expensesData, totalRow])

  applyExcelStyles(
    wsMain,
    mainData.length,
    expensesData.length,
    formData.value.descripcion_actividad,
    formData.value.objetivo_actividad,
  )

  XLSX.utils.book_append_sheet(wb, wsMain, 'Solicitud de Reposicion')
  XLSX.writeFile(wb, `Solicitud_Reposicion_F-03_${getCurrentDate1()}.xlsx`)
}

function applyExcelStyles(
  worksheet,
  mainDataRows,
  expensesRows,
  descripcionActividad,
  objetivoActividad,
) {
  if (!worksheet['!merges']) worksheet['!merges'] = []

  worksheet['!merges'].push(
    { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: 6 } },
    { s: { r: 7, c: 0 }, e: { r: 7, c: 6 } },
    { s: { r: 12, c: 0 }, e: { r: 12, c: 6 } },
    { s: { r: 18, c: 0 }, e: { r: 18, c: 6 } },
    { s: { r: 21 + mainDataRows, c: 0 }, e: { r: 21 + mainDataRows, c: 6 } },
  )

  worksheet['!cols'] = [
    { wch: 15 },
    { wch: 15 },
    { wch: 20 },
    { wch: 20 },
    { wch: 35 },
    { wch: 15 },
    { wch: 20 },
  ]

  Object.keys(worksheet).forEach((cellAddress) => {
    if (cellAddress !== '!ref' && cellAddress !== '!merges' && cellAddress !== '!cols') {
      const cell = worksheet[cellAddress]
      const cellRef = XLSX.utils.decode_cell(cellAddress)

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
      } else if (cellRef.c === 0 && cellRef.r > 0 && cellRef.r < 21 + mainDataRows) {
        cell.s = {
          font: { bold: true, color: { rgb: '000000' } },
          fill: { fgColor: { rgb: 'D9E1F2' } },
        }
      } else if (cellRef.r === 22 + mainDataRows) {
        cell.s = {
          font: { bold: true, color: { rgb: 'FFFFFF' } },
          fill: { fgColor: { rgb: '5B9BD5' } },
          alignment: { horizontal: 'center' },
        }
      } else if (cellRef.r === 23 + mainDataRows + expensesRows) {
        cell.s = {
          font: { bold: true },
          fill: { fgColor: { rgb: 'F2F2F2' } },
        }
      } else if (
        cellRef.c === 5 &&
        cellRef.r >= 23 + mainDataRows &&
        cellRef.r <= 22 + mainDataRows + expensesRows
      ) {
        cell.z = '"Bs." #,##0.00'
      } else if (
        (cell.v && typeof cell.v === 'string' && cell.v.match(/\d{4}-\d{2}-\d{2}/)) ||
        (cellRef.c === 2 && cellRef.r === 9)
      ) {
        cell.z = 'dd/mm/yyyy'
      }

      if (cellRef.r === 8 && cellRef.c === 1) {
        if (!cell.s) cell.s = {}
        cell.s.alignment = cell.s.alignment || {}
        cell.s.alignment.wrapText = true
        cell.s.alignment.vertical = 'top'
      }

      if (cellRef.r === 10 && cellRef.c === 1) {
        if (!cell.s) cell.s = {}
        cell.s.alignment = cell.s.alignment || {}
        cell.s.alignment.wrapText = true
        cell.s.alignment.vertical = 'top'
      }
    }
  })

  const tableStartRow = 22 + mainDataRows
  const tableEndRow = 23 + mainDataRows + expensesRows

  for (let r = tableStartRow; r <= tableEndRow; r++) {
    for (let c = 0; c < 7; c++) {
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

  if (!worksheet['!rows']) worksheet['!rows'] = []

  if (descripcionActividad && descripcionActividad.length > 100) {
    worksheet['!rows'][8] = { hpt: 60 }
  }

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

function actualizarDatosFormulario(solicitud) {
  if (!solicitud) return

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

  if (solicitud.descripcion_actividad) {
    formData.value.descripcion_actividad = solicitud.descripcion_actividad
  }
  if (solicitud.objetivo_actividad) {
    formData.value.objetivo_actividad = solicitud.objetivo_actividad
  }
  if (solicitud.fechaRealizacionActividad) {
    formData.value.fecha_ejecucion = solicitud.fechaRealizacionActividad
  }

  actualizarDetalleDestinoFondos(formDatSF.value.detalleDestinoFondossf)
  actualizarInformacionAdicional(solicitud)
  actualizarValidadores()
}

function actualizarDetalleDestinoFondos(detalleDestinoFondos) {
  try {
    if (!detalleDestinoFondos) {
      formData.value.detalle_destino_fondos = []
      return
    }

    let detalleParseado
    if (typeof detalleDestinoFondos === 'string') {
      detalleParseado = JSON.parse(detalleDestinoFondos)
    } else {
      detalleParseado = detalleDestinoFondos
    }

    formData.value.detalle_destino_fondos = detalleParseado.items.map((item, index) => ({
      fecha: item.fecha || '',
      partida: item.partida || `${index + 1}.${index + 1}.${index + 1}`,
      fuente: item.fuente || '',
      factura_recibo: item.factura_recibo || '',
      concepto: item.concepto || '',
      monto: item.monto || 0,
    }))
  } catch (error) {
    console.error('Error al parsear detalleDestinoFondos:', error)
    formData.value.detalle_destino_fondos = []
  }
}

// function actualizarInformacionAdicional(solicitud) {
//   formData.value.forma_pago = formDatSF.value.formaPago_idsf
//   formData.value.lugar_solicitud = formDatSF.value.lugarSolicitudsf
//   formData.value.fecha_solicitud = formDatSF.value.fechaSolicitudsf

//   if (solicitud && solicitud.datos_forma_pago) {
//     const datosPago = solicitud.datos_forma_pago

//     if (datosPago.transferencia) {
//       formData.value.datos_forma_pago.transferencia = {
//         nombre_transferencia: datosPago.transferencia.nombre_transferencia || '',
//         ci_transferencia: datosPago.transferencia.ci_transferencia || '',
//         entidad_bancaria: datosPago.transferencia.entidad_bancaria || '',
//         tipo_cuenta: datosPago.transferencia.tipo_cuenta || '',
//         numero_cuenta: datosPago.transferencia.numero_cuenta || '',
//       }
//     }

//     if (datosPago.otros) {
//       formData.value.datos_forma_pago.otros = {
//         nombre_otros: datosPago.otros.nombre_otros || '',
//         ci_otros: datosPago.otros.ci_otros || '',
//       }
//     }
//   }
// }
function actualizarInformacionAdicional(solicitud) {
  formData.value.forma_pago = formDatSF.value.formaPago_idsf
  formData.value.lugar_solicitud = formDatSF.value.lugarSolicitudsf
  formData.value.fecha_solicitud = formDatSF.value.fechaSolicitudsf

  const defecto = {
    efectivo: { nombre_efectivo: '', ci_efectivo: '' },
    transferencia: {
      nombre_transferencia: '',
      ci_transferencia: '',
      entidad_bancaria: '',
      tipo_cuenta: '',
      numero_cuenta: '',
    },
    cheque: { nombre_cheque: '', ci_cheque: '' },
    otros: { nombre_otros: '', ci_otros: '' },
  }

  if (solicitud?.datos_forma_pago) {
    formData.value.datos_forma_pago = {
      efectivo: { ...defecto.efectivo, ...solicitud.datos_forma_pago.efectivo },
      transferencia: { ...defecto.transferencia, ...solicitud.datos_forma_pago.transferencia },
      cheque: { ...defecto.cheque, ...solicitud.datos_forma_pago.cheque },
      otros: { ...defecto.otros, ...solicitud.datos_forma_pago.otros },
    }
  }
}

function actualizarValidadores() {
  if (!datosFormulario.value || !datosFormulario.value.validadores) return

  const responsable = datosFormulario.value.validadores.find(
    (validador) => validador.id === formDatSF.value.responsable_idsf,
  )

  const coordinador = datosFormulario.value.validadores.find(
    (validador) => validador.id === formDatSF.value.coordinador_idsf,
  )

  if (responsable) {
    formData.value.idresponsable = responsable.id
  }

  if (coordinador) {
    formData.value.idcoordinador = coordinador.id
  } else {
    console.warn('No se encontró coordinador con ID:', formDatSF.value.coordinador_idsf)
  }

  actualizarListasValidadores()
}

function actualizarListasValidadores() {
  if (!datosFormulario.value || !datosFormulario.value.validadores) return

  responsablesList.value = datosFormulario.value.validadores.filter(
    (validador) => validador.cargo && validador.cargo.toLowerCase().includes('coordinador'),
  )

  coordinadoresList.value = datosFormulario.value.validadores.filter(
    (validador) => validador.cargo && validador.cargo.toLowerCase().includes('dir-administrativo'),
  )
}

const puedeValidarResponsable = computed(() => {
  const usuarioActualId = datosFormulario.value?.usuario?.id
  const usuarioActualCargo = datosFormulario.value?.usuario?.cargo?.toLowerCase()
  const responsableAsignadoId = datosFormulario1.value?.responsable_id

  return usuarioActualId === responsableAsignadoId && usuarioActualCargo?.includes('coordinador')
})

const puedeValidarCoordinador = computed(() => {
  const usuarioActualId = datosFormulario.value?.usuario?.id
  const usuarioActualCargo = datosFormulario.value?.usuario?.cargo?.toLowerCase()
  const coordinadorAsignadoId = formData.value.idcoordinador

  return (
    usuarioActualId === coordinadorAsignadoId && usuarioActualCargo?.includes('dir-administrativo')
  )
})

onMounted(async () => {
  await cargarDatos()
  await cargarSolicitudDeReposicion()
  await textoProcedencia.value
  await storeSolReposicion.cargarSolicitud(idSolicitud)
})
</script>

<style scoped>
.solicitud-viaje-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 16px;
}

/* ─── TARJETAS ─── */
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

/* ─── SECCIONES DEL FORMULARIO ─── */
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

/* ─── INFO ITEMS ─── */
.info-item {
  padding: 8px 0;
}

/* ─── ESPACIADOS ─── */
.gap-2 {
  gap: 8px;
}
.gap-3 {
  gap: 12px;
}

/* ═══════════════════════════════════════════ */
/* ─── TABLA DE GASTOS ─── */
/* ═══════════════════════════════════════════ */

.tabla-scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
}

.users-table {
  min-width: 950px;
  width: 100%;
}

.users-table :deep(.v-table__wrapper) {
  overflow-x: auto !important;
}

.users-table :deep(thead th) {
  background: #1976d2 !important;
  color: white !important;
  font-weight: 600 !important;
  font-size: 12px !important;
  padding: 10px 6px !important;
  white-space: nowrap !important;
  position: sticky;
  top: 0;
  z-index: 2;
  text-align: left !important;
}

.users-table :deep(tbody td) {
  padding: 3px 5px !important;
  vertical-align: middle !important;
  border-bottom: 1px solid #e8e8e8 !important;
}

.users-table :deep(tbody tr:hover td) {
  background-color: #f0f4ff;
}

/* Anchos de columna */
.users-table :deep(th:nth-child(1)),
.users-table :deep(td:nth-child(1)) {
  width: 135px;
  min-width: 135px;
}
.users-table :deep(th:nth-child(2)),
.users-table :deep(td:nth-child(2)) {
  width: 85px;
  min-width: 85px;
}
.users-table :deep(th:nth-child(3)),
.users-table :deep(td:nth-child(3)) {
  width: 145px;
  min-width: 145px;
}
.users-table :deep(th:nth-child(4)),
.users-table :deep(td:nth-child(4)) {
  width: 125px;
  min-width: 125px;
}
.users-table :deep(th:nth-child(5)),
.users-table :deep(td:nth-child(5)) {
  width: auto;
  min-width: 200px;
}
.users-table :deep(th:nth-child(6)),
.users-table :deep(td:nth-child(6)) {
  width: 115px;
  min-width: 115px;
}
.users-table :deep(th:nth-child(7)),
.users-table :deep(td:nth-child(7)) {
  width: 40px;
  min-width: 40px;
  text-align: center;
}

/* Inputs compactos */
.users-table :deep(.v-field) {
  min-height: 32px !important;
}
.users-table :deep(.v-field__input) {
  min-height: 32px !important;
  padding: 4px 8px !important;
  font-size: 13px !important;
}
.users-table :deep(.v-field__outline) {
  --v-field-border-opacity: 0.3;
}
.users-table :deep(.v-input__details) {
  display: none;
}
.users-table :deep(td:nth-child(6) input) {
  text-align: right;
  font-weight: 500;
}
.users-table :deep(.v-select__selection-text) {
  font-size: 13px !important;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.users-table :deep(input[type='date']) {
  font-size: 12px !important;
}

/* Scrollbar */
.tabla-scroll::-webkit-scrollbar {
  height: 6px;
}
.tabla-scroll::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}
.tabla-scroll::-webkit-scrollbar-thumb {
  background: #bbb;
  border-radius: 3px;
}
.tabla-scroll::-webkit-scrollbar-thumb:hover {
  background: #888;
}

/* ═══════════════════════════════════════════ */
/* ─── RESPONSIVE ─── */
/* ═══════════════════════════════════════════ */

@media (max-width: 960px) {
  .solicitud-viaje-container {
    padding: 12px 8px;
  }
  .form-section {
    padding: 16px;
    margin-bottom: 16px;
  }
  .form-section h3 {
    font-size: 16px !important;
  }
  .d-flex.justify-end {
    flex-direction: column;
    gap: 8px;
  }
  .d-flex.justify-end .v-btn {
    width: 100%;
  }
  .users-table {
    min-width: 800px;
  }
  .users-table :deep(thead th) {
    font-size: 11px !important;
    padding: 8px 4px !important;
  }
  .users-table :deep(.v-field__input) {
    font-size: 12px !important;
  }
}

@media (max-width: 600px) {
  .v-card {
    margin: 8px 0;
  }
  .form-section {
    padding: 12px;
  }
  .users-table {
    min-width: 700px;
  }
  .users-table :deep(thead th) {
    font-size: 10px !important;
    padding: 6px 3px !important;
  }
  .users-table :deep(tbody td) {
    padding: 2px 3px !important;
  }
  .users-table :deep(.v-field) {
    min-height: 28px !important;
  }
  .users-table :deep(.v-field__input) {
    min-height: 28px !important;
    padding: 2px 4px !important;
    font-size: 11px !important;
  }
}
</style>
