<template>
  <v-card variant="outlined" class="mt-4">
    <v-toolbar color="primary" density="compact">
      <v-toolbar-title>ASIGNACIÓN DE INSTANCIAS GESTORAS</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-tooltip text="Gestionar asignaciones de usuarios a instancias gestoras" location="bottom">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon color="white" size="large" class="mx-1">
            <v-icon>mdi-help-circle</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
    </v-toolbar>

    <v-card-text>
      <!-- Estado de carga -->
      <v-overlay :model-value="cargando" class="align-center justify-center" persistent>
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      </v-overlay>

      <!-- Contenido principal -->
      <div v-if="!cargando">
        <!-- Barra de búsqueda y controles -->
        <v-row class="mb-4 align-center">
          <v-col cols="12" md="6">
            <v-text-field
              v-model="filtroBusqueda"
              label="Buscar usuario..."
              placeholder="Ingrese username, nombre, paterno o materno..."
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-magnify"
              @input="filtrarUsuarios"
              clearable
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6" class="d-flex justify-end align-center">
            <span class="text-caption text-medium-emphasis mr-3"> Mostrar: </span>
            <v-select
              v-model="itemsPorPagina"
              :items="opcionesItemsPorPagina"
              density="compact"
              variant="outlined"
              hide-details
              style="max-width: 120px"
            ></v-select>
            <v-spacer></v-spacer>
            <span class="text-caption text-medium-emphasis">
              {{ totalUsuariosFiltrados }} usuarios encontrados
            </span>
          </v-col>
        </v-row>

        <div class="table-responsive">
          <v-table class="permisos-table">
            <thead>
              <tr>
                <th>USUARIO</th>
                <th>INSTANCIAS ASIGNADAS</th>
                <th>NIVEL DE ACCESO</th>
                <th>ESTADO</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="usuario in usuariosPaginados" :key="`usuario-${usuario.id}`">
                <!-- Usuario -->
                <td>
                  <div class="d-flex align-center">
                    <v-avatar :color="getRandomColor(usuario.id)" size="36" class="mr-3">
                      <span class="text-white text-caption">{{
                        getInitials(usuario.nombre_completo)
                      }}</span>
                    </v-avatar>
                    <div>
                      <strong>{{ usuario.username }}</strong>
                      <div class="text-caption">{{ usuario.nombre_completo }}</div>
                      <div class="text-caption text-medium-emphasis">
                        CI: {{ usuario.ci || 'No registrado' }}
                      </div>
                    </div>
                  </div>
                </td>

                <!-- Instancias Asignadas -->
                <td>
                  <div class="d-flex flex-wrap gap-2">
                    <v-chip
                      v-for="asignacion in getAsignacionesUsuario(usuario.id)"
                      :key="`asignacion-${asignacion.id}`"
                      size="small"
                      color="indigo"
                      variant="outlined"
                    >
                      {{ asignacion.instancia_gestora_nombre }}
                    </v-chip>
                    <span
                      v-if="getAsignacionesUsuario(usuario.id).length === 0"
                      class="text-caption text-medium-emphasis"
                    >
                      Sin instancias
                    </span>
                  </div>
                </td>

                <!-- Nivel de Acceso -->
                <td>
                  <div class="d-flex flex-wrap gap-2">
                    <v-chip
                      v-for="asignacion in getAsignacionesUsuario(usuario.id)"
                      :key="`nivel-${asignacion.id}`"
                      size="small"
                      :color="getColorNivelAcceso(asignacion.nivel_acceso)"
                      variant="flat"
                    >
                      {{ getTextoNivelAcceso(asignacion.nivel_acceso) }}
                    </v-chip>
                    <span
                      v-if="getAsignacionesUsuario(usuario.id).length === 0"
                      class="text-caption text-medium-emphasis"
                    >
                      Sin acceso
                    </span>
                  </div>
                </td>

                <!-- Estado -->
                <td>
                  <v-chip
                    :color="getAsignacionesUsuario(usuario.id).length > 0 ? 'green' : 'orange'"
                    variant="flat"
                  >
                    {{
                      getAsignacionesUsuario(usuario.id).length > 0 ? 'Con acceso' : 'Sin acceso'
                    }}
                  </v-chip>
                </td>

                <!-- Acciones -->
                <td>
                  <div class="d-flex">
                    <v-btn
                      icon
                      size="small"
                      color="primary"
                      @click.stop="gestionarAsignaciones(usuario)"
                      :loading="cargandoGestion === usuario.id"
                    >
                      <v-icon>mdi-cog</v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      size="small"
                      color="info"
                      @click.stop="verDetallesUsuario(usuario)"
                      class="ml-1"
                    >
                      <v-icon>mdi-eye</v-icon>
                    </v-btn>
                  </div>
                </td>
              </tr>
            </tbody>
          </v-table>
        </div>

        <!-- Paginación -->
        <v-row v-if="totalPaginas > 1" class="mt-4 align-center">
          <v-col cols="12" md="6">
            <div class="text-caption text-medium-emphasis">
              Mostrando {{ inicioPagina }}-{{ finPagina }} de {{ totalUsuariosFiltrados }} usuarios
            </div>
          </v-col>
          <v-col cols="12" md="6" class="d-flex justify-end">
            <v-pagination
              v-model="paginaActual"
              :length="totalPaginas"
              :total-visible="7"
              density="comfortable"
            ></v-pagination>
          </v-col>
        </v-row>

        <!-- Mensaje cuando no hay resultados -->
        <v-alert
          v-if="usuariosFiltrados.length === 0 && filtroBusqueda"
          type="info"
          variant="tonal"
          class="mt-4"
        >
          <template v-slot:title>
            <v-icon icon="mdi-account-search" class="mr-2"></v-icon>
            No se encontraron usuarios
          </template>
          No hay usuarios que coincidan con "{{ filtroBusqueda }}"
        </v-alert>
      </div>

      <!-- Dialog para gestionar asignaciones -->
      <v-dialog v-model="mostrarDialogGestion" max-width="800" persistent>
        <v-card>
          <v-toolbar color="primary" density="compact">
            <v-toolbar-title>
              Gestionar Instancias - {{ usuarioSeleccionado?.nombre_completo }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="cerrarDialogGestion" size="small" color="white">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>

          <v-card-text class="pt-4">
            <!-- Instancias asignadas actualmente -->
            <v-card variant="outlined" class="mb-4">
              <v-card-title class="text-subtitle-1 d-flex align-center">
                <v-icon icon="mdi-office-building-cog" class="mr-2"></v-icon>
                Instancias Asignadas
                <v-chip color="primary" variant="flat" size="small" class="ml-2">
                  {{ asignacionesUsuario.length }}
                </v-chip>
              </v-card-title>

              <v-card-text>
                <v-alert
                  v-if="asignacionesUsuario.length === 0"
                  type="info"
                  variant="tonal"
                  class="mb-4"
                >
                  <template v-slot:title> Sin asignaciones </template>
                  Este usuario no tiene instancias gestoras asignadas.
                </v-alert>

                <v-list v-else lines="two" class="elevation-1 rounded">
                  <v-list-item v-for="asignacion in asignacionesUsuario" :key="asignacion.id">
                    <template v-slot:prepend>
                      <v-avatar color="blue-grey-lighten-4" size="50" rounded>
                        <v-icon icon="mdi-office-building-marker" size="large"></v-icon>
                      </v-avatar>
                    </template>

                    <v-list-item-title class="font-weight-medium">
                      {{ asignacion.instancia_gestora_nombre }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="mt-1">
                      <v-chip
                        :color="getColorNivelAcceso(asignacion.nivel_acceso)"
                        variant="flat"
                        size="small"
                        class="mr-2"
                      >
                        {{ getTextoNivelAcceso(asignacion.nivel_acceso) }}
                      </v-chip>
                      <span class="text-caption text-medium-emphasis">
                        Asignado: {{ formatFecha(asignacion.fecha_asignacion) }}
                      </span>
                      <v-chip
                        v-if="!asignacion.activo"
                        color="error"
                        variant="outlined"
                        size="x-small"
                        class="ml-2"
                      >
                        Inactivo
                      </v-chip>
                    </v-list-item-subtitle>

                    <template v-slot:append>
                      <div class="d-flex" style="gap: 8px">
                        <v-btn
                          icon
                          size="small"
                          color="primary"
                          variant="outlined"
                          @click="editarAsignacion(asignacion)"
                        >
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn
                          icon
                          size="small"
                          color="error"
                          variant="outlined"
                          @click="eliminarAsignacion(asignacion)"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </div>
                    </template>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>

            <!-- Formulario para nueva asignación -->
            <v-card variant="outlined" class="elevation-1">
              <v-card-title class="text-subtitle-1 d-flex align-center bg-green-lighten-5">
                <v-icon icon="mdi-plus-circle" class="mr-2"></v-icon>
                Agregar Nueva Instancia
              </v-card-title>
              <v-card-text class="pt-4">
                <v-form @submit.prevent="agregarAsignacion">
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="nuevaAsignacion.instancia_gestora"
                        label="Instancia Gestora"
                        :items="instanciasDisponibles"
                        item-title="instancia"
                        item-value="id"
                        variant="outlined"
                        density="comfortable"
                        prepend-inner-icon="mdi-office-building"
                        :rules="[(v) => !!v || 'Seleccione una instancia']"
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-select
                        v-model="nuevaAsignacion.nivel_acceso"
                        label="Nivel de Acceso"
                        :items="nivelesAcceso"
                        item-title="text"
                        item-value="value"
                        variant="outlined"
                        density="comfortable"
                        prepend-inner-icon="mdi-shield-account"
                        :rules="[(v) => !!v || 'Seleccione un nivel']"
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="12" md="2" class="d-flex align-end">
                      <v-btn
                        type="submit"
                        color="success"
                        :disabled="!puedeAgregarAsignacion"
                        block
                        size="large"
                      >
                        <v-icon icon="mdi-check" class="mr-2"></v-icon>
                        Agregar
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </v-dialog>

      <!-- Dialog para editar asignación -->
      <v-dialog v-model="mostrarDialogEdicion" max-width="500">
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center bg-primary">
            <span class="text-white">Editar Nivel de Acceso</span>
            <v-btn icon @click="cerrarDialogEdicion" size="small" color="white">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text class="pt-4">
            <v-card variant="outlined" class="mb-4">
              <v-card-text>
                <div class="d-flex align-center mb-2">
                  <v-avatar color="blue-grey-lighten-4" size="40" class="mr-3">
                    <v-icon icon="mdi-office-building"></v-icon>
                  </v-avatar>
                  <div>
                    <div class="text-subtitle-2 text-medium-emphasis">Instancia:</div>
                    <div class="text-h6">{{ asignacionEditando?.instancia_gestora_nombre }}</div>
                  </div>
                </div>
              </v-card-text>
            </v-card>

            <v-select
              v-model="asignacionEditando.nivel_acceso"
              label="Nivel de Acceso"
              :items="nivelesAcceso"
              item-title="text"
              item-value="value"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-shield-star"
            ></v-select>

            <v-switch
              v-model="asignacionEditando.activo"
              label="Asignación activa"
              color="primary"
              hide-details
              class="mt-4"
            ></v-switch>
          </v-card-text>

          <v-card-actions class="justify-end pa-4">
            <v-btn @click="cerrarDialogEdicion" variant="text" size="large">Cancelar</v-btn>
            <v-btn @click="guardarEdicion" color="primary" :loading="cargandoEdicion" size="large">
              <v-icon icon="mdi-content-save" class="mr-2"></v-icon>
              Guardar Cambios
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Dialog de confirmación para eliminar -->
      <v-dialog v-model="mostrarDialogConfirmacion" max-width="400">
        <v-card>
          <v-card-title class="bg-error text-white d-flex align-center">
            <v-icon icon="mdi-alert-circle" class="mr-2"></v-icon>
            Confirmar Eliminación
          </v-card-title>
          <v-card-text class="pt-4">
            <div class="text-body-1 mb-2">¿Está seguro de eliminar la asignación de:</div>
            <v-card variant="outlined" class="mb-3">
              <v-card-text class="text-center">
                <div class="text-h6 text-error">
                  {{ asignacionAEliminar?.instancia_gestora_nombre }}
                </div>
                <v-chip color="error" variant="flat" size="small" class="mt-1">
                  {{ getTextoNivelAcceso(asignacionAEliminar?.nivel_acceso) }}
                </v-chip>
              </v-card-text>
            </v-card>
            <div class="text-caption text-medium-emphasis">Esta acción no se puede deshacer.</div>
          </v-card-text>
          <v-card-actions class="justify-end pa-4">
            <v-btn @click="mostrarDialogConfirmacion = false" variant="text" size="large"
              >Cancelar</v-btn
            >
            <v-btn
              @click="confirmarEliminacion"
              color="error"
              :loading="cargandoEliminacion"
              size="large"
            >
              <v-icon icon="mdi-delete" class="mr-2"></v-icon>
              Eliminar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Snackbar para mensajes -->
      <v-snackbar v-model="mostrarMensaje" :color="tipoMensaje" timeout="4000">
        <div class="d-flex align-center">
          <v-icon :icon="getIconoTipoMensaje()" class="mr-2"></v-icon>
          {{ mensajeTexto }}
        </div>
      </v-snackbar>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

// Estado reactivo
const cargando = ref(false)
const cargandoGestion = ref(null)
const cargandoEdicion = ref(false)
const cargandoEliminacion = ref(false)
const usuarios = ref([])
const usuariosFiltrados = ref([])
const instanciasGestoras = ref([])
const asignaciones = ref([])
const usuarioSeleccionado = ref(null)
const asignacionesUsuario = ref([])

// Búsqueda y paginación
const filtroBusqueda = ref('')
const paginaActual = ref(1)
const itemsPorPagina = ref(10)
const opcionesItemsPorPagina = ref([5, 10, 20, 50])

// Dialogs
const mostrarDialogGestion = ref(false)
const mostrarDialogEdicion = ref(false)
const mostrarDialogConfirmacion = ref(false)
const asignacionEditando = ref(null)
const asignacionAEliminar = ref(null)

// Formularios
const nuevaAsignacion = ref({
  instancia_gestora: '',
  nivel_acceso: '',
})

// Mensajes
const mostrarMensaje = ref(false)
const mensajeTexto = ref('')
const tipoMensaje = ref('info')

// Constantes
const nivelesAcceso = [
  { text: 'Solo lectura', value: 1 },
  { text: 'Edición', value: 2 },
  { text: 'Administración', value: 3 },
]

// DATOS DE EJEMPLO - Instancias Gestoras
const datosInstanciasGestoras = [
  { id: 1, codigo: 'INS001', instancia: 'Dirección General de Presupuesto' },
  { id: 2, codigo: 'INS002', instancia: 'Gerencia Financiera Nacional' },
  { id: 3, codigo: 'INS003', instancia: 'Departamento de Tecnologías de Información' },
  { id: 4, codigo: 'INS004', instancia: 'Recursos Humanos Central' },
  { id: 5, codigo: 'INS005', instancia: 'Área Comercial y Ventas' },
  { id: 6, codigo: 'INS006', instancia: 'División de Operaciones Regionales' },
  { id: 7, codigo: 'INS007', instancia: 'Unidad de Control de Gestión' },
  { id: 8, codigo: 'INS008', instancia: 'Departamento Legal y Normativo' },
]

// DATOS DE EJEMPLO - Usuarios (basados en el modelo Usuario)
const datosUsuarios = [
  {
    id: 1,
    username: 'admin',
    nombre: 'Administrador',
    paterno: 'Sistema',
    materno: '',
    nombre_completo: 'Administrador Sistema',
    ci: '0000001',
    cargo: 'Administrador General',
    permisos: 'admin',
    is_active: true,
  },
  {
    id: 2,
    username: 'jperez',
    nombre: 'Juan',
    paterno: 'Pérez',
    materno: 'García',
    nombre_completo: 'Juan Pérez García',
    ci: '1234567',
    cargo: 'Gerente Financiero',
    permisos: 'gestor',
    is_active: true,
  },
  {
    id: 3,
    username: 'mgonzalez',
    nombre: 'María',
    paterno: 'González',
    materno: 'López',
    nombre_completo: 'María González López',
    ci: '2345678',
    cargo: 'Jefa de TI',
    permisos: 'tecnico',
    is_active: true,
  },
  {
    id: 4,
    username: 'crodriguez',
    nombre: 'Carlos',
    paterno: 'Rodríguez',
    materno: 'Martínez',
    nombre_completo: 'Carlos Rodríguez Martínez',
    ci: '3456789',
    cargo: 'Especialista RRHH',
    permisos: 'consultor',
    is_active: true,
  },
  {
    id: 5,
    username: 'amartinez',
    nombre: 'Ana',
    paterno: 'Martínez',
    materno: 'Sánchez',
    nombre_completo: 'Ana Martínez Sánchez',
    ci: '4567890',
    cargo: 'Analista Comercial',
    permisos: 'operador',
    is_active: true,
  },
  {
    id: 6,
    username: 'lhernandez',
    nombre: 'Luis',
    paterno: 'Hernández',
    materno: 'Díaz',
    nombre_completo: 'Luis Hernández Díaz',
    ci: '5678901',
    cargo: 'Supervisor Operaciones',
    permisos: 'supervisor',
    is_active: true,
  },
  {
    id: 7,
    username: 'pgarcia',
    nombre: 'Pedro',
    paterno: 'García',
    materno: 'Ruiz',
    nombre_completo: 'Pedro García Ruiz',
    ci: '6789012',
    cargo: 'Coordinador Legal',
    permisos: 'coordinador',
    is_active: true,
  },
  {
    id: 8,
    username: 'mlopez',
    nombre: 'Marta',
    paterno: 'López',
    materno: 'Santos',
    nombre_completo: 'Marta López Santos',
    ci: '7890123',
    cargo: 'Auditor Interno',
    permisos: 'auditor',
    is_active: true,
  },
  {
    id: 9,
    username: 'dcastro',
    nombre: 'David',
    paterno: 'Castro',
    materno: 'Moreno',
    nombre_completo: 'David Castro Moreno',
    ci: '8901234',
    cargo: 'Especialista Presupuesto',
    permisos: 'especialista',
    is_active: true,
  },
  {
    id: 10,
    username: 'sromero',
    nombre: 'Sofía',
    paterno: 'Romero',
    materno: 'Jiménez',
    nombre_completo: 'Sofía Romero Jiménez',
    ci: '9012345',
    cargo: 'Asistente Administrativo',
    permisos: 'asistente',
    is_active: true,
  },
]

// DATOS DE EJEMPLO - Asignaciones existentes (basadas en el modelo UserInstanciaGestora)
const datosAsignaciones = [
  {
    id: 1,
    usuario: 2,
    instancia_gestora: 1,
    instancia_gestora_nombre: 'Dirección General de Presupuesto',
    nivel_acceso: 3,
    fecha_asignacion: '2024-01-15T10:30:00Z',
    activo: true,
  },
  {
    id: 2,
    usuario: 2,
    instancia_gestora: 2,
    instancia_gestora_nombre: 'Gerencia Financiera Nacional',
    nivel_acceso: 2,
    fecha_asignacion: '2024-01-20T14:15:00Z',
    activo: true,
  },
  {
    id: 3,
    usuario: 3,
    instancia_gestora: 3,
    instancia_gestora_nombre: 'Departamento de Tecnologías de Información',
    nivel_acceso: 3,
    fecha_asignacion: '2024-02-01T09:00:00Z',
    activo: true,
  },
  {
    id: 4,
    usuario: 4,
    instancia_gestora: 4,
    instancia_gestora_nombre: 'Recursos Humanos Central',
    nivel_acceso: 1,
    fecha_asignacion: '2024-02-10T11:45:00Z',
    activo: true,
  },
  {
    id: 5,
    usuario: 5,
    instancia_gestora: 5,
    instancia_gestora_nombre: 'Área Comercial y Ventas',
    nivel_acceso: 2,
    fecha_asignacion: '2024-02-15T16:20:00Z',
    activo: true,
  },
  {
    id: 6,
    usuario: 6,
    instancia_gestora: 6,
    instancia_gestora_nombre: 'División de Operaciones Regionales',
    nivel_acceso: 1,
    fecha_asignacion: '2024-02-20T13:10:00Z',
    activo: true,
  },
  {
    id: 7,
    usuario: 7,
    instancia_gestora: 7,
    instancia_gestora_nombre: 'Unidad de Control de Gestión',
    nivel_acceso: 2,
    fecha_asignacion: '2024-03-01T08:30:00Z',
    activo: false,
  },
]

// Computed - Búsqueda y paginación
const usuariosPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * itemsPorPagina.value
  const fin = inicio + itemsPorPagina.value
  return usuariosFiltrados.value.slice(inicio, fin)
})

