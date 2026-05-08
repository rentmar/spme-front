<template>
  <v-card elevation="2" rounded="lg" class="mb-4 grupo-card">
    <!-- Header colapsable del responsable -->
    <v-card-item
      class="pa-4 cursor-pointer grupo-header"
      :class="{ 'bg-info-lighten-5': expandido }"
      @click="$emit('toggle')"
    >
      <template v-slot:prepend>
        <v-avatar :color="expandido ? 'info' : 'grey-lighten-1'" size="44">
          <v-icon size="24" color="white">mdi-account</v-icon>
        </v-avatar>
      </template>

      <v-card-title class="text-h6 font-weight-bold">
        {{ responsable.responsableNombre }}
        <span class="text-subtitle-2 text-medium-emphasis ml-2">
          @{{ responsable.responsableUsername || 'sin_usuario' }}
        </span>
      </v-card-title>

      <v-card-subtitle>
        <div class="d-flex flex-wrap gap-2 mt-1">
          <v-chip size="x-small" color="info" variant="tonal">
            <v-icon left size="14">mdi-playlist-check</v-icon>
            {{ responsable.totalActividades }} actividades
          </v-chip>
          <v-chip size="x-small" color="success" variant="tonal">
            <v-icon left size="14">mdi-cash</v-icon>
            {{ formatCurrency(responsable.presupuestoTotal) }}
          </v-chip>
        </div>
      </v-card-subtitle>

      <template v-slot:append>
        <div class="d-flex align-center">
          <v-icon
            :icon="expandido ? 'mdi-chevron-up' : 'mdi-chevron-down'"
            size="28"
            color="info"
          ></v-icon>
        </div>
      </template>
    </v-card-item>

    <!-- Contenido expandible -->
    <v-expand-transition>
      <div v-if="expandido">
        <v-divider></v-divider>

        <!-- Resumen de estados -->
        <v-card-text class="pa-3 bg-grey-lighten-5">
          <div class="d-flex flex-wrap gap-2">
            <v-chip
              v-for="(cantidad, estado) in responsable.estados"
              :key="estado"
              :color="getStatusColor(estado)"
              size="x-small"
              text-color="white"
              class="mr-1"
            >
              {{ getEstadoTexto(estado) }}: {{ cantidad }}
            </v-chip>
          </div>
        </v-card-text>

        <!-- Lista de actividades colapsables -->
        <v-list class="pa-2 bg-transparent" density="compact">
          <v-list-group
            v-for="actividad in responsable.actividades"
            :key="actividad.id"
            :value="actividad.id"
            color="info"
          >
            <!-- Activador de la actividad -->
            <template v-slot:activator="{ props }">
              <v-list-item
                v-bind="props"
                class="actividad-item mb-1 rounded-lg"
                @click="$emit('ver-actividad', actividad.id)"
              >
                <template v-slot:prepend>
                  <div
                    @mouseenter="mostrarPopupActividad(actividad, $event)"
                    @mouseleave="ocultarPopupActividad"
                    style="display: inline-block"
                  >
                    <v-avatar :color="getStatusColor(actividad.estado)" size="36">
                      <v-icon size="18" dark>
                        {{ getTipoIcon(actividad.estado) }}
                      </v-icon>
                    </v-avatar>
                  </div>
                </template>

                <v-list-item-title>
                  <div class="d-flex align-center">
                    <v-chip
                      v-if="actividad.pei_id"
                      color="green"
                      size="x-small"
                      class="mr-2"
                      variant="flat"
                    >
                      PEI
                    </v-chip>
                    <v-chip v-else color="blue" size="x-small" class="mr-2" variant="flat">
                      PROYECTO
                    </v-chip>
                    <span class="text-truncate">
                      {{ actividad.codigo }} - {{ actividad.nombreCorto }}
                    </span>
                  </div>
                </v-list-item-title>

                <v-list-item-subtitle>
                  <div class="d-flex flex-wrap gap-2 mt-1">
                    <v-chip
                      size="x-small"
                      :color="getStatusColor(actividad.estado)"
                      text-color="white"
                    >
                      {{ actividad.estado }}
                    </v-chip>
                    <span class="text-caption">
                      <v-icon size="14" class="mr-1">mdi-cash</v-icon>
                      {{ formatCurrency(actividad.presupuesto) }}
                    </span>
                    <span class="text-caption">
                      <v-icon size="14" class="mr-1">mdi-folder</v-icon>
                      Proyecto {{ actividad.proyecto }}
                    </span>
                  </div>
                  <div class="text-caption text-grey mt-1" v-if="actividad.descripcion">
                    {{ truncarTexto(actividad.descripcion, 100) }}
                  </div>
                </v-list-item-subtitle>

                <template v-slot:append>
                  <div class="d-flex acciones-container">
                    <v-tooltip text="Informe de Actividad" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon="mdi-file-document-outline"
                          variant="text"
                          color="primary"
                          size="small"
                          @click.stop="irInformeActividad(actividad.id)"
                          class="accion-btn"
                        ></v-btn>
                      </template>
                    </v-tooltip>

                    <v-tooltip text="Ver Informe de Actividad/Subactividad" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon="mdi-file-document-multiple-outline"
                          variant="text"
                          color="cyan"
                          size="small"
                          @click.stop="irInformeActividadSubactividad(actividad)"
                          class="accion-btn"
                        ></v-btn>
                      </template>
                    </v-tooltip>
                  </div>
                </template>
              </v-list-item>
            </template>

            <!-- Subactividades de la actividad -->
            <v-list density="compact" class="bg-grey-lighten-5 pa-2 ml-4">
              <div class="d-flex justify-space-between align-center mb-2 px-2">
                <span class="text-caption font-weight-bold text-uppercase text-grey">
                  <v-icon size="16" color="info" class="mr-1">mdi-playlist-check</v-icon>
                  Subactividades ({{ actividad.tareas?.length || 0 }})
                </span>
                <v-btn
                  color="info"
                  variant="text"
                  size="x-small"
                  prepend-icon="mdi-plus"
                  @click.stop="$emit('add-tarea', actividad.id)"
                >
                  Añadir
                </v-btn>
              </div>

              <v-list-item
                v-for="tarea in actividad.tareasOrdenadas"
                :key="tarea.id"
                class="tarea-item mb-1 pa-2 rounded"
              >
                <template v-slot:prepend>
                  <div class="position-relative">
                    <v-badge
                      :color="getStatusColorTarea(tarea.estado)"
                      dot
                      location="bottom end"
                      offset-x="-5"
                      offset-y="-5"
                    >
                      <v-avatar size="32" :color="getStatusColorTarea(tarea.estado) + ' lighten-4'">
                        <v-icon size="16" :color="getStatusColorTarea(tarea.estado)">
                          {{ getTareaIcon(tarea.estado) }}
                        </v-icon>
                      </v-avatar>
                    </v-badge>
                  </div>
                </template>

                <v-list-item-title class="text-body-2 font-weight-medium">
                  <div class="d-flex align-center flex-wrap gap-2">
                    <span class="text-truncate" style="max-width: 200px">
                      {{ tarea.titulo || tarea.descripcion || 'Subactividad sin título' }}
                    </span>
                    <v-chip
                      v-if="tieneCodigoValido(tarea.codigo)"
                      size="x-small"
                      color="info"
                      variant="outlined"
                      class="chip-codigo"
                    >
                      {{ formatearCodigo(tarea.codigo) }}
                    </v-chip>
                  </div>
                </v-list-item-title>

                <v-list-item-subtitle>
                  <div class="d-flex flex-wrap align-center gap-2 mt-1">
                    <v-chip
                      size="x-small"
                      :color="getStatusColorTarea(tarea.estado)"
                      text-color="white"
                    >
                      {{ getEstadoTareaDisplay(tarea.estado) }}
                    </v-chip>

                    <span class="text-caption text-medium-emphasis d-flex align-center">
                      <v-icon size="12" class="mr-1">mdi-cash</v-icon>
                      {{ formatCurrency(tarea.presupuesto) }}
                    </span>

                    <div
                      v-if="
                        tarea.presupuestoDesglose !== null &&
                        tarea.presupuestoDesglose !== undefined &&
                        tarea.presupuestoDesglose.length > 0
                      "
                      class="d-flex align-center ml-2 desglose-badge"
                    >
                      <v-icon size="14" color="info" icon="mdi-cash-multiple"></v-icon>
                      <span class="text-caption font-weight-medium ml-1 text-info">Desglose</span>
                      <v-tooltip location="top">
                        <template v-slot:activator="{ props }">
                          <v-icon
                            v-bind="props"
                            size="12"
                            color="grey"
                            class="ml-1"
                            icon="mdi-information-outline"
                          ></v-icon>
                        </template>
                        <span>{{ getDesgloseTooltip(tarea.presupuestoDesglose) }}</span>
                      </v-tooltip>
                    </div>

                    <span class="text-caption text-medium-emphasis">
                      <v-icon size="12" class="mr-1">mdi-calendar</v-icon>
                      {{ formatDate(tarea.fecha_creacion) }}
                    </span>

                    <span
                      v-if="tarea.fecha_limite"
                      class="text-caption"
                      :class="getDiasRestantesColor(tarea.fecha_limite)"
                    >
                      <v-icon size="12" class="mr-1">mdi-clock</v-icon>
                      {{ calcularDiasRestantes(tarea.fecha_limite) }}
                    </span>
                  </div>
                </v-list-item-subtitle>

                <template v-slot:append>
                  <div class="d-flex acciones-container">
                    <v-tooltip text="Informe de Subactividad" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon="mdi-file-document-outline"
                          variant="text"
                          color="info"
                          size="x-small"
                          @click.stop="$emit('ver-informe-tarea', tarea)"
                          class="accion-btn"
                        ></v-btn>
                      </template>
                    </v-tooltip>

                    <v-tooltip text="Editar subactividad" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon="mdi-pencil"
                          variant="text"
                          color="warning"
                          size="x-small"
                          @click.stop="$emit('edit-tarea', { actividadId: actividad.id, tarea })"
                          class="accion-btn"
                        ></v-btn>
                      </template>
                    </v-tooltip>

                    <v-tooltip text="Eliminar Subactividad" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon="mdi-delete"
                          variant="text"
                          color="error"
                          size="x-small"
                          @click.stop="$emit('delete-tarea', { actividadId: actividad.id, tarea })"
                          class="accion-btn"
                        ></v-btn>
                      </template>
                    </v-tooltip>
                  </div>
                </template>
              </v-list-item>

              <div
                v-if="!actividad.tareas || actividad.tareas.length === 0"
                class="text-center py-3"
              >
                <v-icon size="32" color="grey-lighten-2" class="mb-1">mdi-playlist-remove</v-icon>
                <div class="text-caption text-grey">No hay subactividades</div>
                <v-btn
                  color="info"
                  variant="text"
                  size="x-small"
                  @click.stop="$emit('add-tarea', actividad.id)"
                  class="mt-1"
                >
                  <v-icon left size="14">mdi-plus</v-icon>
                  Crear primera subactividad
                </v-btn>
              </div>
            </v-list>
          </v-list-group>
        </v-list>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  responsable: {
    type: Object,
    required: true,
  },
  expandido: {
    type: Boolean,
    default: false,
  },
})

