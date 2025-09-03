<template>
  <v-app>
    <v-main>
      <v-container class="pa-6">
        <!-- Header -->
        <v-row class="mb-6">
          <v-col cols="12" class="text-center">
            <h1 class="text-h4 primary--text">Sistema de Fondos</h1>
            <p class="text-subtitle-1 grey--text">Gestión de solicitudes y rendiciones</p>
          </v-col>
        </v-row>

        <!-- Botones de acción principales -->
        <v-row class="mb-8" justify="center">
          <v-col cols="auto">
            <v-btn
              color="primary"
              large
              @click="dialogSolicitud = true"
              class="mx-2"
            >
              <v-icon left>mdi-cash-plus</v-icon>
              Nueva Solicitud
            </v-btn>
            <v-btn
              color="secondary"
              large
              @click="mostrarTodasSolicitudes"
              class="mx-2"
              :disabled="solicitudes.length === 0"
            >
              <v-icon left>mdi-format-list-bulleted</v-icon>
              Ver Todas
            </v-btn>
          </v-col>
        </v-row>

        <!-- Tarjetas de solicitudes -->
        <v-row v-if="solicitudes.length > 0">
          <v-col v-for="solicitud in solicitudes" :key="solicitud.id" cols="12" md="6" lg="4">
            <v-card class="solicitud-card" :class="{'completada': solicitud.rendicion}">

              <v-card-title class="d-flex justify-space-between">
                <span>Solicitud #{{ solicitud.id }}</span>
                <v-chip small :color="solicitud.rendicion ? 'success' : 'warning'">
                  {{ solicitud.rendicion ? 'Completada' : 'Pendiente' }}
                </v-chip>
              </v-card-title>

              <v-card-text>
                <div class="mb-2">
                  <strong>Monto:</strong> {{ formatCurrency(solicitud.monto) }}
                </div>
                <div class="mb-2">
                  <strong>Motivo:</strong> {{ solicitud.motivo }}
                </div>
                <div class="mb-2">
                  <strong>Fecha:</strong> {{ formatDate(solicitud.fecha) }}
                </div>
                <div v-if="solicitud.descripcion" class="mb-2">
                  <strong>Descripción:</strong> {{ solicitud.descripcion }}
                </div>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="editarSolicitud(solicitud)">
                  <v-icon small>mdi-pencil</v-icon>
                </v-btn>
                <v-btn color="green" text @click="abrirRendicion(solicitud)" :disabled="!!solicitud.rendicion">
                  <v-icon small>mdi-cash-check</v-icon>
                  Rendición
                </v-btn>
              </v-card-actions>

            </v-card>
          </v-col>
        </v-row>

        <!-- Estado vacío -->
        <v-row v-else>
          <v-col cols="12" class="text-center">
            <v-icon color="grey lighten-1" size="80">mdi-cash-remove</v-icon>
            <h3 class="text-h5 grey--text text--darken-1 mt-4">No hay solicitudes de fondos</h3>
            <p class="subtitle-1 grey--text">Comienza creando una nueva solicitud</p>
          </v-col>
        </v-row>

        <!-- Dialog para Solicitud de Fondos -->
        <v-dialog v-model="dialogSolicitud" max-width="700px" persistent>
          <v-card>
            <v-card-title class="headline primary white--text">
              <v-icon left color="white">mdi-cash-plus</v-icon>
              {{ esEdicion ? 'Editar' : 'Nueva' }} Solicitud de Fondos
            </v-card-title>

            <v-card-text class="pa-4">
              <v-form ref="formSolicitud" v-model="validoSolicitud">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="solicitudActual.monto"
                      label="Monto solicitado"
                      type="number"
                      prefix="$"
                      :rules="[reglas.requerido, reglas.montoMinimo]"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-menu
                      v-model="menuFecha"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="solicitudActual.fecha"
                          label="Fecha de solicitud"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          :rules="[reglas.requerido]"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="solicitudActual.fecha"
                        @input="menuFecha = false"
                        locale="es"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>

                  <v-col cols="12">
                    <v-text-field
                      v-model="solicitudActual.motivo"
                      label="Motivo de la solicitud"
                      :rules="[reglas.requerido]"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12">
                    <v-textarea
                      v-model="solicitudActual.descripcion"
                      label="Descripción detallada"
                      rows="3"
                    ></v-textarea>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="grey" text @click="cerrarDialogSolicitud">Cancelar</v-btn>
              <v-btn
                color="primary"
                @click="guardarSolicitud"
                :disabled="!validoSolicitud"
              >
                {{ esEdicion ? 'Actualizar' : 'Crear' }} Solicitud
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Dialog para Rendición de Cuentas -->
        <v-dialog v-model="dialogRendicion" max-width="700px" persistent>
          <v-card>
            <v-card-title class="headline green white--text">
              <v-icon left color="white">mdi-cash-check</v-icon>
              Rendición de Cuentas
              <v-spacer></v-spacer>
              <span class="subtitle-1">Solicitud #{{ solicitudActual.id }}</span>
            </v-card-title>

            <v-card-text class="pa-4">
              <v-alert type="info" class="mb-4">
                Estás rindiendo cuentas para la solicitud de <strong>{{ formatCurrency(solicitudActual.monto) }}</strong>
                con motivo: <strong>{{ solicitudActual.motivo }}</strong>
              </v-alert>

              <v-form ref="formRendicion" v-model="validoRendicion">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="rendicionActual.montoUtilizado"
                      label="Monto utilizado"
                      type="number"
                      prefix="$"
                      :rules="[reglas.requerido, reglas.montoValido]"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-menu
                      v-model="menuFechaRendicion"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="rendicionActual.fecha"
                          label="Fecha de rendición"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          :rules="[reglas.requerido]"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="rendicionActual.fecha"
                        @input="menuFechaRendicion = false"
                        locale="es"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>

                  <v-col cols="12">
                    <v-textarea
                      v-model="rendicionActual.detalle"
                      label="Detalle de gastos"
                      rows="3"
                      :rules="[reglas.requerido]"
                      required
                    ></v-textarea>
                  </v-col>

                  <v-col cols="12">
                    <v-file-input
                      v-model="rendicionActual.comprobantes"
                      label="Comprobantes (opcional)"
                      multiple
                      prepend-icon="mdi-paperclip"
                      chips
                    ></v-file-input>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="grey" text @click="cerrarDialogRendicion">Cancelar</v-btn>
              <v-btn
                color="green"
                @click="guardarRendicion"
                :disabled="!validoRendicion"
              >
                Guardar Rendición
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Snackbar para notificaciones -->
        <v-snackbar v-model="snackbar.visible" :color="snackbar.color" timeout="3000">
          {{ snackbar.mensaje }}
          <template v-slot:action="{ attrs }">
            <v-btn text v-bind="attrs" @click="snackbar.visible = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
        </v-snackbar>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';

