<template>
  <div>
    <!-- Objetivo General -->
    <label v-if="objetivogeneral">{{ getLabel('objetivogeneral') }}</label>
    <v-textarea
      v-if="objetivogeneral"
      v-model="caberaContribucion.objetivogeneral.data.contribucion"
      hint="Contribución al objetivo general"
      clearable
      variant="outlined"
      class="custom-textarea"
      @update:modelValue="emitirPayloadCompleto"
      @blur="emitirPayloadCompleto('blur')"
    ></v-textarea>

    <!-- Objetivo Específico Proyecto -->
    <label v-if="objetivoespecifico">{{ getLabel('objetivoespecifico') }}</label>
    <v-textarea
      v-if="objetivoespecifico"
      v-model="caberaContribucion.objetivoespecifico.data.contribucion"
      hint="Contribución al objetivo específico proyecto"
      clearable
      variant="outlined"
      @update:modelValue="emitirPayloadCompleto"
      @blur="emitirPayloadCompleto('blur')"
    ></v-textarea>

    <!-- Objetivo Específico OG -->
    <label v-if="objetivoespecificoog">{{ getLabel('objetivoespecificoog') }}</label>
    <v-textarea
      v-if="objetivoespecificoog"
      v-model="caberaContribucion.objetivoespecificoog.data.contribucion"
      hint="Contribución al objetivo específico OG"
      clearable
      variant="outlined"
      @update:modelValue="emitirPayloadCompleto"
      @blur="emitirPayloadCompleto('blur')"
    ></v-textarea>

    <!-- Resultado OG -->
    <label v-if="resultadoog">{{ getLabel('resultadoog') }}</label>
    <v-textarea
      v-if="resultadoog"
      v-model="caberaContribucion.resultadoog.data.contribucion"
      :label="getLabel('resultadoog')"
      hint="Contribución al resultado OG"
      clearable
      variant="outlined"
      @update:modelValue="emitirPayloadCompleto"
      @blur="emitirPayloadCompleto('blur')"
    ></v-textarea>

    <!-- Resultado OE -->
    <label v-if="resultadooe"> {{ getLabel('resultadooe') }} </label>
    <v-textarea
      v-if="resultadooe"
      v-model="caberaContribucion.resultadooe.data.contribucion"
      hint="Contribución al resultado OE"
      clearable
      variant="outlined"
      @update:modelValue="emitirPayloadCompleto"
      @blur="emitirPayloadCompleto('blur')"
    ></v-textarea>

    <!-- Producto OE -->
    <label v-if="productooe"> {{ getLabel('productooe') }} </label>
    <v-textarea
      v-if="productooe"
      v-model="caberaContribucion.productooe.data.contribucion"
      hint="Contribución al producto OE"
      clearable
      variant="outlined"
      @update:modelValue="emitirPayloadCompleto"
      @blur="emitirPayloadCompleto('blur')"
    ></v-textarea>

    <!-- Producto ROE -->
    <label v-if="productoroe">{{ getLabel('productoroe') }}</label>
    <v-textarea
      v-if="productoroe"
      v-model="caberaContribucion.productoroe.data.contribucion"
      hint="Contribución al producto ROE"
      clearable
      variant="outlined"
      @update:modelValue="emitirPayloadCompleto"
      @blur="emitirPayloadCompleto('blur')"
    ></v-textarea>

    <!-- Producto -->
    <label v-if="producto">{{ getLabel('producto') }}</label>
    <v-textarea
      v-if="producto"
      v-model="caberaContribucion.producto.data.contribucion"
      hint="Contribución al producto"
      clearable
      variant="outlined"
      @update:modelValue="emitirPayloadCompleto"
      @blur="emitirPayloadCompleto('blur')"
    ></v-textarea>

    <!-- Debug: Mostrar payload actual -->
    <div v-if="debugMode" class="debug-container">
      <h4>Último Payload Emitido:</h4>
      <pre>{{ JSON.stringify(lastPayload, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'

// Props del componente
const props = defineProps({
  datosEstructura: { type: Object, required: true },
  debugMode: { type: Boolean, default: false },
})

// Estado principal - Estructura única del payload
const caberaContribucion = reactive({
  objetivogeneral: {
    tipo: 'objetivogeneral',
    data: {
      id: '',
      codigo: '',
      descripcion: '',
      supuestos: '',
      riesgos: '',
      contribucion: '',
      proyecto: '',
    },
  },
  objetivoespecifico: {
    tipo: 'objetivoespecifico',
    data: {
      id: '',
      codigo: '',
      descripcion: '',
      supuestos: '',
      riesgos: '',
      contribucion: '',
      objetivo_general: '',
    },
  },
  objetivoespecificoog: {
    tipo: 'objetivoespecificoog',
    data: {
      id: '',
      codigo: '',
      descripcion: '',
      supuestos: '',
      riesgos: '',
      contribucion: '',
      objetivo_general: '',
    },
  },
  resultadoog: {
    tipo: 'resultadoog',
    data: {
      id: '',
      codigo: '',
      descripcion: '',
      supuestos: '',
      riesgos: '',
      contribucion: '',
      objetivo_general: '',
    },
  },
  resultadooe: {
    tipo: 'resultadooe',
    data: {
      id: '',
      codigo: '',
      descripcion: '',
      supuestos: '',
      riesgos: '',
      contribucion: '',
      objetivo_especifico: '',
    },
  },
  productooe: {
    tipo: 'productooe',
    data: {
      id: '',
      codigo: '',
      descripcion: '',
      supuestos: '',
      riesgos: '',
      contribucion: '',
      entregado: false,
      objetivo_especifico: '',
    },
  },
  productoroe: {
    tipo: 'productoroe',
    data: {
      id: '',
      codigo: '',
      descripcion: '',
      supuestos: '',
      riesgos: '',
      contribucion: '',
      entregado: false,
      resultado_obj_especifico: '',
    },
  },
  producto: {
    tipo: 'producto',
    data: {
      id: '',
      codigo: '',
      descripcion: '',
      supuestos: '',
      riesgos: '',
      contribucion: '',
      entregado: false,
    },
  },
})

// Referencias para controlar la visibilidad de los textareas
const objetivogeneral = ref(false)
const objetivoespecifico = ref(false)
const objetivoespecificoog = ref(false)
const resultadoog = ref(false)
const resultadooe = ref(false)
const productooe = ref(false)
const productoroe = ref(false)
const producto = ref(false)

// Para almacenar el último payload emitido (solo debug)
const lastPayload = ref(null)

// Emit para enviar the payload al componente padre
const emit = defineEmits(['payload-actualizado'])

// Función para generar labels dinámicos
const getLabel = (tipo) => {
  const data = caberaContribucion[tipo]?.data
  if (!data) return tipo

  // Si tiene código y descripción
  if (data.codigo && data.descripcion) {
    return `${data.codigo} - ${data.descripcion}`
  }

  // Si solo tiene código
  if (data.codigo) {
    return data.codigo
  }

  // Si solo tiene descripción
  if (data.descripcion) {
    return data.descripcion
  }

  // Fallback al nombre del tipo
  const tipoNames = {
    objetivogeneral: 'Objetivo General',
    objetivoespecifico: 'Objetivo Específico',
    objetivoespecificoog: 'Objetivo Específico OG',
    resultadoog: 'Resultado OG',
    resultadooe: 'Resultado OE',
    productooe: 'Producto OE',
    productoroe: 'Producto ROE',
    producto: 'Producto',
  }

  return tipoNames[tipo] || tipo
}

// Función para emitir el payload completo
const emitirPayloadCompleto = (evento = 'input') => {
  const payload = {
    timestamp: new Date().toISOString(),
    evento: evento,
    caberaContribucion: { ...caberaContribucion },
  }

  // Emitir el payload completo
  emit('payload-actualizado', payload)

  // Guardar último payload para debug
  if (props.debugMode) {
    lastPayload.value = payload
  }

  console.log('Payload emitido:', payload)
}

// Función para inicializar los datos desde la estructura de procedencia
const inicializarDesdeProcedencia = (datos) => {
  if (!datos?.datosProcedencia) return

  const procedencia = datos.datosProcedencia

  // Inicializar cada campo si existe en los datos de procedencia
  if (procedencia.objetivogeneral) {
    objetivogeneral.value = true
    const data = procedencia.objetivogeneral.data
    caberaContribucion.objetivogeneral.data = {
      id: data.id || '',
      codigo: data.codigo || '',
      descripcion: data.descripcion || '',
      supuestos: data.supuestos || '',
      riesgos: data.riesgos || '',
      contribucion: data.contribucion || '',
      proyecto: data.proyecto || '',
    }
  }

  if (procedencia.objetivoespecifico) {
    objetivoespecifico.value = true
    const data = procedencia.objetivoespecifico.data
    caberaContribucion.objetivoespecifico.data = {
      id: data.id || '',
      codigo: data.codigo || '',
      descripcion: data.descripcion || '',
      supuestos: data.supuestos || '',
      riesgos: data.riesgos || '',
      contribucion: data.contribucion || '',
      objetivo_general: data.objetivo_general || '',
    }
  }

  if (procedencia.objetivoespecificoog) {
    objetivoespecificoog.value = true
    const data = procedencia.objetivoespecificoog.data
    caberaContribucion.objetivoespecificoog.data = {
      id: data.id || '',
      codigo: data.codigo || '',
      descripcion: data.descripcion || '',
      supuestos: data.supuestos || '',
      riesgos: data.riesgos || '',
      contribucion: data.contribucion || '',
      objetivo_general: data.objetivo_general || '',
    }
  }

  if (procedencia.resultadoog) {
    resultadoog.value = true
    const data = procedencia.resultadoog.data
    caberaContribucion.resultadoog.data = {
      id: data.id || '',
      codigo: data.codigo || '',
      descripcion: data.descripcion || '',
      supuestos: data.supuestos || '',
      riesgos: data.riesgos || '',
      contribucion: data.contribucion || '',
      objetivo_general: data.objetivo_general || '',
    }
  }

  if (procedencia.resultadooe) {
    resultadooe.value = true
    const data = procedencia.resultadooe.data
    caberaContribucion.resultadooe.data = {
      id: data.id || '',
      codigo: data.codigo || '',
      descripcion: data.descripcion || '',
      supuestos: data.supuestos || '',
      riesgos: data.riesgos || '',
      contribucion: data.contribucion || '',
      objetivo_especifico: data.objetivo_especifico || '',
    }
  }

  if (procedencia.productooe) {
    productooe.value = true
    const data = procedencia.productooe.data
    caberaContribucion.productooe.data = {
      id: data.id || '',
      codigo: data.codigo || '',
      descripcion: data.descripcion || '',
      supuestos: data.supuestos || '',
      riesgos: data.riesgos || '',
      contribucion: data.contribucion || '',
      entregado: data.entregado || false,
      objetivo_especifico: data.objetivo_especifico || '',
    }
  }

  if (procedencia.productoroe) {
    productoroe.value = true
    const data = procedencia.productoroe.data
    caberaContribucion.productoroe.data = {
      id: data.id || '',
      codigo: data.codigo || '',
      descripcion: data.descripcion || '',
      supuestos: data.supuestos || '',
      riesgos: data.riesgos || '',
      contribucion: data.contribucion || '',
      entregado: data.entregado || false,
      resultado_obj_especifico: data.resultado_obj_especifico || '',
    }
  }

  if (procedencia.producto) {
    producto.value = true
    const data = procedencia.producto.data
    caberaContribucion.producto.data = {
      id: data.id || '',
      codigo: data.codigo || '',
      descripcion: data.descripcion || '',
      supuestos: data.supuestos || '',
      riesgos: data.riesgos || '',
      contribucion: data.contribucion || '',
      entregado: data.entregado || false,
    }
  }

  // Emitir el estado inicial después de cargar los datos
  setTimeout(() => {
    emitirPayloadCompleto('load')
  }, 100)
}

// Watcher para cambios en los datos de entrada
watch(
  () => props.datosEstructura,
  (newData) => {
    if (newData) {
      inicializarDesdeProcedencia(newData)
    }
  },
  { immediate: true, deep: true },
)

// Cargar la información del componente
onMounted(() => {
  if (props.datosEstructura) {
    inicializarDesdeProcedencia(props.datosEstructura)
  }
})

// También emitir cuando el componente se monta (por si acaso)
onMounted(() => {
  emitirPayloadCompleto('mounted')
})
</script>

<style scoped></style>
