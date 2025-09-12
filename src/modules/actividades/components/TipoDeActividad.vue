<template>
  <v-card>
    <v-card-title class="d-flex align-center">
      <v-icon class="mr-2">mdi-clipboard-list</v-icon>
      Administrar Tipos de Actividad
      <v-spacer></v-spacer>

      <!-- Botones de Importar/Exportar -->
      <v-btn color="success" class="mr-2" @click="exportarAExcel">
        <v-icon left>mdi-file-excel</v-icon>
        Exportar
      </v-btn>

      <v-btn color="info" class="mr-2" @click="abrirDialogoImportar">
        <v-icon left>mdi-file-import</v-icon>
        Importar
      </v-btn>

      <v-btn color="primary" @click="abrirDialogoNuevo">
        <v-icon left>mdi-plus</v-icon>
        Nuevo Tipo
      </v-btn>
    </v-card-title>

    <v-card-text>
      <v-text-field
        v-model="busqueda"
        append-icon="mdi-magnify"
        label="Buscar"
        single-line
        hide-details
        class="mb-4"
      ></v-text-field>

      <v-data-table
        :headers="headers"
        :items="tiposActividad"
        :search="busqueda"
        :loading="cargando"
        loading-text="Cargando tipos de actividad..."
        no-data-text="No hay tipos de actividad registrados"
        no-results-text="No se encontraron resultados"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editarTipo(item)" title="Editar"> mdi-pencil </v-icon>
          <v-icon small @click="confirmarEliminacion(item)" title="Eliminar" color="error">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-card-text>

    <!-- Diálogo para crear/editar -->
    <v-dialog v-model="dialogoAbierto" max-width="600px" persistent>
      <v-card>
        <v-card-title>
          <span class="headline">{{ esEdicion ? 'Editar' : 'Nuevo' }} Tipo de Actividad</span>
        </v-card-title>

        <v-card-text>
          <v-form ref="form" v-model="formValido">
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="tipoEditado.sigla"
                  label="Sigla"
                  :rules="[reglas.requerido]"
                  required
                  maxlength="20"
                  counter
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="tipoEditado.tipo_actividad"
                  label="Tipo de Actividad"
                  :rules="[reglas.requerido]"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" text @click="cerrarDialogo">Cancelar</v-btn>
          <v-btn color="primary" :loading="guardando" @click="guardarTipo" :disabled="!formValido">
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo de importación -->
    <v-dialog v-model="dialogoImportarAbierto" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Importar desde Excel</span>
        </v-card-title>

        <v-card-text>
          <v-file-input
            v-model="archivoExcel"
            accept=".xlsx, .xls, .csv"
            label="Seleccionar archivo Excel"
            prepend-icon="mdi-file-excel"
            @change="previsualizarImportacion"
            :show-size="1000"
          ></v-file-input>

          <v-alert v-if="datosImportados.length > 0" type="info" class="mt-3">
            Se encontraron {{ datosImportados.length }} registros para importar
          </v-alert>

          <v-data-table
            v-if="datosImportados.length > 0"
            :headers="headersImportacion"
            :items="datosImportados"
            class="mt-3"
            height="300"
            dense
          >
            <template v-slot:item.estado="{ item }">
              <v-chip small :color="item.estado === 'válido' ? 'success' : 'error'">
                {{ item.estado }}
              </v-chip>
            </template>
          </v-data-table>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" text @click="cerrarDialogoImportar">Cancelar</v-btn>
          <v-btn
            color="primary"
            @click="confirmarImportacion"
            :disabled="datosValidosParaImportar.length === 0"
            :loading="importando"
          >
            Importar ({{ datosValidosParaImportar.length }})
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo de confirmación de eliminación -->
    <v-dialog v-model="dialogoEliminacionAbierto" max-width="400px">
      <v-card>
        <v-card-title class="headline">Confirmar Eliminación</v-card-title>
        <v-card-text>
          ¿Estás seguro de que deseas eliminar el tipo de actividad
          <strong>"{{ tipoAEliminar ? tipoAEliminar.tipo_actividad : '' }}"</strong>?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" text @click="dialogoEliminacionAbierto = false">Cancelar</v-btn>
          <v-btn color="error" text @click="eliminarTipo" :loading="eliminando">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useTipoActividad } from '@/modules/proyecto/composables/useTipoActividad'
import { useSnackbar } from '@/composables/useSnackbar'
import * as XLSX from 'xlsx'

