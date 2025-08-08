<template>
  <canvas ref="chart"></canvas>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
  data: Object,
})

const chart = ref(null)

onMounted(() => {
  new Chart(chart.value, {
    type: 'doughnut',
    data: {
      labels: props.data.labels,
      datasets: [
        {
          data: props.data.datasets[0].data,
          backgroundColor: props.data.datasets[0].backgroundColor,
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'right' },
        tooltip: {
          callbacks: {
            label: function (context) {
              const label = context.label || ''
              const value = context.raw || 0
              const total = context.dataset.data.reduce((a, b) => a + b, 0)
              const percentage = Math.round((value / total) * 100)
              return `${label}: ${value} (${percentage}%)`
            },
          },
        },
      },
    },
  })
})
</script>
