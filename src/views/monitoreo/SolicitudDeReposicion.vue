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
        <p class="mt-4 text-h6">Cargando formulario de reposicion...</p>
      </div>
    </v-overlay>

    <div v-if="!cargandoGeneral">
      <!--Titulo de la pagina-->
      <PaginaTituloIcono
        :titulo="'Solicitud de Reposicion'"
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
        <v-col cols="12" md="3" lg="3">
          <!-- <v-card elevation="2" rounded="lg" class="mb-4">
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
          </v-card> -->
          <ActividadInfoGeneralPanel
            v-if="actividadNodoInformacion"
            :actividad="actividadNodoInformacion"
            :cargando="loadingActividad"
            :presupuesto-tareas="tareasPresupuestoAsignado"
            :presupuesto-solicitudes="totalSolicitudesSinRendicion"
            :presupuesto-disponible="actividadPresupuestoDisponible"
            :totales-solicitudes="totalSolicitudesPorTipo"
          ></ActividadInfoGeneralPanel>
          <TareaInfoGeneralPanel
            v-if="tareaNodoInformacion"
            :tarea="tareaNodoInformacion"
            :presupuestoSolicitudesTarea="tareaTotalSolicitudesSinRendicion"
            :presupuestoDisponibleTarea="tareaPresupuestoDisponible"
            :totalesSolicitudesTarea="tareaTotalSolicitudesPorTipo"
          ></TareaInfoGeneralPanel>

          <!-- Tarjeta de resumen rápido de la solicitud -->
          <v-card elevation="2" rounded="lg" class="mb-4">
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
              <!-- <div class="d-flex justify-space-between align-center">
                <span class="text-subtitle-2 text-medium-emphasis">Lugar:</span>
                <span class="text-body-1 font-weight-medium text-truncate" style="max-width: 150px">
                  {{ formData.lugar_solicitud || 'No especificado' }}
                </span>
              </div> -->
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Formulario principal -->
        <v-col cols="12" md="9" lg="9">
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
                    required
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
                    required
                  ></v-textarea>
                  <v-text-field
                    v-model="textoProcedencia"
                    label="Fuentes de Financiamiento"
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
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-file-input
                      v-model="formData.medios_archivos"
                      label="Adjuntar Medios de verificacion"
                      variant="outlined"
                      hint="Ud. puede adjuntar: contrato, acta de conformidad, informe de consultoria, factura por servicio... "
                      persistent-hint
                      multiple
                      chips
                      show-size
                      :accept="acceptedFormats.medios"
                      prepend-icon="mdi-paperclip"
                    ></v-file-input>
                  </v-col>
                </div>

                <v-divider class="my-4"></v-divider>

                <!-- Sección 3: Detalle de Gastos -->
                <div class="form-section mb-6">
                  <h3 class="text-h6 mb-4 primary--text">
                    <v-icon color="primary" class="mr-2">mdi-cash</v-icon>
                    Detalle de Gastos Solicitados
                  </h3>

                  <!-- <div class="d-flex justify-space-between align-center mb-4">
                    <v-btn
                      color="primary"
                      variant="outlined"
                      prepend-icon="mdi-plus"
                      @click="addGasto"
                    >
                      Agregar Item
                    </v-btn>
                    <v-chip class="text-subtitle-1" color="primary" variant="outlined">
                      Monto Total Solicitado (Bs.): {{ totalMontoSolicitado.toLocaleString() }}
                    </v-chip>
                  </div> -->
                  <div class="d-flex justify-space-between align-center mb-4">
                    <v-btn
                      color="primary"
                      variant="outlined"
                      prepend-icon="mdi-plus"
                      @click="addGasto"
                    >
                      Agregar Item
                    </v-btn>
                    <div class="d-flex align-center ga-4">
                      <v-chip
                        class="text-subtitle-1"
                        :color="excedePresupuesto ? 'error' : 'primary'"
                        variant="outlined"
                      >
                        Monto Total: Bs. {{ totalMontoSolicitado.toLocaleString() }}
                      </v-chip>

                      <!-- ALERTA DE PRESUPUESTO COMPACTA -->
                      <v-alert
                        :type="excedePresupuesto ? 'error' : 'success'"
                        density="compact"
                        variant="tonal"
                        class="mb-0"
                        :icon="false"
                        style="min-width: 280px"
                      >
                        <div v-if="excedePresupuesto" class="text-caption">
                          <strong>¡Excedido!</strong>
                          Límite: Bs. {{ limitePresupuesto.toLocaleString() }} | Excedente: Bs.
                          {{ montoExcedido.toLocaleString() }}
                        </div>
                        <div v-else class="text-caption">
                          <strong>Disponible:</strong> Bs.
                          {{ limitePresupuesto.toLocaleString() }} | <strong>Saldo:</strong> Bs.
                          {{ (limitePresupuesto - totalMontoSolicitado).toLocaleString() }}
                        </div>
                      </v-alert>
                    </div>
                  </div>

                  <div class="table-responsive">
                    <v-table class="elevation-1 rounded-lg users-table" density="compact">
                      <thead>
                        <tr>
                          <th style="min-width: 150px">Fecha *</th>
                          <th style="min-width: 100px">Partida *</th>
                          <th style="min-width: 160px">Fuente *</th>
                          <th style="min-width: 140px">Factura/Recibo *</th>
                          <th style="min-width: 250px">Descripción *</th>
                          <th style="min-width: 120px">Monto (Bs.) *</th>
                          <th style="min-width: 50px; width: 50px"></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(gasto, index) in formData.detalle_destino_fondos"
                          :key="index"
                          :class="{
                            'bg-red-lighten-5':
                              !isGastoCompleto(gasto) && formData.detalle_destino_fondos.length > 1,
                          }"
                        >
                          <td>
                            <input
                              v-model="gasto.fecha"
                              type="date"
                              required
                              style="
                                width: 140px;
                                padding: 8px;
                                border: 1px solid #bbb;
                                border-radius: 4px;
                                background: #e3f2fd;
                                font-size: 12px;
                                font-family: inherit;
                              "
                            />
                          </td>
                          <td>
                            <v-text-field
                              v-model="gasto.partida"
                              variant="outlined"
                              density="compact"
                              hide-details
                              bg-color="blue-lighten-5"
                              placeholder="1.1.1"
                              :rules="[validarPartida]"
                              required
                              style="min-width: 90px"
                            ></v-text-field>
                          </td>
                          <td>
                            <v-select
                              v-model="gasto.fuente"
                              :items="procedenciaFondosActividad"
                              item-title="financiera"
                              return-object
                              variant="outlined"
                              density="compact"
                              placeholder="Financiador"
                              bg-color="blue-lighten-5"
                              hide-details
                              :rules="[validarFuente]"
                              style="min-width: 150px"
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
                              :rules="[validarFactura]"
                              required
                              style="min-width: 130px"
                            ></v-text-field>
                          </td>
                          <td>
                            <v-text-field
                              v-model="gasto.descripcion_gasto"
                              variant="outlined"
                              density="compact"
                              hide-details
                              bg-color="blue-lighten-5"
                              placeholder="Descripción del gasto"
                              :rules="[validarDescripcionGasto]"
                              required
                              style="min-width: 240px"
                            ></v-text-field>
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
                              :rules="[validarMontoGasto]"
                              required
                              style="min-width: 110px"
                            ></v-text-field>
                          </td>
                          <td class="text-center">
                            <v-btn
                              icon
                              color="error"
                              size="x-small"
                              variant="text"
                              @click="removeGasto(index)"
                            >
                              <v-icon size="16">mdi-delete</v-icon>
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
                      <InformacionAdicional ref="infoRef"></InformacionAdicional>
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
                        required
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
                        required
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
                          :required="MostrarCamposOtros"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="formData.datos_forma_pago.otros.ci_otros"
                          label="Documento de Identidad C.I."
                          variant="outlined"
                          bg-color="blue-lighten-5"
                          :required="MostrarCamposOtros"
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
                          :required="MostrarCamposTransferencia"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="formData.datos_forma_pago.transferencia.ci_transferencia"
                          label="Documento de Identidad C.I."
                          variant="outlined"
                          bg-color="blue-lighten-5"
                          :required="MostrarCamposTransferencia"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="formData.datos_forma_pago.transferencia.entidad_bancaria"
                          label="Nombre de Entidad Bancaria"
                          variant="outlined"
                          bg-color="blue-lighten-5"
                          :required="MostrarCamposTransferencia"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="formData.datos_forma_pago.transferencia.tipo_cuenta"
                          :items="['Ahorro', 'Corriente']"
                          label="Tipo de Cuenta (Ahorro/ Corriente)"
                          variant="outlined"
                          bg-color="blue-lighten-5"
                          :required="MostrarCamposTransferencia"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="formData.datos_forma_pago.transferencia.numero_cuenta"
                          label="Número de Cuenta Bancaria"
                          variant="outlined"
                          bg-color="blue-lighten-5"
                          :required="MostrarCamposTransferencia"
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
                        v-model="formData.idcontador"
                        :items="contadoresList"
                        :item-title="getNombreCompleto"
                        item-value="id"
                        label="Responsable Coordinación"
                        variant="outlined"
                        bg-color="blue-lighten-5"
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="12" md="6" class="d-flex align-center">
                      <v-checkbox
                        v-model="formData.validacion_responsable"
                        label="Aprobado por Coordinación"
                        :disabled="isFrozen"
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
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="12" md="6" class="d-flex align-center">
                      <v-checkbox
                        v-model="formData.validacion_coordinador"
                        label="Aprobado por Dirección Administrativa"
                        :disabled="isFrozen"
                      ></v-checkbox>
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
                    <v-col cols="12">
                      <SeleccionValidadoresSolicitudes></SeleccionValidadoresSolicitudes>
                    </v-col>
                  </v-row>
                </div> -->

                <!-- Botones de acción -->
                <!-- <div class="d-flex justify-end gap-3 mt-8">
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
                    color="secondary"
                    variant="outlined"
                    size="large"
                    prepend-icon="mdi-backspace-outline"
                    @click="resetForm"
                  >
                    Limpiar
                  </v-btn>
                  <v-btn
                    color="primary"
                    variant="flat"
                    size="large"
                    prepend-icon="mdi-send"
                    type="submit"
                    :loading="loading"
                  >
                    Enviar Solicitud
                  </v-btn>
                </div> -->
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
  <!---------------------------------COMPONENTES DE NAVEGACION Y ENVIO --------------------------------->
  <!--Barra de herramientas, guardar, enviar, etc-->
  <BarraHerramientasFormulario
    @save-draft="guardarFormulario"
    @submit-review="enviarFormulario"
    @cancel="cancelarSalir"
  ></BarraHerramientasFormulario>
  <!--Dialogo para guardar el formulario-->
  <DialogoGuardarFormulario
    ref="dialogoGuardarRef"
    :titulo="'Solicitud de Reposicion'"
    :datos="datosResumen"
    @confirm="confirmarGuardarDatosForm"
    @close="cerrarDialogoGuardarForm"
  ></DialogoGuardarFormulario>
  <!--Dialogo para guardar el formulario y enviar a revision -->
  <DialogoGuardarFormularioValidador
    ref="dialogoRevisionRef"
    titulo="Solicitud de Reposicion"
    :datos="datosResumen"
    @confirm="confirmarEnvioRevision"
    @close="cerrarDialogoRevision"
  ></DialogoGuardarFormularioValidador>
  <!--Dialogo de confirmacion para salir -->
  <ConfirmDialog></ConfirmDialog>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'
