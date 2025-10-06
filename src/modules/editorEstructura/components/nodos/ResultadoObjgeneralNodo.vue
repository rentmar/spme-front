<template>
  <BaseNodo :id="id" :data="data" :show-delete="true" v-bind="$attrs">
    <!-- Contenido del nodo -->
    <template #default>
      <div class="text-body-2">
        <div class="mb-1"><strong>Codigo:</strong> {{ data.nodoProyecto.codigo }}</div>
        <div class="mb-1"><strong>Descripcion:</strong> {{ data.nodoProyecto.descripcion }}</div>
        <div class="mb-1"><strong>Supuestos:</strong> {{ data.nodoProyecto.supuestos }}</div>
        <div class="mb-1"><strong>Riesgos:</strong> {{ data.nodoProyecto.riesgos }}</div>
      </div>
    </template>

    <!-- Menú contextual -->
    <template #menu>
      <!-- Agregar Indicador Objetivo General -->
      <v-list-item class="custom-menu-item" @click="agregarIndicadorResultadoOg">
        <v-list-item-title>Agregar Indicador Resultado OG</v-list-item-title>
        <template v-slot:prepend>
          <v-icon :icon="'mdi-chart-line'"></v-icon>
        </template>
      </v-list-item>
      <!-- Agregar Proceso Objetivo General -->
      <v-list-item class="custom-menu-item" @click="agregarProcesos">
        <v-list-item-title>Agregar Procesos</v-list-item-title>
        <template v-slot:prepend>
          <v-icon :icon="'mdi-flag-checkered'"></v-icon>
        </template>
      </v-list-item>
      <!-- Agregar Proceso Objetivo General -->
      <v-list-item class="custom-menu-item" @click="agregarActividad">
        <v-list-item-title>Agregar Actividad</v-list-item-title>
        <template v-slot:prepend>
          <v-icon :icon="'mdi-clock-outline'"></v-icon>
        </template>
      </v-list-item>
      <!-- Agregar Producto General -->
      <v-list-item class="custom-menu-item" @click="agregarProductoGeneral">
        <v-list-item-title>Agregar Producto</v-list-item-title>
        <template v-slot:prepend>
          <v-icon :icon="'mdi-flag-checkered'"></v-icon>
        </template>
      </v-list-item>
    </template>
    <template #handles>
      <Handle type="target" position="top" :id="`source-${id}`" :style="handleStyle" />
      <Handle type="source" position="bottom" :id="`source-${id}`" :style="handleStyle" />
    </template>
  </BaseNodo>
</template>

<script setup>
import { inject } from 'vue'
import BaseNodo from './BaseNodo.vue'
import { Handle, useVueFlow } from '@vue-flow/core'
import { useIndicadores } from '@/modules/proyecto/composables/useIndicadores'
import { useProcesos } from '@/modules/proyecto/composables/useProcesos'
import { useActividad } from '@/modules/proyecto/composables/useActividad'
import { useProductos } from '@/modules/proyecto/composables/useProductos'

const props = defineProps({
  id: { type: String, required: true },
  data: { type: Object, required: true },
})

//Iniciar composables
const { error, indicadorResultadoObjGeneral, crearIndicadorResultadoObjetivoGeneral } =
  useIndicadores()
const { procesos, crearProceso } = useProcesos()
const { actividad, crearActividad } = useActividad()
const { productoGral, crearProductoGeneral } = useProductos()

//Id mapa de estructura
const proyectoEstructura = inject('proyectoEstructura')
const mapaNodoId = proyectoEstructura.value.mapa_nodo.id
// console.log('Id del diagrama Ind Res OG')
// console.log(mapaNodoId)

//Datos del nodo
const { findNode } = useVueFlow()
const currentNode = findNode(props.id)
const idCurrentNode = currentNode.data.nodoProyecto.id
// console.log(idCurrentNode)
//identificador del proyecto
const idProyecto = proyectoEstructura.value.id

const handleStyle = {
  width: '12px',
  height: '12px',
  background: '#555',
  borderRadius: '50%',
}

/* Funciones */
//Emitir señales
const emit = defineEmits([
  'addIndicadorResultadoOg',
  'addProcesosResultadoOg',
  'addActividadResOG',
  'addProducto',
])

