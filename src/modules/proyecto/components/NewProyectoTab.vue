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
    <v-text-field variant="outlined" v-model="nuevoProyecto.codigo" label="Código" />
    <v-text-field
      variant="outlined"
      v-model="nuevoProyecto.titulo"
      label="Titulo del proyecto"
    ></v-text-field>
    <v-textarea
      variant="outlined"
      v-model="nuevoProyecto.descripcion"
      label="Descripcion"
    ></v-textarea>

    <v-divider class="my-4"></v-divider>

    <v-text-field
      label="Fecha de creacion"
      v-model="nuevoProyecto.fecha_creacion"
      type="date"
      variant="outlined"
    ></v-text-field>

    <v-text-field
      label="Fecha de inicio"
      v-model="nuevoProyecto.fecha_inicio"
      type="date"
      variant="outlined"
    ></v-text-field>

    <v-text-field
      label="Fecha de finalizacion"
      v-model="nuevoProyecto.fecha_finalizacion"
      type="date"
      variant="outlined"
    ></v-text-field>

    <v-divider class="my-4"></v-divider>

    <v-text-field
      label="Responsable"
      v-model="nuevoProyecto.registrado"
      variant="outlined"
    ></v-text-field>

    <v-select
      variant="outlined"
      v-model="nuevoProyecto.instancia_gestora"
      label="Instacia gestora"
      :items="instanciaOpciones"
    >
    </v-select>
  </v-card>
</template>

<script setup>
import { inject, ref } from 'vue'

const peiOpciones = [{ idpei: 1, pei: 'PEI 2024 - 2027' }]
const seleccionPei = ref(1)

const nuevoProyecto = inject('nuevoProyecto')

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