import ProyectoIdHeader from '@/modules/proyecto/components/partials/ProyectoIdHeader.vue'
import ActividadInformacion from '@/modules/proyecto/components/partials/ActividadInformacion.vue'
import { useUserStore } from '@/stores/user'
import * as XLSX from 'xlsx'
import { useRoute, useRouter } from 'vue-router'
import { useNotificaciones } from '@/modules/notificacion/composables/useNotificaciones'
import SeleccionValidadoresSolicitudes from '@/modules/formularios/components/validadores/SeleccionValidadoresSolicitudes.vue'
//COmpnentes y composables nuevos
import InformacionAdicional from '@/modules/formularios/components/InformacionAdicional.vue'
import BarraHerramientasFormulario from '@/modules/formularios/barraHerramientas/BarraHerramientasFormulario.vue'
import DialogoGuardarFormulario from '@/modules/formularios/barraHerramientas/DialogoGuardarFormulario.vue'
import DialogoGuardarFormularioValidador from '@/modules/formularios/barraHerramientas/DialogoGuardarFormularioValidador.vue'
import ConfirmDialog from '@/components/layout/partials/ConfirmDialog.vue'
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import { useSnackbar } from '@/composables/useSnackbar'
import { validadoresSolReposicionServicio } from '@/modules/formularios/services/validadoresSolReposicionService'
import { useValidadoresSolReposicion } from '@/modules/formularios/composables/useValidadoresSolReposicion'
import ActividadInfoGeneralPanel from '@/modules/formularios/components/partials/ActividadInfoGeneralPanel.vue'
import TareaInfoGeneralPanel from '@/modules/formularios/components/partials/TareaInfoGeneralPanel.vue'
import { useActividadFormulaioPresupuesto } from '@/modules/formularios/composables/useActividadFormularioPresupuesto'
import { useTareaFormularioPresupuesto } from '@/modules/formularios/composables/useTareaFormularioPresupuesto'
/******* Computed para ligar la informacion al componente InformacionAdicional ***********************************************************************/

