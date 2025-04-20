<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="9" lg="9">
        <v-card class="pa-4">
          <v-card-title>Lista PEIs</v-card-title>
          <v-list>
            <v-list-item
              v-for="item in pei"
              :key="item.id"
              :value="item"
              @click="navigateToDetail(item.id)"
            >
              <template v-slot:prepend>
                <v-avatar color="primary">
                  <v-icon>mdi-notebook</v-icon>
                </v-avatar>
              </template>

              <v-list-item-title>{{ item.titulo }}</v-list-item-title>
              <v-list-item-subtitle>Descripcion: {{ item.descripcion }}</v-list-item-subtitle>

              <template v-slot:append>
                <v-btn icon="mdi-pencil" variant="text"></v-btn>
                <v-btn icon="mdi-delete" variant="text"></v-btn>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <v-col cols="12" md="3" lg="3">
        <v-card class="">
          <v-card-title class="primary white--text">
            <v-icon left>mdi-cog</v-icon>
            Acciones
          </v-card-title>
          <v-list density="comfortable">
            <v-list-item
              to=""
              title="Nuevo PEI"
              prepend-icon="mdi-plus-circle"
              class="text-primary"
            ></v-list-item>

            <v-list-item title="Exportar lista" prepend-icon="mdi-file-export"></v-list-item>
          </v-list>
        </v-card>
        <br />
        <v-card elevation="2">
          <v-card-title class="primary white--text">
            <v-icon left>mdi-chart-box</v-icon>
            Estadísticas
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
/*import { ref, onMounted } from 'vue'
import { getAllPeis } from '@/services/postService'

const pei = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    pei.value = await getAllPeis()
  } catch (err) {
    err.value = 'No se pudieron cargar los datos'
  } finally {
    loading.value = false
  }
})*/
</script>
<style scoped>
.v-list-item {
  cursor: pointer;
}

.v-list-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.asideCard {
  margin: 10px;
}
</style>
