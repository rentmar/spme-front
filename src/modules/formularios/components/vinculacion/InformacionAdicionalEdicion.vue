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
              readonly
              hide-details
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
              />
            </v-col>
          </v-row>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import { formulariosHelpersService } from '../../services/formulariosHelpersService'

// ─── Props ──────────────────────────────────────────────
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
})

// ─── Emits ──────────────────────────────────────────────
const emit = defineEmits([
  'update:lugar',
  'update:fecha',
  'update:formaPago',
  'update:datosFormaPago',
])

// ─── Estado ─────────────────────────────────────────────
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

// ─── Estados locales sincronizados ──────────────────────
const localLugar = ref(props.lugar)
const localFecha = ref(props.fecha || getCurrentDate())
const localFormaPago = ref(props.formaPago)
const localDatosFormaPago = ref({ ...datosFormaPagoDefault, ...props.datosFormaPago })

// ─── Sincronización props → local ───────────────────────
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
    localDatosFormaPago.value = { ...datosFormaPagoDefault, ...v }
  },
  { deep: true },
)

// ─── Emitir cambios al padre ────────────────────────────
watch(localLugar, (v) => emit('update:lugar', v))
watch(localFecha, (v) => emit('update:fecha', v))
watch(localFormaPago, (v) => emit('update:formaPago', v))
watch(localDatosFormaPago, (v) => emit('update:datosFormaPago', v), { deep: true })

// ─── Computed ───────────────────────────────────────────
const lugaresFiltrados = computed(() => {
  if (!searchLugar.value) return []
  const filtrados = lugaresSelect.value.filter((l) =>
    l.toLowerCase().includes(searchLugar.value.toLowerCase()),
  )
  return filtrados.length === 0 && searchLugar.value ? [searchLugar.value] : filtrados
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

// ─── Validación de estructura de datosFormaPago ─────────
const validarDatosFormaPago = (datos) => {
  const errores = []
  if (!datos || typeof datos !== 'object') return 'datosFormaPago debe ser un objeto'

  if (!datos.efectivo || typeof datos.efectivo !== 'object') {
    errores.push('Falta el objeto "efectivo"')
  } else {
    if (typeof datos.efectivo.nombre_efectivo !== 'string')
      errores.push('efectivo.nombre_efectivo debe ser string')
    if (typeof datos.efectivo.ci_efectivo !== 'string')
      errores.push('efectivo.ci_efectivo debe ser string')
  }

  if (!datos.transferencia || typeof datos.transferencia !== 'object') {
    errores.push('Falta el objeto "transferencia"')
  } else {
    const campos = [
      'nombre_transferencia',
      'ci_transferencia',
      'entidad_bancaria',
      'tipo_cuenta',
      'numero_cuenta',
    ]
    campos.forEach((c) => {
      if (typeof datos.transferencia[c] !== 'string')
        errores.push(`transferencia.${c} debe ser string`)
    })
  }

  if (!datos.cheque || typeof datos.cheque !== 'object') {
    errores.push('Falta el objeto "cheque"')
  } else {
    if (typeof datos.cheque.nombre_cheque !== 'string')
      errores.push('cheque.nombre_cheque debe ser string')
    if (typeof datos.cheque.ci_cheque !== 'string') errores.push('cheque.ci_cheque debe ser string')
  }

  if (!datos.otros || typeof datos.otros !== 'object') {
    errores.push('Falta el objeto "otros"')
  } else {
    if (typeof datos.otros.nombre_otros !== 'string')
      errores.push('otros.nombre_otros debe ser string')
    if (typeof datos.otros.ci_otros !== 'string') errores.push('otros.ci_otros debe ser string')
  }

  return errores.length > 0 ? errores.join('; ') : ''
}

// Validar al recibir datosFormaPago
watch(
  () => props.datosFormaPago,
  (nuevosDatos) => {
    if (nuevosDatos && Object.keys(nuevosDatos).length > 0) {
      const error = validarDatosFormaPago(nuevosDatos)
      errorValidacion.value = error || ''
    }
  },
  { immediate: true, deep: true },
)

// ─── Validación de campos completos ─────────────────────
const validarCamposCompletos = () => {
  if (!localLugar.value) return false
  if (!localFormaPago.value) return false

  const fp = localFormaPago.value
  const datos = localDatosFormaPago.value

  if (fp === 1 || fp === '1') {
    if (!datos.efectivo.ci_efectivo || !datos.efectivo.nombre_efectivo) return false
  } else if (fp === 2 || fp === '2') {
    if (
      !datos.transferencia.ci_transferencia ||
      !datos.transferencia.nombre_transferencia ||
      !datos.transferencia.entidad_bancaria ||
      !datos.transferencia.tipo_cuenta ||
      !datos.transferencia.numero_cuenta
    )
      return false
  } else if (fp === 3 || fp === '3') {
    if (!datos.cheque.ci_cheque || !datos.cheque.nombre_cheque) return false
  }
  return true
}

watch(
  [localLugar, localFormaPago, localDatosFormaPago],
  () => {
    validacionCompleta.value = validarCamposCompletos()
  },
  { deep: true },
)

// ─── Handlers ───────────────────────────────────────────
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

// ─── Utilidades ─────────────────────────────────────────
function getCurrentDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// ─── Exponer al padre ───────────────────────────────────
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

// ─── Carga inicial ──────────────────────────────────────
const cargarInformacion = async () => {
  try {
    const [benef, lugar] = await Promise.all([
      formulariosHelpersService.cargarBeneficiarios(),
      formulariosHelpersService.cargarLugares(),
    ])
    beneficiarios.value = benef.todos
    lugaresSelect.value = lugar.lugares_unicos
  } catch (error) {
    console.error('Error al cargar informacion', error)
  }
}

onMounted(async () => {
  formaPagoSelect.value = [
    { id: 1, codigo: 'EFEC', formaPago: 'Efectivo' },
    { id: 2, codigo: 'TB', formaPago: 'Transferencia Bancaria' },
    { id: 3, codigo: 'CHE', formaPago: 'Cheque' },
  ]
  await cargarInformacion()
})
</script>
