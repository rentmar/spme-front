<template>
  <div>
    <v-container>
      <!-- Indicador de carga lineal -->
      <v-progress-linear
        v-if="cargando"
        indeterminate
        color="primary"
        height="4"
        class="mb-4"
      ></v-progress-linear>

      <!-- Mensaje cuando no hay proyectos -->
      <v-card v-if="!cargando && proyectoLista.length === 0" class="mb-4">
        <v-card-text class="text-center py-8">
          <v-icon size="64" color="grey lighten-1">mdi-database-remove</v-icon>
          <h3 class="text-h5 mt-4">No hay proyectos registrados</h3>
          <p class="text-grey mt-2">Parece que aún no hay proyectos cargados en el sistema</p>
          <v-btn color="primary" class="mt-4" @click="nuevoProyecto">
            <v-icon left>mdi-plus</v-icon>
            Crear primer proyecto
          </v-btn>
        </v-card-text>
      </v-card>

      <v-row v-else-if="!cargando && proyectoLista.length > 0">
        <!-- Columna principal -->
        <v-col cols="12" md="9" lg="9">
          <v-card class="pa-4" elevation="2">
            <v-card-title class="d-flex justify-space-between align-center">
              <span>Lista de Proyectos FONFOSC</span>
              <span class="text-caption text-grey">Total: {{ proyectosFiltrados.length }}</span>
            </v-card-title>

            <!-- Buscador -->
            <v-card-text class="pt-0 pb-4">
              <v-text-field
                v-model="busqueda"
                label="Buscar proyectos (por código, título o institución)"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                clearable
                density="comfortable"
              ></v-text-field>
            </v-card-text>

            <v-list class="py-0">
              <template v-for="item in proyectosFiltrados" :key="item.id">
                <v-list-item :value="item" class="mb-2">
                  <template v-slot:prepend>
                    <v-avatar :color="getStatusColor(item.estado)" class="mr-4">
                      <v-icon dark>mdi-notebook</v-icon>
                    </v-avatar>
                  </template>

                  <v-list-item-title class="font-weight-bold">{{ item.titulo }}</v-list-item-title>
                  <v-list-item-subtitle class="mt-1">
                    <div class="d-flex align-center">
                      <v-chip
                        small
                        :color="getStatusColor(item.estado)"
                        text-color="white"
                        class="mr-2"
                      >
                        {{ getEstadoTexto(item.estado) }}
                      </v-chip>
                      <span>Código: {{ item.codigo }}</span>
                      <span class="mx-2">•</span>
                      <span v-if="item.institucion_info">
                        Institución: {{ item.institucion_info }}
                      </span>
                    </div>
                    <div class="text-caption mt-1">{{ item.cobertura_geografica }}</div>
                  </v-list-item-subtitle>

                  <template v-slot:append>
                    <div class="d-flex">
                      <!-- ENLACE AL MARCO LÓGICO - USANDO TU RUTA -->
                      <v-tooltip text="Marco Lógico" location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            v-bind="props"
                            icon="mdi-sitemap"
                            variant="text"
                            color="secondary"
                            :to="`/fonfosc/${item.id}/marcologico`"
                          ></v-btn>
                        </template>
                      </v-tooltip>

                      <!-- Informacion META -->
                      <v-tooltip text="Informacion Meta" location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            v-bind="props"
                            icon="mdi-human-male-female"
                            variant="text"
                            color="indigo"
                            :to="`/fonfosc/${item.id}/meta`"
                          ></v-btn>
                        </template>
                      </v-tooltip>

                      <!-- Presupuesto -->
                      <v-tooltip text="Presupuesto" location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            v-bind="props"
                            icon="mdi-cash-multiple"
                            variant="text"
                            color="text-blue-darken-3"
                            :to="`/fonfosc/${item.id}/presupuesto`"
                          ></v-btn>
                        </template>
                      </v-tooltip>

                      <v-tooltip text="Vista rápida" location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            v-bind="props"
                            icon="mdi-chevron-down"
                            variant="text"
                            color="info"
                            @click="toggleExpanded(item.id)"
                            :class="{ 'rotate-180': expandido === item.id }"
                          ></v-btn>
                        </template>
                      </v-tooltip>
                    </div>
                  </template>
                </v-list-item>

                <!-- Tarjeta de detalles desplegable con Tabs -->
                <v-expand-transition>
                  <div v-if="expandido === item.id">
                    <v-card elevation="0" class="ml-10 mr-4 mb-4 bg-grey-lighten-4">
                      <v-tabs v-model="tabActivo" color="primary" grow>
                        <v-tab value="datos">
                          <v-icon left>mdi-information</v-icon>
                          Datos
                        </v-tab>
                        <v-tab value="fechas">
                          <v-icon left>mdi-calendar</v-icon>
                          Fechas
                        </v-tab>
                        <v-tab value="financiamiento">
                          <v-icon left>mdi-cash</v-icon>
                          Financiamiento
                        </v-tab>
                        <v-tab value="institucion">
                          <v-icon left>mdi-office-building</v-icon>
                          Institución
                        </v-tab>
                      </v-tabs>

                      <v-card-text class="pt-4">
                        <v-window v-model="tabActivo">
                          <!-- Tab Datos del Proyecto -->
                          <v-window-item value="datos">
                            <v-row>
                              <v-col cols="12" md="6">
                                <p><strong>Código:</strong> {{ item.codigo }}</p>
                                <p>
                                  <strong>Categoría:</strong>
                                  {{ getCategoriaTexto(item.categoria) }}
                                </p>
                                <p><strong>Estado:</strong> {{ getEstadoTexto(item.estado) }}</p>
                                <p v-if="item.descripcion">
                                  <strong>Descripción:</strong> {{ item.descripcion }}
                                </p>
                              </v-col>
                              <v-col cols="12" md="6">
                                <p v-if="item.cobertura_geografica">
                                  <strong>Cobertura geográfica:</strong>
                                  {{ item.cobertura_geografica }}
                                </p>
                                <p v-if="item.pei">
                                  <strong>PEI asociado:</strong> {{ getPeiInfo(item.pei) }}
                                </p>
                              </v-col>
                            </v-row>
                          </v-window-item>

                          <!-- Tab Fechas -->
                          <v-window-item value="fechas">
                            <v-row>
                              <v-col cols="12" md="6">
                                <p>
                                  <strong>Fecha de creación:</strong>
                                  {{ formatoFecha(item.fecha_creacion) }}
                                </p>
                                <p v-if="item.fecha_inicio">
                                  <strong>Fecha inicio:</strong>
                                  {{ formatoFecha(item.fecha_inicio) }}
                                </p>
                                <p v-if="item.fecha_finalizacion">
                                  <strong>Fecha finalización:</strong>
                                  {{ formatoFecha(item.fecha_finalizacion) }}
                                </p>
                              </v-col>
                            </v-row>
                          </v-window-item>

                          <!-- Tab Financiamiento -->
                          <v-window-item value="financiamiento">
                            <v-row>
                              <v-col cols="12" md="6">
                                <p>
                                  <strong>Presupuesto:</strong>
                                  {{ formatoMoneda(item.presupuesto) }}
                                </p>
                                <p
                                  v-if="
                                    item.procedencia_fondos && item.procedencia_fondos.length > 0
                                  "
                                >
                                  <strong>Procedencia de fondos:</strong>
                                  <br />
                                  <span
                                    v-for="(fondos, index) in item.procedencia_fondos"
                                    :key="index"
                                  >
                                    {{ getProcedenciaFondosInfo(fondos)
                                    }}{{ index < item.procedencia_fondos.length - 1 ? ', ' : '' }}
                                  </span>
                                </p>
                              </v-col>
                            </v-row>
                          </v-window-item>

                          <!-- Tab Institución -->
                          <v-window-item value="institucion">
                            <v-row>
                              <v-col cols="12" md="6">
                                <p v-if="item.institucion_info">
                                  <strong>Institución:</strong> {{ item.institucion_info }}
                                </p>
                                <p v-if="item.institucion && item.institucion.detalle_completo">
                                  <strong>Detalles institución:</strong>
                                  {{ item.institucion.detalle_completo }}
                                </p>
                                <p v-if="item.responsable && item.responsable.nombre_completo">
                                  <strong>Responsable:</strong>
                                  {{ item.responsable.nombre_completo }}
                                </p>
                              </v-col>
                            </v-row>
                          </v-window-item>
                        </v-window>

                        <div class="d-flex justify-end mt-4">
                          <!-- Botón para ir al marco lógico desde la vista expandida -->
                          <v-btn
                            color="secondary"
                            variant="text"
                            size="small"
                            :to="`/fonfosc/${item.id}/marcologico`"
                            prepend-icon="mdi-sitemap"
                          >
                            Marco Lógico
                          </v-btn>
                        </div>
                      </v-card-text>
                    </v-card>
                  </div>
                </v-expand-transition>
              </template>

              <v-list-item v-if="proyectosFiltrados.length === 0">
                <v-list-item-title class="text-grey">
                  No se encontraron proyectos que coincidan con la búsqueda
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>

        <!-- Columna lateral -->
        <v-col cols="12" md="3" lg="3">
          <!-- Tarjeta de acciones -->
          <v-card class="mb-4" elevation="2">
            <v-card-title class="primary white--text">
              <v-icon left>mdi-cog</v-icon>
              Acciones
            </v-card-title>

            <v-list density="comfortable">
              <v-list-item
                title="Nuevo Proyecto"
                prepend-icon="mdi-plus-circle"
                class="text-primary"
                @click="nuevoProyecto"
              ></v-list-item>

              <v-list-item
                title="Nuevo Proyecto RD"
                prepend-icon="mdi-plus-circle"
                class="text-primary"
                to="/fonfosc/crear-nuevo-proyecto-fonfosc"
              ></v-list-item>

              <v-list-item
                title="Instituciones"
                prepend-icon="mdi-plus-circle"
                class="text-primary"
                @click="administrarInstituciones"
              ></v-list-item>

              <v-list-item
                title="Exportar lista"
                prepend-icon="mdi-file-export"
                @click="exportarExcel"
              ></v-list-item>
            </v-list>
          </v-card>

          <!-- Tarjeta de estadísticas -->
          <v-card elevation="2">
            <v-card-title class="primary white--text">
              <v-icon left>mdi-chart-box</v-icon>
              Estadísticas
            </v-card-title>

            <v-list density="comfortable">
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="primary">mdi-file-document-multiple</v-icon>
                </template>
                <v-list-item-title>Total proyectos</v-list-item-title>
                <v-list-item-subtitle class="text-right">{{
                  proyectoLista.length
                }}</v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="warning">mdi-cog-box</v-icon>
                </template>
                <v-list-item-title>En Estructuración</v-list-item-title>
                <v-list-item-subtitle class="text-right">
                  {{ contarPorEstado('ES') }}
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="info">mdi-clock-outline</v-icon>
                </template>
                <v-list-item-title>Observados</v-list-item-title>
                <v-list-item-subtitle class="text-right">
                  {{ contarPorEstado('OBS') }}
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="success">mdi-check-circle</v-icon>
                </template>
                <v-list-item-title>Aprobados</v-list-item-title>
                <v-list-item-subtitle class="text-right">
                  {{ contarPorEstado('APROB') }}
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="green">mdi-play-circle</v-icon>
                </template>
                <v-list-item-title>En ejecución</v-list-item-title>
                <v-list-item-subtitle class="text-right">
                  {{ contarPorEstado('EJ') }}
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="teal">mdi-flag-checkered</v-icon>
                </template>
                <v-list-item-title>Finalizados</v-list-item-title>
                <v-list-item-subtitle class="text-right">
                  {{ contarPorEstado('FIN') }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <DialogCrearProyectoFonFosc
      ref="dialogRef"
      v-model="mostrarDialogFf"
      @crear-proyecto="procesarProyectoNuevo"
    ></DialogCrearProyectoFonFosc>
    <InstitucionesCrud v-model="showInstitucionesDialog"></InstitucionesCrud>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useFonFoscListasStore } from '@/modules/fonfosc/store/useFonFoscListasStore'