const totalUsuariosFiltrados = computed(() => {
  return usuariosFiltrados.value.length
})

const totalPaginas = computed(() => {
  return Math.ceil(usuariosFiltrados.value.length / itemsPorPagina.value)
})

const inicioPagina = computed(() => {
  return (paginaActual.value - 1) * itemsPorPagina.value + 1
})

const finPagina = computed(() => {
  const fin = paginaActual.value * itemsPorPagina.value
  return fin > usuariosFiltrados.value.length ? usuariosFiltrados.value.length : fin
})

const instanciasDisponibles = computed(() => {
  if (!usuarioSeleccionado.value) return instanciasGestoras.value

  const instanciasAsignadas = asignacionesUsuario.value
    .filter((a) => a.activo)
    .map((a) => a.instancia_gestora)
  return instanciasGestoras.value.filter((instancia) => !instanciasAsignadas.includes(instancia.id))
})

const puedeAgregarAsignacion = computed(() => {
  return nuevaAsignacion.value.instancia_gestora && nuevaAsignacion.value.nivel_acceso
})

// Watch para resetear página cuando cambia el filtro
watch(filtroBusqueda, () => {
  paginaActual.value = 1
})

// Watch para resetear página cuando cambian los items por página
watch(itemsPorPagina, () => {
  paginaActual.value = 1
})

