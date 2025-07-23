<template>
  <div class="v-row">
    <div class="v-col v-col-12">
      <div>
        <h1 class="title-container">
          <i class="mdi-file-chart mdi v-icon notranslate v-theme--light v-icon--size-default text-primary mr-2" aria-hidden="true"></i>
          ESTRUCTURA DEL PEI
        </h1>
      </div>

      <!-- Encabezado del PEI como tarjeta -->
      <div class="v-card v-theme--light v-card--density-default elevation-1 v-card--variant-outlined mb-4 pei-header-card">
        <div class="v-card__loader">
          <div class="v-progress-linear v-theme--light v-locale--is-ltr" role="progressbar" aria-hidden="true" aria-valuemin="0" aria-valuemax="100" style="top: 0px; height: 0px; --v-progress-linear-height: 2px;">
            <div class="v-progress-linear__background"></div>
            <div class="v-progress-linear__buffer" style="width: 0%;"></div>
            <div class="v-progress-linear__indeterminate">
              <div class="v-progress-linear__indeterminate long"></div>
              <div class="v-progress-linear__indeterminate short"></div>
            </div>
          </div>
        </div>

        <div class="v-card-title project-header">
          <div class="d-flex align-center w-100">
            <i class="mdi-file-chart mdi v-icon notranslate v-theme--light v-icon--size-x-large text-primary mr-3" aria-hidden="true"></i>
            <div class="project-title-container">
              <h2 class="text-h5 font-weight-bold project-title text-wrap">{{ peiData.titulo || 'PEI SIN TÍTULO' }}</h2>
              <div class="text-subtitle-1 text-medium-emphasis project-subtitle">Plan Estratégico Institucional</div>
            </div>
            <div class="v-spacer"></div>
            <span class="v-chip v-theme--light text-error v-chip--density-default v-chip--size-small v-chip--variant-tonal status-chip" draggable="false">
              <span class="v-chip__underlay"></span>
              <div class="v-chip__prepend">
                <i class="mdi-progress-check mdi v-icon notranslate v-theme--light v-icon--size-default v-icon--start" aria-hidden="true"></i>
              </div>
              <div class="v-chip__content" data-no-activator="">No vigente</div>
            </span>
          </div>
        </div>

        <div class="v-card-text project-content">
          <div class="v-row">
            <div class="v-col-sm-6 v-col-12">
              <div class="d-flex align-center mb-2">
                <i class="mdi-calendar mdi v-icon notranslate v-theme--light v-icon--size-small mr-2" aria-hidden="true"></i>
                <span><strong>Fecha inicio:</strong> {{ peiData.fecha_inicio}}</span>
              </div>
              <div class="d-flex align-center mb-2">
                <i class="mdi-calendar-end mdi v-icon notranslate v-theme--light v-icon--size-small mr-2" aria-hidden="true"></i>
                <span><strong>Fecha fin:</strong> {{peiData.fecha_fin}}</span>
              </div>
            </div>
            <div class="v-col-sm-6 v-col-12">
              <div class="d-flex align-center mb-2">
                <i class="mdi-clock mdi v-icon notranslate v-theme--light v-icon--size-small mr-2" aria-hidden="true"></i>
                <span><strong>Período:</strong> {{calcularPeriodo(peiData.fecha_inicio, peiData.fecha_fin)}}</span>
              </div>
              <div class="d-flex align-center mb-2">
                <i class="mdi-update mdi v-icon notranslate v-theme--light v-icon--size-small mr-2" aria-hidden="true"></i>
                <span><strong>Actualizado:</strong> {{peiData.modificado_el}}</span>
              </div>
            </div>
          </div>
        </div>
        <span class="v-card__underlay"></span>
      </div>

      <!-- Marco Lógico -->
      <div class="v-card v-theme--light v-card--density-default v-card--variant-outlined mb-4">
        <div class="v-card__loader">
          <div class="v-progress-linear v-theme--light v-locale--is-ltr" role="progressbar" aria-hidden="true" aria-valuemin="0" aria-valuemax="100" style="top: 0px; height: 0px; --v-progress-linear-height: 2px;">
            <div class="v-progress-linear__background"></div>
            <div class="v-progress-linear__buffer" style="width: 0%;"></div>
            <div class="v-progress-linear__indeterminate">
              <div class="v-progress-linear__indeterminate long"></div>
              <div class="v-progress-linear__indeterminate short"></div>
            </div>
          </div>
        </div>

        <header class="v-toolbar v-toolbar--density-compact bg-primary v-theme--light v-locale--is-ltr">
          <div class="v-toolbar__content" style="height: 48px;">
            <div class="v-toolbar-title">
              <div class="v-toolbar-title__placeholder">ESTRUCTURA DEL PEI</div>
            </div>
            <div class="v-spacer"></div>
            <button type="button" class="v-btn v-btn--icon v-theme--light text-black v-btn--density-default v-btn--size-large v-btn--variant-text mx-1" aria-describedby="v-tooltip-v-9">
              <span class="v-btn__overlay"></span>
              <span class="v-btn__underlay"></span>
              <span class="v-btn__content" data-no-activator="">
                <i class="mdi-bullseye-arrow mdi v-icon notranslate v-theme--light v-icon--size-default" aria-hidden="true"></i>
              </span>
            </button>
          </div>
        </header>

        <div class="v-card-text">
          <div class="table-responsive">
            <div class="v-table v-theme--light v-table--density-default marco-logico-table">
              <div class="v-table__wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>OBJETIVO PEI</th>
                      <th>INDICADORES PEI</th>
                    </tr>
                  </thead>
                  <tbody></tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <span class="v-card__underlay"></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios'; // o usa fetch