export default {
  name: 'SistemaFondos',
  setup() {
    // Estados de los diálogos
    const dialogSolicitud = ref(false);
    const dialogRendicion = ref(false);
    const menuFecha = ref(false);
    const menuFechaRendicion = ref(false);

    // Estados de validación
    const validoSolicitud = ref(false);
    const validoRendicion = ref(false);

    // Bandera para saber si estamos editando
    const esEdicion = ref(false);

    // Datos de las solicitudes
    const solicitudes = ref([]);

    // Datos actuales para formularios
    const solicitudActual = reactive({
      id: null,
      monto: '',
      motivo: '',
      descripcion: '',
      fecha: new Date().toISOString().substr(0, 10)
    });

    const rendicionActual = reactive({
      id: null,
      solicitudId: null,
      montoUtilizado: '',
      detalle: '',
      fecha: new Date().toISOString().substr(0, 10),
      comprobantes: []
    });

    // Snackbar para mensajes
    const snackbar = reactive({
      visible: false,
      mensaje: '',
      color: 'success'
    });

    // Reglas de validación
    const reglas = {
      requerido: value => !!value || 'Este campo es requerido',
      montoMinimo: value => parseFloat(value) > 0 || 'El monto debe ser mayor a 0',
      montoValido: value => {
        const montoSolicitud = parseFloat(solicitudActual.monto);
        const montoUtilizado = parseFloat(value);
        return montoUtilizado <= montoSolicitud || `El monto utilizado no puede ser mayor al solicitado (${formatCurrency(montoSolicitud)})`;
      }
    };

    // Funciones de utilidad
    function formatCurrency(value) {
      if (!value) return '$0';
      return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
    }

    function formatDate(dateString) {
      if (!dateString) return '';
      return new Date(dateString).toLocaleDateString('es-AR');
    }

    // Funciones para solicitudes
    function nuevaSolicitud() {
      esEdicion.value = false;
      Object.assign(solicitudActual, {
        id: null,
        monto: '',
        motivo: '',
        descripcion: '',
        fecha: new Date().toISOString().substr(0, 10)
      });
      dialogSolicitud.value = true;
    }

    function editarSolicitud(solicitud) {
      esEdicion.value = true;
      Object.assign(solicitudActual, {...solicitud});
      dialogSolicitud.value = true;
    }

    function guardarSolicitud() {
      if (!validoSolicitud.value) return;

      if (esEdicion.value) {
        // Actualizar solicitud existente
        const index = solicitudes.value.findIndex(s => s.id === solicitudActual.id);
        if (index !== -1) {
          solicitudes.value[index] = {...solicitudActual};
          mostrarMensaje('Solicitud actualizada correctamente', 'success');
        }
      } else {
        // Crear nueva solicitud
        const nuevaSolicitud = {
          ...solicitudActual,
          id: Date.now(), // ID único basado en timestamp
          rendicion: null
        };
        solicitudes.value.push(nuevaSolicitud);
        mostrarMensaje('Solicitud creada correctamente', 'success');
      }

      cerrarDialogSolicitud();
      guardarEnLocalStorage();
    }

    function cerrarDialogSolicitud() {
      dialogSolicitud.value = false;
      setTimeout(() => {
        if (window.$refs.formSolicitud) {
          window.$refs.formSolicitud.resetValidation();
        }
      }, 100);
    }

    // Funciones para rendición de cuentas
    function abrirRendicion(solicitud) {
      Object.assign(solicitudActual, {...solicitud});
      Object.assign(rendicionActual, {
        id: null,
        solicitudId: solicitud.id,
        montoUtilizado: '',
        detalle: '',
        fecha: new Date().toISOString().substr(0, 10),
        comprobantes: []
      });
      dialogRendicion.value = true;
    }

    function guardarRendicion() {
      if (!validoRendicion.value) return;

      const rendicion = {
        ...rendicionActual,
        id: Date.now() // ID único
      };

      // Asociar la rendición con la solicitud
      const index = solicitudes.value.findIndex(s => s.id === rendicion.solicitudId);
      if (index !== -1) {
        solicitudes.value[index].rendicion = rendicion;
        mostrarMensaje('Rendición de cuentas guardada correctamente', 'success');
      }

      cerrarDialogRendicion();
      guardarEnLocalStorage();
    }

    function cerrarDialogRendicion() {
      dialogRendicion.value = false;
      setTimeout(() => {
        if (window.$refs.formRendicion) {
          window.$refs.formRendicion.resetValidation();
        }
      }, 100);
    }

    // Otras funciones
    function mostrarMensaje(mensaje, color = 'success') {
      snackbar.mensaje = mensaje;
      snackbar.color = color;
      snackbar.visible = true;
    }

    function mostrarTodasSolicitudes() {
      // Esta función podría expandirse para mostrar un listado detallado
      mostrarMensaje(`Mostrando ${solicitudes.value.length} solicitudes`, 'info');
    }

    // Persistencia en localStorage
    function guardarEnLocalStorage() {
      localStorage.setItem('solicitudesFondos', JSON.stringify(solicitudes.value));
    }

    function cargarDesdeLocalStorage() {
      const datos = localStorage.getItem('solicitudesFondos');
      if (datos) {
        solicitudes.value = JSON.parse(datos);
      }
    }

    // Inicialización
    onMounted(() => {
      cargarDesdeLocalStorage();
    });

    // Exponer variables y funciones al template
    return {
      dialogSolicitud,
      dialogRendicion,
      menuFecha,
      menuFechaRendicion,
      validoSolicitud,
      validoRendicion,
      esEdicion,
      solicitudes,
      solicitudActual,
      rendicionActual,
      snackbar,
      reglas,
      formatCurrency,
      formatDate,
      nuevaSolicitud,
      editarSolicitud,
      guardarSolicitud,
      cerrarDialogSolicitud,
      abrirRendicion,
      guardarRendicion,
      cerrarDialogRendicion,
      mostrarTodasSolicitudes
    };
  }
};
</script>

<style scoped>
.solicitud-card {
  transition: all 0.3s ease;
  border-left: 4px solid #2196F3;
}

.solicitud-card.completada {
  border-left: 4px solid #4CAF50;
}

.solicitud-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
}

.v-btn {
  text-transform: none;
}

.headline {
  padding: 16px;
}
</style>