// Métodos
const cargarDatosIniciales = async () => {
  cargando.value = true
  try {
    // Simular carga de datos con timeout
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Usar datos de ejemplo
    instanciasGestoras.value = datosInstanciasGestoras
    usuarios.value = datosUsuarios
    usuariosFiltrados.value = datosUsuarios
    asignaciones.value = datosAsignaciones

    mostrarMensajeFunc('Datos cargados correctamente', 'success')
  } catch (error) {
    mostrarMensajeFunc('Error cargando datos iniciales', 'error')
  } finally {
    cargando.value = false
  }
}

const filtrarUsuarios = () => {
  if (!filtroBusqueda.value) {
    usuariosFiltrados.value = usuarios.value
    return
  }

  const busqueda = filtroBusqueda.value.toLowerCase()
  usuariosFiltrados.value = usuarios.value.filter(
    (usuario) =>
      usuario.username.toLowerCase().includes(busqueda) ||
      usuario.nombre_completo.toLowerCase().includes(busqueda) ||
      usuario.nombre.toLowerCase().includes(busqueda) ||
      usuario.paterno.toLowerCase().includes(busqueda) ||
      usuario.materno.toLowerCase().includes(busqueda) ||
      (usuario.ci && usuario.ci.toLowerCase().includes(busqueda)),
  )
}

