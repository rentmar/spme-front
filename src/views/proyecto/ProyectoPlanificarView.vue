<template>
  <v-container>
    <v-overlay :model-value="!cargaCompleta" class="align-center justify-center">
      <template v-if="errorCarga">
        <v-alert type="error" class="mb-4">
          {{ errorCarga }}
        </v-alert>
        <v-btn color="primary" @click="cargarDatos">Reintentar</v-btn>
      </template>
      <template v-else>
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        <p class="mt-4 text-h6">Cargando Proyecto...</p>
      </template>
    </v-overlay>

    <!-- CONTENIDO -->
    <template v-if="cargaCompleta">
      <v-row>
        <v-col cols="12" md="12">
          <PaginaTituloIcono :titulo="'planificacion'" :icon="'mdi-calendar'" />
          <ProyectoHeader v-if="proyecto" :proyecto="proyecto" />

          <v-card class="mb-4" min-height="800">
            <v-toolbar color="info" density="compact">
              <v-toolbar-title>PLANIFICACION</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>

            <v-card-text class="contenedor-planificacion">
              <!-- Componente hijo con prop de carga -->
              <PlanificacionXls
                :proyecto="proyecto"
                :proyecto-estructura="proyectoEstructura"
                :cargando="!cargaCompleta"
              />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useProyectoStore } from '@/modules/proyecto/store/proyectoStore'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'
import ProyectoHeader from '@/modules/proyecto/components/partials/ProyectoHeader.vue'
import PlanificacionXls from '@/modules/planificacionxls/components/PlanificacionXls.vue'

//Estado de carga
const cargaCompleta = ref(true) //Cambiar a false en produccion
const errorCarga = ref(null)

// Store y rutas
const proyectoStore = useProyectoStore()
const route = useRoute()
const idproyecto = route.params.id

/****** Iniciar y desestructurar stores **********/
//Store del Proyecto
/*const {
  proyectoActual: proyecto,
  cargando: cargandoProyecto,
  proyectoEstructura,
} = storeToRefs(proyectoStore)
const { obtenerProyectoPorId, obtenerProyectoEstructuraPorId } = proyectoStore*/

/*onMounted(async () => {
  await cargarDatos()
})*/

//Watch para la carga completa
// watch(
//   [cargandoProyecto, proyecto, proyectoEstructura],
//   ([cargando, proy, estructura]) => {
//     if (!cargando && proy && estructura) {
//       cargaCompleta.value = true
//     }
//   },
//   { immediate: true },
// )

const cargarDatos = async () => {
  try {
    errorCarga.value = null
    /*
    await Promise.all([
      await obtenerProyectoPorId(idproyecto),
      await obtenerProyectoEstructuraPorId(idproyecto),
    ])*/
  } catch (err) {
    console.erro('Error al cargar datos', err)
    errorCarga
  }
}

// Estado de carga
const cargandoGeneral = computed(() => {
  return cargandoProyecto.value
})

const proyecto = {
  id: 1,
  codigo: 'ESTR01-025029',
  titulo: 'Test de Estructura No 1',
  descripcion: 'Descripcion del Test de estructura No 1',
  fecha_creacion: '2023-01-15T00:00:00Z',
  fecha_inicio: '2023-02-01',
  fecha_finalizacion: '2023-12-31',
  presupuesto: '250000.00',
  estado: 'ES',
  creado_por: 'admin@example',
  pei: 1,
  instancia_gestora: [4],
  procedencia_fondos: [],
}

