<template>
  <v-dialog v-model="store.dialogForm" max-width="1200" persistent fullscreen>
    <v-card>
      <!-- Header del diálogo -->
      <v-toolbar color="primary" density="compact">
        <v-toolbar-title class="text-white">
          <v-icon left>mdi-file-plus</v-icon>
          NUEVO PROYECTO FONFOSC (MODO PRUEBA)
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon color="white" @click="store.cerrarDialogForm">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <!-- Contenedor principal SIN scroll -->
      <div class="dialog-content">
        <!-- Stepper simple sin scroll -->
        <v-stepper
          v-model="store.pasoActualForm"
          :items="store.pasosForm"
          editable
          hide-actions
          class="stepper-custom"
        >
          <!-- Paso 1: Datos Institucionales -->
          <template v-slot:item.1>
            <v-card flat class="paso-card">
              <v-card-title class="text-h6 bg-blue-lighten-5 pa-3">
                <v-icon left color="primary">mdi-office-building</v-icon>
                Datos Institucionales
              </v-card-title>
              <v-card-text class="pt-4">
                <v-form>
                  <v-row dense>
                    <v-col cols="12">
                      <v-autocomplete
                        v-model="store.institucionSeleccionadaForm"
                        :items="institucionesRegistradas"
                        item-title="nombre_completo"
                        item-value="id"
                        label="Seleccione institución registrada (opcional)"
                        variant="outlined"
                        density="comfortable"
                        placeholder="Busque por nombre, sigla o departamento..."
                        @update:model-value="cargarDatosInstitucion"
                        clearable
                        v-model:search-input="store.busquedaInstitucionForm"
                        :filter="filtrarInstituciones"
                        no-data-text="No se encontraron instituciones"
                        :menu-props="{ maxHeight: 300 }"
                        :loading="loadingLocal"
                        :disabled="loadingLocal"
                      >
                        <!-- Template personalizado para mostrar mejor la información -->
                        <template v-slot:item="{ item, props }">
                          <v-list-item v-bind="props" density="compact">
                            <template v-slot:prepend>
                              <v-avatar size="32" color="blue-lighten-5" class="mr-2">
                                <span class="text-caption font-weight-medium">
                                  {{ getSiglas(item.raw.nombre || item.raw.sigla) }}
                                </span>
                              </v-avatar>
                            </template>
                            <v-list-item-title class="text-body-2">
                              <div>
                                <strong>{{ item.raw.sigla }}</strong> - {{ item.raw.nombre }}
                              </div>
                              <div class="text-caption text-grey">
                                {{ item.raw.departamento || 'Sin departamento' }}
                                <span v-if="item.raw.email"> • {{ item.raw.email }}</span>
                              </div>
                            </v-list-item-title>
                          </v-list-item>
                        </template>

                        <!-- Template para el chip seleccionado -->
                        <template v-slot:selection="{ item }">
                          <v-chip size="small" variant="outlined" class="ma-1">
                            <v-avatar start size="24" color="blue-lighten-5">
                              <span class="text-caption">{{
                                getSiglas(item.raw.nombre || item.raw.sigla)
                              }}</span>
                            </v-avatar>
                            {{ item.raw.sigla }}
                          </v-chip>
                        </template>

                        <!-- Template para cuando está cargando -->
                        <template v-slot:prepend-item v-if="loadingLocal">
                          <v-list-item>
                            <v-list-item-title class="text-center">
                              <v-progress-circular
                                indeterminate
                                size="24"
                                width="2"
                                class="mr-2"
                              ></v-progress-circular>
                              Cargando instituciones...
                            </v-list-item-title>
                          </v-list-item>
                        </template>
                      </v-autocomplete>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="store.datosProyectoForm.institucion.sigla"
                        label="SIGLA"
                        variant="outlined"
                        density="comfortable"
                        placeholder="Ej: ACLO"
                        :readonly="store.institucionSeleccionadaForm !== null"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="store.datosProyectoForm.institucion.nombre"
                        label="Nombre de la institución"
                        variant="outlined"
                        density="comfortable"
                        placeholder="Ej: Fundación Acción Cultural Loyola"
                        :readonly="store.institucionSeleccionadaForm !== null"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="store.datosProyectoForm.institucion.departamento"
                        :items="store.departamentosBolivia"
                        label="Departamento de intervención"
                        variant="outlined"
                        density="comfortable"
                        placeholder="Seleccione departamento"
                        :readonly="store.institucionSeleccionadaForm !== null"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="store.datosProyectoForm.institucion.email"
                        label="Correo electrónico"
                        variant="outlined"
                        density="comfortable"
                        type="email"
                        placeholder="ejemplo@institucion.org"
                        :readonly="store.institucionSeleccionadaForm !== null"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="store.datosProyectoForm.institucion.responsable"
                        label="Responsable"
                        variant="outlined"
                        density="comfortable"
                        placeholder="Nombre completo del responsable"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
            </v-card>
          </template>

          <!-- Paso 2: Información General -->
          <template v-slot:item.2>
            <v-card flat class="paso-card">
              <v-card-title class="text-h6 bg-blue-lighten-5 pa-3">
                <v-icon left color="primary">mdi-information</v-icon>
                Información General del Proyecto
              </v-card-title>
              <v-card-text class="pt-4">
                <v-form>
                  <v-row dense>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="store.datosProyectoForm.codigo"
                        label="Código del proyecto"
                        variant="outlined"
                        density="comfortable"
                        placeholder="Ej: FF00001"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="store.datosProyectoForm.categoria"
                        :items="store.categoriasProyecto"
                        label="Categoría"
                        variant="outlined"
                        density="comfortable"
                        placeholder="Seleccione categoría"
                      ></v-select>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="store.datosProyectoForm.titulo"
                        label="Título del proyecto"
                        variant="outlined"
                        density="comfortable"
                        placeholder="Título descriptivo del proyecto"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="store.datosProyectoForm.fecha_inicio"
                        label="Fecha de inicio"
                        variant="outlined"
                        density="comfortable"
                        type="date"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="store.datosProyectoForm.fecha_cierre"
                        label="Fecha de cierre"
                        variant="outlined"
                        density="comfortable"
                        type="date"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        v-model="store.datosProyectoForm.cobertura_geografica"
                        label="Cobertura geográfica"
                        variant="outlined"
                        density="comfortable"
                        rows="2"
                        placeholder="Describa la ubicación geográfica del proyecto..."
                        auto-grow
                      ></v-textarea>
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        v-model="store.datosProyectoForm.resumen_proyecto"
                        label="Resumen del plan estratégico"
                        variant="outlined"
                        density="comfortable"
                        rows="3"
                        placeholder="Describa brevemente el proyecto..."
                        auto-grow
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
            </v-card>
          </template>

          <!-- Paso 3: Resumen -->
          <template v-slot:item.3>
            <v-card flat class="paso-card">
              <v-card-title class="text-h6 bg-blue-lighten-5 pa-3">
                <v-icon left color="primary">mdi-check-all</v-icon>
                Resumen y Confirmación
              </v-card-title>
              <v-card-text class="pt-4">
                <div class="resumen-container">
                  <!-- Información General -->
                  <v-card variant="outlined" class="mb-3">
                    <v-card-title class="text-subtitle-1 bg-grey-lighten-4 pa-2">
                      Información General
                    </v-card-title>
                    <v-card-text class="pa-3">
                      <v-list density="compact">
                        <v-list-item class="px-0">
                          <template v-slot:prepend>
                            <v-icon size="small">mdi-tag</v-icon>
                          </template>
                          <v-list-item-title class="text-body-2"
                            ><strong>Código:</strong>
                            {{ store.datosProyectoForm.codigo || 'No definido' }}</v-list-item-title
                          >
                        </v-list-item>
                        <v-list-item class="px-0">
                          <template v-slot:prepend>
                            <v-icon size="small">mdi-text</v-icon>
                          </template>
                          <v-list-item-title class="text-body-2"
                            ><strong>Título:</strong>
                            {{ store.datosProyectoForm.titulo || 'No definido' }}</v-list-item-title
                          >
                        </v-list-item>
                        <v-list-item class="px-0">
                          <template v-slot:prepend>
                            <v-icon size="small">mdi-calendar</v-icon>
                          </template>
                          <v-list-item-title class="text-body-2"
                            ><strong>Período:</strong>
                            {{ store.datosProyectoForm.fecha_inicio || 'No definida' }} -
                            {{
                              store.datosProyectoForm.fecha_cierre || 'No definida'
                            }}</v-list-item-title
                          >
                        </v-list-item>
                        <v-list-item class="px-0">
                          <template v-slot:prepend>
                            <v-icon size="small">mdi-category</v-icon>
                          </template>
                          <v-list-item-title class="text-body-2"
                            ><strong>Categoría:</strong>
                            {{
                              store.datosProyectoForm.categoria || 'No definida'
                            }}</v-list-item-title
                          >
                        </v-list-item>
                      </v-list>
                    </v-card-text>
                  </v-card>

                  <!-- Institución -->
                  <v-card variant="outlined" class="mb-3">
                    <v-card-title class="text-subtitle-1 bg-grey-lighten-4 pa-2">
                      Institución
                    </v-card-title>
                    <v-card-text class="pa-3">
                      <v-list density="compact">
                        <v-list-item class="px-0">
                          <v-list-item-title class="text-body-2"
                            ><strong>Institución:</strong>
                            {{ store.datosProyectoForm.institucion.nombre || 'No definida' }} ({{
                              store.datosProyectoForm.institucion.sigla || 'No definida'
                            }})</v-list-item-title
                          >
                        </v-list-item>
                        <v-list-item class="px-0">
                          <v-list-item-title class="text-body-2"
                            ><strong>Departamento:</strong>
                            {{
                              store.datosProyectoForm.institucion.departamento || 'No definido'
                            }}</v-list-item-title
                          >
                        </v-list-item>
                        <v-list-item class="px-0">
                          <v-list-item-title class="text-body-2"
                            ><strong>Email:</strong>
                            {{
                              store.datosProyectoForm.institucion.email || 'No definido'
                            }}</v-list-item-title
                          >
                        </v-list-item>
                        <v-list-item class="px-0">
                          <v-list-item-title class="text-body-2"
                            ><strong>Responsable:</strong>
                            {{
                              store.datosProyectoForm.institucion.responsable || 'No definido'
                            }}</v-list-item-title
                          >
                        </v-list-item>
                      </v-list>
                    </v-card-text>
                  </v-card>

                  <!-- Confirmación -->
                  <div class="mt-4">
                    <v-alert type="info" variant="tonal" density="compact" class="mb-3">
                      <strong>Modo Prueba - Validaciones Deshabilitadas</strong>
                      <div class="text-caption">
                        Puede crear el proyecto sin completar todos los campos.
                      </div>
                    </v-alert>

                    <v-checkbox
                      v-model="store.aceptarTerminosForm"
                      density="compact"
                      label="Confirmo que la información proporcionada es verídica y completa"
                    ></v-checkbox>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </template>
        </v-stepper>
      </div>

      <!-- Barra de navegación compacta -->
      <v-card-actions class="pa-3 bg-grey-lighten-4 border-top">
        <v-btn
          color="grey-darken-1"
          variant="text"
          density="compact"
          @click="store.pasoAnteriorForm"
          :disabled="store.esPrimerPasoForm"
          prepend-icon="mdi-arrow-left"
          size="small"
        >
          Anterior
        </v-btn>

        <v-spacer></v-spacer>

        <v-chip color="primary" variant="flat" density="compact" size="small" class="mr-2">
          Paso {{ store.pasoActualForm }} de {{ store.pasosForm.length }}
        </v-chip>

        <v-btn
          color="grey-darken-1"
          variant="text"
          density="compact"
          @click="store.cerrarDialogForm"
          size="small"
          class="mr-2"
        >
          Cancelar
        </v-btn>

        <v-btn
          v-if="!store.esUltimoPasoForm"
          color="primary"
          density="compact"
          @click="store.siguientePasoForm"
          :loading="store.cargandoForm"
          prepend-icon="mdi-arrow-right"
          size="small"
        >
          Siguiente
        </v-btn>
        <v-btn
          v-else
          color="success"
          density="compact"
          @click="confirmarCreacion"
          :loading="store.cargandoForm"
          :disabled="!store.aceptarTerminosForm"
          prepend-icon="mdi-check"
          size="small"
        >
          Crear Proyecto
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useFonFoscStore } from '../store/useFonFoscStore'

