<template>
  <v-card class="elevation-4 my-6 mx-auto" max-width="90%">
    <v-card-title class="text-h5 text-center"> Rendimiento Anual del Proyecto </v-card-title>
    <v-card-subtitle class="text-center">
      Cantidades por fecha con metas trimestrales
    </v-card-subtitle>
    <v-card-text>
      <div class="chart-container">
        <Line id="project-line-chart" ref="chartRef" :options="chartOptions" :data="chartData" />
      </div>
    </v-card-text>
    <v-card-actions class="d-flex justify-center pa-4">
      <v-btn color="primary" @click="descargarGrafico" class="text-none">
        <v-icon start icon="mdi-download"></v-icon>
        Exportar Gráfico
      </v-btn>
      <v-btn color="secondary" @click="descargarDatosCSV" class="text-none">
        <v-icon start icon="mdi-file-delimited-outline"></v-icon>
        Exportar Datos (CSV)
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  TimeScale,
} from 'chart.js'
import 'chartjs-adapter-date-fns'
import annotationPlugin from 'chartjs-plugin-annotation'

// Registrar los componentes necesarios para Chart.js
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  annotationPlugin,
)

// Referencia para acceder al elemento del gráfico
const chartRef = ref(null)

// Datos de ejemplo para el gráfico
const chartData = ref({
  labels: [
    '2024-01-01',
    '2024-02-01',
    '2024-03-01',
    '2024-04-01',
    '2024-05-01',
    '2024-06-01',
    '2024-07-01',
    '2024-08-01',
    '2024-09-01',
    '2024-10-01',
    '2024-11-01',
    '2024-12-01',
  ],
  datasets: [
    {
      label: 'Rendimiento',
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      borderColor: 'rgb(75, 192, 192)',
      tension: 0,
      data: [15, 25, 20, 35, 40, 50, 45, 60, 55, 65, 75, 80],
    },
  ],
})

// Definir las metas opcionales y la meta final
const metasParciales = [
  { label: 'Meta Q1', date: '2024-03-31' },
  { label: 'Meta Q2', date: '2024-06-30' },
  { label: 'Meta Q3', date: '2024-09-30' },
]

const metaFinal = { label: 'Meta Final', value: 70 }

// Opciones y configuración del gráfico, incluyendo las anotaciones
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      type: 'time',
      time: {
        unit: 'month',
        tooltipFormat: 'dd-MM-yyyy',
      },
      title: {
        display: true,
        text: 'Fechas',
      },
    },
    y: {
      title: {
        display: true,
        text: 'Cantidades',
      },
      beginAtZero: true,
    },
  },
  plugins: {
    annotation: {
      annotations: {
        // Meta final en el eje Y
        finalMetaY: {
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y',
          value: metaFinal.value,
          borderColor: 'rgb(255, 99, 132)',
          borderWidth: 2,
          label: {
            content: metaFinal.label,
            display: true,
            position: 'end',
          },
        },
        // Metas parciales y final en el eje X
        ...metasParciales.reduce((acc, meta, index) => {
          acc[`parcial${index + 1}`] = {
            type: 'line',
            mode: 'vertical',
            scaleID: 'x',
            value: meta.date,
            borderColor: 'rgb(54, 162, 235)',
            borderDash: [5, 5],
            borderWidth: 2,
            label: {
              content: meta.label,
              display: true,
              position: 'start',
            },
          }
          return acc
        }, {}),
        metaFinalX: {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x',
          value: '2024-12-31',
          borderColor: 'rgb(255, 99, 132)',
          borderWidth: 2,
          label: {
            content: 'Meta Final',
            display: true,
            position: 'end',
          },
        },
      },
    },
  },
})

/**
 * Descarga el gráfico como una imagen PNG.
 */
const descargarGrafico = () => {
  if (chartRef.value) {
    const chartInstance = chartRef.value.chart
    const link = document.createElement('a')
    link.download = 'grafico_rendimiento.png'
    link.href = chartInstance.toBase64Image()
    link.click()
  }
}

/**
 * Descarga los datos del gráfico como un archivo CSV.
 */
const descargarDatosCSV = () => {
  if (chartData.value) {
    const labels = chartData.value.labels
    const data = chartData.value.datasets[0].data
    let csvContent = 'data:text/csv;charset=utf-8,Fechas,Cantidades\n'

    labels.forEach((label, index) => {
      csvContent += `${label},${data[index]}\n`
    })

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'datos_rendimiento.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
</script>

<style scoped>
.chart-container {
  /* Contenedor flexible para el gráfico */
  max-width: 900px;
  height: 500px;
  margin: auto;
}
</style>
