<template>
  <v-card title="Proyecto" subtitle="Informacion General">
    <v-select
      variant="outlined"
      v-model="seleccionPei"
      :items="peiOpciones"
      item-title="pei"
      item-value="idpei"
      label="Pertenece a"
      readonly
    ></v-select>
    <v-text-field
      variant="outlined"
      v-model="nuevoProyectoStore.nuevoProyecto.proyecto.codigo"
      label="Código"
      required
    />
    <v-text-field
      variant="outlined"
      v-model="nuevoProyectoStore.nuevoProyecto.proyecto.titulo"
      label="Titulo del proyecto"
    ></v-text-field>
    <v-textarea
      variant="outlined"
      v-model="nuevoProyectoStore.nuevoProyecto.proyecto.descripcion"
      label="Descripcion"
    ></v-textarea>

    <v-divider class="my-4"></v-divider>

    <v-text-field
      label="Fecha de creacion"
      v-model="nuevoProyectoStore.nuevoProyecto.proyecto.fecha_creacion"
      type="date"
      variant="outlined"
    ></v-text-field>

    <v-text-field
      label="Fecha de inicio"
      v-model="nuevoProyectoStore.nuevoProyecto.proyecto.fecha_inicio"
      type="date"
      variant="outlined"
    ></v-text-field>

    <v-text-field
      label="Fecha de finalizacion"
      v-model="nuevoProyectoStore.nuevoProyecto.proyecto.fecha_finalizacion"
      type="date"
      variant="outlined"
    ></v-text-field>

    <v-divider class="my-4"></v-divider>

    <v-text-field
      label="Responsable"
      v-model="nuevoProyectoStore.nuevoProyecto.proyecto.registrado"
      variant="outlined"
    ></v-text-field>

    <v-select
      variant="outlined"
      v-model="nuevoProyectoStore.nuevoProyecto.proyecto.instancia_gestora"
      label="Instacia gestora"
      :items="instanciaOpciones"
    >
    </v-select>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
import { useNuevoProyectoStore } from '../store/nuevoProyectoStore'

const nuevoProyectoStore = useNuevoProyectoStore()

const peiOpciones = [{ idpei: 1, pei: 'PEI 2024 - 2027' }]
const seleccionPei = ref(1)

const instanciaOpciones = [
  'Direccion ejecutiva',
  'Comunicacion',
  'Planificacion, monitoreo y evaluacion',
  'Desarrollo de redes',
  'Programa urbano',
  'Programa Nina',
  'Programa defensores',
  'Administracion',
]
</script>

<style scoped></style>
