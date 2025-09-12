<template>
  <v-app>
    <v-main>
      <v-container class="pa-6">
        <!-- Header -->
        <v-row class="mb-6 text-center">
          <v-col cols="12">
            <h1 class="text-h4 primary--text">Sistema de Fondos</h1>
            <p class="text-subtitle-1 grey--text">Gestión de solicitudes y rendiciones</p>
          </v-col>
        </v-row>

        <!-- Botones de acción principales -->
        <v-row class="mb-8" justify="center">
          <v-col cols="auto">
            <v-btn color="primary" large @click="nuevaSolicitud" class="mx-2" :disabled="bloquearNuevaSolicitud">
              <v-icon left>mdi-cash-plus</v-icon>
              Nueva Solicitud
              <v-tooltip v-if="bloquearNuevaSolicitud" activator="parent" location="bottom">
                Complete la rendición de la solicitud actual para crear una nueva
              </v-tooltip>
            </v-btn>
            <v-btn color="secondary" large @click="mostrarTodasSolicitudes" class="mx-2"
              :disabled="!solicitudes.length">
              <v-icon left>mdi-format-list-bulleted</v-icon>
              Ver Todas
            </v-btn>
          </v-col>
        </v-row>

        <!-- Tarjetas de solicitudes -->
        <v-row v-if="solicitudes.length">
          <v-col v-for="solicitud in solicitudes" :key="solicitud.id" cols="12" md="6" lg="4">
            <v-card class="solicitud-card" :class="{'completada': solicitud.rendicion}">
              <v-card-title class="d-flex justify-space-between">
                <span>Solicitud #{{ solicitud.id }}</span>
                <v-chip small :color="solicitud.rendicion ? 'success' : 'warning'">
                  {{ solicitud.rendicion ? 'Completada' : 'Pendiente' }}
                </v-chip>
              </v-card-title>

              <v-card-text>
                <div class="mb-2"><strong>Monto:</strong> {{ formatCurrency(solicitud.monto) }}</div>
                <div class="mb-2"><strong>Motivo:</strong> {{ solicitud.motivo }}</div>
                <div class="mb-2"><strong>Fecha:</strong> {{ formatDate(solicitud.fecha) }}</div>
                <div v-if="solicitud.descripcion" class="mb-2">
                  <strong>Descripción:</strong> {{ solicitud.descripcion }}
                </div>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green" text @click="abrirRendicion(solicitud)"
                       :disabled="!!solicitud.rendicion">
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
              Nueva Solicitud de Fondos
            </v-card-title>

            <v-card-text class="pa-4">
              <v-form ref="formSolicitud" v-model="validoSolicitud">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="solicitudActual.monto" label="Monto solicitado" type="number" prefix="$"
                      :rules="[v => !!v || 'Requerido', v => v > 0 || 'Monto mayor a 0']" required />
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-menu v-model="menuFecha" :close-on-content-click="false" transition="scale-transition" offset-y>
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field v-model="solicitudActual.fecha" label="Fecha de solicitud" prepend-icon="mdi-calendar"
                          readonly v-bind="attrs" v-on="on" :rules="[v => !!v || 'Requerido']" />
                      </template>
                      <v-date-picker v-model="solicitudActual.fecha" @input="menuFecha = false" locale="es" />
                    </v-menu>
                  </v-col>

                  <v-col cols="12">
                    <v-text-field v-model="solicitudActual.motivo" label="Motivo de la solicitud"
                      :rules="[v => !!v || 'Requerido']" required />
                  </v-col>

                  <v-col cols="12">
                    <v-textarea v-model="solicitudActual.descripcion" label="Descripción detallada" rows="3" />
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="grey" text @click="cerrarDialogSolicitud">Cancelar</v-btn>
              <v-btn color="primary" @click="guardarSolicitud" :disabled="!validoSolicitud">Crear Solicitud</v-btn>
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
                    <v-text-field v-model="rendicionActual.montoUtilizado" label="Monto utilizado" type="number" prefix="$"
                      :rules="[v => !!v || 'Requerido', v => v <= solicitudActual.monto || 'No mayor al solicitado']" required />
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-menu v-model="menuFechaRendicion" :close-on-content-click="false" transition="scale-transition" offset-y>
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field v-model="rendicionActual.fecha" label="Fecha de rendición" prepend-icon="mdi-calendar"
                          readonly v-bind="attrs" v-on="on" :rules="[v => !!v || 'Requerido']" />
                      </template>
                      <v-date-picker v-model="rendicionActual.fecha" @input="menuFechaRendicion = false" locale="es" />
                    </v-menu>
                  </v-col>

                  <v-col cols="12">
                    <v-textarea v-model="rendicionActual.detalle" label="Detalle de gastos" rows="3"
                      :rules="[v => !!v || 'Requerido']" required />
                  </v-col>

                  <v-col cols="12">
                    <v-file-input v-model="rendicionActual.comprobantes" label="Comprobantes (opcional)" multiple
                      prepend-icon="mdi-paperclip" chips />
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="grey" text @click="cerrarDialogRendicion">Cancelar</v-btn>
              <v-btn color="green" @click="guardarRendicion" :disabled="!validoRendicion">Guardar Rendición</v-btn>
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

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';

