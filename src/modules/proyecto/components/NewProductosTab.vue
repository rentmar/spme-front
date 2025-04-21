<template>
  <v-card class="my-card">
    <v-card-item>
      <v-card-title class="d-flex justify-space-between align-center mb-4">
        <span>Productos del Proyecto: {{ nuevoProyecto.titulo }}</span>
        <v-btn icon @click="addProducto" color="primary" size="small" :disabled="editing">
          <v-icon>mdi-plus</v-icon>
          <v-tooltip activator="parent" location="top">Agregar producto</v-tooltip>
        </v-btn>
      </v-card-title>
      <v-card-subtitle> Código: {{ nuevoProyecto.codigo }} </v-card-subtitle>
    </v-card-item>

    <v-card-text>
      <v-tabs v-model="activeTab">
        <v-tab
          v-for="(prod, index) in nuevoProyecto.productos"
          :key="'prod-' + index"
          :value="'product-' + index"
          :disabled="editing"
        >
          <v-icon start>mdi-package-variant</v-icon>
          Producto {{ prod.codigo }}
          <v-btn
            icon="mdi-close"
            size="x-small"
            variant="text"
            @click.stop="removeProducto(index)"
            class="ml-2"
            :disabled="editing"
          ></v-btn>
        </v-tab>
      </v-tabs>

      <v-window v-model="activeTab">
        <v-window-item
          v-for="(prod, index) in nuevoProyecto.productos"
          :key="'prod-content-' + index"
          :value="'product-' + index"
        >
          <v-card flat class="pa-4">
            <v-text-field
              :model-value="prod.codigo"
              label="Código"
              variant="outlined"
              readonly
              disabled
            ></v-text-field>
            <v-textarea
              v-model="prod.descripcion"
              label="Descripción"
              rows="3"
              variant="outlined"
              :readonly="editing"
            ></v-textarea>
            <v-textarea
              v-model="prod.supuestos"
              label="Supuestos"
              variant="outlined"
              :readonly="editing"
              rows="2"
            ></v-textarea>
            <v-textarea
              v-model="prod.riesgos"
              label="Riesgos"
              variant="outlined"
              :readonly="editing"
              rows="2"
            ></v-textarea>
          </v-card>
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, inject, watch } from 'vue'

const nuevoProyecto = inject('nuevoProyecto')
const activeTab = ref(0)
const editing = ref(false)

// Función para formatear el número con ceros a la izquierda
const formatProductNumber = (num) => {
  return num < 10 ? `P0${num}` : `P${num}`
}

// Inicializar códigos automáticos P01, P02, etc.
watch(
  () => nuevoProyecto.productos,
  (productos) => {
    productos.forEach((prod, index) => {
      if (!prod.codigo || !prod.codigo.startsWith('P')) {
        prod.codigo = formatProductNumber(index + 1)
      }
    })
  },
  { immediate: true, deep: true },
)

const addProducto = () => {
  const newIndex = nuevoProyecto.productos.length + 1
  nuevoProyecto.productos.push({
    codigo: formatProductNumber(newIndex),
    descripcion: '',
    supuestos: '',
    riesgos: '',
  })
  activeTab.value = 'product-' + (nuevoProyecto.productos.length - 1)
}

const removeProducto = (index) => {
  nuevoProyecto.productos.splice(index, 1)

  // Reindexar los códigos
  nuevoProyecto.productos.forEach((prod, idx) => {
    prod.codigo = formatProductNumber(idx + 1)
  })

  // Ajustar tab activo si es necesario
  if (activeTab.value === `product-${index}`) {
    activeTab.value =
      nuevoProyecto.productos.length > 0 ? `product-${Math.max(0, index - 1)}` : null
  }
}
</script>

<style scoped>
.my-card {
  margin: 20px;
}
.v-tab {
  min-width: 160px;
}
</style>
