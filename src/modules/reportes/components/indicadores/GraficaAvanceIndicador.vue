<template>
  <div style="height: 300px">
    <canvas ref="graficaCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const props = defineProps({
  indicadorId: {
    type: [Number, String],
    required: true,
  },
  tipo: {
    type: String,
    required: true,
  },
  baseline: {
    type: [String, Number],
    default: null,
  },
})

const graficaCanvas = ref(null)
let chartInstance = null

// Datos dummy para la gráfica
const datosGrafica = {
  labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May'],
  valores: [25, 45, 65, 80, 95],
}

const crearGrafica = () => {
  if (chartInstance) {
    chartInstance.destroy()
  }

  const ctx = graficaCanvas.value.getContext('2d')

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: datosGrafica.labels,
      datasets: [
        {
          label: 'Evolución del Indicador',
          data: datosGrafica.valores,
          borderColor: '#1976D2',
          backgroundColor: 'rgba(25, 118, 210, 0.1)',
          tension: 0.3,
          fill: true,
          pointBackgroundColor: '#1976D2',
          pointBorderColor: '#fff',
          pointRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: props.tipo === '%' ? 'Porcentaje (%)' : 'Valor',
          },
        },
      },
    },
  })
}

onMounted(() => {
  crearGrafica()
})

watch(() => props.indicadorId, crearGrafica)
</script>
