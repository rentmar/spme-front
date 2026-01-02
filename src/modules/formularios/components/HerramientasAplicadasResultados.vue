<template>
  <v-card class="herramientas-aplicadas-resultados" elevation="2">
    <v-card-title class="d-flex justify-space-between align-center">
      <span></span>
      <v-btn color="primary" @click="agregarHerramienta" prepend-icon="mdi-plus">
        Agregar Herramienta
      </v-btn>
    </v-card-title>

    <v-card-text>
      <!-- Header de la matriz -->
      <v-row class="matriz-header font-weight-bold mb-2">
        <v-col cols="4"> Descripción herramienta aplicada </v-col>
        <v-col cols="4"> Resultados obtenidos </v-col>
        <v-col cols="3"> Evidencias adjuntas </v-col>
        <v-col cols="1"> Accion </v-col>
      </v-row>

      <!-- Filas de herramientas aplicadas -->
      <v-row
        v-for="(herramienta, index) in herramientas"
        :key="herramienta.id"
        class="mb-4 herramienta-fila"
      >
        <!-- Descripción de la herramienta aplicada -->
        <v-col cols="4">
          <v-textarea
            v-model="herramienta.descripcion"
            label="Herramienta aplicada"
            placeholder="Describa la herramienta, metodología o técnica aplicada..."
            variant="outlined"
            rows="3"
            hide-details
            @update:model-value="emitirDatosTexto"
          ></v-textarea>
        </v-col>

        <!-- Resultados obtenidos -->
        <v-col cols="4">
          <v-textarea
            v-model="herramienta.resultado"
            label="Resultados obtenidos"
            placeholder="Describa los resultados, hallazgos o impactos obtenidos..."
            variant="outlined"
            rows="3"
            hide-details
            @update:model-value="emitirDatosTexto"
          ></v-textarea>
        </v-col>

        <!-- Evidencias adjuntas -->
        <v-col cols="3">
          <div class="d-flex flex-column gap-2">
            <v-btn
              color="secondary"
              variant="outlined"
              @click="abrirSelectorArchivos(index)"
              prepend-icon="mdi-paperclip"
            >
              Documentos
            </v-btn>

            <input
              type="file"
              :ref="(el) => establecerRefArchivo(el, index)"
              multiple
              @change="manejarSeleccionArchivos($event, index)"
              class="d-none"
            />

            <!-- Información sobre tipos de archivos permitidos -->
            <v-alert type="info" density="compact" class="mt-1">
              <div class="text-caption">
                <v-icon small class="mr-1">mdi-information</v-icon>
                Se permiten todo tipo de archivos
              </div>
            </v-alert>

            <!-- Lista de evidencias adjuntas -->
            <v-list density="compact" v-if="herramienta.archivos.length > 0">
              <v-list-item
                v-for="(archivo, archivoIndex) in herramienta.archivos"
                :key="archivoIndex"
                class="px-0"
              >
                <template v-slot:prepend>
                  <v-icon :color="getFileColor(archivo)" size="small">
                    {{ getFileIcon(archivo) }}
                  </v-icon>
                </template>

                <v-list-item-title class="text-caption text-truncate">
                  {{ archivo.name }}
                </v-list-item-title>

                <v-list-item-subtitle class="text-caption">
                  {{ formatFileSize(archivo.size) }} • {{ getFileType(archivo) }}
                </v-list-item-subtitle>

                <template v-slot:append>
                  <v-btn
                    icon="mdi-close"
                    size="x-small"
                    variant="text"
                    @click="eliminarArchivo(index, archivoIndex)"
                  ></v-btn>
                </template>
              </v-list-item>
            </v-list>

            <v-alert
              v-if="herramienta.archivos.length > 0"
              type="success"
              density="compact"
              class="mt-1"
            >
              <div class="d-flex justify-space-between align-center">
                <span>{{ herramienta.archivos.length }} evidencia(s) adjunta(s)</span>
                <v-btn
                  size="x-small"
                  variant="text"
                  @click="descargarTodosArchivos(index)"
                  :disabled="herramienta.archivos.length === 0"
                >
                  Descargar todos
                </v-btn>
              </div>
            </v-alert>
          </div>
        </v-col>

        <!-- Acciones -->
        <v-col cols="1">
          <div class="d-flex flex-column gap-1">
            <v-btn
              icon="mdi-delete"
              color="error"
              variant="text"
              @click="eliminarHerramienta(index)"
              :disabled="herramientas.length === 1"
              size="small"
            ></v-btn>
            <v-tooltip location="bottom">
              <template v-slot:activator="{ props }">
                <v-btn
                  icon="mdi-information"
                  color="info"
                  variant="text"
                  size="small"
                  v-bind="props"
                ></v-btn>
              </template>
              <span>Herramienta {{ index + 1 }}</span>
            </v-tooltip>
          </div>
        </v-col>
      </v-row>

      <!-- Resumen -->
      <v-alert v-if="herramientas.length > 0" type="info" variant="tonal" class="mt-4">
        <div class="d-flex justify-space-between align-center">
          <span> Total: {{ herramientas.length }} herramienta(s) aplicada(s) </span>
          <span> Evidencias: {{ totalEvidencias }} archivo(s) adjunto(s) </span>
        </div>
      </v-alert>

      <!-- Estadísticas de archivos -->
      <v-alert v-if="estadisticasArchivos.total > 0" type="success" variant="tonal" class="mt-2">
        <div class="text-caption">
          <strong>Estadísticas de evidencias:</strong><br />
          • Total archivos: {{ estadisticasArchivos.total }}<br />
          • Tamaño total: {{ formatFileSize(estadisticasArchivos.tamañoTotal) }}<br />
          • Tipos: {{ Object.keys(estadisticasArchivos.tipos).join(', ') }}
        </div>
      </v-alert>

      <!-- BOTÓN PARA REGISTRAR INFORMACIÓN -->
      <div class="d-flex justify-end mt-6">
        <v-btn
          color="success"
          @click="registrarInformacion"
          prepend-icon="mdi-content-save"
          size="large"
          :disabled="!hayDatosParaRegistrar"
        >
          Registrar Información
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'

