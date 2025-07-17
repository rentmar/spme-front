<template>
  <v-container class="pei-container">
    <!-- Overlay de carga -->
    <v-overlay :model-value="cargando" class="align-center justify-center" persistent opacity="0.8">
      <div class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
          width="6"
        ></v-progress-circular>
        <p class="mt-4 text-h6">Cargando información del PEI...</p>
      </div>
    </v-overlay>

    <!-- CONTENIDO PRINCIPAL -->
    <template v-if="!cargando && peiCompleto && peiObjetivosIndicadores">
      <v-row>
        <v-col cols="12">
          <PaginaTituloIcono :titulo="'ESTRUCTURA DEL PEI'" :icon="'mdi-file-chart'" />
          <PeiHeader :pei="peiCompleto" />

          <!-- Marco Lógico -->
          <v-card variant="outlined" class="mb-4">
            <v-toolbar color="primary" density="compact">
              <v-toolbar-title>ESTRUCTURA DEL PEI</v-toolbar-title>
              <v-spacer></v-spacer>

              <v-tooltip text="Agregar Nuevo Objetivo PEI" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    icon
                    color="black"
                    size="large"
                    class="mx-1"
                    @click="dialogNuevoObjetivo = true"
                    :disabled="cargandoAccion"
                  >
                    <v-icon>mdi-bullseye-arrow</v-icon>
                  </v-btn>
                </template>
              </v-tooltip>
            </v-toolbar>

            <v-card-text>
              <div class="table-responsive">
                <v-table class="marco-logico-table">
                  <thead>
                    <tr>
                      <th>OBJETIVO PEI</th>
                      <th>INDICADORES PEI</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="objetivo in peiObjetivosIndicadores.objetivos"
                      :key="`oe-${objetivo.id}`"
                    >
                      <!-- Objetivo PEI -->
                      <td>
                        <div class="d-flex align-center">
                          <v-chip size="small" color="primary" class="mr-2">
                            {{ objetivo.codigo }}
                          </v-chip>
                          <strong>{{ objetivo.descripcion }}</strong>
                        </div>
                        <div class="d-flex mt-2">
                          <v-btn
                            icon
                            size="small"
                            color="primary"
                            @click.stop="editarObjetivo(objetivo)"
                            :loading="cargandoEdicion"
                          >
                            <v-icon>mdi-pencil</v-icon>
                          </v-btn>
                          <v-btn
                            icon
                            size="small"
                            color="error"
                            @click.stop="solicitarEliminarObjetivo(objetivo)"
                            class="ml-1"
                            :loading="cargandoEliminacion"
                          >
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </div>
                      </td>

                      <!-- Indicadores PEI -->
                      <td>
                        <template v-if="objetivo.indicadores?.length">
                          <div class="indicadores-container">
                            <v-list lines="two" class="pa-0">
                              <template
                                v-for="(indicador, indIndex) in objetivo.indicadores"
                                :key="indicador.id"
                              >
                                <v-list-item
                                  :class="getIndicadorColorClass(indicador.tipo)"
                                  class="mb-2 indicador-item"
                                >
                                  <template v-slot:prepend>
                                    <v-chip
                                      size="small"
                                      :color="getIndicadorColor(indicador.tipo)"
                                      class="mr-2"
                                    >
                                      {{ indicador.codigo }}
                                    </v-chip>
                                  </template>

                                  <v-list-item-title class="font-weight-bold">
                                    {{ indicador.descripcion }}
                                  </v-list-item-title>

                                  <v-list-item-subtitle>
                                    <div v-if="indicador.tipo === 'Proporcion'">
                                      <span
                                        >Fórmula: {{ indicador.numerador }} /
                                        {{ indicador.denominador }}</span
                                      >
                                    </div>
                                    <div v-else>
                                      <span
                                        >Señales de avance: {{ indicador.umbral_des_literal_um1 }},
                                        {{ indicador.umbral_des_literal_um2 }}</span
                                      >
                                    </div>
                                    <div>Frecuencia: {{ indicador.frecuencia_recopilacion }}</div>
                                  </v-list-item-subtitle>

                                  <template v-slot:append>
                                    <v-btn
                                      icon
                                      size="x-small"
                                      color="error"
                                      @click.stop="
                                        confirmarEliminarIndicador(
                                          objetivo.id,
                                          indicador.id,
                                          indicador.codigo,
                                        )
                                      "
                                      :loading="cargandoEliminacionIndicador"
                                    >
                                      <v-icon>mdi-delete</v-icon>
                                    </v-btn>
                                  </template>
                                </v-list-item>
                                <v-divider
                                  v-if="indIndex < objetivo.indicadores.length - 1"
                                ></v-divider>
                              </template>
                            </v-list>
                          </div>
                        </template>

                        <v-btn
                          size="x-small"
                          color="info"
                          variant="text"
                          @click.stop="abrirModalIndicador(objetivo.id)"
                          class="mt-1"
                          :loading="cargandoAccion"
                        >
                          <v-icon left>mdi-plus</v-icon>Agregar indicador
                        </v-btn>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- MODALES -->
      <v-dialog v-model="dialogNuevoObjetivo" max-width="800" persistent>
        <v-card>
          <v-card-title>Agregar Objetivo Estratégico</v-card-title>
          <v-card-text>
            <v-text-field
              variant="outlined"
              v-model="nuevoObjetivo.codigo"
              label="Código"
              required
              :disabled="cargandoAccion"
            ></v-text-field>
            <v-textarea
              variant="outlined"
              v-model="nuevoObjetivo.descripcion"
              label="Descripción"
              rows="3"
              :disabled="cargandoAccion"
            ></v-textarea>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn color="grey" @click="dialogNuevoObjetivo = false">Cancelar</v-btn>
            <v-btn color="primary" @click="agregarObjetivo" :loading="cargandoAccion">
              Guardar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogoEditObjetivo" max-width="800" persistent>
        <v-card>
          <v-card-title>Editar Objetivo Estratégico</v-card-title>
          <v-card-text>
            <v-text-field
              variant="outlined"
              v-model="objetivo.codigo"
              label="Código"
              required
              :disabled="cargandoAccion"
            ></v-text-field>
            <v-textarea
              variant="outlined"
              v-model="objetivo.descripcion"
              label="Descripción"
              rows="3"
              :disabled="cargandoAccion"
            ></v-textarea>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn color="grey" @click="dialogoEditObjetivo = false">Cancelar</v-btn>
            <v-btn color="primary" @click="actualizarObjetivo" :loading="cargandoAccion">
              Actualizar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogNuevoIndicador" max-width="600" persistent>
        <v-card>
          <v-card-title>Agregar Indicador</v-card-title>
          <v-card-text>
            <v-select
              variant="outlined"
              v-model="nuevoIndicador.tipo"
              :items="tiposIndicadores"
              label="Tipo de indicador"
              @update:modelValue="cambiarTipoIndicador"
            ></v-select>

            <template v-if="nuevoIndicador.tipo === 'Avance'">
              <v-text-field
                v-model="nuevoIndicadorCualitativo.codigo"
                variant="outlined"
                label="Codigo"
                clearable
                hint="Ingrese el codigo del indicador"
              ></v-text-field>
              <v-textarea
                v-model="nuevoIndicadorCualitativo.descripcion"
                variant="outlined"
                label="Indicador"
                rows="4"
                clearable
                hint="Redaccion del indicador"
              ></v-textarea>
              <v-textarea
                v-model="nuevoIndicadorCualitativo.uso_informacion"
                variant="outlined"
                label="Mecanismo de Captura de Informacion"
                clearable
              />
              <v-textarea
                v-model="nuevoIndicadorCualitativo.umbral_des_literal_um1"
                variant="outlined"
                label="Umbral de desempeño (0-40)"
                rows="4"
                clearable
              />
              <v-textarea
                v-model="nuevoIndicadorCualitativo.umbral_des_literal_um2"
                variant="outlined"
                label="Umbral de desempeño (41-70)"
                rows="4"
                clearable
              />
              <v-textarea
                v-model="nuevoIndicadorCualitativo.umbral_des_literal_um3"
                variant="outlined"
                label="Umbral de desempeño (>71)"
                rows="4"
                clearable
              />
            </template>

            <template v-else>
              <v-text-field
                v-model="nuevoIndicadorCuantitativo.codigo"
                variant="outlined"
                label="Codigo"
                clearable
                hint="Ingrese el codigo del indicador"
              ></v-text-field>
              <v-textarea
                v-model="nuevoIndicadorCuantitativo.descripcion"
                variant="outlined"
                label="Indicador"
                rows="4"
                clearable
                hint="Redaccion del indicador"
              >
              </v-textarea>
              <v-textarea
                v-model="nuevoIndicadorCuantitativo.numerador"
                variant="outlined"
                label="Numerador"
                rows="4"
                clearable
              >
              </v-textarea>
              <v-textarea
                v-model="nuevoIndicadorCuantitativo.denominador"
                variant="outlined"
                label="Denominador"
                rows="4"
                clearable
              />
              <v-text-field
                v-model="nuevoIndicadorCuantitativo.umbral_des_numeral"
                variant="outlined"
                label="Umbral numerico"
                type="number"
              ></v-text-field>
              <v-textarea
                v-model="nuevoIndicadorCuantitativo.umbral_des_literal_um1"
                variant="outlined"
                label="Umbral de desempeño (0-40)"
                rows="4"
                clearable
              />
              <v-textarea
                v-model="nuevoIndicadorCuantitativo.umbral_des_literal_um2"
                variant="outlined"
                label="Umbral de desempeño (41-70)"
                rows="4"
                clearable
              />
              <v-textarea
                v-model="nuevoIndicadorCuantitativo.umbral_des_literal_um3"
                variant="outlined"
                label="Umbral de desempeño (>71)"
                rows="4"
                clearable
              />
              <v-text-field
                v-model="nuevoIndicadorCuantitativo.frecuencia_recopilacion"
                variant="outlined"
                label="Frecuencia de recopilacion de datos"
                clearable
              ></v-text-field>
              <v-textarea
                v-model="nuevoIndicadorCuantitativo.uso_informacion"
                variant="outlined"
                label="Mecanismo de Captura de Informacion"
                clearable
              />
            </template>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" @click="dialogNuevoIndicador = false"> Cancelar </v-btn>
            <v-btn color="green" @click="agregarIndicador()"> Guardar </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Modal de confirmación - Eliminar indicador -->
      <v-dialog v-model="dialogConfirmarEliminacion" max-width="500" persistent>
        <v-card>
          <v-card-title class="bg-error text-white">
            <v-icon icon="mdi-alert-circle" class="mr-2"></v-icon>
            Confirmar eliminación
          </v-card-title>
          <v-card-text class="pt-4">
            <p class="text-body-1">
              ¿Está seguro que desea eliminar el indicador
              <strong>{{ indicadorAEliminar.codigo }}</strong
              >?
            </p>
            <p class="text-caption text-medium-emphasis mt-2">Esta acción no se puede deshacer.</p>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn
              color="grey"
              @click="dialogConfirmarEliminacion = false"
              :disabled="cargandoEliminacionIndicador"
            >
              Cancelar
            </v-btn>
            <v-btn color="error" @click="eliminarIndicador" :loading="cargandoEliminacionIndicador">
              Eliminar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <ConfirmDialog></ConfirmDialog>
    </template>

    <v-alert v-if="errorPei && !cargando" type="error" variant="tonal" class="mt-4">
      No se pudo cargar la información del PEI. Por favor intente nuevamente.
    </v-alert>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'