//AGregar Indicador Obj General
const agregarIndicadorResultadoOg = async () => {
  // const indicadorResultadoOg = {
  //   codigo: 'IND00-R0-OG',
  //   descripcion: '',
  //   definicion: '',
  //   redaccion: 'GUIA',
  //   fuente_verificacion: 'Fuente Verificacion',
  //   target_poblacion: '',
  //   tipo: 'A-Z',
  //   baseline: '',
  //   target_q1: '',
  //   target_q2: '',
  //   target_q3: '',
  //   resultado_og: idCurrentNode,
  // }

  const indicadorResultadoOg = {
    codigo: 'IND00-R0-OG',
    descripcion: '',
    redaccion: 'GUIA',
    fuente_verificacion: 'Fuente Verificacion',
    target_poblacion: '',
    fechaTargetPoblacion: null,
    tipo: 'A-Z',
    frecuencia: 'MENSUAL',
    responsable: null,
    baseline: '',
    fechaLineaBase: null,
    target_q1: '',
    fechaTargetQ1: null,
    target_q2: '',
    fechaTargetQ2: null,
    target_q3: '',
    fechaTargetQ3: null,
    target_q4: null,
    fechaTargetQ4: null,
    resultado_og: idCurrentNode,
  }

  //Crear el indicador resultado og
  try {
    await crearIndicadorResultadoObjetivoGeneral(indicadorResultadoOg)
    // console.log('Indicador Resultado OG')
    // console.log(indicadorResultadoObjGeneral)
    const payload = {
      sourceId: currentNode.id.toString(),
      meta: {
        label: 'Indicador Res. OG',
        type: 'indicadorrog',
        estado: 'ES',
        mapaNodoId: mapaNodoId.toString(),
        nodoProyecto: {
          id: indicadorResultadoObjGeneral.value.id,
          descripcion: indicadorResultadoObjGeneral.value.descripcion,
          definicion: indicadorResultadoObjGeneral.value.definicion,
          codigo: indicadorResultadoObjGeneral.value.codigo,
          redaccion: indicadorResultadoObjGeneral.value.redaccion,
          fuente_verificacion: indicadorResultadoObjGeneral.value.fuente_verificacion,
          target_poblacion: indicadorResultadoObjGeneral.value.target_poblacion,
          fechaTargetPoblacion: indicadorResultadoObjGeneral.value.fechaTargetPoblacion,
          tipo: indicadorResultadoObjGeneral.value.tipo,
          frecuencia: indicadorResultadoObjGeneral.value.frecuencia,
          responsable: indicadorResultadoObjGeneral.value.responsable,
          baseline: indicadorResultadoObjGeneral.value.baseline,
          fechaLineaBase: indicadorResultadoObjGeneral.value.fechaLineaBase,
          target_q1: indicadorResultadoObjGeneral.value.target_q1,
          fechaTargetQ1: indicadorResultadoObjGeneral.value.fechaTargetQ1,
          target_q2: indicadorResultadoObjGeneral.value.target_q2,
          fechaTargetQ2: indicadorResultadoObjGeneral.value.fechaTargetQ2,
          target_q3: indicadorResultadoObjGeneral.value.target_q3,
          fechaTargetQ3: indicadorResultadoObjGeneral.value.fechaTargetQ3,
          resultado_og: indicadorResultadoObjGeneral.value.resultado_og,
        },
      },
    }
    emit('addIndicadorResultadoOg', payload)
  } catch (err) {
    console.log('Error al crear el Indicador Res OG' + err + ' - ' + error)
  }
}

//Agregar
const agregarProcesos = async () => {
  const processResOg = {
    codigo: 'PROC',
    titulo: 'Procesos Res OG',
    descripcion: '',
    resultado_og: idCurrentNode,
    resultado_oe: null,
    producto_oe: null,
  }
  // console.log(processResOg)
  try {
    await crearProceso(processResOg)
    console.log('Proceso')
    console.log(procesos)
    const payload = {
      sourceId: currentNode.id.toString(),
      meta: {
        label: 'Procesos Resultado OG',
        type: 'procesorog',
        mapaNodoId: mapaNodoId.toString(),
        nodoProyecto: {
          id: procesos.value.id,
          codigo: procesos.value.codigo,
          titulo: procesos.value.titulo,
          descripcion: procesos.value.descripcion,
          resultado_og: procesos.value.resultado_og,
          resultado_oe: procesos.value.resultado_oe,
          producto_oe: procesos.producto_oe,
        },
      },
    }
    emit('addProcesosResultadoOg', payload)
  } catch (err) {
    console.log('Error al crear el Indicador Res OG' + err)
  }
}

