<template>
  <div>
    <v-textarea label="Objetivo General" hint="codigo" clearable variant="outlined"></v-textarea>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

//props del componente
const props = defineProps({
  datosEstructura: { type: Object, required: true },
})

console.log(props.datosEstructura)

//Estado del componente
const objetivogeneral = ref()
const objetivoespecifico = ref()
const objetivoespecificoog = ref()
const resultadoog = ref()
const resultadooe = ref()
const productooe = ref()
const productoroe = ref()
const producto = ref()

//Funcion para el llenado de datos:
const llenarDatos = (datosFiltrados) => {
  if (datosFiltrados && datosFiltrados.datosProcedencia) {
    // Asigna los datos a la propiedad .value de cada ref
    objetivogeneral.value = datosFiltrados.datosProcedencia.objetivogeneral
    objetivoespecifico.value = datosFiltrados.datosProcedencia.objetivoespecifico
    objetivoespecificoog.value = datosFiltrados.datosProcedencia.objetivoespecificoog
    resultadoog.value = datosFiltrados.datosProcedencia.resultadoog
    resultadooe.value = datosFiltrados.datosProcedencia.resultadooe
    productooe.value = datosFiltrados.datosProcedencia.productoe
    productoroe.value = datosFiltrados.datosProcedencia.productoroe
    producto.value = datosFiltrados.datosProcedencia.producto
  }
}

//Funcion para el filtrado de datos existentes
function filtrarDatosPorTipo(data, tiposAFiltrar) {
  // Objeto para almacenar los resultados filtrados
  const datosFiltrados = {
    datosProcedencia: {},
  }

  // 1. Filtrar los elementos de "datosProcedencia"
  for (const key in data.datosProcedencia) {
    if (Object.prototype.hasOwnProperty.call(data.datosProcedencia, key)) {
      // Verifica si la clave del objeto está en la lista de tipos a filtrar
      if (tiposAFiltrar.includes(key)) {
        datosFiltrados.datosProcedencia[key] = data.datosProcedencia[key]
      }
    }
  }

  return datosFiltrados
}

// Lista de tipos para filtrar
const tiposDeFiltro = [
  'objetivogeneral',
  'objetivoespecifico',
  'objetivoespecificoog',
  'resultadoog',
  'resultadooe',
  'productooe',
  'productoroe',
  'producto',
]

//Datos filtrados
const datosFiltrados = ref()

const emit = defineEmits('enviarFormulario')

//Cargar la informacion del componente
onMounted(() => {
  if (props.datosEstructura) cargarDatos()
})

const cargarDatos = async () => {
  datosFiltrados.value = filtrarDatosPorTipo(props.datosEstructura, tiposDeFiltro)
  console.log('Datos filtrados')
  console.log(datosFiltrados)
  llenarDatos(datosFiltrados.value)
  console.log('objetivo general')
  console.log(objetivogeneral.value)
  console.log('objetivo especifico')
  console.log(objetivoespecifico.value)
  console.log('objetivoespecificoog')
  console.log(objetivoespecificoog.value)
  console.log('resultadoog')
  console.log(resultadoog.value)
  console.log('resultadooe')
  console.log(resultadooe.value)
  console.log('productooe')
  console.log(productooe.value)
  console.log('productoroe')
  console.log(productoroe.value)
  console.log('producto')
  console.log(producto.value)
}
</script>

<style scoped></style>
