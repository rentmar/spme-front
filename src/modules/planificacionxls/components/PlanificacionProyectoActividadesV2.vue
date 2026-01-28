<template>
  <div class="hot-wrapper" v-if="!isLoading">
    <div class="content-wrapper">
      <!-- Panel Izquierdo - Tabla Excel -->
      <div class="excel-panel">
        <!-- Toolbar principal -->
        <v-toolbar flat density="comfortable" class="excel-toolbar">
          <!-- Panel de informacion -->
          <v-tooltip text="Mostrar/Esconder Panel de informacion" location="bottom">
            <template #activator="{ props }">
              <v-btn v-bind="props" variant="text" class="toolbar-btn" @click="toogleSidePanel">
                <v-icon size="18">mdi-view-agenda</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
          <!--Guardar-->
          <v-tooltip
            :text="tieneCambiosSinGuardar ? 'Guardar cambios' : 'No hay cambios para guardar'"
            location="bottom"
          >
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                variant="text"
                class="toolbar-btn"
                @click="mostrarPreEnvio"
                :disabled="!tieneCambiosSinGuardar || guardando"
              >
                <v-icon size="18" :color="tieneCambiosSinGuardar ? 'primary' : 'disabled'"
                  >mdi-content-save</v-icon
                >
                <div v-if="tieneCambiosSinGuardar" class="changes-dot"></div>
              </v-btn>
            </template>
          </v-tooltip>
          <!--Nueva Actividad-->
          <v-tooltip text="Agregar nueva actividad" location="bottom">
            <template #activator="{ props }">
              <v-btn v-bind="props" variant="text" class="toolbar-btn" @click="abrirNuevaActividad">
                <v-icon size="18">mdi-plus-outline</v-icon>
                <v-icon size="18">mdi-clipboard-text-outline</v-icon>
              </v-btn>
            </template>
          </v-tooltip>

          <v-dialog v-model="mostrarModalActividad" fullscreen>
            <v-card>
              <v-toolbar>
                <v-btn icon="mdi-close" @click="cerrarNuevaActividad"></v-btn>

                <v-toolbar-title>Agregar Nueva Actividad/Proceso </v-toolbar-title>

                <v-toolbar-items>
                  <!-- <v-btn text="Guardar" variant="text"></v-btn> -->
                </v-toolbar-items>
              </v-toolbar>
              <v-card-text>
                <v-card-text>
                  <SeleccionEstructuraActividad
                    :proyecto-data="props.proyectoEstructura"
                    @crear-actividad="crearActividadPlan"
                  ></SeleccionEstructuraActividad>
                </v-card-text>
              </v-card-text>
            </v-card>
          </v-dialog>

          <v-spacer></v-spacer>
          <!--Exportar a Excel-->
          <v-tooltip text="Exportar a Excel" location="bottom">
            <template #activator="{ props }">
              <v-btn v-bind="props" variant="text" class="toolbar-btn" @click="exportarExcel">
                <v-icon size="18">mdi-microsoft-excel</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
        </v-toolbar>

        <!-- Toolbar de información - Estilo Excel -->
        <v-toolbar
          flat
          density="compact"
          class="details-toolbar excel-style-toolbar"
          v-if="selectedRowData"
        >
          <!-- Información en línea -->
          <div class="info-container excel-info-container horizontal-layout">
            <!-- Información de la actividad -->
            <div class="info-section excel-info-section horizontal-item">
              <v-icon color="#0078D4" size="16" class="mr-1"
                >mdi-checkbox-marked-circle-outline</v-icon
              >
              <span class="info-text excel-info-text">
                <strong class="excel-label">Actividad:</strong>
                <span class="excel-value">{{ selectedRowData.nombreCorto }}</span>
                <span class="excel-code">({{ selectedRowData.codigo }})</span>
              </span>
            </div>
            <!-- Información de presupuesto -->
            <div class="info-section excel-info-section horizontal-item">
              <v-icon color="#107C10" size="16" class="mr-1">mdi-currency-usd</v-icon>
              <span class="info-text excel-info-text">
                <strong class="excel-label">Presupuesto:</strong>
                <span class="excel-value budget-value">{{
                  formatCurrency(selectedRowData.presupuesto)
                }}</span>
              </span>
            </div>
            <!-- Información de fecha de inicio -->
            <div class="info-section excel-info-section horizontal-item">
              <v-icon color="#E81123" size="16" class="mr-1">mdi-calendar-clock</v-icon>
              <span class="info-text excel-info-text">
                <strong class="excel-label">Inicio:</strong>
                <span class="excel-value">{{ formatDate(selectedRowData.fecha_inicio) }}</span>
              </span>
            </div>
            <!-- Información de fecha de cierre -->
            <div
              class="info-section excel-info-section horizontal-item"
              v-if="selectedRowData.fecha_cierre"
            >
              <v-icon color="#FF8C00" size="16" class="mr-1">mdi-calendar-end</v-icon>
              <span class="info-text excel-info-text">
                <strong class="excel-label">Cierre:</strong>
                <span class="excel-value">{{ formatDate(selectedRowData.fecha_cierre) }}</span>
              </span>
            </div>
          </div>

          <v-spacer></v-spacer>

          <!-- Botonera compacta estilo Excel -->
          <div class="estructura-buttons excel-button-group horizontal-buttons">
            <v-tooltip text="Agregar subactividad" location="bottom">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  color="#0078D4"
                  variant="flat"
                  size="small"
                  class="excel-button budget-button"
                  @click="mostrarModalAgregarTarea"
                >
                  <template v-slot:prepend>
                    <v-icon size="16">mdi-plus-outline </v-icon>
                  </template>
                  Subactividad
                </v-btn>
              </template>
            </v-tooltip>
            <DialogTarea
              v-model="mostrarDialogo"
              :actividad="selectedRowData"
              :tarea="tareaSeleccionada"
              @guardar="crearNuevaTarea"
              @cancelar="cerrarDialogo"
            ></DialogTarea>

            <v-tooltip text="Ajustar Presupuesto de la Actividad" location="bottom">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  color="#0078D4"
                  variant="flat"
                  size="small"
                  class="excel-button budget-button"
                  @click="mostrarModalPresupuesto"
                >
                  <template v-slot:prepend>
                    <v-icon size="16">mdi-cash-multiple</v-icon>
                  </template>
                  Presupuesto
                </v-btn>
              </template>
            </v-tooltip>

            <v-tooltip text="Relacion con el PEI" location="bottom">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  color="#107C10"
                  variant="flat"
                  size="small"
                  class="excel-button pei-button"
                  @click="abrirModalPei"
                >
                  <template v-slot:prepend>
                    <v-icon size="16">mdi-chart-tree</v-icon>
                  </template>
                  PEI
                </v-btn>
              </template>
            </v-tooltip>

            <!----Componente Presupuesto-->
            <ComponentPresupuesto
              v-model="mostrarPresupuesto"
              :presupuesto-total="selectedRowData.presupuesto"
              :desglose-inicial="selectedRowData.procedencia_fondos"
              @guardarDesglose="guardarDesglosePresupuesto"
            ></ComponentPresupuesto>
          </div>
          <!--Estructura Pei-->
          <v-dialog v-model="modalPei" transition="dialog-bottom-transition" fullscreen>
            <v-card>
              <v-toolbar>
                <v-btn icon="mdi-close" @click="modalPei = false"></v-btn>
                <v-toolbar-title
                  >Estructura PEI: {{ selectedRowData.codigo }} -
                  {{ selectedRowData.nombreCorto }}</v-toolbar-title
                >
              </v-toolbar>
              <v-card-text style="height: calc(100vh - 64px); padding: 0">
                <SeleccionEstructuraPei
                  :objetivo-inicial="objetivoInicialId"
                  :indicador-inicial="indicadorInicialId"
                  :factores-criticos-iniciales="selectedRowData.factoresCriticos"
                  @guardar="manejarSeleccionPei"
                  @cerrar="modalPei = false"
                ></SeleccionEstructuraPei>
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-toolbar>

        <HotTable
          v-if="inicializado"
          ref="hotTable"
          :data="tableData"
          :columns="columns"
          :colHeaders="headers"
          :rowHeaders="true"
          :height="1500"
          :contextMenu="contextMenuConfig"
          :language="'es-Mx'"
          :afterChange="handleChange"
          :afterSelection="handleSelection"
          :licenseKey="'non-commercial-and-evaluation'"
          :hiddenColumns="hiddenColumnsConfig"
        ></HotTable>
      </div>

      <!-- Panel Derecho - Contenido Adicional -->
      <div class="side-panel" v-if="sidePanelVisible">
        <ListaTareasActividad
          v-if="selectedRowData"
          :actividad="selectedRowData"
        ></ListaTareasActividad>
      </div>
    </div>
  </div>

  <!-- Modal de Pre-Envío (Exactamente como el PEI) -->
  <v-dialog v-model="mostrandoPreEnvio" max-width="800" persistent>
    <v-card>
      <v-toolbar color="primary" dark flat>
        <v-toolbar-title>
          <v-icon start>mdi-send</v-icon>
          Confirmar Envío de Cambios - Proyecto
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="mostrandoPreEnvio = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="pa-4">
        <!-- Resumen de cambios -->
        <v-card variant="flat" class="mb-4 pa-4" color="blue-lighten-5">
          <div class="text-h6 font-weight-bold mb-2">Resumen de Cambios</div>
          <div class="text-caption text-medium-emphasis">
            Se enviarán {{ totalCambiosReales }} cambio(s) al REST API
          </div>
        </v-card>

        <!-- Información básica -->
        <div class="d-flex flex-column gap-3">
          <div class="d-flex align-center justify-space-between">
            <span>Actividades originales:</span>
            <strong>{{ datosOriginalesStore.length }}</strong>
          </div>
          <div class="d-flex align-center justify-space-between">
            <span>Actividades a enviar:</span>
            <strong class="text-green">{{ tableDataStore.length }}</strong>
          </div>
          <div class="d-flex align-center justify-space-between">
            <span>Total de cambios:</span>
            <strong class="text-orange">{{ totalCambiosReales }}</strong>
          </div>
          <v-divider></v-divider>
          <div class="d-flex align-center justify-space-between">
            <span>Presupuesto total:</span>
            <strong>{{ totalPresupuestoFormateado }}</strong>
          </div>
          <div class="d-flex align-center justify-space-between">
            <span>Actividades planificadas:</span>
            <strong>{{ actividadesPlanificadas }}</strong>
          </div>
          <div class="d-flex align-center justify-space-between">
            <span>Usuario:</span>
            <strong>{{ usuarioActualInfo.usuario }} (ID: {{ usuarioActualInfo.id }})</strong>
          </div>
        </div>

        <!-- Vista rápida de cambios -->
        <v-expansion-panels variant="accordion" class="mt-4">
          <v-expansion-panel>
            <v-expansion-panel-title>
              <template v-slot:default="{ expanded }">
                <v-row no-gutters>
                  <v-col cols="4" class="d-flex align-center">
                    <v-icon size="small" class="mr-2">mdi-history</v-icon>
                    <span>Ver cambios detallados</span>
                  </v-col>
                  <v-col cols="8" class="text--secondary">
                    <v-fade-transition leave-absolute>
                      <span v-if="expanded" key="0" class="text-caption">Ocultar detalles</span>
                      <span v-else key="1" class="text-caption"
                        >{{ totalCambiosReales }} cambios</span
                      >
                    </v-fade-transition>
                  </v-col>
                </v-row>
              </template>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <div class="d-flex flex-column gap-2" style="max-height: 300px; overflow-y: auto">
                <div v-for="(lista, propiedad) in cambiosPorPropiedadDetallados" :key="propiedad">
                  <div v-if="lista.length > 0" class="mb-2">
                    <div class="text-caption font-weight-bold mb-1 text-capitalize">
                      {{ propiedad.replace('_', ' ') }} ({{ lista.length }})
                    </div>
                    <div class="d-flex flex-column gap-1 ml-3">
                      <div
                        v-for="cambio in lista"
                        :key="`${cambio.fila}-${cambio.fecha}`"
                        class="d-flex align-center pa-2 rounded"
                        style="background-color: rgba(var(--v-theme-primary), 0.05)"
                      >
                        <div class="text-caption">{{ cambio.actividad_nombre }}</div>
                        <v-spacer></v-spacer>
                        <div class="text-caption text-medium-emphasis">
                          {{ cambio.anterior || 'Vacío' }} → {{ cambio.nuevo || 'Vacío' }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>

      <v-divider></v-divider>
      <v-card-actions class="pa-3">
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="mostrandoPreEnvio = false" class="mr-2">Cancelar</v-btn>
        <v-btn color="primary" @click="confirmarEnvio" :loading="enviando">
          <v-icon start>mdi-check</v-icon>
          Confirmar Envío
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
//Hottable
import HotTable from '@handsontable/vue3'
import { registerAllModules } from 'handsontable/registry'
import { registerLanguageDictionary } from 'handsontable/i18n'
import { esMX } from 'handsontable/i18n'
import 'handsontable/dist/handsontable.full.css'
//Vue
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
//Composables
import { useActividad } from '../../proyecto/composables/useActividad'
import { useUsuario } from '@/modules/usuarios/composables/useUsuario'
import { usePlanificacion } from '../composables/usePlanificacion'
import { useTareaSubactividad } from '@/modules/proyecto/composables/useTareaSubactividad'
import { useSeguimientoPlanificacion } from '../composables/useSeguimientoPlanificacion'
//Precargas
import ComponentPresupuesto from './parciales/ComponentPresupuesto.vue'
//Estructuras
import SeleccionEstructuraPei from './parciales/SeleccionEstructuraPei.vue'
import SeleccionEstructuraActividad from './parciales/SeleccionEstructuraActividad.vue'
//Stores
import { useProyectoStore } from '@/modules/proyecto/store/proyectoStore'
import { usePlanificacionStore } from '../store/usePlanificacionStore'
//Encabezados
import SeleccionEstructuraProyecto from './parciales/SeleccionEstructuraProyecto.vue'
import ActividadRelacionEstructura from './parciales/ActividadRelacionEstructura.vue'
import DialogTarea from '@/modules/actividades/components/DialogTarea.vue'
import ListaTareasActividad from './parciales/ListaTareasActividad.vue'
//Utilitarios
import { useSnackbar } from '@/composables/useSnackbar'
import { useUserStore } from '@/stores/user'
import { getActivityIcon } from '../utils/actividadIconColors'
import { formatCurrency, formatDate } from '../utils/formattersPlan'
import {
  getChangeHandlers,
  registroCambios,
} from '@/modules/planificacionpeixls/utils/changeHandlers'

// Props del componente
const props = defineProps({
  proyecto: {
    type: Object,
    required: true,
  },
  proyectoEstructura: {
    type: Object,
    required: true,
  },
  cargando: {
    type: Boolean,
    default: true,
  },
})

// Registros
registerAllModules()
registerLanguageDictionary(esMX)

//ID del proyecto
const route = useRoute()
const idproyecto = route.params.id

//Stores
const storePlanificacion = usePlanificacionStore()
const userStore = useUserStore()

//Composables
const { successMsg, errorMsg, infoMsg } = useSnackbar()
const { crearUnaTarea } = useTareaSubactividad()
const { actualizarPlanificacionProyecto } = useSeguimientoPlanificacion()

/************************* CONTROL DE LA INTERFAZ *******************************/
//Agregar nueva actividad
const mostrarModalActividad = ref(false)
const abrirNuevaActividad = () => {
  mostrarModalActividad.value = true
}
const cerrarNuevaActividad = () => {
  mostrarModalActividad.value = false
}

//Rutina para Agregar Nueva Actividad a la grilla
const crearActividadPlan = (actividad) => {
  console.log('Estructura procedencia: ', actividad)
  cargar()
  cerrarNuevaActividad()
}

//AGREGAR Nueva Tarea
const mostrarDialogo = ref(false)
const tareaSeleccionada = ref(null)
const mostrarModalAgregarTarea = () => {
  mostrarDialogo.value = true
}

const cerrarDialogo = () => {
  mostrarDialogo.value = false
}
const crearNuevaTarea = async (payload) => {
  try {
    await crearUnaTarea(payload)
    mostrarDialogo.value = false
    successMsg('Subactividad Creada')
  } catch (err) {
    console.error(err)
    errorMsg('Error al crear la SubActividad')
  }
}

//AGREGAR PROCEDENCIA DE FONDOS - DESGLOSE
const mostrarPresupuesto = ref(false)
const mostrarModalPresupuesto = () => {
  mostrarPresupuesto.value = true
}
//Agregar el desglose del presupuesto a la grilla
const guardarDesglosePresupuesto = (nuevoDesglose) => {
  if (selectedRowData.value) {
    const rowIndex = tableData.value.findIndex((row) => row.id === selectedRowData.value.id)

    if (rowIndex !== -1) {
      const updatedTableData = [...tableData.value]

      updatedTableData[rowIndex] = {
        ...updatedTableData[rowIndex],
        procedencia_fondos: Array.isArray(nuevoDesglose) ? [...nuevoDesglose] : nuevoDesglose,
      }

      tableData.value = updatedTableData

      if (hotTable.value?.hotInstance) {
        hotTable.value.hotInstance.setDataAtCell(rowIndex, 10, nuevoDesglose)
        hotTable.value.hotInstance.render()
        hotTable.value.hotInstance.deselectCell()
      }
    }
  }

  mostrarPresupuesto.value = false
  successMsg('Desglose de presupuesto guardado correctamente')
}

//AGREGAR PEI
const modalPei = ref(false)
const objetivoInicialId = ref(null)
const indicadorInicialId = ref(null)
const abrirModalPei = () => {
  if (selectedRowData.value) {
    objetivoInicialId.value = selectedRowData.value.objetivo_pei
    indicadorInicialId.value = selectedRowData.value.indicador_pei
  }
  modalPei.value = true
}
// Manejar la selección de PEI
// Manejar la selección de PEI
const manejarSeleccionPei = (datosPei) => {
  if (selectedRowData.value) {
    const rowIndex = tableData.value.findIndex((row) => row.id === selectedRowData.value.id)

    if (rowIndex !== -1) {
      // 1. Guardar valores ANTIGUOS antes de actualizar
      const valoresAntiguos = {
        objetivo_pei: tableData.value[rowIndex].objetivo_pei,
        indicador_pei: tableData.value[rowIndex].indicador_pei,
        factoresCriticos: tableData.value[rowIndex].factoresCriticos,
      }

      // 2. Actualizar los datos
      tableData.value[rowIndex] = {
        ...tableData.value[rowIndex],
        objetivo_pei: datosPei.objetivo_pei,
        indicador_pei: datosPei.indicador_pei,
        factoresCriticos: datosPei.factoresCriticos,
      }

      // 3. Verificar cambios y activar bandera
      let hayCambios = false

      // Verificar objetivo_pei
      if (valoresAntiguos.objetivo_pei !== datosPei.objetivo_pei) {
        registroCambios.registrar(
          'objetivo_pei',
          rowIndex,
          valoresAntiguos.objetivo_pei,
          datosPei.objetivo_pei,
          selectedRowData.value.id,
          selectedRowData.value.nombreCorto,
        )
        hayCambios = true
        console.log('✅ Cambio detectado en objetivo_pei')
      }

      // Verificar indicador_pei
      if (valoresAntiguos.indicador_pei !== datosPei.indicador_pei) {
        registroCambios.registrar(
          'indicador_pei',
          rowIndex,
          valoresAntiguos.indicador_pei,
          datosPei.indicador_pei,
          selectedRowData.value.id,
          selectedRowData.value.nombreCorto,
        )
        hayCambios = true
        console.log('✅ Cambio detectado en indicador_pei')
      }

      // Verificar factoresCriticos (comparar como JSON porque es un array/objeto)
      const oldFactoresStr = JSON.stringify(valoresAntiguos.factoresCriticos || [])
      const newFactoresStr = JSON.stringify(datosPei.factoresCriticos || [])
      if (oldFactoresStr !== newFactoresStr) {
        registroCambios.registrar(
          'factoresCriticos',
          rowIndex,
          valoresAntiguos.factoresCriticos,
          datosPei.factoresCriticos,
          selectedRowData.value.id,
          selectedRowData.value.nombreCorto,
        )
        hayCambios = true
        console.log('✅ Cambio detectado en factoresCriticos')
      }

      // 4. Activar la bandera de cambios si hubo algún cambio
      if (hayCambios) {
        storePlanificacion.setTieneCambiosSinGuardar(true)
        console.log('🚩 Bandera de cambios activada en store')
      }

      // 5. Actualizar la tabla visualmente
      if (hotTable.value?.hotInstance) {
        hotTable.value.hotInstance.render()
      }

      successMsg('Estructura PEI actualizada correctamente')
    }
  }

  modalPei.value = false
}

/************************* PRE-ENVÍO (EXACTAMENTE COMO EL PEI) *******************************/
const mostrandoPreEnvio = ref(false)
const enviando = ref(false)

// Información del usuario
const usuarioActualInfo = computed(() => ({
  id: userStore.id || null,
  usuario: userStore.usuario || 'Invitado',
}))

// Datos del store
const datosOriginalesStore = computed(() => {
  return storePlanificacion.datosOriginales || []
})

const tableDataStore = computed(() => {
  return storePlanificacion.tableData || []
})

// Información de cambios
const cambiosData = computed(() => {
  return registroCambios.obtenerJSON()
})

const totalCambiosReales = computed(() => {
  const detalles = cambiosData.value?.detalles || {}
  let total = 0
  Object.values(detalles).forEach((lista) => {
    if (Array.isArray(lista)) {
      total += lista.length
    }
  })
  return total
})

const cambiosPorPropiedadDetallados = computed(() => {
  return cambiosData.value?.detalles || {}
})

// Cálculos para el seguimiento
const totalPresupuesto = computed(() => {
  if (!tableDataStore.value.length) return 0
  return tableDataStore.value.reduce((total, actividad) => {
    const presupuesto = parseFloat(actividad.presupuesto) || 0
    return total + presupuesto
  }, 0)
})

const totalPresupuestoFormateado = computed(() => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'BOB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(totalPresupuesto.value)
})

