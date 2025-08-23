<script>
export default {
  data() {
    return {
      cantidad: 13,
      ancho: 115,
      altolbl: 30,
      alto:60,
      espacio: 2,
      colorlbl: "#757575",
      color: "#bdbdbd",
      xInicial: 10,
      y: 10,
      dialog: false,
      selectedActividad: null,
      filteredState: null,
      meses: [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
      ],
      colores :{
        "Planificacion": "#64b5f6",
        "Retraso": "#ff0000",
        "Reprogramacion": "#ffd54f",
        "En_Ejecucion": "#ffa726",
        "En_Reporte": "#81c784",
        "Finalizado": "#4db6ac"
      },
      actividades: [
        {
          codigo: 1234,
          fechaini: "2025-01-15",
          fechafin: "2025-04-15",
          descripcion: "Actividad A",
          estado: "Planificacion"
        },
        {
          codigo: 1235,
          fechaini: "2025-10-20",
          fechafin: "2025-12-25",
          descripcion: "elaboracion B",
          estado: "En_Reporte"
        },
        {
          codigo: 1235,
          fechaini: "2025-02-12",
          fechafin: "2025-05-05",
          descripcion: "elaboracion B",
          estado: "Retraso"
        },
        {
          codigo: 1236,
          fechaini: "2025-04-10",
          fechafin: "2025-05-30",
          descripcion: "elaboracion C",
          estado: "En_Ejecucion"
        },
        {
          codigo: 1226,
          fechaini: "2025-05-01",
          fechafin: "2025-05-31",
          descripcion: "elaboracion C",
          estado: "Reprogramacion"
        },
        {
          codigo: 111226,
          fechaini: "2025-06-05",
          fechafin: "2025-10-30",
          descripcion: "elaboracion D",
          estado: "Finalizado"
        },
         {
          codigo: 13431226,
          fechaini: "2025-02-01",
          fechafin: "2025-07-31",
          descripcion: "elaboracion D",
          estado: "En_Ejecucion"
        },
        {
          codigo: 1236,
          fechaini: "2025-04-10",
          fechafin: "2025-05-30",
          descripcion: "elaboracion C",
          estado: "Retraso"
        },
        {
          codigo: 1226,
          fechaini: "2025-05-01",
          fechafin: "2025-05-31",
          descripcion: "elaboracion C",
          estado: "Reprogramacion"
        },
        {
          codigo: 13431226,
          fechaini: "2025-02-01",
          fechafin: "2025-07-31",
          descripcion: "elaboracion D",
          estado: "Planificacion"
        }
      ]
    };
  },
  methods: {
    posicionEnEscalaGrafica(fecha) {
      const date = new Date(fecha + 'T00:00:00');
      const a = date.getUTCFullYear();
      const m = date.getUTCMonth() + 1;
      const d = date.getUTCDate();
      const diasEnMes = new Date(a, m, 0).getUTCDate();
      const mesesCompletos = m - 1;
      const valorMesesCompletos = mesesCompletos * 116;
      const valorDiasMesActual = (d * 116) / diasEnMes;
      const posicion = valorMesesCompletos + valorDiasMesActual + (m - 1);
      return Math.round(posicion);
    },
    showActividadDetails(actividad) {
      this.selectedActividad = actividad;
      this.dialog = true;
    },
    formatFecha(fecha) {
      const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(fecha).toLocaleDateString('es-ES', opciones);
    }
  },
};
</script>
<!---->
<template>
  <v-container>
    <v-toolbar color="primary" dark>
      <v-toolbar-title>
        Diagrama de Gant de las Actividades
      </v-toolbar-title>
    </v-toolbar>

    <div class="legend-container">
      <div class="legend-item">
          <div class="legend-color" style="background-color: #64b5f6;"></div>
          <span>Planificación</span>
      </div>
       <div class="legend-item">
          <div class="legend-color" style="background-color: #ffa726;"></div>
          <span>En Ejecucion</span>
      </div>
      <div class="legend-item">
          <div class="legend-color" style="background-color: #81c784;"></div>
          <span>En Reporte</span>
      </div>
      <div class="legend-item">
          <div class="legend-color" style="background-color: #4db6ac;"></div>
          <span>Finalizado</span>
      </div>
      <div class="legend-item">
          <div class="legend-color" style="background-color: #ff0000;"></div>
          <span>Retrasado</span>
      </div>
      <div class="legend-item">
          <div class="legend-color" style="background-color: #ffd54f;"></div>
          <span>Reprogramacion</span>
      </div>
  </div>

    <v-row class="mt-4">
      <v-col cols="12" md="3">
        <v-card class="pa-4" v-if="selectedActividad">
          <v-card-title class="pa-0">Detalles de Actividad</v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-0 pt-2">
            <p><strong>Inicio:</strong> {{ selectedActividad.fechaini }}</p>
            <p><strong>Fin:</strong> {{ selectedActividad.fechafin }}</p>
            <p><strong>Estado:</strong> {{ selectedActividad.estado }}</p>
            <p><strong>Descripción:</strong> {{ selectedActividad.descripcion }}</p>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="9">
        <svg id="fondo" :viewBox="`0 0 ${xInicial + (ancho + espacio) * cantidad} ${y + altolbl + 12 * alto}`">
          <g v-for="i in cantidad" :key="i">
            <rect :x="xInicial + (i - 1) * (ancho + espacio)"
              :y="y"
              :width="ancho"
              :height="altolbl"
              :stroke="colorlbl"
              :fill="colorlbl"></rect>
            <text :x="xInicial + (i - 1) * (ancho + espacio) + ancho / 2"
                :y="y + altolbl / 2 + 2"
                text-anchor="middle"
                fill="white"
                font-size="12"
                font-family="Arial"
                alignment-baseline="middle">
                  {{ meses[i - 2] }}
            </text>
          </g>
          <g v-for="(actividad, fila) in actividades" :key="actividad.codigo">
              <rect
                v-for="i in cantidad"
                :key="actividad.codigo + '-' + i"
                :x="xInicial + (i - 1) * (ancho + espacio)"
                :y="y + altolbl + fila * (alto + 10) + 5"
                :width="ancho"
                :height="alto"
                :stroke="color"
                :fill="color"
              />
            <text
                :x="15"
                :y="y + altolbl + fila * (alto + 10) + alto / 2 + 5"
                text-anchor="start"
                fill="#333"
                font-size="13"
                font-family="Arial"
                alignment-baseline="middle"
                dominant-baseline="middle"
              >
                {{ actividad.descripcion }}
              </text>
            <rect
                @click="showActividadDetails(actividad)"
                  :x="127 + posicionEnEscalaGrafica(actividad.fechaini)"
                  :y="y + altolbl + fila * (alto + 10) + 5 "
                  :width="posicionEnEscalaGrafica(actividad.fechafin) - posicionEnEscalaGrafica(actividad.fechaini)"
                  :height="alto"
                  :fill="colores[actividad.estado]"
                  :stroke="colores[actividad.estado]"
                  opacity="0.5"
                />
            </g>
        </svg>
      </v-col>
    </v-row>
  </v-container>