// Estado reactivo
const tiposActividad = ref([])
const cargando = ref(false)
const guardando = ref(false)
const eliminando = ref(false)
const importando = ref(false)
const dialogoAbierto = ref(false)
const dialogoImportarAbierto = ref(false)
const dialogoEliminacionAbierto = ref(false)
const esEdicion = ref(false)
const formValido = ref(false)
const busqueda = ref('')
const form = ref(null)
const archivoExcel = ref(null)
const datosImportados = ref([])
const fileInputRef = ref(null)

//Inicializar composables
const {
  tipoDeActividades,
  cargarListaTiposActividades,
  crearTipoDeActividad,
  updateTipoDeActividad,
  eliminarTipoDeActividad,
} = useTipoActividad()
const { successMsg, warningMsg, errorMsg } = useSnackbar()

const tipoEditado = reactive({
  id: null,
  sigla: '',
  tipo_actividad: '',
})

const tipoAEliminar = ref(null)

// Computed para obtener solo los datos válidos para importar
const datosValidosParaImportar = computed(() => {
  return datosImportados.value.filter((item) => item.valido)
})

// Configuración de la tabla
const headers = [
  { text: 'ID', value: 'id', align: 'start', width: '80px' },
  { text: 'Sigla', value: 'sigla' },
  { text: 'Tipo de Actividad', value: 'tipo_actividad' },
  { text: 'Acciones', value: 'actions', sortable: false, align: 'center', width: '100px' },
]

// Headers para la previsualización de importación
const headersImportacion = [
  { text: 'Sigla', value: 'sigla' },
  { text: 'Tipo de Actividad', value: 'tipo_actividad' },
  { text: 'Estado', value: 'estado', align: 'center' },
]

// Reglas de validación
const reglas = {
  requerido: (value) => !!value || 'Este campo es requerido',
}

// Métodos
const cargarTiposActividad = async () => {
  cargando.value = true
  try {
    await cargarListaTiposActividades()
    tiposActividad.value = tipoDeActividades.value
  } catch (error) {
    console.error(error)
    errorMsg('Error al cargar los tipos de actividad')
  } finally {
    cargando.value = false
  }
}

const abrirDialogoNuevo = () => {
  esEdicion.value = false
  resetearFormulario()
  dialogoAbierto.value = true
}

const editarTipo = (tipo) => {
  esEdicion.value = true
  Object.assign(tipoEditado, { ...tipo })
  dialogoAbierto.value = true
}

const cerrarDialogo = () => {
  dialogoAbierto.value = false
  resetearFormulario()
}

const resetearFormulario = () => {
  tipoEditado.id = null
  tipoEditado.sigla = ''
  tipoEditado.tipo_actividad = ''
  if (form.value) {
    form.value.resetValidation()
  }
}

const guardarTipo = async () => {
  if (!formValido.value) return

  guardando.value = true
  try {
    if (esEdicion.value) {
      await updateTipoDeActividad(tipoEditado.id, {
        sigla: tipoEditado.sigla,
        tipo_actividad: tipoEditado.tipo_actividad,
      })
      successMsg('Tipo de actividad actualizado correctamente')
    } else {
      const nuevoTipo = {
        sigla: tipoEditado.sigla,
        tipo_actividad: tipoEditado.tipo_actividad,
      }
      await crearTipoDeActividad(nuevoTipo)
      successMsg('Tipo de actividad creado correctamente')
    }
    dialogoAbierto.value = false
    resetearFormulario()
    await cargarTiposActividad()
  } catch (error) {
    console.error(error)
    errorMsg('Error al guardar el tipo de actividad')
  } finally {
    guardando.value = false
  }
}

const confirmarEliminacion = (tipo) => {
  tipoAEliminar.value = tipo
  dialogoEliminacionAbierto.value = true
}

const eliminarTipo = async () => {
  eliminando.value = true
  try {
    await eliminarTipoDeActividad(tipoAEliminar.value.id)
    successMsg('Tipo de actividad eliminado correctamente')
    dialogoEliminacionAbierto.value = false
    tipoAEliminar.value = null
    await cargarTiposActividad()
  } catch (error) {
    console.error(error)
    errorMsg('Error al eliminar el tipo de actividad')
  } finally {
    eliminando.value = false
  }
}