defineEmits([
  'toggle',
  'ver-actividad',
  'add-tarea',
  'edit-tarea',
  'delete-tarea',
  'ver-informe-tarea',
])

// Estados para popup
const popupVisible = ref(false)
const actividadPopup = ref(null)
const popupX = ref(0)
const popupY = ref(0)
let popupTimeoutId = null

// Funciones helper (idénticas a GrupoProyecto)
const formatCurrency = (value) => {
  if (!value) return 'Bs. 0.00'
  const numValue = Number(value)
  return !isNaN(numValue) ? `Bs. ${numValue.toFixed(2)}` : 'Bs. 0.00'
}

const getStatusColor = (status) => {
  const colors = {
    CRD: 'grey',
    PLAN: 'light-blue',
    RETR: 'red',
    REPROG: 'warning',
    EJEC: 'orange',
    REP: 'light-green',
    FIN: 'success',
  }
  return colors[status] || 'grey'
}

const getTipoIcon = (status) => {
  const icons = {
    CRD: 'mdi-plus-circle',
    PLAN: 'mdi-calendar-check-outline',
    RETR: 'mdi-calendar-alert',
    REPROG: 'mdi-calendar-refresh',
    EJEC: 'mdi-calendar-arrow-right',
    REP: 'mdi-calendar-edit',
    FIN: 'mdi-calendar-done',
  }
  return icons[status] || 'mdi-help-circle'
}