// Props y Emits
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'crear-proyecto'])

// Iniciar Store
const store = useFonFoscStore()

// Estados locales del componente (solo para datos que no están en el store)
const loadingLocal = ref(false)
const institucionesRegistradas = ref([])

// Watchers para sincronizar dialog con props
watch(
  () => props.modelValue,
  (value) => {
    store.dialogForm = value
  },
)

watch(
  () => store.dialogForm,
  (value) => {
    emit('update:modelValue', value)
  },
)

// Método para filtrar instituciones en el autocomplete
const filtrarInstituciones = (item, queryText, itemText) => {
  const searchText = queryText?.toLowerCase() || ''

  // Buscar en múltiples campos
  return (
    (item.raw.nombre?.toLowerCase() || '').includes(searchText) ||
    (item.raw.sigla?.toLowerCase() || '').includes(searchText) ||
    (item.raw.departamento?.toLowerCase() || '').includes(searchText) ||
    (item.raw.email?.toLowerCase() || '').includes(searchText) ||
    (item.raw.emailInstitucion?.toLowerCase() || '').includes(searchText) ||
    (item.raw.contacto_principal?.toLowerCase() || '').includes(searchText) ||
    (item.raw.nombre_completo?.toLowerCase() || '').includes(searchText)
  )
}

