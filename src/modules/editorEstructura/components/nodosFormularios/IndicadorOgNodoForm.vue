<template>
  <v-form @submit.prevent="guardar">
    <v-text-field
      v-model="formData.nodoProyecto.codigo"
      variant="outlined"
      label="Codigo"
      outlined
      dense
      clearable
      :rules="[(v) => !!v || 'Código requerido']"
    />
    <v-select
      v-model="formData.nodoProyecto.redaccion"
      variant="outlined"
      :items="redaccion_indicador"
      item-value="valor"
      item-title="etiqueta"
      label="Redaccion"
    ></v-select>

    <v-textarea
      v-model="formData.nodoProyecto.fuente_verificacion"
      variant="outlined"
      label="Fuentes de verificacion"
      outlined
      dense
      clearable
      rows="3"
    ></v-textarea>

    <v-text-field
      v-model="formData.nodoProyecto.target_poblacion"
      variant="outlined"
      label="Target poblacion"
      outlined
      dense
      clearable
      type="number"
    />
    <v-select
      v-model="formData.nodoProyecto.tipo"
      variant="outlined"
      :items="tipo_indicador"
      item-value="valor"
      item-title="etiqueta"
      label="Tipo de indicador"
    ></v-select>

    <v-text-field
      v-model="formData.nodoProyecto.baseline"
      variant="outlined"
      label="Baseline"
      outlined
      dense
      clearable
      type="number"
    />

    <v-text-field
      v-model="formData.nodoProyecto.target_q1"
      variant="outlined"
      label="Target q1"
      outlined
      dense
      clearable
    />

    <v-text-field
      v-model="formData.nodoProyecto.target_q2"
      variant="outlined"
      label="Target q2"
      outlined
      dense
      clearable
    />

    <v-text-field
      v-model="formData.nodoProyecto.target_q3"
      variant="outlined"
      label="Target q3"
      outlined
      dense
      clearable
    />

    <v-text-field
      v-model="formData.nodoProyecto.target_q4"
      variant="outlined"
      label="Target q4"
      outlined
      dense
      clearable
    />

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
import { useIndicadores } from '@/modules/proyecto/composables/useIndicadores'

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

//Inicar el composable
const { updateIndicadorObjetivoGeneral } = useIndicadores()
const { getNodes, getEdges, updateNode } = useVueFlow()
const { actualizarNodosEdges } = useDiagramaCrud()

//Selects del indicador
const tipo_indicador = SELECT_OPTIONS.tipos_indicador
const redaccion_indicador = SELECT_OPTIONS.redaccion_indicador

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
    const idindog = formData.value.nodoProyecto.id
    const idDiagrama = proyecto.value.mapa_nodo.id
    console.log(idindog)
    console.log(idDiagrama)
    await updateIndicadorObjetivoGeneral(idindog, formData.value.nodoProyecto)
    //await updateObjetivoEspecifico(idobjespog, formData.value)
    updateNode(formData.value.id, formData.value)
    await actualizarNodosEdges(idDiagrama, getNodes.value, getEdges.value)
    emit('guardar')
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
