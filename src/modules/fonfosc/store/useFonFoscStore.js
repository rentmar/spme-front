import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fonfoscServicios } from '../services/fonfoscService'
import { useInstituciones } from '../composables/useInstituciones'

export const useFonFoscStore = defineStore('fonfosc-proyecto', () => {
  // ============== ESTADOS GENERALES ==============
  const loading = ref(false)
  const error = ref(null)
  const institucionesListado = ref([])
  const fonfoscEstructura = ref(null)

  // ============== ESTADOS DEL FORMULARIO DE CREACIÓN ==============
  // Estados del stepper
  const pasoActualForm = ref(1)
  const dialogForm = ref(false)
  const cargandoForm = ref(false)
  const aceptarTerminosForm = ref(false)
  const institucionSeleccionadaForm = ref(null)
  const busquedaInstitucionForm = ref('')

  // Datos del proyecto
  const datosProyectoForm = ref({
    institucion: {
      sigla: '',
      nombre: '',
      departamento: '',
      email: '',
      responsable: '',
    },
    resumen_proyecto: '',
    codigo: '',
    titulo: '',
    fecha_inicio: '',
    fecha_cierre: '',
    categoria: '',
    cobertura_geografica: '',
  })

  // Listas de opciones
  const departamentosBolivia = ref([
    'La Paz',
    'Cochabamba',
    'Santa Cruz',
    'Oruro',
    'Potosí',
    'Tarija',
    'Chuquisaca',
    'Beni',
    'Pando',
  ])
  const categoriasProyecto = [
    'Fortalecimiento de la sociedad civil',
    'Desarrollo productivo',
    'Educación y cultura',
    'Salud comunitaria',
    'Medio ambiente y recursos naturales',
    'Género e inclusión',
    'Desarrollo infantil temprano',
    'Gobernanza local',
  ]

  const pasosForm = ['Datos Institucionales', 'Información General', 'Resumen']

  // ============== GETTERS DEL FORMULARIO ==============
  const esUltimoPasoForm = computed(() => pasoActualForm.value === pasosForm.length)
  const esPrimerPasoForm = computed(() => pasoActualForm.value === 1)

  // ============== INICIALIZAR COMPOSABLES ==============
  const { institucionesLista, cargarInstituciones } = useInstituciones()

  // ============== ACCIONES GENERALES ==============
  // Cargar los proyecto fonfosc
  const cargarEstrcuturaFonfosc = async (idproyectoff) => {
    loading.value = true
    try {
      const respuesta = await fonfoscServicios.ffestructura(idproyectoff)
      fonfoscEstructura.value = respuesta.data
      return respuesta
    } catch (err) {
      console.error('Error al cargar los proyectos')
      error.value = err
    } finally {
      loading.value = false
    }
  }

  // Cargar instituciones
  const cargarListaInstituciones = async () => {
    loading.value = true
    try {
      await cargarInstituciones()
      institucionesListado.value = institucionesLista.value
    } catch (err) {
      console.error('Error al cargar la lista de instituciones')
      error.value = err
    } finally {
      loading.value = false
    }
  }

  // ============== ACCIONES DEL FORMULARIO ==============
  const siguientePasoForm = () => {
    if (pasoActualForm.value < pasosForm.length) {
      pasoActualForm.value++
    }
  }

  const pasoAnteriorForm = () => {
    if (pasoActualForm.value > 1) {
      pasoActualForm.value--
    }
  }

  const resetearFormularioForm = () => {
    pasoActualForm.value = 1
    aceptarTerminosForm.value = false
    cargandoForm.value = false
    institucionSeleccionadaForm.value = null
    busquedaInstitucionForm.value = ''
    datosProyectoForm.value = {
      institucion: {
        sigla: '',
        nombre: '',
        departamento: '',
        email: '',
        responsable: '',
      },
      resumen_proyecto: '',
      codigo: '',
      titulo: '',
      fecha_inicio: '',
      fecha_cierre: '',
      categoria: '',
      cobertura_geografica: '',
    }
  }

  const abrirDialogForm = () => {
    resetearFormularioForm()
    dialogForm.value = true
  }

  const cerrarDialogForm = () => {
    resetearFormularioForm()
    dialogForm.value = false
  }

  const cargarDatosInstitucionForm = (institucion) => {
    if (institucion) {
      datosProyectoForm.value.institucion = {
        sigla: institucion.sigla || '',
        nombre: institucion.nombre || '',
        departamento: institucion.departamento || '',
        email: institucion.email || institucion.emailInstitucion || '',
        responsable: institucion.contacto_principal || institucion.responsable || '',
      }
    } else {
      datosProyectoForm.value.institucion = {
        sigla: '',
        nombre: '',
        departamento: '',
        email: '',
        responsable: '',
      }
    }
  }

  // Método para obtener datos completos del proyecto
  const obtenerDatosProyectoForm = () => {
    return {
      ...datosProyectoForm.value,
      estado: 'Estructuracion',
      fecha_creacion: new Date().toISOString(),
      institucion_id: institucionSeleccionadaForm.value || null,
    }
  }

  return {
    // ============== ESTADOS GENERALES ==============
    loading,
    error,
    fonfoscEstructura,
    institucionesListado,
    departamentosBolivia,

    // ============== ESTADOS DEL FORMULARIO ==============
    // Estados del stepper
    pasoActualForm,
    dialogForm,
    cargandoForm,
    aceptarTerminosForm,
    institucionSeleccionadaForm,
    busquedaInstitucionForm,

    // Datos del proyecto
    datosProyectoForm,

    // Listas del formulario
    categoriasProyecto,
    pasosForm,

    // Getters del formulario
    esUltimoPasoForm,
    esPrimerPasoForm,

    // ============== ACCIONES GENERALES ==============
    cargarEstrcuturaFonfosc,
    cargarListaInstituciones,

    // ============== ACCIONES DEL FORMULARIO ==============
    siguientePasoForm,
    pasoAnteriorForm,
    resetearFormularioForm,
    abrirDialogForm,
    cerrarDialogForm,
    cargarDatosInstitucionForm,
    obtenerDatosProyectoForm,
  }
})
