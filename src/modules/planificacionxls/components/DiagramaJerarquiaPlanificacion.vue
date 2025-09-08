<template>
  <div class="hierarchy-container">
    <h2>Jerarquía del Proyecto: {{ proyectoData.titulo }}</h2>

    <!-- Objetivo General y sus componentes -->
    <div class="level">
      <h3>Objetivo General</h3>
      <div class="node-item objetivo-general">
        <span class="codigo">{{ objetivoGeneral.codigo }}</span>
        <span class="descripcion">{{ objetivoGeneral.descripcion }}</span>
      </div>

      <!-- Indicador de Objetivo General -->
      <div class="sub-level">
        <h4>Indicador del Objetivo General</h4>
        <div class="node-item indicador-og">
          <span class="codigo">IND-OG1</span>
          <span class="descripcion">Porcentaje de cumplimiento del objetivo general</span>
        </div>
      </div>

      <!-- Resultados de Objetivo General -->
      <div class="sub-level">
        <h4>Resultados de Objetivo General</h4>
        <div v-for="resultado in resultadosOG" :key="resultado.id" class="node-item resultado-og">
          <span class="codigo">{{ resultado.codigo }}</span>
          <span class="descripcion">{{ resultado.descripcion }}</span>

          <!-- Indicadores de Resultado OG -->
          <div class="sub-level">
            <h5>Indicadores de Resultado OG</h5>
            <div class="node-item indicador-rog">
              <span class="codigo">IND-R1</span>
              <span class="descripcion">Nivel de avance del resultado</span>
            </div>
          </div>

          <!-- Procesos de Resultado OG -->
          <div class="sub-level">
            <h5>Procesos de Resultado OG</h5>
            <div
              v-for="proceso in procesosPorResultado(resultado.id)"
              :key="proceso.id"
              class="node-item proceso-rog"
            >
              <span class="codigo">{{ proceso.codigo }}</span>
              <span class="titulo">{{ proceso.titulo }}</span>

              <!-- Actividades de Proceso ROG -->
              <div class="sub-level">
                <h6>Actividades de Proceso ROG</h6>
                <div
                  v-for="actividad in actividadesPorProceso(proceso.id)"
                  :key="actividad.id"
                  class="node-item actividad-proc"
                >
                  <span class="codigo">{{ actividad.codigo }}</span>
                  <span class="descripcion">{{
                    actividad.descripcion || 'Actividad de proceso'
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Objetivos Específicos -->
    <div class="level">
      <h3>Objetivos Específicos</h3>
      <div
        v-for="objetivo in objetivosEspecificos"
        :key="objetivo.id"
        class="node-item objetivo-especifico"
      >
        <span class="codigo">{{ objetivo.codigo }}</span>
        <span class="descripcion">{{ objetivo.descripcion }}</span>

        <!-- Resultados de Objetivo Específico -->
        <div class="sub-level">
          <h4>Resultados de Objetivo Específico</h4>
          <div
            v-for="resultado in resultadosPorObjetivo(objetivo.id)"
            :key="resultado.id"
            class="node-item resultado-oe"
          >
            <span class="codigo">{{ resultado.codigo }}</span>
            <span class="descripcion">{{ resultado.descripcion }}</span>

            <!-- Procesos de Resultado OE -->
            <div class="sub-level">
              <h5>Procesos de Resultado OE</h5>
              <div class="node-item proceso-roe">
                <span class="codigo">PROC-OE1</span>
                <span class="titulo">Proceso de implementación</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Productos de Objetivo Específico -->
        <div class="sub-level">
          <h4>Productos de Objetivo Específico</h4>
          <div
            v-for="producto in productosPorObjetivo(objetivo.id)"
            :key="producto.id"
            class="node-item producto-oe"
          >
            <span class="codigo">{{ producto.codigo }}</span>
            <span class="descripcion">{{ producto.descripcion }}</span>

            <!-- Procesos de Producto OE -->
            <div class="sub-level">
              <h5>Procesos de Producto OE</h5>
              <div class="node-item proceso-poe">
                <span class="codigo">PROC-P1</span>
                <span class="titulo">Proceso de producción</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Resumen de la estructura -->
    <div class="summary">
      <h3>Resumen de la Estructura</h3>
      <ul>
        <li>Proyecto: 1</li>
        <li>Objetivo General: 1</li>
        <li>Objetivos Específicos: {{ objetivosEspecificos.length }}</li>
        <li>Resultados OG: {{ resultadosOG.length }}</li>
        <li>Procesos ROG: {{ procesosROG.length }}</li>
        <li>Actividades: {{ totalActividades }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Datos de ejemplo (dummy data)
const proyectoData = {
  id: 1,
  codigo: 'TEST025',
  titulo: 'Proyecto de Desarrollo Comunitario',
  descripcion: 'Proyecto integral de desarrollo social y económico',
}

const objetivoGeneral = {
  id: 1,
  codigo: 'OG1',
  descripcion: 'Mejorar la calidad de vida de la comunidad mediante el desarrollo integral',
}

const resultadosOG = [
  {
    id: 1,
    codigo: 'ROG1',
    descripcion: 'Aumento del 30% en el acceso a servicios básicos',
  },
  {
    id: 2,
    codigo: 'ROG2',
    descripcion: 'Incremento del 25% en los ingresos familiares promedio',
  },
]

const procesosROG = [
  {
    id: 1,
    codigo: 'PROC-ROG1',
    titulo: 'Proceso de implementación de servicios',
    resultado_og: 1,
  },
  {
    id: 2,
    codigo: 'PROC-ROG2',
    titulo: 'Proceso de capacitación productiva',
    resultado_og: 2,
  },
]

const actividadesProceso = [
  {
    id: 1,
    codigo: 'ACT-PROC1',
    descripcion: 'Coordinación con instituciones de servicio',
    proceso: 1,
  },
  {
    id: 2,
    codigo: 'ACT-PROC2',
    descripcion: 'Desarrollo de material de capacitación',
    proceso: 2,
  },
]

const objetivosEspecificos = [
  {
    id: 1,
    codigo: 'OE1',
    descripcion: 'Fortalecer las capacidades organizativas de la comunidad',
  },
  {
    id: 2,
    codigo: 'OE2',
    descripcion: 'Implementar proyectos productivos sostenibles',
  },
]

const resultadosOE = [
  {
    id: 1,
    codigo: 'ROE1',
    descripcion: 'Organizaciones comunitarias fortalecidas',
    objetivo_especifico: 1,
  },
  {
    id: 2,
    codigo: 'ROE2',
    descripcion: 'Proyectos productivos en funcionamiento',
    objetivo_especifico: 2,
  },
]

const productosOE = [
  {
    id: 1,
    codigo: 'POE1',
    descripcion: 'Manuales de organización comunitaria',
    objetivo_especifico: 1,
  },
  {
    id: 2,
    codigo: 'POE2',
    descripcion: 'Equipamiento para proyectos productivos',
    objetivo_especifico: 2,
  },
]

// Computed properties
const totalActividades = computed(() => actividadesProceso.length)

// Métodos para filtrar por relación
const procesosPorResultado = (resultadoId) => {
  return procesosROG.filter((p) => p.resultado_og === resultadoId)
}

const actividadesPorProceso = (procesoId) => {
  return actividadesProceso.filter((a) => a.proceso === procesoId)
}

const resultadosPorObjetivo = (objetivoId) => {
  return resultadosOE.filter((r) => r.objetivo_especifico === objetivoId)
}

const productosPorObjetivo = (objetivoId) => {
  return productosOE.filter((p) => p.objetivo_especifico === objetivoId)
}
</script>

<style scoped>
.hierarchy-container {
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 1000px;
  margin: 0 auto;
}

.level {
  margin-bottom: 30px;
  padding-left: 20px;
  border-left: 3px solid #e0e0e0;
}

.sub-level {
  margin: 15px 0 15px 20px;
  padding-left: 20px;
  border-left: 2px solid #f0f0f0;
}

h3,
h4,
h5,
h6 {
  color: #2c3e50;
  margin: 10px 0;
}

.node-item {
  padding: 12px 15px;
  margin: 8px 0;
  border-radius: 6px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease;
}

.node-item:hover {
  transform: translateX(5px);
}

.objetivo-general {
  border-left: 4px solid #3498db;
  background: #ebf5fb;
}

.objetivo-especifico {
  border-left: 4px solid #2980b9;
  background: #eaf2f8;
}

.resultado-og {
  border-left: 4px solid #2ecc71;
  background: #eafaf1;
}

.resultado-oe {
  border-left: 4px solid #27ae60;
  background: #e8f6ef;
}

.proceso-rog,
.proceso-roe,
.proceso-poe {
  border-left: 4px solid #f39c12;
  background: #fef9e7;
}

.actividad-proc {
  border-left: 4px solid #e74c3c;
  background: #fdedec;
}

.producto-oe {
  border-left: 4px solid #9b59b6;
  background: #f4ecf7;
}

.indicador-og,
.indicador-rog {
  border-left: 4px solid #16a085;
  background: #e8f8f5;
}

.codigo {
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 5px;
  font-size: 1.1em;
}

.descripcion,
.titulo {
  color: #7f8c8d;
  font-size: 0.95em;
  line-height: 1.4;
}

.summary {
  margin-top: 40px;
  padding: 25px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #34495e;
}

.summary h3 {
  color: #34495e;
  margin-top: 0;
}

.summary ul {
  list-style: none;
  padding: 0;
}

.summary li {
  padding: 8px 0;
  border-bottom: 1px solid #e0e0e0;
  font-weight: 500;
}

.summary li:last-child {
  border-bottom: none;
}
</style>