//Referencia al componente Informacion adicional
const infoRef = ref(null)

//Bandera para comprobar que la Informacion Adicional esta completa
const estaCompletaInformacionAdicional = computed(() => {
  return infoRef.value?.validacionCompleta
})

//Lugar
const lugar = computed(() => {
  return infoRef.value?.informacionAdicionalDatos.lugar
})

//Forma de pago
const idFormaPago = computed(() => {
  return infoRef.value?.informacionAdicionalDatos.formaPago
})

const datosDeLaFormaPago = computed(() => {
  return infoRef.value?.informacionAdicionalDatos.datosFormaPago
})

//Inicar Composable
const { enviarMensajeAutomatico } = useNotificaciones()
const { openConfirmDialog } = useConfirmDialog()
const { successMsg, errorMsg, warningMsg } = useSnackbar()
const { asignarValidadores } = useValidadoresSolReposicion()

//Routes
const router = useRouter()
const route = useRoute()
// Convertir a número y validar
const idActividad = route.params.id ? parseInt(route.params.id) : null
const idTarea = route.query.tarea_id ? parseInt(route.query.tarea_id) : null
console.log('ID Actividad:', idActividad)
console.log('ID Tarea:', idTarea)

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
const contadoresList = ref([])
const coordinadoresList = ref([])
const acceptedFormats = ref({
  medios: '.pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx',
})

/****************************** PRESUPUESTO y sus Validaciones *********************************************************/

//Composable para conexion al arbol de presupuesto, nodo actividad
const {
  loading: loadingActividad, //bandera de carga
  actividadNodoInformacion, //Nodo Actividad - Informacion de la actividad
  actividadPresupuestoAsignado, //Presupuesto asignado a la actividad
  tareasPresupuestoAsignado, //Presupuesto asignado a las tareas
  numeroSolicitudesActividad, //numero de solicitudes de la actividad
  totalSolicitudesSinRendicion, //cantidad asignada a las solicitudes
  actividadPresupuestoDisponible, //Cantidad disponible
  totalSolicitudesPorTipo, //Desglose de las solicitudes por tipo
  procedenciaFondosActividad, //procedencia fondos de la actividad
} = useActividadFormulaioPresupuesto(idActividad)

//Composable para conexion al nodo tareas, inicializacion condicional
const composableTarea = idTarea ? useTareaFormularioPresupuesto(idTarea) : null

//Extraer datos de la Tarea
const tareaPresupuestoAsignado = computed(() => composableTarea?.tareaPresupuestoAsignado?.value)
const tareaNodoInformacion = computed(() => composableTarea?.tareaNodoInformacion?.value || null)
const tareaNodoPresupuesto = computed(() => composableTarea?.tareaNodoPresupuesto?.value || null)
const tareaTotalSolicitudesSinRendicion = computed(
  () => composableTarea?.totalSolicitudesSinRendicion?.value || null,
)
const tareaTotalSolicitudesPorTipo = computed(() => composableTarea.totalSolicitudesPorTipo.value)

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
// AGREGAR después del computed limitePresupuesto

// Computed para verificar si excede el presupuesto
const excedePresupuesto = computed(() => {
  return totalMontoSolicitado.value > limitePresupuesto.value
})

// Computed para calcular el monto excedido
const montoExcedido = computed(() => {
  if (!excedePresupuesto.value) return 0
  return totalMontoSolicitado.value - limitePresupuesto.value
})