import DialogCrearProyectoFonFosc from '@/modules/fonfosc/components/DialogCrearProyectoFonFosc.vue'
import InstitucionesCrud from '@/modules/fonfosc/components/InstitucionesCrud.vue'
import { useSnackbar } from '@/composables/useSnackbar'

//Estado - MANTENIENDO TU ESTRUCTURA EXACTA
const proyectoLista = ref([])
const busqueda = ref('')
const expandido = ref(null)
const tabActivo = ref('datos')
const cargando = ref(false)

//Estado para Crear Proyecto
const dialogRef = ref(null)
const mostrarDialogFf = ref(false)

const nuevoProyecto = () => {
  mostrarDialogFf.value = true
}

//Iniciar Composables
const { successMsg, errorMsg } = useSnackbar()

//Funcion para la creacion del proyecto
const procesarProyectoNuevo = async (proyectoData) => {
  try {
    console.log('Datos del proyecto recibidos:', proyectoData)

    // Aquí puedes enviar los datos a tu API
    // Ejemplo:
    // const response = await apiProyectos.crear(proyectoData)

    // Mostrar mensaje de éxito
    successMsg('Proyecto creado exitosamente')

    // Recargar la lista de proyectos
    await cargarDatos()
  } catch (error) {
    console.error('Error al crear proyecto:', error)
    errorMsg('No se pudo crear el proyecto')
  }
}