import PeiHeader from '@/modules/pei/components/partials/PeiHeader.vue'
import { usePeiStore } from '@/modules/pei/store/peiStore'
import { useSnackbar } from '@/composables/useSnackbar'
import { indicadorPeiServicios, objetivoPeiServicios } from '@/modules/pei/services/peiService'
//Importar cuadro de dialogo y su composable
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import ConfirmDialog from '@/components/layout/partials/ConfirmDialog.vue'

//Cuadro de dialogo para confirmacion
const { openConfirmDialog } = useConfirmDialog()

//Mensajes de confirmacion de accion exito/Error
const { successMsg, errorMsg } = useSnackbar()

const router = useRoute()
const peiID = router.params.id
const peiStore = usePeiStore()

// Configuración
const tiposIndicadores = [
  { title: 'Cuantitativo (Proporción)', value: 'Proporcion' },
  { title: 'Cualitativo (Avance)', value: 'Avance' },
]

// Estados
const cargando = ref(true)
const cargandoAccion = ref(false)
const cargandoEdicion = ref(false)
const cargandoEliminacion = ref(false)
const cargandoEliminacionIndicador = ref(false)
const dialogNuevoObjetivo = ref(false)
const dialogNuevoIndicador = ref(false)
const dialogConfirmarEliminacion = ref(false)
const dialogoEditObjetivo = ref(false)

