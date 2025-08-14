<template>
  <v-container class="marco-logico-container">
    <!-- Overlay de carga -->
    <CargaCircular :estado-carga="cargandoGeneral" />

    <!-- Contenido -->
    <v-row v-if="!cargandoGeneral">
      <v-col cols="12">
        <!-- Encabezado de la página -->
        <PaginaTituloIcono titulo="Marco Lógico del Proyecto" icon="mdi-sitemap" />

        <!-- Encabezado del proyecto -->
        <ProyectoHeader
          v-if="proyecto"
          :proyecto="proyecto"
          :activar-detalles="true"
          :activar-editar="true"
        />

        <!-- Marco lógico -->
        <v-card variant="outlined">
          <NivelMLObjGral v-if="objetivosGenerales" :objetivos-generales="objetivosGenerales" />
          <NivelMLObjEspec
            v-if="objetivosEspecificos"
            :objetivos-especificos="objetivosEspecificos"
          />
          <NivelMLResultado :resultados="resultados" :actividades-resultados="resultadosAct" />
          <NivelMLProductos :productos="productos" :actividades-productos="productosAct" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import CargaCircular from '@/components/layout/partials/CargaCircular.vue'
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'
import ProyectoHeader from '@/modules/proyecto/components/partials/ProyectoHeader.vue'
import NivelMLObjGral from '@/modules/MarcoLogico/NivelMLObjGral.vue'
import NivelMLObjEspec from '@/modules/MarcoLogico/NivelMLObjEspec.vue'
import NivelMLResultado from '@/modules/MarcoLogico/NivelMLResultado.vue'
import NivelMLProductos from '@/modules/MarcoLogico/NivelMLProductos.vue'
import { useProyectoCrud } from '@/modules/proyecto/composables/useProyectoCrud'

// Estado de carga
const cargandoGeneral = ref(true)
const route = useRoute()
const idproyecto = route.params.id

//iniciar el composable
const { proyecto, obtenerProyecto } = useProyectoCrud()
// Datos dummy del proyecto
// const proyecto = ref({
//   id: 1,
//   codigo: 'PROJ-2023-001',
//   titulo: 'Modernización de Sistemas Informáticos',
//   descripcion: 'Proyecto para actualizar los sistemas informáticos de la institución',
//   estado: 'PL',
//   fecha_creacion: '2023-01-15T08:00:00Z',
//   fecha_inicio: '2023-03-01',
//   fecha_finalizacion: '2023-12-15',
//   presupuesto: 250000,
// })

// Datos dummy de objetivos e indicadores
const objetivos = ref({
  objetivos_generales: [
    {
      id: 1,
      descripcion: 'Mejorar la eficiencia operativa mediante la modernización tecnológica',
      indicadores: [
        {
          id: 1,
          codigo: 'IND-001',
          descripcion: 'Porcentaje de procesos automatizados',
          tipo: 'Proporcion',
          numerador: 'Procesos automatizados',
          denominador: 'Total de procesos',
          meta: '80%',
          linea_base: '30%',
        },
      ],
    },
  ],
  objetivos_especificos: [
    {
      id: 1,
      descripcion: 'Implementar sistema de gestión documental',
      objetivo_general_id: 1,
      indicadores: [
        {
          id: 2,
          codigo: 'IND-002',
          descripcion: 'Porcentaje de documentos gestionados electrónicamente',
          tipo: 'Proporcion',
          numerador: 'Documentos electrónicos',
          denominador: 'Total de documentos',
          meta: '90%',
          linea_base: '20%',
        },
      ],
    },
  ],
})

// Datos dummy de resultados, productos e indicadores
const resultProdIndicadores = ref({
  resultados: [
    {
      id: 1,
      descripcion: 'Sistema de gestión documental implementado',
      objetivo_especifico_id: 1,
      indicadores: [
        {
          id: 3,
          codigo: 'IND-003',
          descripcion: 'Porcentaje de usuarios capacitados',
          tipo: 'Proporcion',
          numerador: 'Usuarios capacitados',
          denominador: 'Total de usuarios',
          meta: '100%',
          linea_base: '0%',
        },
      ],
    },
  ],
  productos: [
    {
      id: 1,
      descripcion: 'Manual de usuario del sistema',
      resultado_id: 1,
      indicadores: [
        {
          id: 4,
          codigo: 'IND-004',
          descripcion: 'Número de manuales distribuidos',
          tipo: 'Cantidad',
          meta: '150',
          linea_base: '0',
        },
      ],
    },
  ],
})

// Datos dummy de actividades
const resultProdActividades = ref({
  resultados: [
    {
      id: 1,
      actividades: [
        {
          id: 1,
          codigo: 'ACT-001',
          descripcion: 'Capacitación a usuarios finales',
          fecha_inicio: '2023-06-01',
          fecha_fin: '2023-06-30',
          estado: 'PLAN',
        },
      ],
    },
  ],
  productos: [
    {
      id: 1,
      actividades: [
        {
          id: 2,
          codigo: 'ACT-002',
          descripcion: 'Elaboración del manual de usuario',
          fecha_inicio: '2023-05-01',
          fecha_fin: '2023-05-15',
          estado: 'COMP',
        },
      ],
    },
  ],
})

// Computed para los objetivos generales
const objetivosGenerales = computed(() => objetivos.value?.objetivos_generales)

// Computed para los objetivos especificos
const objetivosEspecificos = computed(() => objetivos.value?.objetivos_especificos)

// Computed para los resultados, productos e indicadores
const resultProdData = computed(
  () => resultProdIndicadores.value || { resultados: [], productos: [] },
)
const resultados = computed(() => resultProdData.value.resultados)
const productos = computed(() => resultProdData.value.productos)

// Computed para los resultados, productos y actividades
const resProdData = computed(() => resultProdActividades.value || { resultados: [], productos: [] })
const resultadosAct = computed(() => resProdData.value.resultados)
const productosAct = computed(() => resProdData.value.productos)

// Simular carga de datos
onMounted(async () => {
  await obtenerProyecto(idproyecto)
  setTimeout(() => {
    cargandoGeneral.value = false
  }, 1000)
})
</script>

<style scoped>
.marco-logico-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 16px;
}

/* Organización de filas y tarjetas */
.v-row {
  margin-bottom: 24px;
}

.v-card {
  padding: 24px 16px;
  margin-bottom: 24px;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.12);
}

/* Mejora la organización dentro del v-card */
.v-card :deep(.v-expansion-panels) {
  margin-top: 12px;
  margin-bottom: 16px;
}

/* Panel individual */
.v-expansion-panel {
  border-radius: 6px;
  margin-bottom: 6px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.2s ease;
}

/* Eliminar separación innecesaria en el último */
.v-expansion-panel:last-child {
  margin-bottom: 0;
}

/* Hover sutil */
.v-expansion-panel:hover {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

/* Organización interna de los niveles */
.v-expansion-panel-title {
  font-weight: 600;
  font-size: 1rem;
  padding: 12px 16px;
}

/* Espacio del contenido expandido */
.v-expansion-panel-text {
  padding: 12px 16px;
  background-color: #fafafa;
}

/* Ajustes en íconos */
.v-expansion-panel-title .v-icon {
  margin-right: 8px;
  color: #00695c;
}

/* Ajuste de hover en tarjetas grandes */
.v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

/* Contenedor del header */
.proyecto-header-container {
  margin-bottom: 24px;
}

/* Responsivo */
@media (max-width: 960px) {
  .marco-logico-container {
    padding: 16px 12px;
  }

  .v-card {
    margin-bottom: 16px;
  }
}
</style>