const getAsignacionesUsuario = (usuarioId) => {
  return datosAsignaciones.filter(
    (asignacion) => asignacion.usuario === usuarioId && asignacion.activo,
  )
}

const getTextoNivelAcceso = (nivel) => {
  const niveles = {
    1: 'Solo lectura',
    2: 'Edición',
    3: 'Administración',
  }
  return niveles[nivel] || 'Desconocido'
}

const gestionarAsignaciones = async (usuario) => {
  cargandoGestion.value = usuario.id
  try {
    // Simular carga de datos del usuario
    await new Promise((resolve) => setTimeout(resolve, 500))

    usuarioSeleccionado.value = usuario
    cargarAsignacionesUsuario(usuario.id)
    mostrarDialogGestion.value = true
  } catch (error) {
    mostrarMensajeFunc('Error cargando datos del usuario', 'error')
  } finally {
    cargandoGestion.value = null
  }
}

const verDetallesUsuario = (usuario) => {
  // Implementar vista de detalles del usuario
  mostrarMensajeFunc(`Vista de detalles para ${usuario.nombre_completo}`, 'info')
}

const cargarAsignacionesUsuario = (usuarioId) => {
  asignacionesUsuario.value = datosAsignaciones.filter(
    (asignacion) => asignacion.usuario === usuarioId,
  )
}