const actividadesPlanificadas = computed(() => {
  if (!tableDataStore.value.length) return 0
  return tableDataStore.value.filter(
    (actividad) => actividad.estado === 'PLAN' || actividad.gradoEjecucion === 'PLANIFICADA',
  ).length
})

// Mostrar pre-envío
const mostrarPreEnvio = () => {
  if (totalCambiosReales.value === 0) {
    infoMsg('No hay cambios para enviar')
    return
  }
  mostrandoPreEnvio.value = true
}

// Confirmar envío
const confirmarEnvio = async () => {
  enviando.value = true
  try {
    // Construir el payload en el formato requerido para proyectos
    const payload = {
      actividades: tableDataStore.value,
      seguimiento: {
        datos_tabla_actual: datosOriginalesStore.value,
        datos_tabla_actualizado: tableDataStore.value,
        cambios_efectuados: cambiosData.value || {},
        configuracion: {}, //configuracion de la tabla
        total_actividades: tableDataStore.value.length,
        total_presupuesto: totalPresupuesto.value,
        actividades_planificadas: actividadesPlanificadas.value,
        proyecto: props.proyecto.id,
        creado_por: usuarioActualInfo.value.id,
        actualizado_por: usuarioActualInfo.value.id,
      },
    }

    console.log('PAYLOAD PARA Actualiza planificacion PROYECTO: ', payload)

    // Llamar a la API para guardar
    const resp = await actualizarPlanificacionProyecto(payload)
    console.log('Respuesta guardado proyecto: ', resp)

    successMsg(`Se han enviado ${totalCambiosReales.value} cambios correctamente`)

    // Limpiar cambios después del envío exitoso
    registroCambios.limpiar()
    storePlanificacion.setTieneCambiosSinGuardar(false)

    mostrandoPreEnvio.value = false
  } catch (error) {
    console.error('Error al enviar cambios:', error)
    errorMsg('Error al enviar los cambios')
  } finally {
    enviando.value = false
  }
}