// Props y emits - AÑADIR EL NUEVO EVENTO
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  archivos: {
    type: Object,
    default: () => ({}),
  },
})

// AÑADIR EL EVENTO 'informacion-registrada'
const emit = defineEmits([
  'update:modelValue',
  'update:archivos',
  'cambio',
  'informacion-registrada', // Añadido aquí
])

// Estado reactivo
const herramientas = ref([])
const inputsArchivo = ref([])
const archivosLocales = ref({})

// Computed
const totalEvidencias = computed(() => {
  return Object.values(archivosLocales.value).reduce((total, archivosFila) => {
    return total + archivosFila.length
  }, 0)
})

const estadisticasArchivos = computed(() => {
  const todosArchivos = Object.values(archivosLocales.value).flat()
  const tipos = {}
  let tamañoTotal = 0

  todosArchivos.forEach((archivo) => {
    const extension = archivo.name.split('.').pop()?.toLowerCase() || 'desconocido'
    tipos[extension] = (tipos[extension] || 0) + 1
    tamañoTotal += archivo.size
  })

  return {
    total: todosArchivos.length,
    tamañoTotal,
    tipos,
  }
})

// Nuevo computed para verificar si hay datos
const hayDatosParaRegistrar = computed(() => {
  // Verificar si hay al menos una herramienta con datos
  return herramientas.value.some(
    (herramienta) =>
      herramienta.descripcion.trim() !== '' ||
      herramienta.resultado.trim() !== '' ||
      (archivosLocales.value[herramienta.id]?.length || 0) > 0,
  )
})

// Utilidades
const crearHerramientaVacia = () => ({
  id: generarId(),
  descripcion: '',
  resultado: '',
  archivos: [],
})