// Método para obtener siglas de un nombre
const getSiglas = (texto) => {
  if (!texto || typeof texto !== 'string') return '??'
  const palabras = texto
    .trim()
    .split(' ')
    .filter((word) => word.length > 0)
  if (palabras.length >= 2) {
    return (palabras[0].charAt(0) + palabras[1].charAt(0)).toUpperCase()
  }
  return texto.substring(0, 2).toUpperCase()
}

// Método para cargar datos de institución seleccionada
const cargarDatosInstitucion = (institucionId) => {
  if (institucionId) {
    const institucion = institucionesRegistradas.value.find((inst) => inst.id === institucionId)
    if (institucion) {
      store.cargarDatosInstitucionForm(institucion)
    }
  } else {
    // Limpiar los campos si se deselecciona
    store.datosProyectoForm.institucion = {
      sigla: '',
      nombre: '',
      departamento: '',
      email: '',
      responsable: '',
    }
  }
}

// Carga de datos con formato para el autocomplete
const cargarDatosInstituciones = async () => {
  loadingLocal.value = true
  try {
    // Usar el método del store para cargar instituciones
    await store.cargarListaInstituciones()
    console.log('Departamentos', store.departamentosBolivia)

    // Formatear datos para el autocomplete usando los datos del store
    institucionesRegistradas.value = store.institucionesListado.map((inst) => ({
      ...inst,
      nombre_completo: `${inst.sigla} - ${inst.nombre}${inst.departamento ? ` (${inst.departamento})` : ''}`,
    }))
  } catch (err) {
    console.error('Error al cargar instituciones:', err)
  } finally {
    loadingLocal.value = false
  }
}