</template>

<style>
#fondo {
  background-color: #e0e0e0;
  width: 100%;
  height: auto;
}
body {
    font-family: 'Roboto', sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f5f5f5;
}
.container {
    max-width: 1200px;
    margin: 0 auto;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}
.gantt-header {
    background: linear-gradient(135deg, #1976d2 0%, #0d47a1 100%);
    color: white;
    padding: 16px 24px;
}
.legend-container {
    display: flex;
    justify-content: center;
    padding: 16px;
    background-color: #f9f9f9;
    border-bottom: 1px solid #e0e0e0;
}
.legend-item {
    display: flex;
    align-items: center;
    margin: 0 16px;
}
.legend-color {
    width: 20px;
    height: 20px;
    border-radius: 4px;
    margin-right: 8px;
}
.gantt-container {
    padding: 20px;
    overflow-x: auto;
}
.activity-bar {
    cursor: pointer;
    transition: opacity 0.2s, filter 0.2s;
}
.activity-bar:hover {
    opacity: 0.9;
    filter: brightness(1.1);
}
.axis-label {
    font-size: 12px;
    fill: #555;
    font-weight: 500;
}
.grid-line {
    stroke: #e0e0e0;
    stroke-width: 1;
}
.today-line {
    stroke: #ff5252;
    stroke-width: 2;
    stroke-dasharray: 5,5;
}
</style>
