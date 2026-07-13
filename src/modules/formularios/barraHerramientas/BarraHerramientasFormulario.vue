<template>
  <div
    class="barra-flotante-wrapper"
    :class="{ expandida: expandida && visible }"
    @mouseenter="expandida = true"
    @mouseleave="expandida = false"
    v-if="visible"
  >
    <div class="barra-container">
      <!-- Botón para expandir/colapsar -->
      <button class="btn-toggle" @click="toggleVisible" title="Expandir/Colapsar">
        <v-icon size="16" color="grey-darken-1">
          {{ expandida ? 'mdi-chevron-right' : 'mdi-chevron-left' }}
        </v-icon>
      </button>

      <!-- Indicador de estado -->
      <div class="estado-indicador" title="Nueva Solicitud">
        <div class="estado-punto" style="background: #9e9e9e"></div>
        <transition name="fade">
          <span v-if="expandida" class="estado-texto">Nueva Solicitud</span>
        </transition>
      </div>

      <!-- BOTONES DE ACCIÓN -->
      <div class="acciones">
        <!-- Guardar borrador -->
        <button class="btn-icon" title="Guardar formulario sin enviar" @click="guardarBorrador">
          <v-icon size="18" color="primary">mdi-content-save</v-icon>
          <transition name="slide">
            <span v-if="expandida" class="btn-label">Guardar</span>
          </transition>
        </button>

        <!-- Enviar a revisión -->
        <button class="btn-icon" title="Guardar y enviar a revisión" @click="enviarRevision">
          <v-icon size="18" color="warning">mdi-send</v-icon>
          <transition name="slide">
            <span v-if="expandida" class="btn-label">Enviar</span>
          </transition>
        </button>

        <!-- Repositorio Strapi 5 -->
        <!-- <button
          class="btn-icon"
          title="Gestionar archivos en repositorio"
          @click="abrirRepositorio"
        >
          <v-icon size="18" color="deep-purple">mdi-package-variant</v-icon>
          <transition name="slide">
            <span v-if="expandida" class="btn-label">Repositorio</span>
          </transition>
        </button> -->

        <!-- Limpiar formulario -->
        <!-- <button
          class="btn-icon btn-limpiar"
          title="Limpiar todos los campos del formulario"
          @click="limpiarFormulario"
        >
          <v-icon size="18" color="teal">mdi-broom</v-icon>
          <transition name="slide">
            <span v-if="expandida" class="btn-label limpiar-label">Limpiar</span>
          </transition>
        </button> -->
      </div>

      <!-- SEPARADOR -->
      <div class="separador"></div>

      <!-- BOTÓN CANCELAR -->
      <button class="btn-cancelar" title="Cancelar y volver" @click="cancelarFormulario">
        <v-icon size="18" color="error">mdi-cancel</v-icon>
        <transition name="slide">
          <span v-if="expandida" class="btn-label cancelar-label">Cancelar</span>
        </transition>
      </button>

      <!-- Botón para ocultar completamente -->
      <button class="btn-toggle btn-close" @click="ocultarBarra" title="Cerrar barra">
        <v-icon size="16" color="grey-darken-1">mdi-close</v-icon>
      </button>
    </div>
  </div>

  <!-- Botón para mostrar la barra cuando está oculta -->
  <button
    v-if="!visible"
    class="btn-show-bar"
    @click="mostrarBarra"
    title="Mostrar barra de herramientas"
  >
    <v-icon size="20" color="white">mdi-tools</v-icon>
  </button>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits([
  'save-draft',
  'submit-review',
  'open-repository',
  'limpiar-form',
  'cancel',
])

const expandida = ref(false)
const visible = ref(true)

// Funciones que emiten eventos al padre

/**
 * Guarda el formulario como borrador sin asignar validadores ni enviar notificaciones
 */
const guardarBorrador = () => {
  emit('save-draft')
}

/**
 * Abre el diálogo para seleccionar revisores y luego guarda y notifica
 */
const enviarRevision = () => {
  emit('submit-review')
}

/**
 * Abre el diálogo del repositorio Strapi 5 para gestionar archivos adjuntos
 */
const abrirRepositorio = () => {
  emit('open-repository')
}

