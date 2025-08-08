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
    type: 'line',
    data: {
      labels: props.data.labels,
      datasets: props.data.datasets.map((dataset) => ({
        label: dataset.label,
        data: dataset.data,
        borderColor: dataset.color,
        backgroundColor: `${dataset.color}20`,
        borderWidth: 2,
        tension: 0.3,
        fill: true,
      })),
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
      },
      scales: {
        y: { beginAtZero: true },
      },
    },
  })
})
</script>
