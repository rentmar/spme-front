<script>
import axios from 'axios'

export default {
  data() {
    return {
      cantidad: 12,
      ancho: 115,
      anchoColumnaActividad: 250,
      altolbl: 30,
      alto: 60,
      altoActividad: 40,
      espacio: 2,
      colorlbl: '#757575',
      color: '#bdbdbd',
      xInicial: 10,
      y: 10,
      dialog: false,
      selectedActividad: null,
      filtroEstado: null,
      itemsPerPage: 10,
      currentPage: 1,
      mostrarHoy: true,
      fechaHoy: new Date().toISOString().split('T')[0],
      meses: [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre',
      ],
      estados: [],
      actividades: [],
    }
  },
  computed: {
    viewBox() {
      const width =
        this.xInicial + this.anchoColumnaActividad + (this.ancho + this.espacio) * this.cantidad
      const height = this.y + this.altolbl + this.itemsPerPage * (this.alto + 10) + 5
      return `0 0 ${width} ${height}`
    },

    alturaTotalActividades() {
      return this.actividadesPaginadas.length * (this.alto + 10) + 5
    },

    estadosParaFiltro() {
      const estados = this.estados.map((estado) => ({
        text: estado.nombre,
        value: estado.id,
      }))
      return estados
    },

    actividadesFiltradas() {
      if (!this.filtroEstado) {
        return this.actividades
      }
      return this.actividades.filter((act) => act.estado === this.filtroEstado)
    },

    actividadesPaginadas() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage
      const endIndex = startIndex + this.itemsPerPage
      return this.actividadesFiltradas.slice(startIndex, endIndex)
    },

    totalPaginas() {
      return Math.ceil(this.actividadesFiltradas.length / this.itemsPerPage)
    },
  },
  watch: {
    filtroEstado() {
      this.currentPage = 1
    },
    itemsPerPage() {
      this.currentPage = 1
    },
  },
  mounted() {
    if (this.actividades.length > 0 && !this.selectedActividad) {
      this.selectedActividad = this.actividades[0]
    }

    this.ajustarAlturaSVG()
    window.addEventListener('resize', this.ajustarAlturaSVG)
    this.obtenerActividades()
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.ajustarAlturaSVG)
  },
  methods: {
    async obtenerActividades() {
      this.loading = true
      this.error = null

      try {
        // const token = this.userStore.token;
        const response = await axios.post(
          'http://127.0.0.1:8000/actividades_api/obtenerActividadesGantt/',
          {
            user_id: 4,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              //'Authorization': `Bearer ${token}`
            },
          },
        )

        this.datos = response.data
        this.estados = this.datos.estados
        this.actividades = this.datos.actividades
      } catch (error) {
        this.error = error.response?.data?.message || error.message
      } finally {
        this.loading = false
      }
    },
    obtenerColorEstado(idEstado) {
      const estado = this.estados.find((e) => e.id === idEstado)
      return estado ? estado.color : '#bdbdbd'
    },

    obtenerNombreEstado(idEstado) {
      const estado = this.estados.find((e) => e.id === idEstado)
      return estado ? estado.nombre : 'Desconocido'
    },

    posicionEnEscalaGrafica(fecha) {
      const date = new Date(fecha + 'T00:00:00')
      const year = date.getFullYear()
      const month = date.getMonth()
      const day = date.getDate()

      const monthWidth = this.ancho + this.espacio
      const daysInMonth = new Date(year, month + 1, 0).getDate()

      const dayPosition = (day / daysInMonth) * monthWidth

      return this.xInicial + this.anchoColumnaActividad + month * monthWidth + dayPosition - 5
    },

    calcularAnchoBarra(fecha_iniciocio, fecha_cierre) {
      const start = new Date(fecha_iniciocio + 'T00:00:00')
      const end = new Date(fecha_cierre + 'T00:00:00')

      const diffTime = Math.abs(end - start)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

      const monthWidth = this.ancho + this.espacio
      const daysInStartMonth = new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate()

      if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
        return (diffDays / daysInStartMonth) * monthWidth
      }

      let totalWidth = 0
      let current = new Date(start)

      while (current <= end) {
        const daysInCurrentMonth = new Date(
          current.getFullYear(),
          current.getMonth() + 1,
          0,
        ).getDate()

        if (
          current.getMonth() === start.getMonth() &&
          current.getFullYear() === start.getFullYear()
        ) {
          const daysRemaining = daysInCurrentMonth - current.getDate() + 1
          totalWidth += (daysRemaining / daysInCurrentMonth) * monthWidth
        } else if (
          current.getMonth() === end.getMonth() &&
          current.getFullYear() === end.getFullYear()
        ) {
          const daysPassed = end.getDate()
          totalWidth += (daysPassed / daysInCurrentMonth) * monthWidth
        } else {
          totalWidth += monthWidth
        }

        current = new Date(current.getFullYear(), current.getMonth() + 1, 1)
      }

      return totalWidth
    },

    showActividadDetails(actividad) {
      this.selectedActividad = actividad
    },

    formatFecha(fecha) {
      const opciones = { year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(fecha).toLocaleDateString('es-ES', opciones)
    },

    ajustarAlturaSVG() {
      const svgElement = document.getElementById('fondo')
      if (svgElement) {
        const alturaVentana = window.innerHeight
        svgElement.style.height = `${alturaVentana * 0.6}px`
      }
    },
    splitTextIntoLines(text, maxLength) {
      const words = text.split(' ')
      const lines = []
      let currentLine = ''

      words.forEach((word) => {
        if (currentLine.length + word.length + 1 > maxLength) {
          lines.push(currentLine.trim())
          currentLine = word + ' '
        } else {
          currentLine += word + ' '
        }
      })
      lines.push(currentLine.trim())
      return lines
    },
  },
}
</script>
<!---->
<template>
  <v-container>
    <v-toolbar color="primary" dark>
      <v-toolbar-title> Diagrama de Gantt de Actividades </v-toolbar-title>
    </v-toolbar>

    <v-row class="mt-4 align-center">
      <v-col cols="12" sm="8" md="9">
        <div class="legend-container">
          <div class="legend-item" v-for="estado in estados" :key="estado.id">
            <div class="legend-color" :style="{ backgroundColor: estado.color }"></div>
            <span>{{ estado.nombre }}</span>
          </div>
        </div>
      </v-col>
      <v-col cols="12" sm="4" md="3">
        <v-select
          label="Filtrar por Estado"
          :items="estadosParaFiltro"
          v-model="filtroEstado"
          :item-title="(item) => item.text"
          :item-value="(item) => item.value"
          clearable
        ></v-select>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12" md="3">
        <v-card class="pa-4" v-if="selectedActividad">
          <v-card-title class="pa-0 bg-primary lblpadding">Detalles de Actividad</v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-0 pt-2">
            <p><strong>codigo:</strong> {{ selectedActividad.codigo }}</p>
            <p>
              <strong>Fecha Programada:</strong>
              {{ formatFecha(selectedActividad.fecha_programada) }}
            </p>
            <p><strong>Inicio:</strong> {{ formatFecha(selectedActividad.fecha_inicio) }}</p>
            <p><strong>Fin:</strong> {{ formatFecha(selectedActividad.fecha_cierre) }}</p>
            <p><strong>Estado:</strong> {{ obtenerNombreEstado(selectedActividad.estado) }}</p>
            <p><strong>Tipo:</strong> {{ selectedActividad.tipo }}</p>
            <p><strong>Grado de Ejecución:</strong> {{ selectedActividad.grado_ejecucion }}</p>
            <p><strong>Descripción:</strong> {{ selectedActividad.descripcion }}</p>
          </v-card-text>
        </v-card>
        <v-card v-else class="pa-4">
          <v-card-text>Seleccione una actividad para ver los detalles</v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="9">
        <svg id="fondo" :viewBox="viewBox">
          <!-- Cabecera con meses -->
          <g v-for="(mes, i) in meses" :key="i">
            <rect
              :x="xInicial + anchoColumnaActividad + i * (ancho + espacio)"
              :y="y"
              :width="ancho"
              :height="altolbl"
              :stroke="colorlbl"
              :fill="colorlbl"
            ></rect>
            <text
              :x="xInicial + anchoColumnaActividad + i * (ancho + espacio) + ancho / 2"
              :y="y + altolbl / 2 + 2"
              text-anchor="middle"
              fill="white"
              font-size="12"
              font-family="Arial"
              alignment-baseline="middle"
            >
              {{ mes }}
            </text>
          </g>

          <!-- Columna de actividad a la izquierda -->
          <rect
            :x="xInicial"
            :y="y"
            :width="anchoColumnaActividad"
            :height="altolbl"
            class="header-actividad"
          />
          <text
            :x="xInicial + anchoColumnaActividad / 2"
            :y="y + altolbl / 2 + 2"
            text-anchor="middle"
            fill="white"
            font-size="12"
            font-weight="bold"
            font-family="Arial"
            alignment-baseline="middle"
          >
            ACTIVIDADES
          </text>

          <!-- Fondo de la columna de actividad -->
          <rect
            :x="xInicial"
            :y="y + altolbl"
            :width="anchoColumnaActividad"
            :height="alturaTotalActividades"
            class="columna-actividad"
          />

          <!-- Líneas de grid para mejor visualización -->
          <line
            v-for="i in cantidad + 1"
            :key="'grid-' + i"
            :x1="xInicial + anchoColumnaActividad + (i - 1) * (ancho + espacio)"
            :y1="y + altolbl"
            :x2="xInicial + anchoColumnaActividad + (i - 1) * (ancho + espacio)"
            :y2="y + altolbl + alturaTotalActividades"
            class="grid-line"
          />

          <!-- Actividades -->
          <g v-for="(actividad, fila) in actividadesPaginadas" :key="actividad.codigo + '-' + fila">
            <!-- Fondo de la fila -->
            <rect
              v-for="i in cantidad"
              :key="actividad.codigo + '-' + i"
              :x="xInicial + anchoColumnaActividad + (i - 1) * (ancho + espacio)"
              :y="y + altolbl + fila * (alto + 10) + 5"
              :width="ancho"
              :height="alto"
              :stroke="color"
              :fill="fila % 2 === 0 ? color : '#d5d5d5'"
            />

            <!-- Celda de actividad en la columna izquierda -->
            <rect
              :x="xInicial"
              :y="y + altolbl + fila * (alto + 10) + 5"
              :width="anchoColumnaActividad"
              :height="alto"
              :class="fila % 2 === 0 ? 'fila-actividad-par' : 'fila-actividad-impar'"
            />

            <text
              :x="xInicial + anchoColumnaActividad / 2"
              :y="y + altolbl + fila * (alto + 10) + alto / 2 + 5"
              text-anchor="middle"
              fill="white"
              font-size="12"
              font-family="Arial"
              alignment-baseline="middle"
              dominant-baseline="middle"
              class="actividad-texto"
            >
              <tspan
                v-for="(line, lineIndex) in splitTextIntoLines(actividad.nombre_corto, 50)"
                :key="lineIndex"
                :x="xInicial + anchoColumnaActividad / 2"
                :dy="lineIndex === 0 ? '-0.5em' : '1.2em'"
              >
                {{ line }}
              </tspan>
            </text>

            <!-- Barra de la actividad -->
            <rect
              @click="showActividadDetails(actividad)"
              :x="posicionEnEscalaGrafica(actividad.fecha_inicio)"
              :y="y + altolbl + fila * (alto + 10) + 5 + 10"
              :width="calcularAnchoBarra(actividad.fecha_inicio, actividad.fecha_cierre)"
              :height="altoActividad"
              :fill="obtenerColorEstado(actividad.estado)"
              :stroke="obtenerColorEstado(actividad.estado)"
              opacity="0.8"
              class="activity-bar"
              rx="3"
            />

            <!-- Tooltip para la barra -->
            <title>
              {{ actividad.nombre_corto }} ({{ formatFecha(actividad.fecha_inicio) }} -
              {{ formatFecha(actividad.fecha_cierre) }})
            </title>
          </g>

          <!-- Línea para el día actual -->
          <line
            v-if="mostrarHoy"
            :x1="posicionEnEscalaGrafica(fechaHoy)"
            :y1="y + altolbl"
            :x2="posicionEnEscalaGrafica(fechaHoy)"
            :y2="y + altolbl + alturaTotalActividades"
            class="today-line"
          />
        </svg>
      </v-col>
    </v-row>

    <v-row class="mt-4 justify-center align-center">
      <v-btn
        @click="currentPage--"
        :disabled="currentPage === 1"
        class="mr-2"
        color="primary"
        small
      >
        <v-icon small>mdi-chevron-left</v-icon>
        Anterior
      </v-btn>
      <span class="mx-2">Página {{ currentPage }} de {{ totalPaginas }}</span>
      <v-btn
        @click="currentPage++"
        :disabled="currentPage === totalPaginas || totalPaginas === 0"
        class="ml-2"
        color="primary"
        small
      >
        Siguiente
        <v-icon small>mdi-chevron-right</v-icon>
      </v-btn>

      <v-select
        v-model="itemsPerPage"
        :items="[5, 10, 15, 20]"
        label="Items por página"
        class="ml-4"
        style="max-width: 150px"
        dense
        outlined
      ></v-select>
    </v-row>
  </v-container>
