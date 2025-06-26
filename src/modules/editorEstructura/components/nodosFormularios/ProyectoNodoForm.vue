<template>
  <v-form @submit.prevent="guardar">
    <v-text-field
      v-model="formData.datosNodo.codigo"
      variant="outlined"
      label="Código"
      outlined
      dense
      clearable
      :rules="[(v) => !!v || 'Código requerido']"
    />

    <v-text-field
      v-model="formData.datosNodo.titulo"
      variant="outlined"
      label="Titulo"
      outlined
      dense
      clearable
    />
    <v-textarea
      v-model="formData.datosNodo.descripcion"
      variant="outlined"
      label="Titulo"
      outlined
      dense
      clearable
    />

    <v-text-field
      label="Fecha de inicio"
      v-model="formData.datosNodo.fecha_inicio"
      type="date"
      variant="outlined"
    ></v-text-field>

    <v-text-field
      label="Fecha de finalizacion"
      v-model="formData.datosNodo.fecha_finalizacion"
      type="date"
      variant="outlined"
    ></v-text-field>

    <v-select
      v-model="formData.datosNodo.instancia_gestora"
      variant="outlined"
      :items="ig"
      multiple
      chips
      item-value="id"
      item-title="instancia"
      label="Instancia gestora"
      clearable
    ></v-select>

    <v-text-field
      v-model="formData.datosNodo.presupuesto"
      variant="outlined"
      label="Presupuesto"
      outlined
      dense
      clearable
    />

    <v-select
      v-model="formData.datosNodo.estado"
      variant="outlined"
      :items="estadoProyecto"
      item-value="valor"
      item-title="etiqueta"
      label="Estado del Proyecto"
      clearable
    ></v-select>

    <v-card-actions>
      <v-spacer />
      <v-btn color="error" text @click="confirmarEliminar" v-if="!esNuevo"> Eliminar </v-btn>
      <v-btn color="error" text @click="$emit('cancelar')">Cancelar</v-btn>
      <v-btn color="primary" type="submit" :loading="guardando">
        {{ esNuevo ? 'Crear' : 'Guardar' }}
      </v-btn>
    </v-card-actions>

    <!-- Diálogo de confirmación para eliminar -->
    <v-dialog v-model="dialogoEliminar" max-width="400">
      <v-card>
        <v-card-title class="text-h6">
          <v-icon left color="error">mdi-alert-circle</v-icon>
          Confirmar eliminación
        </v-card-title>
        <v-card-text> ¿Está seguro que desea eliminar este elemento? </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" variant="text" @click="dialogoEliminar = false"> Cancelar </v-btn>
          <v-btn color="error" variant="flat" @click="eliminar"> Confirmar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-form>
</template>

<script setup>
import { ref, computed, watch, inject } from 'vue'
import { useVueFlow } from '@vue-flow/core'
import { useDiagramaCrud } from '../../composables/useDiagramaCrud'
import { SELECT_OPTIONS } from '@/utility/selectOptions'
import { useProyectoCrud } from '@/modules/proyecto/composables/useProyectoCrud'

//Props del componente
const props = defineProps({
  node: {
    type: Object,
    required: true,
    default: () => ({
      id: null,
      data: {
        nodoProyecto: {
          codigo: '',
          descripcion: '',
        },
      },
    }),
  },
})

//Instancia gestora
const ig = SELECT_OPTIONS.instancia_gestora
//Estado
const estadoProyecto = SELECT_OPTIONS.estado

//Inicar el composable
const { updateProyecto } = useProyectoCrud()
const { getNodes, getEdges, updateNode } = useVueFlow()
const { actualizarNodosEdges } = useDiagramaCrud()

//Definir señales
const emit = defineEmits(['guardar', 'cancelar', 'eliminar'])

//Estructura del proyecto
const proyecto = inject('proyectoEstructura')

// Estado del formulario
const formData = ref({ ...props.node.data })
const guardando = ref(false)
const dialogoEliminar = ref(false)

// Determina si es un nuevo nodo o una edición
const esNuevo = computed(() => !props.node.id)

// Watcher para actualizar cuando cambia el nodo
watch(
  () => props.node,
  (newNode) => {
    formData.value = { ...newNode.data }
  },
  { deep: true },
)

// Método para guardar (Create/Update)
const guardar = async () => {
  try {
    const idobjgral = formData.value.datosNodo.id
    const idDiagrama = proyecto.value.mapa_nodo.id
    console.log(idobjgral)
    console.log(idDiagrama)
    console.log('Form data')
    console.log(formData.value.datosNodo)
    await updateProyecto(idobjgral, formData.value.datosNodo)
    //await updateObjetivoGeneral(idobjgral, formData.value)
    await updateNode(formData.value.id, formData.value)
    await actualizarNodosEdges(idDiagrama, getNodes.value, getEdges.value)
    emit('guardar')

    /*const idkpi = formData.value.nodoProyecto.id
    console.log(idkpi)
    const idDiagrama = proyecto.value.mapa_nodo.id
    console.log(proyecto)
    await updateKpi(idkpi, formData.value.nodoProyecto)
    updateNode(formData.value.id, formData.value)
    await actualizarNodosEdges(idDiagrama, getNodes.value, getEdges.value)*/
  } catch (err) {
    console.error('Update informacion', err)
  }

  //emit('guardar', { data: formData.value })
  // guardando.value = true

  // try {
  //   let respuesta

  //   if (esNuevo.value) {
  //     // Operación CREATE
  //     respuesta = await axios.post('/api/proyectos', formData.value)
  //     console.log('Nuevo proyecto creado:', respuesta.data)
  //   } else {
  //     // Operación UPDATE
  //     respuesta = await axios.put(`/api/proyectos/${props.node.id}`, formData.value)
  //     console.log('Proyecto actualizado:', respuesta.data)
  //   }

  //   // Emitir los datos guardados (puedes usar respuesta.data si el backend devuelve el objeto actualizado)
  //   emit('guardar', {
  //     ...props.node,
  //     data: formData.value
  //   })

  // } catch (error) {
  //   console.error('Error al guardar:', error)
  //   // Aquí podrías mostrar un mensaje de error al usuario
  // } finally {
  //   guardando.value = false
  // }
}

// Método para confirmar eliminación
const confirmarEliminar = () => {
  dialogoEliminar.value = true
}

// Método para eliminar (Delete)
const eliminar = async () => {
  dialogoEliminar.value = false
  guardando.value = true
}
</script>
