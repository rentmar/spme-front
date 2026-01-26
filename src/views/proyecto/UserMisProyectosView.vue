<template>
  <v-container class="user-projects-container">
    <!-- Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold">
          <v-icon color="primary" class="mr-2">mdi-folder-multiple</v-icon>
          Mis Proyectos
        </h1>
        <p class="text-subtitle-1 text-medium-emphasis">
          Gestiona y accede rápidamente a tus proyectos
        </p>
      </v-col>
    </v-row>

    <!-- Estadísticas rápidas -->
    <v-row class="mb-8">
      <v-col cols="12" md="4">
        <v-card color="primary" class="stat-card" height="120">
          <v-card-text class="d-flex align-center justify-space-between">
            <div>
              <div class="text-h5 font-weight-bold white--text">
                {{ totalProyectos }}
              </div>
              <div class="text-subtitle-1 white--text">Proyectos Totales</div>
            </div>
            <v-icon color="white" size="48">mdi-folder</v-icon>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- <v-col cols="12" md="4">
        <v-card color="green" class="stat-card" height="120">
          <v-card-text class="d-flex align-center justify-space-between">
            <div>
              <div class="text-h5 font-weight-bold white--text">
                {{ proyectosConNivel(3).length }}
              </div>
              <div class="text-subtitle-1 white--text">Con Administración</div>
            </div>
            <v-icon color="white" size="48">mdi-shield-account</v-icon>
          </v-card-text>
        </v-card>
      </v-col> -->

      <!-- <v-col cols="12" md="4">
        <v-card color="blue" class="stat-card" height="120">
          <v-card-text class="d-flex align-center justify-space-between">
            <div>
              <div class="text-h5 font-weight-bold white--text">
                {{ proyectosConNivel(2).length }}
              </div>
              <div class="text-subtitle-1 white--text">Con Edición</div>
            </div>
            <v-icon color="white" size="48">mdi-pencil</v-icon>
          </v-card-text>
        </v-card>
      </v-col> -->
    </v-row>

    <!-- Filtros y búsqueda -->
    <v-row class="mb-4">
      <v-col cols="12">
        <v-text-field
          v-model="searchQuery"
          label="Buscar proyectos..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          clearable
          hide-details
        />
      </v-col>

      <!-- <v-col cols="12" md="6">
        <v-select
          v-model="selectedNivel"
          :items="filtrosNivel"
          label="Filtrar por nivel de acceso"
          variant="outlined"
          clearable
          hide-details
        />
      </v-col> -->
    </v-row>

    <!-- Grid de proyectos -->
    <v-row v-if="filteredProjects.length > 0">
      <v-col v-for="proyecto in filteredProjects" :key="proyecto.id" cols="12" md="6" lg="4">
        <v-card class="project-card" :class="getCardClass(proyecto.nivel_acceso)" elevation="2">
          <v-card-title class="d-flex align-start">
            <div class="flex-grow-1">
              <div class="d-flex align-center mb-1">
                <v-icon :color="getNivelColor(proyecto.nivel_acceso)" class="mr-2">
                  {{ getNivelIcon(proyecto.nivel_acceso) }}
                </v-icon>
                <span class="text-h6 font-weight-bold">{{ proyecto.codigo }}</span>
              </div>
              <!-- <div class="text-subtitle-2 text-medium-emphasis">
                {{ getNivelDisplay(proyecto.nivel_acceso) }}
              </div> -->
            </div>
            <!-- <v-chip :color="getNivelColor(proyecto.nivel_acceso)" size="small" class="ml-2">
              {{ proyecto.nivel_acceso_display }}
            </v-chip> -->
          </v-card-title>

          <v-card-text>
            <p class="text-body-1 mb-4">{{ proyecto.titulo }}</p>

            <div class="project-meta">
              <div class="d-flex align-center mb-2">
                <v-icon size="small" class="mr-2">mdi-identifier</v-icon>
                <span class="text-caption">ID: {{ proyecto.id }}</span>
              </div>

              <!-- <div class="d-flex align-center">
                <v-icon size="small" class="mr-2">mdi-account-key</v-icon>
                <span class="text-caption">Nivel: {{ proyecto.nivel_acceso }}</span>
              </div> -->
            </div>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions class="px-4 py-3">
            <v-btn
              color="primary"
              variant="text"
              size="small"
              :to="`/proyecto/${proyecto.id}/planificar`"
            >
              <v-icon left>mdi-calendar-edit</v-icon>
              Planificación
            </v-btn>

            <v-spacer></v-spacer>
            <!--
            <v-btn
              v-if="proyecto.nivel_acceso >= 2"
              color="green"
              variant="text"
              size="small"
              :to="`/proyectos/${proyecto.id}/editar`"
            >
              <v-icon left>mdi-pencil</v-icon>
              Editar
            </v-btn> -->
            <!--
            <v-btn
              v-if="proyecto.nivel_acceso >= 3"
              color="red"
              variant="text"
              size="small"
              :to="`/proyectos/${proyecto.id}/administrar`"
            >
              <v-icon left>mdi-cog</v-icon>
              Administrar
            </v-btn> -->
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Estado vacío -->
    <v-row v-else>
      <v-col cols="12">
        <v-card class="text-center py-12" elevation="0">
          <v-icon size="64" color="grey-lighten-1" class="mb-4"> mdi-folder-off </v-icon>
          <h3 class="text-h5 mb-2">No hay proyectos disponibles</h3>
          <p class="text-body-1 text-medium-emphasis mb-6">
            No tienes acceso a ningún proyecto o no coinciden con los filtros aplicados.
          </p>
          <v-btn color="primary" @click="resetFilters">
            <v-icon left>mdi-filter-remove</v-icon>
            Limpiar filtros
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- Sidebar de ayuda -->
    <!-- <v-navigation-drawer v-model="showHelp" location="right" width="400" temporary>
      <v-toolbar color="primary" dark>
        <v-toolbar-title>Ayuda - Niveles de Acceso</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="showHelp = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-list class="pa-4">
        <v-list-item v-for="nivel in nivelesAccesoDetalle" :key="nivel.id">
          <template v-slot:prepend>
            <v-icon :color="nivel.color">{{ nivel.icon }}</v-icon>
          </template>
          <v-list-item-title class="font-weight-medium">
            {{ nivel.nombre }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ nivel.descripcion }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-navigation-drawer> -->

    <!-- FAB para ayuda -->
    <!-- <v-fab
      v-model="showFab"
      location="bottom right"
      size="large"
      color="primary"
      icon="mdi-help-circle"
      @click="showHelp = true"
    /> -->
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserPermissions } from '@/stores/useUserPermissions'

