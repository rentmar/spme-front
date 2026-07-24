<template>
  <div class="proyecto-excel-wrapper">
    <!-- CABECERA -->
    <div class="proyecto-header">
      <div class="proyecto-info">
        <div class="proyecto-codigo">{{ proyecto.codigo }}</div>
        <div class="proyecto-titulo">{{ proyecto.titulo }}</div>
      </div>
      <div class="proyecto-meta">
        <div class="meta-item">
          <span class="meta-label">Presupuesto:</span>
          <span class="meta-value">Bs. {{ fmt(proyecto.presupuesto) }}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Estado:</span>
          <span class="meta-value badge badge-blue">{{ proyecto.estado }}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Periodo:</span>
          <span class="meta-value"
            >{{ proyecto.fecha_inicio }} - {{ proyecto.fecha_finalizacion }}</span
          >
        </div>
        <div class="meta-item">
          <span class="meta-label">Propietario:</span>
          <span class="meta-value">{{ proyecto.propietario }}</span>
        </div>
      </div>
    </div>

    <!-- GRILLA -->
    <div class="excel-wrapper">
      <PlanificacionProyectoActividadesV3 />
    </div>

    <!-- PIE DEL PROYECTO -->
    <div class="proyecto-footer">
      <span>🕐 Última actualización: 23/07/2026 14:30</span>
      <span class="footer-sep">|</span>
      <span>👤 {{ proyecto.propietario }}</span>
      <span class="footer-sep">|</span>
      <span>📊 PEI 2022-2027</span>
      <span style="flex: 1"></span>
      <span>SPME v2.0</span>
    </div>
  </div>
</template>

<script setup>
import PlanificacionProyectoActividadesV3 from '@/modules/planificacionxls/components/PlanificacionProyectoActividadesV3.vue'

const proyecto = {
  codigo: 'PROYPRESS',
  titulo: 'Proyecto Press Update - Planificación y Ejecución de Actividades',
  presupuesto: 50000,
  estado: 'En Planificacion',
  fecha_inicio: '2026-06-23',
  fecha_finalizacion: '2026-12-31',
  propietario: 'Marcelo Rolqueza Bernal',
}

const fmt = (n) => (+(n || 0)).toLocaleString('es-BO', { minimumFractionDigits: 2 })
</script>

<style>
.v-container {
  padding: 0 !important;
  max-width: 100% !important;
}
</style>

<style scoped>
* {
  box-sizing: border-box;
}

.proyecto-excel-wrapper {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 100px);
  margin: 4px 0 0 0;
  background: #fff;
  border: 1px solid #c4c7c9;
  border-radius: 6px;
  overflow: hidden;
}

/* CABECERA AZUL */
.proyecto-header {
  flex-shrink: 0;
  padding: 12px 18px;
  background: linear-gradient(135deg, #5c2d91 0%, #3e1f63 100%);
  border-bottom: 2px solid #2a1445;
}

.proyecto-info {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 6px;
}

.proyecto-codigo {
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  background: rgba(255, 255, 255, 0.2);
  padding: 3px 10px;
  border-radius: 3px;
  font-family: monospace;
}

.proyecto-titulo {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
}

.proyecto-meta {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}

.meta-label {
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}
.meta-value {
  color: #fff;
  font-weight: 600;
}

.badge {
  padding: 2px 10px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
}
.badge-blue {
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
}

/* GRILLA */
.excel-wrapper {
  flex: 1;
  overflow: hidden;
  min-height: 0;
}

/* PIE GRIS */
.proyecto-footer {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  height: 28px;
  padding: 0 16px;
  background: #f1f3f4;
  border-top: 1px solid #c4c7c9;
  font-size: 11px;
  color: #5f6368;
  gap: 8px;
}

.footer-sep {
  color: #c4c7c9;
}
</style>