// Computed para verificar si todos los items del desglose están completos
const desgloseCompleto = computed(() => {
  if (formData.value.detalle_destino_fondos.length === 0) return false
  return formData.value.detalle_destino_fondos.every(
    (gasto) =>
      gasto.fecha &&
      gasto.partida &&
      gasto.partida.trim() !== '' &&
      gasto.fuente &&
      gasto.descripcion_gasto &&
      gasto.descripcion_gasto.trim() !== '' &&
      gasto.monto &&
      Number(gasto.monto) > 0,
  )
})

// Computed para identificar filas incompletas
const itemsIncompletos = computed(() => {
  return formData.value.detalle_destino_fondos
    .map((gasto, index) => ({
      index: index + 1,
      completo:
        gasto.fecha && gasto.partida && gasto.fuente && gasto.descripcion_gasto && gasto.monto > 0,
    }))
    .filter((item) => !item.completo)
    .map((item) => item.index)
})

// Funciones de validación para cada campo
const validarPartida = (v) => {
  if (!v || v.trim() === '') return 'Partida requerida'
  return true
}

const validarFuente = (v) => {
  if (!v) return 'Fuente requerida'
  return true
}

const validarFactura = (v) => {
  if (!v || v.trim() === '') return 'Factura/Recibo requerido'
  return true
}

const validarDescripcionGasto = (v) => {
  if (!v || v.trim() === '') return 'Descripción requerida'
  return true
}

const validarMontoGasto = (v) => {
  if (!v && v !== 0) return 'Monto requerido'
  if (Number(v) <= 0) return 'Monto debe ser > 0'
  return true
}

// Función para verificar si un gasto individual está completo
const isGastoCompleto = (gasto) => {
  return (
    gasto.fecha &&
    gasto.partida &&
    gasto.partida.trim() !== '' &&
    gasto.fuente &&
    gasto.descripcion_gasto &&
    gasto.descripcion_gasto.trim() !== '' &&
    gasto.monto &&
    Number(gasto.monto) > 0
  )
}

/**************************** FIN PRESUPUESTO Validaciones ***********************************************************/

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
  id_tarea: 0,
  id_usuario: 0,
  // Resto de campos del formulario
  detalle_destino_fondos: [
    { fecha: '', partida: '', fuente: '', factura_recibo: '', descripcion_gasto: '', monto: 0 },
  ],
  monto_solicitado: 0,
  lugar_solicitud: '',
  fecha_solicitud: getCurrentDate(),
  // Campos de forma de pago
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

  validacion_contador: false,
  idcontador: null,
  validacion_coordinador: false,
  idcoordinador: null,
  correo_coordinador: '',
  correo_contador: '',
  codigo_actividad: '',
  medios_archivos: [],
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

//datos para abrir Solicitud de Fondos
const idSolicitudFondos = ref(null)
const numeroFormularioSF = ref(null)
// Nuevo estado para controlar el bloqueo

const userStore = useUserStore()
const usuario = computed(() => {
  return {
    nombre: userStore.usuario,
    role: userStore.rol,
    id: userStore.id,
  }
})
console.log('ID Usuario:', JSON.stringify(usuario.value.id, null, 2)) //.value.id)

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

// // Logica para formas de pago (solo debe haber tres formas de Pago: otros, Cheque, Transferencia)
const formasPagoOptions = computed(() => {
  if (datosFormulario.value && datosFormulario.value.formaPago) {
    return datosFormulario.value.formaPago
  }
  return []
})
const formaPagoElegido = computed(() => {
  if (formData.value.forma_pago && formasPagoOptions.value.length > 0) {
    const formaPago = formasPagoOptions.value.find((fp) => fp.id === formData.value.forma_pago)
    // return formaPago ? formaPago.formaPago.toLowerCase() : ''
    return formaPago ? formaPago.formaPago : ''
  }
  return ''
})
const MostrarCamposOtros = computed(() => {
  const formaPagoTexto = formaPagoElegido.value
  //  return formaPagoElegido.value !== 'Transferaencia Bancaria'
  return formaPagoTexto === 'Efectivo' || formaPagoTexto === 'Cheque'
})
const MostrarCamposTransferencia = computed(() => {
  const formaPagoTexto = formaPagoElegido.value
  //return formaPagoElegido.value === 'Transferencia Bancaria'
  return formaPagoTexto === 'Transferencia Bancaria'
})

// Propiedades computadas
const nombreCoordinadorElegido = computed(() => {
  const coordinador = coordinadoresList.value.find(
    (user) => user.id === formData.value.idcoordinador,
  )
  return coordinador ? getNombreCompleto(coordinador) : ''
})

// const nombreResponsableElegido = computed(() => {
//   const responsable = responsablesList.value.find(
//     (user) => user.id === formData.value.idresponsable,
//   )
//   return responsable ? getNombreCompleto(responsable) : ''
// })

