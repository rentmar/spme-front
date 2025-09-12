<template>
  <v-form @submit.prevent="guardar">
    <v-text-field
      v-model="formData.data.datosNodo.codigo"
      variant="outlined"
      label="Código"
      outlined
      dense
      clearable
      :rules="[(v) => !!v || 'Código requerido']"
    />
    <v-text-field
      v-model="formData.data.datosNodo.titulo"
      variant="outlined"
      label="Titulo"
      outlined
      dense
      clearable
    />
    <v-textarea
      v-model="formData.data.datosNodo.descripcion"
      variant="outlined"
      label="Descripcion"
      outlined
      dense
      clearable
    />

    <v-text-field
      label="Fecha de inicio"
      v-model="formData.data.datosNodo.fecha_inicio"
      type="date"
      variant="outlined"
    ></v-text-field>

    <v-text-field
      label="Fecha de finalizacion"
      v-model="formData.data.datosNodo.fecha_finalizacion"
      type="date"
      variant="outlined"
    ></v-text-field>

    <v-select
      v-model="formData.data.datosNodo.instancia_gestora"
      variant="outlined"
      :items="opcionesInstanciaGestora"
      multiple
      chips
      item-value="id"
      item-title="instancia"
      label="Instancia gestora"
      clearable
    ></v-select>

    <v-text-field
      v-model="formData.data.datosNodo.presupuesto"
      variant="outlined"
      label="Presupuesto"
      outlined
      dense
      clearable
    />

    <v-select
      v-model="formData.data.datosNodo.estado"
      variant="outlined"
      :items="estadoProyecto"
      item-value="valor"
      item-title="etiqueta"
      label="Estado del Proyecto"
      clearable
    ></v-select>

    <v-select
      v-model="formData.data.datosNodo.procedencia_fondos"
      variant="outlined"
      :items="opcionesEntidadFinanciera"
      item-value="id"
      item-title="financiera"
      label="Procedencia de Fondos"
      multiple
      chips
      clearable
    ></v-select>
    <div class="d-flex gap-2">
      <v-btn type="submit" color="primary" :loading="guardando" prepend-icon="mdi-content-save">
        Guardar Cambios
      </v-btn>
      <v-btn color="secondary" @click="cancelar" prepend-icon="mdi-close"> Cancelar </v-btn>
    </div>
  </v-form>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { SELECT_OPTIONS } from '@/utility/selectOptions'
import { useProcedenciaFondos } from '@/modules/proyecto/composables/useProcedenciaFondos'
import { useInstanciaGestora } from '@/modules/instanciaGestora/composables/useInstanciaGestora'

//Props del componente
const props = defineProps({
  node: {
    type: Object,
    required: true,
    default: () => ({
      id: null,
      data: {
        datosNodo: {
          codigo: '',
          descripcion: '',
        },
      },
    }),
  },
})

//Estado
const estadoProyecto = SELECT_OPTIONS.estado

//Iniciarar composables
const { fetchOptions, opcionesEntidadFinanciera } = useProcedenciaFondos()
const { fetchOptionsInstancias, opcionesInstanciaGestora } = useInstanciaGestora()

//Definir señales
const emit = defineEmits(['guardar', 'cancelar'])

// Estado del formulario
const formData = ref({ ...props.node })
const guardando = ref(false)

// Método para guardar (Create/Update)
const guardar = async () => {
  emit('guardar', formData.value)
}

const cancelar = async () => {
  emit('cancelar')
}

//Cargar informacion para el llenado
onMounted(async () => {
  cargarDatos()
})

const isLoading = ref(false)
const cargarDatos = async () => {
  isLoading.value = true
  try {
    await Promise.all([fetchOptions(), fetchOptionsInstancias()])
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.estructura-proyecto-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 16px;
}

.v-card {
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.full-width-header {
  width: 100%;
  margin-bottom: 0;
}

.h-100 {
  height: 100%;
}

.v-card--hover {
  cursor: pointer;
  transition: all 0.3s ease;
}

.v-card--hover:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15) !important;
}

.nodo-seleccionado {
  border-left: 4px solid rgb(var(--v-theme-primary)) !important;
  background-color: rgba(var(--v-theme-primary), 0.05);
}

.conexion-chip {
  border-radius: 16px;
}

.gap-2 {
  gap: 8px;
}

.relacion-destacada {
  border-left: 3px solid rgb(var(--v-theme-primary)) !important;
  background-color: rgba(var(--v-theme-primary), 0.03);
}

/* Estilos para las tablas */
:deep(.v-data-table) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.v-data-table-header) {
  background-color: #f5f5f5;
}

:deep(.v-data-table-header th) {
  font-weight: 600;
  color: rgba(0, 0, 0, 0.87);
}

/* Mejora la apariencia de los chips */
.v-chip {
  font-weight: 500;
}

/* Ajustes para los diálogos */
.v-dialog .v-card {
  border-radius: 12px;
}

.v-dialog .v-card-title {
  background-color: rgb(var(--v-theme-primary));
  color: white;
  padding: 16px 24px;
}

.v-dialog .v-card-actions {
  padding: 16px 24px;
}

/* Responsividad */
@media (max-width: 960px) {
  .estructura-proyecto-container {
    padding: 16px 12px;
  }

  .v-col {
    margin-bottom: 16px;
  }

  .v-data-table {
    overflow-x: auto;
  }
}
</style>