</template>
<style>
#fondo {
  background-color: #e0e0e0;
  width: 100%;
  height: 60vh;
  min-height: 400px;
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
  flex-wrap: wrap;
  gap: 12px;
  padding: 12px;
  background-color: #f9f9f9;
  border-bottom: 1px solid #e0e0e0;
}
.legend-item {
  display: flex;
  align-items: center;
  margin: 0;
}
.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  margin-right: 8px;
}
.activity-bar {
  cursor: pointer;
  transition: all 0.2s ease;
}
.activity-bar:hover {
  opacity: 1 !important;
  filter: brightness(1.1);
  stroke-width: 2;
}
.grid-line {
  stroke: #e0e0e0;
  stroke-width: 1;
}
.today-line {
  stroke: #ff5252;
  stroke-width: 2;
  stroke-dasharray: 5, 5;
}
@media (max-width: 960px) {
  #fondo {
    height: 50vh;
    min-height: 300px;
  }
  .legend-container {
    justify-content: flex-start;
  }
}
.axis-label {
  font-size: 12px;
  fill: #555;
  font-weight: 500;
}
.actividad-texto {
  font-size: 12px;
  fill: white;
  font-weight: 500;
  text-anchor: middle;
  alignment-baseline: middle;
}
.columna-actividad {
  fill: #616161;
  stroke: #424242;
}
.header-actividad {
  fill: #424242;
  stroke: #424242;
}
.fila-actividad-par {
  fill: #616161;
  stroke: #616161;
}
.fila-actividad-impar {
  fill: #757575;
  stroke: #757575;
}
.lblpadding {
  text-align: center;
}
</style>
