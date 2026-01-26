<template>
  <div class="contribucion-container">
    <!-- Objetivo General -->
    <div v-if="objetivogeneral" class="contribucion-section">
      <h3 class="section-title">{{ getLabel('objetivogeneral') }}</h3>
      <v-textarea
        v-model="caberaContribucion.objetivogeneral.data.contribucion"
        clearable
        variant="outlined"
        class="custom-textarea"
        rows="3"
        @update:modelValue="emitirPayloadCompleto"
        @blur="emitirPayloadCompleto('blur')"
      ></v-textarea>
      <p class="section-subtitle">Contribución al objetivo general</p>
    </div>

    <!-- Objetivo Específico Proyecto -->
    <div v-if="objetivoespecifico" class="contribucion-section">
      <h3 class="section-title">{{ getLabel('objetivoespecifico') }}</h3>
      <v-textarea
        v-model="caberaContribucion.objetivoespecifico.data.contribucion"
        clearable
        variant="outlined"
        rows="3"
        @update:modelValue="emitirPayloadCompleto"
        @blur="emitirPayloadCompleto('blur')"
      ></v-textarea>
      <p class="section-subtitle">Contribución al objetivo específico proyecto</p>
    </div>

    <!-- Objetivo Específico OG -->
    <div v-if="objetivoespecificoog" class="contribucion-section">
      <h3 class="section-title">{{ getLabel('objetivoespecificoog') }}</h3>
      <v-textarea
        v-model="caberaContribucion.objetivoespecificoog.data.contribucion"
        clearable
        variant="outlined"
        rows="3"
        @update:modelValue="emitirPayloadCompleto"
        @blur="emitirPayloadCompleto('blur')"
      ></v-textarea>
      <p class="section-subtitle">Contribución al objetivo específico OG</p>
    </div>

    <!-- Resultado OG -->
    <div v-if="resultadoog" class="contribucion-section">
      <h3 class="section-title">{{ getLabel('resultadoog') }}</h3>
      <v-textarea
        v-model="caberaContribucion.resultadoog.data.contribucion"
        clearable
        variant="outlined"
        rows="3"
        @update:modelValue="emitirPayloadCompleto"
        @blur="emitirPayloadCompleto('blur')"
      ></v-textarea>
      <p class="section-subtitle">Contribución al resultado OG</p>
    </div>

    <!-- Resultado OE -->
    <div v-if="resultadooe" class="contribucion-section">
      <h3 class="section-title">{{ getLabel('resultadooe') }}</h3>
      <v-textarea
        v-model="caberaContribucion.resultadooe.data.contribucion"
        clearable
        variant="outlined"
        rows="3"
        @update:modelValue="emitirPayloadCompleto"
        @blur="emitirPayloadCompleto('blur')"
      ></v-textarea>
      <p class="section-subtitle">Contribución al resultado OE</p>
    </div>

    <!-- Producto OE -->
    <div v-if="productooe" class="contribucion-section">
      <h3 class="section-title">{{ getLabel('productooe') }}</h3>
      <v-textarea
        v-model="caberaContribucion.productooe.data.contribucion"
        clearable
        variant="outlined"
        rows="3"
        @update:modelValue="emitirPayloadCompleto"
        @blur="emitirPayloadCompleto('blur')"
      ></v-textarea>
      <p class="section-subtitle">Contribución al producto OE</p>
    </div>

    <!-- Producto ROE -->
    <div v-if="productoroe" class="contribucion-section">
      <h3 class="section-title">{{ getLabel('productoroe') }}</h3>
      <v-textarea
        v-model="caberaContribucion.productoroe.data.contribucion"
        clearable
        variant="outlined"
        rows="3"
        @update:modelValue="emitirPayloadCompleto"
        @blur="emitirPayloadCompleto('blur')"
      ></v-textarea>
      <p class="section-subtitle">Contribución al producto ROE</p>
    </div>

    <!-- Producto -->
    <div v-if="producto" class="contribucion-section">
      <h3 class="section-title">{{ getLabel('producto') }}</h3>
      <v-textarea
        v-model="caberaContribucion.producto.data.contribucion"
        clearable
        variant="outlined"
        rows="3"
        @update:modelValue="emitirPayloadCompleto"
        @blur="emitirPayloadCompleto('blur')"
      ></v-textarea>
      <p class="section-subtitle">Contribución al producto</p>
    </div>

    <!-- Debug: Mostrar payload actual -->
    <div v-if="debugMode" class="debug-container mt-6">
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

// Función para limpiar el payload - SOLO ESTA FUNCIÓN FUE MODIFICADA
const limpiarPayload = (payloadCompleto) => {
  const payloadLimpio = {
    timestamp: payloadCompleto.timestamp,
    evento: payloadCompleto.evento,
    caberaContribucion: {},
  }

  // Solo incluir campos que tengan datos válidos
  Object.keys(payloadCompleto.caberaContribucion).forEach((key) => {
    const campo = payloadCompleto.caberaContribucion[key]
    const data = campo.data

    // Verificar si el campo tiene datos mínimos válidos
    const tieneDatosValidos =
      data &&
      ((data.id && data.id !== '') ||
        (data.codigo && data.codigo !== '') ||
        (data.descripcion && data.descripcion !== '') ||
        (data.contribucion && data.contribucion.trim() !== ''))

    if (tieneDatosValidos) {
      payloadLimpio.caberaContribucion[key] = {
        tipo: campo.tipo,
        data: { ...data },
      }

      // Limpiar campos vacíos en data
      Object.keys(payloadLimpio.caberaContribucion[key].data).forEach((dataKey) => {
        if (
          payloadLimpio.caberaContribucion[key].data[dataKey] === '' ||
          payloadLimpio.caberaContribucion[key].data[dataKey] === null
        ) {
          delete payloadLimpio.caberaContribucion[key].data[dataKey]
        }
      })
    }
  })

  return payloadLimpio
}

// Función para emitir el payload completo
const emitirPayloadCompleto = (evento = 'input') => {
  const payloadCompleto = {
    timestamp: new Date().toISOString(),
    evento: evento,
    caberaContribucion: { ...caberaContribucion },
  }
  // Limpiar el payload antes de emitirlo
  const payloadLimpio = limpiarPayload(payloadCompleto)

  // Emitir el payload completo
  emit('payload-actualizado', payloadLimpio)

  // Guardar último payload para debug
  if (props.debugMode) {
    lastPayload.value = payloadLimpio
  }

  console.log('Payload emitido:', payloadLimpio)
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

<style scoped>
.contribucion-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.contribucion-section {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  background-color: #fafafa;
  transition: all 0.3s ease;
}

.contribucion-section:hover {
  border-color: #1976d2;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.1);
}

.section-title {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
}

.section-subtitle {
  margin: 8px 0 0 0;
  font-size: 13px;
  color: #666;
  font-style: italic;
}

.custom-textarea {
  margin-top: 8px;
}

.debug-container {
  border: 1px dashed #ccc;
  padding: 16px;
  border-radius: 4px;
  background-color: #f8f9fa;
}

.debug-container h4 {
  margin-top: 0;
  color: #666;
}

.debug-container pre {
  margin: 8px 0 0 0;
  padding: 12px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: auto;
  font-size: 12px;
  line-height: 1.4;
}
</style>
