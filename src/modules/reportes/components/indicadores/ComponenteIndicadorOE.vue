<template>
  <ComponenteBaseIndicador
    :datos="props.indicador.data.nodoProyecto"
    tipo="indicadoroe"
    icono="mdi-chart-line"
    tipo-texto="Indicador Objetivo Específico"
  >
    <template #formulario>
      <FormularioPorcentual
        v-if="props.indicador.data.nodoProyecto.tipo === '%'"
        v-model="avance"
        @validacion="valido = $event"
      />
      <FormularioNumerico
        v-else-if="props.indicador.data.nodoProyecto.tipo === '1-9'"
        v-model="avance"
        @validacion="valido = $event"
      />
      <FormularioLiteral
        v-else-if="props.indicador.data.nodoProyecto.tipo === 'A-Z'"
        v-model="avance"
        @validacion="valido = $event"
      />

      <v-btn color="primary" class="mt-4" @click="registrarAvance" :disabled="!valido" block>
        Registrar Avance
      </v-btn>
    </template>

    <template #historial>
      <HistorialAvanceIndicador
        :indicador-id="props.indicador.id"
        :tipo-indicador="props.indicador.data.nodoProyecto.tipo"
        :tipo="props.indicador.type"
      />
    </template>

    <template #grafica>
      <GraficaAvanceIndicador
        v-if="mostrarGrafica"
        :indicador-id="props.indicador.id"
        :tipo="props.indicador.data.nodoProyecto.tipo"
        :baseline="props.indicador.data.nodoProyecto.baseline"
      />
    </template>
  </ComponenteBaseIndicador>
</template>

<script setup>
import { ref, computed } from 'vue'
import ComponenteBaseIndicador from './ComponenteBaseIndicador.vue'
import FormularioPorcentual from '../partials-indicador-registro/FormularioPorcentual.vue'
import FormularioNumerico from '../partials-indicador-registro/FormularioNumerico.vue'
import FormularioLiteral from '../partials-indicador-registro/FormularioLiteral.vue'
import HistorialAvanceIndicador from './HistorialAvanceIndicador.vue'
import GraficaAvanceIndicador from './GraficaAvanceIndicador.vue'

const props = defineProps({
  indicador: {
    type: Object,
    required: true,
  },
})

const avance = ref({})
const valido = ref(false)

const mostrarGrafica = computed(() => {
  return (
    props.indicador.data.nodoProyecto.tipo === '1-9' ||
    props.indicador.data.nodoProyecto.tipo === '%'
  )
})

const registrarAvance = () => {
  console.log('Registrando avance para indicador OE:', {
    indicadorId: props.indicador.id,
    datos: avance.value,
  })
}
</script>