// Datos del store
const {
  peiActual: peiCompleto,
  peiObjIndPorId: peiObjetivosIndicadores,
  error: errorPei,
} = storeToRefs(peiStore)
const {
  obtenerPeiPorId,
  obtenerPeiObjInd,
  agregarIndicadorCualitativo,
  agregarIndicadorCuantitativo,
} = peiStore

// Formularios
const nuevoObjetivo = ref({
  codigo: '',
  descripcion: '',
  pei: peiID,
})

const objetivo = ref({
  id: '',
  codigo: '',
  descripcion: '',
  pei: peiID,
})

const nuevoIndicador = ref({
  tipo: 'Proporcion',
  codigo: '',
  descripcion: '',
  numerador: '',
  denominador: '',
  umbral_des_literal_um1: '',
  umbral_des_literal_um2: '',
  frecuencia_recopilacion: '',
  objetivo_id: null,
})

//Nuevo indicador
const nuevoIndicadorCuantitativo = ref({
  codigo: '',
  descripcion: '',
  numerador: '',
  denominador: '',
  umbral_des_numeral: '',
  umbral_des_literal_um1: '',
  umbral_des_literal_um2: '',
  umbral_des_literal_um3: '',
  frecuencia_recopilacion: '',
  tipo: 'Proporcion',
  uso_informacion: '',
  objetivo: '',
})

