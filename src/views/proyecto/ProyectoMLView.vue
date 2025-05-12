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
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import CargaCircular from '@/components/layout/partials/CargaCircular.vue'
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'
import ProyectoHeader from '@/modules/proyecto/components/partials/ProyectoHeader.vue'
import NivelMLObjGral from '@/modules/MarcoLogico/NivelMLObjGral.vue'
import NivelMLObjEspec from '@/modules/MarcoLogico/NivelMLObjEspec.vue'
import NivelMLResultado from '@/modules/MarcoLogico/NivelMLResultado.vue'
import NivelMLProductos from '@/modules/MarcoLogico/NivelMLProductos.vue'

import { useProyectoStore, useResultProductStore } from '@/modules/proyecto/store/proyectoStore'

// Obtener el ID del proyecto desde la ruta
const route = useRoute()
const idProyecto = route.params.id

// Inicializar los stores
const proyectoStore = useProyectoStore()
const resultProdStore = useResultProductStore()

// Desestructurar referencias
const {
  proyectoActual: proyecto,
  objetivosIndicadores: objetivos,
  cargando: cargandoProyecto,
} = storeToRefs(proyectoStore)

const {
  resulProductIndicadoresIdProyecto: resultProdIndicadores,
  resultProdActividadesIdProyecto: resultProdActividades,
  cargando: cargandoResultProd,
} = storeToRefs(resultProdStore)

// Desestructurar funciones
const { obtenerProyectoPorId, objetivosIndPorIdProyecto } = proyectoStore
const { proyResultProdIndPorIdProyecto, proyResultProdActividadesPorIdProyecto } = resultProdStore

// Estado de carga general
const cargandoGeneral = computed(() => cargandoProyecto.value || cargandoResultProd.value)

// Computed para los objetivos generales
const objetivosGenerales = computed(() => objetivos.value?.objetivos_generales)
//Computed para los objetivos especificos
const objetivosEspecificos = computed(() => objetivos.value?.objetivos_especificos)
//Computed para los resultados, productos e indicadores
//Comprobar los valores
const resultProdData = computed(
  () => resultProdIndicadores.value?.data || { resultados: [], productos: [] },
)
//Separar los valores
const resultados = computed(() => resultProdData.value.resultados)
const productos = computed(() => resultProdData.value.productos)

//Computed para los resultados, productos y actividades
//Comprobar los valores
const resProdData = computed(
  () => resultProdActividades.value?.data || { resultados: [], productos: [] },
)
//Separar los valores
const resultadosAct = computed(() => resProdData.value.resultados)
const productosAct = computed(() => resProdData.value.productos)

// Hook montado
onMounted(async () => {
  await cargarDatos()
})

// Función para cargar datos
const cargarDatos = async () => {
  try {
    await Promise.all([
      obtenerProyectoPorId(idProyecto),
      objetivosIndPorIdProyecto(idProyecto),
      proyResultProdIndPorIdProyecto(idProyecto),
      proyResultProdActividadesPorIdProyecto(idProyecto),
    ])
  } catch (error) {
    console.error('Error al cargar la información de los stores:', error)
  }
}
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
  margin-bottom: 6px; /* Antes era 8px */
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
  color: #00695c; /* teal-darken-2 */
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
