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

    <v-card variant="outlined" class="mb-4">
      <v-card-text class="pa-4">
        <!-- Lugar y Fecha -->
        <v-row>
          <v-col cols="12" md="8">
            <v-combobox
              v-model="informacionAdicionalDatos.lugar"
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
            >
            </v-combobox>
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field
              v-model="informacionAdicionalDatos.fecha"
              label="Fecha de la Solicitud"
              type="date"
              variant="outlined"
              density="compact"
              bg-color="grey-lighten-4"
              readonly
              hide-details
              prepend-inner-icon="mdi-calendar"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-divider class="my-3"></v-divider>

        <!-- Forma de Pago -->
        <div class="mt-4">
          <div class="d-flex align-center mb-2">
            <v-icon color="primary" class="mr-2">mdi-cash-multiple</v-icon>
            <span class="text-subtitle-1 font-weight-medium">Forma de Pago</span>
          </div>
          <v-select
            v-model="informacionAdicionalDatos.formaPago"
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
          ></v-select>
        </div>

        <!--Efectivo-->
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
              >
                <template v-slot:item="{ props, item }">
                  <v-list-item
                    v-bind="props"
                    :title="`${item.raw.ci} - ${item.raw.nombre}`"
                    :subtitle="item.raw.nombre"
                  ></v-list-item>
                </template>
              </v-combobox>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="informacionAdicionalDatos.datosFormaPago.efectivo.nombre_efectivo"
                label="Nombre a quien se realiza el pago"
                variant="outlined"
                bg-color="blue-lighten-5"
                density="compact"
                hide-details
                prepend-inner-icon="mdi-account"
              ></v-text-field>
            </v-col>
          </v-row>
        </div>

        <!--Transferencia Bancaria-->
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
              >
                <template v-slot:item="{ props, item }">
                  <v-list-item
                    v-bind="props"
                    :title="`${item.raw.ci} - ${item.raw.nombre}`"
                    :subtitle="`${item.raw.banco} - ${item.raw.tipo_cuenta} - ${item.raw.numero_cuenta}`"
                  ></v-list-item>
                </template>
              </v-combobox>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="
                  informacionAdicionalDatos.datosFormaPago.transferencia.nombre_transferencia
                "
                label="Nombre completo del beneficiario"
                variant="outlined"
                bg-color="blue-lighten-5"
                density="compact"
                hide-details
                prepend-inner-icon="mdi-account"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="informacionAdicionalDatos.datosFormaPago.transferencia.entidad_bancaria"
                label="Nombre de Entidad Bancaria"
                variant="outlined"
                bg-color="blue-lighten-5"
                density="compact"
                hide-details
                prepend-inner-icon="mdi-bank"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="informacionAdicionalDatos.datosFormaPago.transferencia.tipo_cuenta"
                :items="['Ahorro', 'Corriente']"
                label="Tipo de Cuenta"
                variant="outlined"
                bg-color="blue-lighten-5"
                density="compact"
                hide-details
                prepend-inner-icon="mdi-credit-card"
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="informacionAdicionalDatos.datosFormaPago.transferencia.numero_cuenta"
                label="Número de Cuenta Bancaria"
                variant="outlined"
                bg-color="blue-lighten-5"
                density="compact"
                hide-details
                prepend-inner-icon="mdi-numeric"
              ></v-text-field>
            </v-col>
          </v-row>
        </div>

        <!--Cheque-->
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
              >
                <template v-slot:item="{ props, item }">
                  <v-list-item
                    v-bind="props"
                    :title="`${item.raw.ci} - ${item.raw.nombre}`"
                    :subtitle="item.raw.nombre"
                  ></v-list-item>
                </template>
              </v-combobox>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="informacionAdicionalDatos.datosFormaPago.cheque.nombre_cheque"
                label="Nombre a quien se realiza el pago"
                variant="outlined"
                bg-color="blue-lighten-5"
                density="compact"
                hide-details
                prepend-inner-icon="mdi-account"
              ></v-text-field>
            </v-col>
          </v-row>
        </div>
      </v-card-text>
    </v-card>
  </div>
  {{}}
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'

