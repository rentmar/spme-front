<template>
    <v-container class="v-container v-locale--is-ltr">
      <v-card id="formulario-pdf" class="pa-6">

        <PaginaTituloIcono
          :titulo="'Validar Solicitud de Viaje PEI'"
          :icon="'mdi-file-document-multiple'"
        ></PaginaTituloIcono>
        <br />
        <!-- <ProyectoIdHeader
          v-if="datosFormulario"
          :proyecto-id="datosFormulario.actividad?.proyecto"
        ></ProyectoIdHeader>

         <br /> -->
        <ActividadInformacion v-if="idActividad" :actividad-id="3"></ActividadInformacion>
        <br />

        <v-card-text>
          <v-form @submit.prevent="submitForm">
            <div class="form-section">
              <v-text-field
                v-model="solicitudDeViaje.evento"
                label="Nombre del Seminario, curso, taller o reunión"
                bg-color="blue-lighten-5"
                required
                :readonly="soloLectura"
              ></v-text-field>

              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="solicitudDeViaje.fechaEvento"
                    label="Fecha de Evento"
                    bg-color="blue-lighten-5"
                    type="date"
                    required
                    :readonly="soloLectura"
                    :max="formData.fecha_fin"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6"> </v-col>
              </v-row>

              <v-text-field
                v-model="solicitudDeViaje.lugarEvento"
                label="Lugar de realización"
                bg-color="blue-lighten-5"
                required
                :readonly="soloLectura"
              ></v-text-field>

              <v-text-field
                v-model="solicitudDeViaje.institucionesParticipantes"
                label="Organizaciones Participantes"
                bg-color="blue-lighten-5"
                required
                :readonly="soloLectura"
              ></v-text-field>

              <v-text-field
                v-model="solicitudDeViaje.organizador"
                label="Institución que invita"
                bg-color="blue-lighten-5"
                required
                :readonly="soloLectura"
              ></v-text-field>

              <v-text-field
                v-model="solicitudDeViaje.quienCubreGastos"
                label="Quien cubre los gastos de estadía, transporte y viáticos"
                bg-color="blue-lighten-5"
                required
                :readonly="soloLectura"
              ></v-text-field>

              <v-text-field
                v-model="solicitudDeViaje.fondosUnitas"
                label="Fondos UNITAS"
                bg-color="blue-lighten-5"
                required
                :readonly="soloLectura"
              ></v-text-field>

              <v-text-field
                v-model="solicitante"
                label="Persona que presenta la solicitud"
                readonly
              ></v-text-field>

              <v-textarea
                v-model="solicitudDeViaje.justificacionAsistencia"
                label="Justificación de la importancia de asistir al evento y su relación con el trabajo que desarrolla"
                bg-color="blue-lighten-5"
                rows="3"
                required
                :readonly="soloLectura"
              ></v-textarea>

              <v-textarea
                v-model="solicitudDeViaje.tareasPrevias"
                label="Tareas previas que debe cumplir para asistir al evento"
                bg-color="blue-lighten-5"
                rows="3"
                required
                :readonly="soloLectura"
              ></v-textarea>
            </div>

            <v-divider class="my-4"></v-divider>

            <div class="form-section">
              <h3 class="mb-4">Detalle del Destino de Fondos</h3>
              <div class="d-flex justify-space-between align-center mb-4">
                <v-btn
                  variant="flat"
                  class="text-grey-darken-3 bg-white"
                  rounded="lg"
                  :elevation="3"
                  @click="addGasto"
                  :disabled="soloLectura"
                >
                  Agregar Gasto
                </v-btn>
                <v-chip class="text-subtitle-1" color="grey-darken-2" variant="outlined">
                  Monto Total Solicitado (Bs.): {{ totalMontoSolicitado }}
                </v-chip>
              </div>
              <v-table>
                <thead>
                  <tr>
                    <th>Partida</th>
                    <th>Descripción del Gasto</th>
                    <th>Monto (Bs.)</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(gasto, index) in formData.detalle_destino_fondos" :key="index">
                    <td>
                      <v-text-field
                        v-model="gasto.partida"
                        bg-color="blue-lighten-5"
                        hide-details
                        density="compact"
                        :readonly="soloLectura"
                      ></v-text-field>
                    </td>
                    <td>
                      <v-text-field
                        v-model="gasto.descripcion_gasto"
                        bg-color="blue-lighten-5"
                        hide-details
                        density="compact"
                        :readonly="soloLectura"
                      ></v-text-field>
                    </td>
                    <td>
                      <v-text-field
                        v-model="gasto.monto"
                        bg-color="blue-lighten-5"
                        type="number"
                        hide-details
                        density="compact"
                        min="0"
                        :readonly="soloLectura"
                      ></v-text-field>
                    </td>
                    <td>
                      <v-btn
                        variant="text"
                        icon
                        color="error"
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
                  <div class="form-section mb-6">
                    <!-- <h3 class="text-h6 mb-4 primary--text">
                      <v-icon color="primary" class="mr-2">mdi-information</v-icon>
                      Información Adicional
                    </h3> -->

                    <v-row>
                      <v-col cols="12" md="6">

                        <v-text-field
                          v-model="solicitudDeViaje.lugarSolicitud"
                          label="Lugar de la Solicitud"
                          variant="outlined"
                          bg-color="blue-lighten-5"
                          required
                          :readonly="soloLectura"
                        ></v-text-field>
                        <!-- <v-select
                          v-model="formData.forma_pago"
                          :items="formasPagoOptions"
                          item-title="formaPago"
                          item-value="id"
                          label="Forma de Pago"
                          variant="outlined"
                          bg-color="blue-lighten-5"
                          required
                        ></v-select> -->
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
                          :items="formasPago"
                          item-title="formaPago"
                          item-value="id"
                          label="Forma de Pago"
                          variant="outlined"
                          bg-color="blue-lighten-5"
                          required
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

            <div class="form-section">
              <div class="text-subtitle-1 font-weight-bold mb-2">Firmas</div>
              <v-row>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="formData.id_responsable"
                    bg-color="blue-lighten-5"
                    :items="responsablesList"
                    :item-title="getNombreCompleto"
                    item-value="id"
                    label="Contador"
                    required
                    :readonly="soloLectura"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="6" class="d-flex align-center">
                        <v-checkbox
                          v-model="solicitudDeViaje.validacionResponsable"
                          :label="`Aprobado por Contador ${puedeValidarResponsable ? '(Usted)' : ''}`"
                          :disabled="!puedeValidarResponsable || solicitudDeViaje.validacionResponsable"
                          :readonly="!puedeValidarResponsable || solicitudDeViaje.validacionResponsable"
                          :color="puedeValidarResponsable ? 'primary' : 'grey'"
                          @update:modelValue="
                            (newValue) => {
                              if (newValue) {
                                nextTick(() => {
                                  validarViaje('responsable')
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
                    v-model="formData.id_coordinador"
                    bg-color="blue-lighten-5"
                    :items="coordinadoresList"
                    :item-title="getNombreCompleto"
                    item-value="id"
                    label="Coordinador"
                    required
                    :readonly="soloLectura"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="6" class="d-flex align-center">
                  <v-checkbox
                    v-model="solicitudDeViaje.validacionCoordinador"
                    :label="`Aprobado por Coordinador ${puedeValidarCoordinador ? '(Usted)' : ''}`"
                    :disabled="!puedeValidarCoordinador || solicitudDeViaje.validacionCoordinador"
                    :readonly="!puedeValidarCoordinador || solicitudDeViaje.validacionCoordinador"
                    :color="puedeValidarCoordinador ? 'primary' : 'grey'"
                    @update:modelValue="
                      (newValue) => {
                        if (newValue) {
                          nextTick(() => {
                            validarViaje('coordinador')
                          })
                        }
                      }
                      "
                  ></v-checkbox>
                </v-col>
              </v-row>
            </div>

            <div class="d-flex justify-end mt-4">
              <v-btn
                color="error"
                variant="outlined"
                prepend-icon="mdi-cancel"
                :to="`/pei/listaactividadespei?showButton=1`"
              >
                Cancelar
              </v-btn>
              <v-btn
                color="error"
                class="mr-2"
                prepend-icon="mdi-backspace-outline"
                @click="resetForm"
                disabled
              >
                Limpiar
              </v-btn>
              <v-btn
                color="primary"

                prepend-icon="mdi-file-document-arrow-right"
                type="submit"
                :loading="loading"
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
    </v-container>

     <!-- <pre>{{ formData.detalle_destino_fondos }}</pre> -->
      <!-- {{ '*********************B' }}
    <pre>{{ solicitudDeViaje }}</pre> -->
    <!-- {{ '*********************B' }}
    <pre>{{ formData.otros }}</pre> -->
        <!-- {{ '*********************B' }}
    <pre>{{ formData.datos_forma_pago }}</pre> -->
  </template>

  <script setup>
  import * as XLSX from 'xlsx'
  import { ref, onMounted, computed, nextTick, watch } from 'vue'
  import axios from 'axios'
  import { useUserStore } from '@/stores/user'
  import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'
  import ProyectoIdHeader from '@/modules/proyecto/components/partials/ProyectoIdHeader.vue'
  import ActividadInformacion from '@/modules/proyecto/components/partials/ActividadInformacion.vue'

  import { useRoute } from 'vue-router'

  const route = useRoute()
  const idActividad = route.params.id || null
  const idTarea = route.query.tarea_id || null
  const idSolicitud = route.query.solicitud_id || null
  console.log('ID Solicitud:', idSolicitud)
  console.log('ID Actividad:', idActividad)
  console.log('ID Tarea:', idTarea)
  //console.log('ID aaaaaaa', JSON.stringify(route,null,2))

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

  const loading = ref(false)
  const responsablesList = ref([])
  const coordinadoresList = ref([])
  //const soloLectura = ref(false)
  const datosSolicitante = ref([])
  const solicitante = ref(null)
  const solicitudDeViaje = ref({}) //viene de la funccion cargarSolicitudesDeViaje
  const numeroFormulario = ref('')

  const cargandoGeneral = ref(true)

  //variables para carga de datos
  const datosFormulario = ref(null)
  const datosFormulario1 = ref(null) //viene de funcion cargarSolicitudesDeViaje y actualiza detalle_destino_fondos
  const todosLosUsuarios = ref(null)
  const error = ref(null)
  const isLoading = ref(false)
  const formasPago = ref([])
  const formaPago = ref()

  const formData = ref({
    evento: '',
    fecha_evento: '',
    lugar_evento: '',
    instituciones_participantes: '',
    institucion_queinvita: '', //organizador
    quien_cubregastos: '',
    fondos_unitas: '',
    justificacion_asistencia: '',
    tareas_previas: '',
    id_tarea: null,
    id_actividad: 0,
    id_usuario: 0,
    detalle_destino_fondos: [{ partida: '', descripcion_gasto: '', monto: 0 }],
    forma_pago: null,
    formaPago: null,
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
    id_responsable: null,
    validacion_coordinador: false,
    id_coordinador: null,
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

  const nombreCoordinadorElegido = computed(() => {
    const coordinador = coordinadoresList.value.find(
      (user) => user.id === formData.value.id_coordinador,
    )
    return coordinador ? getNombreCompleto(coordinador) : ''
  })

  const nombreResponsableElegido = computed(() => {
    const responsable = responsablesList.value.find(
      (user) => user.id === formData.value.id_responsable,
    )
    return responsable ? getNombreCompleto(responsable) : ''
  })

  const totalMontoSolicitado = computed(() => {
    return formData.value.detalle_destino_fondos.reduce(
      (total, gasto) => total + Number(gasto.monto || 0),
      0,
    )
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
        // formData.value.id_usuario = getSafeValue(usuario.id, 0)

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
          // actividadData.value = {
          //   ...actividadData.value,
          //   descripcion: getSafeValue(newVal.actividad.descripcion, actividadData.value.descripcion),
          //   fecha_programada: getSafeValue(newVal.actividad.fecha_inicio, actividadData.value.fecha_programada),
          //   fecha_cierre: getSafeValue(newVal.actividad.fecha_cierre, actividadData.value.fecha_cierre),
          // }
        }

        // Llenar lista de validadores si existen
        if (newVal.validadores && Array.isArray(newVal.validadores)) {
          //console.log('Cargando validadores:', newVal.validadores)
          responsablesList.value =
            newVal.validadores.filter((user) => user && user.cargo === 'contable') || []
          coordinadoresList.value =
            newVal.validadores.filter((user) => user && user.cargo === 'coordinador') || []
        } else {
          responsablesList.value = []
          coordinadoresList.value = []
        }
      }
    },
    { deep: true },
  )

  const formasPagoOptions = computed(() => {
    if (datosFormulario.value && datosFormulario.value.formaPago) {
      return datosFormulario.value.formaPago
    }
    return []
  })

  // Computed property to determine which payment method was selected
  const formaPagoElegido = computed(() => {
    console.log('forma de pato', formData.value.forma_pago)
    // if (formData.value.forma_pago && formasPagoOptions.value.length > 0) {
    //   const formaPago = formasPagoOptions.value.find((fp) => fp.id === formData.value.forma_pago)
    //   return formaPago ? formaPago.formaPago : ''
    // }
    const formaPago = formasPago.value.find((fp) => fp.id === formData.value.forma_pago)
    return formaPago ? formaPago.formaPago : ''
    //return ''
  })

  // Show "Otros" fields when payment method is NOT "Transferencia Bancaria"
  const MostrarCamposOtros = computed(() => {
    return formaPagoElegido.value !== 'Transferencia Bancaria'
  })

  // Show "Transferencia" fields when payment method IS "Transferencia Bancaria"
  const MostrarCamposTransferencia = computed(() => {
    return formaPagoElegido.value === 'Transferencia Bancaria'
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
    //se carga unicamente para la etiqueta proyectos
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
      console.log('Respuesta de la solicitudqqq:', idActividad, usuario.value.nombre)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          `Error en la solicitud: ${response.status} - ${errorData.detail || 'Error desconocido'}`,
        )
      }
      const data = await response.json()
      datosFormulario.value = data
      console.log('00000000000000000000000000000', JSON.stringify(datosFormulario.value,null,2) )
    } catch (err) {
      error.value = err.message
      console.error('Ha ocurrido un error:', err)
    } finally {
      isLoading.value = false
      cargandoGeneral.value = false
    }
  }

  async function cargarFormasDePago() {
    try {
      const response = await fetch(baseurl + '/monitoreo_api/obtenerFormasPago/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })

      if (!response.ok) throw new Error('Error al cargar formas de pago')

      const data = await response.json()
      formasPago.value = data.formasPago // Asignar directamente el array
      formaPago.value = formasPago.value.find(
        (user) => user.id === solicitudDeViaje.value.formaPago_id,
      )
      //console.log('Formas de pago cargadas:', formasPago.value)
    } catch (err) {
      console.error('Error:', err)
    }
  }

  // watch(
  //   datosFormulario,
  //   (newVal) => {
  //     if (newVal && newVal.usuario) {
  //       datosSolicitante.value = newVal.usuario
  //       //console.log('hhhhhhhhhhhh:', JSON.stringify(datosSolicitante.value, null, 2))
  //       if(datosSolicitante.value){
  //       solicitante.value = getNombreCompleto(datosSolicitante.value)
  //       }
  //     } else {
  //       datosSolicitante.value = [];
  //     }
  //   },
  //   { deep: true } // Si necesitas observar cambios profundos
  // );

//carga usuario que realizo la solicitud
watch(
  datosFormulario1,
  (newVal) => {
    try {
      const idSolicitante = newVal.usuario_id
      console.log('ID Solicitante:', idSolicitante)
      //console.log('Datos Formulario:', datosFormulario.value)

      datosSolicitante.value = todosLosUsuarios.value?.find((fp) => fp.id === idSolicitante)
      console.log('Datos Solicitante:', JSON.stringify(datosSolicitante.value, null, 2))

      if (datosSolicitante.value) {
       solicitante.value = getNombreCompleto(datosSolicitante.value)
      }
    } catch (error) {
      console.error('Error en watcher datosFormulario1:', error)
      // Opcional: mostrar notificación al usuario
    }
  },
  { deep: true }
)

// borra los campos no seleccionados en "forma de pago"
// ejemplo, si seleccionas "otros", se borran los campos "transferencia_bancaria"
watch(
  () => formData.value.forma_pago,
  (newVal, oldVal) => {
    if (newVal === oldVal) return; // No hacer nada si no cambió

    // Obtener el nombre de la forma de pago seleccionada
    const formaPagoSeleccionada = formasPago.value.find(fp => fp.id === newVal);
    const nombreFormaPago = formaPagoSeleccionada ? formaPagoSeleccionada.formaPago : '';

    // Resetear campos según la opción seleccionada
    if (nombreFormaPago === 'Transferencia Bancaria') {
      // Si seleccionó Transferencia, resetear campos de Otros
      formData.value.datos_forma_pago.otros = {
        nombre_otros: '',
        ci_otros: ''
      };
    } else {
      // Si seleccionó cualquier otra opción, resetear campos de Transferencia
      formData.value.datos_forma_pago.transferencia = {
        nombre_transferencia: '',
        ci_transferencia: '',
        entidad_bancaria: '',
        tipo_cuenta: '',
        numero_cuenta: ''
      };
    }
  }
);

  async function cargarUsuarios() {
    try {
      const response = await axios.get(baseurl + '/autenticacion_api/listaUsuarios/')
      const allUsers = response.data.usuarios
      todosLosUsuarios.value = response.data.usuarios
      //const data = await response.json()
      console.log('todosLosUsuarios:', JSON.stringify(response, null, 2))
      responsablesList.value = allUsers.filter((user) => user.cargo === 'contable')
      coordinadoresList.value = allUsers.filter((user) => user.cargo === 'coordinador')
      // datosSolicitante.value = allUsers.find((user) => user.id === usuario.value.id)
      // if(datosSolicitante.value){
      //   solicitante.value = getNombreCompleto(datosSolicitante.value)
      // }
      // console.log('usuariosssss:', JSON.stringify(solicitante.value, null, 2))
    } catch (error) {
      console.error('Error al cargar la lista de usuarios:', error)
      alert('No se pudieron cargar los usuarios para las firmas. Por favor recargue la página.')
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

  async function cargarSolicitudesDeViaje() {
    isLoading.value = true
    error.value = null
    try {
      const response = await fetch(baseurl + 'api/monitoreo/obtener-solicitudes-viaje-pei/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: idSolicitud
        }),
      })
      //console.log('00000000000000000000000000000', JSON.stringify(response,null,2) )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          `Error en la solicitud: ${response.status} - ${errorData.detail || 'Error desconocido'}`,
        )
      }

      const rawData = await response.json()
      //console.log('SoicitudDeViaje Recibido@@@@@@@@@@@@@@:', JSON.stringify(rawData,null,2))

      solicitudDeViaje.value = rawData.solicitudes[0]

      formData.value.evento = solicitudDeViaje.value.evento || ''
      formData.value.fecha_evento = solicitudDeViaje.value.fechaEvento || ''
      formData.value.lugar_evento = solicitudDeViaje.value.lugarEvento || ''
      formData.value.instituciones_participantes = solicitudDeViaje.value.institucionesParticipantes || ''
      formData.value.institucion_queinvita = solicitudDeViaje.value.organizador || ''
      formData.value.quien_cubregastos = solicitudDeViaje.value.quienCubreGastos || ''
      formData.value.fondos_unitas = solicitudDeViaje.value.fondosUnitas || ''
      formData.value.justificacion_asistencia = solicitudDeViaje.value.justificacionAsistencia || ''
      formData.value.tareas_previas = solicitudDeViaje.value.tareasPrevias || ''

      formData.value.detalle_destino_fondos = solicitudDeViaje.value.detalleGasto.items.map(
        (item) => ({
        partida: item.partida || '',
        descripcion_gasto: item.concepto || '',
        monto: item.monto || 0,
        }),
      )
      formData.value.forma_pago = solicitudDeViaje.value.formaPago_id
      formData.value.id_responsable = solicitudDeViaje.value.responsable_id
      formData.value.id_coordinador = solicitudDeViaje.value.coordinador_id

      //console.log('Datos cargados exitosamente:', JSON.stringify(formData.value.detalle_destino_fondos,null,2))

      // Filtrar las solicitudes por actividad_id y tarea_id
      const solicitudesFiltradas = rawData.solicitudes.filter((solicitud) => {
        // Convertir a string para comparación segura, o comparar convirtiendo ambos al mismo tipo
        const coincideActividad = solicitud.actividad_id?.toString() === idActividad?.toString()
        const coincideTarea = solicitud.tarea_id?.toString() === idTarea?.toString()
        const coincideSolicitud = solicitud.id?.toString() === idSolicitud?.toString()
        //console.log('Coincidencias:', { coincideActividad, coincideTarea, coincideSolicitud })
        return coincideActividad && coincideTarea && coincideSolicitud
      })

      console.log('Solicitudes filtradas:', JSON.stringify(solicitudesFiltradas,null,2))
      datosFormulario1.value = strictSanitizeData(solicitudesFiltradas[0])
      actualizarDatosFormulario(solicitudesFiltradas[0])
      //const idSolicitante = datosFormulario1.value.usuario_id
      //console.log('ID Solicitante444:', idSolicitante)

    } catch (err) {
      error.value = err.message
      console.error('Ha ocurrido un error:', err)
    } finally {
      isLoading.value = false
      cargandoGeneral.value = false
    }
  }

  function addGasto() {
    formData.value.detalle_destino_fondos.push({ partida: '', descripcion_gasto: '', monto: 0 })
  }

  function removeGasto(index) {
    if (formData.value.detalle_destino_fondos.length > 1) {
      formData.value.detalle_destino_fondos.splice(index, 1)
    }
  }

  async function submitForm() {
    loading.value = true
    try {
      const requiredFields = [
        'evento',
        'fecha_evento',
        'lugar_evento',
        'instituciones_participantes',
        'institucion_queinvita',
        'quien_cubregastos',
        'fondos_unitas',
        'justificacion_asistencia',
        'tareas_previas',
        'detalle_destino_fondos',
        'forma_pago',
        'lugar_solicitud',
        'fecha_solicitud',
        'id_responsable',
        'id_coordinador',
      ]

      for (const field of requiredFields) {
        if (!formData.value[field]) {
          throw new Error(`El campo '${field}' es requerido.`)
        }
      }

      if (
        formData.value.detalle_destino_fondos.some(
          (gasto) => !gasto.partida || !gasto.descripcion_gasto || gasto.monto <= 0,
        )
      ) {
        throw new Error('Todos los gastos deben tener partida, descripción y un monto mayor a cero.')
      }

      formData.value.formaPago = formData.value.forma_pago

      const payload = {
        ...formData.value, //esta linea incluye todas las propiedades de formData
        id_usuario: usuario.value.id || 0,
        id_actividad: idActividad || 0,
        id_tarea: idTarea || null,
        monto_solicitado: totalMontoSolicitado.value,
        detalle_destino_fondos: {
          items: formData.value.detalle_destino_fondos.map((gasto) => ({
            partida: gasto.partida,
            concepto: gasto.descripcion_gasto,
            monto: Number(gasto.monto),
          })),
        },
      }
      console.log('Payload completo que se enviará:', JSON.stringify(payload, null, 2))

      //const response = await axios.post(baseurl + '/monitoreo_api/crearSolicitudViaje/', payload, {
      const response = await fetch(baseurl + 'api/solicitud-viaje-pei/' + idSolicitud + '/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`)
      }

      numeroFormulario.value = response.numero_formulario

      alert('Solicitud enviada con éxito')
      exportToExcel()
      //resetForm()
    } catch (error) {
      console.error('Error completo:', error.response?.data || error.message)
      alert(`Error: ${error.response?.data?.message || error.message}`)
    } finally {
      loading.value = false
    }
  }

  function resetForm() {
    Object.assign(formData.value, {
      evento: '',
      fecha_evento: '',
      lugar_evento: '',
      instituciones_participantes: '',
      institucion_queinvita: '',
      quien_cubregastos: '',
      fondos_unitas: '',
      justificacion_asistencia: '',
      tareas_previas: '',
      detalle_destino_fondos: [{ partida: '', descripcion_gasto: '', monto: 0 }],
      forma_pago: '',
      lugar_solicitud: '',
      fecha_solicitud: getCurrentDate(),
      id_responsable: null,
      validacion_responsable: false,
      id_coordinador: null,
      validacion_coordinador: false,
    })
  }

  function exportToExcel() {
    // 1. Crear datos principales con formato de formulario
    const mainData = [
      ['FORMULARIO F-05: SOLICITUD DE FONDOS PARA VIAJE', '', '', ''],
      [''],
      ['FORMULARIO Nro:', numeroFormulario.value, '', ''],
      ['INFORMACIÓN DEL SOLICITANTE', '', '', ''],
      ['Nombre Completo:', solicitante.value, '', ''],
      ['Documento de Identidad:', datosSolicitante.value.ci, '', ''],
      ['Cargo:', datosSolicitante.value.cargo, '', ''],
      [''],
      ['INFORMACIÓN DEL SEMINARIO', '', '', ''],
      ['Seminario:', formData.value.evento, '', ''],
      ['Fecha Evento:', formData.value.fecha_evento, '', ''],
      ['Lugar de Evento:', formData.value.lugar_evento, '', ''],
      ['Instituciones Participantes:', formData.value.instituciones_participantes, '', ''],
      ['Institución que Invita:', formData.value.institucion_queinvita, '', ''],
      ['Quien Cubre los Gastos:', formData.value.quien_cubregastos, '', ''],
      ['Fondos UNITAS:', formData.value.fondos_unitas, '', ''],
      ['Justificación de Asistencia:', formData.value.justificacion_asistencia, '', ''],
      ['Tareas Previas:', formData.value.tareas_previas, '', ''],
      [''],
      ['INFORMACIÓN DE LA SOLICITUD', '', '', ''],
      ['Forma de Pago:', formData.value.forma_pago, '', ''],
      ['Lugar de Solicitud:', formData.value.lugar_solicitud, '', ''],
      ['Fecha de Solicitud:', getCurrentDate(), '', ''],
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
    XLSX.utils.book_append_sheet(wb, wsMain, 'Solicitud de Viaje')
    XLSX.writeFile(wb, `Solicitud_Viaje_F-05_${getCurrentDate()}.xlsx`)
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

    //actualizarDetalleDestinoFondos(formDatSF.value.detalleDestinoFondossf)

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

    // Actualizar formData con los IDs encontrados
    // if (responsable) {
    //   formData.value.idresponsable = responsable.id
    //   //console.log('Responsable encontrado:', getNombreCompleto(responsable))
    // } else {
    //   console.warn('No se encontró responsable con ID:', formDatSF.value.responsable_idsf)
    // }

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
      (validador) => validador.cargo && validador.cargo.toLowerCase().includes('contable'),
    )

    // Filtrar coordinadores (puedes ajustar la lógica según el cargo)
    coordinadoresList.value = datosFormulario.value.validadores.filter(
      (validador) => validador.cargo && validador.cargo.toLowerCase().includes('coordinador'),
    )
  }
  const puedeValidarResponsable = computed(() => {
    const idUsuarioLogueado = usuario.value?.id
    const idResponsableAsignado = solicitudDeViaje.value?.responsable_id
    return idUsuarioLogueado === idResponsableAsignado
  })

  const puedeValidarCoordinador = computed(() => {
    console.log('Usuario Logueado ID:', usuario.value?.id)
    console.log('Coordinador Asignado ID:', solicitudDeViaje.value?.coordinador_id)
    const idUsuarioLogueado = usuario.value?.id
    const idCoordinadorAsignado = solicitudDeViaje.value?.coordinador_id
    return idUsuarioLogueado === idCoordinadorAsignado
  })

  async function validarViaje(tipoValidador) {
    // Verificar permisos según el tipo de validador
    let tienePermiso = false
    let claveValidacion = ''

    switch (tipoValidador) {
      case 'responsable':
        tienePermiso = puedeValidarResponsable.value
        claveValidacion = 'validacionResponsable'
        break
      case 'coordinador':
        tienePermiso = puedeValidarCoordinador.value
        claveValidacion = 'validacionCoordinador'
        break
      default:
        alert('Tipo de validador no reconocido.')
        return
    }

    if (!tienePermiso) {
      alert('Usted no está autorizado para validar esta rendición como ' + tipoValidador + '.')
      solicitudDeViaje.value[claveValidacion] = false
      return
    }

     // Crear el payload específico para la validación
    const payload = {
      //validacionResponsable: solicitudDeViaje.value?.id || idSolicitud,
      [claveValidacion]: true, //validacion_responsable: true o validacion_coordinador: true
    }
    console.log('888888888888888888888', JSON.stringify(payload, null, 2))

    //if (!payload.id_solicitud_viaje) {
    //  alert('Error: No se encontró el ID de la reposicion para validar.')
    //  formData.value[claveValidacion] = false // Revertir
    //  return
    //}

    // Ejecutar la llamada PATCH
    loading.value = true
    try {
      const response = await fetch(
        //baseurl+'/monitoreo_api/actualizar-validacion-solicitud-viaje/',
        baseurl + 'api/solicitud-viaje-pei/' + idSolicitud + '/',
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

      //const result = await response.json();
      alert('Solicitud de Viaje validada exitosamente.')

      // Recargar los datos para reflejar los cambios
      await cargarSolicitudesDeViaje()
    } catch (err) {
      console.error('Error al validar la solicitud:', err)
      alert(`Error al validar la solicitud: ${err.message}`)

      // Revertir el cambio en caso de error
      formData.value[claveValidacion] = false
    } finally {
      loading.value = false
    }
  }

  onMounted(async () => {
    //await cargarDatos()   //carga validadores y se selecciona el solicitante
    await cargarUsuarios()//carga todos los usuarios y se selecciona el solicitante
    //await cargarDatos()
    await cargarFormasDePago()
    await cargarSolicitudesDeViaje()//carga datos de la solicitud donde esta id solicitante
  })
  </script>

  <style scoped>
  .v-card {
    max-width: 900px;
    margin: 0 auto;
  }
  </style>
