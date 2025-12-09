<template>
  <div class="informacion-cuantitativa">
    <h3 class="text-h6 mb-4">
      <v-icon icon="mdi-chart-bar" class="mr-2"></v-icon>
      Información Cuantitativa
    </h3>

    <!-- Número de Participantes -->
    <div class="mb-6">
      <v-text-field
        v-model="totalParticipantes"
        label="Total de Participantes"
        type="number"
        min="0"
        variant="outlined"
        @update:model-value="actualizarTotales"
      ></v-text-field>
    </div>

    <!-- División por Género -->
    <div class="mb-6">
      <h4 class="text-subtitle-1 mb-3">
        <v-icon icon="mdi-gender-male-female" class="mr-2"></v-icon>
        División por Género
      </h4>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="varones"
            label="Varones"
            type="number"
            min="0"
            variant="outlined"
            @update:model-value="actualizarTotales"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="mujeres"
            label="Mujeres"
            type="number"
            min="0"
            variant="outlined"
            @update:model-value="actualizarTotales"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-alert v-if="errorGenero" type="error" density="compact" class="mt-1">
        <v-icon icon="mdi-alert-circle" class="mr-1"></v-icon>
        La suma de varones y mujeres ({{ sumaGenero }}) no coincide con el total de participantes
        ({{ totalParticipantes }})
      </v-alert>
    </div>

    <!-- Participantes por Edades -->
    <div class="mb-6">
      <h4 class="text-subtitle-1 mb-3">
        <v-icon icon="mdi-account-group" class="mr-2"></v-icon>
        Participantes por Edades
      </h4>
      <v-row>
        <v-col v-for="(grupo, index) in gruposEdad" :key="index" cols="12" sm="6" md="4">
          <v-text-field
            v-model="grupoEdadValues[grupo.key]"
            :label="grupo.label"
            type="number"
            min="0"
            variant="outlined"
            @update:model-value="actualizarTotales"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-alert v-if="errorEdades" type="error" density="compact" class="mt-1">
        <v-icon icon="mdi-alert-circle" class="mr-1"></v-icon>
        La suma de participantes por edades ({{ sumaEdades }}) no coincide con el total de
        participantes ({{ totalParticipantes }})
      </v-alert>
    </div>

    <!-- Ocupación -->
    <div class="mb-6">
      <h4 class="text-subtitle-1 mb-3">
        <v-icon icon="mdi-briefcase" class="mr-2"></v-icon>
        Ocupación
      </h4>
      <div v-for="(ocupacion, index) in ocupaciones" :key="index" class="mb-3">
        <v-row>
          <v-col cols="12" sm="8">
            <v-text-field
              v-model="ocupacion.nombre"
              :label="`Ocupación ${index + 1}`"
              variant="outlined"
              placeholder="Ej: Estudiantes, Trabajadores, etc."
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="3">
            <v-text-field
              v-model="ocupacion.cantidad"
              label="Cantidad"
              type="number"
              min="0"
              variant="outlined"
              @update:model-value="actualizarTotales"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="1" class="d-flex align-center">
            <v-btn
              v-if="ocupaciones.length > 1"
              variant="text"
              color="error"
              size="small"
              @click="eliminarOcupacion(index)"
            >
              <v-icon icon="mdi-delete"></v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </div>
      <v-btn color="primary" variant="outlined" @click="agregarOcupacion" size="small">
        <v-icon icon="mdi-plus" class="mr-1"></v-icon>
        Agregar Ocupación
      </v-btn>
      <v-alert v-if="errorOcupaciones" type="error" density="compact" class="mt-2">
        <v-icon icon="mdi-alert-circle" class="mr-1"></v-icon>
        La suma de ocupaciones ({{ sumaOcupaciones }}) no coincide con el total de participantes ({{
          totalParticipantes
        }})
      </v-alert>
    </div>

    <!-- Localidades -->
    <div class="mb-6">
      <h4 class="text-subtitle-1 mb-3">
        <v-icon icon="mdi-map-marker" class="mr-2"></v-icon>
        Localidades
      </h4>
      <div class="mb-2">
        <v-alert v-if="errorLocalidades" type="error" density="compact">
          <v-icon icon="mdi-alert-circle" class="mr-1"></v-icon>
          La suma de participantes por localidad ({{ sumaLocalidades }}) no coincide con el total de
          participantes ({{ totalParticipantes }})
        </v-alert>
      </div>
      <div
        v-for="(localidad, index) in localidades"
        :key="index"
        class="mb-4 pa-3"
        style="border: 1px solid #e0e0e0; border-radius: 8px"
      >
        <v-row>
          <v-col cols="12" sm="3">
            <v-text-field
              v-model="localidad.departamento"
              :label="`Departamento ${index + 1}`"
              variant="outlined"
              placeholder="Nombre del departamento"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="3">
            <v-text-field
              v-model="localidad.municipio"
              :label="`Municipio ${index + 1}`"
              variant="outlined"
              placeholder="Nombre del municipio"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="3">
            <v-text-field
              v-model="localidad.localidad"
              :label="`Localidad ${index + 1}`"
              variant="outlined"
              placeholder="Nombre de la localidad"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="2">
            <v-text-field
              v-model="localidad.cantidad"
              :label="`Cantidad ${index + 1}`"
              type="number"
              min="0"
              variant="outlined"
              @update:model-value="actualizarTotales"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="1" class="d-flex align-center">
            <v-btn
              v-if="localidades.length > 1"
              variant="text"
              color="error"
              size="small"
              @click="eliminarLocalidad(index)"
            >
              <v-icon icon="mdi-delete"></v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </div>
      <v-btn color="primary" variant="outlined" @click="agregarLocalidad" size="small">
        <v-icon icon="mdi-plus" class="mr-1"></v-icon>
        Agregar Localidad
      </v-btn>
    </div>

    <!-- Organizaciones -->
    <div class="mb-6">
      <h4 class="text-subtitle-1 mb-3">
        <v-icon icon="mdi-office-building" class="mr-2"></v-icon>
        Organizaciones Participantes
      </h4>
      <div v-for="(organizacion, index) in organizaciones" :key="index" class="mb-2">
        <v-row>
          <v-col cols="12" sm="8">
            <v-text-field
              v-model="organizaciones[index]"
              :label="`Organización ${index + 1}`"
              variant="outlined"
              placeholder="Nombre de la organización"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="3">
            <v-text-field
              v-model="organizacionCantidades[index]"
              :label="`Cantidad ${index + 1}`"
              type="number"
              min="0"
              variant="outlined"
              @update:model-value="actualizarTotales"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="1" class="d-flex align-center">
            <v-btn
              v-if="organizaciones.length > 1"
              variant="text"
              color="error"
              size="small"
              @click="eliminarOrganizacion(index)"
            >
              <v-icon icon="mdi-delete"></v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </div>
      <v-btn color="primary" variant="outlined" @click="agregarOrganizacion" size="small">
        <v-icon icon="mdi-plus" class="mr-1"></v-icon>
        Agregar Organización
      </v-btn>
      <v-alert v-if="errorOrganizaciones" type="error" density="compact" class="mt-2">
        <v-icon icon="mdi-alert-circle" class="mr-1"></v-icon>
        La suma de participantes por organización ({{ sumaOrganizaciones }}) no coincide con el
        total de participantes ({{ totalParticipantes }})
      </v-alert>
    </div>

    <!-- Resumen de Totales -->
    <div class="mb-6" v-if="mostrarResumen">
      <v-alert :type="totalesCoinciden ? 'success' : 'warning'" density="compact">
        <v-icon :icon="totalesCoinciden ? 'mdi-check-circle' : 'mdi-alert'" class="mr-2"></v-icon>
        <div class="d-flex justify-space-between align-center">
          <span>Resumen de totales:</span>
          <strong>{{ totalParticipantes }} participantes</strong>
        </div>
        <div class="mt-2">
          <v-row dense>
            <v-col cols="12" sm="6" md="3" class="d-flex align-center mb-1">
              <v-icon icon="mdi-gender-male-female" size="small" class="mr-2 text-primary"></v-icon>
              <span class="text-caption">Género:</span>
              <v-chip
                :color="errorGenero ? 'error' : 'default'"
                variant="outlined"
                size="small"
                class="ml-2"
              >
                {{ sumaGenero }}
              </v-chip>
            </v-col>
            <v-col cols="12" sm="6" md="3" class="d-flex align-center mb-1">
              <v-icon icon="mdi-account-group" size="small" class="mr-2 text-primary"></v-icon>
              <span class="text-caption">Edades:</span>
              <v-chip
                :color="errorEdades ? 'error' : 'default'"
                variant="outlined"
                size="small"
                class="ml-2"
              >
                {{ sumaEdades }}
              </v-chip>
            </v-col>
            <v-col cols="12" sm="6" md="3" class="d-flex align-center mb-1">
              <v-icon icon="mdi-briefcase" size="small" class="mr-2 text-primary"></v-icon>
              <span class="text-caption">Ocupaciones:</span>
              <v-chip
                :color="errorOcupaciones ? 'error' : 'default'"
                variant="outlined"
                size="small"
                class="ml-2"
              >
                {{ sumaOcupaciones }}
              </v-chip>
            </v-col>
            <v-col cols="12" sm="6" md="3" class="d-flex align-center mb-1">
              <v-icon icon="mdi-map-marker" size="small" class="mr-2 text-primary"></v-icon>
              <span class="text-caption">Localidades:</span>
              <v-chip
                :color="errorLocalidades ? 'error' : 'default'"
                variant="outlined"
                size="small"
                class="ml-2"
              >
                {{ sumaLocalidades }}
              </v-chip>
            </v-col>
            <v-col cols="12" sm="6" md="3" class="d-flex align-center mb-1">
              <v-icon icon="mdi-office-building" size="small" class="mr-2 text-primary"></v-icon>
              <span class="text-caption">Organizaciones:</span>
              <v-chip
                :color="errorOrganizaciones ? 'error' : 'default'"
                variant="outlined"
                size="small"
                class="ml-2"
              >
                {{ sumaOrganizaciones }}
              </v-chip>
            </v-col>
          </v-row>
        </div>
        <div v-if="!totalesCoinciden" class="mt-2 text-caption">
          <v-icon icon="mdi-information" size="small" class="mr-1"></v-icon>
          Los totales parciales no coinciden con el total general
        </div>
      </v-alert>

      <!-- Resumen Detallado de Organizaciones -->
      <v-card variant="outlined" class="mt-4">
        <v-card-title class="text-subtitle-1 bg-grey-lighten-4">
          <v-icon icon="mdi-office-building-multiple" class="mr-2"></v-icon>
          Resumen de Organizaciones Participantes
        </v-card-title>
        <v-card-text>
          <v-list density="compact" v-if="organizacionesConCantidad.length > 0">
            <v-list-item
              v-for="(org, index) in organizacionesConCantidad"
              :key="index"
              class="mb-1"
            >
              <template v-slot:prepend>
                <v-avatar color="primary" size="32" class="mr-3">
                  <span class="text-caption text-white">{{ index + 1 }}</span>
                </v-avatar>
              </template>

              <v-list-item-title class="font-weight-medium">
                {{ org.nombre || `Organización ${index + 1}` }}
              </v-list-item-title>
              <v-list-item-subtitle class="text-caption">
                <v-icon icon="mdi-account-group" size="small" class="mr-1"></v-icon>
                {{ org.cantidad }} participantes
                <span class="ml-2 text-medium-emphasis">
                  ({{ calcularPorcentaje(org.cantidad) }}% del total)
                </span>
              </v-list-item-subtitle>

              <template v-slot:append>
                <v-chip size="small" color="default" variant="outlined">
                  {{ org.cantidad }}
                </v-chip>
              </template>
            </v-list-item>
          </v-list>

          <div v-else class="text-center pa-4">
            <v-icon
              icon="mdi-office-building-outline"
              size="48"
              color="grey-lighten-2"
              class="mb-2"
            ></v-icon>
            <div class="text-body-2 text-grey">No hay organizaciones registradas</div>
          </div>

          <!-- Estadísticas de organizaciones -->
          <v-divider class="my-3"></v-divider>
          <v-row dense class="text-caption">
            <v-col cols="12" sm="6" md="3" class="d-flex align-center mb-1">
              <v-icon icon="mdi-counter" size="small" class="mr-2 text-primary"></v-icon>
              <span>Total organizaciones:</span>
              <strong class="ml-2">{{ organizacionesConCantidad.length }}</strong>
            </v-col>
            <v-col cols="12" sm="6" md="3" class="d-flex align-center mb-1">
              <v-icon icon="mdi-account-multiple" size="small" class="mr-2 text-primary"></v-icon>
              <span>Participantes total:</span>
              <strong class="ml-2">{{ sumaOrganizaciones }}</strong>
            </v-col>
            <v-col cols="12" sm="6" md="3" class="d-flex align-center mb-1">
              <v-icon icon="mdi-chart-line" size="small" class="mr-2 text-primary"></v-icon>
              <span>Promedio por org:</span>
              <strong class="ml-2">{{ promedioPorOrganizacion }}</strong>
            </v-col>
            <v-col cols="12" sm="6" md="3" class="d-flex align-center mb-1">
              <v-icon
                icon="mdi-check-circle"
                size="small"
                class="mr-2"
                :color="errorOrganizaciones ? 'error' : 'success'"
              ></v-icon>
              <span>Estado:</span>
              <strong class="ml-2" :class="errorOrganizaciones ? 'text-error' : 'text-success'">
                {{ errorOrganizaciones ? 'Inconsistente' : 'Consistente' }}
              </strong>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </div>

    <!-- Upload de Archivos -->
    <div class="mb-4">
      <h4 class="text-subtitle-1 mb-3">
        <v-icon icon="mdi-paperclip" class="mr-2"></v-icon>
        Documentos Adjuntos
      </h4>

      <!-- Input principal para agregar archivos -->
      <div class="mb-4">
        <v-file-input
          v-model="nuevoArchivo"
          label="Agregar archivos"
          variant="outlined"
          multiple
          chips
          clearable
          counter
          :show-size="1000"
          accept="*/*"
          :hint="`Seleccione uno o más archivos de cualquier tipo`"
          persistent-hint
          @update:model-value="agregarArchivos"
        >
          <template v-slot:selection="{ fileNames }">
            <div class="d-flex flex-wrap gap-2 mt-2">
              <v-chip
                v-for="(fileName, index) in fileNames"
                :key="index"
                size="small"
                color="primary"
                variant="outlined"
                closable
                @click:close="removerArchivoSeleccionado(index)"
              >
                <v-icon icon="mdi-file" size="small" class="mr-1"></v-icon>
                {{ fileName }}
              </v-chip>
            </div>
          </template>
        </v-file-input>
      </div>

      <!-- Lista de archivos existentes -->
      <div v-if="archivos.length > 0" class="mt-3">
        <v-card variant="outlined">
          <v-card-title class="text-subtitle-1 bg-grey-lighten-4">
            <v-icon icon="mdi-file-document-multiple" class="mr-2"></v-icon>
            Archivos adjuntos ({{ archivos.length }})
          </v-card-title>
          <v-card-text>
            <v-list density="compact">
              <v-list-item v-for="(archivo, index) in archivos" :key="index" class="mb-2">
                <template v-slot:prepend>
                  <v-avatar color="primary" size="40" class="mr-3">
                    <v-icon icon="mdi-file" color="white"></v-icon>
                  </v-avatar>
                </template>

                <v-list-item-title class="font-weight-medium">
                  {{ archivo.name }}
                </v-list-item-title>
                <v-list-item-subtitle class="text-caption">
                  <v-icon icon="mdi-weight" size="small" class="mr-1"></v-icon>
                  {{ formatFileSize(archivo.size) }} •
                  <v-icon icon="mdi-form-select" size="small" class="mr-1 ml-2"></v-icon>
                  {{ archivo.type || 'Tipo desconocido' }} •
                  <v-icon icon="mdi-calendar" size="small" class="mr-1 ml-2"></v-icon>
                  {{ formatDate(archivo.lastModified) }}
                </v-list-item-subtitle>

                <template v-slot:append>
                  <v-btn
                    icon
                    size="small"
                    variant="text"
                    color="error"
                    @click="eliminarArchivo(index)"
                  >
                    <v-icon icon="mdi-trash-can"></v-icon>
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>

            <!-- Resumen total -->
            <v-divider class="my-3"></v-divider>
            <div
              class="d-flex justify-space-between align-center text-caption text-medium-emphasis"
            >
              <div>
                <v-icon icon="mdi-file-multiple" size="small" class="mr-1"></v-icon>
                Total: {{ archivos.length }} archivo(s)
              </div>
              <div>
                <v-icon icon="mdi-harddisk" size="small" class="mr-1"></v-icon>
                Tamaño total: {{ formatFileSize(tamañoTotalArchivos) }}
              </div>
            </div>
          </v-card-text>
        </v-card>
      </div>

      <!-- Estado cuando no hay archivos -->
      <div v-else class="text-center pa-6 border rounded">
        <v-icon icon="mdi-folder-open" size="48" color="grey-lighten-1" class="mb-2"></v-icon>
        <div class="text-body-2 text-grey">No hay archivos adjuntos</div>
        <div class="text-caption text-grey">Use el botón superior para agregar documentos</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

