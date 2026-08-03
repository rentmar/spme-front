<!-- InformacionAdicionalEdicion.vue -->
<template>
  <div>
    <v-alert
      variant="tonal"
      color="info"
      icon="mdi-information-outline"
      density="compact"
      class="mb-4"
      border="start"
    >
      Información Adicional
    </v-alert>

    <v-alert
      v-if="errorValidacion"
      variant="tonal"
      color="error"
      icon="mdi-alert-circle"
      density="compact"
      class="mb-4"
      border="start"
      closable
      @click:close="errorValidacion = ''"
    >
      <div class="text-subtitle-2 font-weight-bold mb-1">Error en datosFormaPago</div>
      <div>Error de formato, corrija la información llenándola nuevamente</div>
      <div class="mt-2 text-caption">
        {{ JSON.stringify(localDatosFormaPago, null, 2) }}
      </div>
    </v-alert>

    <v-card variant="outlined" class="mb-4">
      <v-card-text class="pa-4">
        <!-- Lugar y Fecha -->
        <v-row>
          <v-col cols="12" md="8">
            <v-combobox
              v-model="localLugar"
              variant="outlined"
              bg-color="blue-lighten-5"
              density="compact"
              label="Lugar de la solicitud"
              :items="lugaresFiltrados"
              hide-details
              prepend-inner-icon="mdi-map-marker"
              no-filter
              :disabled="props.readonly"
              :menu-props="{ 'open-on-click': false }"
              @update:search="searchLugar = $event || ''"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="localFecha"
              label="Fecha de la Solicitud"
              type="date"
              variant="outlined"
              density="compact"
              bg-color="grey-lighten-4"
              hide-details
              :readonly="props.readonly"
              prepend-inner-icon="mdi-calendar"
            />
          </v-col>
        </v-row>

        <v-divider class="my-3" />

        <!-- Forma de Pago -->
        <div class="mt-4">
          <div class="d-flex align-center mb-2">
            <v-icon color="primary" class="mr-2">mdi-cash-multiple</v-icon>
            <span class="text-subtitle-1 font-weight-medium">Forma de Pago</span>
          </div>
          <v-select
            v-model="localFormaPago"
            :items="formaPagoSelect"
            item-title="formaPago"
            item-value="id"
            label="Seleccionar forma de pago"
            variant="outlined"
            density="compact"
            bg-color="blue-lighten-5"
            prepend-icon="mdi-cash-question"
            clearable
            :disabled="props.readonly"
            @update:model-value="handleFormaPagoChange"
          />
        </div>

        <!-- Efectivo -->
        <div v-if="mostrarFormaEfectivo" class="mt-4">
          <div class="d-flex align-center mb-2">
            <v-icon color="success" class="mr-2">mdi-cash</v-icon>
            <span class="text-subtitle-1 font-weight-medium">Pago en Efectivo</span>
          </div>
          <v-row>
            <v-col cols="12" md="6">
              <v-combobox
                v-model="ciSearchEfectivo"
                :items="filteredBeneficiariosEfectivo"
                item-title="ci"
                label="Documento de Identidad C.I."
                variant="outlined"
                bg-color="blue-lighten-5"
                density="compact"
                clearable
                hide-details
                prepend-inner-icon="mdi-card-account-details"
                no-filter
                :disabled="props.readonly"
                :menu-props="{ 'open-on-click': false }"
                @update:search="searchEfectivo = $event || ''"
                @update:model-value="handleCiSelectEfectivo"
                @keypress="soloNumeros"
              >
                <template v-slot:item="{ props, item }">
                  <v-list-item
                    v-bind="props"
                    :title="`${item.raw.ci} - ${item.raw.nombre}`"
                    :subtitle="item.raw.nombre"
                  />
                </template>
              </v-combobox>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="localDatosFormaPago.efectivo.nombre_efectivo"
                label="Nombre a quien se realiza el pago"
                variant="outlined"
                bg-color="blue-lighten-5"
                density="compact"
                hide-details
                prepend-inner-icon="mdi-account"
                :readonly="props.readonly"
              />
            </v-col>
          </v-row>
        </div>

        <!-- Transferencia Bancaria -->
        <div v-if="mostrarFormaTransferencia" class="mt-4">
          <div class="d-flex align-center mb-2">
            <v-icon color="primary" class="mr-2">mdi-bank-transfer</v-icon>
            <span class="text-subtitle-1 font-weight-medium">Transferencia Bancaria</span>
          </div>
          <v-row>
            <v-col cols="12" md="6">
              <v-combobox
                v-model="ciSearchTransferencia"
                :items="filteredBeneficiariosTransferencia"
                item-title="ci"
                label="Documento de Identidad C.I."
                variant="outlined"
                bg-color="blue-lighten-5"
                density="compact"
                clearable
                hide-details
                prepend-inner-icon="mdi-card-account-details"
                no-filter
                :disabled="props.readonly"
                :menu-props="{ 'open-on-click': false }"
                @update:search="searchTransferencia = $event || ''"
                @update:model-value="handleCiSelectTransferencia"
                @keypress="soloNumeros"
              >
                <template v-slot:item="{ props, item }">
                  <v-list-item
                    v-bind="props"
                    :title="`${item.raw.ci} - ${item.raw.nombre}`"
                    :subtitle="`${item.raw.banco} - ${item.raw.tipo_cuenta} - ${item.raw.numero_cuenta}`"
                  />
                </template>
              </v-combobox>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="localDatosFormaPago.transferencia.nombre_transferencia"
                label="Nombre completo del beneficiario"
                variant="outlined"
                bg-color="blue-lighten-5"
                density="compact"
                hide-details
                prepend-inner-icon="mdi-account"
                :readonly="props.readonly"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="localDatosFormaPago.transferencia.entidad_bancaria"
                label="Nombre de Entidad Bancaria"
                variant="outlined"
                bg-color="blue-lighten-5"
                density="compact"
                hide-details
                prepend-inner-icon="mdi-bank"
                :readonly="props.readonly"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="localDatosFormaPago.transferencia.tipo_cuenta"
                :items="['Ahorro', 'Corriente']"
                label="Tipo de Cuenta"
                variant="outlined"
                bg-color="blue-lighten-5"
                density="compact"
                hide-details
                prepend-inner-icon="mdi-credit-card"
                :disabled="props.readonly"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="localDatosFormaPago.transferencia.numero_cuenta"
                label="Número de Cuenta Bancaria"
                variant="outlined"
                bg-color="blue-lighten-5"
                density="compact"
                hide-details
                prepend-inner-icon="mdi-numeric"
                :readonly="props.readonly"
              />
            </v-col>
          </v-row>
        </div>

        <!-- Cheque -->
        <div v-if="mostrarFormaCheque" class="mt-4">
          <div class="d-flex align-center mb-2">
            <v-icon color="warning" class="mr-2">mdi-checkbook</v-icon>
            <span class="text-subtitle-1 font-weight-medium">Pago con Cheque</span>
          </div>
          <v-row>
            <v-col cols="12" md="6">
              <v-combobox
                v-model="ciSearchCheque"
                :items="filteredBeneficiariosCheque"
                item-title="ci"
                label="Documento de Identidad C.I."
                variant="outlined"
                bg-color="blue-lighten-5"
                density="compact"
                clearable
                hide-details
                prepend-inner-icon="mdi-card-account-details"
                no-filter
                :disabled="props.readonly"
                :menu-props="{ 'open-on-click': false }"
                @update:search="searchCheque = $event || ''"
                @update:model-value="handleCiSelectCheque"
                @keypress="soloNumeros"
              >
                <template v-slot:item="{ props, item }">
                  <v-list-item
                    v-bind="props"
                    :title="`${item.raw.ci} - ${item.raw.nombre}`"
                    :subtitle="item.raw.nombre"
                  />
                </template>
              </v-combobox>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="localDatosFormaPago.cheque.nombre_cheque"
                label="Nombre a quien se realiza el pago"
                variant="outlined"
                bg-color="blue-lighten-5"
                density="compact"
                hide-details
                prepend-inner-icon="mdi-account"
                :readonly="props.readonly"
              />
            </v-col>
          </v-row>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch, nextTick } from 'vue'