const props = defineProps({
  isEdicion: {
    type: Boolean,
    default: false,
  },
  lugarSolicitud: {
    type: String,
    default: '',
  },
  fechaSolicitud: {
    type: String,
    default: '',
  },
  idFormaPago: {
    type: [Number, String],
    default: null,
  },
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

const lugaresSelect = ref([])
const formaPagoSelect = ref([])
const ciSearchEfectivo = ref(null)
const ciSearchTransferencia = ref(null)
const ciSearchCheque = ref(null)

const searchEfectivo = ref('')
const searchTransferencia = ref('')
const searchCheque = ref('')
const searchLugar = ref('')

//Datos del componente
const informacionAdicionalDatos = ref({
  lugar: props.lugarSolicitud || '',
  fecha: props.fechaSolicitud || getCurrentDate(),
  formaPago: props.idFormaPago || '',
  datosFormaPago: { ...props.datosFormaPago },
})

const lugaresFiltrados = computed(() => {
  if (!searchLugar.value) return []
  const filtrados = lugaresSelect.value.filter((l) =>
    l.toLowerCase().includes(searchLugar.value.toLowerCase()),
  )
  return filtrados.length === 0 && searchLugar.value ? [searchLugar.value] : filtrados
})

const beneficiarios = [
  {
    ci: '12345678',
    nombre: 'Juan Pérez Gutiérrez',
    banco: 'Banco Mercantil',
    tipo_cuenta: 'Ahorro',
    numero_cuenta: '100001202100',
  },
  {
    ci: '23456789',
    nombre: 'María García López',
    banco: 'FIE',
    tipo_cuenta: 'Corriente',
    numero_cuenta: '200002303200',
  },
  {
    ci: '34567890',
    nombre: 'Carlos Rodríguez Mamani',
    banco: 'BNB',
    tipo_cuenta: 'Ahorro',
    numero_cuenta: '300003404300',
  },
  {
    ci: '45678901',
    nombre: 'Ana Martínez Quispe',
    banco: 'BCP',
    tipo_cuenta: 'Corriente',
    numero_cuenta: '400004505400',
  },
  {
    ci: '56789012',
    nombre: 'Pedro Sánchez Choque',
    banco: 'Banco Unión',
    tipo_cuenta: 'Ahorro',
    numero_cuenta: '500005606500',
  },
]

const filteredBeneficiariosEfectivo = computed(() => {
  if (!searchEfectivo.value) return []
  return beneficiarios.filter(
    (b) =>
      b.ci.includes(searchEfectivo.value) ||
      b.nombre.toLowerCase().includes(searchEfectivo.value.toLowerCase()),
  )
})

const filteredBeneficiariosTransferencia = computed(() => {
  if (!searchTransferencia.value) return []
  return beneficiarios.filter(
    (b) =>
      b.ci.includes(searchTransferencia.value) ||
      b.nombre.toLowerCase().includes(searchTransferencia.value.toLowerCase()),
  )
})

const filteredBeneficiariosCheque = computed(() => {
  if (!searchCheque.value) return []
  return beneficiarios.filter(
    (b) =>
      b.ci.includes(searchCheque.value) ||
      b.nombre.toLowerCase().includes(searchCheque.value.toLowerCase()),
  )
})

const mostrarFormaEfectivo = computed(() => informacionAdicionalDatos.value.formaPago === 1)
const mostrarFormaTransferencia = computed(() => informacionAdicionalDatos.value.formaPago === 2)
const mostrarFormaCheque = computed(() => informacionAdicionalDatos.value.formaPago === 3)

const handleFormaPagoChange = () => {
  informacionAdicionalDatos.value.datosFormaPago.efectivo = { nombre_efectivo: '', ci_efectivo: '' }
  informacionAdicionalDatos.value.datosFormaPago.transferencia = {
    nombre_transferencia: '',
    ci_transferencia: '',
    entidad_bancaria: '',
    tipo_cuenta: '',
    numero_cuenta: '',
  }
  informacionAdicionalDatos.value.datosFormaPago.cheque = { nombre_cheque: '', ci_cheque: '' }
  ciSearchEfectivo.value = null
  ciSearchTransferencia.value = null
  ciSearchCheque.value = null
  searchEfectivo.value = ''
  searchTransferencia.value = ''
  searchCheque.value = ''
}

const handleCiSelectEfectivo = (value) => {
  if (!value) {
    informacionAdicionalDatos.value.datosFormaPago.efectivo.ci_efectivo = ''
    informacionAdicionalDatos.value.datosFormaPago.efectivo.nombre_efectivo = ''
    searchEfectivo.value = ''
    return
  }
  if (typeof value === 'object' && value.ci) {
    informacionAdicionalDatos.value.datosFormaPago.efectivo.ci_efectivo = value.ci
    informacionAdicionalDatos.value.datosFormaPago.efectivo.nombre_efectivo = value.nombre
    searchEfectivo.value = value.ci
  } else if (typeof value === 'string') {
    informacionAdicionalDatos.value.datosFormaPago.efectivo.ci_efectivo = value
    searchEfectivo.value = value
  }
}

const handleCiSelectTransferencia = (value) => {
  if (!value) {
    informacionAdicionalDatos.value.datosFormaPago.transferencia = {
      nombre_transferencia: '',
      ci_transferencia: '',
      entidad_bancaria: '',
      tipo_cuenta: '',
      numero_cuenta: '',
    }
    searchTransferencia.value = ''
    return
  }
  if (typeof value === 'object' && value.ci) {
    informacionAdicionalDatos.value.datosFormaPago.transferencia.ci_transferencia = value.ci
    informacionAdicionalDatos.value.datosFormaPago.transferencia.nombre_transferencia = value.nombre
    informacionAdicionalDatos.value.datosFormaPago.transferencia.entidad_bancaria = value.banco
    informacionAdicionalDatos.value.datosFormaPago.transferencia.tipo_cuenta = value.tipo_cuenta
    informacionAdicionalDatos.value.datosFormaPago.transferencia.numero_cuenta = value.numero_cuenta
    searchTransferencia.value = value.ci
  } else if (typeof value === 'string') {
    informacionAdicionalDatos.value.datosFormaPago.transferencia.ci_transferencia = value
    searchTransferencia.value = value
  }
}

const handleCiSelectCheque = (value) => {
  if (!value) {
    informacionAdicionalDatos.value.datosFormaPago.cheque.ci_cheque = ''
    informacionAdicionalDatos.value.datosFormaPago.cheque.nombre_cheque = ''
    searchCheque.value = ''
    return
  }
  if (typeof value === 'object' && value.ci) {
    informacionAdicionalDatos.value.datosFormaPago.cheque.ci_cheque = value.ci
    informacionAdicionalDatos.value.datosFormaPago.cheque.nombre_cheque = value.nombre
    searchCheque.value = value.ci
  } else if (typeof value === 'string') {
    informacionAdicionalDatos.value.datosFormaPago.cheque.ci_cheque = value
    searchCheque.value = value
  }
}

function getCurrentDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

onMounted(async () => {
  lugaresSelect.value = ['La Paz', 'Santa Cruz', 'Cochabamba', 'Paris', 'Alemania']
  formaPagoSelect.value = [
    { id: 1, codigo: 'EFEC', formaPago: 'Efectivo' },
    { id: 2, codigo: 'TB', formaPago: 'Transferencia Bancaria' },
    { id: 3, codigo: 'CHE', formaPago: 'Cheque' },
  ]

  if (props.isEdicion && props.lugarSolicitud) {
    searchLugar.value = props.lugarSolicitud
  }

  // Cargar datos si es edición
  if (props.isEdicion) {
    informacionAdicionalDatos.value.lugar = props.lugarSolicitud || ''
    informacionAdicionalDatos.value.fecha = props.fechaSolicitud || getCurrentDate()
    informacionAdicionalDatos.value.formaPago = props.idFormaPago || ''
    informacionAdicionalDatos.value.datosFormaPago = { ...props.datosFormaPago }

    // Cargar combobox de CI según forma de pago
    if (props.idFormaPago === 1 && props.datosFormaPago?.efectivo?.ci_efectivo) {
      const ci = props.datosFormaPago.efectivo.ci_efectivo
      ciSearchEfectivo.value = ci
      searchEfectivo.value = ci
    } else if (props.idFormaPago === 2 && props.datosFormaPago?.transferencia?.ci_transferencia) {
      const ci = props.datosFormaPago.transferencia.ci_transferencia
      ciSearchTransferencia.value = ci
      searchTransferencia.value = ci
    } else if (props.idFormaPago === 3 && props.datosFormaPago?.cheque?.ci_cheque) {
      const ci = props.datosFormaPago.cheque.ci_cheque
      ciSearchCheque.value = ci
      searchCheque.value = ci
    }
  }
})
</script>
<style scoped></style>