// Datos reactivos
const totalParticipantes = ref(0)
const varones = ref(0)
const mujeres = ref(0)
const archivos = ref([])
const nuevoArchivo = ref([])

// Grupos de edad
const gruposEdad = [
  { key: 'edad_0_11', label: '0-11 años' },
  { key: 'edad_12_17', label: '12-17 años' },
  { key: 'edad_18_29', label: '18-29 años' },
  { key: 'edad_30_59', label: '30-59 años' },
  { key: 'edad_60_adelante', label: '60 años en adelante' },
]

// Valores de grupos de edad
const grupoEdadValues = reactive({
  edad_0_11: 0,
  edad_12_17: 0,
  edad_18_29: 0,
  edad_30_59: 0,
  edad_60_adelante: 0,
})

// Ocupaciones
const ocupaciones = ref([{ nombre: '', cantidad: 0 }])

// Localidades
const localidades = ref([
  {
    departamento: '',
    municipio: '',
    localidad: '',
    cantidad: 0,
  },
])

// Organizaciones (ahora con cantidades)
const organizaciones = ref([''])
const organizacionCantidades = ref([0])

// Computed properties para los totales
const sumaGenero = computed(() => {
  return parseInt(varones.value || 0) + parseInt(mujeres.value || 0)
})

const sumaEdades = computed(() => {
  return Object.values(grupoEdadValues).reduce((sum, value) => {
    return sum + parseInt(value || 0)
  }, 0)
})