//Nuevo indicador
const nuevoIndicadorCualitativo = ref({
  codigo: '',
  descripcion: '',
  captura_informacion: '',
  responsabilidad: '',
  frecuencia_recopilacion: '',
  uso_informacion: '',
  umbral_des_literal_um1: '',
  umbral_des_literal_um2: '',
  umbral_des_literal_um3: '',
  tipo: 'Avance',
  objetivo: '',
})

//Estado para eliminar indicadores
const indicadorAEliminar = ref({
  objetivoId: null,
  indicadorId: null,
  codigo: '',
})

//Estado para eliminar objetivos
const objetivoAEliminar = ref({
  id: '',
  codigo: '',
  descripcion: '',
})

// Métodos
const getIndicadorColor = (tipo) => {
  return tipo === 'Proporcion' ? 'indigo' : 'teal'
}

const getIndicadorColorClass = (tipo) => {
  return tipo === 'Proporcion' ? 'indicador-cuantitativo' : 'indicador-cualitativo'
}

const cambiarTipoIndicador = (tipo) => {
  nuevoIndicador.value.tipo = tipo
}

const abrirModalIndicador = (objetivoId) => {
  //Seteo de las varibles de estado y datos
  dialogNuevoIndicador.value = true
  nuevoIndicadorCualitativo.value.objetivo = objetivoId
  nuevoIndicadorCuantitativo.value.objetivo = objetivoId
}

