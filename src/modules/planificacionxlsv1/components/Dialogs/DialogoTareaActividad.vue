<!-- DialogoTareaActividad.vue -->
<template>
  <v-dialog v-model="dialog" max-width="1000" persistent>
    <v-card>
      <v-toolbar color="secondary" :title="tituloDialog"></v-toolbar>

      <v-card-text class="pt-6">
        <!-- Alerta de límite presupuestario -->
        <v-alert
          :type="alertaLimiteTipo"
          density="compact"
          variant="tonal"
          class="mb-4"
          icon="mdi-cash-lock"
        >
          <strong>Saldo disponible para asignar:</strong>
          {{ formatearMonto(props.limitePresupuesto) }}
          <template v-if="isEditando && tarea?.presupuesto">
            (Presupuesto actual: {{ formatearMonto(tarea.presupuesto) }})
          </template>
        </v-alert>

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
                :rules="[validaciones.fechaValida, validaciones.fechaInicioAnterior]"
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

          <!-- Presupuesto con límite -->
          <v-text-field
            v-model="formData.presupuesto"
            label="Presupuesto Total (Bs.)"
            type="number"
            step="0.01"
            min="0"
            :max="props.limitePresupuesto"
            variant="outlined"
            class="mb-4"
            prefix="Bs."
            :rules="[validaciones.numeroPositivo, validaciones.noExcedeLimite]"
            :hint="`Máximo permitido: ${formatearMonto(props.limitePresupuesto)}`"
            persistent-hint
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
                  el presupuesto total de la subactividad ({{
                    formatearMonto(formData.presupuesto || 0)
                  }}). Seleccione la fuente de financiamiento para cada item.
                </v-alert>

                <v-table density="compact" class="mb-4">
                  <thead>
                    <tr>
                      <th width="18%">Partida</th>
                      <th width="22%">Descripción</th>
                      <th width="22%">Fuente Financiamiento</th>
                      <th width="18%">Monto (Bs.)</th>
                      <th width="10%">% del Total</th>
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
                        />
                      </td>
                      <td>
                        <v-text-field
                          v-model="item.descripcion"
                          variant="underlined"
                          density="compact"
                          placeholder="Descripción del item"
                          :rules="[validadoresDesglose.descripcion]"
                          @update:model-value="calcularTotales"
                        />
                      </td>
                      <td>
                        <v-select
                          v-model="item.fuente"
                          :items="fuentesFinanciamiento"
                          item-title="financiera"
                          return-object
                          variant="underlined"
                          density="compact"
                          placeholder="Seleccionar"
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
                          v-model="item.monto"
                          type="number"
                          step="0.01"
                          min="0"
                          variant="underlined"
                          density="compact"
                          prefix="Bs."
                          :rules="[validadoresDesglose.monto]"
                          @update:model-value="calcularTotales"
                        />
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
                      <v-col cols="3">
                        <div class="text-caption text-medium-emphasis">Total Desglose</div>
                        <div class="text-h6 font-weight-bold">
                          Bs. {{ totalDesglose.toFixed(2) }}
                        </div>
                      </v-col>
                      <v-col cols="3">
                        <div class="text-caption text-medium-emphasis">Presupuesto Tarea</div>
                        <div class="text-h6 font-weight-bold">
                          Bs. {{ formData.presupuesto || '0.00' }}
                        </div>
                      </v-col>
                      <v-col cols="3">
                        <div class="text-caption text-medium-emphasis">Diferencia</div>
                        <div class="text-h6 font-weight-bold" :class="diferenciaColor">
                          Bs. {{ diferenciaPresupuesto.toFixed(2) }}
                        </div>
                      </v-col>
                      <v-col cols="3">
                        <div class="text-caption text-medium-emphasis">Límite Actividad</div>
                        <div class="text-h6 font-weight-bold text-primary">
                          {{ formatearMonto(props.limitePresupuesto) }}
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
                      presupuesto de la tarea (Bs. {{ formData.presupuesto || '0.00' }})
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
                      Complete todos los campos (Partida, Descripción, Fuente y Monto) de los items
                      del desglose, u oculte esta sección si no desea utilizarla.
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
import { useTareasFormularios } from '../../composables/useTareasFormularios'