/************************* CONTROL DE CAMBIOS ***********************************/
const tieneCambiosSinGuardar = computed(() => storePlanificacion.tieneCambiosSinGuardar)
const guardando = ref(false)

/************************* PANEL EXCEL ******************************************/
const hotTable = ref(null)
const tableData = ref([])
const inicializado = ref(false)
const headers = ref(true)

//Esconder columnas
const hiddenColumnsConfig = computed(() => {
  return {
    columns: [],
  }
})

//Configuracion de columnas
const columns = ref([
  { data: 'id', title: 'Id', type: 'numeric', width: 50, readOnly: true },
  { data: 'codigo', title: 'Código', width: 100 },
  { data: 'nombreCorto', title: 'Nombre', width: 100 },
  {
    data: 'tipo',
    title: 'Tipo de Actividad',
    type: 'dropdown',
    width: 250,
    source: function (query, process) {
      const tipos = storePlanificacion.listaTiposAct
      const siglas = tipos ? tipos.map((t) => t.sigla + ' - ' + t.tipo_actividad) : []
      process(siglas)
    },
  },
  {
    data: 'responsable',
    title: 'Responsable',
    type: 'dropdown',
    width: 110,
    source: function (query, process) {
      const usernames = storePlanificacion.listaUsuariosCompleta
        .filter((user) => user.is_active !== false)
        .map((user) => user.username)
        .filter((username) => username)
        .sort()

      if (query) {
        const filtered = usernames.filter((username) =>
          username.toLowerCase().includes(query.toLowerCase()),
        )
        process(filtered)
      } else {
        process(usernames)
      }
    },
  },
  {
    data: 'fecha_inicio',
    title: 'Inicio',
    type: 'date',
    width: 100,
    dateFormat: 'YYYY-MM-DD',
  },
  {
    data: 'fecha_cierre',
    title: 'Cierre',
    type: 'date',
    width: 100,
    dateFormat: 'YYYY-MM-DD',
  },
  { data: 'supuestos', title: 'Supuestos', width: 100 },
  { data: 'riesgos', title: 'Riesgos', width: 100 },
  {
    data: 'presupuesto',
    title: 'Presupuesto',
    width: 100,
    type: 'numeric',
    numericFormat: {
      pattern: '0,0.00',
    },
  },
  { data: 'procedencia_fondos', title: 'Proc. Fondos' },
  {
    data: 'presupuestoGlobal',
    title: 'Presupuesto Global',
    type: 'numeric',
    width: 110,
    numericFormat: {
      pattern: '0,0.00',
    },
  },
  {
    data: 'totalReportado',
    title: 'Total Reportado',
    type: 'numeric',
    readOnly: true,
    width: 100,
    numericFormat: {
      pattern: '0,0.00',
    },
  },
  {
    data: 'totalEjecutado',
    title: 'Total Ejecutado',
    type: 'numeric',
    width: 100,
    numericFormat: {
      pattern: '0,0.00',
    },
  },
  {
    data: 'saldo',
    title: 'Saldo',
    type: 'numeric',
    width: 100,
    numericFormat: {
      pattern: '0,0.00',
    },
  },
  {
    data: 'estado',
    type: 'text',
    title: 'ESTADO',
    width: 120,
    readOnly: true,
  },
  {
    data: 'gradoEjecucion',
    type: 'dropdown',
    title: 'Grado Ejecucion',
    readOnly: true,
    width: 120,
    source: [
      'PLANIFICADA',
      'RETRASO',
      'REPROGRAMACION',
      'EN EJECUCION',
      'EN REPORTE',
      'FINALIZADO',
    ],
  },
  {
    data: 'objetivo_pei',
    title: 'Objetivo PEI',
    type: 'numeric',
    readOnly: true,
  },
  {
    data: 'indicador_pei',
    title: 'Indicador PEI',
    type: 'numeric',
    readOnly: true,
  },
  {
    data: 'factoresCriticos',
    title: 'Factores criticos',
    readOnly: true,
    width: 150,
  },
])