const getStatusColorTarea = (status) => {
  const colors = { PEN: 'grey', EPROG: 'warning', COMPL: 'success' }
  return colors[status] || 'grey'
}

const getTareaIcon = (status) => {
  const icons = { PEN: 'mdi-clock-outline', EPROG: 'mdi-progress-clock', COMPL: 'mdi-check-circle' }
  return icons[status] || 'mdi-help-circle'
}

const getEstadoTareaDisplay = (status) => {
  const estados = { PEN: 'Pendiente', EPROG: 'En Progreso', COMPL: 'Completada' }
  return estados[status] || status
}

const getEstadoTexto = (status) => {
  const estados = {
    CRD: 'Creada',
    PLAN: 'Planificada',
    RETR: 'Retraso',
    REPROG: 'Reprogramación',
    EJEC: 'En Ejecución',
    REP: 'En Reporte',
    FIN: 'Finalizado',
  }
  return estados[status] || status
}

const truncarTexto = (texto, max) => {
  if (!texto) return ''
  return texto.length > max ? texto.substring(0, max) + '...' : texto
}

const tieneCodigoValido = (codigo) => {
  return codigo && typeof codigo === 'string' && codigo.trim().length > 0
}

const formatearCodigo = (codigo) => {
  return tieneCodigoValido(codigo) ? codigo.trim().toUpperCase() : ''
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES')
}