// Props
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  actividad: { type: Object, default: null },
  tarea: { type: Object, default: null },
  cargando: { type: Boolean, default: false },
  procedenciaFondos: { type: Array, default: () => [] },
  limitePresupuesto: { type: Number, default: 0 },
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

// Referencia para el composable
const tareaComposable = ref(null)
const cargandoDatosInterno = ref(false)

// Computed para acceder a la tarea (primero del composable, luego de la prop)
const tarea = computed(() => {
  return tareaComposable.value || props.tarea
})

// Fuentes de financiamiento desde props
const fuentesFinanciamiento = computed(() => {
  return (props.procedenciaFondos || []).map((f) => ({
    id: f.id,
    sigla: f.sigla,
    financiera: f.financiera,
  }))
})

// Helper
const formatearMonto = (monto) => {
  const valor = typeof monto === 'string' ? parseFloat(monto) : monto
  if (isNaN(valor)) return 'Bs 0.00'
  return new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
    minimumFractionDigits: 2,
  }).format(valor)
}

// Tipo de alerta según saldo
const alertaLimiteTipo = computed(() => {
  if (props.limitePresupuesto <= 0) return 'error'
  if (props.limitePresupuesto < 1000) return 'warning'
  return 'info'
})

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
  presupuestoDesglose: null,
})

// Desglose de presupuesto
const itemsDesglose = ref([{ partida: '', descripcion: '', fuente: null, monto: '' }])
const totalDesglose = ref(0)
const diferenciaPresupuesto = ref(0)

// Validaciones
const validaciones = {
  requerido: (v) => !!v || 'Este campo es requerido',
  fechaValida: (v) => {
    if (!v) return true
    return /^\d{4}-\d{2}-\d{2}$/.test(v) || 'Formato de fecha inválido'
  },
  fechaPosterior: (v) => {
    if (!v) return true
    if (!formData.value.fecha_creacion) return true
    return (
      new Date(v) >= new Date(formData.value.fecha_creacion) ||
      'La fecha de finalización debe ser posterior a la de inicio'
    )
  },
  fechaInicioAnterior: (v) => {
    if (!v) return true
    if (!formData.value.fecha_limite) return true
    return (
      new Date(v) <= new Date(formData.value.fecha_limite) ||
      'La fecha de inicio debe ser anterior a la de finalización'
    )
  },
  numeroPositivo: (v) => {
    if (v === '' || v === null || v === undefined) return true
    const valor = Number(v)
    if (isNaN(valor)) return 'Debe ser un número válido'
    if (valor < 0) return 'El valor no puede ser negativo'
    return true
  },
  noExcedeLimite: (v) => {
    if (v === '' || v === null || v === undefined) return true
    const valor = parseFloat(v) || 0
    if (valor < 0) return 'El valor no puede ser negativo'
    if (valor > props.limitePresupuesto) {
      return `Excede el saldo disponible: ${formatearMonto(props.limitePresupuesto)}`
    }
    return true
  },
}

// Validadores para el desglose
const validadoresDesglose = {
  partida: (v) => {
    if (!v || v.trim() === '') return 'La partida es requerida'
    if (v.length > 50) return 'La partida no puede exceder 50 caracteres'
    return true
  },
  descripcion: (v) => {
    if (!v || v.trim() === '') return 'La descripción es requerida'
    if (v.length > 200) return 'La descripción no puede exceder 200 caracteres'
    return true
  },
  monto: (v) => {
    if (!v && v !== 0) return 'El monto es requerido'
    const montoNum = Number(v)
    if (isNaN(montoNum)) return 'Debe ser un número válido'
    if (montoNum <= 0) return 'El monto debe ser mayor a 0'
    if (montoNum > 999999999.99) return 'El monto excede el límite permitido'
    return true
  },
}

// Computed
const isEditando = computed(() => !!props.tarea?.id)
const tituloDialog = computed(() =>
  isEditando.value ? 'Editar Subactividad' : 'Nueva Subactividad',
)
const textoBotonGuardar = computed(() => {
  if (props.cargando) return 'Guardando...'
  return isEditando.value ? 'Actualizar' : 'Crear'
})
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