import { formulariosHelpersService } from '../../services/formulariosHelpersService'

const props = defineProps({
  lugar: { type: String, default: '' },
  fecha: { type: String, default: '' },
  formaPago: { type: [String, Number], default: '' },
  datosFormaPago: {
    type: Object,
    default: () => ({
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
    }),
  },
  readonly: { type: Boolean, default: false },
})

const emit = defineEmits([
  'update:lugar',
  'update:fecha',
  'update:formaPago',
  'update:datosFormaPago',
])

const lugaresSelect = ref([])
const formaPagoSelect = ref([])
const beneficiarios = ref([])

const ciSearchEfectivo = ref(null)
const ciSearchTransferencia = ref(null)
const ciSearchCheque = ref(null)

const searchEfectivo = ref('')
const searchTransferencia = ref('')
const searchCheque = ref('')
const searchLugar = ref('')
const errorValidacion = ref('')
const validacionCompleta = ref(false)

const datosFormaPagoDefault = {
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

const localLugar = ref(props.lugar)
const localFecha = ref(props.fecha || getCurrentDate())
const localFormaPago = ref(props.formaPago)
const localDatosFormaPago = ref({ ...datosFormaPagoDefault, ...props.datosFormaPago })

function getCurrentDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const inicializarComboboxDesdeDatos = () => {
  if (beneficiarios.value.length === 0) return
  const datos = localDatosFormaPago.value
  if (datos.efectivo?.ci_efectivo) {
    const ben = beneficiarios.value.find((b) => b.ci === datos.efectivo.ci_efectivo)
    ciSearchEfectivo.value = ben || datos.efectivo.ci_efectivo
  }
  if (datos.transferencia?.ci_transferencia) {
    const ben = beneficiarios.value.find((b) => b.ci === datos.transferencia.ci_transferencia)
    ciSearchTransferencia.value = ben || datos.transferencia.ci_transferencia
  }
  if (datos.cheque?.ci_cheque) {
    const ben = beneficiarios.value.find((b) => b.ci === datos.cheque.ci_cheque)
    ciSearchCheque.value = ben || datos.cheque.ci_cheque
  }
}

const validarDatosFormaPago = (datos) => {
  if (!datos || typeof datos !== 'object') return ''
  const tieneDatos =
    (datos.efectivo && (datos.efectivo.nombre_efectivo || datos.efectivo.ci_efectivo)) ||
    (datos.transferencia &&
      (datos.transferencia.nombre_transferencia || datos.transferencia.ci_transferencia)) ||
    (datos.cheque && (datos.cheque.nombre_cheque || datos.cheque.ci_cheque)) ||
    (datos.otros && (datos.otros.nombre_otros || datos.otros.ci_otros))
  if (!tieneDatos) return ''
  return ''
}

watch(
  () => props.datosFormaPago,
  (nuevosDatos) => {
    if (!nuevosDatos || Object.keys(nuevosDatos).length === 0) {
      errorValidacion.value = ''
      return
    }
    errorValidacion.value = validarDatosFormaPago(nuevosDatos) || ''
  },
  { immediate: true, deep: true },
)

const validarCamposCompletos = () => {
  if (!localLugar.value || !localFormaPago.value) return false
  const fp = localFormaPago.value
  const d = localDatosFormaPago.value
  if (fp === 1 || fp === '1') return !!(d.efectivo.ci_efectivo && d.efectivo.nombre_efectivo)
  if (fp === 2 || fp === '2')
    return !!(
      d.transferencia.ci_transferencia &&
      d.transferencia.nombre_transferencia &&
      d.transferencia.entidad_bancaria &&
      d.transferencia.tipo_cuenta &&
      d.transferencia.numero_cuenta
    )
  if (fp === 3 || fp === '3') return !!(d.cheque.ci_cheque && d.cheque.nombre_cheque)
  return true
}

const handleFormaPagoChange = () => {
  localDatosFormaPago.value.efectivo = { nombre_efectivo: '', ci_efectivo: '' }
  localDatosFormaPago.value.transferencia = {
    nombre_transferencia: '',
    ci_transferencia: '',
    entidad_bancaria: '',
    tipo_cuenta: '',
    numero_cuenta: '',
  }
  localDatosFormaPago.value.cheque = { nombre_cheque: '', ci_cheque: '' }
  ciSearchEfectivo.value = null
  ciSearchTransferencia.value = null
  ciSearchCheque.value = null
}

const handleCiSelectEfectivo = (value) => {
  if (!value) {
    localDatosFormaPago.value.efectivo = { nombre_efectivo: '', ci_efectivo: '' }
    return
  }
  if (typeof value === 'object' && value.ci) {
    localDatosFormaPago.value.efectivo.ci_efectivo = value.ci
    localDatosFormaPago.value.efectivo.nombre_efectivo = value.nombre
  } else if (typeof value === 'string') {
    localDatosFormaPago.value.efectivo.ci_efectivo = value
  }
}

const handleCiSelectTransferencia = (value) => {
  if (!value) {
    localDatosFormaPago.value.transferencia = {
      nombre_transferencia: '',
      ci_transferencia: '',
      entidad_bancaria: '',
      tipo_cuenta: '',
      numero_cuenta: '',
    }
    return
  }
  if (typeof value === 'object' && value.ci) {
    localDatosFormaPago.value.transferencia = {
      ci_transferencia: value.ci,
      nombre_transferencia: value.nombre,
      entidad_bancaria: value.banco,
      tipo_cuenta: value.tipo_cuenta,
      numero_cuenta: value.numero_cuenta,
    }
  } else if (typeof value === 'string') {
    localDatosFormaPago.value.transferencia.ci_transferencia = value
  }
}

const handleCiSelectCheque = (value) => {
  if (!value) {
    localDatosFormaPago.value.cheque = { nombre_cheque: '', ci_cheque: '' }
    return
  }
  if (typeof value === 'object' && value.ci) {
    localDatosFormaPago.value.cheque.ci_cheque = value.ci
    localDatosFormaPago.value.cheque.nombre_cheque = value.nombre
  } else if (typeof value === 'string') {
    localDatosFormaPago.value.cheque.ci_cheque = value
  }
}

const soloNumeros = (e) => {
  const char = String.fromCharCode(e.charCode || e.keyCode)
  if (!/^\d$/.test(char)) e.preventDefault()
}

const lugaresFiltrados = computed(() => {
  if (!searchLugar.value) return []
  const f = lugaresSelect.value.filter((l) =>
    l.toLowerCase().includes(searchLugar.value.toLowerCase()),
  )
  return f.length === 0 && searchLugar.value ? [searchLugar.value] : f
})
const filteredBeneficiariosEfectivo = computed(() => {
  if (!searchEfectivo.value) return []
  return beneficiarios.value.filter(
    (b) =>
      b.ci.includes(searchEfectivo.value) ||
      b.nombre.toLowerCase().includes(searchEfectivo.value.toLowerCase()),
  )
})
const filteredBeneficiariosTransferencia = computed(() => {
  if (!searchTransferencia.value) return []
  return beneficiarios.value.filter(
    (b) =>
      b.ci.includes(searchTransferencia.value) ||
      b.nombre.toLowerCase().includes(searchTransferencia.value.toLowerCase()),
  )
})
const filteredBeneficiariosCheque = computed(() => {
  if (!searchCheque.value) return []
  return beneficiarios.value.filter(
    (b) =>
      b.ci.includes(searchCheque.value) ||
      b.nombre.toLowerCase().includes(searchCheque.value.toLowerCase()),
  )
})
const mostrarFormaEfectivo = computed(
  () => localFormaPago.value === 1 || localFormaPago.value === '1',
)
const mostrarFormaTransferencia = computed(
  () => localFormaPago.value === 2 || localFormaPago.value === '2',
)
const mostrarFormaCheque = computed(
  () => localFormaPago.value === 3 || localFormaPago.value === '3',
)

watch(
  () => props.lugar,
  (v) => {
    localLugar.value = v
  },
)
watch(
  () => props.fecha,
  (v) => {
    localFecha.value = v || getCurrentDate()
  },
)
watch(
  () => props.formaPago,
  (v) => {
    localFormaPago.value = v
  },
)
watch(
  () => props.datosFormaPago,
  (v) => {
    if (v && Object.keys(v).length > 0) {
      localDatosFormaPago.value = {
        efectivo: { ...datosFormaPagoDefault.efectivo, ...(v.efectivo || {}) },
        transferencia: { ...datosFormaPagoDefault.transferencia, ...(v.transferencia || {}) },
        cheque: { ...datosFormaPagoDefault.cheque, ...(v.cheque || {}) },
        otros: { ...datosFormaPagoDefault.otros, ...(v.otros || {}) },
      }
      inicializarComboboxDesdeDatos()
    }
  },
  { deep: true },
)

watch(localLugar, (v) => emit('update:lugar', v))
watch(localFecha, (v) => emit('update:fecha', v))
watch(localFormaPago, (v) => emit('update:formaPago', v))
watch(localDatosFormaPago, (v) => emit('update:datosFormaPago', v), { deep: true })

watch(
  [localLugar, localFormaPago, localDatosFormaPago],
  () => {
    validacionCompleta.value = validarCamposCompletos()
  },
  { deep: true },
)

defineExpose({
  localLugar,
  localFecha,
  localFormaPago,
  localDatosFormaPago,
  validacionCompleta,
  resetForm: () => {
    localLugar.value = ''
    localFecha.value = getCurrentDate()
    localFormaPago.value = ''
    localDatosFormaPago.value = { ...datosFormaPagoDefault }
    ciSearchEfectivo.value = null
    ciSearchTransferencia.value = null
    ciSearchCheque.value = null
    searchLugar.value = ''
    validacionCompleta.value = false
    errorValidacion.value = ''
  },
})

onMounted(async () => {
  formaPagoSelect.value = [
    { id: 1, codigo: 'EFEC', formaPago: 'Efectivo' },
    { id: 2, codigo: 'TB', formaPago: 'Transferencia Bancaria' },
    { id: 3, codigo: 'CHE', formaPago: 'Cheque' },
  ]
  try {
    const [benef, lugar] = await Promise.all([
      formulariosHelpersService.cargarBeneficiarios(),
      formulariosHelpersService.cargarLugares(),
    ])
    beneficiarios.value = benef.todos
    lugaresSelect.value = lugar.lugares_unicos
    await nextTick()
    inicializarComboboxDesdeDatos()
  } catch (error) {
    console.error('Error al cargar informacion', error)
  }
})
</script>
