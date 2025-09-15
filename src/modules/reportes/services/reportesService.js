import { apiRep, api } from '@/services/axios'

export const reportesServicios = {
  estructuraJerReportes: async (idProyecto) => {
    try {
      const respuesta = await apiRep.get('/proyecto/estructura-jerarquica/' + idProyecto + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: error fectch estruc jerar proy idproy: ' + idProyecto, error)
      throw error
    }
  },
  actidadIndPorId: async (idactividad) => {
    try {
      const respuesta = await api.get('/actividad-indicadores-proyecto/' + idactividad + '/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: error fectch estruc jerar proy idproy: ' + idactividad, error)
      throw error
    }
  },
  estructuraProyectoReporte: async (idproyecto) => {
    try {
      const respuesta = await apiRep.get('/proyectos/' + idproyecto + '/estructura-reportes/')
      return respuesta.data
    } catch (error) {
      console.error('Axios: error fectch estruc jerar proy idproy: ' + idproyecto, error)
    }
  },
  /****** Crear bitacora **********/
  grabarBitacora: async (data) => {
    try {
      const respuesta = await apiRep.post('/bitacora-indicador/crear/', data)
      return respuesta.data
    } catch (error) {
      console.error('Axios, error de registro en el bitacor', error)
    }
  },
  /******** Bitacora por Indicador *********************/
  obtenerBitacoraPorIdIndicador:async (idIndicador, tipoIndicador) => {
    try {
      const respuesta = await apiRep.post('')
      return respuesta.data
    } catch (error) {
      console.error('Axios, error fetch ', error)
      throw error
    }

  }
  /*************REPORTES PARA DESCARGA********************/
  //Reporte de poryecto por su id
  reporteProyecto: async (idproyecto) => {
    try {
      const respuesta = await apiRep.get('/proyectos/' + idproyecto + '/descargar-reporte/', {
        responseType: 'blob',
      })

      //Extrae los datos del archivo (el Blob) de la respuesta
      const blob = new Blob([respuesta.data], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      })

      //Crea una URL de objeto temporal para el Blob
      const fileURL = window.URL.createObjectURL(blob)

      //Crea un elemento de anclaje (<a>) en la memoria
      const link = document.createElement('a')
      link.href = fileURL

      //Establece el nombre del archivo para la descarga
      const disposition = respuesta.headers['content-disposition']
      let filename = 'reporte_proyecto.docx' // Nombre por defecto
      if (disposition && disposition.indexOf('attachment') !== -1) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        const matches = filenameRegex.exec(disposition)
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '')
        }
      }
      link.setAttribute('download', filename)

      //Simula un clic en el enlace para iniciar la descarga
      document.body.appendChild(link)
      link.click()

      //Limpia el elemento y la URL, para liberar memoria
      document.body.removeChild(link)
      window.URL.revokeObjectURL(fileURL)
    } catch (erro) {
      console.error('axios: error reporte de proyecto', erro)
    }
  },
}
