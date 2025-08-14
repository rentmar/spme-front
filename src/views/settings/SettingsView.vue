<template>
  <v-container class="config-container">
    <!-- Overlay de carga -->
    <v-overlay :model-value="cargando" class="align-center justify-center" persistent opacity="0.8">
      <div class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
          width="6"
        ></v-progress-circular>
        <p class="mt-4 text-h6">Cargando configuración del sistema...</p>
      </div>
    </v-overlay>

    <!-- CONTENIDO PRINCIPAL -->
    <template v-if="!cargando">
      <v-row>
        <v-col cols="12">
          <PaginaTituloIcono :titulo="'CONFIGURACIÓN GENERAL'" :icon="'mdi-cog'" />

          <!-- Configuración Básica -->
          <v-card variant="outlined" class="mb-4">
            <v-toolbar color="primary" density="compact">
              <v-toolbar-title>PARÁMETROS DEL SISTEMA</v-toolbar-title>
              <v-spacer></v-spacer>

              <v-tooltip text="Guardar cambios" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    icon
                    color="white"
                    size="large"
                    class="mx-1"
                    @click="guardarConfiguracion"
                    :disabled="cargandoAccion"
                  >
                    <v-icon>mdi-content-save</v-icon>
                  </v-btn>
                </template>
              </v-tooltip>
            </v-toolbar>

            <v-card-text>
              <v-form ref="formConfiguracion">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="configuracion.nombre_sistema"
                      label="Nombre del Sistema"
                      variant="outlined"
                      :rules="[rules.requerido]"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="configuracion.sigla_sistema"
                      label="Sigla del Sistema"
                      variant="outlined"
                      :rules="[rules.requerido]"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="configuracion.version"
                      label="Versión"
                      variant="outlined"
                      :rules="[rules.requerido]"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-select
                      v-model="configuracion.tema"
                      :items="temasDisponibles"
                      label="Tema de la aplicación"
                      variant="outlined"
                    ></v-select>
                  </v-col>

                  <v-col cols="12">
                    <v-textarea
                      v-model="configuracion.descripcion"
                      label="Descripción del Sistema"
                      variant="outlined"
                      rows="3"
                    ></v-textarea>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="configuracion.items_por_pagina"
                      label="Items por página"
                      type="number"
                      variant="outlined"
                      :rules="[rules.requerido, rules.numeroPositivo]"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-switch
                      v-model="configuracion.modo_oscuro"
                      label="Modo oscuro"
                      color="primary"
                    ></v-switch>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-switch
                      v-model="configuracion.mantenimiento"
                      label="Modo mantenimiento"
                      color="warning"
                      :messages="
                        configuracion.mantenimiento
                          ? 'El sistema estará inaccesible para usuarios normales'
                          : ''
                      "
                    ></v-switch>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="configuracion.tiempo_sesion"
                      label="Tiempo de sesión (minutos)"
                      type="number"
                      variant="outlined"
                      :rules="[rules.requerido, rules.numeroPositivo]"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>

          <!-- Configuración de Correo -->
          <v-card variant="outlined" class="mb-4">
            <v-toolbar color="secondary" density="compact">
              <v-toolbar-title>CONFIGURACIÓN DE CORREO</v-toolbar-title>
            </v-toolbar>

            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="configuracion.email_smtp"
                    label="Servidor SMTP"
                    variant="outlined"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="configuracion.email_puerto"
                    label="Puerto SMTP"
                    type="number"
                    variant="outlined"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="configuracion.email_usuario"
                    label="Usuario"
                    variant="outlined"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="configuracion.email_password"
                    label="Contraseña"
                    type="password"
                    variant="outlined"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="configuracion.email_from"
                    label="Correo remitente"
                    variant="outlined"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="configuracion.email_nombre_from"
                    label="Nombre remitente"
                    variant="outlined"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-switch
                    v-model="configuracion.email_ssl"
                    label="Usar SSL"
                    color="primary"
                  ></v-switch>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Configuración Avanzada -->
          <v-card variant="outlined">
            <v-toolbar color="warning" density="compact">
              <v-toolbar-title>CONFIGURACIÓN AVANZADA</v-toolbar-title>
              <v-spacer></v-spacer>

              <v-tooltip text="Reiniciar configuración" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    icon
                    color="black"
                    size="large"
                    class="mx-1"
                    @click="confirmarReset"
                    :disabled="cargandoAccion"
                  >
                    <v-icon>mdi-restart</v-icon>
                  </v-btn>
                </template>
              </v-tooltip>
            </v-toolbar>

            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="configuracion.log_level"
                    label="Nivel de logs"
                    variant="outlined"
                    :items="['debug', 'info', 'warn', 'error']"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="configuracion.backup_interval"
                    label="Intervalo de respaldos (horas)"
                    type="number"
                    variant="outlined"
                    :rules="[rules.numeroPositivo]"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="configuracion.backup_path"
                    label="Ruta de respaldos"
                    variant="outlined"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="configuracion.notas"
                    label="Notas de configuración"
                    variant="outlined"
                    rows="3"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Modal de confirmación - Resetear configuración -->
      <v-dialog v-model="dialogConfirmarReset" max-width="500" persistent>
        <v-card>
          <v-card-title class="bg-warning text-white">
            <v-icon icon="mdi-alert" class="mr-2"></v-icon>
            Confirmar reinicio
          </v-card-title>
          <v-card-text class="pt-4">
            <p class="text-body-1">
              ¿Está seguro que desea reiniciar la configuración a los valores por defecto?
            </p>
            <p class="text-caption text-medium-emphasis mt-2">
              Esta acción restablecerá todos los parámetros del sistema a sus valores iniciales.
            </p>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn color="grey" @click="dialogConfirmarReset = false" :disabled="cargandoAccion">
              Cancelar
            </v-btn>
            <v-btn color="warning" @click="resetearConfiguracion" :loading="cargandoAccion">
              Reiniciar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <ConfirmDialog></ConfirmDialog>
    </template>

    <v-alert v-if="errorCarga && !cargando" type="error" variant="tonal" class="mt-4">
      No se pudo cargar la configuración del sistema. Por favor intente nuevamente.
    </v-alert>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSnackbar } from '@/composables/useSnackbar'
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import ConfirmDialog from '@/components/layout/partials/ConfirmDialog.vue'