const tieneItemsValidos = computed(() => {
  return itemsDesglose.value.some((item) => {
    const partidaValida = item.partida && item.partida.trim() !== ''
    const descripcionValida = item.descripcion && item.descripcion.trim() !== ''
    const fuenteValida = item.fuente !== null && item.fuente !== undefined && item.fuente.id
    const montoValido = item.monto && item.monto !== '' && Number(item.monto) > 0
    return partidaValida && descripcionValida && fuenteValida && montoValido
  })
})

const formularioValido = computed(() => {
  // Verificar que el título esté completo
  if (!formData.value.titulo || formData.value.titulo.trim() === '') {
    return false
  }

  // Validar presupuesto (puede ser 0 o positivo, no puede exceder el límite)
  const presupuesto = parseFloat(formData.value.presupuesto) || 0
  if (presupuesto < 0) {
    return false
  }

  // Si hay presupuesto asignado, no puede exceder el límite
  if (presupuesto > props.limitePresupuesto) {
    return false
  }

  // Validar fechas (solo si ambas están presentes)
  if (formData.value.fecha_creacion && formData.value.fecha_limite) {
    if (new Date(formData.value.fecha_creacion) > new Date(formData.value.fecha_limite)) {
      return false
    }
  }

  // Validar desglose: si está visible y tiene items válidos, no debe exceder el presupuesto
  if (mostrarDesglose.value && tieneItemsValidos.value) {
    if (totalDesglose.value > presupuesto) {
      return false
    }
  }

  return true
})

// Watchers
watch(
  () => props.modelValue,
  (nuevoValor) => {
    dialog.value = nuevoValor
    if (nuevoValor) inicializarFormulario()
  },
)

watch(dialog, (nuevoValor) => {
  if (nuevoValor !== props.modelValue) emit('update:modelValue', nuevoValor)
})

// Método para inicializar el composable solo cuando sea necesario
const inicializarComposableSiEsNecesario = () => {
  if (isEditando.value && props.tarea?.id) {
    // Solo inicializar el composable si estamos editando y tenemos un ID válido
    const { tarea: tareaResult, loading } = useTareasFormularios(props.tarea.id)

    // Observar cuando el composable tenga datos
    watch(
      () => tareaResult.value,
      (nuevaTarea) => {
        if (nuevaTarea) {
          tareaComposable.value = nuevaTarea
        }
      },
      { immediate: true },
    )

    // También observar el loading para referencia interna
    watch(
      () => loading.value,
      (nuevoLoading) => {
        cargandoDatosInterno.value = nuevoLoading
      },
      { immediate: true },
    )
  }
}

// Método para llenar el formulario con datos
const llenarFormularioConDatos = (datosTarea) => {
  if (!datosTarea) return

  formData.value = {
    id: datosTarea.id,
    codigo: datosTarea.codigo || '',
    titulo: datosTarea.titulo || '',
    descripcion: datosTarea.descripcion || '',
    estado: datosTarea.estado || 'PEN',
    fecha_creacion: datosTarea.fecha_creacion || '',
    fecha_limite: datosTarea.fecha_limite || '',
    presupuesto: datosTarea.presupuesto || '0.00',
  }

  // Cargar desglose si existe
  if (datosTarea.presupuestoDesglose && Array.isArray(datosTarea.presupuestoDesglose)) {
    const itemsExistentes = datosTarea.presupuestoDesglose.filter(
      (item) => item.descripcion && item.monto && item.monto !== 0,
    )
    if (itemsExistentes.length > 0) {
      itemsDesglose.value = itemsExistentes.map((item) => ({
        partida: item.partida || '',
        descripcion: item.descripcion || '',
        fuente: item.fuente || null,
        monto: item.monto ? item.monto.toString() : '',
      }))
      mostrarDesglose.value = true
    } else {
      itemsDesglose.value = [{ partida: '', descripcion: '', fuente: null, monto: '' }]
      mostrarDesglose.value = false
    }
  } else {
    itemsDesglose.value = [{ partida: '', descripcion: '', fuente: null, monto: '' }]
    mostrarDesglose.value = false
  }

  calcularTotales()

  // Forzar validación del formulario después de cargar datos
  nextTick(() => {
    if (formRef.value) {
      formRef.value.validate()
    }
  })
}