// Estados
const dialogSolicitud = ref(false);
const dialogRendicion = ref(false);
const menuFecha = ref(false);
const menuFechaRendicion = ref(false);
const validoSolicitud = ref(false);
const validoRendicion = ref(false);
const solicitudes = ref([]);

// Nuevo estado para controlar el bloqueo
const bloquearNuevaSolicitud = ref(false);

const solicitudActual = reactive({
  id: null,
  monto: '',
  motivo: '',
  descripcion: '',
  fecha: new Date().toISOString().slice(0, 10)
});

const rendicionActual = reactive({
  id: null,
  solicitudId: null,
  montoUtilizado: '',
  detalle: '',
  fecha: new Date().toISOString().slice(0, 10),
  comprobantes: []
});

const snackbar = reactive({
  visible: false,
  mensaje: '',
  color: 'success'
});

// Computed para verificar si hay solicitudes pendientes
const haySolicitudesPendientes = computed(() => {
  return solicitudes.value.some(solicitud => !solicitud.rendicion);
});

// Funciones de utilidad
const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value || 0);
};

const formatDate = (dateString) => {
  return dateString ? new Date(dateString).toLocaleDateString('es-AR') : '';
};

// Funciones para solicitudes
const nuevaSolicitud = () => {
  if (bloquearNuevaSolicitud.value) return;

  Object.assign(solicitudActual, {
    id: null,
    monto: '',
    motivo: '',
    descripcion: '',
    fecha: new Date().toISOString().slice(0, 10)
  });
  dialogSolicitud.value = true;
};

const guardarSolicitud = () => {
  if (!validoSolicitud.value) return;

  const nuevaSolicitud = {
    ...solicitudActual,     // Copia todas las propiedades existentes
    id: Date.now(),         // Asigna un ID único basado en el timestamp
    rendicion: null         // Inicializa la rendición como nula
  };

  solicitudes.value.push(nuevaSolicitud);
  mostrarMensaje('Solicitud creada correctamente');
  cerrarDialogSolicitud();
  guardarEnLocalStorage();

  // Bloquear nueva solicitud hasta que se complete la rendición
  bloquearNuevaSolicitud.value = true;
};

const abrirRendicion = (solicitud) => {
  Object.assign(solicitudActual, { ...solicitud });
  Object.assign(rendicionActual, {
    id: null,
    solicitudId: solicitud.id,
    montoUtilizado: '',
    detalle: '',
    fecha: new Date().toISOString().slice(0, 10),
    comprobantes: []
  });
  dialogRendicion.value = true;
};

const guardarRendicion = () => {
  if (!validoRendicion.value) return;

  const rendicion = {
    ...rendicionActual,
    id: Date.now()
  };

  const index = solicitudes.value.findIndex(s => s.id === rendicion.solicitudId);
  if (index !== -1) {
    solicitudes.value[index].rendicion = rendicion;
    mostrarMensaje('Rendición de cuentas guardada correctamente');

    // Desbloquear nueva solicitud después de guardar la rendición
    bloquearNuevaSolicitud.value = false;
  }

  cerrarDialogRendicion();
  guardarEnLocalStorage();
};

const cerrarDialogSolicitud = () => {
  dialogSolicitud.value = false;
};

const cerrarDialogRendicion = () => {
  dialogRendicion.value = false;
};

const mostrarMensaje = (mensaje, color = 'success') => {
  snackbar.mensaje = mensaje;
  snackbar.color = color;
  snackbar.visible = true;
};

const mostrarTodasSolicitudes = () => {
  mostrarMensaje(`Mostrando ${solicitudes.value.length} solicitudes`, 'info');
};

const guardarEnLocalStorage = () => {
  localStorage.setItem('solicitudesFondos', JSON.stringify(solicitudes.value));
};

const cargarDesdeLocalStorage = () => {
  const datos = localStorage.getItem('solicitudesFondos');
  if (datos) {
    solicitudes.value = JSON.parse(datos);

    // Al cargar, verificar si hay solicitudes pendientes para bloquear el botón
    const hayPendientes = solicitudes.value.some(s => !s.rendicion);
    bloquearNuevaSolicitud.value = hayPendientes;
  }
};

// Inicialización
onMounted(cargarDesdeLocalStorage);
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
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.v-btn {
  text-transform: none;
}

.headline {
  padding: 16px;
}

/* Estilo para botón deshabilitado con tooltip */
.v-btn--disabled {
  cursor: not-allowed;
}
</style>