const agregarAsignacion = async () => {
  if (!puedeAgregarAsignacion.value) return

  try {
    cargando.value = true

    // Simular guardado con timeout
    await new Promise((resolve) => setTimeout(resolve, 800))

    const nuevaId = Math.max(...datosAsignaciones.map((a) => a.id), 0) + 1
    const instanciaSeleccionada = instanciasGestoras.value.find(
      (i) => i.id === parseInt(nuevaAsignacion.value.instancia_gestora),
    )

    const nuevaAsignacionObj = {
      id: nuevaId,
      usuario: usuarioSeleccionado.value.id,
      instancia_gestora: parseInt(nuevaAsignacion.value.instancia_gestora),
      instancia_gestora_nombre: instanciaSeleccionada.instancia,
      nivel_acceso: parseInt(nuevaAsignacion.value.nivel_acceso),
      fecha_asignacion: new Date().toISOString(),
      activo: true,
    }

    datosAsignaciones.push(nuevaAsignacionObj)
    asignacionesUsuario.value.push(nuevaAsignacionObj)
    nuevaAsignacion.value = { instancia_gestora: '', nivel_acceso: '' }
    mostrarMensajeFunc('Instancia asignada correctamente', 'success')
  } catch (error) {
    mostrarMensajeFunc('Error asignando instancia', 'error')
  } finally {
    cargando.value = false
  }
}