const sumaOcupaciones = computed(() => {
  return ocupaciones.value.reduce((sum, ocupacion) => {
    return sum + parseInt(ocupacion.cantidad || 0)
  }, 0)
})

const sumaLocalidades = computed(() => {
  return localidades.value.reduce((sum, localidad) => {
    return sum + parseInt(localidad.cantidad || 0)
  }, 0)
})

const sumaOrganizaciones = computed(() => {
  return organizacionCantidades.value.reduce((sum, cantidad) => {
    return sum + parseInt(cantidad || 0)
  }, 0)
})

// Computed para organizaciones con datos combinados
const organizacionesConCantidad = computed(() => {
  return organizaciones.value
    .map((nombre, index) => ({
      nombre: nombre,
      cantidad: parseInt(organizacionCantidades.value[index] || 0),
    }))
    .filter((org) => org.nombre || org.cantidad > 0)
})

// Estadísticas de organizaciones
const promedioPorOrganizacion = computed(() => {
  const orgsConDatos = organizacionesConCantidad.value
  if (orgsConDatos.length === 0) return 0
  return Math.round(sumaOrganizaciones.value / orgsConDatos.length)
})

// Computed para tamaño total de archivos
const tamañoTotalArchivos = computed(() => {
  return archivos.value.reduce((total, archivo) => {
    return total + (archivo.size || 0)
  }, 0)
})