const proyectoEstructura = {
  id: 1,
  codigo: 'ESTR01-025029',
  titulo: 'Test de Estructura No 1',
  descripcion: 'Descripcion del Test de estructura No 1',
  fecha_creacion: '2023-01-15T00:00:00Z',
  fecha_inicio: '2023-02-01',
  fecha_finalizacion: '2023-12-31',
  presupuesto: '250000.00',
  estado: 'ES',
  creado_por: 'admin@example.com',
  objetivo_general: {
    id: 1,
    codigo: 'OO',
    descripcion: 'desc og',
    supuestos: 'Supuestos del objetivo general',
    riesgos: 'Riesgos potenciales',
    kpi: [
      {
        id: 1,
        codigo: 'KPI-OG-1',
        descripcion: 'KPI para objetivo general',
      },
    ],
    indicadores_objgral: [
      {
        id: 1,
        codigo: 'IND-OG-1',
        redaccion: 'GUIA',
        fuente_verificacion: 'Reportes del sistema',
        target_poblacion: 'Departamento administrativo',
        tipo: '1-9',
        baseline: '5',
        target_q1: '10',
        target_q2: '15',
        target_q3: '20',
        target_q4: '25',
        objetivo_general: 1,
      },
    ],
    resultados_objgral: [
      {
        id: 1,
        codigo: 'R0-OG-1',
        descripcion: 'Descripcion del resultado de obj gral 1',
        supuestos: 'Supuestos resultado 1',
        riesgos: 'Riesgos resultado 1',
        indicador_res_objgral: [
          {
            id: 2,
            codigo: 'IND00-R0-OG-1',
            redaccion: 'GUIA',
            fuente_verificacion: 'Documentación técnica',
            target_poblacion: 'Equipo técnico',
            tipo: '%',
            baseline: '10',
            target_q1: '30',
            target_q2: '50',
            target_q3: '70',
            target_q4: '90',
          },
        ],
        procesos_res_objgral: [
          {
            id: 1,
            codigo: 'PROC-R0-1',
            titulo: 'Proceso para resultado 1',
            descripcion: 'Descripción del proceso',
            actividades_res_objgral: [
              {
                id: 1,
                codigo: 'ACT-R0-1',
                descripcion: 'Actividad inicial',
                tipo: 'AOP',
                fecha_programada: '2023-03-01',
                estado: 'PLAN',
              },
            ],
          },
        ],
        actividades_res_objgral: [
          {
            id: 2,
            codigo: 'ACT-DIR-1',
            descripcion: 'Actividad directa resultado 1',
            tipo: 'ACAP',
            fecha_programada: '2023-03-15',
            estado: 'PLAN',
          },
        ],
      },
      {
        id: 2,
        codigo: 'R0-OG-2',
        descripcion: 'Descripcion del resultado de obj gral 2',
        indicador_res_objgral: [
          {
            id: 3,
            codigo: 'IND00-R0-OG-2',
            redaccion: 'GUIA',
            tipo: 'A-Z',
            baseline: 'Inicial',
            target_q1: 'Avance 1',
            target_q2: 'Avance 2',
            target_q3: 'Avance 3',
            target_q4: 'Final',
          },
        ],
        procesos_res_objgral: null,
        actividades_res_objgral: [],
      },
      {
        id: 3,
        codigo: 'R0-OG-3',
        descripcion: 'Descripcion del resultado de obj gral 3',
        indicador_res_objgral: [
          {
            id: 4,
            codigo: 'IND00-R0-OG-3',
            redaccion: 'GUIA',
            tipo: '1-9',
            baseline: '1',
            target_q1: '3',
            target_q2: '5',
            target_q3: '7',
            target_q4: '9',
          },
        ],
        procesos_res_objgral: null,
        actividades_res_objgral: [],
      },
    ],
    objetivos_especificos: [
      {
        id: 1,
        codigo: 'OE-1',
        descripcion: 'Objetivo específico 1',
        indicadores_objesp: [
          {
            id: 5,
            codigo: 'IND-OE-1',
            redaccion: 'SMART',
            tipo: '%',
            baseline: '0',
            target_q1: '25',
            target_q2: '50',
            target_q3: '75',
            target_q4: '100',
          },
        ],
        resultados_objesp: [
          {
            id: 4,
            codigo: 'ROE-1',
            descripcion: 'Resultado objetivo específico 1',
            indicador_res_objesp: [
              {
                id: 6,
                codigo: 'IND-ROE-1',
                redaccion: 'GUIA',
                tipo: '1-9',
                baseline: '1',
                target_q1: '2',
                target_q2: '3',
                target_q3: '4',
                target_q4: '5',
              },
            ],
            productos_res_objesp: [
              {
                id: 1,
                codigo: 'PROD-ROE-1',
                descripcion: 'Producto resultado 1',
                entregado: false,
              },
            ],
            procesos_res_objesp: [
              {
                id: 2,
                codigo: 'PROC-ROE-1',
                titulo: 'Proceso para resultado OE 1',
                actividades_res_objesp: [
                  {
                    id: 3,
                    codigo: 'ACT-ROE-1',
                    descripcion: 'Actividad proceso resultado OE',
                    tipo: 'AOP',
                    fecha_programada: '2023-04-01',
                    estado: 'PLAN',
                  },
                ],
              },
            ],
            actividades_res_objesp: [
              {
                id: 4,
                codigo: 'ACT-DIR-ROE-1',
                descripcion: 'Actividad directa resultado OE',
                tipo: 'ACAP',
                fecha_programada: '2023-04-15',
                estado: 'PLAN',
              },
            ],
          },
        ],
        productos_objesp: [
          {
            id: 2,
            codigo: 'PROD-OE-1',
            descripcion: 'Producto objetivo específico 1',
            entregado: true,
            procesos_prod_objesp: [
              {
                id: 3,
                codigo: 'PROC-PROD-1',
                titulo: 'Proceso para producto OE',
                actividades_prod_objesp: [
                  {
                    id: 5,
                    codigo: 'ACT-PROD-1',
                    descripcion: 'Actividad para producto',
                    tipo: 'AOP',
                    fecha_programada: '2023-05-01',
                    estado: 'COMP',
                  },
                ],
              },
            ],
            actividades_prod_objesp: [
              {
                id: 6,
                codigo: 'ACT-DIR-PROD-1',
                descripcion: 'Actividad directa producto',
                tipo: 'AOP',
                fecha_programada: '2023-05-15',
                estado: 'PLAN',
              },
            ],
          },
        ],
      },
    ],
  },
  objetivo_especifico: [
    {
      id: 2,
      codigo: 'OE-IND-1',
      descripcion: 'Objetivo específico independiente 1',
      indicadores_objesp: [
        {
          id: 7,
          codigo: 'IND-OE-IND-1',
          redaccion: 'SMART',
          tipo: 'A-Z',
          baseline: 'Inicio',
          target_q1: 'Avance 1',
          target_q2: 'Avance 2',
          target_q3: 'Avance 3',
          target_q4: 'Final',
        },
      ],
      resultados_objesp: [
        {
          id: 5,
          codigo: 'ROE-IND-1',
          descripcion: 'Resultado objetivo específico independiente',
          indicador_res_objesp: [
            {
              id: 8,
              codigo: 'IND-ROE-IND-1',
              redaccion: 'GUIA',
              tipo: '%',
              baseline: '0',
              target_q1: '20',
              target_q2: '40',
              target_q3: '60',
              target_q4: '80',
            },
          ],
        },
      ],
      productos_objesp: [
        {
          id: 3,
          codigo: 'PROD-OE-IND-1',
          descripcion: 'Producto objetivo específico independiente',
          entregado: false,
        },
      ],
    },
  ],
  instancia_gestora: [
    {
      id: 1,
      codigo: 'ADM',
      instancia: 'Administración',
    },
  ],
  procedencia_fondos: [
    {
      id: 1,
      sigla: 'BM',
      financiera: 'Banco Mundial',
    },
  ],
}
</script>