/************************* Handle Interfaz Excel  *******************************/
const selectedRowData = ref(null)

// Manejador de cambios
const handleChange = (changes, source) => {
  if (source === 'loadData') return

  const handlers = getChangeHandlers(
    {
      marcarCambios: (valor) => storePlanificacion.setTieneCambiosSinGuardar(valor),
      mensajeExito: successMsg,
      mensajeError: errorMsg,
      mensajeInfo: infoMsg,
    },
    tableData.value,
    hotTable.value?.hotInstance,
  )

  changes.forEach(([row, prop, oldValue, newValue]) => {
    if (handlers[prop]) {
      handlers[prop](row, oldValue, newValue)
    }
  })
}

//Manejador de seleccion
const handleSelection = (startRow, startCol, endRow, endCol, selectionLayer) => {
  if (startRow === endRow) {
    const rowData = hotTable.value.hotInstance.getDataAtRow(startRow)
    const rowObject = {}
    columns.value.forEach((col, index) => {
      if (col.data) {
        rowObject[col.data] = rowData[index]
      }
    })
    selectedRowData.value = rowObject
  } else {
    selectedRowData.value = null
  }
}

/************************* SIDE PANEL *******************************************/
const sidePanelVisible = ref(false)
const toogleSidePanel = async () => {
  sidePanelVisible.value = !sidePanelVisible.value
}