const confirmarCreacion = async () => {
  try {
    store.cargandoForm = true
    const proyectoData = store.obtenerDatosProyectoForm()
    console.log('Proyecto a crear (modo prueba):', proyectoData)
    emit('crear-proyecto', proyectoData)
    setTimeout(() => {
      store.cerrarDialogForm()
    }, 1500)
  } catch (error) {
    console.error('Error al crear proyecto:', error)
  } finally {
    store.cargandoForm = false
  }
}

// Exponer métodos
defineExpose({
  abrirDialog: store.abrirDialogForm,
  cerrarDialog: store.cerrarDialogForm,
  siguientePaso: store.siguientePasoForm,
  pasoAnterior: store.pasoAnteriorForm,
  confirmarCreacion,
})

onMounted(() => {
  cargarDatosInstituciones()
})
</script>

<style scoped>
/* Diálogo con altura automática SIN scroll */
.dialog-content {
  padding: 16px;
  overflow: visible;
}

/* Stepper compacto */
.stepper-custom {
  box-shadow: none;
  min-height: auto;
}

.stepper-custom :deep(.v-stepper-header) {
  box-shadow: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  background: white;
}

.stepper-custom :deep(.v-stepper-item__title) {
  font-size: 0.75rem;
}

/* Tarjetas de pasos compactas */
.paso-card {
  min-height: auto;
  margin-bottom: 0;
}

/* Contenido más compacto */
:deep(.v-textarea .v-field) {
  min-height: auto !important;
}

/* Listas compactas */
:deep(.v-list-item) {
  min-height: 32px !important;
}

/* Ajustes para campos de formulario */
:deep(.v-field__input) {
  min-height: 40px !important;
}

/* Border top para separar las acciones */
.border-top {
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}

/* Estilos para el autocomplete */
:deep(.v-autocomplete .v-field__input) {
  min-height: 40px !important;
}

:deep(.v-autocomplete .v-field) {
  transition: all 0.2s ease;
}

:deep(.v-autocomplete .v-field--focused) {
  border-color: var(--v-primary-base) !important;
}

/* Estilos para los avatares de instituciones */
:deep(.v-avatar) {
  font-weight: 600;
}

/* Ajustes responsive */
@media (max-width: 960px) {
  .stepper-custom :deep(.v-stepper-header) {
    flex-direction: column;
    height: auto;
  }

  .stepper-custom :deep(.v-stepper-header .v-stepper-item) {
    margin-bottom: 4px;
  }

  .dialog-content {
    padding: 12px;
  }
}

@media (max-width: 600px) {
  .dialog-content {
    padding: 8px;
  }

  :deep(.v-stepper-item__title) {
    font-size: 0.7rem !important;
  }

  :deep(.v-autocomplete .v-field) {
    font-size: 0.875rem;
  }
}

/* Eliminar cualquier scrollbar */
.dialog-content::-webkit-scrollbar,
.resumen-container::-webkit-scrollbar {
  display: none;
}

.dialog-content,
.resumen-container {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Estilos para el chip de selección */
:deep(.v-chip--outlined) {
  border-color: rgba(0, 0, 0, 0.12);
}

/* Estilos para el estado de carga */
:deep(.v-progress-circular) {
  color: var(--v-primary-base);
}
</style>