<style scoped>
/* Estilos generales para las tarjetas */
.v-card {
  margin-bottom: 24px;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15) !important;
}

/* Estilos para hacer la tarjeta de herramientas pegajosa */
.sticky-card {
  position: sticky;
  top: 20px;
}

/* Estilos para el contenedor del diagrama */
.vue-flow__container {
  width: 100%;
  height: 100%;
  min-height: 500px;
  background-color: #f8fafc;
}

/* Estilos para el minimapa */
.vue-flow__minimap {
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

/* Ajustes para los controles */
.vue-flow__controls {
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

/* Estilos para los nodos del diagrama */
.vue-flow__node {
  background: white;
  border: 1px solid #4caf50;
  border-radius: 4px;
  padding: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  cursor: grab;
}

/* Estilos para las conexiones */
.vue-flow__edge-path {
  stroke: #4caf50;
  stroke-width: 2;
}
/* Estilos para el Node Toolbar */
.custom-node-toolbar {
  background: white;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 8px;
  z-index: 10;
}

.toolbar-actions {
  display: flex;
  gap: 8px;
}

/* Estilos para los botones del toolbar */
.custom-node-toolbar .v-btn {
  margin: 0;
  transition: all 0.2s ease;
}

.custom-node-toolbar .v-btn:hover {
  transform: scale(1.1);
}

/* Estilos para el contenedor del diagrama */
.vue-flow__container {
  width: 100%;
  height: 100%;
  min-height: 500px;
  background-color: #f8fafc;
  border-radius: 4px;
}

.contenedor-planificacion {
  width: 100%;
  height: 100%;
  min-height: 600px;
  position: relative;
  padding: 0;
}
</style>