// Inicializar formulario
const inicializarFormulario = () => {
  if (isEditando.value) {
    // Para edición: inicializar composable (se ejecutará en background)
    inicializarComposableSiEsNecesario()

    // Usar inmediatamente los datos de la prop si están disponibles
    if (props.tarea) {
      llenarFormularioConDatos(props.tarea)
    }

    // Observar cambios en los datos del composable para actualizar cuando lleguen
    const stopWatcher = watch(
      () => tareaComposable.value,
      (nuevaTarea) => {
        if (nuevaTarea && nuevaTarea.id === props.tarea?.id) {
          llenarFormularioConDatos(nuevaTarea)
          stopWatcher() // Dejar de observar una vez que tengamos los datos del composable
        }
      },
    )
  } else {
    // Para nueva tarea, inicializar con valores por defecto
    const hoy = new Date()
    const fechaLimite = new Date()
    fechaLimite.setDate(fechaLimite.getDate() + 7)

    formData.value = {
      id: null,
      codigo: '',
      titulo: '',
      descripcion: '',
      estado: 'PEN',
      fecha_creacion: hoy.toISOString().split('T')[0],
      fecha_limite: fechaLimite.toISOString().split('T')[0],
      presupuesto: '0.00',
    }

    itemsDesglose.value = [{ partida: '', descripcion: '', fuente: null, monto: '' }]
    mostrarDesglose.value = false
    calcularTotales()
  }

  nextTick(() => {
    if (formRef.value) {
      formRef.value.resetValidation()
      // Validar después de reset para habilitar/deshabilitar el botón correctamente
      formRef.value.validate()
    }
  })
}

const toggleDesglose = () => {
  mostrarDesglose.value = !mostrarDesglose.value
  if (!mostrarDesglose.value) {
    itemsDesglose.value = [{ partida: '', descripcion: '', fuente: null, monto: '' }]
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
    itemsDesglose.value.push({ partida: '', descripcion: '', fuente: null, monto: '' })
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
  nextTick(() => {
    if (formRef.value) {
      formRef.value.validate()
    }
  })
}

const prepararDesgloseParaAPI = () => {
  if (!mostrarDesglose.value || !tieneItemsValidos.value) return null

  const itemsValidos = itemsDesglose.value
    .filter(
      (item) =>
        item.partida &&
        item.descripcion &&
        item.fuente &&
        item.fuente.id &&
        item.monto &&
        item.monto !== '' &&
        Number(item.monto) > 0,
    )
    .map((item) => ({
      partida: item.partida.trim(),
      descripcion: item.descripcion.trim(),
      fuente: {
        id: item.fuente.id,
        sigla: item.fuente.sigla,
        financiera: item.fuente.financiera,
      },
      monto: Number(item.monto),
    }))

  return itemsValidos.length > 0 ? itemsValidos : null
}

const guardar = async () => {
  if (!formRef.value) return

  const { valid } = await formRef.value.validate()
  if (!valid) return

  const presupuesto = parseFloat(formData.value.presupuesto) || 0
  if (presupuesto > props.limitePresupuesto) return

  const presupuestoDesglose = prepararDesgloseParaAPI()

  const datosTarea = {
    ...formData.value,
    actividad: props.actividad?.id || props.actividad?.datos?.id,
    presupuestoDesglose: presupuestoDesglose,
    presupuesto: presupuesto,
  }

  if (!datosTarea.codigo) delete datosTarea.codigo
  if (!datosTarea.fecha_creacion) delete datosTarea.fecha_creacion
  if (!datosTarea.fecha_limite) delete datosTarea.fecha_limite

  emit('guardar', datosTarea)
}

const cancelar = () => {
  emit('cancelar')
  dialog.value = false
}

watch(dialog, (nuevoValor) => {
  if (!nuevoValor) {
    nextTick(() => {
      if (formRef.value) formRef.value.reset()
    })
  }
})
</script>

<style scoped>
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