const editarAsignacion = (asignacion) => {
  asignacionEditando.value = { ...asignacion }
  mostrarDialogEdicion.value = true
}

const guardarEdicion = async () => {
  cargandoEdicion.value = true
  try {
    // Simular guardado con timeout
    await new Promise((resolve) => setTimeout(resolve, 800))

    const index = datosAsignaciones.findIndex((a) => a.id === asignacionEditando.value.id)
    if (index !== -1) {
      datosAsignaciones[index].nivel_acceso = asignacionEditando.value.nivel_acceso
      datosAsignaciones[index].activo = asignacionEditando.value.activo

      // Actualizar también en asignacionesUsuario
      const indexUsuario = asignacionesUsuario.value.findIndex(
        (a) => a.id === asignacionEditando.value.id,
      )
      if (indexUsuario !== -1) {
        asignacionesUsuario.value[indexUsuario].nivel_acceso = asignacionEditando.value.nivel_acceso
        asignacionesUsuario.value[indexUsuario].activo = asignacionEditando.value.activo
      }
    }

    cerrarDialogEdicion()
    mostrarMensajeFunc('Asignación actualizada correctamente', 'success')
  } catch (error) {
    mostrarMensajeFunc('Error actualizando asignación', 'error')
  } finally {
    cargandoEdicion.value = false
  }
}