// Cuadro de dialogo para confirmacion
const { openConfirmDialog } = useConfirmDialog()

// Mensajes de confirmacion de accion exito/Error
const { successMsg, errorMsg } = useSnackbar()

// Estados
const cargando = ref(true)
const cargandoAccion = ref(false)
const errorCarga = ref(false)
const dialogConfirmarReset = ref(false)

// Temas disponibles
const temasDisponibles = ['Azul', 'Verde', 'Rojo', 'Morado', 'Naranja', 'Personalizado']

// Reglas de validación
const rules = {
  requerido: (value) => !!value || 'Campo requerido',
  numeroPositivo: (value) => value > 0 || 'Debe ser un número positivo',
}

// Configuración del sistema
const configuracion = ref({
  nombre_sistema: '',
  sigla_sistema: '',
  version: '',
  descripcion: '',
  tema: 'Azul',
  items_por_pagina: 10,
  modo_oscuro: false,
  mantenimiento: false,
  tiempo_sesion: 30,

  // Configuración de correo
  email_smtp: '',
  email_puerto: '',
  email_usuario: '',
  email_password: '',
  email_from: '',
  email_nombre_from: '',
  email_ssl: false,

  // Configuración avanzada
  log_level: 'info',
  backup_interval: 24,
  backup_path: '',
  notas: '',
})

// Formulario
const formConfiguracion = ref(null)

// Métodos
const cargarConfiguracion = async () => {
  try {
    cargando.value = true
    errorCarga.value = false

    // Simular carga de datos desde API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Datos de ejemplo - en una app real esto vendría de una API
    configuracion.value = {
      nombre_sistema: 'Sistema de Gestión Institucional',
      sigla_sistema: 'SGI',
      version: '1.0.0',
      descripcion: 'Sistema integral para la gestión de procesos institucionales',
      tema: 'Azul',
      items_por_pagina: 15,
      modo_oscuro: false,
      mantenimiento: false,
      tiempo_sesion: 45,

      email_smtp: 'smtp.dominio.com',
      email_puerto: 587,
      email_usuario: 'notificaciones@dominio.com',
      email_password: '',
      email_from: 'notificaciones@dominio.com',
      email_nombre_from: 'Sistema de Gestión',
      email_ssl: true,

      log_level: 'info',
      backup_interval: 24,
      backup_path: '/var/backups/sgi',
      notas: 'Última actualización: 2023-10-15',
    }
  } catch (error) {
    console.error('Error al cargar configuración:', error)
    errorCarga.value = true
  } finally {
    cargando.value = false
  }
}

const guardarConfiguracion = async () => {
  const { valid } = await formConfiguracion.value.validate()

  if (!valid) {
    errorMsg('Por favor complete todos los campos requeridos correctamente')
    return
  }

  try {
    cargandoAccion.value = true

    // Simular guardado en API
    await new Promise((resolve) => setTimeout(resolve, 800))

    successMsg('Configuración guardada correctamente')

    // Aplicar cambios que requieren recarga
    if (configuracion.value.modo_oscuro) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
  } catch (error) {
    console.error('Error al guardar configuración:', error)
    errorMsg('Error al guardar la configuración')
  } finally {
    cargandoAccion.value = false
  }
}

const confirmarReset = async () => {
  const confirmed = await openConfirmDialog({
    title: 'Reiniciar Configuración',
    message: '¿Está seguro que desea restablecer TODA la configuración a los valores por defecto?',
    confirmLabel: 'Reiniciar',
    cancelLabel: 'Cancelar',
    type: 'warning',
  })

  if (confirmed) {
    dialogConfirmarReset.value = true
  }
}

const resetearConfiguracion = async () => {
  try {
    cargandoAccion.value = true

    // Simular reinicio
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Valores por defecto
    configuracion.value = {
      nombre_sistema: 'Sistema de Gestión',
      sigla_sistema: 'SG',
      version: '1.0.0',
      descripcion: '',
      tema: 'Azul',
      items_por_pagina: 10,
      modo_oscuro: false,
      mantenimiento: false,
      tiempo_sesion: 30,

      email_smtp: '',
      email_puerto: '',
      email_usuario: '',
      email_password: '',
      email_from: '',
      email_nombre_from: '',
      email_ssl: false,

      log_level: 'info',
      backup_interval: 24,
      backup_path: '',
      notas: '',
    }

    successMsg('Configuración reiniciada a valores por defecto')
    dialogConfirmarReset.value = false
  } catch (error) {
    console.error('Error al reiniciar configuración:', error)
    errorMsg('Error al reiniciar la configuración')
  } finally {
    cargandoAccion.value = false
  }
}

// Carga inicial
onMounted(() => {
  cargarConfiguracion()
})
</script>

<style scoped>
.config-container {
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

@media (max-width: 960px) {
  .config-container {
    padding: 16px 12px;
  }
}

.dark-mode {
  background-color: #121212;
  color: #ffffff;
}
</style>