const agregarIndicador = async () => {
  if (nuevoIndicador.value.tipo === 'Avance') {
    const confirmed = await openConfirmDialog({
      title: 'Crear Indicador Cualitativo - Avance',
      message:
        'Desea crear el indicador cualitativo con CODIGO: ' +
        nuevoIndicadorCualitativo.value.codigo +
        '?',
      confirmLabel: 'Crear',
      cancelLabel: 'Cancelar',
      type: 'create',
    })
    if (confirmed) {
      handleCrearIndicadorCualitativo()
    }
  } else if (nuevoIndicador.value.tipo === 'Proporcion') {
    const confirmed = await openConfirmDialog({
      title: 'Crear Indicador Cuantitativo - Proporcion',
      message:
        'Desea crear el indicador cuantitativo con CODIGO: ' +
        nuevoIndicadorCuantitativo.value.codigo +
        '?',
      confirmLabel: 'Crear',
      cancelLabel: 'Cancelar',
      type: 'create',
    })
    if (confirmed) {
      handleCrearIndicadorCuantitativo()
    }
  }
}
const handleCrearIndicadorCualitativo = async () => {
  console.log('Indicador cualitativo creado')
  try {
    cargandoAccion.value = true
    //await indicadorPeiServicios.crearIndCualitativo(nuevoIndicadorCualitativo.value)
    const objId = nuevoIndicadorCualitativo.value.objetivo
    await agregarIndicadorCualitativo(objId, nuevoIndicadorCualitativo.value)

    successMsg('Indicador cualitativo PEI creado')
  } catch (error) {
    console.log('ERROR, crear indicador cualitativo', error)
    errorMsg('ERROR: no se creo el indicador cualitativo correctamente')
  } finally {
    cargandoAccion.value = false
    dialogNuevoIndicador.value = false
  }
}
const handleCrearIndicadorCuantitativo = async () => {
  try {
    cargandoAccion.value = true
    //await indicadorPeiServicios.crearIndCuantitativo(nuevoIndicadorCuantitativo.value)
    const objid = nuevoIndicadorCuantitativo.value.objetivo
    await agregarIndicadorCuantitativo(objid, nuevoIndicadorCuantitativo.value)
    successMsg('Indicador cuantitativo PEI creado')
  } catch (error) {
    console.log('ERROR: no se creo el indicador cuantitativo correctamente', error)
    errorMsg('ERROR: no se creo el indicador cuantitativo correctamente')
  } finally {
    limpiarNuevosIndicadores()
    cargandoAccion.value = false
    dialogNuevoIndicador.value = false
  }
}
const limpiarNuevosIndicadores = () => {
  nuevoIndicador.value = {
    tipo: 'Proporcion',
    codigo: '',
    descripcion: '',
    numerador: '',
    denominador: '',
    umbral_des_literal_um1: '',
    umbral_des_literal_um2: '',
    frecuencia_recopilacion: '',
    objetivo_id: null,
  }
  nuevoIndicadorCuantitativo.value = {
    codigo: '',
    descripcion: '',
    numerador: '',
    denominador: '',
    umbral_des_numeral: '',
    umbral_des_literal_um1: '',
    umbral_des_literal_um2: '',
    umbral_des_literal_um3: '',
    frecuencia_recopilacion: '',
    tipo: 'Proporcion',
    uso_informacion: '',
    objetivo: '',
  }
  nuevoIndicadorCualitativo.value = {
    codigo: '',
    descripcion: '',
    captura_informacion: '',
    responsabilidad: '',
    frecuencia_recopilacion: '',
    uso_informacion: '',
    umbral_des_literal_um1: '',
    umbral_des_literal_um2: '',
    umbral_des_literal_um3: '',
    tipo: 'Avance',
    objetivo: '',
  }
}

//Agregar Objetivo PEI
const agregarObjetivo = async () => {
  try {
    cargandoAccion.value = true
    await objetivoPeiServicios.crear(nuevoObjetivo.value)
    successMsg('Objetivo Pei creado')
    await cargarDatos()
  } catch (error) {
    console.error('No se pudo crear el objetivo', error)
    errorMsg('Fallo, No se creó el Objetivo PEI')
  } finally {
    cargandoAccion.value = false
    dialogNuevoObjetivo.value = false
    nuevoObjetivo.value = { codigo: '', descripcion: '', pei: peiID }
  }
}

const editarObjetivo = (obj) => {
  // nuevoObjetivo.value = {
  //   codigo: objetivo.codigo,
  //   descripcion: objetivo.descripcion,
  //   pei: peiID,
  // }
  objetivo.value.id = obj.id
  objetivo.value.codigo = obj.codigo
  objetivo.value.descripcion = obj.descripcion

  dialogoEditObjetivo.value = true
  // dialogNuevoObjetivo.value = true
}

