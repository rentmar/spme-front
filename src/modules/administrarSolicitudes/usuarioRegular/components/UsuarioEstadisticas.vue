<template>
  <v-row class="ma-0 pa-4 header-bg">
    <v-col cols="12" class="pa-0">
      <div class="d-flex align-center justify-space-between flex-wrap gap-4">
        <pagina-titulo-icono
          titulo="Mis Solicitudes"
          subtitulo="Gestiona tus solicitudes y revisiones pendientes"
          icon="mdi-file-document-multiple"
        />

        <div class="d-flex align-center stats-summary">
          <!-- Total - Azul -->
          <div class="text-center px-3">
            <div class="text-body-1 font-weight-bold text-blue-darken-2">{{ total }}</div>
            <div class="text-caption text-grey">Total</div>
          </div>
          <v-divider vertical />

          <!-- Pendientes - Naranja/Ámbar -->
          <div class="text-center px-3">
            <div class="text-body-1 font-weight-bold text-amber-darken-2">{{ pendientes }}</div>
            <div class="text-caption text-grey">Pendientes</div>
          </div>
          <v-divider vertical />

          <!-- Aprobadas - Verde -->
          <div class="text-center px-3">
            <div class="text-body-1 font-weight-bold text-green-darken-2">{{ aprobadas }}</div>
            <div class="text-caption text-grey">Aprobadas</div>
          </div>
          <v-divider vertical />

          <!-- Rechazadas - Rojo -->
          <div class="text-center px-3">
            <div class="text-body-1 font-weight-bold text-red-darken-2">{{ rechazadas }}</div>
            <div class="text-caption text-grey">Rechazadas</div>
          </div>
          <v-divider vertical />

          <!-- Sin Revisor - Gris -->
          <div class="text-center px-3">
            <div class="text-body-1 font-weight-bold text-grey-darken-1">{{ sinRevisor }}</div>
            <div class="text-caption text-grey">Sin Revisor</div>
          </div>
          <v-divider vertical />

          <!-- Por Revisar - MISMO TAMAÑO CON ANIMACIÓN -->
          <div
            class="text-center px-3 stat-highlight"
            :class="{ 'stat-highlight-active': porRevisar > 0 }"
          >
            <div
              class="text-body-1 font-weight-bold"
              :class="porRevisar > 0 ? 'text-deep-orange-accent-3' : 'text-grey'"
            >
              {{ porRevisar }}
            </div>
            <div class="text-caption text-grey">
              Por Revisar
              <v-icon
                v-if="porRevisar > 0"
                size="14"
                color="deep-orange-accent-3"
                class="ml-1 icon-bell"
                style="vertical-align: middle"
              >
                mdi-bell-ring
              </v-icon>
            </div>
          </div>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script setup>
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'

defineProps({
  total: { type: Number, default: 0 },
  pendientes: { type: Number, default: 0 },
  aprobadas: { type: Number, default: 0 },
  rechazadas: { type: Number, default: 0 },
  sinRevisor: { type: Number, default: 0 },
  porRevisar: { type: Number, default: 0 },
})
</script>

<style scoped>
.header-bg {
  background: transparent;
}

.stats-summary {
  background: white;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* ============================================ */
/* ANIMACIÓN MINIMALISTA (MISMO TAMAÑO)         */
/* ============================================ */

.stat-highlight {
  border-radius: 8px;
  transition: all 0.3s ease;
}

/* Estado activo: cuando hay pendientes por revisar */
.stat-highlight-active {
  background: linear-gradient(135deg, rgba(255, 87, 34, 0.1) 0%, rgba(255, 152, 0, 0.04) 100%);
  border: 1.5px solid rgba(255, 87, 34, 0.25);
  animation: glow-pulse 2.5s infinite;
}

/* Animación de brillo sutil */
@keyframes glow-pulse {
  0%,
  100% {
    box-shadow: 0 0 6px rgba(255, 87, 34, 0.1);
  }
  50% {
    box-shadow: 0 0 14px rgba(255, 87, 34, 0.25);
  }
}

/* Animación de la campana */
.icon-bell {
  animation: bell-shake 3s infinite;
  transform-origin: top center;
}

@keyframes bell-shake {
  0%,
  100% {
    transform: rotate(0);
  }
  2% {
    transform: rotate(12deg);
  }
  4% {
    transform: rotate(-12deg);
  }
  6% {
    transform: rotate(8deg);
  }
  8% {
    transform: rotate(-8deg);
  }
  10% {
    transform: rotate(0);
  }
}

/* Hover sutil */
.stat-highlight-active:hover {
  background: linear-gradient(135deg, rgba(255, 87, 34, 0.15) 0%, rgba(255, 152, 0, 0.08) 100%);
  border-color: rgba(255, 87, 34, 0.4);
  box-shadow: 0 0 18px rgba(255, 87, 34, 0.3);
}

@media (max-width: 960px) {
  .stats-summary {
    width: 100%;
    justify-content: center;
    margin-top: 12px;
    flex-wrap: wrap;
  }
}
</style>