const eliminarAsignacion = (asignacion) => {
  asignacionAEliminar.value = asignacion
  mostrarDialogConfirmacion.value = true
}

const confirmarEliminacion = async () => {
  cargandoEliminacion.value = true
  try {
    // Simular eliminación con timeout
    await new Promise((resolve) => setTimeout(resolve, 800))

    const index = datosAsignaciones.findIndex((a) => a.id === asignacionAEliminar.value.id)
    if (index !== -1) {
      datosAsignaciones.splice(index, 1)
    }

    asignacionesUsuario.value = asignacionesUsuario.value.filter(
      (a) => a.id !== asignacionAEliminar.value.id,
    )
    mostrarMensajeFunc('Asignación eliminada correctamente', 'success')
  } catch (error) {
    mostrarMensajeFunc('Error eliminando asignación', 'error')
  } finally {
    cargandoEliminacion.value = false
    mostrarDialogConfirmacion.value = false
    asignacionAEliminar.value = null
  }
}

const cerrarDialogGestion = () => {
  mostrarDialogGestion.value = false
  usuarioSeleccionado.value = null
  asignacionesUsuario.value = []
  nuevaAsignacion.value = { instancia_gestora: '', nivel_acceso: '' }
}

const cerrarDialogEdicion = () => {
  mostrarDialogEdicion.value = false
  asignacionEditando.value = null
}

// Helper functions
const getColorNivelAcceso = (nivel) => {
  const colores = {
    1: 'blue', // Lectura
    2: 'green', // Edición
    3: 'orange', // Administración
  }
  return colores[nivel] || 'grey'
}

const getRandomColor = (seed) => {
  const colors = ['primary', 'secondary', 'success', 'error', 'warning', 'info']
  const index = seed ? seed % colors.length : Math.floor(Math.random() * colors.length)
  return colors[index]
}

const getInitials = (nombre) => {
  if (!nombre) return '??'
  return nombre
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

const formatFecha = (fecha) => {
  if (!fecha) return 'Fecha no disponible'
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getIconoTipoMensaje = () => {
  const iconos = {
    success: 'mdi-check-circle',
    error: 'mdi-alert-circle',
    warning: 'mdi-alert',
    info: 'mdi-information',
  }
  return iconos[tipoMensaje.value] || 'mdi-information'
}

const mostrarMensajeFunc = (texto, tipo) => {
  mensajeTexto.value = texto
  tipoMensaje.value = tipo
  mostrarMensaje.value = true
}

// Ciclo de vida
onMounted(() => {
  cargarDatosIniciales()
})
</script>

<style scoped>
.table-responsive {
  overflow-x: auto;
}

.permisos-table {
  width: 100%;
}

.gap-2 {
  gap: 8px;
}

.v-list-item {
  border-radius: 8px;
  margin-bottom: 4px;
}

.v-list-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.bg-green-lighten-5 {
  background-color: #e8f5e8;
}
</style>