//Funcion para administrar las instituciones
const showInstitucionesDialog = ref(false)
const administrarInstituciones = () => {
  showInstitucionesDialog.value = true
}

//Iniciar el store
const storeFonFosc = useFonFoscListasStore()

onMounted(() => {
  cargarDatos()
})

// Computed para filtrar proyectos - AJUSTADO PARA BUSCAR EN INSTITUCIÓN
const proyectosFiltrados = computed(() => {
  if (!busqueda.value.trim()) {
    return proyectoLista.value
  }

  const termino = busqueda.value.toLowerCase()
  return proyectoLista.value.filter((proyecto) => {
    // Buscar en código
    const matchCodigo = proyecto.codigo && proyecto.codigo.toLowerCase().includes(termino)

    // Buscar en título
    const matchTitulo = proyecto.titulo && proyecto.titulo.toLowerCase().includes(termino)

    // Buscar en información de institución
    const matchInstitucion =
      proyecto.institucion_info && proyecto.institucion_info.toLowerCase().includes(termino)

    return matchCodigo || matchTitulo || matchInstitucion
  })
})

const cargarDatos = async () => {
  cargando.value = true
  try {
    await Promise.all([storeFonFosc.cargarListaFonfosc()])
    proyectoLista.value = storeFonFosc.fonfoscLista

    // Si los datos vienen sin la propiedad computada, la agregamos
    proyectoLista.value = proyectoLista.value.map((proyecto) => ({
      ...proyecto,
      institucion_info:
        proyecto.institucion_info ||
        (proyecto.institucion
          ? proyecto.institucion.sigla || proyecto.institucion.nombre || 'Sin institución'
          : 'Sin institución asignada'),
    }))

    console.log('Proyectos cargados:', proyectoLista.value)
  } catch (err) {
    console.error('Error de carga', err)
  } finally {
    cargando.value = false
  }
}