/************************** Exportar  *********************************************/
const exportarExcel = async () => {
  alert('Exportar a excel')
}

/********************* CARGA DE DATOS ******************************/
const isLoading = ref(false)
const err = ref(null)

const cargar = async () => {
  isLoading.value = true
  try {
    await Promise.all([
      storePlanificacion.obtenerListaUsuarios(),
      storePlanificacion.listaTiposDeActividad(),
      storePlanificacion.listaActividadesProyecto(idproyecto),
    ])

    console.log('ACTIVIDADES: ', storePlanificacion.listaActividades)
    console.log('Numero de Act: ', storePlanificacion.listaActividades.length)

    if (storePlanificacion.tableData && storePlanificacion.tableData.length > 0) {
      storePlanificacion.inicializarDatosOriginales(storePlanificacion.tableData)
      tableData.value = storePlanificacion.tableData
      successMsg(storePlanificacion.tableData.length + ' Actividades Cargadas')
    }

    inicializado.value = true
  } catch (e) {
    console.error('Error al cargar:', e)
    err.value = e
    errorMsg('Error al cargar actividades')
  } finally {
    isLoading.value = false
  }
}

//Hook
onMounted(() => {
  cargar()
})

/************************ MENU CONTEXTUAL *******************************/
const contextMenuConfig = computed(() => {
  const menuItems = ['---------']

  const customItems = [
    {
      key: 'subactividad',
      name: '📋 Agregar Subactividad',
      callback: () => {
        const selected = hotTable.value?.hotInstance?.getSelected()
        if (selected && selected.length > 0) {
          mostrarModalAgregarTarea()
        }
      },
      disabled: () => !selectedRowData.value,
      hidden: () => !selectedRowData.value,
    },
    {
      key: 'presupuesto',
      name: '💰 Ajustar Presupuesto',
      callback: () => {
        if (selectedRowData.value) {
          mostrarModalPresupuesto()
        }
      },
      disabled: () => !selectedRowData.value,
    },
    {
      key: 'pei',
      name: '📊 Relación PEI',
      callback: () => {
        if (selectedRowData.value) {
          abrirModalPei()
        }
      },
      disabled: () => !selectedRowData.value,
    },
  ]

  const finalItems = [
    ...menuItems,
    ...customItems,
    '---------',
    {
      key: 'exportar_excel',
      name: '📤 Exportar a Excel',
      callback: () => exportarExcel(),
    },
    {
      key: 'guardar_cambios',
      name: () =>
        tieneCambiosSinGuardar.value ? '💾 Guardar Cambios' : '💾 Guardar (sin cambios)',
      callback: () => mostrarPreEnvio(),
      disabled: () => false,
    },
  ]

  return finalItems
})
</script>