// Funciones de Importación/Exportación Excel
const exportarAExcel = () => {
  try {
    // Preparar datos para exportación
    const datosExportar = tiposActividad.value.map((item) => ({
      ID: item.id,
      Sigla: item.sigla,
      'Tipo de Actividad': item.tipo_actividad,
    }))

    // Crear libro de trabajo
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(datosExportar)

    // Ajustar anchos de columnas
    const columnWidths = [
      { wch: 10 }, // ID
      { wch: 15 }, // Sigla
      { wch: 40 }, // Tipo de Actividad
    ]
    ws['!cols'] = columnWidths

    XLSX.utils.book_append_sheet(wb, ws, 'Tipos de Actividad')

    // Exportar archivo
    const fecha = new Date().toISOString().split('T')[0]
    XLSX.writeFile(wb, `tipos_actividad_${fecha}.xlsx`)

    successMsg('Datos exportados correctamente a Excel')
  } catch (error) {
    console.error('Error al exportar a Excel:', error)
    errorMsg('Error al exportar a Excel')
  }
}

const abrirDialogoImportar = () => {
  dialogoImportarAbierto.value = true
  archivoExcel.value = null
  datosImportados.value = []
  // Resetea el input de archivo si existe
  if (fileInputRef.value) {
    fileInputRef.value.clear()
  }
}

const cerrarDialogoImportar = () => {
  dialogoImportarAbierto.value = false
  archivoExcel.value = null
  datosImportados.value = []
  // Resetea el input de archivo si existe
  if (fileInputRef.value) {
    fileInputRef.value.clear()
  }
}

const previsualizarImportacion = () => {
  // Ya no necesitas el argumento `file`
  const file = archivoExcel.value // Accede al archivo desde la variable reactiva
  if (!file) {
    // Si el usuario borró la selección, limpia la vista previa
    datosImportados.value = []
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target.result)
      const workbook = XLSX.read(data, { type: 'array' })
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]

      const jsonData = XLSX.utils.sheet_to_json(worksheet)

      datosImportados.value = jsonData.map((item) => {
        const sigla = item['Sigla'] || item['sigla'] || item['SIGLA'] || ''
        const tipo =
          item['Tipo de Actividad'] || item['tipo_actividad'] || item['Tipo'] || item['tipo'] || ''

        const siglaValida =
          sigla && typeof sigla === 'string' && sigla.trim().length > 0 && sigla.length <= 20
        const tipoValido = tipo && typeof tipo === 'string' && tipo.trim().length > 0
        const valido = siglaValida && tipoValido

        return {
          sigla: sigla.trim(),
          tipo_actividad: tipo.trim(),
          estado: valido ? 'válido' : 'inválido',
          valido: valido,
          errores: !valido
            ? [
                !siglaValida && 'Sigla inválida',
                !tipoValido && 'Tipo de actividad requerido',
              ].filter(Boolean)
            : [],
        }
      })

      const validos = datosImportados.value.filter((item) => item.valido).length
      const invalidos = datosImportados.value.length - validos

      if (invalidos > 0) {
        warningMsg(
          `${validos} registros válidos, ${invalidos} inválidos. Revisa los datos antes de importar.`,
        )
      }
    } catch (error) {
      console.error('Error al procesar archivo Excel:', error)
      errorMsg('Error al procesar el archivo Excel. Asegúrate de que tenga el formato correcto.')
    }
  }
  reader.readAsArrayBuffer(file)
}

const confirmarImportacion = async () => {
  importando.value = true
  try {
    const registrosValidos = datosValidosParaImportar.value

    if (registrosValidos.length === 0) {
      warningMsg('No hay registros válidos para importar')
      return
    }

    let importadosExitosos = 0
    let importadosConError = 0

    // Importar cada registro válido
    for (const registro of registrosValidos) {
      try {
        await crearTipoDeActividad({
          sigla: registro.sigla,
          tipo_actividad: registro.tipo_actividad,
        })
        importadosExitosos++

        // Pequeña pausa para no saturar el servidor
        await new Promise((resolve) => setTimeout(resolve, 100))
      } catch (error) {
        console.error(`Error importando registro ${registro.sigla}:`, error)
        importadosConError++
      }
    }

    // Recargar la lista
    await cargarTiposActividad()

    // Mostrar resultados
    if (importadosConError > 0) {
      warningMsg(
        `Importación completada con errores: ${importadosExitosos} exitosos, ${importadosConError} con error`,
      )
    } else {
      successMsg(`${importadosExitosos} registros importados correctamente`)
    }

    cerrarDialogoImportar()
  } catch (error) {
    console.error('Error en el proceso de importación:', error)
    errorMsg('Error durante el proceso de importación')
  } finally {
    importando.value = false
  }
}

// Ciclo de vida
onMounted(() => {
  cargarTiposActividad()
})
</script>

<style scoped>
.v-data-table {
  margin-top: 16px;
}
</style>