const calcularDiasRestantes = (fechaLimite) => {
  if (!fechaLimite) return 'Sin fecha'
  const hoy = new Date()
  const limite = new Date(fechaLimite)
  const diffTime = limite - hoy
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Hoy'
  if (diffDays === 1) return '1 día'
  if (diffDays > 0) return `${diffDays} días`
  return `Hace ${Math.abs(diffDays)} días`
}

const getDiasRestantesColor = (fechaLimite) => {
  if (!fechaLimite) return 'text-grey'
  const hoy = new Date()
  const limite = new Date(fechaLimite)
  const diffTime = limite - hoy
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  if (diffDays < 0) return 'text-error'
  if (diffDays <= 3) return 'text-warning'
  if (diffDays <= 7) return 'text-info'
  return 'text-success'
}

const getDesgloseTooltip = (desglose) => {
  if (!desglose || desglose.length === 0) return 'Sin desglose'
  if (desglose.length === 1) return '1 item desglosado'
  return `${desglose.length} items desglosados`
}

const irInformeActividad = (actividadId) => {
  router.push('/monitoreo/informe-actividad/' + actividadId)
}

const irInformeActividadSubactividad = (actividad) => {
  if (actividad.pei_id) {
    router.push(`/monitoreo/informes-actividad-subactividad-pei/${actividad.id}`)
  } else {
    router.push(`/monitoreo/informes-actividad-subactividad/${actividad.id}`)
  }
}

const mostrarPopupActividad = (actividad, event) => {
  if (popupTimeoutId) clearTimeout(popupTimeoutId)
  actividadPopup.value = actividad
  popupX.value = event.clientX + 15
  popupY.value = event.clientY + 15
  popupVisible.value = true
}

const ocultarPopupActividad = () => {
  popupTimeoutId = setTimeout(() => {
    popupVisible.value = false
    actividadPopup.value = null
  }, 200)
}
</script>

<style scoped>
.grupo-card {
  margin-bottom: 16px;
}
.grupo-header {
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.grupo-header:hover {
  background-color: rgba(var(--v-theme-info), 0.05);
}
.actividad-item {
  transition: all 0.2s ease;
}
.actividad-item:hover {
  background-color: rgba(var(--v-theme-info), 0.05);
}
.tarea-item {
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: white;
  transition: all 0.2s ease;
}
.tarea-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.acciones-container {
  display: flex;
  gap: 2px;
}
.accion-btn {
  opacity: 0.7;
  transition: all 0.2s ease;
}
.actividad-item:hover .accion-btn {
  opacity: 1;
}
.accion-btn:hover {
  transform: translateY(-1px);
}
.chip-codigo {
  font-size: 0.65rem;
  letter-spacing: 0.3px;
}
.desglose-badge {
  background-color: rgba(33, 150, 243, 0.1);
  padding: 2px 6px;
  border-radius: 12px;
  border: 1px solid rgba(33, 150, 243, 0.3);
}
</style>
