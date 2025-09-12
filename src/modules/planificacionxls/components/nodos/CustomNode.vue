<template>
  <div class="custom-node">
    <Handle type="target" :position="Position.Top" class="handle-custom handle-top" />

    <div class="node-header">
      <h4 class="node-status">{{ data.estado ? `Estado: ${data.estado}` : 'Sin Estado' }}</h4>
    </div>
    <div class="node-body">
      <p class="node-label">{{ data.label || 'Etiqueta no definida' }}</p>
      <small class="node-description">{{ data.descripcion || 'Sin descripción' }}</small>
    </div>

    <div class="node-meta">
      <p>
        Tipo:
        <span class="meta-value">{{ type ? capitalizeFirstLetter(type) : 'Desconocido' }}</span>
      </p>
      <p>
        ID: <span class="meta-value">{{ id || 'N/A' }}</span>
      </p>
    </div>

    <Handle type="source" :position="Position.Bottom" class="handle-custom handle-bottom" />
  </div>
</template>

<script setup>
import { Position, Handle } from '@vue-flow/core'

// Vue Flow inyecta 'data', 'type' e 'id' como props
// eslint-disable-next-line no-unused-vars
const props = defineProps({
  data: Object,
  type: String, // Asegúrate de declarar `type`
  id: String, // Asegúrate de declarar `id`
})

// Función auxiliar para capitalizar la primera letra del tipo
const capitalizeFirstLetter = (string) => {
  if (!string) return ''
  return string.charAt(0).toUpperCase() + string.slice(1)
}
</script>

<style scoped>
/* Estilos generales del nodo */
.custom-node {
  /* Contorno y dimensiones */
  width: 280px; /* Ancho ajustable */
  min-height: 120px; /* Altura mínima */
  border: 2px solid #333; /* <-- AQUI ESTÁ EL CONTORNO PRINCIPAL */
  border-radius: 8px; /* Bordes ligeramente redondeados */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* Sombra para profundidad */
  background-color: #ffffff; /* Fondo blanco */

  /* Layout y contenido */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; /* Fuente más legible */
  color: #333;
}

/* Header del nodo */
.node-header {
  background-color: #e0f2f7; /* Color de fondo para el encabezado */
  padding: 8px 12px;
  border-bottom: 1px solid #c0e0e7;
  border-radius: 6px 6px 0 0; /* Bordes redondeados solo arriba */
  text-align: left;
}

.node-status {
  margin: 0;
  font-size: 0.85em;
  color: #007bff; /* Color para el estado */
  font-weight: 600;
}

/* Cuerpo del nodo */
.node-body {
  flex-grow: 1;
  padding: 10px 12px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px; /* Espacio entre label y description */
}

.node-label {
  margin: 0;
  font-size: 1.1em;
  font-weight: bold;
  color: #2c3e50;
}

.node-description {
  margin: 0;
  font-size: 0.8em;
  color: #666;
  font-style: italic;
}

/* Sección de meta información (tipo e ID) */
.node-meta {
  background-color: #f8f8f8;
  padding: 5px 12px;
  border-top: 1px solid #eee;
  border-radius: 0 0 6px 6px; /* Bordes redondeados solo abajo */
  font-size: 0.75em;
  color: #777;
  text-align: right; /* Alinea la meta-información a la derecha */
}

.node-meta p {
  margin: 2px 0;
}

.meta-value {
  font-weight: bold;
  color: #555;
}

/* Estilos de los handles */
.handle-custom {
  background: #333; /* Color oscuro para los handles */
  border: 2px solid #fff; /* Borde blanco para que resalten */
  width: 14px; /* Un poco más grandes */
  height: 14px;
  border-radius: 50%;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3); /* Pequeña sombra alrededor del handle */
}

.handle-top {
  top: -7px; /* Ajuste para que sobresalga */
  left: 50%;
  transform: translateX(-50%);
}

.handle-bottom {
  bottom: -7px; /* Ajuste para que sobresalga */
  left: 50%;
  transform: translateX(-50%);
}
</style>
