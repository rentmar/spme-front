<template>
  <v-dialog v-model="dialog" max-width="1000" persistent>
    <v-card>
      <v-toolbar color="secondary" :title="tituloDialog"></v-toolbar>

      <v-card-text class="pt-6">
        <v-form ref="formRef" @submit.prevent="guardar">
          <!-- Código (solo lectura si está editando) -->
          <v-text-field
            v-model="formData.codigo"
            label="Código"
            variant="outlined"
            readonly
            :disabled="isEditando"
            class="mb-4"
            hint="El código se genera automáticamente"
            persistent-hint
          ></v-text-field>

          <!-- Título -->
          <v-text-field
            v-model="formData.titulo"
            label="Título de la subactividad"
            :rules="[validaciones.requerido]"
            variant="outlined"
            class="mb-4"
            clearable
          ></v-text-field>

          <!-- Descripción -->
          <v-textarea
            v-model="formData.descripcion"
            label="Descripción"
            variant="outlined"
            rows="3"
            clearable
            class="mb-4"
          ></v-textarea>

          <!-- Estado -->
          <v-select
            v-model="formData.estado"
            :items="estadosTarea"
            item-title="text"
            item-value="value"
            label="Estado"
            variant="outlined"
            class="mb-4"
          ></v-select>

          <!-- Fechas -->
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="formData.fecha_creacion"
                label="Fecha de Inicio"
                type="date"
                variant="outlined"
                :max="formData.fecha_limite"
                :rules="[validaciones.fechaValida]"
                class="mb-4"
                hint="Fecha en que inicia la subactividad"
                persistent-hint
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="formData.fecha_limite"
                label="Fecha de Finalización"
                type="date"
                variant="outlined"
                :min="formData.fecha_creacion"
                :rules="[validaciones.fechaValida, validaciones.fechaPosterior]"
                class="mb-4"
                hint="Fecha límite para completar la subactividad"
                persistent-hint
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Presupuesto -->
          <v-text-field
            v-model="formData.presupuesto"
            label="Presupuesto Total (Bs.)"
            type="number"
            step="0.01"
            min="0"
            variant="outlined"
            class="mb-4"
            prefix="Bs."
            :rules="[validaciones.numeroPositivo]"
            @update:model-value="actualizarValidacionPresupuesto"
          ></v-text-field>

          <!-- Desglose de Presupuesto (Opcional) -->
          <v-card variant="outlined" class="mb-4">
            <v-card-title class="d-flex justify-space-between align-center">
              <div class="d-flex align-center">
                <span>Desglose de Presupuesto</span>
                <v-chip color="info" variant="flat" size="small" class="ml-2">Opcional</v-chip>
              </div>
              <div>
                <v-btn
                  color="grey"
                  variant="text"
                  size="small"
                  @click="toggleDesglose"
                  class="mr-2"
                >
                  <v-icon left>{{ mostrarDesglose ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon>
                  {{ mostrarDesglose ? 'Ocultar' : 'Mostrar' }}
                </v-btn>
                <v-btn
                  color="primary"
                  variant="tonal"
                  size="small"
                  @click="agregarItemDesglose"
                  :disabled="!mostrarDesglose || itemsDesglose.length >= 10"
                >
                  <v-icon left>mdi-plus</v-icon>
                  Agregar Item
                </v-btn>
              </div>
            </v-card-title>

            <v-expand-transition>
              <v-card-text v-if="mostrarDesglose">
                <v-alert type="info" density="compact" class="mb-4">
                  El desglose de presupuesto es opcional. Si lo completa, el total no debe exceder
                  el presupuesto total de la subactividad.
                </v-alert>

                <v-table density="compact" class="mb-4">
                  <thead>
                    <tr>
                      <th width="30%">Partida</th>
                      <th width="30%">Descripción</th>
                      <th width="25%">Monto (Bs.)</th>
                      <th width="15%">% del Total</th>
                      <th width="10%">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in itemsDesglose" :key="index">
                      <td>
                        <v-text-field
                          v-model="item.partida"
                          variant="underlined"
                          density="compact"
                          placeholder="No partida"
                          :rules="[validadoresDesglose.partida]"
                          @update:model-value="calcularTotales"
                        >
                        </v-text-field>
                      </td>
                      <td>
                        <v-text-field
                          v-model="item.descripcion"
                          variant="underlined"
                          density="compact"
                          placeholder="Descripción del item"
                          :rules="[validadoresDesglose.descripcion]"
                          @update:model-value="calcularTotales"
                        ></v-text-field>
                      </td>
                      <td>
                        <v-text-field
                          v-model="item.monto"
                          type="number"
                          step="0.01"
                          min="0"
                          variant="underlined"
                          density="compact"
                          prefix="Bs."
                          :rules="[validadoresDesglose.monto]"
                          @update:model-value="calcularTotales"
                        ></v-text-field>
                      </td>
                      <td class="text-center">{{ calcularPorcentaje(item.monto) }}%</td>
                      <td class="text-center">
                        <v-btn
                          icon
                          variant="text"
                          color="error"
                          size="small"
                          @click="eliminarItemDesglose(index)"
                          :disabled="itemsDesglose.length <= 1"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </td>
                    </tr>
                  </tbody>
                </v-table>

                <!-- Resumen del desglose -->
                <v-card variant="tonal" :color="resumenColor">
                  <v-card-text class="py-3">
                    <v-row class="text-center">
                      <v-col cols="4">
                        <div class="text-caption text-medium-emphasis">Total Desglose</div>
                        <div class="text-h6 font-weight-bold">
                          Bs. {{ totalDesglose.toFixed(2) }}
                        </div>
                      </v-col>
                      <v-col cols="4">
                        <div class="text-caption text-medium-emphasis">Presupuesto Total</div>
                        <div class="text-h6 font-weight-bold">
                          Bs. {{ formData.presupuesto || '0.00' }}
                        </div>
                      </v-col>
                      <v-col cols="4">
                        <div class="text-caption text-medium-emphasis">Diferencia</div>
                        <div class="text-h6 font-weight-bold" :class="diferenciaColor">
                          Bs. {{ diferenciaPresupuesto.toFixed(2) }}
                        </div>
                      </v-col>
                    </v-row>
                    <v-alert
                      v-if="diferenciaPresupuesto < 0"
                      type="error"
                      density="compact"
                      class="mt-2"
                    >
                      El total del desglose (Bs. {{ totalDesglose.toFixed(2) }}) excede el
                      presupuesto total (Bs. {{ formData.presupuesto || '0.00' }})
                    </v-alert>
                    <v-alert
                      v-else-if="diferenciaPresupuesto > 0 && tieneItemsValidos"
                      type="info"
                      density="compact"
                      class="mt-2"
                    >
                      Presupuesto no asignado completamente. Queda disponible: Bs.
                      {{ diferenciaPresupuesto.toFixed(2) }}
                    </v-alert>
                    <v-alert
                      v-else-if="diferenciaPresupuesto === 0 && tieneItemsValidos"
                      type="success"
                      density="compact"
                      class="mt-2"
                    >
                      Presupuesto asignado correctamente
                    </v-alert>
                    <v-alert v-else type="warning" density="compact" class="mt-2">
                      Complete todos los campos (Partida, Descripción y Monto) de los items del
                      desglose, u oculte esta sección si no desea utilizarla
                    </v-alert>
                  </v-card-text>
                </v-card>
              </v-card-text>
            </v-expand-transition>
          </v-card>
        </v-form>
      </v-card-text>

      <v-card-actions class="px-6 pb-4">
        <v-spacer></v-spacer>
        <v-btn color="error" variant="outlined" @click="cancelar" :disabled="props.cargando">
          Cancelar
        </v-btn>
        <v-btn
          color="success"
          @click="guardar"
          :loading="props.cargando"
          :disabled="props.cargando || !formularioValido"
        >
          {{ textoBotonGuardar }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  actividad: {
    type: Object,
    default: null,
  },
  tarea: {
    type: Object,
    default: null,
  },
  cargando: {
    type: Boolean,
    default: false,
  },
})

// Emits
const emit = defineEmits(['update:modelValue', 'guardar', 'cancelar'])

// Referencias
const formRef = ref(null)
const dialog = ref(false)
const mostrarDesglose = ref(false)

// Estados disponibles para tareas
const estadosTarea = [
  { text: 'Pendiente', value: 'PEN' },
  { text: 'En Progreso', value: 'EPROG' },
  { text: 'Completada', value: 'COMPL' },
]

// Datos del formulario
const formData = ref({
  id: null,
  codigo: '',
  titulo: '',
  descripcion: '',
  estado: 'PEN',
  fecha_creacion: '',
  fecha_limite: '',
  presupuesto: '0.00',
  presupuestoDesglose: null, // Cambiado a null por defecto
})

// Desglose de presupuesto
const itemsDesglose = ref([{ partida: '', descripcion: '', monto: '' }])
const totalDesglose = ref(0)
const diferenciaPresupuesto = ref(0)

// Validaciones
const validaciones = {
  requerido: (v) => !!v || 'Este campo es requerido',
  fechaValida: (v) => !v || /^\d{4}-\d{2}-\d{2}$/.test(v) || 'Formato de fecha inválido',
  fechaPosterior: (v) => {
    if (!v || !formData.value.fecha_creacion) return true
    return (
      new Date(v) >= new Date(formData.value.fecha_creacion) ||
      'La fecha de finalización debe ser posterior a la de inicio'
    )
  },
  numeroPositivo: (v) => !v || Number(v) >= 0 || 'El valor debe ser positivo',
}

//Validadores para el desglose
const validadoresDesglose = {
  partida: (v) => {
    if (!v || v.trim() === '') {
      return 'La partida es requerida'
    }
    if (v.length > 50) {
      return 'La partida no puede exceder 50 caracteres'
    }
    return true
  },
  descripcion: (v) => {
    if (!v || v.trim() === '') {
      return 'La descripción es requerida'
    }
    if (v.length > 200) {
      return 'La descripción no puede exceder 200 caracteres'
    }
    return true
  },
  monto: (v) => {
    if (!v && v !== 0) {
      return 'El monto es requerido'
    }
    const montoNum = Number(v)
    if (isNaN(montoNum)) {
      return 'Debe ser un número válido'
    }
    if (montoNum <= 0) {
      return 'El monto debe ser mayor a 0'
    }
    if (montoNum > 999999999.99) {
      return 'El monto excede el límite permitido'
    }
    return true
  },
}

// Computed
const isEditando = computed(() => !!props.tarea?.id)
const tituloDialog = computed(() =>
  isEditando.value ? 'Editar Subactividad' : 'Nueva Subactividad',
)
const textoBotonGuardar = computed(() =>
  props.cargando ? 'Guardando...' : isEditando.value ? 'Actualizar' : 'Crear',
)
const diferenciaColor = computed(() => {
  if (diferenciaPresupuesto.value < 0) return 'text-error'
  if (diferenciaPresupuesto.value > 0) return 'text-warning'
  return 'text-success'
})
const resumenColor = computed(() => {
  if (diferenciaPresupuesto.value < 0) return 'error'
  if (diferenciaPresupuesto.value > 0) return 'info'
  return 'success'
})

//Comprobacion de los items
const tieneItemsValidos = computed(() => {
  return itemsDesglose.value.some((item) => {
    // Verificar que todos los campos estén llenos y válidos
    const partidaValida = item.partida && item.partida.trim() !== ''
    const descripcionValida = item.descripcion && item.descripcion.trim() !== ''
    const montoValido = item.monto && item.monto !== '' && Number(item.monto) > 0

    return partidaValida && descripcionValida && montoValido
  })
})

//Validador de formulario
const formularioValido = computed(() => {
  // El formulario es válido si:
  // 1. No se muestra el desglose, O
  // 2. Se muestra el desglose pero no hay items válidos, O
  // 3. Se muestra el desglose con items válidos y no excede el presupuesto
  return (
    !mostrarDesglose.value ||
    !tieneItemsValidos.value ||
    totalDesglose.value <= Number(formData.value.presupuesto)
  )
})

// Watchers
watch(
  () => props.modelValue,
  (nuevoValor) => {
    dialog.value = nuevoValor
    if (nuevoValor) {
      inicializarFormulario()
    }
  },
)

watch(dialog, (nuevoValor) => {
  if (nuevoValor !== props.modelValue) {
    emit('update:modelValue', nuevoValor)
  }
})

// Métodos
const inicializarFormulario = () => {
  if (isEditando.value) {
    // Modo edición - cargar datos de la tarea existente
    Object.assign(formData.value, {
      id: props.tarea.id,
      codigo: props.tarea.codigo || '',
      titulo: props.tarea.titulo || '',
      descripcion: props.tarea.descripcion || '',
      estado: props.tarea.estado || 'PEN',
      fecha_creacion: props.tarea.fecha_creacion || '',
      fecha_limite: props.tarea.fecha_limite || '',
      presupuesto: props.tarea.presupuesto || '0.00',
    })

    // Cargar desglose existente
    if (props.tarea.presupuestoDesglose && Array.isArray(props.tarea.presupuestoDesglose)) {
      const itemsExistentes = props.tarea.presupuestoDesglose.filter(
        (item) => item.descripcion && item.monto && item.monto !== 0,
      )
      if (itemsExistentes.length > 0) {
        // Convertir montos a string para el formulario
        itemsDesglose.value = itemsExistentes.map((item) => ({
          partida: item.partida || '',
          descripcion: item.descripcion || '',
          monto: item.monto ? item.monto.toString() : '',
        }))
        mostrarDesglose.value = true
      } else {
        itemsDesglose.value = [{ partida: '', descripcion: '', monto: '' }]
        mostrarDesglose.value = false
      }
    } else {
      itemsDesglose.value = [{ partida: '', descripcion: '', monto: '' }]
      mostrarDesglose.value = false
    }
  } else {
    // Modo creación - valores por defecto
    const hoy = new Date()
    const fechaLimite = new Date()
    fechaLimite.setDate(fechaLimite.getDate() + 7)

    Object.assign(formData.value, {
      id: null,
      codigo: '',
      titulo: '',
      descripcion: '',
      estado: 'PEN',
      fecha_creacion: hoy.toISOString().split('T')[0],
      fecha_limite: fechaLimite.toISOString().split('T')[0],
      presupuesto: '0.00',
      presupuestoDesglose: null,
    })

    itemsDesglose.value = [{ partida: '', descripcion: '', monto: '' }]
    mostrarDesglose.value = false
  }

  calcularTotales()

  // Resetear validación del formulario
  nextTick(() => {
    if (formRef.value) {
      formRef.value.resetValidation()
    }
  })
}

const toggleDesglose = () => {
  mostrarDesglose.value = !mostrarDesglose.value
  if (!mostrarDesglose.value) {
    // Limpiar items cuando se oculta el desglose
    itemsDesglose.value = [{ partida: '', descripcion: '', monto: '' }]
    calcularTotales()
  }
}

const calcularTotales = () => {
  totalDesglose.value = itemsDesglose.value.reduce((total, item) => {
    const monto = item.monto && item.monto !== '' ? Number(item.monto) : 0
    return total + monto
  }, 0)

  diferenciaPresupuesto.value = Number(formData.value.presupuesto || 0) - totalDesglose.value
}

const calcularPorcentaje = (monto) => {
  const presupuestoTotal = Number(formData.value.presupuesto) || 1
  const montoNum = monto && monto !== '' ? Number(monto) : 0
  return presupuestoTotal > 0 ? ((montoNum / presupuestoTotal) * 100).toFixed(1) : '0.0'
}

const agregarItemDesglose = () => {
  if (itemsDesglose.value.length < 10) {
    itemsDesglose.value.push({ partida: '', descripcion: '', monto: '' })
  }
}

const eliminarItemDesglose = (index) => {
  if (itemsDesglose.value.length > 1) {
    itemsDesglose.value.splice(index, 1)
    calcularTotales()
  }
}

const actualizarValidacionPresupuesto = () => {
  calcularTotales()
}

const prepararDesgloseParaAPI = () => {
  if (!mostrarDesglose.value || !tieneItemsValidos.value) {
    return null
  }

  // Filtrar items válidos y convertir montos a números
  const itemsValidos = itemsDesglose.value
    .filter(
      (item) =>
        item.partida && item.descripcion && item.monto && item.monto !== '' && item.monto !== '0',
    )
    .map((item) => ({
      partida: item.partida.trim(),
      descripcion: item.descripcion.trim(),
      monto: Number(item.monto),
    }))

  return itemsValidos.length > 0 ? itemsValidos : null
}

const guardar = async () => {
  if (!formRef.value) return

  const { valid } = await formRef.value.validate()
  if (!valid) return

  // Preparar el desglose para la API
  const presupuestoDesglose = prepararDesgloseParaAPI()

  // Preparar datos para enviar
  const datosTarea = {
    ...formData.value,
    actividad: props.actividad?.id,
    presupuestoDesglose: presupuestoDesglose,
    // Asegurar que el presupuesto sea número
    presupuesto: Number(formData.value.presupuesto) || 0,
  }

  // Limpiar campos que no deben enviarse si están vacíos
  if (!datosTarea.codigo) delete datosTarea.codigo
  if (!datosTarea.fecha_creacion) delete datosTarea.fecha_creacion
  if (!datosTarea.fecha_limite) delete datosTarea.fecha_limite

  console.log('Datos a enviar a la API:', JSON.stringify(datosTarea, null, 2))

  emit('guardar', datosTarea)
}

const cancelar = () => {
  emit('cancelar')
  dialog.value = false
}

// Limpiar formulario cuando se cierra
watch(dialog, (nuevoValor) => {
  if (!nuevoValor) {
    nextTick(() => {
      if (formRef.value) {
        formRef.value.reset()
      }
    })
  }
})
</script>

<style scoped>
/* Estilos opcionales para mejorar la apariencia */
.v-expansion-panel {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.text-error {
  color: #f44336;
}

.text-warning {
  color: #ff9800;
}

.text-success {
  color: #4caf50;
}
</style>
