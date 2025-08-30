<template>
  <div class="diagrama-manager">
    <!-- Estados de carga -->
    <div v-if="store.loading" class="loading-state">
      <div class="spinner"></div>
      <p>Cargando diagrama del proyecto...</p>
    </div>

    <div v-else-if="store.error" class="error-state">
      <p>❌ Error: {{ store.error }}</p>
      <button @click="cargarDiagrama" class="retry-btn">Reintentar</button>
    </div>

    <!-- Contenido principal -->
    <div v-else class="diagrama-content">
      <!-- Header con información del proyecto -->
      <div class="header">
        <h2>Proyecto: {{ store.diagrama?.codigoProyecto }}</h2>
        <p>{{ store.nodes.length }} nodos | {{ store.edges.length }} conexiones</p>

        <!-- Filtros -->
        <div class="filters">
          <label>Filtrar por tipo:</label>
          <select v-model="store.filtroTipo" @change="store.colocarFiltro(store.filtroTipo)">
            <option v-for="tipo in store.tiposDisponibles" :key="tipo" :value="tipo">
              {{ tipo }}
            </option>
          </select>
          <span>Mostrando: {{ store.filtrarNodos.length }} nodos</span>
        </div>
      </div>

      <!-- Lista de nodos -->
      <div class="nodos-list">
        <h3>Nodos del Diagrama</h3>
        <div
          v-for="nodo in store.filtrarNodos"
          :key="nodo.id"
          class="nodo-item"
          :class="{ selected: nodoSeleccionado?.id === nodo.id }"
          @click="seleccionarNodo(nodo)"
        >
          <div class="nodo-header">
            <strong>{{ nodo.data?.label }}</strong>
            <span class="nodo-type">{{ nodo.type }}</span>
          </div>
          <p>ID: {{ nodo.id }} | Posición: ({{ nodo.position.x }}, {{ nodo.position.y }})</p>
        </div>
      </div>

      <!-- Panel de edición del nodo seleccionado -->
      <div v-if="nodoSeleccionado" class="edicion-panel">
        <h3>Editando: {{ nodoSeleccionado.data?.label }}</h3>

        <form @submit.prevent="guardarCambios">
          <div class="form-group">
            <label>Label:</label>
            <input v-model="nodoEditado.data.label" type="text" />
          </div>

          <div class="form-group">
            <label>Posición X:</label>
            <input v-model.number="nodoEditado.position.x" type="number" />
          </div>

          <div class="form-group">
            <label>Posición Y:</label>
            <input v-model.number="nodoEditado.position.y" type="number" />
          </div>

          <!-- Campos específicos según el tipo de nodo -->
          <div v-if="nodoEditado.data.datosNodo" class="form-group">
            <label>Título:</label>
            <input v-model="nodoEditado.data.datosNodo.titulo" type="text" />
          </div>

          <div v-if="nodoEditado.data.nodoProyecto" class="form-group">
            <label>Descripción:</label>
            <textarea v-model="nodoEditado.data.nodoProyecto.descripcion" />
          </div>

          <div class="form-actions">
            <button type="submit" :disabled="guardando">💾 Guardar Cambios</button>
            <button type="button" @click="deseleccionarNodo">❌ Cancelar</button>
          </div>
        </form>
      </div>

      <!-- Información de relaciones -->
      <div v-if="nodoSeleccionado" class="relaciones-panel">
        <h4>Relaciones de este nodo:</h4>
        <div
          v-for="relacion in store.obtenerRelacionesDeNodo(nodoSeleccionado.id)"
          :key="relacion.id"
          class="relacion-item"
        >
          <span>{{ relacion.descripcion }}</span> -
          <span class="relacion-tipo">{{ relacion.tipo }}</span>
        </div>
      </div>

      <!-- Acciones globales -->
      <div class="global-actions">
        <button @click="cargarDiagrama" :disabled="store.loading">🔄 Recargar Diagrama</button>
        <button @click="exportarDatos" :disabled="store.loading">📤 Exportar Datos</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useProyectoEstructuraStore } from '@/modules/estructuraProyecto/store/useProyectoEstructuraStore'
const store = useProyectoEstructuraStore()
const nodoSeleccionado = ref(null)
const nodoEditado = ref(null)
const guardando = ref(false)

// Cargar el diagrama al inicializar el componente
onMounted(() => {
  cargarDiagrama()
})

