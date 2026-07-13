<template>
  <v-dialog v-model="dialogoVisible" max-width="700" persistent>
    <v-card rounded="lg">
      <!-- Cabecera -->
      <v-card-item>
        <template #prepend>
          <v-icon color="primary" size="24">mdi-send</v-icon>
        </template>
        <v-card-title class="text-h6">Guardar y Enviar a revisión: {{ props.titulo }}</v-card-title>
        <template #append>
          <v-btn
            icon="mdi-close"
            variant="text"
            size="small"
            @click="cancelar"
            :disabled="guardando"
          />
        </template>
      </v-card-item>

      <v-divider />

      <!-- Contenido -->
      <v-card-text class="pa-4">
        <!-- Paso 1: Resumen del formulario -->
        <p class="text-body-2 font-weight-medium mb-3">
          <v-icon size="16" color="primary" class="mr-1">mdi-clipboard-text</v-icon>
          Resumen del formulario a enviar:
        </p>

        <v-list density="compact" class="bg-grey-lighten-4 rounded-lg pa-2 mb-3">
          <v-list-item class="px-2" density="compact">
            <template #prepend>
              <v-icon color="primary" size="18">mdi-account</v-icon>
            </template>
            <v-list-item-title class="text-caption">Solicitante</v-list-item-title>
            <v-list-item-subtitle class="text-body-2 font-weight-medium">
              {{ datos.solicitante || '—' }}
            </v-list-item-subtitle>
          </v-list-item>

          <v-list-item class="px-2" density="compact">
            <template #prepend>
              <v-icon color="teal" size="18">mdi-calendar</v-icon>
            </template>
            <v-list-item-title class="text-caption">Fecha de solicitud</v-list-item-title>
            <v-list-item-subtitle class="text-body-2 font-weight-medium">
              {{ datos.fechaSolicitud || '—' }}
            </v-list-item-subtitle>
          </v-list-item>

          <v-list-item class="px-2" density="compact">
            <template #prepend>
              <v-icon color="orange" size="18">mdi-map-marker</v-icon>
            </template>
            <v-list-item-title class="text-caption">Lugar</v-list-item-title>
            <v-list-item-subtitle class="text-body-2 font-weight-medium">
              {{ datos.lugar || '—' }}
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>

        <!-- Detalle de forma de pago -->
        <div v-if="datos.detalleFormaPago" class="mb-3">
          <p class="text-body-2 font-weight-medium mb-2">Datos de la forma de pago:</p>
          <!-- Efectivo -->
          <div
            v-if="
              datos.detalleFormaPago.efectivo?.nombre_efectivo ||
              datos.detalleFormaPago.efectivo?.ci_efectivo
            "
            class="bg-grey-lighten-4 rounded-lg pa-2 mb-2"
          >
            <div class="text-caption font-weight-bold mb-1">
              <v-icon size="14" color="success">mdi-cash</v-icon> Efectivo
            </div>
            <div class="text-caption">
              Nombre: {{ datos.detalleFormaPago.efectivo.nombre_efectivo || '—' }}
            </div>
            <div class="text-caption">
              C.I.: {{ datos.detalleFormaPago.efectivo.ci_efectivo || '—' }}
            </div>
          </div>
          <!--Transferencia-->
          <div
            v-if="datos.detalleFormaPago.transferencia?.nombre_transferencia"
            class="bg-grey-lighten-4 rounded-lg pa-2 mb-2"
          >
            <div class="text-caption font-weight-bold mb-1">
              <v-icon size="14" color="primary">mdi-bank-transfer</v-icon> Transferencia Bancaria
            </div>
            <div class="text-caption">
              Nombre: {{ datos.detalleFormaPago.transferencia.nombre_transferencia || '—' }}
            </div>
            <div class="text-caption">
              C.I.: {{ datos.detalleFormaPago.transferencia.ci_transferencia || '—' }}
            </div>
            <div class="text-caption">
              Banco: {{ datos.detalleFormaPago.transferencia.entidad_bancaria || '—' }}
            </div>
            <div class="text-caption">
              Nro. de cuenta: {{ datos.detalleFormaPago.transferencia.numero_cuenta || '—' }}
            </div>
          </div>

          <!-- Cheque -->
          <div
            v-if="
              datos.detalleFormaPago.cheque?.nombre_cheque ||
              datos.detalleFormaPago.cheque?.ci_cheque
            "
            class="bg-grey-lighten-4 rounded-lg pa-2 mb-2"
          >
            <div class="text-caption font-weight-bold mb-1">
              <v-icon size="14" color="warning">mdi-checkbook</v-icon> Cheque
            </div>
            <div class="text-caption">
              Nombre: {{ datos.detalleFormaPago.cheque.nombre_cheque || '—' }}
            </div>
            <div class="text-caption">
              C.I.: {{ datos.detalleFormaPago.cheque.ci_cheque || '—' }}
            </div>
          </div>
        </div>

        <!-- Detalle de gastos -->
        <div v-if="datos.detalleGastos && datos.detalleGastos.length > 0">
          <p class="text-body-2 font-weight-medium mb-2">Detalle de gastos:</p>
          <v-table density="compact" class="rounded-lg mb-2">
            <thead>
              <tr>
                <th class="text-caption">Partida</th>
                <th class="text-caption">Fuente</th>
                <th class="text-caption">Descripción</th>
                <th class="text-caption text-right">Monto</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in datos.detalleGastos" :key="i">
                <td class="text-caption">{{ item.partida || '—' }}</td>
                <td class="text-caption">{{ item.fuente || '—' }}</td>
                <td class="text-caption">{{ item.descripcion || '—' }}</td>
                <td class="text-caption text-right">
                  Bs. {{ (item.monto || 0).toLocaleString() }}
                </td>
              </tr>
            </tbody>
          </v-table>
          <div class="d-flex justify-end">
            <v-chip color="primary" size="small" variant="tonal">
              Total: Bs. {{ (datos.montoTotal || 0).toLocaleString() }}
            </v-chip>
          </div>
        </div>

        <v-divider class="my-4" />

        <!-- Paso 2: Asignar revisores -->
        <div>
          <p class="text-body-2 font-weight-medium mb-3">
            <v-icon size="16" color="primary" class="mr-1">mdi-account-multiple</v-icon>
            Asigne los validadores para revisión:
          </p>
          <AsignacionRevisoresSolicitudesForm
            ref="asignacionRef"
            v-model="datosValidadores"
          ></AsignacionRevisoresSolicitudesForm>
        </div>
      </v-card-text>

      <v-divider />

      <!-- Acciones -->
      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn
          color="grey-darken-1"
          variant="tonal"
          size="small"
          @click="cancelar"
          :disabled="guardando"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="primary"
          variant="tonal"
          size="small"
          @click="confirmar"
          :loading="guardando"
          :disabled="!datosValidadores?.validacionCompleta"
        >
          <v-icon start size="16">mdi-send</v-icon>
          Enviar a revisión
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue'
import AsignacionRevisoresSolicitudesForm from '../components/partials/AsignacionRevisoresSolicitudesForm.vue'

const emit = defineEmits(['confirm', 'close'])

const props = defineProps({
  titulo: {
    type: String,
    default: '',
  },
  datos: {
    type: Object,
    default: () => ({}),
  },
})

const dialogoVisible = ref(false)
const guardando = ref(false)
const asignacionRef = ref(null)
const datosValidadores = ref(null)

const abrir = () => {
  dialogoVisible.value = true
  guardando.value = false
  datosValidadores.value = null
}

const cancelar = () => {
  if (!guardando.value) {
    dialogoVisible.value = false
    emit('close')
  }
}

const confirmar = () => {
  emit('confirm', datosValidadores.value)
}

const setGuardando = (valor) => {
  guardando.value = valor
}

const cerrar = () => {
  dialogoVisible.value = false
  guardando.value = false
}

defineExpose({ abrir, setGuardando, cerrar })
</script>