const generarId = () => `herramienta_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getFileExtension = (archivo) => {
  return archivo.name.split('.').pop()?.toLowerCase() || ''
}

const getFileType = (archivo) => {
  const extension = getFileExtension(archivo)
  const typeMap = {
    // Documentos
    pdf: 'PDF',
    doc: 'Word',
    docx: 'Word',
    txt: 'Texto',
    rtf: 'Texto Enriquecido',
    // Hojas de cálculo
    xls: 'Excel',
    xlsx: 'Excel',
    csv: 'CSV',
    // Presentaciones
    ppt: 'PowerPoint',
    pptx: 'PowerPoint',
    // Imágenes
    jpg: 'JPEG',
    jpeg: 'JPEG',
    png: 'PNG',
    gif: 'GIF',
    bmp: 'BMP',
    svg: 'SVG',
    // Archivos comprimidos
    zip: 'ZIP',
    rar: 'RAR',
    '7z': '7-Zip',
    tar: 'TAR',
    // Ejecutables
    exe: 'Ejecutable',
    msi: 'Instalador',
    // Programación
    js: 'JavaScript',
    html: 'HTML',
    css: 'CSS',
    json: 'JSON',
    xml: 'XML',
    // Otros
    mp3: 'Audio MP3',
    mp4: 'Video MP4',
    avi: 'Video AVI',
    mkv: 'Video MKV',
  }
  return typeMap[extension] || extension.toUpperCase() || 'Archivo'
}

const getFileIcon = (archivo) => {
  const extension = getFileExtension(archivo)
  const iconMap = {
    // Documentos
    pdf: 'mdi-file-pdf',
    doc: 'mdi-file-word',
    docx: 'mdi-file-word',
    txt: 'mdi-file-document',
    rtf: 'mdi-file-document',
    // Hojas de cálculo
    xls: 'mdi-file-excel',
    xlsx: 'mdi-file-excel',
    csv: 'mdi-file-delimited',
    // Presentaciones
    ppt: 'mdi-file-powerpoint',
    pptx: 'mdi-file-powerpoint',
    // Imágenes
    jpg: 'mdi-file-image',
    jpeg: 'mdi-file-image',
    png: 'mdi-file-image',
    gif: 'mdi-file-image',
    bmp: 'mdi-file-image',
    svg: 'mdi-file-image',
    // Archivos comprimidos
    zip: 'mdi-folder-zip',
    rar: 'mdi-folder-zip',
    '7z': 'mdi-folder-zip',
    tar: 'mdi-folder-zip',
    // Audio/Video
    mp3: 'mdi-music',
    wav: 'mdi-music',
    mp4: 'mdi-filmstrip',
    avi: 'mdi-filmstrip',
    mkv: 'mdi-filmstrip',
    // Ejecutables
    exe: 'mdi-application',
    msi: 'mdi-application',
    // Programación
    js: 'mdi-language-javascript',
    html: 'mdi-language-html5',
    css: 'mdi-language-css3',
    json: 'mdi-code-json',
    xml: 'mdi-xml',
  }
  return iconMap[extension] || 'mdi-file'
}

const getFileColor = (archivo) => {
  const extension = getFileExtension(archivo)
  const colorMap = {
    // Documentos
    pdf: 'red',
    doc: 'blue',
    docx: 'blue',
    // Hojas de cálculo
    xls: 'green',
    xlsx: 'green',
    // Presentaciones
    ppt: 'orange',
    pptx: 'orange',
    // Imágenes
    jpg: 'purple',
    jpeg: 'purple',
    png: 'purple',
    // Archivos comprimidos
    zip: 'amber',
    rar: 'amber',
    // Audio/Video
    mp3: 'pink',
    mp4: 'indigo',
  }
  return colorMap[extension] || 'grey'
}

// Métodos de herramientas
const agregarHerramienta = () => {
  const nuevaHerramienta = crearHerramientaVacia()
  herramientas.value.push(nuevaHerramienta)
  archivosLocales.value[nuevaHerramienta.id] = []
  emitirDatosCompletos()
}

const eliminarHerramienta = (index) => {
  if (herramientas.value.length > 1) {
    const herramientaId = herramientas.value[index].id
    herramientas.value.splice(index, 1)
    delete archivosLocales.value[herramientaId]
    emitirDatosCompletos()
  }
}

// Métodos de archivos
const establecerRefArchivo = (el, index) => {
  if (el) {
    inputsArchivo.value[index] = el
  }
}

const abrirSelectorArchivos = (index) => {
  if (inputsArchivo.value[index]) {
    inputsArchivo.value[index].click()
  }
}

const manejarSeleccionArchivos = (event, herramientaIndex) => {
  const archivosSeleccionados = Array.from(event.target.files)
  const herramientaId = herramientas.value[herramientaIndex].id

  if (archivosSeleccionados.length > 0) {
    // Aceptar todos los tipos de archivos sin validación de tipo

    // Actualizar archivos locales
    if (!archivosLocales.value[herramientaId]) {
      archivosLocales.value[herramientaId] = []
    }
    archivosLocales.value[herramientaId].push(...archivosSeleccionados)

    // Actualizar referencia en herramienta para mostrar en UI
    herramientas.value[herramientaIndex].archivos = [...archivosLocales.value[herramientaId]]

    emitirDatosCompletos()
    event.target.value = ''
  }
}

const eliminarArchivo = (herramientaIndex, archivoIndex) => {
  const herramientaId = herramientas.value[herramientaIndex].id
  archivosLocales.value[herramientaId].splice(archivoIndex, 1)
  herramientas.value[herramientaIndex].archivos = [...archivosLocales.value[herramientaId]]
  emitirDatosCompletos()
}

const descargarTodosArchivos = (herramientaIndex) => {
  const herramienta = herramientas.value[herramientaIndex]
  const archivos = archivosLocales.value[herramienta.id] || []

  archivos.forEach((archivo) => {
    const url = URL.createObjectURL(archivo)
    const link = document.createElement('a')
    link.href = url
    link.download = archivo.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  })
}

// NUEVO MÉTODO: Registrar Información
const registrarInformacion = () => {
  if (!hayDatosParaRegistrar.value) {
    alert(
      'No hay datos para registrar. Por favor, agregue al menos una herramienta con información.',
    )
    return
  }

  // Llamar al método existente que ya envía los datos
  emitirDatosCompletos()

  // Mostrar mensaje de confirmación
  //alert('Información registrada exitosamente y enviada al sistema.')

  // Emitir el evento específico para el registro
  emit('informacion-registrada', {
    herramientas: herramientas.value.length,
    evidencias: totalEvidencias.value,
    fecha: new Date().toISOString(),
    datosCompletos: obtenerDatosParaRegistro(), // Método auxiliar
  })
}

// Método auxiliar para obtener datos estructurados
const obtenerDatosParaRegistro = () => {
  return {
    herramientas: herramientas.value.map((herramienta) => ({
      id: herramienta.id,
      descripcion: herramienta.descripcion,
      resultado: herramienta.resultado,
      archivos:
        archivosLocales.value[herramienta.id]?.map((archivo) => ({
          nombre: archivo.name,
          tamaño: archivo.size,
          tipo: archivo.type,
        })) || [],
    })),
    resumen: {
      totalHerramientas: herramientas.value.length,
      totalEvidencias: totalEvidencias.value,
      estadisticasArchivos: estadisticasArchivos.value,
    },
  }
}

// Emisión de datos
const emitirDatosTexto = () => {
  const datosTexto = herramientas.value.map((herramienta) => ({
    id: herramienta.id,
    descripcion: herramienta.descripcion,
    resultado: herramienta.resultado,
  }))
  emit('update:modelValue', datosTexto)
}

const emitirDatosCompletos = () => {
  // Emitir datos de texto
  const datosTexto = herramientas.value.map((herramienta) => ({
    id: herramienta.id,
    descripcion: herramienta.descripcion,
    resultado: herramienta.resultado,
  }))

  // Emitir archivos (objetos File reales)
  const archivosParaEmitir = { ...archivosLocales.value }

  emit('update:modelValue', datosTexto)
  emit('update:archivos', archivosParaEmitir)
  emit('cambio', {
    herramientas: datosTexto,
    evidencias: archivosParaEmitir,
    resumen: {
      totalHerramientas: herramientas.value.length,
      totalEvidencias: totalEvidencias.value,
      estadisticasArchivos: estadisticasArchivos.value,
    },
  })
}

// Inicialización
onMounted(() => {
  if (props.modelValue && props.modelValue.length > 0) {
    herramientas.value = props.modelValue.map((item) => ({
      ...item,
      archivos: [],
    }))

    // Cargar archivos existentes si los hay
    if (props.archivos && Object.keys(props.archivos).length > 0) {
      archivosLocales.value = { ...props.archivos }
      // Sincronizar con herramientas para UI
      herramientas.value.forEach((herramienta) => {
        if (archivosLocales.value[herramienta.id]) {
          herramienta.archivos = [...archivosLocales.value[herramienta.id]]
        }
      })
    }
  } else {
    herramientas.value = [crearHerramientaVacia()]
  }
})

// Watchers
watch(
  () => props.modelValue,
  (nuevoValor) => {
    if (nuevoValor && nuevoValor.length > 0) {
      herramientas.value = nuevoValor.map((item) => ({
        ...item,
        archivos: herramientas.value.find((h) => h.id === item.id)?.archivos || [],
      }))
    }
  },
  { deep: true },
)

watch(
  () => props.archivos,
  (nuevosArchivos) => {
    if (nuevosArchivos && Object.keys(nuevosArchivos).length > 0) {
      archivosLocales.value = { ...nuevosArchivos }
      // Sincronizar con herramientas para UI
      herramientas.value.forEach((herramienta) => {
        if (archivosLocales.value[herramienta.id]) {
          herramienta.archivos = [...archivosLocales.value[herramienta.id]]
        }
      })
    }
  },
  { deep: true },
)
</script>

<style scoped>
.herramientas-aplicadas-resultados {
  margin: 20px 0;
}

.matriz-header {
  background-color: #f5f5f5;
  padding: 12px;
  border-radius: 4px;
}

.herramienta-fila {
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 16px;
}

.gap-1 {
  gap: 4px;
}

.gap-2 {
  gap: 8px;
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