const nombreContadorElegido = computed(() => {
  const contador = contadoresList.value.find((user) => user.id === formData.value.idcontador)
  return contador ? getNombreCompleto(contador) : ''
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

const isFrozen = computed(() => {
  return true
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
      formData.value.nombre = getSafeValue(usuario.nombre)
      formData.value.paterno = getSafeValue(usuario.paterno)
      formData.value.materno = getSafeValue(usuario.materno)
      formData.value.cargo = getSafeValue(usuario.cargo)
      formData.value.documento_identidad = getSafeValue(usuario.ci)
      formData.value.id_usuario = getSafeValue(usuario.id, 0)

      // Llenar campos de la actividad si existen
      if (newVal.actividad) {
        //console.log('Auto-llenando datos de actividad:', newVal.actividad)

        formData.value.descripcion_actividad = getSafeValue(newVal.actividad.descripcion)
        formData.value.objetivo_actividad = getSafeValue(newVal.actividad.objetivo_de_actividad)
        formData.value.fecha_irealizacion = getSafeValue(newVal.actividad.fecha_inicio)
        formData.value.fecha_frealizacion = getSafeValue(newVal.actividad.fecha_cierre)
        formData.value.fecha_ejecucion = getSafeValue(newVal.actividad.fecha_programada)
        formData.value.id_actividad = getSafeValue(newVal.actividad.id, 0)
        formData.value.codigo_actividad = getSafeValue(newVal.actividad.codigo)
        // Asignar id_tarea desde los parámetros de la ruta si existe
        formData.value.id_tarea = idTarea || 0
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
          newVal.validadores.filter((user) => user && user.cargo === 'responsable') || []
        contadoresList.value =
          newVal.validadores.filter((user) => user && user.cargo === 'coordinador') || []
        coordinadoresList.value =
          newVal.validadores.filter((user) => user && user.cargo === 'dir-administrativo') || [] //'coordinador') || []
      } else {
        responsablesList.value = []
        contadoresList.value = []
        coordinadoresList.value = []
      }
    }
  },
  { deep: true },
)

// WATCH PARA GUARDAR EL CORREO DEL COORDINADOR Y DEL CONTADOR CUANDO SE SELECCIONA
watch(
  () => formData.value.idcoordinador,
  (newIdCoordinador) => {
    if (newIdCoordinador && coordinadoresList.value.length > 0) {
      const coordinadorSeleccionado = coordinadoresList.value.find(
        (coordinador) => coordinador.id === newIdCoordinador,
      )

      if (coordinadorSeleccionado && coordinadorSeleccionado.correo) {
        formData.value.correo_coordinador = coordinadorSeleccionado.correo
      } else {
        formData.value.correo_coordinador = ''
      }
    } else {
      formData.value.correo_coordinador = ''
    }
  },
)

watch(
  () => formData.value.idcontador,
  (newIdContador) => {
    if (newIdContador && contadoresList.value.length > 0) {
      const contadorSeleccionado = contadoresList.value.find(
        (contador) => contador.id === newIdContador,
      )

      if (contadorSeleccionado && contadorSeleccionado.correo) {
        formData.value.correo_contador = contadorSeleccionado.correo
      } else {
        formData.value.correo_contador = ''
      }
    } else {
      formData.value.correo_contador = ''
    }
  },
)

// Agrega este watch para actualizar automáticamente cuando cambien los datosFormulario1
watch(
  datosFormulario1,
  (newVal) => {
    if (newVal && newVal.detalleDestinoFondos) {
      actualizarDetalleDestinoFondos(newVal.detalleDestinoFondos)
    }
  },
  { deep: true },
)

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
    //console.log('Datos cargados exitosamente:', datosFormulario.value)
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

async function cargarSolicitudFondos() {
  isLoading.value = true
  error.value = null
  try {
    const response = await fetch(baseurl + 'monitoreo_api/obtenerSolicitudFondos/', {
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
      //const coincideSolicitud = solicitud.id?.toString() === idSolicitud?.toString()

      // console.log('Coincidencias:', { coincideActividad, coincideTarea, coincideSolicitud })

      return coincideActividad && coincideTarea //&& coincideSolicitud
    })

    datosFormulario1.value = strictSanitizeData(solicitudesFiltradas[0])
    actualizarDatosFormulario(solicitudesFiltradas[0])
  } catch (err) {
    error.value = err.message
    console.error('Error al cargar solicitudes:', err)
  } finally {
    isLoading.value = false
    cargandoGeneral.value = false
  }
}

function addGasto() {
  formData.value.detalle_destino_fondos.push({
    fecha: '',
    partida: '',
    fuente: '',
    factura_recibo: '',
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
    // Validar si el formulario está completo
    if (
      !formData.value.lugar_solicitud ||
      !formData.value.forma_pago ||
      !formData.value.idcoordinador
    ) {
      throw new Error('Por favor, completa todos los campos obligatorios del formulario.')
    }
    if (totalMontoSolicitado.value <= 0) {
      throw new Error('El monto total solicitado debe ser mayor a cero.')
    }
    // Transformar los datos al formato esperado por el endpoint

    // OBTENER LOS CORREOS ACTUALES ANTES DE ENVIAR
    const coordinadorSeleccionado = coordinadoresList.value.find(
      (coordinador) => coordinador.id === formData.value.idcoordinador,
    )
    const contadorSeleccionado = contadoresList.value.find(
      (contador) => contador.id === formData.value.idcontador,
    )

    const correoCoordinadorActual = coordinadorSeleccionado?.correo || ''
    const correoContadorActual = contadorSeleccionado?.correo || ''

    // Actualizar los valores en formData
    formData.value.correo_coordinador = correoCoordinadorActual
    formData.value.correo_contador = correoContadorActual

    const payload = {
      detalleDestinoFondos: {
        items: formData.value.detalle_destino_fondos.map((gasto) => ({
          fecha: gasto.fecha || '',
          partida: gasto.partida,
          fuente: gasto.fuente,
          factura_recibo: gasto.factura_recibo || '',
          concepto: gasto.descripcion_gasto,
          monto: Number(gasto.monto),
        })),
      },
      formaPago: formData.value.forma_pago,
      lugarSolicitud: formData.value.lugar_solicitud,
      fechaSolicitud: formData.value.fecha_solicitud,
      fechaRealizacionActividad: formData.value.fecha_ejecucion,
      montoSolicitado: totalMontoSolicitado.value,
      validacionResponsable: formData.value.validacion_responsable,
      responsable: formData.value.idcontador,
      //contador_id: formData.value.idcontador,
      validacionCoordinador: formData.value.validacion_coordinador,
      coordinador: formData.value.idcoordinador,
      usuario: formData.value.id_usuario,
      actividad: formData.value.id_actividad,
      descripcion_actividad: formData.value.descripcion_actividad,
      objetivo_actividad: formData.value.objetivo_actividad,
      // Solo incluir id_tarea si tiene un valor válido (cuando es una solicitud para tarea)
      ...(formData.value.id_tarea &&
        formData.value.id_tarea > 0 && { tarea: formData.value.id_tarea }),
      datos_forma_pago: formData.value.datos_forma_pago,
      //bloquear_icono_sf: true,
      //codigo_actividad: formData.value.codigo_actividad,
    }

    console.log('Payload enviado##############:', JSON.stringify(payload, null, 2))
    const response = await fetch(baseurl + '/api/solicitud-reembolso-v2/', {
      method: 'POST',
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

    const urlForm = `${window.location.origin}/monitoreo/formulario033/${formData.value.id_actividad}?solicitud_id=${data.id}${formData.value.id_tarea ? `&tarea_id=${formData.value.id_tarea}` : ''}`

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
      destinatario_id: payload.responsable,
      asunto: 'Solicitud de Pago - Coordinado',
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
        //emails: [formData.value.correo_coordinador, formData.value.correo_contador],
        emails: [correoCoordinadorActual, correoContadorActual].filter((email) => email),
        datos_solicitud: {
          codigo: numeroFormularioSF.value || 'SOL-PROV',
          titulo: 'Formulario Sol. Reposicion',
          solicitante: nombreCompletoSolicitante.value,
          tipo: 'Solicitud de Actividad',
          prioridad: 'alta',
          descripcion: formData.value.descripcion_actividad || 'Solicitud de fondos para actividad',
          url_revision: `${window.location.origin}/monitoreo/formulario033/${formData.value.id_actividad}?solicitud_id=${data.id}${formData.value.id_tarea ? `&tarea_id=${formData.value.id_tarea}` : ''}`,
        },
      }

      console.log('emailPayload enviado:', JSON.stringify(emailPayload, null, 2))

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
      // No detenemos el flujo si falla el envío del correo
    }

    ///////////////////////////////////////////////////////////////////////////////

    console.log('Respuesta del servidor:', JSON.stringify(data, null, 2))

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

function resetForm() {
  Object.assign(formData.value, {
    descripcion_actividad: '',
    objetivo_actividad: '',
    detalle_destino_fondos: [
      { fecha: '', partida: '', fuente: '', factura_recibo: '', descripcion_gasto: '', monto: 0 },
    ],
    forma_pago: '',
    lugar_solicitud: '',
    fecha_solicitud: getCurrentDate(),
    monto_solicitado: 0,
    validacion_responsable: false,
    idcontador: null,
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
    ['Forma de Pago:', formaPagoElegido.value, '', ''],
    ['Lugar de Solicitud:', formData.value.lugar_solicitud, '', ''],
    ['Fecha de Solicitud:', getCurrentDate1(), '', ''],
    [''],

    ['DATOS PARA TRANSFERENCIA BANCARIA', '', '', ''],
    [
      'Pago a nombre de:',
      formData.value.datos_forma_pago.transferencia.nombre_transferencia,
      '',
      '',
    ],
    ['C.I.:', formData.value.datos_forma_pago.transferencia.ci_transferencia, '', ''],
    ['Banco:', formData.value.datos_forma_pago.transferencia.entidad_bancaria, '', ''],
    ['Nro. Cuenta:', formData.value.datos_forma_pago.transferencia.numero_cuenta, '', ''],
    ['Tipo Cuenta:', formData.value.datos_forma_pago.transferencia.tipo_cuenta, '', ''],
    [''],

    ['DATOS PARA OTROS PAGOS', '', '', ''],
    ['Pago a nombre de:', formData.value.datos_forma_pago.otros.nombre_otros, '', ''],
    ['C.I.:', formData.value.datos_forma_pago.otros.ci_otros, '', ''],
    [''],

    ['FIRMAS Y VALIDACIONES', '', '', ''],
    [
      'Contador:',
      nombreContadorElegido.value,
      'Aprobado:',
      formData.value.validacion_contador ? '✓' : '✗',
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
  const expensesHeaders = [
    'FECHA',
    'PARTIDA',
    'FACTURA/RECIBO',
    'DESCRIPCIÓN DEL GASTO',
    'MONTO (BS.)',
    'OBSERVACIONES',
  ]

  // 3. Datos de gastos
  const expensesData = formData.value.detalle_destino_fondos.map((gasto) => [
    gasto.fecha,
    gasto.partida,
    gasto.fuente,
    gasto.factura_recibo,
    gasto.descripcion_gasto,
    gasto.monto,
    '',
  ])

  // 4. Total al final de la tabla
  const totalRow = ['TOTAL', '', '', '', totalMontoSolicitado.value, '']

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
  worksheet['!cols'] = [
    { wch: 30 },
    { wch: 40 },
    { wch: 20 },
    { wch: 25 },
    { wch: 25 },
    { wch: 25 },
  ]

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

      // Formato de moneda para columna de montos (columna E - índice 4)
      else if (
        cellRef.c === 4 &&
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

  // Agregar bordes a la tabla de gastos (6 columnas)
  const tableStartRow = 22 + mainDataRows
  const tableEndRow = 23 + mainDataRows + expensesRows

  for (let r = tableStartRow; r <= tableEndRow; r++) {
    for (let c = 0; c < 6; c++) {
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

  //console.log('datosFormulario actualizado con los valores de la solicitud:', datosFormulario.value)

  actualizarDetalleDestinoFondos(solicitud.detalleDestinoFondos)

  // Actualizar los campos de Información Adicional
  actualizarInformacionAdicional()
  actualizarValidadores()
}

// Función para parsear y actualizar el detalle de destino de fondos
function actualizarDetalleDestinoFondos(detalleDestinoFondos) {
  try {
    if (!detalleDestinoFondos) {
      formData.value.detalle_destino_fondos = []
      return
    }

    // Parsear el JSON string
    // const detalleParseado = JSON.parse(detalleDestinoFondos)
    const detalleParseado = detalleDestinoFondos

    // Mapear al formato que espera la tabla
    formData.value.detalle_destino_fondos = detalleParseado.items.map((item, index) => ({
      fecha: item.fecha,
      partida: `${index + 1}.${index + 1}.${index + 1}`, // Generar partida automáticamente o usar una lógica específica
      fuente: item.fuente,
      factura_recibo: item.factura_recibo,
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
function actualizarInformacionAdicional() {
  // Actualizar forma_pago
  formData.value.forma_pago = formDatSF.value.formaPago_idsf

  // Actualizar lugar_solicitud
  formData.value.lugar_solicitud = formDatSF.value.lugarSolicitudsf

  // Actualizar fecha_solicitud
  formData.value.fecha_solicitud = formDatSF.value.fechaSolicitudsf

  // console.log('Información adicional actualizada:', {
  //   forma_pago: formData.value.forma_pago,
  //   lugar_solicitud: formData.value.lugar_solicitud,
  //   fecha_solicitud: formData.value.fecha_solicitud,
  // })
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
    (validador) => validador.cargo && validador.cargo.toLowerCase().includes('dir-administrativo'), //'coordinador'),
  )

  //console.log('Responsables list:', responsablesList.value)
  //console.log('Coordinadores list:', coordinadoresList.value)
}

// Verificación mejorada con roles
const puedeValidarResponsable = computed(() => {
  const usuarioActualId = datosFormulario.value?.usuario?.id
  const usuarioActualCargo = datosFormulario.value?.usuario?.cargo?.toLowerCase()
  const responsableAsignadoId = formData.value.idresponsable

  // El usuario puede validar si es el responsable asignado Y tiene el cargo correspondiente
  return usuarioActualId === responsableAsignadoId && usuarioActualCargo?.includes('responsable')
})

const puedeValidarCoordinador = computed(() => {
  const usuarioActualId = datosFormulario.value?.usuario?.id
  const usuarioActualCargo = datosFormulario.value?.usuario?.cargo?.toLowerCase()
  const coordinadorAsignadoId = formData.value.idcoordinador

  // El usuario puede validar si es el coordinador asignado Y tiene el cargo correspondiente
  return usuarioActualId === coordinadorAsignadoId && usuarioActualCargo?.includes('coordinador')
})

// Ciclo de vida
onMounted(async () => {
  await cargarDatos()
  await cargarSolicitudFondos()
  await textoProcedencia.value
  resetForm()
})

/******************************* EVENTOS DE LA BARRA ****************************************/
//Funcion para validacion
// Función de validación reutilizable
const validarFormulario = () => {
  if (!formData.value.descripcion_actividad) {
    return 'Complete la descripción de la actividad.'
  }
  if (!formData.value.objetivo_actividad) {
    return 'Complete el objetivo de la actividad.'
  }
  if (!formData.value.fecha_ejecucion) {
    return 'Seleccione la fecha de ejecución.'
  }
  if (totalMontoSolicitado.value <= 0) {
    return 'El monto total debe ser mayor a cero.'
  }
  if (!estaCompletaInformacionAdicional.value) {
    return 'Complete la información adicional.'
  }
  if (excedePresupuesto.value) {
    return `El monto total (Bs. ${totalMontoSolicitado.value.toLocaleString()}) excede el presupuesto disponible (Bs. ${limitePresupuesto.value.toLocaleString()}) por Bs. ${montoExcedido.value.toLocaleString()}`
  }
  if (!desgloseCompleto.value) {
    const filas = itemsIncompletos.value.join(', ')
    return `Complete todos los campos obligatorios. Filas incompletas: ${filas}`
  }
  if (!estaCompletaInformacionAdicional.value) {
    return 'Complete la información adicional.'
  }
  return null // null = sin errores
}

//Guardar los formularios sin validadores
const guardarFormulario = async () => {
  const error = validarFormulario()
  if (error) {
    warningMsg('Por Favor: ' + error)
    return
  }
  dialogoGuardarRef.value?.abrir() //Abre el cuadro de Dialogo <DialogoGuardarFormulario>
}
//Enviar los formularios con validadores
const enviarFormulario = async () => {
  // Validar antes de abrir el diálogo
  const error = validarFormulario()
  if (error) {
    warningMsg('Por Favor: ' + error)
    return
  }
  dialogoRevisionRef.value?.abrir()
}

//Salir del nuevo formulario
const cancelarSalir = async () => {
  const confirmado = await openConfirmDialog({
    title: 'Confirmar salida',
    message:
      'Los cambios no guardados se perderán permanentemente. ¿Estás seguro de que deseas cancelar y salir del formulario?',
    confirmLabel: 'Salir',
    cancelLabel: 'Permanecer',
    type: 'delete', // Esto pone el ícono y color rojo
  })

  if (confirmado) {
    router.push('/pei/listaactividades?showButton=1')
  }
}
/*******************************Funciones para el cuadro de dialogo: Guardar Formulario ********************************************************/
const dialogoGuardarRef = ref(null) //Referencia al dialogo guardar formulario

//Datos para el dialogo de confirmacion
const datosResumen = computed(() => ({
  solicitante: nombreCompletoSolicitante.value,
  fechaSolicitud: formData.value.fecha_solicitud,
  lugar: lugar.value || '—',
  formaPago: formaPagoElegido.value || '—',
  archivos: formData.value.medios_archivos?.length || 0,
  montoTotal: totalMontoSolicitado.value,
  detalleFormaPago: datosDeLaFormaPago.value || {},
  detalleGastos: formData.value.detalle_destino_fondos.map((g) => ({
    partida: g.partida,
    fuente: g.fuente,
    descripcion: g.descripcion_gasto,
    monto: g.monto,
  })),
}))

//Funcion para Enviar la informacion al rest api
const confirmarGuardarDatosForm = async () => {
  try {
    dialogoGuardarRef.value?.setGuardando(true)

    const payload = {
      detalleDestinoFondos: {
        items: formData.value.detalle_destino_fondos.map((gasto) => ({
          partida: gasto.partida,
          concepto: gasto.descripcion_gasto,
          monto: Number(gasto.monto),
        })),
      },
      formaPago: idFormaPago.value,
      lugarSolicitud: lugar.value,
      fechaSolicitud: formData.value.fecha_solicitud,
      montoSolicitado: totalMontoSolicitado.value,
      descripcion_actividad: formData.value.descripcion_actividad,
      objetivo_actividad: formData.value.objetivo_actividad,
      fechaRealizacionActividad: formData.value.fecha_ejecucion,
      validacionResponsable: false,
      responsable: usuario.value.id,
      validacionCoordinador: false,
      coordinador: usuario.value.id,
      usuario: formData.value.id_usuario,
      actividad: formData.value.id_actividad,
      tarea: formData.value.id_tarea || null,
      datos_forma_pago: datosDeLaFormaPago.value,
    }

    console.log('PAYLOAD:', payload)

    const response = await fetch(baseurl + 'api/solicitud-reembolso-v2/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.mensaje || errorData.error || JSON.stringify(errorData))
    }

    const data = await response.json()
    numeroFormularioSF.value = data.numero_formulario

    exportToExcel()
    resetForm()

    dialogoGuardarRef.value?.cerrar()
    successMsg('Formulario guardado exitosamente.')
    router.push('/pei/listaactividades?showButton=1')
  } catch (error) {
    console.error('Error al guardar:', error)
    errorMsg(`Error al guardar: ${error.message}`)
    dialogoGuardarRef.value?.setGuardando(false)
  }
}
//Cierra el dialogo para guardar
const cerrarDialogoGuardarForm = async () => {
  //Cerrar el diagolo
  dialogoGuardarRef.value.cerrar()
}

/************************** GUardar Sol de fondos con Validadores *****************************************************/
const dialogoRevisionRef = ref(null)
//FUncion para enviar al rest api, guardar form mas validadores - endpoint pendiente
const confirmarEnvioRevision = async (datosValidadores) => {
  // alert('Enviar al rest api')
  // console.log('VALIDADORES: ', datosValidadores)
  try {
    dialogoGuardarRef.value?.setGuardando(true)

    const payload = {
      detalleDestinoFondos: {
        items: formData.value.detalle_destino_fondos.map((gasto) => ({
          partida: gasto.partida,
          concepto: gasto.descripcion_gasto,
          monto: Number(gasto.monto),
        })),
      },
      formaPago: idFormaPago.value,
      lugarSolicitud: lugar.value,
      fechaSolicitud: formData.value.fecha_solicitud,
      montoSolicitado: totalMontoSolicitado.value,
      descripcion_actividad: formData.value.descripcion_actividad,
      objetivo_actividad: formData.value.objetivo_actividad,
      fechaRealizacionActividad: formData.value.fecha_ejecucion,
      validacionResponsable: false,
      responsable: usuario.value.id,
      validacionCoordinador: false,
      coordinador: usuario.value.id,
      usuario: formData.value.id_usuario,
      actividad: formData.value.id_actividad,
      tarea: formData.value.id_tarea || null,
      datos_forma_pago: datosDeLaFormaPago.value,
    }

    console.log('PAYLOAD:', payload)

    const response = await fetch(baseurl + 'api/solicitud-reembolso-v2/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.mensaje || errorData.error || JSON.stringify(errorData))
    }

    //Enviar notificacion email
    const data = await response.json()
    const solicitud_id = data.id
    const revisores = datosValidadores.validadoresIds

    await asignarValidadores(solicitud_id, revisores)

    exportToExcel()
    resetForm()

    dialogoGuardarRef.value?.cerrar()
    successMsg('Formulario guardado exitosamente.')
    router.push('/pei/listaactividades?showButton=1')
  } catch (error) {
    console.error('Error al guardar:', error)
    errorMsg(`Error al guardar: ${error.message}`)
    dialogoGuardarRef.value?.setGuardando(false)
  }
}
const cerrarDialogoRevision = async () => {
  dialogoRevisionRef.value?.cerrar()
}
</script>

<style scoped>
.solicitud-viaje-container {
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
  .solicitud-viaje-container {
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
.table-responsive {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  margin-bottom: 16px;
}

.table-responsive :deep(table) {
  min-width: 900px;
}

.table-responsive :deep(th) {
  background-color: #1976d2 !important;
  color: white !important;
  font-weight: 600;
  font-size: 12px;
  padding: 10px 6px;
  white-space: nowrap;
}

.table-responsive :deep(td) {
  padding: 4px;
  vertical-align: middle;
}

/* Scrollbar estilizada */
.table-responsive::-webkit-scrollbar {
  height: 6px;
}

.table-responsive::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.table-responsive::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.table-responsive::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Fila incompleta */
.bg-red-lighten-5 {
  background-color: rgba(244, 67, 54, 0.05) !important;
}
</style>
