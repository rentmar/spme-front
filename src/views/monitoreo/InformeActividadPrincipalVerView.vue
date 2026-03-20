<template>
  <v-container fluid class="informe-administracion-container pa-6">
    <!-- Overlay de carga -->
    <v-overlay :model-value="loading" class="align-center justify-center" persistent opacity="0.8">
      <div class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
          width="6"
        ></v-progress-circular>
        <p class="mt-4 text-h6">Cargando informe...</p>
      </div>
    </v-overlay>

    <div v-if="!loading && informeActividadPrincipal" class="documento-administracion">
      <!--Titulo de la pagina (igual que la muestra)-->
      <PaginaTituloIcono
        :titulo="'Informe de Actividad'"
        :icon="'mdi-file-document-multiple'"
      ></PaginaTituloIcono>

      <!--Encabezado del Proyecto (igual que la muestra)-->
      <!-- <ProyectoIdHeader
        v-if="informeActividadPrincipal"
        :proyecto-id="informeActividadPrincipal.proyecto"
      ></ProyectoIdHeader> -->

      <!--Encabezado de la Actividad (igual que la muestra)-->
      <ActividadInformacion
        v-if="informeActividadPrincipal"
        :actividad-id="informeActividadPrincipal.actividad"
      />

      <!-- Header con acciones (estilo consistente con la muestra) -->
      <v-sheet class="acciones-sheet mb-6" elevation="1" rounded="lg">
        <v-row class="pa-4">
          <v-col cols="12" md="8" class="d-flex align-center">
            <v-chip :color="getTipoActividadColor" size="small" class="mr-3">
              {{ informeActividadPrincipal.tipoActividad }}
            </v-chip>
            <span class="text-body-2 text-medium-emphasis">
              <v-icon size="small" class="mr-1">mdi-calendar</v-icon>
              Período: {{ formatDate(informeActividadPrincipal.fechaInicio) }} -
              {{ formatDate(informeActividadPrincipal.fechaFin) }}
            </span>
          </v-col>
          <v-col cols="12" md="4" class="d-flex justify-end gap-2">
            <v-btn
              color="primary"
              variant="outlined"
              prepend-icon="mdi-file-pdf-box"
              @click="generarPDF"
              size="small"
            >
              Exportar PDF
            </v-btn>
            <v-btn
              color="success"
              variant="flat"
              prepend-icon="mdi-check"
              :disabled="yaValido"
              @click="abrirDialogoValidacion"
              size="small"
            >
              Validar Informe
            </v-btn>
          </v-col>
        </v-row>
      </v-sheet>

      <!-- Contenido del formulario -->
      <v-row>
        <v-col cols="12" lg="9">
          <!-- Tarjeta principal del informe (estilo consistente con la muestra) -->
          <v-card class="tarjeta-informe" elevation="2" rounded="lg">
            <!-- Cabecera del informe (membrete simplificado) -->
            <div class="pa-4 border-bottom">
              <div class="d-flex justify-space-between align-center">
                <div class="d-flex align-center">
                  <v-icon color="primary" size="28" class="mr-2">mdi-file-document</v-icon>
                  <div>
                    <div class="text-subtitle-1 font-weight-medium">INFORME DE ACTIVIDAD</div>
                    <div class="text-caption text-grey">
                      {{ informeActividadPrincipal.numeroInforme }}
                    </div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-caption text-grey">Fecha de ejecución</div>
                  <div class="font-weight-medium">
                    {{ formatDate(informeActividadPrincipal.fechaEjecucion) }}
                  </div>
                </div>
              </div>
            </div>

            <v-card-text class="pa-4">
              <!-- SECCIÓN 1: INFORMACIÓN GENERAL -->
              <div class="form-section mb-6">
                <h3 class="text-h6 mb-4 primary--text">
                  <v-icon color="primary" class="mr-2">mdi-information</v-icon>
                  1. INFORMACIÓN GENERAL DE LA ACTIVIDAD
                </h3>

                <v-row class="mt-2">
                  <v-col cols="12" md="6" class="campo-formulario">
                    <div class="campo-etiqueta">Código de Actividad</div>
                    <div class="campo-valor">
                      {{ informeActividadPrincipal.codigoActividad || 'No especificado' }}
                    </div>
                  </v-col>
                  <v-col cols="12" md="6" class="campo-formulario">
                    <div class="campo-etiqueta">Nombre de la Actividad</div>
                    <div class="campo-valor">
                      {{ informeActividadPrincipal.nombreActividad || 'No especificado' }}
                    </div>
                  </v-col>
                  <v-col cols="12" class="campo-formulario">
                    <div class="campo-etiqueta">Objetivo de la Actividad</div>
                    <div class="campo-valor campo-texto-largo">
                      {{ informeActividadPrincipal.objetivoActividad || 'No especificado' }}
                    </div>
                  </v-col>
                  <v-col cols="12" class="campo-formulario">
                    <div class="campo-etiqueta">Informe de Actividad</div>
                    <div class="campo-valor campo-texto-largo">
                      {{ informeActividadPrincipal.informeObjetivoActividad || 'No especificado' }}
                    </div>
                  </v-col>
                </v-row>
              </div>

              <!-- SECCIÓN 2: CONTRIBUCIÓN AL PROYECTO -->
              <div v-if="contribucion" class="form-section mb-6">
                <h3 class="text-h6 mb-4 primary--text">
                  <v-icon color="primary" class="mr-2">mdi-link-variant</v-icon>
                  2. CADENA DE CONTRIBUCIÓN AL PROYECTO
                </h3>

                <div class="contribucion-grid mt-3">
                  <!-- Objetivo General -->
                  <div v-if="contribucion?.objetivogeneral" class="contribucion-item nivel-1">
                    <div class="contribucion-header">
                      <span class="contribucion-codigo">{{
                        contribucion.objetivogeneral.data.codigo
                      }}</span>
                      <v-chip size="x-small" color="primary" class="contribucion-chip">OG</v-chip>
                    </div>
                    <div class="contribucion-descripcion">
                      {{ contribucion.objetivogeneral.data.descripcion }}
                    </div>
                    <div
                      v-if="contribucion.objetivogeneral.data.contribucion"
                      class="contribucion-aporte"
                    >
                      <v-icon size="x-small" color="primary">mdi-hand-peace</v-icon>
                      {{ contribucion.objetivogeneral.data.contribucion }}
                    </div>
                  </div>

                  <!-- Objetivo Específico -->
                  <div v-if="contribucion?.objetivoespecificoog" class="contribucion-item nivel-2">
                    <div class="contribucion-header">
                      <span class="contribucion-codigo">{{
                        contribucion.objetivoespecificoog.data.codigo
                      }}</span>
                      <v-chip size="x-small" color="info" class="contribucion-chip">OE</v-chip>
                    </div>
                    <div class="contribucion-descripcion">
                      {{ contribucion.objetivoespecificoog.data.descripcion }}
                    </div>
                  </div>

                  <!-- Resultados y Productos -->
                  <div v-if="contribucion?.resultadoog" class="contribucion-item nivel-3">
                    <div class="contribucion-header">
                      <span class="contribucion-codigo">{{
                        contribucion.resultadoog.data.codigo
                      }}</span>
                      <v-chip size="x-small" color="success" class="contribucion-chip">R·OG</v-chip>
                    </div>
                    <div class="contribucion-descripcion">
                      {{ contribucion.resultadoog.data.descripcion }}
                    </div>
                  </div>

                  <div v-if="contribucion?.resultadooe" class="contribucion-item nivel-3">
                    <div class="contribucion-header">
                      <span class="contribucion-codigo">{{
                        contribucion.resultadooe.data.codigo
                      }}</span>
                      <v-chip size="x-small" color="warning" class="contribucion-chip">R·OE</v-chip>
                    </div>
                    <div class="contribucion-descripcion">
                      {{ contribucion.resultadooe.data.descripcion }}
                    </div>
                  </div>

                  <div v-if="contribucion?.productooe" class="contribucion-item nivel-4">
                    <div class="contribucion-header">
                      <span class="contribucion-codigo">{{
                        contribucion.productooe.data.codigo
                      }}</span>
                      <v-chip size="x-small" color="orange" class="contribucion-chip">P·OE</v-chip>
                    </div>
                    <div class="contribucion-descripcion">
                      {{ contribucion.productooe.data.descripcion }}
                    </div>
                    <div v-if="contribucion.productooe.data.entregado" class="contribucion-estado">
                      <v-icon size="x-small" color="success">mdi-check-circle</v-icon> Entregado
                    </div>
                  </div>

                  <div v-if="contribucion?.productoroe" class="contribucion-item nivel-4">
                    <div class="contribucion-header">
                      <span class="contribucion-codigo">{{
                        contribucion.productoroe.data.codigo
                      }}</span>
                      <v-chip size="x-small" color="purple" class="contribucion-chip">P·ROE</v-chip>
                    </div>
                    <div class="contribucion-descripcion">
                      {{ contribucion.productoroe.data.descripcion }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- SECCIÓN 3: INDICADORES DE AVANCE -->
              <div v-if="indicadores && totalIndicadores > 0" class="form-section mb-6">
                <h3 class="text-h6 mb-4 primary--text">
                  <v-icon color="primary" class="mr-2">mdi-chart-line</v-icon>
                  3. INDICADORES DE AVANCE ({{ totalIndicadores }})
                </h3>

                <div class="indicadores-container mt-3">
                  <!-- Objetivo General -->
                  <div v-if="indicadores.indicadorog?.length" class="indicador-grupo mb-4">
                    <div class="indicador-grupo-titulo">Objetivo General</div>
                    <v-row>
                      <v-col v-for="ind in indicadores.indicadorog" :key="ind.id" cols="12" md="6">
                        <div class="indicador-card">
                          <div class="d-flex justify-space-between align-start">
                            <span class="indicador-id">ID: {{ ind.id_indicador }}</span>
                            <v-chip size="x-small" :color="getTipoDatoColor(ind.tipo_dato)">{{
                              ind.tipo_dato
                            }}</v-chip>
                          </div>
                          <div class="indicador-valor">{{ getValorIndicador(ind) }}</div>
                          <div class="indicador-obs">{{ ind.observaciones }}</div>
                          <div class="indicador-meta">
                            Reg: {{ ind.registrado_por }} | {{ formatDate(ind.fecha_registro) }}
                          </div>
                        </div>
                      </v-col>
                    </v-row>
                  </div>

                  <!-- Objetivo Específico -->
                  <div v-if="indicadores.indicadoroe?.length" class="indicador-grupo mb-4">
                    <div class="indicador-grupo-titulo">Objetivo Específico</div>
                    <v-row>
                      <v-col v-for="ind in indicadores.indicadoroe" :key="ind.id" cols="12" md="6">
                        <div class="indicador-card">
                          <div class="d-flex justify-space-between align-start">
                            <span class="indicador-id">ID: {{ ind.id_indicador }}</span>
                            <v-chip size="x-small" :color="getTipoDatoColor(ind.tipo_dato)">{{
                              ind.tipo_dato
                            }}</v-chip>
                          </div>
                          <div class="indicador-valor">{{ getValorIndicador(ind) }}</div>
                          <div class="indicador-obs">{{ ind.observaciones }}</div>
                        </div>
                      </v-col>
                    </v-row>
                  </div>

                  <!-- Resultados (compacto) -->
                  <v-row>
                    <v-col cols="12" md="6" v-if="indicadores.indicadorrog?.length">
                      <div class="indicador-grupo-titulo small">Resultados OG</div>
                      <div
                        v-for="ind in indicadores.indicadorrog"
                        :key="ind.id"
                        class="indicador-compacto"
                      >
                        <div class="d-flex justify-space-between">
                          <span>ID: {{ ind.id_indicador }}</span>
                          <span class="font-weight-bold">{{ ind.valor_porcentual }}%</span>
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="6" v-if="indicadores.indicadorroe?.length">
                      <div class="indicador-grupo-titulo small">Resultados OE</div>
                      <div
                        v-for="ind in indicadores.indicadorroe"
                        :key="ind.id"
                        class="indicador-compacto"
                      >
                        <div class="d-flex justify-space-between">
                          <span>ID: {{ ind.id_indicador }}</span>
                          <span class="font-weight-bold">{{ ind.valor_porcentual }}%</span>
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </div>

              <!-- SECCIÓN 4: MEDIOS DE VERIFICACIÓN -->
              <div class="form-section mb-6">
                <h3 class="text-h6 mb-4 primary--text">
                  <v-icon color="primary" class="mr-2">mdi-check-decagram</v-icon>
                  4. MEDIOS DE VERIFICACIÓN
                </h3>
                <div class="campo-formulario mt-2">
                  <div class="campo-valor campo-texto-largo">
                    {{ informeActividadPrincipal.mediosVerificacion || 'No especificado' }}
                  </div>
                </div>
              </div>

              <!-- SECCIÓN 5: PRESUPUESTO -->
              <div class="form-section mb-6">
                <h3 class="text-h6 mb-4 primary--text">
                  <v-icon color="primary" class="mr-2">mdi-cash-multiple</v-icon>
                  5. EJECUCIÓN PRESUPUESTARIA
                </h3>

                <v-row class="mt-3">
                  <v-col cols="12" md="6">
                    <div class="resumen-presupuesto">
                      <div class="d-flex justify-space-between align-center mb-2">
                        <span class="campo-etiqueta">Planificado:</span>
                        <span class="text-h6"
                          >Bs
                          {{ formatNumber(informeActividadPrincipal.presupuestoPlanificado) }}</span
                        >
                      </div>
                      <div class="d-flex justify-space-between align-center mb-2">
                        <span class="campo-etiqueta">Ejecutado:</span>
                        <span class="text-h6 text-success"
                          >Bs
                          {{ formatNumber(informeActividadPrincipal.presupuestoEjecutado) }}</span
                        >
                      </div>
                      <div class="d-flex justify-space-between align-center mb-2">
                        <span class="campo-etiqueta">Ejecución:</span>
                        <span class="font-weight-bold">{{ porcentajeEjecucion.toFixed(2) }}%</span>
                      </div>
                      <v-progress-linear
                        :model-value="porcentajeEjecucion"
                        color="success"
                        height="8"
                        rounded
                        class="mt-2"
                      ></v-progress-linear>
                    </div>
                  </v-col>

                  <v-col cols="12" md="6">
                    <div class="fondos-container">
                      <div class="campo-etiqueta mb-2">Distribución por fondo</div>
                      <div v-if="fondos?.fondosCompletos?.length">
                        <div
                          v-for="fondo in fondos.fondosCompletos"
                          :key="fondo.id"
                          class="fondo-item mb-2"
                        >
                          <div class="d-flex justify-space-between">
                            <span>{{ fondo.nombre }}</span>
                            <span class="font-weight-bold"
                              >Bs {{ formatNumber(fondo.montoEjecutado) }}</span
                            >
                          </div>
                          <div class="d-flex justify-space-between text-caption">
                            <span class="text-medium-emphasis"
                              >Planif: Bs {{ formatNumber(fondo.monto) }}</span
                            >
                            <span
                              >{{ ((fondo.montoEjecutado / fondo.monto) * 100).toFixed(1) }}%</span
                            >
                          </div>
                        </div>
                      </div>
                      <div v-else class="text-medium-emphasis text-caption">
                        Sin información de fondos
                      </div>
                    </div>
                  </v-col>

                  <v-col cols="12" class="mt-2">
                    <div class="campo-etiqueta">Observaciones de presupuesto</div>
                    <div class="campo-valor campo-texto-largo">
                      {{
                        informeActividadPrincipal.observacionesPresupuesto || 'Sin observaciones'
                      }}
                    </div>
                  </v-col>
                </v-row>
              </div>

              <!-- SECCIÓN 6: EVALUACIÓN Y HERRAMIENTAS -->
              <div
                v-if="herramientas?.datosCompletos?.herramientas?.length"
                class="form-section mb-6"
              >
                <h3 class="text-h6 mb-4 primary--text">
                  <v-icon color="primary" class="mr-2">mdi-hammer-wrench</v-icon>
                  6. HERRAMIENTAS DE EVALUACIÓN
                </h3>

                <v-row class="mt-3">
                  <v-col
                    v-for="herramienta in herramientas.datosCompletos.herramientas"
                    :key="herramienta.id"
                    cols="12"
                    md="6"
                  >
                    <div class="herramienta-card">
                      <div class="font-weight-medium">{{ herramienta.descripcion }}</div>
                      <div class="text-caption mt-1">{{ herramienta.resultado }}</div>
                      <div class="text-caption text-medium-emphasis mt-1">
                        Evidencias: {{ herramienta.archivos?.length || 0 }}
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </div>

              <!-- SECCIÓN 7: COMENTARIOS Y RECOMENDACIONES -->
              <div class="form-section mb-6">
                <h3 class="text-h6 mb-4 primary--text">
                  <v-icon color="primary" class="mr-2">mdi-comment-text-multiple</v-icon>
                  7. COMENTARIOS Y RECOMENDACIONES
                </h3>
                <div class="campo-formulario mt-2">
                  <div class="campo-valor campo-texto-largo">
                    {{ informeActividadPrincipal.comentariosRecomendaciones || 'No especificado' }}
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Panel lateral de validación (estilo consistente con la muestra) -->
        <v-col cols="12" lg="3">
          <v-card elevation="2" rounded="lg" class="tarjeta-validaciones sticky-top">
            <v-card-item class="pa-4">
              <template v-slot:prepend>
                <v-avatar :color="totalPendientes > 0 ? 'warning' : 'success'" size="32">
                  <v-icon size="18" color="white">mdi-bell-ring</v-icon>
                </v-avatar>
              </template>
              <v-card-title class="text-subtitle-1 font-weight-medium pa-0">
                Validaciones del Informe
              </v-card-title>
              <template v-slot:append>
                <v-chip
                  :color="totalPendientes > 0 ? 'warning' : 'success'"
                  text-color="white"
                  size="small"
                >
                  v{{ estadoValidacion?.version_actual || '1' }}
                </v-chip>
              </template>
            </v-card-item>

            <v-card-text class="pa-4 pt-0">
              <!-- Resumen de validaciones -->
              <div class="resumen-validacion mb-4">
                <div class="d-flex gap-2 mb-3">
                  <v-chip size="small" color="warning" variant="tonal" class="flex-grow-1">
                    <span class="font-weight-bold mr-1">{{
                      estadoValidacion?.resumen?.pendientes || 0
                    }}</span>
                    Pend.
                  </v-chip>
                  <v-chip size="small" color="success" variant="tonal" class="flex-grow-1">
                    <span class="font-weight-bold mr-1">{{
                      estadoValidacion?.resumen?.aprobados || 0
                    }}</span>
                    Aprob.
                  </v-chip>
                  <v-chip size="small" color="error" variant="tonal" class="flex-grow-1">
                    <span class="font-weight-bold mr-1">{{
                      estadoValidacion?.resumen?.rechazados || 0
                    }}</span>
                    Rech.
                  </v-chip>
                </div>

                <div class="d-flex align-center justify-space-between">
                  <span class="text-caption font-weight-medium text-grey">ESTADO CONSOLIDADO</span>
                  <v-chip :color="getEstadoConsolidadoColor" text-color="white" size="x-small">
                    <v-icon left size="12" :icon="getEstadoConsolidadoIcon"></v-icon>
                    {{ estadoValidacion?.estado_consolidado || 'SIN ESTADO' }}
                  </v-chip>
                </div>
              </div>

              <v-divider class="my-3"></v-divider>

              <!-- Lista de validadores -->
              <div class="text-caption font-weight-medium text-grey mb-2">
                VALIDADORES ASIGNADOS
              </div>
              <div class="validadores-lista">
                <v-list density="compact" class="pa-0 bg-transparent">
                  <v-list-item
                    v-for="val in estadoValidacion?.validaciones"
                    :key="val.id"
                    class="px-0 validacion-item"
                  >
                    <template v-slot:prepend>
                      <v-avatar
                        size="28"
                        :color="getEstadoColor(val.estado) + '-lighten-4'"
                        class="mr-2"
                      >
                        <v-icon size="14" :color="getEstadoColor(val.estado)">
                          {{ getIconoEstado(val.estado) }}
                        </v-icon>
                      </v-avatar>
                    </template>

                    <v-list-item-title class="text-caption">
                      {{ truncarTexto(val.validador_nombre, 18) }}
                    </v-list-item-title>

                    <v-list-item-subtitle class="text-caption text-grey">
                      {{ val.codigoSeguimiento }}
                    </v-list-item-subtitle>

                    <template v-slot:append>
                      <v-chip :color="getEstadoColor(val.estado)" size="x-small" variant="tonal">
                        {{ val.estado_display }}
                      </v-chip>
                    </template>
                  </v-list-item>
                </v-list>
              </div>

              <v-divider class="my-3"></v-divider>

              <!-- Tu validación actual -->
              <div class="text-caption font-weight-medium text-grey mb-2">TU VALIDACIÓN</div>
              <v-list density="compact" class="pa-0 bg-transparent">
                <v-list-item v-if="miValidacion" class="px-0 validacion-item">
                  <template v-slot:prepend>
                    <v-avatar
                      size="28"
                      :color="getEstadoColor(miValidacion.estado) + '-lighten-4'"
                      class="mr-2"
                    >
                      <v-icon size="14" :color="getEstadoColor(miValidacion.estado)">
                        {{ getIconoEstado(miValidacion.estado) }}
                      </v-icon>
                    </v-avatar>
                  </template>

                  <v-list-item-title class="text-caption">
                    {{ miValidacion.validador_nombre }}
                  </v-list-item-title>

                  <v-list-item-subtitle class="text-caption text-grey">
                    {{ miValidacion.estado_display }}
                  </v-list-item-subtitle>

                  <template v-slot:append>
                    <v-chip
                      :color="getEstadoColor(miValidacion.estado)"
                      size="x-small"
                      variant="tonal"
                    >
                      {{ miValidacion.estado_display }}
                    </v-chip>
                  </template>

                  <div
                    v-if="miValidacion.comentarios && miValidacion.comentarios !== 'Nueva Entrada'"
                    class="text-caption mt-1 pa-2 bg-grey-lighten-4 rounded"
                  >
                    <v-icon size="x-small" class="mr-1">mdi-comment</v-icon>
                    {{ miValidacion.comentarios }}
                  </div>
                </v-list-item>
                <div v-else class="text-center py-2">
                  <v-icon size="32" color="grey-lighten-2" class="mb-1">mdi-account-off</v-icon>
                  <div class="text-caption text-grey">No tienes validación asignada</div>
                </div>
              </v-list>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions class="pa-3">
              <v-btn
                block
                color="primary"
                variant="tonal"
                size="small"
                prepend-icon="mdi-eye-outline"
                @click="abrirDialogoValidacion"
                class="text-caption"
                :disabled="yaValido"
              >
                {{ yaValido ? 'Ya has validado' : 'Validar informe' }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Error -->
    <v-alert v-if="error" type="error" variant="tonal" class="mt-4">
      {{ error }}
      <v-btn color="error" variant="text" @click="cargarDatos" class="ml-2">Reintentar</v-btn>
    </v-alert>

    <!-- Diálogo de validación -->
    <v-dialog v-model="dialogValidacion" max-width="500px" persistent>
      <v-card rounded="lg">
        <v-toolbar color="primary" density="compact">
          <v-toolbar-title class="text-white">
            <v-icon start dark>mdi-check-circle</v-icon>
            Validar Documento
          </v-toolbar-title>
        </v-toolbar>

        <v-card-text class="pa-4">
          <p class="text-body-2 mb-4">Por favor, selecciona el resultado de tu validación:</p>

          <v-radio-group v-model="accionValidacion" class="mb-4">
            <v-radio label="Aprobar documento" value="aprobar" color="success"></v-radio>
            <v-radio
              label="Rechazar documento (solicitar correcciones)"
              value="rechazar"
              color="error"
            ></v-radio>
          </v-radio-group>

          <v-textarea
            v-model="comentarioValidacion"
            :label="
              accionValidacion === 'rechazar' ? 'Motivo del rechazo *' : 'Comentarios (opcional)'
            "
            :placeholder="
              accionValidacion === 'rechazar'
                ? 'Indica las correcciones necesarias...'
                : 'Agrega algún comentario...'
            "
            :rules="accionValidacion === 'rechazar' ? [(v) => !!v || 'El motivo es requerido'] : []"
            variant="outlined"
            rows="4"
            auto-grow
            counter
            maxlength="500"
            class="mt-2"
          ></v-textarea>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="cerrarDialogoValidacion">Cancelar</v-btn>
          <v-btn
            :color="accionValidacion === 'aprobar' ? 'success' : 'error'"
            variant="flat"
            :loading="enviandoValidacion"
            :disabled="!puedeEnviarValidacion"
            @click="enviarValidacion"
          >
            {{ accionValidacion === 'aprobar' ? 'Aprobar' : 'Rechazar' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
  {{ informeActividadPrincipal }}
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useInformeActividadPrincipal } from '@/modules/formularios/composables/useInformeActividadPrincipal'
import { useValidadores } from '@/modules/formularios/composables/useValidadores'
import { useRouter, useRoute } from 'vue-router'
import { useSnackbar } from '@/composables/useSnackbar'

// Componentes de cabecera
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'
import ProyectoIdHeader from '@/modules/proyecto/components/partials/ProyectoIdHeader.vue'
import ActividadInformacion from '@/modules/proyecto/components/partials/ActividadInformacion.vue'

// Router
const router = useRouter()
const route = useRoute()
const idInfActividad = route.params.id
const { successMsg, errorMsg } = useSnackbar()

// Composables
const { informeActividadPrincipal, obtenerInformeActividadPrincipalPorId } =
  useInformeActividadPrincipal()
const { estadoValidacionInformeActividadPrincipal } = useValidadores()

// Estado
const estadoValidacion = ref(null)
const loading = ref(false)
const error = ref(null)

// Estado del diálogo de validación
const dialogValidacion = ref(false)
const accionValidacion = ref('aprobar')
const comentarioValidacion = ref('')
const enviandoValidacion = ref(false)

// Computed properties
const contribucion = computed(
  () => informeActividadPrincipal.value?.contribucionProyecto?.caberaContribucion,
)
const indicadores = computed(() => informeActividadPrincipal.value?.avanceIndicadores || {})
const herramientas = computed(() => informeActividadPrincipal.value?.herramientasEvaluacion)
const fondos = computed(() => informeActividadPrincipal.value?.procedenciaFondos)

const totalIndicadores = computed(() => indicadores.value?.metadatos?.total_general || 0)

const totalPendientes = computed(() => estadoValidacion.value?.resumen?.pendientes || 0)
const totalAprobados = computed(() => estadoValidacion.value?.resumen?.aprobados || 0)
const totalRechazados = computed(() => estadoValidacion.value?.resumen?.rechazados || 0)

const porcentajeEjecucion = computed(() => {
  const planificado = parseFloat(informeActividadPrincipal.value?.presupuestoPlanificado) || 0
  const ejecutado = parseFloat(informeActividadPrincipal.value?.presupuestoEjecutado) || 0
  return planificado > 0 ? (ejecutado / planificado) * 100 : 0
})

// Validación del usuario actual
const usuarioActualId = 51
const miValidacion = computed(() => {
  return estadoValidacion.value?.validaciones?.find((v) => v.usuarioValidador === usuarioActualId)
})

const yaValido = computed(() => {
  return miValidacion.value?.estado !== 'PENDIENTE'
})

const puedeEnviarValidacion = computed(() => {
  if (accionValidacion.value === 'rechazar') {
    return comentarioValidacion.value?.trim().length > 0
  }
  return true
})

const getEstadoConsolidadoColor = computed(() => {
  const estado = estadoValidacion.value?.estado_consolidado
  const colores = {
    APROBADO: 'success',
    RECHAZADO: 'error',
    EN_VALIDACION: 'warning',
    PENDIENTE: 'grey',
    EN_CORRECCION: 'info',
  }
  return colores[estado] || 'grey'
})

const getEstadoConsolidadoIcon = computed(() => {
  const estado = estadoValidacion.value?.estado_consolidado
  const iconos = {
    APROBADO: 'mdi-check-circle',
    RECHAZADO: 'mdi-close-circle',
    EN_VALIDACION: 'mdi-clock-outline',
    PENDIENTE: 'mdi-clock',
    EN_CORRECCION: 'mdi-pencil',
  }
  return iconos[estado] || 'mdi-help-circle'
})

const getTipoActividadColor = computed(() => {
  const tipo = informeActividadPrincipal.value?.tipoActividad || ''
  if (tipo.includes('CAP')) return 'info'
  if (tipo.includes('INV')) return 'success'
  if (tipo.includes('ADM')) return 'warning'
  return 'primary'
})

// Métodos
const cargarDatos = async () => {
  loading.value = true
  error.value = null
  try {
    const [, validacion] = await Promise.all([
      obtenerInformeActividadPrincipalPorId(idInfActividad),
      estadoValidacionInformeActividadPrincipal(idInfActividad),
    ])
    estadoValidacion.value = validacion
  } catch (err) {
    error.value = 'No se pudo cargar la información'
    console.error('Error cargando datos:', err)
  } finally {
    loading.value = false
  }
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

const formatNumber = (num) => {
  const number = parseFloat(num) || 0
  return number.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

const getIniciales = (nombre) => {
  if (!nombre) return '??'
  return nombre
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

const truncarTexto = (texto, max) => {
  if (!texto) return ''
  return texto.length > max ? texto.substring(0, max) + '...' : texto
}

const getValorIndicador = (indicador) => {
  if (indicador.valor_numerico !== null && indicador.valor_numerico !== undefined) {
    return indicador.valor_numerico
  }
  if (indicador.valor_literal) {
    return indicador.valor_literal
  }
  if (indicador.valor_porcentual) {
    return `${indicador.valor_porcentual}%`
  }
  return 'Sin valor'
}

const getTipoDatoColor = (tipo) => {
  const colores = {
    '1-9': 'info',
    'A-Z': 'purple',
    '%': 'success',
  }
  return colores[tipo] || 'grey'
}

const getEstadoColor = (estado) => {
  const colores = {
    APROBADO: 'success',
    RECHAZADO: 'error',
    PENDIENTE: 'warning',
    EN_CORRECCION: 'info',
  }
  return colores[estado] || 'grey'
}

const getEstadoValColor = (estado) => {
  return getEstadoColor(estado)
}

const getIconoEstado = (estado) => {
  const iconos = {
    APROBADO: 'mdi-check',
    RECHAZADO: 'mdi-close',
    PENDIENTE: 'mdi-clock-outline',
    EN_CORRECCION: 'mdi-pencil',
  }
  return iconos[estado] || 'mdi-circle'
}

// Acciones de validación
const abrirDialogoValidacion = () => {
  if (yaValido.value) {
    errorMsg('Ya has realizado tu validación para este documento')
    return
  }
  accionValidacion.value = 'aprobar'
  comentarioValidacion.value = ''
  dialogValidacion.value = true
}

const cerrarDialogoValidacion = () => {
  dialogValidacion.value = false
  accionValidacion.value = 'aprobar'
  comentarioValidacion.value = ''
}

const enviarValidacion = async () => {
  if (!puedeEnviarValidacion.value) return

  enviandoValidacion.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    successMsg(
      `Documento ${accionValidacion.value === 'aprobar' ? 'aprobado' : 'rechazado'} correctamente`,
    )
    cerrarDialogoValidacion()
    await cargarDatos()
  } catch (err) {
    errorMsg('Error al enviar la validación')
    console.error('Error:', err)
  } finally {
    enviandoValidacion.value = false
  }
}

const generarPDF = () => {
  successMsg('Generando PDF...')
}

// Inicialización
onMounted(() => {
  cargarDatos()
})
</script>

<style scoped>
/* Estilos base */
.informe-administracion-container {
  background: #f5f5f5;
  min-height: 100vh;
}

.documento-administracion {
  max-width: 1400px;
  margin: 0 auto;
  background: white;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

/* Acciones sheet - igual que la muestra */
.acciones-sheet {
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
}

/* Tarjeta principal del informe */
.tarjeta-informe {
  background: white;
  transition: all 0.2s ease;
  border: 1px solid #e0e0e0;
}

.border-bottom {
  border-bottom: 1px solid #e0e0e0;
}

/* Form sections - estilo consistente con la muestra */
.form-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;
  border: 1px solid #e0e0e0;
}

.form-section h3 {
  color: #1976d2;
  border-bottom: 2px solid #1976d2;
  padding-bottom: 8px;
  margin-bottom: 16px;
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  align-items: center;
}

/* Campos de formulario */
.campo-formulario {
  margin-bottom: 16px;
}

.campo-etiqueta {
  font-size: 0.75rem;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin-bottom: 4px;
  border-bottom: 1px dashed #ccc;
  padding-bottom: 2px;
}

.campo-valor {
  font-size: 0.95rem;
  padding: 8px 12px;
  background: #f9f9f9;
  border-left: 3px solid #1976d2;
  min-height: 40px;
  border-radius: 0 4px 4px 0;
}

.campo-texto-largo {
  white-space: pre-wrap;
  line-height: 1.5;
}

/* Contribución */
.contribucion-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.contribucion-item {
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
  border-left: 4px solid;
  transition: all 0.2s;
}

.contribucion-item.nivel-1 {
  border-left-color: #1976d2;
  background: #e3f2fd;
}
.contribucion-item.nivel-2 {
  border-left-color: #2196f3;
  margin-left: 20px;
}
.contribucion-item.nivel-3 {
  border-left-color: #4caf50;
  margin-left: 40px;
}
.contribucion-item.nivel-4 {
  border-left-color: #ff9800;
  margin-left: 60px;
}

.contribucion-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.contribucion-codigo {
  font-weight: bold;
  font-family: monospace;
  font-size: 0.85rem;
}

.contribucion-chip {
  font-size: 0.65rem;
}

.contribucion-descripcion {
  font-size: 0.85rem;
  line-height: 1.4;
}

/* Indicadores */
.indicador-grupo-titulo {
  font-weight: 600;
  font-size: 0.85rem;
  color: #1976d2;
  margin-bottom: 8px;
  text-transform: uppercase;
}

.indicador-grupo-titulo.small {
  font-size: 0.75rem;
  margin-top: 8px;
}

.indicador-card {
  padding: 10px;
  background: #f5f5f5;
  border-radius: 6px;
  border: 1px solid #eee;
  height: 100%;
}

.indicador-id {
  font-size: 0.7rem;
  color: #666;
  font-family: monospace;
}

.indicador-valor {
  font-size: 1.2rem;
  font-weight: bold;
  color: #2c3e50;
  margin: 6px 0;
}

.indicador-obs {
  font-size: 0.8rem;
  color: #555;
  margin-bottom: 4px;
}

.indicador-meta {
  font-size: 0.65rem;
  color: #888;
}

.indicador-compacto {
  padding: 6px 8px;
  background: #f5f5f5;
  border-radius: 4px;
  margin-bottom: 4px;
  font-size: 0.8rem;
}

/* Presupuesto */
.resumen-presupuesto {
  padding: 12px;
  background: #f5f5f5;
  border-radius: 6px;
}

.fondo-item {
  padding: 6px 8px;
  background: #f5f5f5;
  border-radius: 4px;
  margin-bottom: 4px;
}

/* Herramientas */
.herramienta-card {
  padding: 10px;
  background: #f5f5f5;
  border-radius: 6px;
  border: 1px solid #eee;
}

/* Tarjeta de validaciones - exactamente igual a la muestra */
.tarjeta-validaciones {
  background: white;
  border: 1px solid #e0e0e0;
  transition: all 0.2s ease;
}

.tarjeta-validaciones:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
}

/* Validadores lista */
.validadores-lista {
  max-height: 250px;
  overflow-y: auto;
  margin-bottom: 8px;
}

.validacion-item {
  border-radius: 6px;
  margin-bottom: 4px;
  padding: 4px 0;
}

.validacion-item:hover {
  background: #f8f9fa;
}

/* Scroll personalizado */
.validadores-lista::-webkit-scrollbar {
  width: 4px;
}

.validadores-lista::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.validadores-lista::-webkit-scrollbar-thumb {
  background: #c0c0c0;
  border-radius: 4px;
}

/* Utilidades */
.gap-2 {
  gap: 8px;
}

.sticky-top {
  position: sticky;
  top: 20px;
}

/* Responsive */
@media (max-width: 960px) {
  .documento-administracion {
    padding: 16px;
  }

  .form-section {
    padding: 16px;
  }

  .sticky-top {
    position: static;
    margin-top: 20px;
  }
}

@media (max-width: 600px) {
  .gap-2 {
    gap: 4px;
  }
}
</style>
