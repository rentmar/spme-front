<template>
  <v-form>
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          :model-value="modelValue.indicador"
          @update:modelValue="updateField('indicador', $event)"
          label="Indicador"
          variant="outlined"
          required
        ></v-text-field>
      </v-col>

      <v-col cols="12" md="3">
        <v-select
          :model-value="modelValue.tipo"
          @update:modelValue="updateField('tipo', $event)"
          label="Tipo de indicador"
          :items="['SMART', 'GUIA']"
          variant="outlined"
          required
        ></v-select>
      </v-col>

      <v-col cols="12" md="3">
        <v-select
          :model-value="modelValue.tipo_valor"
          @update:modelValue="updateField('tipo_valor', $event)"
          label="Tipo de valor"
          :items="['%', '1-9', 'A-Z']"
          variant="outlined"
          required
        ></v-select>
      </v-col>

      <!-- Campos de relación según el tipo de indicador -->
      <v-col cols="12" md="6" v-if="tipo === 'especifico'">
        <v-select
          :model-value="modelValue.relacionObjEspecifico"
          @update:modelValue="updateField('relacionObjEspecifico', $event)"
          :items="objetivosEspecificos"
          item-title="descripcion"
          item-value="codigo"
          label="Relacionado con Objetivo Específico"
          variant="outlined"
          clearable
        ></v-select>
      </v-col>

      <v-col cols="12" md="6" v-if="tipo === 'resultado'">
        <v-select
          :model-value="modelValue.relacionResultado"
          @update:modelValue="updateField('relacionResultado', $event)"
          :items="resultados"
          item-title="descripcion"
          item-value="codigo"
          label="Relacionado con Resultado"
          variant="outlined"
          clearable
        ></v-select>
      </v-col>

      <v-col cols="12" md="6" v-if="tipo === 'producto'">
        <v-select
          :model-value="modelValue.relacionProducto"
          @update:modelValue="updateField('relacionProducto', $event)"
          :items="productos"
          item-title="descripcion"
          item-value="codigo"
          label="Relacionado con Producto"
          variant="outlined"
          clearable
        ></v-select>
      </v-col>

      <!-- Resto de los campos con el mismo patrón -->
      <v-col cols="12">
        <v-textarea
          :model-value="modelValue.verificacion"
          @update:modelValue="updateField('verificacion', $event)"
          label="Medios de verificación"
          variant="outlined"
          rows="2"
          required
        ></v-textarea>
      </v-col>

      <!-- Resto de los campos... -->
    </v-row>
  </v-form>
</template>

<script setup>
import { inject } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  tipo: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

// Inyectamos los arrays de opciones para los selects de relación
const objetivosEspecificos = inject('objetivosEspecificos', [])
const resultados = inject('resultados', [])
const productos = inject('productos', [])

const updateField = (field, value) => {
  emit('update:modelValue', { ...props.modelValue, [field]: value })
}
</script>
