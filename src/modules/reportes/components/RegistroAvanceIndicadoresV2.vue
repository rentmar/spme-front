<template>
  <v-container fluid class="indicators-container pa-4">
    <!-- BARRA SUPERIOR: Selector de tipos de indicadores -->
    <v-row class="mb-4">
      <v-col cols="12">
        <v-card elevation="2" class="type-selector-card">
          <v-card-text class="pa-3">
            <div class="d-flex align-center flex-wrap">
              <v-icon color="primary" class="mr-2">mdi-filter-variant</v-icon>
              <span class="text-subtitle-1 font-weight-bold mr-4">Filtrar por tipo:</span>

              <v-chip-group v-model="filterType" column multiple class="ml-2">
                <v-chip
                  filter
                  variant="outlined"
                  size="small"
                  value="indicadorog"
                  color="blue"
                  prepend-icon="mdi-chart-bar"
                >
                  OG
                </v-chip>
                <v-chip
                  filter
                  variant="outlined"
                  size="small"
                  value="indicadoroe"
                  color="green"
                  prepend-icon="mdi-chart-line"
                >
                  OE
                </v-chip>
                <v-chip
                  filter
                  variant="outlined"
                  size="small"
                  value="indicadorrog"
                  color="orange"
                  prepend-icon="mdi-chart-areaspline"
                >
                  ROG
                </v-chip>
                <v-chip
                  filter
                  variant="outlined"
                  size="small"
                  value="indicadorroe"
                  color="purple"
                  prepend-icon="mdi-chart-bell-curve"
                >
                  ROE
                </v-chip>
              </v-chip-group>

              <v-spacer></v-spacer>

              <div class="d-flex align-center">
                <v-btn
                  size="small"
                  @click="selectAllTypes"
                  color="primary"
                  variant="outlined"
                  class="mr-2"
                >
                  <v-icon start size="small">mdi-select-all</v-icon>
                  Todos
                </v-btn>
                <v-btn size="small" @click="clearAllTypes" color="grey" variant="outlined">
                  <v-icon start size="small">mdi-select-off</v-icon>
                  Ninguno
                </v-btn>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- CONTADOR DE INDICADORES -->
    <v-row class="mb-2">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-icon color="primary" class="mr-2">mdi-chart-multiple</v-icon>
            <span class="text-subtitle-1 font-weight-bold"
              >Indicadores encontrados: {{ filteredIndicators.length }}</span
            >
          </div>
          <div class="d-flex align-center">
            <v-chip
              v-if="hasRegisteredIndicators"
              color="success"
              prepend-icon="mdi-check-circle"
              size="small"
              class="mr-3"
            >
              {{ registeredCount }} con avance
            </v-chip>
            <v-btn
              size="small"
              @click="toggleAllDetails"
              color="primary"
              variant="outlined"
              class="mr-2"
            >
              <v-icon start size="small">{{ showAllDetails ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon>
              {{ showAllDetails ? 'Ocultar todos' : 'Mostrar todos' }}
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- LISTA DE INDICADORES - 3 TARJETAS POR INDICADOR -->
    <div
      v-for="indicator in filteredIndicators"
      :key="`${indicator.tipo}-${indicator.id}`"
      class="mb-6"
    >
      <!-- Encabezado del indicador -->
      <v-row>
        <v-col cols="12">
          <v-card
            elevation="1"
            class="indicator-header-card mb-2"
            :class="{ 'indicator-with-registry': hasRegistry(indicator) }"
          >
            <v-card-text class="pa-3">
              <div class="d-flex align-center justify-space-between">
                <div class="d-flex align-center">
                  <div class="position-relative">
                    <v-avatar :color="getIndicatorColor(indicator.tipo)" size="40" class="mr-3">
                      <v-icon size="20" dark>
                        {{ getIndicatorIcon(indicator.tipo) }}
                      </v-icon>
                    </v-avatar>
                    <v-icon
                      v-if="hasRegistry(indicator)"
                      color="success"
                      size="small"
                      class="registry-badge"
                    >
                      mdi-check-circle
                    </v-icon>
                  </div>
                  <div>
                    <div class="d-flex align-center">
                      <h3 class="text-h6 font-weight-bold">{{ indicator.codigo }}</h3>
                      <v-chip
                        v-if="hasRegistry(indicator)"
                        color="success"
                        size="x-small"
                        class="ml-2"
                        label
                      >
                        <v-icon start size="10">mdi-check</v-icon>
                        Avance registrado
                      </v-chip>
                    </div>
                    <div class="d-flex align-center">
                      <v-chip
                        :color="getIndicatorChipColor(indicator.tipo)"
                        class="mr-2"
                        size="small"
                      >
                        {{ getIndicatorTypeLabel(indicator.tipo) }}
                      </v-chip>
                      <span class="text-caption text-grey">ID: {{ indicator.id }}</span>
                    </div>
                  </div>
                </div>

                <div class="d-flex align-center">
                  <v-btn
                    size="small"
                    @click="toggleIndicatorDetails(indicator)"
                    :color="isIndicatorExpanded(indicator) ? 'primary' : 'grey'"
                    variant="text"
                    class="mr-2"
                  >
                    <v-icon>{{
                      isIndicatorExpanded(indicator) ? 'mdi-chevron-up' : 'mdi-chevron-down'
                    }}</v-icon>
                    {{ isIndicatorExpanded(indicator) ? 'Ocultar' : 'Mostrar' }}
                  </v-btn>

                  <v-menu>
                    <template v-slot:activator="{ props }">
                      <v-btn
                        size="small"
                        icon="mdi-dots-vertical"
                        variant="text"
                        v-bind="props"
                      ></v-btn>
                    </template>
                    <v-list density="compact">
                      <v-list-item @click="selectIndicator(indicator)">
                        <template v-slot:prepend>
                          <v-icon>mdi-eye</v-icon>
                        </template>
                        <v-list-item-title>Ver detalles</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="exportIndicatorData(indicator)">
                        <template v-slot:prepend>
                          <v-icon>mdi-download</v-icon>
                        </template>
                        <v-list-item-title>Exportar datos</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
              </div>

              <div class="mt-2">
                <p class="text-body-2 mb-0">{{ indicator.descripcion }}</p>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- TARJETAS DEL INDICADOR (se muestran cuando está expandido) -->
      <v-expand-transition>
        <div v-if="isIndicatorExpanded(indicator)">
          <v-row>
            <!-- TARJETA 1: Indicador -->
            <v-col cols="12" md="4">
              <v-card height="500" elevation="2" class="h-100">
                <v-card-title class="d-flex align-center primary text-white">
                  <v-icon class="mr-2" color="white">mdi-chart-line</v-icon>
                  Indicador
                  <v-spacer></v-spacer>
                  <v-chip
                    v-if="hasRegistry(indicator)"
                    color="white"
                    text-color="primary"
                    size="x-small"
                  >
                    <v-icon start size="10">mdi-check</v-icon>
                    Registrado
                  </v-chip>
                </v-card-title>

                <v-divider></v-divider>

                <v-card-text class="h-100 overflow-y-auto">
                  <!-- Información básica -->
                  <v-list lines="two" density="compact" class="mb-4">
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon color="primary" size="small">mdi-calendar</v-icon>
                      </template>
                      <v-list-item-title class="text-caption font-weight-bold"
                        >Frecuencia</v-list-item-title
                      >
                      <v-list-item-subtitle class="text-body-2">
                        {{ getIndicatorDetail(indicator)?.frecuencia || 'MENSUAL' }}
                      </v-list-item-subtitle>
                    </v-list-item>

                    <v-divider class="my-1"></v-divider>

                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon color="primary" size="small">mdi-file-document</v-icon>
                      </template>
                      <v-list-item-title class="text-caption font-weight-bold"
                        >Fuente de Verificación</v-list-item-title
                      >
                      <v-list-item-subtitle class="text-body-2">
                        {{
                          getIndicatorDetail(indicator)?.fuente_verificacion ||
                          'Informes, listas de asistencia'
                        }}
                      </v-list-item-subtitle>
                    </v-list-item>

                    <v-divider class="my-1"></v-divider>

                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon color="primary" size="small">mdi-account</v-icon>
                      </template>
                      <v-list-item-title class="text-caption font-weight-bold"
                        >Responsable</v-list-item-title
                      >
                      <v-list-item-subtitle class="text-body-2">
                        {{
                          getIndicatorDetail(indicator)?.responsable || 'Coordinador de Proyectos'
                        }}
                      </v-list-item-subtitle>
                    </v-list-item>
                  </v-list>

                  <!-- Meta del indicador -->
                  <v-card variant="outlined" class="mt-4">
                    <v-card-title class="text-subtitle-2 pa-3">Progreso de Meta</v-card-title>
                    <v-card-text>
                      <div class="d-flex justify-space-between mb-2">
                        <span class="text-caption">Avance actual</span>
                        <span class="text-caption font-weight-bold text-primary">
                          {{ getCurrentValue(indicator) }} / {{ getTargetValue(indicator) }}
                        </span>
                      </div>
                      <v-progress-linear
                        color="primary"
                        height="12"
                        :model-value="getProgressPercentage(indicator)"
                        rounded
                      ></v-progress-linear>

                      <div class="d-flex justify-space-between mt-3">
                        <div class="text-center">
                          <div class="text-h6 font-weight-bold">
                            {{ getIndicatorHistory(indicator).length }}
                          </div>
                          <div class="text-caption">Registros</div>
                        </div>
                        <div class="text-center">
                          <div class="text-h6 font-weight-bold">
                            {{ getLastValue(indicator) !== 'N/A' ? getLastValue(indicator) : '-' }}
                          </div>
                          <div class="text-caption">Último valor</div>
                        </div>
                        <div class="text-center">
                          <div class="d-flex align-center">
                            <span class="text-h6 font-weight-bold mr-1">
                              {{ getAverageValue(indicator) }}
                            </span>
                            <v-icon :color="getTrendColor(indicator)" size="small">
                              {{ getTrendIcon(indicator) }}
                            </v-icon>
                          </div>
                          <div class="text-caption">Promedio</div>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- TARJETA 2: Registro -->
            <v-col cols="12" md="4">
              <v-card height="500" elevation="2" class="h-100">
                <v-card-title class="d-flex align-center success text-white">
                  <v-icon class="mr-2" color="white">mdi-pencil-plus</v-icon>
                  Registro
                  <v-spacer></v-spacer>
                  <v-btn
                    v-if="!hasRegistry(indicator)"
                    icon="mdi-content-save"
                    variant="text"
                    color="white"
                    @click="submitEntryForIndicator(indicator)"
                    :loading="isLoadingEntry(indicator)"
                    :disabled="!isFormValid(indicator)"
                    size="small"
                  ></v-btn>
                </v-card-title>

                <v-divider></v-divider>

                <v-card-text class="h-100 overflow-y-auto">
                  <div v-if="hasRegistry(indicator)" class="text-center py-8">
                    <v-icon size="64" color="success" class="mb-4">mdi-check-circle</v-icon>
                    <h3 class="text-subtitle-1 font-weight-bold mb-2">Avance ya registrado</h3>
                    <p class="text-caption text-grey mb-4">
                      Ya existe un registro de avance para este indicador.<br />
                      Para modificarlo, primero debe eliminar el registro existente.
                    </p>
                    <v-btn
                      color="error"
                      variant="outlined"
                      size="small"
                      @click="deleteLatestRecord(indicator)"
                      :loading="isLoadingDelete(indicator)"
                    >
                      <v-icon start size="small">mdi-delete</v-icon>
                      Eliminar registro actual
                    </v-btn>
                  </div>

                  <v-form v-else @submit.prevent="submitEntryForIndicator(indicator)" class="h-100">
                    <!-- Campo de fecha -->
                    <v-text-field
                      :model-value="getFormValue(indicator.id, 'fecha_registro')"
                      @update:model-value="setFormValue(indicator.id, 'fecha_registro', $event)"
                      label="Fecha de Registro *"
                      type="date"
                      prepend-inner-icon="mdi-calendar"
                      :rules="[rules.required]"
                      required
                      variant="outlined"
                      density="compact"
                      class="mb-3"
                    ></v-text-field>

                    <!-- Campo de valor -->
                    <v-text-field
                      :model-value="getFormValue(indicator.id, 'valor_numerico')"
                      @update:model-value="setFormValue(indicator.id, 'valor_numerico', $event)"
                      :label="`Valor ${getDataTypeLabel(getIndicatorDetail(indicator)?.tipo)} *`"
                      :type="getIndicatorDetail(indicator)?.tipo === '1-9' ? 'number' : 'text'"
                      :prepend-inner-icon="getDataTypeIcon(getIndicatorDetail(indicator)?.tipo)"
                      :rules="[rules.required]"
                      required
                      variant="outlined"
                      density="compact"
                      class="mb-3"
                      :placeholder="getPlaceholder(getIndicatorDetail(indicator)?.tipo)"
                    ></v-text-field>

                    <!-- Campo de observaciones -->
                    <v-textarea
                      :model-value="getFormValue(indicator.id, 'observaciones')"
                      @update:model-value="setFormValue(indicator.id, 'observaciones', $event)"
                      label="Observaciones"
                      prepend-inner-icon="mdi-note-text-outline"
                      rows="4"
                      variant="outlined"
                      density="compact"
                      class="mb-3"
                      placeholder="Describa el contexto del registro..."
                      auto-grow
                    ></v-textarea>

                    <!-- Información adicional -->
                    <v-alert variant="tonal" color="info" density="compact" class="mb-3">
                      <template v-slot:prepend>
                        <v-icon color="info">mdi-information</v-icon>
                      </template>
                      <div class="text-caption">
                        <strong>Meta:</strong> {{ getTargetValue(indicator) }}
                        <br />
                        <strong>Último registro:</strong> {{ getLastValue(indicator) }}
                      </div>
                    </v-alert>

                    <!-- Botón de guardar -->
                    <v-btn
                      color="success"
                      :loading="isLoadingEntry(indicator)"
                      :disabled="!isFormValid(indicator)"
                      @click="submitEntryForIndicator(indicator)"
                      block
                      size="large"
                      class="mt-auto"
                    >
                      <v-icon start>mdi-content-save</v-icon>
                      Registrar Avance
                    </v-btn>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- TARJETA 3: Bitácora -->
            <v-col cols="12" md="4">
              <v-card height="500" elevation="2" class="h-100">
                <v-card-title class="d-flex align-center warning text-white">
                  <v-icon class="mr-2" color="white">mdi-book-open-page-variant</v-icon>
                  Bitácora
                  <v-spacer></v-spacer>
                  <v-chip
                    v-if="getIndicatorHistory(indicator).length > 0"
                    color="white"
                    text-color="warning"
                    size="x-small"
                  >
                    {{ getIndicatorHistory(indicator).length }} eventos
                  </v-chip>
                </v-card-title>

                <v-divider></v-divider>

                <v-card-text class="timeline-container">
                  <div v-if="isLoadingHistory(indicator)" class="text-center py-8">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                    <p class="text-caption mt-2">Cargando bitácora...</p>
                  </div>

                  <div
                    v-else-if="
                      !getIndicatorHistory(indicator) || getIndicatorHistory(indicator).length === 0
                    "
                    class="text-center py-8"
                  >
                    <v-icon size="64" color="grey-lighten-1" class="mb-4"
                      >mdi-book-open-blank</v-icon
                    >
                    <h3 class="text-subtitle-1 text-grey-darken-1 mb-2">Bitácora vacía</h3>
                    <p class="text-caption text-grey mb-4">
                      No hay eventos registrados en la bitácora
                    </p>
                  </div>

                  <div v-else class="timeline-scroll">
                    <!-- TIMELINE MEJORADO -->
                    <v-timeline density="compact" align="start" class="mt-0 pt-0">
                      <v-timeline-item
                        v-for="(record, index) in getIndicatorHistory(indicator)"
                        :key="index"
                        :dot-color="getRecordDotColor(record)"
                        :size="getRecordSize(record)"
                        :icon="getRecordIcon(record)"
                        fill-dot
                      >
                        <template v-slot:opposite>
                          <div class="d-flex flex-column align-end">
                            <span class="text-caption font-weight-bold">{{
                              formatDate(record.fecha_registro)
                            }}</span>
                            <span class="text-caption text-grey">{{
                              formatTime(record.fecha_registro)
                            }}</span>
                          </div>
                        </template>

                        <v-card variant="outlined" class="mb-2">
                          <v-card-text class="pa-2">
                            <div class="d-flex justify-space-between align-start">
                              <div>
                                <div class="d-flex align-center mb-1">
                                  <span class="text-subtitle-2 font-weight-bold mr-2">
                                    {{ formatValue(record) }}
                                  </span>
                                  <v-chip size="x-small" :color="getRecordChipColor(record)" label>
                                    {{ getRecordType(record) }}
                                  </v-chip>
                                </div>
                                <p v-if="record.observaciones" class="text-caption mb-0">
                                  {{ record.observaciones }}
                                </p>
                                <div class="d-flex align-center mt-1">
                                  <v-icon size="12" color="grey" class="mr-1">mdi-account</v-icon>
                                  <span class="text-caption text-grey">
                                    {{ record.registrado_por }}
                                  </span>
                                </div>
                              </div>
                              <v-menu location="bottom end">
                                <template v-slot:activator="{ props }">
                                  <v-btn
                                    size="x-small"
                                    icon="mdi-dots-vertical"
                                    variant="text"
                                    v-bind="props"
                                  ></v-btn>
                                </template>
                                <v-list density="compact">
                                  <v-list-item @click="deleteRecord(record, indicator)">
                                    <template v-slot:prepend>
                                      <v-icon color="error" size="small">mdi-delete</v-icon>
                                    </template>
                                    <v-list-item-title class="text-error">
                                      Eliminar
                                    </v-list-item-title>
                                  </v-list-item>
                                </v-list>
                              </v-menu>
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-timeline-item>
                    </v-timeline>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-expand-transition>
    </div>

    <!-- Mensaje cuando no hay indicadores -->
    <v-row v-if="filteredIndicators.length === 0">
      <v-col cols="12">
        <v-card elevation="2" class="text-center py-12">
          <v-icon size="72" color="grey-lighten-2" class="mb-4">mdi-chart-line-off</v-icon>
          <h3 class="text-h5 text-grey-darken-1 mb-3">No hay indicadores para mostrar</h3>
          <p class="text-body-1 text-grey mb-6">
            Ajusta los filtros o verifica que haya indicadores disponibles
          </p>
          <v-btn color="primary" size="large" @click="selectAllTypes">
            <v-icon start>mdi-filter-remove</v-icon>
            Mostrar todos los tipos
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- Snackbar para mensajes -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      location="top right"
    >
      <div class="d-flex align-center">
        <v-icon class="mr-2" dark>{{ snackbar.icon }}</v-icon>
        {{ snackbar.text }}
      </div>
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false" dark> Cerrar </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Variables reactivas
const indicators = ref([])
const filterType = ref(['indicadorog', 'indicadoroe', 'indicadorrog', 'indicadorroe'])
const expandedIndicators = ref(new Set())
const entryForms = ref({})
const loadingEntries = ref({})
const loadingHistories = ref({})
const loadingDeletes = ref({})
const showAllDetails = ref(false)

// Snackbar para mensajes
const snackbar = ref({
  show: false,
  text: '',
  color: 'success',
  icon: 'mdi-check-circle',
})

// Historial de ejemplo por indicador
const indicatorHistories = ref({
  147: [
    {
      id: 1,
      fecha_registro: '2024-06-15T14:30:00',
      tipo_dato: '1-9',
      valor_numerico: 65,
      observaciones: 'Capacitación completada con éxito. Alta participación de 65 personas.',
      registrado_por: 'María González',
    },
  ],
  148: [],
  149: [],
  154: [],
})

// Detalles de indicadores
const indicatorDetails = ref({})

// Reglas de validación
const rules = {
  required: (value) => !!value || 'Campo requerido',
}

// Computed properties
const filteredIndicators = computed(() => {
  if (!indicators.value) return []
  return indicators.value.filter((indicator) => filterType.value.includes(indicator.tipo))
})

const hasRegisteredIndicators = computed(() => {
  return filteredIndicators.value.some((indicator) => hasRegistry(indicator))
})

const registeredCount = computed(() => {
  return filteredIndicators.value.filter((indicator) => hasRegistry(indicator)).length
})

// Métodos para manejar formularios
const getFormValue = (indicatorId, field) => {
  if (!entryForms.value[indicatorId]) {
    entryForms.value[indicatorId] = {
      fecha_registro: getDefaultEntryDate(),
      valor_numerico: null,
      observaciones: '',
    }
  }
  return entryForms.value[indicatorId][field]
}

const setFormValue = (indicatorId, field, value) => {
  if (!entryForms.value[indicatorId]) {
    entryForms.value[indicatorId] = {
      fecha_registro: getDefaultEntryDate(),
      valor_numerico: null,
      observaciones: '',
    }
  }
  entryForms.value[indicatorId][field] = value
}

// Métodos para los filtros
const selectAllTypes = () => {
  filterType.value = ['indicadorog', 'indicadoroe', 'indicadorrog', 'indicadorroe']
}

const clearAllTypes = () => {
  filterType.value = []
}

// Métodos para expandir/colapsar
const toggleIndicatorDetails = (indicator) => {
  const key = `${indicator.tipo}-${indicator.id}`
  if (expandedIndicators.value.has(key)) {
    expandedIndicators.value.delete(key)
  } else {
    expandedIndicators.value.add(key)
  }
}

const isIndicatorExpanded = (indicator) => {
  const key = `${indicator.tipo}-${indicator.id}`
  return showAllDetails.value || expandedIndicators.value.has(key)
}

const toggleAllDetails = () => {
  showAllDetails.value = !showAllDetails.value
  if (!showAllDetails.value) {
    expandedIndicators.value.clear()
  }
}

// Métodos auxiliares
const formatDate = (date) => {
  if (!date) return 'N/A'
  const dateObj = new Date(date)
  return dateObj.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const formatTime = (date) => {
  if (!date) return ''
  const dateObj = new Date(date)
  return dateObj.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getDefaultEntryDate = () => {
  return new Date().toISOString().split('T')[0]
}

const getIndicatorColor = (tipo) => {
  const colors = {
    indicadorog: 'blue',
    indicadoroe: 'green',
    indicadorrog: 'orange',
    indicadorroe: 'purple',
  }
  return colors[tipo] || 'grey'
}

const getIndicatorChipColor = (tipo) => {
  const colors = {
    indicadorog: 'blue',
    indicadoroe: 'green',
    indicadorrog: 'orange',
    indicadorroe: 'purple',
  }
  return colors[tipo] || 'grey'
}

const getIndicatorIcon = (tipo) => {
  const icons = {
    indicadorog: 'mdi-chart-bar',
    indicadoroe: 'mdi-chart-line',
    indicadorrog: 'mdi-chart-areaspline',
    indicadorroe: 'mdi-chart-bell-curve',
  }
  return icons[tipo] || 'mdi-chart-bar'
}

const getIndicatorTypeLabel = (tipo) => {
  const labels = {
    indicadorog: 'Indicador OG',
    indicadoroe: 'Indicador OE',
    indicadorrog: 'Indicador ROG',
    indicadorroe: 'Indicador ROE',
  }
  return labels[tipo] || 'Indicador'
}

const getDataTypeLabel = (tipo) => {
  const labels = {
    'A-Z': 'Literal',
    '1-9': 'Numérico',
    '%': 'Porcentual',
  }
  return labels[tipo] || 'Numérico'
}

const getDataTypeIcon = (tipo) => {
  const icons = {
    'A-Z': 'mdi-text',
    '1-9': 'mdi-numeric',
    '%': 'mdi-percent',
  }
  return icons[tipo] || 'mdi-numeric'
}

const getPlaceholder = (tipo) => {
  const placeholders = {
    'A-Z': 'Ej: Bueno, Regular, Excelente',
    '1-9': 'Ej: 150, 75.5, 2000',
    '%': 'Ej: 85.5, 100, 75',
  }
  return placeholders[tipo] || 'Ingrese el valor'
}

// Datos de ejemplo
const createMockIndicators = () => {
  return [
    {
      id: 147,
      codigo: 'IND0001-OO',
      descripcion: 'Número de participantes capacitados en gestión de proyectos',
      tipo: 'indicadorog',
      tipoBitacora: 'indicador_og',
      nivel: 2,
      rama: 'izquierda',
    },
    {
      id: 148,
      codigo: 'IND00002-OO',
      descripcion: 'Satisfacción general de los participantes en las capacitaciones',
      tipo: 'indicadorog',
      tipoBitacora: 'indicador_og',
      nivel: 2,
      rama: 'izquierda',
    },
    {
      id: 149,
      codigo: 'IND001-R002-OO',
      descripcion: 'Porcentaje de aplicabilidad de conocimientos adquiridos',
      tipo: 'indicadorrog',
      tipoBitacora: 'indicador_rog',
      nivel: 3,
      rama: 'izquierda',
    },
    {
      id: 154,
      codigo: 'IND001-SPO2',
      descripcion: 'Número de proyectos mejorados tras la capacitación',
      tipo: 'indicadoroe',
      tipoBitacora: 'indicador_oe',
      nivel: 3,
      rama: 'derecha',
    },
  ]
}

const createMockIndicatorDetail = (indicator) => {
  return {
    codigo: indicator.codigo,
    descripcion: indicator.descripcion,
    fuente_verificacion: 'Informes de capacitación, listas de asistencia, evaluaciones',
    frecuencia: 'MENSUAL',
    responsable: 'Juan Pérez - Coordinador de Proyectos',
    tipo: '1-9',
    meta: indicator.tipo === 'indicadorog' ? 100 : 90,
  }
}

// Métodos para manejar datos por indicador
const getIndicatorDetail = (indicator) => {
  if (!indicatorDetails.value[indicator.id]) {
    indicatorDetails.value[indicator.id] = createMockIndicatorDetail(indicator)
  }
  return indicatorDetails.value[indicator.id]
}

const getIndicatorHistory = (indicator) => {
  return indicatorHistories.value[indicator.id] || []
}

const hasRegistry = (indicator) => {
  const history = getIndicatorHistory(indicator)
  return history && history.length > 0
}

const isFormValid = (indicator) => {
  const form = entryForms.value[indicator.id]
  return form && form.fecha_registro && form.valor_numerico
}

const isLoadingEntry = (indicator) => {
  return loadingEntries.value[indicator.id] || false
}

const isLoadingHistory = (indicator) => {
  return loadingHistories.value[indicator.id] || false
}

const isLoadingDelete = (indicator) => {
  return loadingDeletes.value[indicator.id] || false
}

// Métodos para el timeline
const getRecordDotColor = (record) => {
  if (record.valor_numerico > 80) return 'success'
  if (record.valor_numerico > 60) return 'warning'
  return 'error'
}

const getRecordSize = (record) => {
  return record.valor_numerico > 80 ? 'large' : 'default'
}

const getRecordIcon = (record) => {
  if (record.valor_numerico > 80) return 'mdi-check-circle'
  if (record.valor_numerico > 60) return 'mdi-alert-circle'
  return 'mdi-close-circle'
}

const getRecordChipColor = (record) => {
  return record.valor_numerico > 80 ? 'success' : record.valor_numerico > 60 ? 'warning' : 'error'
}

const getRecordType = (record) => {
  return getDataTypeLabel(record.tipo_dato)
}

const formatValue = (record) => {
  if (record.valor_numerico) return record.valor_numerico
  return 'Sin valor'
}

// Métodos para estadísticas
const getLastValue = (indicator) => {
  const history = getIndicatorHistory(indicator)
  return history.length > 0 ? history[0].valor_numerico : 'N/A'
}

const getAverageValue = (indicator) => {
  const history = getIndicatorHistory(indicator)
  if (history.length === 0) return 0
  const sum = history.reduce((acc, r) => acc + (r.valor_numerico || 0), 0)
  return Math.round(sum / history.length)
}

const getLastRecordDate = (indicator) => {
  const history = getIndicatorHistory(indicator)
  return history.length > 0 ? formatDate(history[0].fecha_registro) : 'N/A'
}

const getCurrentValue = (indicator) => {
  const history = getIndicatorHistory(indicator)
  return history.length > 0 ? history[0].valor_numerico : 0
}

const getTargetValue = (indicator) => {
  return getIndicatorDetail(indicator)?.meta || 100
}

const getProgressPercentage = (indicator) => {
  const current = getCurrentValue(indicator)
  const target = getTargetValue(indicator)
  return Math.min(Math.round((current / target) * 100), 100)
}

const getTrendIcon = (indicator) => {
  const history = getIndicatorHistory(indicator)
  if (history.length < 2) return 'mdi-minus'
  const last = history[0].valor_numerico
  const prev = history[1].valor_numerico
  if (last > prev) return 'mdi-arrow-up'
  if (last < prev) return 'mdi-arrow-down'
  return 'mdi-minus'
}

const getTrendColor = (indicator) => {
  const history = getIndicatorHistory(indicator)
  if (history.length < 2) return 'grey'
  const last = history[0].valor_numerico
  const prev = history[1].valor_numerico
  if (last > prev) return 'success'
  if (last < prev) return 'error'
  return 'grey'
}

// Métodos principales
const submitEntryForIndicator = async (indicator) => {
  if (hasRegistry(indicator)) {
    showMessage(
      'Ya existe un registro para este indicador. Debe eliminarlo primero.',
      'warning',
      'mdi-alert',
    )
    return
  }

  const form = entryForms.value[indicator.id]

  if (!form || !form.fecha_registro || !form.valor_numerico) {
    showMessage('Complete todos los campos requeridos', 'error', 'mdi-alert-circle')
    return
  }

  loadingEntries.value[indicator.id] = true

  // Simular envío a API
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Crear nuevo registro
  const newRecord = {
    id: 1,
    fecha_registro: new Date().toISOString(),
    tipo_dato: getIndicatorDetail(indicator)?.tipo || '1-9',
    valor_numerico: parseFloat(form.valor_numerico),
    observaciones: form.observaciones || '',
    registrado_por: 'Usuario Actual',
  }

  // Inicializar historial si es necesario
  if (!indicatorHistories.value[indicator.id]) {
    indicatorHistories.value[indicator.id] = []
  }

  // Reemplazar el historial existente (solo un registro permitido)
  indicatorHistories.value[indicator.id] = [newRecord]

  // Limpiar formulario
  entryForms.value[indicator.id] = {
    fecha_registro: getDefaultEntryDate(),
    valor_numerico: null,
    observaciones: '',
  }

  // Mostrar mensaje de éxito
  showMessage('Avance registrado exitosamente!', 'success', 'mdi-check-circle')

  loadingEntries.value[indicator.id] = false
}

const deleteLatestRecord = async (indicator) => {
  loadingDeletes.value[indicator.id] = true

  // Simular eliminación
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Eliminar el registro
  indicatorHistories.value[indicator.id] = []

  showMessage('Registro eliminado exitosamente', 'success', 'mdi-delete')

  loadingDeletes.value[indicator.id] = false
}

const deleteRecord = async (record, indicator) => {
  loadingDeletes.value[indicator.id] = true

  // Simular eliminación
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Eliminar el registro específico
  indicatorHistories.value[indicator.id] = []

  showMessage('Registro eliminado de la bitácora', 'success', 'mdi-delete')

  loadingDeletes.value[indicator.id] = false
}

const refreshHistoryForIndicator = async (indicator) => {
  loadingHistories.value[indicator.id] = true
  await new Promise((resolve) => setTimeout(resolve, 800))
  loadingHistories.value[indicator.id] = false
  showMessage('Bitácora actualizada', 'info', 'mdi-history')
}

const refreshIndicatorData = (indicator) => {
  indicatorDetails.value[indicator.id] = createMockIndicatorDetail(indicator)
  showMessage('Datos del indicador actualizados', 'info', 'mdi-refresh')
}

const scrollToNewEntry = (indicator) => {
  toggleIndicatorDetails(indicator)
}

const selectIndicator = (indicator) => {
  showMessage(`${indicator.codigo} seleccionado`, 'info', 'mdi-check-circle')
}

const exportIndicatorData = (indicator) => {
  showMessage(`Exportando datos de ${indicator.codigo}`, 'info', 'mdi-download')
}

const showMessage = (text, type = 'success', icon = 'mdi-check-circle') => {
  const colors = {
    success: 'success',
    error: 'error',
    warning: 'warning',
    info: 'info',
  }

  snackbar.value = {
    show: true,
    text,
    color: colors[type] || 'success',
    icon,
  }
}

// Inicialización
onMounted(() => {
  // Cargar indicadores de ejemplo
  indicators.value = createMockIndicators()

  // Inicializar formularios para cada indicador
  indicators.value.forEach((indicator) => {
    entryForms.value[indicator.id] = {
      fecha_registro: getDefaultEntryDate(),
      valor_numerico: null,
      observaciones: '',
    }
  })
})
</script>

<style scoped>
.indicators-container {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.type-selector-card {
  border-radius: 8px;
  border-left: 4px solid #1976d2;
}

.indicator-header-card {
  border-left: 4px solid;
  border-left-color: v-bind('indicator => getIndicatorColor(indicator.tipo)');
  transition: all 0.3s ease;
  position: relative;
}

.indicator-header-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.indicator-with-registry {
  background: linear-gradient(to right, rgba(76, 175, 80, 0.05), transparent);
  border-right: 3px solid #4caf50;
}

.position-relative {
  position: relative;
}

.registry-badge {
  position: absolute;
  bottom: -4px;
  right: 8px;
  background: white;
  border-radius: 50%;
  border: 2px solid white;
}

.h-100 {
  height: 100%;
}

.overflow-y-auto {
  overflow-y: auto;
}

/* Estilos para el timeline con scroll */
.timeline-container {
  height: 440px !important;
  padding: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.timeline-scroll {
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
}

.timeline-scroll::-webkit-scrollbar {
  width: 4px;
}

.timeline-scroll::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.timeline-scroll::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.timeline-scroll::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Estilos para el timeline */
:deep(.v-timeline-item .v-timeline-item__body) {
  max-width: 100%;
}

:deep(.v-timeline-item .v-card) {
  margin-left: 4px;
}

/* Estilos para scroll personalizado */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Mejoras visuales */
.text-success {
  color: #4caf50;
}

.text-error {
  color: #f44336;
}

.text-grey {
  color: #9e9e9e;
}

.mt-auto {
  margin-top: auto;
}

.w-100 {
  width: 100%;
}

/* Animación para las tarjetas */
.v-card {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15) !important;
}

/* Asegurar que las columnas se muestren en fila */
.v-row {
  margin-bottom: 8px;
}

/* Espaciado entre tarjetas */
.v-col {
  padding-bottom: 12px;
}
</style>