// Función para cargar el diagrama
async function cargarDiagrama() {
  try {
    // ID del proyecto (podría venir de props, route params, etc.)
    const proyectoId = 5 // Ejemplo estático
    await store.obtenerDiagramaPorId(proyectoId)
    console.log('Diagrama cargado exitosamente')
  } catch (error) {
    console.error('Error al cargar diagrama:', error)
  }
}

// Seleccionar un nodo para editar
function seleccionarNodo(nodo) {
  nodoSeleccionado.value = nodo
  // Crear una copia profunda para editar
  nodoEditado.value = JSON.parse(JSON.stringify(nodo))
}

// Deseleccionar el nodo
function deseleccionarNodo() {
  nodoSeleccionado.value = null
  nodoEditado.value = null
}

// Guardar los cambios del nodo
async function guardarCambios() {
  if (!nodoSeleccionado.value || !nodoEditado.value) return

  guardando.value = true

  try {
    // Preparar las modificaciones
    const modificaciones = {
      data: {
        label: nodoEditado.value.data.label,
        // Incluir otros campos específicos si existen
        ...(nodoEditado.value.data.datosNodo && {
          datosNodo: {
            titulo: nodoEditado.value.data.datosNodo.titulo,
          },
        }),
        ...(nodoEditado.value.data.nodoProyecto && {
          nodoProyecto: {
            descripcion: nodoEditado.value.data.nodoProyecto.descripcion,
          },
        }),
      },
      position: {
        x: nodoEditado.value.position.x,
        y: nodoEditado.value.position.y,
      },
    }

    // Llamar a la función del store para modificar el nodo
    await store.modificarNodo(nodoSeleccionado.value.id, modificaciones)

    console.log('Nodo modificado exitosamente')
    deseleccionarNodo()
  } catch (error) {
    console.error('Error al guardar cambios:', error)
  } finally {
    guardando.value = false
  }
}

// Exportar datos del diagrama
function exportarDatos() {
  const datosExportar = {
    diagrama: store.diagrama,
    nodos: store.nodes,
    conexiones: store.edges,
    fechaExportacion: new Date().toISOString(),
  }

  const blob = new Blob([JSON.stringify(datosExportar, null, 2)], {
    type: 'application/json',
  })

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `diagrama-${store.diagrama?.codigoProyecto || 'proyecto'}.json`
  a.click()
  URL.revokeObjectURL(url)
}

// Ejemplo de búsqueda de nodos específicos
function buscarNodosEspecificos() {
  // Buscar todas las actividades
  const actividades = store.extraerNodosPorTipo('actividad')
  console.log('Actividades encontradas:', actividades)

  // Buscar nodos por criterios personalizados
  const nodosGrandes = store.buscarNodos((nodo) => nodo.dimensions?.width > 600)
  console.log('Nodos grandes:', nodosGrandes)
}

// Cargar datos de ejemplo al iniciar (opcional)
watch(
  () => store.nodes,
  (newNodes) => {
    if (newNodes.length > 0) {
      console.log('Nodos disponibles:', newNodes)
      // Seleccionar automáticamente el primer nodo si quieres
      // seleccionarNodo(newNodes[0])
    }
  },
  { immediate: true },
)
</script>

<style scoped>
.diagrama-manager {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.loading-state {
  text-align: center;
  padding: 40px;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-state {
  background: #fee;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.retry-btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.header {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.filters {
  margin-top: 15px;
}

.filters select {
  margin: 0 10px;
  padding: 5px;
}

.nodos-list {
  margin-bottom: 30px;
}

.nodo-item {
  background: white;
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: border-color 0.3s;
}

.nodo-item:hover {
  border-color: #3498db;
}

.nodo-item.selected {
  border-color: #2ecc71;
  background: #f0fff4;
}

.nodo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.nodo-type {
  background: #e8f4fd;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.edicion-panel {
  background: #fff3cd;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.form-actions button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.form-actions button[type='submit'] {
  background: #28a745;
  color: white;
}

.form-actions button[type='button'] {
  background: #6c757d;
  color: white;
}

.relaciones-panel {
  background: #e8f4fd;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.relacion-item {
  background: white;
  padding: 8px;
  margin: 5px 0;
  border-radius: 4px;
}

.relacion-tipo {
  background: #d4edda;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 12px;
}

.global-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.global-actions button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: #007bff;
  color: white;
}

.global-actions button:disabled {
  background: #6c757d;
  cursor: not-allowed;
}
</style>
