<template>
  <v-container>
    <v-row>
      <!--Columna principal-->
      <v-col cols="12" md="9" lg="9">
        <v-card class="pa-4" elevation="2">
          <v-card-title class="text-h5 font-weight-bold">
            <v-icon left>mdi-notebook-multiple</v-icon>
            Lista de PEIs
          </v-card-title>
          <v-card-text>
            <!--Indicador de carga -->
            <v-progress-linear v-if="loading" indeterminate color="primary"></v-progress-linear>
            <!-- Indicador de error -->
            <v-alert v-if="error" type="error" variant="tonal" class="mb-4">
              {{ error }}
            </v-alert>
            <!-- Lista de PEIS-->
            <v-list v-if="peis.length > 0" class="py-0">
              <v-list-item
                v-for="item in peis"
                :key="item.id"
                :value="item"
                @click="navegarAlDetalle(item.id)"
                active-class="primary-light"
              >
                <template v-slot:prepend>
                  <v-avatar color="primary" variant="tonal">
                    <v-icon>mdi-notebook-edit</v-icon>
                  </v-avatar>
                </template>

                <v-list-item-title class="font-weight-medium">
                  {{ item.titulo }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ item.descripcion }}
                </v-list-item-subtitle>

                <template v-slot:append>
                  <v-btn
                    icon="mdi-pencil"
                    variant="text"
                    color="grey-darken-1"
                    @click.stop="editPei(item.id)"
                  ></v-btn>
                  <v-btn
                    icon="mdi-delete"
                    variant="text"
                    color="red-lighten-1"
                    @click.stop="confirmDelete(item)"
                  ></v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- Columna lateral -->
      <v-col cols="12" md="3" lg="3">
        <!-- Card de Acciones -->
        <v-card elevation="2">
          <v-card-title class="primary white--text">
            <v-icon left>mdi-cog</v-icon>
            Acciones
          </v-card-title>
          <v-list density="comfortable">
            <v-list-item
              to="/pei/nuevo"
              title="Nuevo PEI"
              prepend-icon="mdi-plus-circle"
              class="text-primary"
              @click="nuevoPei"
            ></v-list-item>
            <v-list-item
              title="Exportar lista"
              prepend-icon="mdi-file-export"
              @click="exportarLista"
            ></v-list-item>
          </v-list>
        </v-card>

        <v-spacer class="my-3"></v-spacer>

        <!-- Card de Estadísticas -->
        <v-card elevation="2">
          <v-card-title class="primary white--text">
            <v-icon left>mdi-chart-box</v-icon>
            Estadísticas
          </v-card-title>
          <v-card-text>
            <div class="d-flex justify-space-between">
              <span>Total PEIs:</span>
              <span class="font-weight-bold">{{ peis.length }}</span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Diálogo de confirmación para eliminar -->
    <v-dialog v-model="deleteDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h6">Confirmar eliminación</v-card-title>
        <v-card-text>
          ¿Está seguro que desea eliminar el PEI "{{ selectedPei?.titulo }}"?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="deleteDialog = false"> Cancelar </v-btn>
          <v-btn color="red" variant="tonal" @click="deletePei"> Eliminar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { usePeiStore } from '@/modules/pei/store/peiStore'
import { computed, onMounted, ref } from 'vue'

//Ruteador
const router = useRouter()
//El store de PEI
const peiStore = usePeiStore()

//Estados
const loading = ref(false)
const error = ref(null)
const deleteDialog = ref(false)
const selectedPei = ref(null)

//Propiedades computadas
const peis = computed(() => peiStore.peis) //Calcula la cantidad de PEIs registrados

onMounted(async () => {
  await cargarPeis()
})

//Metodo de carga
const cargarPeis = async () => {
  try {
    loading.value = true
    error.value = null
    await peiStore.obtenerPeis()
  } catch (err) {
    error.value = 'Error al cargar los PEIs: ' + (err.message || 'Intente nuevamente más tarde')
    console.error('Error al cargar los PEIs', err)
  } finally {
    loading.value = false
  }
}

//RUTAS DE NAVEGACION
const navegarAlDetalle = (id) => {
  router.push('/pei/' + id)
}
const nuevoPei = () => {
  router.push('/pei/nuevo')
}
const editPei = (id) => {
  router.push('/pei/editar/' + id)
}

const confirmDelete = (pei) => {
  selectedPei.value = pei
  deleteDialog.value = true
}

const deletePei = async () => {
  try {
    await peiStore.eliminarPei(selectedPei.value.id)
    deleteDialog.value = false
  } catch (err) {
    error.value = 'Error al eliminar el PEI: ' + (err.message || 'Intente nuevamente')
    console.error('Error deleting PEI:', err)
  }
}

const exportarLista = () => {
  alert('Exportar')
}
</script>

<style scoped>
.v-list-item {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.v-list-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.08);
}

.primary-light {
  background-color: rgba(var(--v-theme-primary), 0.1);
}

.v-card {
  border-radius: 8px;
}

.v-card-title {
  border-radius: 8px 8px 0 0;
}
</style>
