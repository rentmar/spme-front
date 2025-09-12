<template>
  <v-dialog v-model="isOpen" max-width="600" persistent>
    <v-card v-if="selectedNode">
      <v-toolbar color="primary" dark>
        <v-toolbar-title>
          Editando: {{ nodeTypes[selectedNode.type]?.label || selectedNode.type }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeEditor">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-form ref="form" @submit.prevent="saveChanges">
          <v-container>
            <template v-for="field in getFieldsForNodeType(selectedNode.type)" :key="field.key">
              <v-text-field
                v-if="field.type === 'text'"
                v-model="editableProperties[field.key]"
                :label="field.label"
                :rules="field.rules"
                outlined
                dense
                class="mt-3"
              ></v-text-field>

              <v-textarea
                v-else-if="field.type === 'textarea'"
                v-model="editableProperties[field.key]"
                :label="field.label"
                :rules="field.rules"
                outlined
                rows="3"
                class="mt-3"
              ></v-textarea>

              <v-select
                v-else-if="field.type === 'select'"
                v-model="editableProperties[field.key]"
                :items="field.items"
                :label="field.label"
                :rules="field.rules"
                outlined
                dense
                class="mt-3"
              ></v-select>
            </template>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text @click="closeEditor"> Cancelar </v-btn>
        <v-btn color="primary" @click="saveChanges"> Guardar Cambios </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useVueFlow } from '@vue-flow/core'

const { getNodes, updateNode } = useVueFlow()
const isOpen = ref(false)
const selectedNodeId = ref(null)
const form = ref(null)

// Esquema de campos por tipo de nodo
const nodeTypes = {
  objetivogeneral: {
    label: 'Objetivo General',
    fields: [
      { key: 'label', label: 'Título', type: 'text', rules: [(v) => !!v || 'Campo requerido'] },
      { key: 'descripcion', label: 'Descripción', type: 'textarea' },
      { key: 'prioridad', label: 'Prioridad', type: 'select', items: ['Alta', 'Media', 'Baja'] },
    ],
  },
  objetivoespecifico: {
    label: 'Objetivo Específico',
    fields: [
      { key: 'label', label: 'Título', type: 'text' },
      { key: 'indicador', label: 'Indicador', type: 'text' },
    ],
  },
  // Agregar más tipos según necesites
}

const editableProperties = ref({})

const selectedNode = computed(() => {
  return getNodes.value.find((node) => node.id === selectedNodeId.value)
})

watch(
  selectedNode,
  (node) => {
    if (node) {
      editableProperties.value = { ...node.data }
    }
  },
  { immediate: true },
)

const getFieldsForNodeType = (type) => {
  return nodeTypes[type]?.fields || []
}

const openEditor = (nodeId) => {
  selectedNodeId.value = nodeId
  isOpen.value = true
}

const closeEditor = () => {
  isOpen.value = false
  selectedNodeId.value = null
}

const saveChanges = async () => {
  const { valid } = await form.value.validate()

  if (valid && selectedNode.value) {
    updateNode(selectedNode.value.id, {
      data: {
        ...selectedNode.value.data,
        ...editableProperties.value,
      },
    })
    closeEditor()
  }
}

defineExpose({
  openEditor,
})
</script>