// Datos reactivos para el PEI
const peiData = ref({
  titulo: '',
  descripcion: '',
  fecha_inicio: 'Sin fecha',
  fecha_fin: 'Sin fecha',
  esta_vigente: false,
  modificado_el: 'Sin fecha'
});

// Función para calcular el período
const calcularPeriodo = (inicio, fin) => {
  if (!inicio || !fin) return 'NaN años';
  const diff = new Date(fin) - new Date(inicio);
  const years = diff / (1000 * 60 * 60 * 24 * 365);
  return `${years.toFixed(1)} años`;
};

// Obtener datos de la API
const fetchPeiData = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/estructuracionPei_api/obtenerEstructuracionPEI/'); // Reemplaza con tu endpoint
    peiData.value = {
      ...response.data,
      // Formatea fechas si es necesario
      fecha_inicio: response.data.fecha_inicio || 'Sin fecha',
      fecha_fin: response.data.fecha_fin || 'Sin fecha',
      modificado_el: response.data.modificado_el || 'Sin fecha',

      id: response.data.id,
      titulo: response.data.titulo,
      descripcion: response.data.descripcion,
      fecha_creacion: response.data.fecha_creacion,
    //"fecha_inicio": "2025-07-03",
    //"fecha_fin": "2025-07-03",
      esta_vigente: response.data.esta_vigente,
      creado_el: response.data.creado_el
    //"modificado_el": "2025-07-03T00:00:00Z"
    };
    console.log('Datos del PEI obtenidos:', response.data);
  } catch (error) {
    console.error('Error al obtener datos del PEI:', error);
  }
};

// Ejecutar al montar el componente
onMounted(fetchPeiData);
</script>

<style scoped>
/* Estilos específicos del componente si es necesario */
.title-container {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.project-header {
  padding: 16px;
}

.project-title-container {
  flex: 1;
}

.project-title {
  margin-bottom: 4px;
}

.project-subtitle {
  margin-top: 0;
}

.project-content {
  padding: 16px;
}

.marco-logico-table {
  width: 100%;
}

/* Añade más estilos según sea necesario */
</style>
