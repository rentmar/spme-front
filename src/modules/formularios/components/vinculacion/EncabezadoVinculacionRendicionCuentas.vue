<template>
  <div class="vinculacion-section">
    <div v-if="loading" class="d-flex justify-center pa-10">
      <v-progress-circular indeterminate color="deep-purple"></v-progress-circular>
    </div>

    <div v-else-if="formulariosVinculados.length > 0">
      <h3 class="text-subtitle-1 font-weight-bold mb-4 px-2 d-flex align-center">
        <v-icon icon="mdi-link-variant" class="mr-2" color="deep-purple"></v-icon>
        Formularios de Origen Vinculados
      </h3>

      <v-card
        v-for="(sol, index) in formulariosVinculados"
        :key="index"
        variant="outlined"
        class="mb-6 solicitud-card"
      >
        <v-card-title class="bg-grey-lighten-4 py-3 px-4">
          <div class="d-flex align-center flex-wrap">
            <v-icon :icon="sol.icono" color="deep-purple" class="mr-3"></v-icon>
            <div>
              <div class="text-overline lh-1">{{ sol.titulo }}</div>
              <div class="text-body-1 font-weight-black">{{ sol.data.numeroFormulario }}</div>
            </div>
            <v-spacer></v-spacer>
            <v-chip size="small" :color="sol.color" variant="flat" class="font-weight-bold">
              Bs. {{ sol.data.montoSolicitado }}
            </v-chip>
          </div>
        </v-card-title>

        <v-card-text class="pa-4">
          <v-row>
            <v-col cols="12" md="6">
              <div class="mb-2">
                <span class="text-caption text-grey-darken-1 font-weight-bold"
                  >MOTIVO / DESCRIPCIÓN:</span
                >
                <div class="text-body-2">
                  {{ sol.data.descripcion_actividad || sol.data.evento || 'Sin descripción' }}
                </div>
              </div>
              <div class="d-flex ga-4">
                <div>
                  <span class="text-caption text-grey-darken-1 font-weight-bold">FECHA:</span>
                  <div class="text-body-2">{{ sol.data.fechaSolicitud }}</div>
                </div>
                <div>
                  <span class="text-caption text-grey-darken-1 font-weight-bold">LUGAR:</span>
                  <div class="text-body-2">{{ sol.data.lugarSolicitud }}</div>
                </div>
              </div>
            </v-col>

            <v-col cols="12" md="6" class="border-s-md">
              <span class="text-caption text-grey-darken-1 font-weight-bold">FORMA DE PAGO:</span>
              <div class="d-flex align-center mt-1">
                <v-icon
                  :icon="getFormaPago(sol.data.formaPago).icon"
                  size="small"
                  class="mr-2"
                ></v-icon>
                <div class="text-body-2">
                  <strong>{{ getFormaPago(sol.data.formaPago).text }}</strong>
                  <div v-if="sol.data.formaPago === 2" class="text-caption text-blue-darken-2">
                    {{ sol.data.datos_forma_pago?.transferencia?.entidad_bancaria }} -
                    {{ sol.data.datos_forma_pago?.transferencia?.numero_cuenta }}
                  </div>
                  <div
                    v-else-if="sol.data.formaPago === 1 || sol.data.formaPago === 3"
                    class="text-caption"
                  >
                    A nombre de: {{ sol.data.datos_forma_pago?.otros?.nombre_otros }}
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>

          <div class="mt-4" v-if="getIems(sol.data).length > 0">
            <div class="text-caption text-grey-darken-1 font-weight-bold mb-1">
              DESGLOSE DE PARTIDAS:
            </div>
            <v-table density="compact" class="items-table border rounded">
              <thead>
                <tr>
                  <th class="text-left bg-grey-lighten-5">Partida</th>
                  <th class="text-left bg-grey-lighten-5">Concepto</th>
                  <th class="text-right bg-grey-lighten-5">Monto</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, i) in getIems(sol.data)" :key="i">
                  <td class="text-caption">{{ item.partida_sf || item.partida }}</td>
                  <td class="text-caption">{{ item.concepto }}</td>
                  <td class="text-caption text-right font-weight-bold">Bs. {{ item.monto }}</td>
                </tr>
              </tbody>
            </v-table>
          </div>
        </v-card-text>
      </v-card>
    </div>

    <v-alert v-else type="info" variant="tonal" class="ma-2">
      No se encontraron solicitudes vinculadas.
    </v-alert>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useSolicitudesStore } from '../../store/useSolicitudesStore'

const props = defineProps({
  idRendicionCuentas: { type: [Number, String], required: true },
})

const rendicionStore = useSolicitudesStore()
const loading = ref(false)

const cargarDatos = async () => {
  loading.value = true
  try {
    await rendicionStore.cargarRendicionCuentasMasSolicitudesRelacionadas(props.idRendicionCuentas)
  } finally {
    loading.value = false
  }
}

const formulariosVinculados = computed(() => {
  const root = rendicionStore.rendicionCuentasActual
  if (!root) return []

  const res = []
  const mapping = [
    {
      key: 'solicitudFondos',
      titulo: 'SOLICITUD DE FONDOS',
      icono: 'mdi-cash-plus',
      color: 'green-darken-2',
    },
    {
      key: 'solicitudViaje',
      titulo: 'SOLICITUD DE VIAJE',
      icono: 'mdi-airplane-takeoff',
      color: 'blue-darken-2',
    },
    {
      key: 'solicitudReembolso',
      titulo: 'SOLICITUD DE REEMBOLSO',
      icono: 'mdi-hand-coin',
      color: 'orange-darken-3',
    },
    {
      key: 'solicitudPagoDirecto',
      titulo: 'PAGO DIRECTO',
      icono: 'mdi-bank-transfer',
      color: 'teal-darken-3',
    },
  ]

  mapping.forEach((m) => {
    if (root[m.key]) res.push({ ...m, data: root[m.key] })
  })
  return res
})

// Helpers
const getFormaPago = (val) => {
  if (val === 1) return { text: 'Efectivo / Cheque (Otros)', icon: 'mdi-cash-check' }
  if (val === 2) return { text: 'Transferencia Bancaria', icon: 'mdi-bank-outline' }
  if (val === 3) return { text: 'Reembolso', icon: 'mdi-account-cash' }
  return { text: 'No definido', icon: 'mdi-help' }
}

const getIems = (data) => {
  // Maneja las diferentes rutas de items según el tipo de objeto
  return data.detalleDestinoFondos?.items || data.detalleGasto?.items || []
}

onMounted(cargarDatos)
</script>

<style scoped>
.solicitud-card {
  border-radius: 8px !important;
  border: 1px solid #d1d1d1 !important;
  overflow: hidden;
}
.lh-1 {
  line-height: 1.1;
}
.items-table {
  border-color: #eee !important;
}
.border-s-md {
  border-left: 1px dashed #e0e0e0;
}
@media (max-width: 960px) {
  .border-s-md {
    border-left: none;
    border-top: 1px dashed #e0e0e0;
    padding-top: 10px;
  }
}
</style>
