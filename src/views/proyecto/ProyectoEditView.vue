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
        <ProyectoForm :edit-mode="true" :proyecto-id="idproyecto"></ProyectoForm>
      </v-col>
      <v-col cols="12" md="3" lg="3"> </v-col>
    </v-row>
  </v-container>
  {{ proyecto }}
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'
import ProyectoHeader from '@/modules/proyecto/components/partials/ProyectoHeader.vue'
//Composer Proyecto
import { useProyectoCrud } from '@/modules/proyecto/composables/useProyectoCrud'
import ProyectoForm from '@/modules/proyecto/components/ProyectoForm.vue'

//Inicializar las rutas y obtener el id de proyecto
const ruta = useRoute()
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