//Agregar actividad
const agregarActividad = async () => {
  // const act = {
  //   codigo: 'ACT',
  //   descripcion: '',
  //   supuestos: '',
  //   riesgos: '',
  //   objetivo_de_actividad: '',
  //   descripcion_evaluacion: '',
  //   fecha_programada: null,
  //   fecha_inicio: null,
  //   fecha_cierre: null,
  //   presupuesto: null,
  //   presupuestoGlobal: null,
  //   procedencia_fondos: null,
  //   estado: 'PLAN',
  //   responsable: null,
  //   proceso: null,
  //   resultado_og: idCurrentNode,
  //   resultado_oe: null,
  //   producto_oe: null,
  //   objetivo_pei: null,
  //   indicador_pei: null,
  //   tipo: [],
  // }
  // const act = {
  //   codigo: 'ACT',
  //   descripcion: '',
  //   supuestos: '',
  //   riesgos: '',
  //   objetivo_de_actividad: '',
  //   descripcion_evaluacion: '',
  //   fecha_programada: null,
  //   fecha_inicio: null,
  //   fecha_cierre: null,
  //   presupuesto: null,
  //   presupuestoGlobal: null,
  //   procedencia_fondos: null,
  //   estado: 'CRD',
  //   proceso: null,
  //   resultado_og: idCurrentNode,
  //   resultado_oe: null,
  //   producto_oe: null,
  //   objetivo_pei: null,
  //   indicador_pei: null,
  //   proyecto: idProyecto,
  //   responsable: null,
  //   tipo: null,
  // }
  const act = {
    responsable: null,
    proyecto: idProyecto.toString(),
    codigo: 'ACT',
    nombreCorto: null,
    descripcion: '',
    supuestos: '',
    riesgos: '',
    objetivo_de_actividad: '',
    descripcion_evaluacion: '',
    descripcion_tipo_actividad: null,
    fecha_programada: null,
    fecha_inicio: null,
    fecha_cierre: null,
    presupuesto: null,
    presupuestoGlobal: null,
    totalReportado: null,
    totalEjecutado: null,
    saldo: null,
    gradoEjecucion: null,
    procedencia_fondos: null,
    estado: 'CRD',
    tipo: null,
    proceso: null,
    resultado_og: null,
    resultado_oe: null,
    producto_oe: null,
    objetivo_pei: null,
    indicador_pei: null,
  }
  console.log(act)
  try {
    await crearActividad(act)
    console.log('Actividad creada')
    console.log(actividad)
    const payload = {
      sourceId: currentNode.id.toString(),
      meta: {
        label: 'Actividad Res. OG',
        type: 'actividadrog',
        mapaNodoId: mapaNodoId.toString(),
        nodoProyecto: {
          id: actividad.value.id,
          codigo: actividad.value.codigo,
          descripcion: actividad.value.descripcion,
          tipo: actividad.value.tipo,
          fecha_programada: actividad.value.fecha_programada,
          duracion: actividad.value.duracion,
          fecha_inicio: actividad.value.fecha_inicio,
          fecha_cierre: actividad.value.fecha_cierre,
          presupuesto: actividad.value.presupuesto,
          presupuesto_pei: actividad.value.presupuesto_pei,
          estado: actividad.value.estado,
          procedencia_fondos: actividad.value.procedencia_fondos,
          objetivo_de_actividad: actividad.value.objetivo_de_actividad,
          descripcion_evaluacion: actividad.value.descripcion_evaluacion,
          justificacion_modificacion: actividad.value.justificacion_modificacion,
          datos_actividad: actividad.value.datos_actividad,
          proceso: actividad.value.proceso,
          resultado_og: actividad.value.resultado_og,
          resultado_oe: actividad.value.resultado_oe,
          producto_oe: actividad.value.producto_oe,
          responsable: actividad.value.responsable,
          proyecto: actividad.value.proyecto,
        },
      },
    }
    emit('addActividadResOG', payload)
  } catch (err) {
    console.error('Eror al crear', err)
  }
}

const agregarProductoGeneral = async () => {
  const ptrGral = {
    codigo: 'PTRG',
    supuestos: '',
    riesgos: '',
    entregado: false,
    objetivo_general: null,
    objetivo_especifico: null,
    indicador_og: null,
    indicador_oe: null,
    resultado_og: idCurrentNode,
    resultado_oe: null,
    indicador_resultado_og: null,
    indicador_resultado_oe: null,
  }
  try {
    console.log(ptrGral)
    await crearProductoGeneral(ptrGral)
    const payload = {
      sourceId: currentNode.id.toString(),
      meta: {
        label: 'Producto',
        type: 'productogral',
        mapaNodoId: mapaNodoId.toString(),
        nodoProyecto: {
          id: productoGral.value.id,
          codigo: productoGral.value.codigo,
          supuestos: productoGral.value.supuestos,
          riesgos: productoGral.value.riesgos,
          entregado: productoGral.entregado,
          objetivo_general: productoGral.value.objetivo_general,
          objetivo_especifico: productoGral.value.objetivo_especifico,
          indicador_og: productoGral.value.indicador_og,
          indicador_oe: productoGral.value.indicador_oe,
          resultado_og: productoGral.value.resultado_og,
          resultado_oe: productoGral.value.resultado_oe,
          indicador_resultado_og: productoGral.value.indicador_resultado_og,
          indicador_resultado_oe: productoGral.value.indicador_resultado_oe,
        },
      },
    }
    emit('addProducto', payload)
  } catch (err) {
    console.log('ERROR: ', err)
  }
}
</script>
<style scoped>
.custom-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px; /* Menor padding horizontal */
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.custom-menu-item:hover {
  background-color: #e0e0e0; /* Color más sutil y amigable */
  cursor: pointer;
}

.v-icon {
  font-size: 18px;
  color: #616161;
  min-width: 20px;
}

.v-list-item-title {
  font-size: 13.5px;
  font-weight: 500;
  color: #333;
  white-space: nowrap;
}

.v-list-item {
  min-height: 36px !important; /* Altura estándar menor */
  padding-left: 4px !important;
  padding-right: 4px !important;
}
</style>
