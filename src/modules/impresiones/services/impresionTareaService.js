import { apiPrint } from '@/services/axios'

export const impresionTareaServicio = {
  /* Impresion de la Tarea */
  imprimirTareaActividad: async (idTareas, descargar = true) => {
    try {
      const respuesta = await apiPrint.get('/tarea-actividad/' + idTareas + '/pdf/', {
        responseType: 'blob',
      })

      const blob = respuesta.data

      // Extraer el nombre del archivo del header Content-Disposition
      let nombreArchivo = `subactividad-${idTareas}.pdf`

      const contentDisposition = respuesta.headers['content-disposition']
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(
          /filename\*?=["']?(?:UTF-\d["']*)?([^;\n"]*)["']?/i,
        )

        if (fileNameMatch && fileNameMatch[1]) {
          // Decodificar si tiene codificación especial
          nombreArchivo = decodeURIComponent(fileNameMatch[1])
        } else {
          // Intentar con formato simple: filename="archivo.pdf"
          const simpleMatch = contentDisposition.match(/filename=["']?([^"\n;]+)["']?/i)
          if (simpleMatch && simpleMatch[1]) {
            nombreArchivo = simpleMatch[1]
          }
        }
      }

      if (descargar) {
        // Descargar automáticamente
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', nombreArchivo)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      }

      return {
        blob,
        nombreArchivo,
        headers: respuesta.headers,
      }
    } catch (error) {
      console.error('Axios: Error al generar PDF', error)
      throw error
    }
  },
}
