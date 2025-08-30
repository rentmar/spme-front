<template>
  <v-container>
    <!-- Overlay de carga -->
    <v-overlay :model-value="cargandoGeneral" class="align-center justify-center">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="mt-4 text-h6">Cargando proyecto...</p>
    </v-overlay>
    <v-row v-if="!cargandoGeneral">
      <v-col cols="12" md="9" lg="9" class="">
        <PaginaTituloIcono :titulo="'Editar'" :icon="'mdi-pencil'"></PaginaTituloIcono>
        <ProyectoHeader v-if="proyecto" :proyecto="proyecto"></ProyectoHeader>
        <FormularioEdicionProyecto v-if="proyecto" :proyecto="proyecto"></FormularioEdicionProyecto>
        <ActividadInformacion></ActividadInformacion>
      </v-col>
      <v-col cols="12" md="3" lg="3"> </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'
import ProyectoHeader from '@/modules/proyecto/components/partials/ProyectoHeader.vue'
import FormularioEdicionProyecto from '@/modules/editorEstructura/components/nodosFormularios/FormularioEdicionProyecto.vue'
import ProcedenciaFondosLista from '@/modules/procedenciaFondos/components/ProcedenciaFondosLista.vue'
import ActividadInformacion from '@/modules/proyecto/components/partials/ActividadInformacion.vue'
//Composer Proyecto
import { useProyectoCrud } from '@/modules/proyecto/composables/useProyectoCrud'
//Formularios
import KpiForm from '@/modules/proyecto/components/formularios/KpiForm.vue'

//Inicializar las rutas y obtener el id de proyecto
const ruta = useRoute()
console.log('no se',ruta)
const idproyecto = ruta.params.id

//Inicializar el composer
const { proyecto, obtenerProyecto, loading: cargandoProyecto } = useProyectoCrud()

//Estado de carga
const cargandoGeneral = computed(() => cargandoProyecto.value)
//const cargandoGeneral = computed(() => cargandoProyecto.value || cargandoResultProd.value)

//Hook
onMounted(async () => {
  await cargarDatos()
})

//Funcion de carga de stores
const cargarDatos = async () => {
  try {
    await obtenerProyecto(idproyecto)
  } catch (err) {
    console.log('Error al cargar la informacion', err)
  }
}
</script>
<style scoped></style>
