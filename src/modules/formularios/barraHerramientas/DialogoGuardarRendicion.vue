<template>
  <v-dialog v-model="dialogoVisible" max-width="700" persistent>
    <v-card rounded="lg">
      <!-- Cabecera -->
      <v-card-item>
        <template #prepend>
          <v-icon color="primary" size="24">mdi-content-save</v-icon>
        </template>
        <v-card-title class="text-h6">Guardar formulario: {{ props.titulo }}</v-card-title>
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

      <!-- Contenido con resumen -->
      <v-card-text class="pa-4">
        <p class="text-body-2 text-medium-emphasis mb-3">
          Se guardará el formulario con la siguiente información:
        </p>

        <v-list density="compact" class="bg-grey-lighten-4 rounded-lg pa-2 mb-3">
          <v-list-item class="px-2" density="compact">
            <template #prepend>
              <v-icon color="primary" size="18">mdi-calendar-text</v-icon>
            </template>
            <v-list-item-title class="text-caption">Actividad</v-list-item-title>
            <v-list-item-subtitle class="text-body-2 font-weight-medium">
              {{ datos.descripcionActividad || '—' }}
            </v-list-item-subtitle>
          </v-list-item>

          <v-list-item class="px-2" density="compact">
            <template #prepend>
              <v-icon color="orange" size="18">mdi-map-marker</v-icon>
            </template>
            <v-list-item-title class="text-caption">Lugar de actividad</v-list-item-title>
            <v-list-item-subtitle class="text-body-2 font-weight-medium">
              {{ datos.lugarActividad || '—' }}
            </v-list-item-subtitle>
          </v-list-item>

          <v-list-item class="px-2" density="compact">
            <template #prepend>
              <v-icon color="teal" size="18">mdi-calendar</v-icon>
            </template>
            <v-list-item-title class="text-caption">Fecha de rendición</v-list-item-title>
            <v-list-item-subtitle class="text-body-2 font-weight-medium">
              {{ datos.fechaRendicion || '—' }}
            </v-list-item-subtitle>
          </v-list-item>

          <v-list-item class="px-2" density="compact">
            <template #prepend>
              <v-icon color="purple" size="18">mdi-cash-check</v-icon>
            </template>
            <v-list-item-title class="text-caption">CPTE Diario</v-list-item-title>
            <v-list-item-subtitle class="text-body-2 font-weight-medium">
              {{ datos.cpteDiario || '—' }}
            </v-list-item-subtitle>
          </v-list-item>

          <v-list-item class="px-2" density="compact">
            <template #prepend>
              <v-icon color="green-darken-2" size="18">mdi-cash-multiple</v-icon>
            </template>
            <v-list-item-title class="text-caption">Fecha de desembolso</v-list-item-title>
            <v-list-item-subtitle class="text-body-2 font-weight-medium">
              {{ datos.fechaDesembolso || '—' }}
            </v-list-item-subtitle>
          </v-list-item>

          <v-list-item class="px-2" density="compact">
            <template #prepend>
              <v-icon color="green" size="18">mdi-cash-plus</v-icon>
            </template>
            <v-list-item-title class="text-caption">Monto asignado</v-list-item-title>
            <v-list-item-subtitle class="text-body-2 font-weight-medium">
              {{
                datos.montoAsignado ? `Bs. ${Number(datos.montoAsignado).toLocaleString()}` : '—'
              }}
            </v-list-item-subtitle>
          </v-list-item>

          <v-list-item class="px-2" density="compact">
            <template #prepend>
              <v-icon color="red" size="18">mdi-cash-minus</v-icon>
            </template>
            <v-list-item-title class="text-caption">Monto descargado</v-list-item-title>
            <v-list-item-subtitle class="text-body-2 font-weight-medium">
              {{
                datos.montoDescargado
                  ? `Bs. ${Number(datos.montoDescargado).toLocaleString()}`
                  : '—'
              }}
            </v-list-item-subtitle>
          </v-list-item>

          <v-list-item class="px-2" density="compact">
            <template #prepend>
              <v-icon color="blue" size="18">mdi-cash</v-icon>
            </template>
            <v-list-item-title class="text-caption">Saldo</v-list-item-title>
            <v-list-item-subtitle class="text-body-2 font-weight-medium">
              {{ datos.saldo ? `Bs. ${Number(datos.saldo).toLocaleString()}` : '—' }}
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>

        <!-- Detalle de gastos -->
        <div v-if="datos.detalleDestinoFondos && datos.detalleDestinoFondos.length > 0">
          <p class="text-body-2 font-weight-medium mb-2">Detalle de gastos:</p>
          <v-table density="compact" class="rounded-lg mb-2">
            <thead>
              <tr>
                <th class="text-caption">Descripción</th>
                <th class="text-caption">Factura/Recibo</th>
                <th class="text-caption text-right">Monto</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in datos.detalleDestinoFondos" :key="i">
                <td class="text-caption">{{ item.descripcion || '—' }}</td>
                <td class="text-caption">{{ item.factura_recibo || '—' }}</td>
                <td class="text-caption text-right">
                  Bs. {{ (Number(item.monto) || 0).toLocaleString() }}
                </td>
              </tr>
            </tbody>
          </v-table>
          <div class="d-flex justify-end">
            <v-chip color="primary" size="small" variant="tonal">
              Total: Bs. {{ (Number(datos.montoDescargado) || 0).toLocaleString() }}
            </v-chip>
          </div>
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
        <v-btn color="primary" variant="tonal" size="small" @click="confirmar" :loading="guardando">
          <v-icon start size="16">mdi-check</v-icon>
          Guardar formulario
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue'

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

const abrir = () => {
  dialogoVisible.value = true
  guardando.value = false
}

const cancelar = () => {
  if (!guardando.value) {
    dialogoVisible.value = false
    emit('close')
  }
}

const confirmar = () => {
  emit('confirm')
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
