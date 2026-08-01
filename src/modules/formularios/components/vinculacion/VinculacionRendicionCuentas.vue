<template>
  <div class="vinculacion-container">
    <v-divider class="my-4"></v-divider>

    <v-card-subtitle class="text-h6 d-flex align-center">
      <v-icon icon="mdi-link-variant" class="mr-2" color="primary"></v-icon>
      Vinculación de la Rendición de Cuentas - Actividad
      <v-chip size="small" color="info" variant="tonal" class="ml-3"> Opcional </v-chip>
    </v-card-subtitle>
    <br />

    <div class="form-section-vinculacion">
      <!-- Indicador de carga -->
      <v-progress-linear
        v-if="cargando"
        indeterminate
        color="primary"
        class="mb-4"
      ></v-progress-linear>

      <v-row>
        <v-col cols="12">
          <div class="text-subtitle-2 text-grey-darken-1 mb-4">
            Seleccione el tipo de solicitud al que desea vincular esta rendición de cuentas, en
            blanco si no desea vinculacion
          </div>
        </v-col>
      </v-row>

      <v-radio-group v-model="tipoVinculacion" hide-details class="mb-4">
        <v-row>
          <v-col cols="12" md="6">
            <v-radio
              value="solicitud_fondos"
              color="primary"
              class="custom-radio"
              :disabled="!hayFondosDisponibles && !cargandoFondos"
            >
              <template v-slot:label>
                <div class="d-flex align-center w-100">
                  <v-avatar size="40" color="success-light" class="mr-3">
                    <v-icon icon="mdi-cash-multiple" color="success" size="24"></v-icon>
                  </v-avatar>
                  <div>
                    <div class="font-weight-medium text-body-1">Solicitud de Fondos</div>
                    <div class="text-caption text-grey">
                      Vincular a una solicitud de fondos existente
                    </div>
                    <div v-if="totalFondosVinculadas > 0" class="text-caption text-warning">
                      {{ totalFondosVinculadas }} solicitud(es) ya vinculada(s)
                    </div>
                    <div
                      v-if="!hayFondosDisponibles && !cargandoFondos"
                      class="text-caption text-error"
                    >
                      No hay solicitudes disponibles
                    </div>
                  </div>
                </div>
              </template>
            </v-radio>
          </v-col>

          <v-col cols="12" md="6">
            <v-radio
              value="solicitud_viaje"
              color="primary"
              class="custom-radio"
              :disabled="!hayViajesDisponibles && !cargandoViajes"
            >
              <template v-slot:label>
                <div class="d-flex align-center w-100">
                  <v-avatar size="40" color="info-light" class="mr-3">
                    <v-icon icon="mdi-airplane" color="info" size="24"></v-icon>
                  </v-avatar>
                  <div>
                    <div class="font-weight-medium text-body-1">Solicitud de Viaje</div>
                    <div class="text-caption text-grey">
                      Vincular a una solicitud de viaje existente
                    </div>
                    <div v-if="totalViajesVinculadas > 0" class="text-caption text-warning">
                      {{ totalViajesVinculadas }} solicitud(es) ya vinculada(s)
                    </div>
                    <div
                      v-if="!hayViajesDisponibles && !cargandoViajes"
                      class="text-caption text-error"
                    >
                      No hay solicitudes disponibles
                    </div>
                  </div>
                </div>
              </template>
            </v-radio>
          </v-col>
          <v-col cols="12" md="4">
            <v-radio
              value="solicitud_pago_directo"
              color="primary"
              class="custom-radio"
              :disabled="!hayPagoDirectoDisponibles && !cargandoPagoDirecto"
            >
              <template v-slot:label>
                <div class="d-flex align-center w-100">
                  <v-avatar size="40" color="warning-light" class="mr-3">
                    <v-icon icon="mdi-credit-card" color="warning" size="24"></v-icon>
                  </v-avatar>
                  <div>
                    <div class="font-weight-medium text-body-1">Solicitud de Pago Directo</div>
                    <div class="text-caption text-grey">
                      Vincular a una solicitud de pago directo existente
                    </div>
                    <div v-if="totalPagoDirectoVinculadas > 0" class="text-caption text-warning">
                      {{ totalPagoDirectoVinculadas }} solicitud(es) ya vinculada(s)
                    </div>
                    <div
                      v-if="!hayPagoDirectoDisponibles && !cargandoPagoDirecto"
                      class="text-caption text-error"
                    >
                      No hay solicitudes disponibles
                    </div>
                  </div>
                </div>
              </template>
            </v-radio>
          </v-col>
        </v-row>
      </v-radio-group>

      <!-- Selector para Solicitud de Fondos (usando autocomplete) -->
      <v-expand-transition>
        <div v-if="tipoVinculacion === 'solicitud_fondos'" class="mt-2">
          <v-autocomplete
            v-model="solicitudFondosSeleccionada"
            :items="solicitudesFondosDisponibles"
            :loading="cargandoFondos"
            item-title="displayText"
            item-value="id"
            label="Buscar Solicitud de Fondos"
            variant="outlined"
            density="comfortable"
            placeholder="Escriba para buscar solicitud de fondos..."
            prepend-inner-icon="mdi-magnify"
            clearable
            class="mb-3"
            return-object
          >
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props">
                <template v-slot:prepend>
                  <v-badge
                    :color="getEstadoColor(item.raw.estado_validacion)"
                    dot
                    offset-x="8"
                    offset-y="8"
                  >
                    <v-icon icon="mdi-cash-multiple" color="success"></v-icon>
                  </v-badge>
                </template>
                <v-list-item-title class="font-weight-medium">
                  <strong>DESCRIPCION ACTIVIDAD:</strong>{{ item.raw.descripcion_actividad }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  <div class="d-flex flex-wrap gap-2 mt-1">
                    <v-chip size="x-small" variant="outlined" color="grey">
                      <v-icon icon="mdi-calendar" size="12" class="mr-1"></v-icon>
                      {{ formatFecha(item.raw.fechaSolicitud) }}
                    </v-chip>
                    <v-chip size="x-small" variant="outlined" color="success">
                      <v-icon icon="mdi-currency-usd" size="12" class="mr-1"></v-icon>
                      {{ formatMonto(item.raw.montoSolicitado) }}
                    </v-chip>
                    <v-chip
                      :color="getEstadoColor(item.raw.estado_validacion)"
                      size="x-small"
                      text-color="white"
                    >
                      {{ getEstadoTexto(item.raw.estado_validacion) }}
                    </v-chip>
                  </div>
                </v-list-item-subtitle>
              </v-list-item>
            </template>

            <template v-slot:selection="{ item }">
              <div class="d-flex align-center">
                <v-icon icon="mdi-cash-multiple" size="small" class="mr-2" color="success"></v-icon>
                <span>CODIGO: {{ item.raw.numeroFormulario }}</span>
                <v-chip size="x-small" class="ml-2" variant="tonal" color="success">
                  MONTO SOLICITADO: {{ formatMonto(item.raw.montoSolicitado) }}
                </v-chip>
              </div>
            </template>
          </v-autocomplete>

          <!-- Advertencia si hay solicitudes vinculadas -->
          <v-alert
            v-if="totalFondosVinculadas > 0"
            type="info"
            variant="tonal"
            density="compact"
            class="mb-3"
          >
            <div class="d-flex align-center">
              <v-icon icon="mdi-information" size="20" class="mr-2"></v-icon>
              <span
                >{{ totalFondosVinculadas }} solicitud(es) de fondos ya están vinculadas a otras
                rendiciones</span
              >
            </div>
          </v-alert>

          <!-- Tarjeta de detalle de la solicitud seleccionada -->
          <v-expand-transition>
            <v-card
              v-if="solicitudFondosSeleccionada"
              variant="tonal"
              :color="getEstadoColor(solicitudFondosSeleccionada.estado_validacion)"
              class="mt-3"
              rounded="lg"
            >
              <v-card-text class="pa-4">
                <div class="d-flex justify-space-between align-start mb-2">
                  <div>
                    <div class="text-h6 font-weight-medium">
                      {{ solicitudFondosSeleccionada.numeroFormulario }}
                    </div>
                    <div class="text-caption text-grey">
                      Solicitante:
                      {{
                        solicitudFondosSeleccionada.solicitante?.nombre_completo || 'No asignado'
                      }}
                    </div>
                  </div>
                  <v-chip
                    :color="getEstadoColor(solicitudFondosSeleccionada.estado_validacion)"
                    size="small"
                    text-color="white"
                  >
                    {{ getEstadoTexto(solicitudFondosSeleccionada.estado_validacion) }}
                  </v-chip>
                </div>

                <v-divider class="my-3"></v-divider>

                <v-row>
                  <v-col cols="12" sm="4">
                    <div class="text-caption text-grey">Monto Solicitado</div>
                    <div class="text-h6 font-weight-bold text-success">
                      {{ formatMonto(solicitudFondosSeleccionada.montoSolicitado) }}
                    </div>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <div class="text-caption text-grey">Fecha de Solicitud</div>
                    <div class="font-weight-medium">
                      {{ formatFecha(solicitudFondosSeleccionada.fechaSolicitud) }}
                    </div>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <div class="text-caption text-grey">Forma de Pago</div>
                    <div class="font-weight-medium">
                      {{ solicitudFondosSeleccionada.forma_pago_nombre || 'No especificada' }}
                    </div>
                  </v-col>
                </v-row>

                <div v-if="solicitudFondosSeleccionada.descripcion_actividad" class="mt-2">
                  <div class="text-caption text-grey">Descripción</div>
                  <div class="text-body-2">
                    {{ solicitudFondosSeleccionada.descripcion_actividad }}
                  </div>
                </div>

                <div v-if="solicitudFondosSeleccionada.lugarSolicitud" class="mt-2">
                  <div class="text-caption text-grey">Lugar</div>
                  <div class="text-body-2">
                    {{ solicitudFondosSeleccionada.lugarSolicitud }}
                  </div>
                </div>

                <!-- Detalle de partidas -->
                <div
                  v-if="solicitudFondosSeleccionada.detalleDestinoFondos?.items?.length"
                  class="mt-3"
                >
                  <div class="text-caption text-grey font-weight-bold mb-2">Detalle de Gastos:</div>
                  <v-table density="compact">
                    <thead>
                      <tr>
                        <th>Partida</th>
                        <th>Fuente</th>
                        <th>Concepto</th>
                        <th>Monto</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(item, idx) in solicitudFondosSeleccionada.detalleDestinoFondos
                          .items"
                        :key="idx"
                      >
                        <td>{{ item.partida_sf || item.partida }}</td>
                        <td>{{ item.fuente }}</td>
                        <td>{{ item.concepto }}</td>
                        <td>{{ formatMonto(item.monto) }}</td>
                      </tr>
                    </tbody>
                  </v-table>
                </div>
              </v-card-text>
            </v-card>
          </v-expand-transition>

          <!-- Collapsable: Rendiciones vinculadas a solicitudes de fondos -->
          <v-expansion-panels v-if="solicitudesFondosVinculadas.length > 0" class="mt-4">
            <v-expansion-panel>
              <v-expansion-panel-title class="text-subtitle-1 font-weight-medium">
                <v-icon icon="mdi-history" class="mr-2" color="warning"></v-icon>
                Solicitudes de Fondos ya vinculadas ({{ solicitudesFondosVinculadas.length }})
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-list>
                  <v-list-item
                    v-for="solicitud in solicitudesFondosVinculadas"
                    :key="solicitud.id"
                    class="mb-2"
                    border
                    rounded
                  >
                    <template v-slot:prepend>
                      <v-icon icon="mdi-cash-multiple" color="grey"></v-icon>
                    </template>
                    <v-list-item-title class="font-weight-medium">
                      {{ solicitud.numeroFormulario }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      <div class="d-flex flex-wrap gap-2 mt-1">
                        <v-chip size="x-small" variant="outlined" color="grey">
                          <v-icon icon="mdi-calendar" size="12" class="mr-1"></v-icon>
                          {{ formatFecha(solicitud.fechaSolicitud) }}
                        </v-chip>
                        <v-chip size="x-small" variant="outlined" color="success">
                          <v-icon icon="mdi-currency-usd" size="12" class="mr-1"></v-icon>
                          {{ formatMonto(solicitud.montoSolicitado) }}
                        </v-chip>
                        <v-chip size="x-small" color="warning" variant="tonal">
                          <v-icon icon="mdi-link" size="12" class="mr-1"></v-icon>
                          Vinculada
                        </v-chip>
                      </div>
                    </v-list-item-subtitle>
                    <template v-slot:append>
                      <v-tooltip location="left">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            v-bind="props"
                            icon="mdi-information"
                            variant="text"
                            size="small"
                            color="info"
                            @click="verRendicionVinculada(solicitud.id, 'fondos')"
                          ></v-btn>
                        </template>
                        <span>Ver rendición vinculada</span>
                      </v-tooltip>
                    </template>
                  </v-list-item>
                </v-list>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </v-expand-transition>

      <!-- Selector para Solicitud de Viaje (usando autocomplete) -->
      <v-expand-transition>
        <div v-if="tipoVinculacion === 'solicitud_viaje'" class="mt-2">
          <v-autocomplete
            v-model="solicitudViajeSeleccionada"
            :items="solicitudesViajeDisponibles"
            :loading="cargandoViajes"
            item-title="displayText"
            item-value="id"
            label="Buscar Solicitud de Viaje"
            variant="outlined"
            density="comfortable"
            placeholder="Escriba para buscar solicitud de viaje..."
            prepend-inner-icon="mdi-magnify"
            clearable
            class="mb-3"
            return-object
          >
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props">
                <template v-slot:prepend>
                  <v-badge
                    :color="getEstadoColor(item.raw.estado_validacion)"
                    dot
                    offset-x="8"
                    offset-y="8"
                  >
                    <v-icon icon="mdi-airplane" color="info"></v-icon>
                  </v-badge>
                </template>
                <v-list-item-title class="font-weight-medium">
                  <strong>EVENTO:</strong> {{ item.raw.evento }} - <strong>LUGAR:</strong>
                  {{ item.raw.lugarEvento }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  <div class="d-flex flex-wrap gap-2 mt-1">
                    <v-chip size="x-small" variant="outlined" color="grey">
                      <v-icon icon="mdi-calendar" size="12" class="mr-1"></v-icon>
                      {{ formatFecha(item.raw.fechaSolicitud) }}
                    </v-chip>
                    <v-chip size="x-small" variant="outlined" color="info">
                      <v-icon icon="mdi-map-marker" size="12" class="mr-1"></v-icon>
                      {{ item.raw.lugarEvento || item.raw.destino }}
                    </v-chip>
                    <v-chip
                      :color="getEstadoColor(item.raw.estado_validacion)"
                      size="x-small"
                      text-color="white"
                    >
                      {{ getEstadoTexto(item.raw.estado_validacion) }}
                    </v-chip>
                  </div>
                </v-list-item-subtitle>
              </v-list-item>
            </template>

            <template v-slot:selection="{ item }">
              <div class="d-flex align-center">
                <v-icon icon="mdi-airplane" size="small" class="mr-2" color="info"></v-icon>
                <span>{{ item.raw.numeroFormulario }}</span>
                <v-chip size="x-small" class="ml-2" variant="tonal" color="info">
                  EVENTO: {{ item.raw.evento }} LUGAR:
                  {{ item.raw.lugarEvento || item.raw.destino }} MONTO SOLICITADO(Bs):
                  {{ item.raw.montoSolicitado }}
                </v-chip>
              </div>
            </template>
          </v-autocomplete>

          <!-- Advertencia si hay solicitudes vinculadas -->
          <v-alert
            v-if="totalViajesVinculadas > 0"
            type="info"
            variant="tonal"
            density="compact"
            class="mb-3"
          >
            <div class="d-flex align-center">
              <v-icon icon="mdi-information" size="20" class="mr-2"></v-icon>
              <span
                >{{ totalViajesVinculadas }} solicitud(es) de viaje ya están vinculadas a otras
                rendiciones</span
              >
            </div>
          </v-alert>

          <!-- Tarjeta de detalle de la solicitud de viaje -->
          <v-expand-transition>
            <v-card
              v-if="solicitudViajeSeleccionada"
              variant="tonal"
              :color="getEstadoColor(solicitudViajeSeleccionada.estado_validacion)"
              class="mt-3"
              rounded="lg"
            >
              <v-card-text class="pa-4">
                <div class="d-flex justify-space-between align-start mb-2">
                  <div>
                    <div class="text-h6 font-weight-medium">
                      {{ solicitudViajeSeleccionada.numeroFormulario }}
                    </div>
                    <div class="text-caption text-grey">
                      Solicitante:
                      {{ solicitudViajeSeleccionada.solicitante?.nombre_completo || 'No asignado' }}
                    </div>
                  </div>
                  <v-chip
                    :color="getEstadoColor(solicitudViajeSeleccionada.estado_validacion)"
                    size="small"
                    text-color="white"
                  >
                    {{ getEstadoTexto(solicitudViajeSeleccionada.estado_validacion) }}
                  </v-chip>
                </div>

                <v-divider class="my-3"></v-divider>

                <v-row>
                  <v-col cols="12" sm="4">
                    <div class="text-caption text-grey">Evento</div>
                    <div class="font-weight-medium">
                      {{ solicitudViajeSeleccionada.evento || 'No especificado' }}
                    </div>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <div class="text-caption text-grey">Lugar</div>
                    <div class="font-weight-medium">
                      <v-icon icon="mdi-map-marker" size="16" class="mr-1"></v-icon>
                      {{
                        solicitudViajeSeleccionada.lugarEvento || solicitudViajeSeleccionada.destino
                      }}
                    </div>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <div class="text-caption text-grey">Fecha del Evento</div>
                    <div class="font-weight-medium">
                      {{
                        formatFecha(
                          solicitudViajeSeleccionada.fechaEvento ||
                            solicitudViajeSeleccionada.fecha_inicio,
                        )
                      }}
                    </div>
                  </v-col>
                </v-row>

                <v-row class="mt-2">
                  <v-col cols="12" sm="6">
                    <div class="text-caption text-grey">Monto Solicitado</div>
                    <div class="font-weight-medium text-success">
                      {{ formatMonto(solicitudViajeSeleccionada.montoSolicitado) }}
                    </div>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <div class="text-caption text-grey">Forma de Pago</div>
                    <div class="font-weight-medium">
                      {{ solicitudViajeSeleccionada.forma_pago_nombre || 'No especificada' }}
                    </div>
                  </v-col>
                </v-row>

                <div v-if="solicitudViajeSeleccionada.justificacionAsistencia" class="mt-2">
                  <div class="text-caption text-grey">Justificación</div>
                  <div class="text-body-2">
                    {{ solicitudViajeSeleccionada.justificacionAsistencia }}
                  </div>
                </div>

                <!-- Detalle de gastos del viaje -->
                <div v-if="solicitudViajeSeleccionada.detalleGasto?.items?.length" class="mt-3">
                  <div class="text-caption text-grey font-weight-bold mb-2">Detalle de Gastos:</div>
                  <v-table density="compact">
                    <thead>
                      <tr>
                        <th>Partida</th>
                        <th>Fuente</th>
                        <th>Concepto</th>
                        <th>Monto</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(item, idx) in solicitudViajeSeleccionada.detalleGasto.items"
                        :key="idx"
                      >
                        <td>{{ item.partida }}</td>
                        <td>{{ item.fuente }}</td>
                        <td>{{ item.concepto }}</td>
                        <td>{{ formatMonto(item.monto) }}</td>
                      </tr>
                    </tbody>
                  </v-table>
                </div>
              </v-card-text>
            </v-card>
          </v-expand-transition>

          <!-- Collapsable: Rendiciones vinculadas a solicitudes de viaje -->
          <v-expansion-panels v-if="solicitudesViajeVinculadas.length > 0" class="mt-4">
            <v-expansion-panel>
              <v-expansion-panel-title class="text-subtitle-1 font-weight-medium">
                <v-icon icon="mdi-history" class="mr-2" color="warning"></v-icon>
                Solicitudes de Viaje ya vinculadas ({{ solicitudesViajeVinculadas.length }})
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-list>
                  <v-list-item
                    v-for="solicitud in solicitudesViajeVinculadas"
                    :key="solicitud.id"
                    class="mb-2"
                    border
                    rounded
                  >
                    <template v-slot:prepend>
                      <v-icon icon="mdi-airplane" color="grey"></v-icon>
                    </template>
                    <v-list-item-title class="font-weight-medium">
                      {{ solicitud.numeroFormulario }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      <div class="d-flex flex-wrap gap-2 mt-1">
                        <v-chip size="x-small" variant="outlined" color="grey">
                          <v-icon icon="mdi-calendar" size="12" class="mr-1"></v-icon>
                          {{ formatFecha(solicitud.fechaSolicitud) }}
                        </v-chip>
                        <v-chip size="x-small" variant="outlined" color="info">
                          <v-icon icon="mdi-map-marker" size="12" class="mr-1"></v-icon>
                          {{ solicitud.lugarEvento || solicitud.destino }}
                        </v-chip>
                        <v-chip size="x-small" color="warning" variant="tonal">
                          <v-icon icon="mdi-link" size="12" class="mr-1"></v-icon>
                          Vinculada
                        </v-chip>
                      </div>
                    </v-list-item-subtitle>
                    <template v-slot:append>
                      <v-tooltip location="left">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            v-bind="props"
                            icon="mdi-information"
                            variant="text"
                            size="small"
                            color="info"
                            @click="verRendicionVinculada(solicitud.id, 'viajes')"
                          ></v-btn>
                        </template>
                        <span>Ver rendición vinculada</span>
                      </v-tooltip>
                    </template>
                  </v-list-item>
                </v-list>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </v-expand-transition>
      <!-- Selector para Solicitud de Pago Directo -->
      <v-expand-transition>
        <div v-if="tipoVinculacion === 'solicitud_pago_directo'" class="mt-2">
          <v-autocomplete
            v-model="solicitudPagoDirectoSeleccionada"
            :items="solicitudesPagoDirectoDisponibles"
            :loading="cargandoPagoDirecto"
            item-title="displayText"
            item-value="id"
            label="Buscar Solicitud de Pago Directo"
            variant="outlined"
            density="comfortable"
            placeholder="Escriba para buscar solicitud de pago directo..."
            prepend-inner-icon="mdi-magnify"
            clearable
            class="mb-3"
            return-object
          >
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props">
                <template v-slot:prepend>
                  <v-badge
                    :color="getEstadoColor(item.raw.estado_validacion)"
                    dot
                    offset-x="8"
                    offset-y="8"
                  >
                    <v-icon icon="mdi-credit-card" color="warning"></v-icon>
                  </v-badge>
                </template>
                <v-list-item-title class="font-weight-medium">
                  <strong>DESCRIPCION:</strong> {{ item.raw.descripcion_actividad }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  <div class="d-flex flex-wrap gap-2 mt-1">
                    <v-chip size="x-small" variant="outlined" color="grey">
                      <v-icon icon="mdi-calendar" size="12" class="mr-1"></v-icon>
                      {{ formatFecha(item.raw.fechaSolicitud) }}
                    </v-chip>
                    <v-chip size="x-small" variant="outlined" color="warning">
                      <v-icon icon="mdi-currency-usd" size="12" class="mr-1"></v-icon>
                      {{ formatMonto(item.raw.montoSolicitado) }}
                    </v-chip>
                    <v-chip
                      :color="getEstadoColor(item.raw.estado_validacion)"
                      size="x-small"
                      text-color="white"
                    >
                      {{ getEstadoTexto(item.raw.estado_validacion) }}
                    </v-chip>
                  </div>
                </v-list-item-subtitle>
              </v-list-item>
            </template>
            <template v-slot:selection="{ item }">
              <div class="d-flex align-center">
                <v-icon icon="mdi-credit-card" size="small" class="mr-2" color="warning"></v-icon>
                <span>CODIGO: {{ item.raw.numeroFormulario }}</span>
                <v-chip size="x-small" class="ml-2" variant="tonal" color="warning">
                  MONTO: {{ formatMonto(item.raw.montoSolicitado) }}
                </v-chip>
              </div>
            </template>
          </v-autocomplete>

          <!-- Advertencia si hay solicitudes vinculadas -->
          <v-alert
            v-if="totalPagoDirectoVinculadas > 0"
            type="info"
            variant="tonal"
            density="compact"
            class="mb-3"
          >
            <div class="d-flex align-center">
              <v-icon icon="mdi-information" size="20" class="mr-2"></v-icon>
              <span
                >{{ totalPagoDirectoVinculadas }} solicitud(es) de pago directo ya están
                vinculadas</span
              >
            </div>
          </v-alert>

          <!-- Tarjeta de detalle -->
          <v-expand-transition>
            <v-card
              v-if="solicitudPagoDirectoSeleccionada"
              variant="tonal"
              :color="getEstadoColor(solicitudPagoDirectoSeleccionada.estado_validacion)"
              class="mt-3"
              rounded="lg"
            >
              <v-card-text class="pa-4">
                <div class="d-flex justify-space-between align-start mb-2">
                  <div>
                    <div class="text-h6 font-weight-medium">
                      {{ solicitudPagoDirectoSeleccionada.numeroFormulario }}
                    </div>
                    <div class="text-caption text-grey">
                      Solicitante:
                      {{
                        solicitudPagoDirectoSeleccionada.solicitante?.nombre_completo ||
                        'No asignado'
                      }}
                    </div>
                  </div>
                  <v-chip
                    :color="getEstadoColor(solicitudPagoDirectoSeleccionada.estado_validacion)"
                    size="small"
                    text-color="white"
                  >
                    {{ getEstadoTexto(solicitudPagoDirectoSeleccionada.estado_validacion) }}
                  </v-chip>
                </div>
                <v-divider class="my-3"></v-divider>
                <v-row>
                  <v-col cols="12" sm="4">
                    <div class="text-caption text-grey">Monto Solicitado</div>
                    <div class="text-h6 font-weight-bold text-success">
                      {{ formatMonto(solicitudPagoDirectoSeleccionada.montoSolicitado) }}
                    </div>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <div class="text-caption text-grey">Fecha de Solicitud</div>
                    <div class="font-weight-medium">
                      {{ formatFecha(solicitudPagoDirectoSeleccionada.fechaSolicitud) }}
                    </div>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <div class="text-caption text-grey">Forma de Pago</div>
                    <div class="font-weight-medium">
                      {{ solicitudPagoDirectoSeleccionada.forma_pago_nombre || 'No especificada' }}
                    </div>
                  </v-col>
                </v-row>
                <div v-if="solicitudPagoDirectoSeleccionada.descripcion_actividad" class="mt-2">
                  <div class="text-caption text-grey">Descripción</div>
                  <div class="text-body-2">
                    {{ solicitudPagoDirectoSeleccionada.descripcion_actividad }}
                  </div>
                </div>
                <div v-if="solicitudPagoDirectoSeleccionada.lugarSolicitud" class="mt-2">
                  <div class="text-caption text-grey">Lugar</div>
                  <div class="text-body-2">
                    {{ solicitudPagoDirectoSeleccionada.lugarSolicitud }}
                  </div>
                </div>
                <div
                  v-if="solicitudPagoDirectoSeleccionada.detalleDestinoFondos?.items?.length"
                  class="mt-3"
                >
                  <div class="text-caption text-grey font-weight-bold mb-2">Detalle de Gastos:</div>
                  <v-table density="compact">
                    <thead>
                      <tr>
                        <th>Partida</th>
                        <th>Fuente</th>
                        <th>Concepto</th>
                        <th>Monto</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(item, idx) in solicitudPagoDirectoSeleccionada.detalleDestinoFondos
                          .items"
                        :key="idx"
                      >
                        <td>{{ item.partida_sf || item.partida }}</td>
                        <td>{{ item.fuente }}</td>
                        <td>{{ item.concepto }}</td>
                        <td>{{ formatMonto(item.monto) }}</td>
                      </tr>
                    </tbody>
                  </v-table>
                </div>
              </v-card-text>
            </v-card>
          </v-expand-transition>

          <!-- Collapsable: Vinculadas -->
          <v-expansion-panels v-if="solicitudesPagoDirectoVinculadas.length > 0" class="mt-4">
            <v-expansion-panel>
              <v-expansion-panel-title class="text-subtitle-1 font-weight-medium">
                <v-icon icon="mdi-history" class="mr-2" color="warning"></v-icon>
                Solicitudes de Pago Directo ya vinculadas ({{
                  solicitudesPagoDirectoVinculadas.length
                }})
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-list>
                  <v-list-item
                    v-for="solicitud in solicitudesPagoDirectoVinculadas"
                    :key="solicitud.id"
                    class="mb-2"
                    border
                    rounded
                  >
                    <template v-slot:prepend>
                      <v-icon icon="mdi-credit-card" color="grey"></v-icon>
                    </template>
                    <v-list-item-title class="font-weight-medium">{{
                      solicitud.numeroFormulario
                    }}</v-list-item-title>
                    <v-list-item-subtitle>
                      <div class="d-flex flex-wrap gap-2 mt-1">
                        <v-chip size="x-small" variant="outlined" color="grey">
                          <v-icon icon="mdi-calendar" size="12" class="mr-1"></v-icon>
                          {{ formatFecha(solicitud.fechaSolicitud) }}
                        </v-chip>
                        <v-chip size="x-small" variant="outlined" color="warning">
                          <v-icon icon="mdi-currency-usd" size="12" class="mr-1"></v-icon>
                          {{ formatMonto(solicitud.montoSolicitado) }}
                        </v-chip>
                        <v-chip size="x-small" color="warning" variant="tonal">
                          <v-icon icon="mdi-link" size="12" class="mr-1"></v-icon>
                          Vinculada
                        </v-chip>
                      </div>
                    </v-list-item-subtitle>
                    <template v-slot:append>
                      <v-tooltip location="left">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            v-bind="props"
                            icon="mdi-information"
                            variant="text"
                            size="small"
                            color="info"
                            @click="verRendicionVinculada(solicitud.id, 'pago_directo')"
                          ></v-btn>
                        </template>
                        <span>Ver rendición vinculada</span>
                      </v-tooltip>
                    </template>
                  </v-list-item>
                </v-list>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </v-expand-transition>

      <!-- Mensaje cuando no hay solicitudes disponibles -->
      <v-expand-transition>
        <v-alert
          v-if="tipoVinculacion && !haySolicitudesDisponibles && !cargando"
          type="warning"
          variant="tonal"
          class="mt-4"
          density="comfortable"
          border="start"
        >
          <div class="d-flex align-center">
            <v-icon icon="mdi-alert" size="24" class="mr-3"></v-icon>
            <div>
              <div class="font-weight-medium">No hay solicitudes disponibles</div>
              <div class="text-caption">
                {{ mensajeNoDisponible }}
              </div>
            </div>
          </div>
        </v-alert>
      </v-expand-transition>

      <!-- Mensaje de confirmación de selección -->
      <v-expand-transition>
        <v-alert
          v-if="
            tipoVinculacion &&
            (solicitudFondosSeleccionada ||
              solicitudViajeSeleccionada ||
              solicitudPagoDirectoSeleccionada)
          "
          type="success"
          variant="tonal"
          class="mt-4"
          density="comfortable"
          border="start"
        >
          <div class="d-flex align-center">
            <v-icon icon="mdi-check-circle" size="24" class="mr-3"></v-icon>
            <div>
              <div class="font-weight-medium">
                {{
                  tipoVinculacion === 'solicitud_fondos'
                    ? 'Solicitud de Fondos'
                    : tipoVinculacion === 'solicitud_viaje'
                      ? 'Solicitud de Viaje'
                      : 'Solicitud de Pago Directo'
                }}
                seleccionada
              </div>
              <div class="text-caption">
                Esta rendición de cuentas se vinculará automáticamente a la solicitud seleccionada
              </div>
            </div>
          </div>
        </v-alert>
      </v-expand-transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useSolicitudesStore } from '../../store/useSolicitudesStore'

// Props
const props = defineProps({
  idActividad: {
    type: [Number, String],
    required: true,
    default: null,
  },
})

// Emits
const emit = defineEmits(['update:vinculacion', 'confirmar', 'verRendicion'])

// Store
const solicitudesStore = useSolicitudesStore()

// Estado local
const tipoVinculacion = ref(null)
const solicitudFondosSeleccionada = ref(null) //sol de fondo selec
const solicitudViajeSeleccionada = ref(null) //sol de viaje selec
const solicitudPagoDirectoSeleccionada = ref(null) // sol de pago direc selec
//Estados de carga
const loading = ref(false)
const error = ref(null)

// Computed para obtener datos del store
const solicitudesFondos = computed(() => {
  const solicitudes = solicitudesStore.solicitudesFondosActividad || []
  return solicitudes.filter((s) => s.estado_validacion === 'Aprobado')
})
const solicitudesViaje = computed(() => {
  const solicitudes = solicitudesStore.solicitudesViajeActividad || []
  return solicitudes.filter((s) => s.estado_validacion === 'Aprobado')
})
const solicitudesPagoDirecto = computed(() => {
  const solicitudes = solicitudesStore.solicitudesPagoDirectoActividad || []
  return solicitudes.filter((s) => s.estado_validacion === 'Aprobado')
})
const rendicionesExistentes = computed(
  () => solicitudesStore.rendicionesCuentasExistentesActividad || [],
)

//Computed - banderas de carga
const cargandoFondos = computed(() => solicitudesStore.loadingFondosActividad)
const cargandoViajes = computed(() => solicitudesStore.loadingViajesActividad)
const cargando = computed(() => cargandoFondos.value || cargandoViajes.value)
const cargandoPagoDirecto = computed(() => solicitudesStore.loadingPagoDirectoActividad)

// IDs de solicitudes ya vinculadas
const idsFondosVinculadas = computed(() => {
  if (!rendicionesExistentes.value.length) return new Set()

  return new Set(
    rendicionesExistentes.value
      .filter((rendicion) => rendicion.solicitudFondos)
      .map((rendicion) => rendicion.solicitudFondos),
  )
})

//Ids de SOl de viajes vinculadas
const idsViajesVinculadas = computed(() => {
  if (!rendicionesExistentes.value.length) return new Set()

  return new Set(
    rendicionesExistentes.value
      .filter((rendicion) => rendicion.solicitudViaje)
      .map((rendicion) => rendicion.solicitudViaje),
  )
})

// IDs de solicitudes de pago directo ya vinculadas
const idsPagoDirectoVinculadas = computed(() => {
  if (!rendicionesExistentes.value.length) return new Set()
  return new Set(
    rendicionesExistentes.value
      .filter((rendicion) => rendicion.solicitudPagoDirecto)
      .map((rendicion) => rendicion.solicitudPagoDirecto),
  )
})

// Solicitudes disponibles (no vinculadas)
const solicitudesFondosDisponibles = computed(() => {
  if (!solicitudesFondos.value.length) return []

  return solicitudesFondos.value
    .filter((solicitud) => !idsFondosVinculadas.value.has(solicitud.id))
    .map((solicitud) => ({
      ...solicitud,
      displayText: `${solicitud.numeroFormulario} - ${formatMonto(solicitud.montoSolicitado)}`,
    }))
})

const solicitudesViajeDisponibles = computed(() => {
  if (!solicitudesViaje.value.length) return []

  return solicitudesViaje.value
    .filter((solicitud) => !idsViajesVinculadas.value.has(solicitud.id))
    .map((solicitud) => ({
      ...solicitud,
      displayText: `${solicitud.numeroFormulario} - ${solicitud.lugarEvento || solicitud.destino}`,
    }))
})
// Solicitudes de Pago Directo disponibles (no vinculadas)
const solicitudesPagoDirectoDisponibles = computed(() => {
  if (!solicitudesPagoDirecto.value.length) return []
  return solicitudesPagoDirecto.value
    .filter((solicitud) => !idsPagoDirectoVinculadas.value.has(solicitud.id))
    .map((solicitud) => ({
      ...solicitud,
      displayText: `${solicitud.numeroFormulario} - ${formatMonto(solicitud.montoSolicitado)}`,
    }))
})

// Solicitudes vinculadas (para mostrar en collapsable)
const solicitudesFondosVinculadas = computed(() => {
  if (!solicitudesFondos.value.length) return []

  return solicitudesFondos.value.filter((solicitud) => idsFondosVinculadas.value.has(solicitud.id))
})

const solicitudesViajeVinculadas = computed(() => {
  if (!solicitudesViaje.value.length) return []

  return solicitudesViaje.value.filter((solicitud) => idsViajesVinculadas.value.has(solicitud.id))
})
// Solicitudes de Pago Directo vinculadas (para collapsable)
const solicitudesPagoDirectoVinculadas = computed(() => {
  if (!solicitudesPagoDirecto.value.length) return []
  return solicitudesPagoDirecto.value.filter((solicitud) =>
    idsPagoDirectoVinculadas.value.has(solicitud.id),
  )
})

// Totales de vinculadas
const totalFondosVinculadas = computed(() => idsFondosVinculadas.value.size)
const totalViajesVinculadas = computed(() => idsViajesVinculadas.value.size)
const totalPagoDirectoVinculadas = computed(() => idsPagoDirectoVinculadas.value.size)

const hayFondosDisponibles = computed(() => solicitudesFondosDisponibles.value.length > 0)
const hayViajesDisponibles = computed(() => solicitudesViajeDisponibles.value.length > 0)
const hayPagoDirectoDisponibles = computed(() => solicitudesPagoDirectoDisponibles.value.length > 0)

const haySolicitudesDisponibles = computed(() => {
  if (tipoVinculacion.value === 'solicitud_fondos') return hayFondosDisponibles.value
  if (tipoVinculacion.value === 'solicitud_viaje') return hayViajesDisponibles.value
  if (tipoVinculacion.value === 'solicitud_pago_directo') return hayPagoDirectoDisponibles.value
  return true
})

//Mensajes de NO DISPONIBLE
const mensajeNoDisponible = computed(() => {
  if (tipoVinculacion.value === 'solicitud_fondos') {
    return 'No hay solicitudes de fondos disponibles para vincular a esta rendición'
  } else if (tipoVinculacion.value === 'solicitud_viaje') {
    return 'No hay solicitudes de viaje disponibles para vincular a esta rendición'
  } else if (tipoVinculacion.value === 'solicitud_pago_directo') {
    return 'No hay solicitudes de pago directo disponibles para vincular a esta rendición'
  }
  return ''
})

// Función para ver rendición vinculada
const verRendicionVinculada = (solicitudId, tipo) => {
  const rendicion = rendicionesExistentes.value.find((rend) => {
    if (tipo === 'fondos') return rend.solicitudFondos === solicitudId
    if (tipo === 'viajes') return rend.solicitudViaje === solicitudId
    if (tipo === 'pago_directo') return rend.solicitudPagoDirecto === solicitudId
    return false
  })
  if (rendicion) emit('verRendicion', rendicion)
}

// Métodos auxiliares
const formatMonto = (monto) => {
  if (!monto && monto !== 0) return 'Bs. 0.00'
  return new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
    minimumFractionDigits: 2,
  }).format(Number(monto))
}

const formatFecha = (fecha) => {
  if (!fecha) return 'N/A'
  try {
    const date = new Date(fecha)
    if (isNaN(date.getTime())) return fecha
    return date.toLocaleDateString('es-BO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch (error) {
    console.error(error)
    return fecha
  }
}

const getEstadoColor = (estado) => {
  if (!estado) return 'default'
  const estadoLower = estado.toLowerCase()
  if (estadoLower === 'aprobado' || estadoLower === 'aprobada') return 'success'
  if (estadoLower === 'rechazado' || estadoLower === 'rechazada') return 'error'
  if (estadoLower === 'pendiente') return 'warning'
  if (estadoLower === 'revisión' || estadoLower === 'revision') return 'info'
  if (estadoLower === 'enviado' || estadoLower === 'enviada') return 'primary'
  return 'default'
}

const getEstadoTexto = (estado) => {
  if (!estado) return 'Pendiente'
  const estadoLower = estado.toLowerCase()
  if (estadoLower === 'aprobado') return 'Aprobado'
  if (estadoLower === 'rechazado') return 'Rechazado'
  if (estadoLower === 'pendiente') return 'Pendiente'
  if (estadoLower === 'revisión') return 'En Revisión'
  return estado
}

// Cargar datos del store
const cargarDatos = async () => {
  loading.value = true
  try {
    await solicitudesStore.cargarFormulariosDeActividad(props.idActividad)
  } catch (err) {
    console.error('Error al cargar datos', err)
    error.value = err
  } finally {
    loading.value = false
  }
}

// Limpiar selección cuando cambia el tipo de vinculación
watch(tipoVinculacion, () => {
  solicitudFondosSeleccionada.value = null
  solicitudViajeSeleccionada.value = null
  solicitudPagoDirectoSeleccionada.value = null
})

// Watcher para emitir cambios de vinculación
watch(
  [
    tipoVinculacion,
    solicitudFondosSeleccionada,
    solicitudViajeSeleccionada,
    solicitudPagoDirectoSeleccionada,
  ],
  () => {
    if (!tipoVinculacion.value) {
      emit('update:vinculacion', null)
      return
    }
    let vinculacion = null
    if (tipoVinculacion.value === 'solicitud_fondos' && solicitudFondosSeleccionada.value) {
      vinculacion = {
        tipo: 'solicitud_fondos',
        id: solicitudFondosSeleccionada.value.id,
        detalle: solicitudFondosSeleccionada.value,
      }
    } else if (tipoVinculacion.value === 'solicitud_viaje' && solicitudViajeSeleccionada.value) {
      vinculacion = {
        tipo: 'solicitud_viaje',
        id: solicitudViajeSeleccionada.value.id,
        detalle: solicitudViajeSeleccionada.value,
      }
    } else if (
      tipoVinculacion.value === 'solicitud_pago_directo' &&
      solicitudPagoDirectoSeleccionada.value
    ) {
      vinculacion = {
        tipo: 'solicitud_pago_directo',
        id: solicitudPagoDirectoSeleccionada.value.id,
        detalle: solicitudPagoDirectoSeleccionada.value,
      }
    }
    emit('update:vinculacion', vinculacion)
  },
)

// Métodos públicos
const reset = () => {
  tipoVinculacion.value = null
  solicitudFondosSeleccionada.value = null
  solicitudViajeSeleccionada.value = null
  solicitudPagoDirectoSeleccionada.value = null
}

// GET la vinculacion
const getVinculacion = () => {
  if (tipoVinculacion.value === 'solicitud_fondos' && solicitudFondosSeleccionada.value)
    return {
      tipo: 'solicitud_fondos',
      id: solicitudFondosSeleccionada.value.id,
      detalle: solicitudFondosSeleccionada.value,
    }
  if (tipoVinculacion.value === 'solicitud_viaje' && solicitudViajeSeleccionada.value)
    return {
      tipo: 'solicitud_viaje',
      id: solicitudViajeSeleccionada.value.id,
      detalle: solicitudViajeSeleccionada.value,
    }
  if (tipoVinculacion.value === 'solicitud_pago_directo' && solicitudPagoDirectoSeleccionada.value)
    return {
      tipo: 'solicitud_pago_directo',
      id: solicitudPagoDirectoSeleccionada.value.id,
      detalle: solicitudPagoDirectoSeleccionada.value,
    }
  return null
}

const confirmarVinculacion = () => {
  const vinculacion = getVinculacion()
  if (vinculacion) {
    emit('confirmar', vinculacion)
  }
}

// Exponer métodos para el componente padre
defineExpose({
  reset,
  getVinculacion,
  confirmarVinculacion,
})

// Hook de ciclo de vida
// onMounted(() => {
//   cargarDatos()
// })

// Reemplaza el onMounted actual con esto:
onMounted(async () => {
  await cargarDatos()

  console.log('=== DATOS DEL STORE ===')
  console.log('solicitudesFondosActividad:', solicitudesStore.solicitudesFondosActividad)
  console.log('solicitudesViajeActividad:', solicitudesStore.solicitudesViajeActividad)
  console.log('solicitudesPagoDirectoActividad:', solicitudesStore.solicitudesPagoDirectoActividad)
  console.log(
    'rendicionesCuentasExistentesActividad:',
    solicitudesStore.rendicionesCuentasExistentesActividad,
  )

  console.log('=== COMPUTED FILTRADOS ===')
  console.log('solicitudesFondos (Aprobadas):', solicitudesFondos.value)
  console.log('solicitudesViaje (Aprobadas):', solicitudesViaje.value)
  console.log('solicitudePagoDirecto (aprobadas):', solicitudesPagoDirecto.value)

  console.log('=== DISPONIBLES ===')
  console.log('solicitudesFondosDisponibles:', solicitudesFondosDisponibles.value)
  console.log('solicitudesViajeDisponibles:', solicitudesViajeDisponibles.value)
  console.log('solicitudesPagoDirectoDisponibles', solicitudesPagoDirectoDisponibles)

  console.log('=== VINCULADAS ===')
  console.log('idsFondosVinculadas:', [...idsFondosVinculadas.value])
  console.log('idsViajesVinculadas:', [...idsViajesVinculadas.value])
  console.log('idsPDirecotVinculadas:', [...idsPagoDirectoVinculadas.value])
})
</script>

<style scoped>
.vinculacion-container {
  width: 100%;
  margin-bottom: 24px;
}

.form-section-vinculacion {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 24px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.custom-radio {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  padding: 12px;
  transition: all 0.3s ease;
  background-color: white;
}

.custom-radio:hover {
  border-color: #1976d2;
  background-color: rgba(25, 118, 210, 0.04);
}

.custom-radio:deep(.v-radio--disabled) {
  opacity: 0.6;
}

:deep(.v-radio-group .v-radio) {
  margin-bottom: 0;
}

:deep(.v-radio-group .v-row) {
  margin: 0 -8px;
}

:deep(.v-radio-group .v-col) {
  padding: 8px;
}

:deep(.v-list-item-subtitle) {
  white-space: normal;
  word-break: break-word;
}

:deep(.v-alert) {
  border-left: 4px solid;
}

:deep(.v-expansion-panel) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.v-expansion-panel-title) {
  background-color: #fef7e0;
  min-height: 56px;
}

.gap-2 {
  gap: 8px;
}

.text-error {
  color: #d32f2f;
}

.text-warning {
  color: #f57c00;
}

@media (max-width: 600px) {
  .form-section-vinculacion {
    padding: 16px;
  }

  .custom-radio {
    padding: 8px;
  }
}
</style>