// Métodos de utilidad - AJUSTADOS AL NUEVO MODELO
const getStatusColor = (estado) => {
  const colores = {
    ES: 'warning', // Estructuración
    PL: 'info', // Planificado
    OBS: 'orange', // Observado
    APROB: 'success', // Aprobado
    EJ: 'green', // En Ejecución
    FIN: 'teal', // Finalizado
  }
  return colores[estado] || 'grey'
}

const getEstadoTexto = (estado) => {
  const estados = {
    ES: 'En Estructuración',
    PL: 'Planificado',
    OBS: 'Observado',
    APROB: 'Aprobado',
    EJ: 'En Ejecución',
    FIN: 'Finalizado',
  }
  return estados[estado] || estado
}

const getCategoriaTexto = (categoria) => {
  const categorias = {
    FI: 'Fortalecimiento Institucional',
    FSC: 'Fortalecimiento de la sociedad civil',
  }
  return categorias[categoria] || categoria
}

const getPeiInfo = (pei) => {
  if (!pei) return 'No asignado'
  if (typeof pei === 'string') return pei
  if (pei.codigo) return pei.codigo
  return 'PEI asignado'
}

const getProcedenciaFondosInfo = (fondos) => {
  if (!fondos) return ''
  if (typeof fondos === 'string') return fondos
  if (fondos.nombre) return fondos.nombre
  return 'Financiador'
}

const formatoFecha = (fecha) => {
  if (!fecha) return 'No definida'
  try {
    const date = new Date(fecha)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return fecha
  }
}

const formatoMoneda = (valor) => {
  if (!valor || valor === '0.00') return 'Bs. 0.00'
  const num = parseFloat(valor)
  return new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
    minimumFractionDigits: 2,
  }).format(num)
}

const contarPorEstado = (estado) => {
  return proyectoLista.value.filter((proyecto) => proyecto.estado === estado).length
}

// Métodos de acción
const toggleExpanded = (id) => {
  expandido.value = expandido.value === id ? null : id
}

const exportarExcel = () => {
  alert('Exportar a Excel')
}
</script>

<style scoped>
.v-list-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.v-list-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.v-list-item:last-child {
  border-bottom: none;
}

.v-card-title {
  font-size: 1.25rem;
  font-weight: 500;
}

.text-right {
  text-align: right;
}

.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}

.bg-grey-lighten-4 {
  background-color: #f5f5f5;
}
</style>