const actualizarObjetivo = async () => {
  try {
    await objetivoPeiServicios.update(objetivo.value.id, objetivo.value)
    await cargarDatos()
    dialogoEditObjetivo.value = false
  } catch (err) {
    console.error('Error al actualizar', err)
  }
}

//Eliminar objetivos
const solicitarEliminarObjetivo = (objetivo) => {
  objetivoAEliminar.value = {
    id: objetivo.id,
    codigo: objetivo.codigo,
    descripcion: objetivo.descripcion,
  }
  handleDeleteObjetivo()
}
//Confirmacion eliminar Objetivo
async function handleDeleteObjetivo() {
  const confirmed = await openConfirmDialog({
    title: 'Eliminar Objetivo PEi',
    message:
      '¿Seguro que deseas eliminar el Objetivo Pei y todos sus indicadores? Esta acción no se puede deshacer.',
    confirmLabel: 'Eliminar',
    cancelLabel: 'Cancelar',
    type: 'delete',
  })

  if (confirmed) {
    console.log('Eliminado correctamente')
    eliminarObjetivo()
  }
}

const limpiarObjetioAEliminar = () => {
  objetivoAEliminar.value = {
    id: '',
    codigo: '',
    descripcion: '',
  }
}

const eliminarObjetivo = async () => {
  const eliminado = await peiStore.eliminarObjetivo(objetivoAEliminar.value.id)
  if (eliminado) {
    successMsg('Objetivo Eliminado')
    limpiarObjetioAEliminar()
  } else {
    errorMsg('No se elimino el Objetivo')
    limpiarObjetioAEliminar()
  }
}

const confirmarEliminarIndicador = async (objetivoId, indicadorId, codigo) => {
  indicadorAEliminar.value = { objetivoId, indicadorId, codigo }
  const confirmed = await openConfirmDialog({
    title: 'Eliminar Indicador',
    message: 'Desea eliminar el indicador, CODIGO: ' + indicadorAEliminar.value.codigo,
    confirmLabel: 'Eliminar',
    cancelLabel: 'Cancelar',
    type: 'delete',
  })
  if (confirmed) {
    handleEliminarIndicador()
  }
}

const handleEliminarIndicador = async () => {
  try {
    cargandoEliminacionIndicador.value = true
    await indicadorPeiServicios.eliminar(indicadorAEliminar.value.indicadorId)
    successMsg('Indicador eliminado correctamente')
    await cargarDatos()
  } catch (error) {
    console.error('Error al eliminar indicador', error)
    errorMsg('No se pudo eliminar el indicador')
  } finally {
    cargandoEliminacionIndicador.value = false
    dialogConfirmarEliminacion.value = false
    indicadorAEliminar.value = { objetivoId: null, indicadorId: null, codigo: '' }
  }
}

// Carga inicial
const cargarDatos = async () => {
  try {
    cargando.value = true
    await Promise.all([obtenerPeiPorId(peiID), obtenerPeiObjInd(peiID)])
  } catch (error) {
    console.error('Error al cargar datos del PEI', error)
  } finally {
    cargando.value = false
  }
}

onMounted(() => {
  cargarDatos()
})
</script>

<style scoped>
.pei-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 16px;
}

.v-card {
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.marco-logico-table {
  border-collapse: separate;
  border-spacing: 0 8px;
  width: 100%;
}

.marco-logico-table thead th {
  background-color: #f5f5f5;
  position: sticky;
  top: 0;
  z-index: 2;
  font-weight: 600;
  padding: 12px 16px;
}

.indicadores-container {
  max-height: 500px;
  overflow-y: auto;
  padding-right: 8px;
}

.indicador-item {
  border-radius: 6px;
  transition: all 0.2s ease;
}

.indicador-cuantitativo {
  background-color: rgba(67, 160, 71, 0.1);
  border-left: 4px solid #43a047;
}

.indicador-cualitativo {
  background-color: rgba(3, 169, 244, 0.1);
  border-left: 4px solid #03a9f4;
}

.indicador-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

@media (max-width: 960px) {
  .pei-container {
    padding: 16px 12px;
  }

  .marco-logico-table {
    display: block;
    overflow-x: auto;
  }
}
</style>