// Estado
const searchQuery = ref('')
const selectedNivel = ref(null)
const showHelp = ref(false)
const showFab = ref(true)

const userPermissions = useUserPermissions()

// Computed
const totalProyectos = computed(() => {
  return userPermissions.proyectosAccesibles?.length || 0
})

// Función para filtrar proyectos por nivel
const proyectosConNivel = (nivel) => {
  if (!userPermissions.proyectosAccesibles) return []
  return userPermissions.proyectosAccesibles.filter((p) => p.nivel_acceso >= nivel)
}

const proyectosFiltrados = computed(() => {
  let proyectos = userPermissions.proyectosAccesibles || []

  // Filtrar por búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    proyectos = proyectos.filter(
      (p) =>
        p.codigo?.toLowerCase().includes(query) ||
        p.titulo?.toLowerCase().includes(query) ||
        p.nivel_acceso_display?.toLowerCase().includes(query),
    )
  }

  // Filtrar por nivel
  if (selectedNivel.value !== null) {
    proyectos = proyectos.filter((p) => p.nivel_acceso === selectedNivel.value)
  }

  return proyectos.sort((a, b) => b.nivel_acceso - a.nivel_acceso)
})

const filteredProjects = computed(() => proyectosFiltrados.value)

// Opciones de filtro
const filtrosNivel = [
  { title: 'Solo lectura', value: 1 },
  { title: 'Edición', value: 2 },
  { title: 'Administración', value: 3 },
]

// Niveles de acceso detallados para ayuda
const nivelesAccesoDetalle = [
  {
    id: 3,
    nombre: 'Administración',
    icon: 'mdi-shield-account',
    color: 'red',
    descripcion: 'Acceso completo: crear, editar, eliminar y configurar',
  },
  {
    id: 2,
    nombre: 'Edición',
    icon: 'mdi-pencil',
    color: 'green',
    descripcion: 'Puede modificar contenido pero no configurar',
  },
  {
    id: 1,
    nombre: 'Solo lectura',
    icon: 'mdi-eye',
    color: 'blue',
    descripcion: 'Solo puede ver el contenido, no modificar',
  },
]

// Métodos
const getNivelDisplay = (nivel) => {
  const map = {
    1: 'Lectura',
    2: 'Edición',
    3: 'Administración',
  }
  return map[nivel] || 'Sin acceso'
}

const getNivelIcon = (nivel) => {
  const map = {
    1: 'mdi-eye',
    2: 'mdi-pencil',
    3: 'mdi-shield-account',
  }
  return map[nivel] || 'mdi-block-helper'
}

const getNivelColor = (nivel) => {
  const map = {
    1: 'blue',
    2: 'green',
    3: 'red',
  }
  return map[nivel] || 'grey'
}

const getCardClass = (nivel) => {
  const map = {
    1: 'card-lectura',
    2: 'card-edicion',
    3: 'card-administracion',
  }
  return map[nivel] || ''
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedNivel.value = null
}

// Cargar proyectos al montar
onMounted(async () => {
  if (!userPermissions.tienePermisosCargados) {
    await userPermissions.cargarPermisosGlobales()
  }
})
</script>

<style scoped>
.user-projects-container {
  max-width: 1400px;
  margin: 0 auto;
}

.stat-card {
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.project-card {
  border-radius: 12px;
  transition: all 0.3s ease;
  height: 100%;
  border-left: 4px solid transparent;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.1) !important;
}

.card-lectura {
  border-left-color: #2196f3;
}

.card-edicion {
  border-left-color: #4caf50;
}

.card-administracion {
  border-left-color: #f44336;
}

.project-meta {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 12px;
}

/* Responsive */
@media (max-width: 960px) {
  .project-card {
    margin-bottom: 16px;
  }
}
</style>
