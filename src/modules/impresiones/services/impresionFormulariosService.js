import { apiPrint } from '@/services/axios'

export const impresionFormulariosServicio = {
  //Formularios Proyectos
  imprimirSolFondos: async (idsolfondos, descargar = true) => {
    try {
      const respuesta = await apiPrint.get('/solicitud-fondos-tarea/' + idsolfondos + '/pdf/', {
        responseType: 'blob',
      })

      const blob = respuesta.data

      // Extraer el nombre del archivo del header Content-Disposition
      let nombreArchivo = `solicitud-fondos-${idsolfondos}.pdf`

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
  imprimirSolViaje: async (idsolfondos, descargar = true) => {
    try {
      const respuesta = await apiPrint.get('/solicitud-viaje/' + idsolfondos + '/pdf/', {
        responseType: 'blob',
      })

      const blob = respuesta.data

      // Extraer el nombre del archivo del header Content-Disposition
      let nombreArchivo = `solicitud-viaje-${idsolfondos}.pdf`

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
  imprimirSolPagoDirecto: async (idsolfondos, descargar = true) => {
    try {
      const respuesta = await apiPrint.get('/solicitud-pago-directo/' + idsolfondos + '/pdf/', {
        responseType: 'blob',
      })

      const blob = respuesta.data

      // Extraer el nombre del archivo del header Content-Disposition
      let nombreArchivo = `solicitud-pago-directo-${idsolfondos}.pdf`

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
  imprimirSolReposicion: async (idsolfondos, descargar = true) => {
    try {
      const respuesta = await apiPrint.get('/solicitud-reposicion/' + idsolfondos + '/pdf/', {
        responseType: 'blob',
      })

      const blob = respuesta.data

      // Extraer el nombre del archivo del header Content-Disposition
      let nombreArchivo = `solicitud-reposicion-${idsolfondos}.pdf`

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
  imprimirRendCuentas: async (idsolfondos, descargar = true) => {
    try {
      const respuesta = await apiPrint.get('/rendicion-cuentas/' + idsolfondos + '/pdf/', {
        responseType: 'blob',
      })

      const blob = respuesta.data

      // Extraer el nombre del archivo del header Content-Disposition
      let nombreArchivo = `rendicion-cuentas-${idsolfondos}.pdf`

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
  //formularios tareas
  imprimirSolFondosTareas: async (idsolfondos, descargar = true) => {
    try {
      const respuesta = await apiPrint.get('/solicitud-fondos-tarea/' + idsolfondos + '/pdf/', {
        responseType: 'blob',
      })

      const blob = respuesta.data

      // Extraer el nombre del archivo del header Content-Disposition
      let nombreArchivo = `solicitud-fondos-tareas-${idsolfondos}.pdf`

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
  imprimirSolViajeTareas: async (idsolviaje, descargar = true) => {
    try {
      const respuesta = await apiPrint.get('/solicitud-viaje-tarea/' + idsolviaje + '/pdf/', {
        responseType: 'blob',
      })

      const blob = respuesta.data

      // Extraer el nombre del archivo del header Content-Disposition
      let nombreArchivo = `solicitud-viaje-tareas-${idsolviaje}.pdf`

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
  imprimirSolPagoDirectoTareas: async (idsolfondos, descargar = true) => {
    try {
      const respuesta = await apiPrint.get(
        '/solicitud-pago-directo-tarea/' + idsolfondos + '/pdf/',
        {
          responseType: 'blob',
        },
      )

      const blob = respuesta.data

      // Extraer el nombre del archivo del header Content-Disposition
      let nombreArchivo = `solicitud-pago-directo-tareas-${idsolfondos}.pdf`

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
  imprimirSolReposicionTareas: async (idsolfondos, descargar = true) => {
    try {
      const respuesta = await apiPrint.get('/rendicion-cuentas-tareas/' + idsolfondos + '/pdf/', {
        responseType: 'blob',
      })

      const blob = respuesta.data

      // Extraer el nombre del archivo del header Content-Disposition
      let nombreArchivo = `solicitud-reposicion-tareas-${idsolfondos}.pdf`

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
  imprimirRendCuentasTareas: async (idsolfondos, descargar = true) => {
    try {
      const respuesta = await apiPrint.get('//' + idsolfondos + '/pdf/', {
        responseType: 'blob',
      })

      const blob = respuesta.data

      // Extraer el nombre del archivo del header Content-Disposition
      let nombreArchivo = `rendicion-cuentas-tareas-${idsolfondos}.pdf`

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
