<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="9" lg="9" class="">
        <v-card variant="outlined" elevation="1">
          <v-card-title>
            <h3>Proyecto {{ ruta.params.id }}</h3>
          </v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field variant="outlined" v-model="proyecto.titulo" label="Titulo">
              </v-text-field>
              <v-textarea
                variant="outlined"
                v-model="proyecto.proyecto"
                label="Descripcion"
                rows="3"
              ></v-textarea>
            </v-form>
          </v-card-text>
        </v-card>
        <br />

        <!--Informacion: objetivos, indicadores, productos, resultados -->
        <v-card variant="outlined" elevation="1">
          <v-card-title class="primary white--text"> Detalles del Proyecto </v-card-title>

          <v-tabs v-model="tab" color="primary" grow>
            <v-tab value="objetivos">
              <v-icon left>mdi-target</v-icon>
              Objetivos
            </v-tab>
            <v-tab value="indicadores">
              <v-icon left>mdi-chart-bar</v-icon>
              Indicadores
            </v-tab>
            <v-tab value="productos">
              <v-icon left>mdi-package-variant</v-icon>
              Productos
            </v-tab>
            <v-tab value="resultados">
              <v-icon left>mdi-check-all</v-icon>
              Resultados
            </v-tab>
          </v-tabs>

          <v-card-text>
            <v-window v-model="tab">
              <!-- Pestaña Objetivos -->
              <v-window-item value="objetivos">
                <h3 class="mb-4">Objetivos del Proyecto</h3>
                <v-list>
                  <v-list-item v-for="(objetivo, i) in objetivos" :key="i">
                    <v-list-item-content>
                      <v-list-item-title>{{ objetivo.titulo }}</v-list-item-title>
                      <v-list-item-subtitle>{{ objetivo.descripcion }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-window-item>

              <!-- Pestaña Indicadores -->
              <v-window-item value="indicadores">
                <h3 class="mb-4">Indicadores de Seguimiento</h3>
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th>Indicador</th>
                        <th>Tipo</th>
                        <th>Meta</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(indicador, i) in indicadores" :key="i">
                        <td>{{ indicador.nombre }}</td>
                        <td>{{ indicador.tipo }}</td>
                        <td>{{ indicador.meta }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-window-item>

              <!-- Pestaña Productos -->
              <v-window-item value="productos">
                <h3 class="mb-4">Productos Esperados</h3>
                <v-expansion-panels>
                  <v-expansion-panel v-for="(producto, i) in productos" :key="i">
                    <v-expansion-panel-title>
                      {{ producto.nombre }}
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      {{ producto.descripcion }}
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-window-item>

              <!-- Pestaña Resultados -->
              <v-window-item value="resultados">
                <h3 class="mb-4">Resultados Alcanzados</h3>
                <v-timeline side="end">
                  <v-timeline-item
                    v-for="(resultado, i) in resultados"
                    :key="i"
                    :dot-color="resultado.completado ? 'success' : 'primary'"
                  >
                    <template v-slot:opposite>
                      {{ resultado.fecha }}
                    </template>
                    <v-card>
                      <v-card-title>{{ resultado.titulo }}</v-card-title>
                      <v-card-text>{{ resultado.descripcion }}</v-card-text>
                    </v-card>
                  </v-timeline-item>
                </v-timeline>
              </v-window-item>
            </v-window>
          </v-card-text>
        </v-card>
        <!-- Fin Informacion: objetivos, indicadores, productos, resultados -->
      </v-col>
      <v-col cols="12" md="3" lg="3">
        <v-card class="mx-auto" max-width="500" elevation="6">
          <!-- Encabezado con imagen -->
          <v-img height="150" src="" cover>
            <v-card-title class="text-black text-h5">
              Resumen del Proyecto
              <v-spacer></v-spacer>
              <v-chip color="primary" v-if="estadoProyecto">
                {{ estadoProyecto }}
              </v-chip>
            </v-card-title>
          </v-img>

          <!-- Contenido principal -->
          <v-card-text>
            <!-- Progreso general -->
            <div class="d-flex align-center mb-4">
              <v-progress-circular
                :rotate="360"
                :size="80"
                :width="10"
                :value="porcentajeCompletado"
                color="primary"
              >
                <strong>{{ porcentajeCompletado }}%</strong>
              </v-progress-circular>
              <div class="ml-4">
                <div class="text-subtitle-1">Progreso total</div>
                <div class="text-caption text-grey">Inicio: {{ fechaInicioFormateada }}</div>
                <div class="text-caption text-grey">Fin: {{ fechaFinFormateada }}</div>
              </div>
            </div>

            <!-- Indicadores clave -->
            <v-divider class="my-3"></v-divider>
            <h3 class="mb-2">Indicadores Clave</h3>
            <v-row dense>
              <v-col cols="6" v-for="(item, i) in indicadoresClave" :key="i">
                <v-card outlined>
                  <v-card-text class="text-center">
                    <div class="text-h6">{{ item.valor }}</div>
                    <div class="text-caption text-grey">{{ item.titulo }}</div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- Presupuesto -->
            <v-divider class="my-3"></v-divider>
            <h3 class="mb-2">Presupuesto</h3>
            <div class="d-flex justify-space-between">
              <span>Utilizado</span>
              <span>{{ presupuestoUtilizado }} / {{ proyecto.presupuestoTotal }}</span>
            </div>
            <v-progress-linear
              :model-value="porcentajePresupuestoUtilizado"
              height="15"
              color="deep-purple-accent-4"
              rounded
              class="mt-1"
            >
              <template v-slot:default="{ value }">
                <strong>{{ Math.ceil(value) }}%</strong>
              </template>
            </v-progress-linear>
          </v-card-text>

          <!-- Acciones -->
          <v-card-actions>
            <v-btn color="primary" variant="text" @click="verDetalles"> Ver detalles </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { proyectoServicios } from '@/modules/proyecto/services/proyectoService'
//La ruta, el id del proyecto ruta.params.id
const ruta = useRoute()
const proyecto = ref({})

console.log(ruta)

const cargarDatos = async () => {
  const id = ruta.params.id
  proyecto.value = await proyectoServicios.obtenertPorId(id)
  console.log('Valor:')
  console.log(proyecto)
}

onMounted(() => {
  cargarDatos()
})

//TABS

const tab = ref('objetivos')

// Datos de ejemplo (deberías reemplazarlos con tus datos reales)
const objetivos = ref([
  {
    titulo: 'Objetivo General',
    descripcion: 'Mejorar los indicadores de calidad educativa en la región',
  },
  {
    titulo: 'Objetivo Específico 1',
    descripcion: 'Capacitar a 100 docentes en metodologías innovadoras',
  },
])

const indicadores = ref([
  {
    nombre: 'Docentes capacitados',
    tipo: 'Cuantitativo',
    meta: '100',
  },
  {
    nombre: 'Satisfacción de participantes',
    tipo: 'Cualitativo',
    meta: '80%',
  },
])

const productos = ref([
  {
    nombre: 'Manual de metodologías',
    descripcion: 'Documento con las nuevas metodologías pedagógicas',
  },
  {
    nombre: 'Talleres realizados',
    descripcion: '10 talleres de capacitación docente',
  },
])

const resultados = ref([
  {
    titulo: 'Primera fase completada',
    descripcion: 'Se capacitó al 60% del personal docente objetivo',
    fecha: '15/03/2023',
    completado: true,
  },
  {
    titulo: 'Segunda fase en progreso',
    descripcion: 'Implementación de nuevas metodologías en aulas',
    fecha: '30/06/2023',
    completado: false,
  },
])

// Datos del proyecto
const proyectoInfo = ref({
  nombre: 'Modernización Educativa',
  fechaInicio: '2023-05-15',
  fechaFin: '2024-11-30',
  presupuestoTotal: 125000,
  presupuestoUtilizado: 87500,
  completado: 42,
  tareasCompletadas: 17,
  tareasTotales: 40,
  estado: 'En progreso',
  esFavorito: false,
})
// Datos computados
const porcentajeCompletado = computed(() => proyectoInfo.value.completado)
const fechaInicioFormateada = computed(() =>
  new Date(proyectoInfo.value.fechaInicio).toLocaleDateString(),
)
const fechaFinFormateada = computed(() =>
  new Date(proyectoInfo.value.fechaFin).toLocaleDateString(),
)
const presupuestoUtilizado = computed(
  () => `$${proyectoInfo.value.presupuestoUtilizado.toLocaleString()}`,
)
const porcentajePresupuestoUtilizado = computed(
  () => (proyectoInfo.value.presupuestoUtilizado / proyectoInfo.value.presupuestoTotal) * 100,
)
const estadoProyecto = computed(() => proyectoInfo.value.estado)
//const esFavorito = computed(() => proyectoInfo.value.esFavorito)

// Indicadores clave
const indicadoresClave = computed(() => [
  {
    titulo: 'Tareas completadas',
    valor: `${proyectoInfo.value.tareasCompletadas}/${proyectoInfo.value.tareasTotales}`,
  },
  {
    titulo: 'Días restantes',
    valor: diasRestantes.value,
  },
  {
    titulo: 'Presupuesto restante',
    valor: `Bs ${(proyectoInfo.value.presupuestoTotal - proyectoInfo.value.presupuestoUtilizado).toLocaleString()}`,
  },
  {
    titulo: 'Avance semanal',
    valor: '+2.5%',
  },
])

// Cálculo de días restantes
const diasRestantes = computed(() => {
  const hoy = new Date()
  const fin = new Date(proyectoInfo.value.fechaFin)
  const diff = fin - hoy
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
})

// Métodos
/*const toggleFavorito = () => {
  proyectoInfo.value.esFavorito = !proyectoInfo.value.esFavorito
}*/

const verDetalles = () => {
  console.log('Navegar a detalles del proyecto')
}
</script>
<style scoped>
.v-card {
  border-radius: 12px;
  overflow: hidden;
}

.v-progress-circular {
  transition: all 0.5s ease;
}

.v-card-actions {
  padding: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}

.red {
  background-color: red;
}
.blue {
  background-color: blue;
}
.yellow {
  background-color: yellow;
}
.asideCard {
  margin: 10px;
}
</style>