/**
 * Limpiar todos los campos del formulario
 */
const limpiarFormulario = () => {
  emit('limpiar-form')
}

/**
 * Cancela la creación del formulario y redirige a la lista de actividades
 */
const cancelarFormulario = () => {
  emit('cancel')
}

// Funciones internas de la barra

/**
 * Alterna entre vista expandida y colapsada de la barra
 */
const toggleVisible = () => {
  expandida.value = !expandida.value
}

/**
 * Oculta completamente la barra de herramientas
 */
const ocultarBarra = () => {
  visible.value = false
}

/**
 * Muestra la barra de herramientas cuando está oculta
 */
const mostrarBarra = () => {
  visible.value = true
}
</script>

<style scoped>
/* BARRA PRINCIPAL */
.barra-flotante-wrapper {
  position: fixed;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 9999;
  background: #ffffff;
  border: 3px solid #64748b;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.12),
    0 2px 8px rgba(0, 0, 0, 0.08),
    0 0 0 4px rgba(100, 116, 139, 0.1);
  border-radius: 20px;
  padding: 10px 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 52px;
  backdrop-filter: blur(8px);
}

.barra-flotante-wrapper:hover {
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.15),
    0 4px 12px rgba(0, 0, 0, 0.1),
    0 0 0 6px rgba(59, 130, 246, 0.15);
  border-color: #3b82f6;
  border-radius: 24px;
  padding: 14px 12px;
}

.barra-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

/* BOTÓN TOGGLE (expandir/colapsar) */
.btn-toggle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  opacity: 0;
  color: #64748b;
}

.barra-flotante-wrapper:hover .btn-toggle {
  opacity: 1;
}

.btn-toggle:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.btn-close {
  margin-top: 2px;
}

.btn-close:hover {
  background: #fef2f2;
  border-color: #fecaca;
  color: #ef4444;
}

/* INDICADOR DE ESTADO */
.estado-indicador {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  justify-content: center;
  cursor: default;
}

.estado-punto {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid #ffffff;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  background: #94a3b8;
}

.estado-texto {
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* BOTONES DE ACCIÓN */
.acciones {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.btn-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: none;
  background: #f8fafc;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  white-space: nowrap;
  padding: 0;
}

.barra-flotante-wrapper:hover .btn-icon {
  width: 140px;
  justify-content: flex-start;
  padding: 0 14px;
  border-radius: 12px;
}

.btn-icon:hover {
  background: #f1f5f9;
  transform: translateX(-2px);
}

.btn-icon:active {
  transform: scale(0.95) translateX(-2px);
}

.btn-label {
  font-size: 13px;
  font-weight: 500;
  color: #334155;
}

/* Colores específicos por botón */
.btn-icon:nth-child(1):hover {
  background: #eff6ff;
}

.btn-icon:nth-child(2):hover {
  background: #fffbeb;
}

.btn-icon:nth-child(3):hover {
  background: #f5f3ff;
}

/* Botón Limpiar */
.btn-limpiar:hover {
  background: #e6faf5;
}

.limpiar-label {
  color: #0d9488;
}

/* SEPARADOR */
.separador {
  width: 24px;
  height: 1px;
  background: #e2e8f0;
  margin: 4px 0;
}

/* BOTÓN CANCELAR */
.btn-cancelar {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid #fecaca;
  background: #fef2f2;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  white-space: nowrap;
  padding: 0;
}

.barra-flotante-wrapper:hover .btn-cancelar {
  width: 140px;
  justify-content: flex-start;
  padding: 0 14px;
  border-radius: 12px;
}

.btn-cancelar:hover {
  background: #fee2e2;
  border-color: #fca5a5;
  transform: translateX(-2px);
}

.cancelar-label {
  color: #dc2626;
  font-weight: 600;
}

/* BOTÓN PARA MOSTRAR BARRA OCULTA */
.btn-show-bar {
  position: fixed;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 9998;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-show-bar:hover {
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 12px 32px rgba(37, 99, 235, 0.4);
}

.btn-show-bar:active {
  transform: translateY(-50%) scale(0.95);
}

/* TRANSICIONES */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(10px);
}
</style>