// Estados de error
const errorGenero = computed(() => {
  return sumaGenero.value !== parseInt(totalParticipantes.value || 0)
})

const errorEdades = computed(() => {
  return sumaEdades.value !== parseInt(totalParticipantes.value || 0)
})

const errorOcupaciones = computed(() => {
  return sumaOcupaciones.value !== parseInt(totalParticipantes.value || 0)
})

const errorLocalidades = computed(() => {
  return sumaLocalidades.value !== parseInt(totalParticipantes.value || 0)
})

const errorOrganizaciones = computed(() => {
  return sumaOrganizaciones.value !== parseInt(totalParticipantes.value || 0)
})

const totalesCoinciden = computed(() => {
  const total = parseInt(totalParticipantes.value || 0)
  return (
    sumaGenero.value === total &&
    sumaEdades.value === total &&
    sumaOcupaciones.value === total &&
    sumaLocalidades.value === total &&
    sumaOrganizaciones.value === total
  )
})

const mostrarResumen = computed(() => {
  return parseInt(totalParticipantes.value || 0) > 0
})

// Método para calcular porcentaje
const calcularPorcentaje = (cantidad) => {
  const total = parseInt(totalParticipantes.value || 1)
  return ((cantidad / total) * 100).toFixed(1)
}

// Método para formatear el tamaño de archivo
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Método para formatear fecha
const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString('es-ES')
}