<style scoped>
/* Estilos (igual que antes) */
.flow-container {
  width: 100%;
  height: 1000px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.vue-flow {
  width: 100%;
  height: 100%;
}

.hot-wrapper {
  margin: 16px 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: calc(100vh - 150px);
  min-height: 1000px;
}

.content-wrapper {
  display: flex;
  gap: 16px;
  height: calc(100vh - 150px);
  min-height: 700;
}

.excel-panel {
  flex: 3;
  min-width: 0;
  display: flex;
  flex-direction: column;
  height: 300%;
}

.side-panel {
  flex: 1;
  min-width: 300px;
  max-width: 400px;
}

/********* toolbar de actividad *********/
.excel-style-toolbar {
  background: linear-gradient(to bottom, #f3f3f3 0%, #e6e6e6 100%) !important;
  border: 1px solid #d0d0d0 !important;
  border-radius: 3px !important;
  padding: 4px 8px !important;
  min-height: 36px !important;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
}

.excel-info-container.horizontal-layout {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: nowrap;
  overflow-x: auto;
  padding: 2px 0;
}

.horizontal-item {
  display: flex;
  align-items: center;
  padding: 4px 12px;
  background: white;
  border: 1px solid #d0d0d0;
  border-radius: 4px;
  min-height: 28px;
  flex-shrink: 0;
  white-space: nowrap;
}

.info-text.excel-info-text {
  font-size: 12px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  display: flex;
  align-items: center;
  gap: 4px;
}

.excel-label {
  color: #605e5c;
  font-weight: 600;
}

.excel-value {
  color: #323130;
  font-weight: 400;
}

.excel-code {
  color: #0078d4;
  font-weight: 600;
}

.budget-value {
  color: #107c10;
  font-weight: 600;
}

.horizontal-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.excel-button {
  min-width: auto !important;
  height: 28px !important;
  padding: 0 12px !important;
  font-size: 11px !important;
  font-weight: 600 !important;
  text-transform: none !important;
  letter-spacing: 0 !important;
  border: 1px solid rgba(0, 0, 0, 0.15) !important;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1) !important;
}

.excel-button:hover {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2) !important;
  transform: translateY(-1px);
}

.excel-button :deep(.v-btn__content) {
  gap: 4px !important;
}

.excel-button :deep(.v-icon) {
  margin-right: 4px !important;
  margin-left: -2px !important;
}

.budget-button {
  background: linear-gradient(to bottom, #0078d4 0%, #106ebe 100%) !important;
  color: white !important;
}

.budget-button:hover {
  background: linear-gradient(to bottom, #106ebe 0%, #005a9e 100%) !important;
}

.pei-button {
  background: linear-gradient(to bottom, #107c10 0%, #0e6c0e 100%) !important;
  color: white !important;
}

.pei-button:hover {
  background: linear-gradient(to bottom, #0e6c0e 0%, #0d5c0d 100%) !important;
}

.icon-container {
  position: relative;
  display: inline-flex;
}

.changes-dot {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  background-color: #ff4757;
  border-radius: 50%;
  animation: pulse 2s infinite;
  box-shadow: 0 0 0 rgba(255, 71, 87, 0.4);
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(255, 71, 87, 0.7);
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 4px rgba(255, 71, 87, 0);
  }

  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(255, 71, 87, 0);
  }
}

.toolbar-btn.v-btn--disabled .changes-dot {
  background-color: #ccc;
  animation: none;
}
</style>