// Método para agregar archivos sin reemplazar los existentes
const agregarArchivos = (nuevosArchivos) => {
  if (nuevosArchivos && nuevosArchivos.length > 0) {
    archivos.value.push(...nuevosArchivos)
    // Limpiar el input después de agregar
    nuevoArchivo.value = []
  }
}

// Método para remover archivo seleccionado del input (antes de agregar)
const removerArchivoSeleccionado = (index) => {
  if (nuevoArchivo.value && nuevoArchivo.value.length > 0) {
    const nuevosArchivos = [...nuevoArchivo.value]
    nuevosArchivos.splice(index, 1)
    nuevoArchivo.value = nuevosArchivos
  }
}

// Método para actualizar todos los totales
const actualizarTotales = () => {
  // Forzar la reactividad
  // Las computed properties se actualizarán automáticamente
}

// Métodos para ocupaciones
const agregarOcupacion = () => {
  ocupaciones.value.push({ nombre: '', cantidad: 0 })
}

const eliminarOcupacion = (index) => {
  if (ocupaciones.value.length > 1) {
    ocupaciones.value.splice(index, 1)
  }
}

// Métodos para localidades
const agregarLocalidad = () => {
  localidades.value.push({
    departamento: '',
    municipio: '',
    localidad: '',
    cantidad: 0,
  })
}

const eliminarLocalidad = (index) => {
  if (localidades.value.length > 1) {
    localidades.value.splice(index, 1)
  }
}

// Métodos para organizaciones
const agregarOrganizacion = () => {
  organizaciones.value.push('')
  organizacionCantidades.value.push(0)
}

const eliminarOrganizacion = (index) => {
  if (organizaciones.value.length > 1) {
    organizaciones.value.splice(index, 1)
    organizacionCantidades.value.splice(index, 1)
  }
}

// Método para archivos
const eliminarArchivo = (index) => {
  archivos.value.splice(index, 1)
}
</script>

<style scoped>
.informacion-cuantitativa {
  max-width: 1000px;
}

.border {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.gap-2 {
  gap: 8px;
}
</style>
