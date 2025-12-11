<template>
  <v-container class="pei-container">
    <!-- Overlay de carga -->
    <v-overlay :model-value="cargando" class="align-center justify-center" persistent opacity="0.8">
      <div class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
          width="6"
        ></v-progress-circular>
        <p class="mt-4 text-h6">Cargando información del PEI...</p>
      </div>
    </v-overlay>

    <!-- CONTENIDO PRINCIPAL -->
    <template v-if="!cargando && estructuraPEI">
      <v-row>
        <v-col cols="12">
          <PaginaTituloIcono :titulo="'ESTRUCTURA DEL PEI'" :icon="'mdi-file-chart'" />

          <!-- Header del PEI -->
          <v-card variant="outlined" class="mb-6">
            <v-card-title class="bg-primary text-white">
              <v-icon left>mdi-file-document</v-icon>
              {{ estructuraPEI.PEI.titulo }}
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <p><strong>Descripción:</strong> {{ estructuraPEI.PEI.descripcion }}</p>
                  <p>
                    <strong>Vigencia:</strong> {{ estructuraPEI.PEI.fecha_inicio }} -
                    {{ estructuraPEI.PEI.fecha_fin }}
                  </p>
                </v-col>
                <v-col cols="12" md="6">
                  <p>
                    <strong>Estado:</strong>
                    <v-chip :color="estructuraPEI.PEI.esta_vigente ? 'green' : 'red'" size="small">
                      {{ estructuraPEI.PEI.esta_vigente ? 'VIGENTE' : 'NO VIGENTE' }}
                    </v-chip>
                  </p>
                  <p>
                    <strong>Fecha creación:</strong>
                    {{ formatFecha(estructuraPEI.PEI.fecha_creacion) }}
                  </p>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Tabla de estructura del PEI -->
          <v-card variant="outlined" class="mb-4">
            <v-toolbar color="primary" density="compact">
              <v-toolbar-title>ESTRUCTURA COMPLETA DEL PEI</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn
                color="white"
                variant="tonal"
                @click="abrirModalNuevoObjetivo"
                prepend-icon="mdi-plus"
                size="small"
              >
                Nuevo Objetivo
              </v-btn>
            </v-toolbar>

            <v-card-text>
              <div class="table-responsive">
                <v-table class="marco-logico-table">
                  <thead>
                    <tr>
                      <th width="35%">OBJETIVO PEI</th>
                      <th width="40%">INDICADORES PEI</th>
                      <th width="25%">FACTORES CRÍTICOS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="objetivo in estructuraPEI.PEI.objetivos"
                      :key="`obj-${objetivo.id}`"
                      class="objetivo-row"
                    >
                      <!-- Columna 1: Objetivo PEI -->
                      <td class="objetivo-cell">
                        <div class="d-flex align-center mb-2">
                          <v-chip size="small" color="primary" class="mr-2">
                            {{ objetivo.codigo }}
                          </v-chip>
                          <span class="text-caption text-grey">ID: {{ objetivo.id }}</span>
                        </div>

                        <div class="objetivo-descripcion mb-3">
                          <strong>{{ objetivo.descripcion }}</strong>
                        </div>

                        <div class="d-flex">
                          <v-btn
                            icon
                            size="small"
                            color="primary"
                            @click.stop="editarObjetivo(objetivo)"
                            :loading="cargandoEdicion"
                            variant="tonal"
                            class="mr-1"
                          >
                            <v-icon>mdi-pencil</v-icon>
                          </v-btn>
                          <v-btn
                            icon
                            size="small"
                            color="error"
                            @click.stop="solicitarEliminarObjetivo(objetivo)"
                            :loading="cargandoEliminacion"
                            variant="tonal"
                          >
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </div>
                      </td>

                      <!-- Columna 2: Indicadores PEI -->
                      <td class="indicadores-cell">
                        <div class="mb-2">
                          <v-chip size="x-small" color="info" variant="outlined" class="mb-1">
                            {{ objetivo.indicadores?.length || 0 }} indicadores
                          </v-chip>
                        </div>

                        <template v-if="objetivo.indicadores?.length">
                          <div class="indicadores-container">
                            <v-list lines="two" class="pa-0">
                              <template
                                v-for="(indicador, indIndex) in objetivo.indicadores"
                                :key="indicador.id"
                              >
                                <v-list-item
                                  :class="getIndicadorColorClass(indicador.tipo)"
                                  class="mb-2 indicador-item"
                                >
                                  <template v-slot:prepend>
                                    <v-chip
                                      size="small"
                                      :color="getIndicadorColor(indicador.tipo)"
                                      class="mr-2"
                                    >
                                      {{ indicador.codigo }}
                                    </v-chip>
                                  </template>

                                  <v-list-item-title class="font-weight-bold text-body-2">
                                    <!-- Texto del indicador con tooltip y modal -->
                                    <div class="texto-contenedor">
                                      <span class="texto-truncado">
                                        {{ truncarTexto(indicador.descripcion, 60) }}
                                      </span>
                                      <v-tooltip location="top">
                                        <template v-slot:activator="{ props }">
                                          <v-btn
                                            v-bind="props"
                                            icon
                                            size="x-small"
                                            variant="text"
                                            color="primary"
                                            @click.stop="verDetalleIndicador(indicador)"
                                            class="ml-1"
                                          >
                                            <v-icon size="small">mdi-eye</v-icon>
                                          </v-btn>
                                        </template>
                                        <span>Ver detalles completos</span>
                                      </v-tooltip>
                                    </div>
                                  </v-list-item-title>

                                  <v-list-item-subtitle class="text-caption">
                                    <div v-if="indicador.tipo.includes('cuantitativo')">
                                      <span class="text-grey">Tipo: Cuantitativo</span>
                                    </div>
                                    <div v-else-if="indicador.tipo.includes('cualitativo')">
                                      <span class="text-grey">Tipo: Cualitativo</span>
                                    </div>
                                    <div v-if="indicador.frecuencia_recopilacion">
                                      <v-icon size="x-small">mdi-calendar</v-icon>
                                      {{ indicador.frecuencia_recopilacion }}
                                    </div>
                                  </v-list-item-subtitle>

                                  <template v-slot:append>
                                    <div class="d-flex">
                                      <v-btn
                                        icon
                                        size="x-small"
                                        color="primary"
                                        @click.stop="editarIndicador(indicador, objetivo.id)"
                                        variant="text"
                                        class="mr-1"
                                      >
                                        <v-icon>mdi-pencil</v-icon>
                                      </v-btn>
                                      <v-btn
                                        icon
                                        size="x-small"
                                        color="error"
                                        @click.stop="
                                          confirmarEliminarIndicador(
                                            objetivo.id,
                                            indicador.id,
                                            indicador.codigo,
                                          )
                                        "
                                        :loading="cargandoEliminacionIndicador"
                                        variant="text"
                                      >
                                        <v-icon>mdi-delete</v-icon>
                                      </v-btn>
                                    </div>
                                  </template>
                                </v-list-item>
                                <v-divider
                                  v-if="indIndex < objetivo.indicadores.length - 1"
                                  :key="`div-${indicador.id}`"
                                ></v-divider>
                              </template>
                            </v-list>
                          </div>
                        </template>
                        <template v-else>
                          <div class="text-center py-4 text-grey">
                            <v-icon size="small">mdi-chart-line-off</v-icon>
                            <p class="text-caption mt-1">No hay indicadores</p>
                          </div>
                        </template>

                        <div class="text-center mt-2">
                          <v-btn
                            size="x-small"
                            color="info"
                            variant="text"
                            @click.stop="abrirModalNuevoIndicador(objetivo.id)"
                            :loading="cargandoAccion"
                            prepend-icon="mdi-plus"
                          >
                            Agregar indicador
                          </v-btn>
                        </div>
                      </td>

                      <!-- Columna 3: Factores Críticos -->
                      <td class="factores-cell">
                        <div class="mb-2">
                          <v-chip size="x-small" color="red" variant="outlined" class="mb-1">
                            {{ objetivo.factores_criticos?.length || 0 }} factores
                          </v-chip>
                        </div>

                        <template v-if="objetivo.factores_criticos?.length">
                          <div class="factores-container">
                            <v-list lines="one" class="pa-0">
                              <template
                                v-for="(factor, facIndex) in objetivo.factores_criticos"
                                :key="factor.id"
                              >
                                <v-list-item class="mb-1 factor-item">
                                  <template v-slot:prepend>
                                    <v-icon color="red" size="small" class="mr-2">
                                      mdi-alert-circle
                                    </v-icon>
                                  </template>

                                  <v-list-item-title class="text-body-2">
                                    <!-- Texto del factor con tooltip y modal -->
                                    <div class="texto-contenedor">
                                      <span class="texto-truncado">
                                        {{ truncarTexto(factor.factor_critico, 60) }}
                                      </span>
                                      <v-tooltip location="top">
                                        <template v-slot:activator="{ props }">
                                          <v-btn
                                            v-bind="props"
                                            icon
                                            size="x-small"
                                            variant="text"
                                            color="primary"
                                            @click.stop="verDetalleFactor(factor)"
                                            class="ml-1"
                                          >
                                            <v-icon size="small">mdi-eye</v-icon>
                                          </v-btn>
                                        </template>
                                        <span>Ver detalles completos</span>
                                      </v-tooltip>
                                    </div>
                                  </v-list-item-title>

                                  <template v-slot:append>
                                    <div class="d-flex">
                                      <v-btn
                                        icon
                                        size="x-small"
                                        color="primary"
                                        @click.stop="editarFactor(factor, objetivo.id)"
                                        variant="text"
                                        class="mr-1"
                                      >
                                        <v-icon>mdi-pencil</v-icon>
                                      </v-btn>
                                      <v-btn
                                        icon
                                        size="x-small"
                                        color="error"
                                        @click.stop="
                                          confirmarEliminarFactor(
                                            objetivo.id,
                                            factor.id,
                                            factor.factor_critico,
                                          )
                                        "
                                        :loading="cargandoEliminacionFactor"
                                        variant="text"
                                      >
                                        <v-icon>mdi-delete</v-icon>
                                      </v-btn>
                                    </div>
                                  </template>
                                </v-list-item>
                                <v-divider
                                  v-if="facIndex < objetivo.factores_criticos.length - 1"
                                  :key="`fac-div-${factor.id}`"
                                ></v-divider>
                              </template>
                            </v-list>
                          </div>
                        </template>
                        <template v-else>
                          <div class="text-center py-4 text-grey">
                            <v-icon size="small">mdi-alert-off</v-icon>
                            <p class="text-caption mt-1">No hay factores críticos</p>
                          </div>
                        </template>

                        <div class="text-center mt-2">
                          <v-btn
                            size="x-small"
                            color="red"
                            variant="text"
                            @click.stop="abrirModalNuevoFactor(objetivo.id)"
                            :loading="cargandoAccion"
                            prepend-icon="mdi-plus"
                          >
                            Agregar factor
                          </v-btn>
                        </div>
                      </td>
                    </tr>

                    <!-- Fila para nuevo objetivo -->
                    <tr
                      v-if="
                        !estructuraPEI.PEI.objetivos || estructuraPEI.PEI.objetivos?.length === 0
                      "
                    >
                      <td colspan="3" class="text-center py-8 text-grey">
                        <v-icon size="large">mdi-bullseye-off</v-icon>
                        <p class="text-h6 mt-2">No hay objetivos registrados</p>
                        <v-btn
                          color="primary"
                          class="mt-4"
                          @click="abrirModalNuevoObjetivo"
                          prepend-icon="mdi-plus"
                        >
                          Crear primer objetivo
                        </v-btn>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- MODALES -->
      <!-- Modal: Nuevo/Editar Objetivo -->
      <v-dialog v-model="dialogObjetivo" max-width="800" persistent>
        <v-card>
          <v-card-title :class="`text-white ${objetivoEdit.id ? 'bg-primary' : 'bg-green'}`">
            <v-icon left>{{ objetivoEdit.id ? 'mdi-pencil' : 'mdi-plus' }}</v-icon>
            {{ objetivoEdit.id ? 'Editar' : 'Nuevo' }} Objetivo Estratégico
          </v-card-title>
          <v-card-text class="pt-4">
            <v-form ref="formObjetivo" @submit.prevent="guardarObjetivo">
              <v-text-field
                variant="outlined"
                v-model="objetivoEdit.codigo"
                label="Código *"
                required
                :rules="[(v) => !!v || 'El código es requerido']"
                :disabled="cargandoAccion"
                placeholder="Ej: OBJ001-PEI"
              ></v-text-field>
              <v-textarea
                variant="outlined"
                v-model="objetivoEdit.descripcion"
                label="Descripción *"
                rows="4"
                required
                :rules="[(v) => !!v || 'La descripción es requerida']"
                :disabled="cargandoAccion"
                placeholder="Describa el objetivo estratégico..."
              ></v-textarea>
            </v-form>
          </v-card-text>
          <v-card-actions class="pa-4 justify-end">
            <v-btn color="grey" @click="cerrarModalObjetivo" :disabled="cargandoAccion">
              Cancelar
            </v-btn>
            <v-btn
              :color="objetivoEdit.id ? 'primary' : 'green'"
              @click="guardarObjetivo"
              :loading="cargandoAccion"
            >
              {{ objetivoEdit.id ? 'Actualizar' : 'Guardar' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Modal: Nuevo/Editar Indicador -->
      <v-dialog v-model="dialogIndicador" max-width="800" persistent>
        <v-card>
          <v-card-title :class="`text-white ${indicadorEdit.id ? 'bg-primary' : 'bg-info'}`">
            <v-icon left>{{ indicadorEdit.id ? 'mdi-pencil' : 'mdi-plus' }}</v-icon>
            {{ indicadorEdit.id ? 'Editar' : 'Nuevo' }} Indicador
            <v-chip color="white" size="small" class="ml-3">
              {{ obtenerCodigoObjetivo(objetivoSeleccionado) }}
            </v-chip>
          </v-card-title>
          <v-card-text class="pt-4">
            <v-tabs v-model="tabModalIndicador" class="mb-4" :disabled="!!indicadorEdit.id">
              <v-tab value="cualitativo">
                <v-icon left>mdi-format-list-checks</v-icon>
                Cualitativo
              </v-tab>
              <v-tab value="cuantitativo">
                <v-icon left>mdi-chart-bar</v-icon>
                Cuantitativo
              </v-tab>
            </v-tabs>

            <v-window v-model="tabModalIndicador">
              <!-- Formulario Indicador Cualitativo -->
              <v-window-item value="cualitativo">
                <v-form ref="formIndCualitativo">
                  <v-text-field
                    v-model="indicadorCualitativo.codigo"
                    variant="outlined"
                    label="Código *"
                    required
                    :rules="[(v) => !!v || 'El código es requerido']"
                    placeholder="Ej: INDCUAL001"
                  ></v-text-field>
                  <v-textarea
                    v-model="indicadorCualitativo.descripcion"
                    variant="outlined"
                    label="Descripción del Indicador *"
                    rows="3"
                    required
                    :rules="[(v) => !!v || 'La descripción es requerida']"
                    placeholder="Describa el indicador cualitativo..."
                  ></v-textarea>
                  <v-select
                    v-model="indicadorCualitativo.frecuencia_recopilacion"
                    :items="frecuencias"
                    variant="outlined"
                    label="Frecuencia de recopilación"
                    placeholder="Seleccione frecuencia"
                  ></v-select>
                  <v-textarea
                    v-model="indicadorCualitativo.captura_informacion"
                    variant="outlined"
                    label="Mecanismo de Captura de Información"
                    rows="2"
                    placeholder="Describa cómo se captura la información..."
                  ></v-textarea>
                  <v-textarea
                    v-model="indicadorCualitativo.responsabilidad"
                    variant="outlined"
                    label="Responsabilidad"
                    rows="2"
                    placeholder="¿Quién es responsable?"
                  ></v-textarea>
                  <v-textarea
                    v-model="indicadorCualitativo.uso_informacion"
                    variant="outlined"
                    label="Uso de la Información"
                    rows="2"
                    placeholder="¿Cómo se utilizará la información?"
                  ></v-textarea>
                  <v-divider class="my-4"></v-divider>
                  <h4 class="text-h6 mb-3">Umbrales de Desempeño</h4>
                  <v-textarea
                    v-model="indicadorCualitativo.umbral_des_literal_um1"
                    variant="outlined"
                    label="Umbral bajo (0-40%)"
                    rows="2"
                    placeholder="Describa el desempeño bajo..."
                  ></v-textarea>
                  <v-textarea
                    v-model="indicadorCualitativo.umbral_des_literal_um2"
                    variant="outlined"
                    label="Umbral medio (41-70%)"
                    rows="2"
                    placeholder="Describa el desempeño medio..."
                  ></v-textarea>
                  <v-textarea
                    v-model="indicadorCualitativo.umbral_des_literal_um3"
                    variant="outlined"
                    label="Umbral alto (>71%)"
                    rows="2"
                    placeholder="Describa el desempeño alto..."
                  ></v-textarea>
                </v-form>
              </v-window-item>

              <!-- Formulario Indicador Cuantitativo -->
              <v-window-item value="cuantitativo">
                <v-form ref="formIndCuantitativo">
                  <v-text-field
                    v-model="indicadorCuantitativo.codigo"
                    variant="outlined"
                    label="Código *"
                    required
                    :rules="[(v) => !!v || 'El código es requerido']"
                    placeholder="Ej: INDCUAN001"
                  ></v-text-field>
                  <v-textarea
                    v-model="indicadorCuantitativo.descripcion"
                    variant="outlined"
                    label="Descripción del Indicador *"
                    rows="3"
                    required
                    :rules="[(v) => !!v || 'La descripción es requerida']"
                    placeholder="Describa el indicador cuantitativo..."
                  ></v-textarea>
                  <v-textarea
                    v-model="indicadorCuantitativo.numerador"
                    variant="outlined"
                    label="Numerador"
                    rows="2"
                    placeholder="Describa el numerador..."
                  ></v-textarea>
                  <v-textarea
                    v-model="indicadorCuantitativo.denominador"
                    variant="outlined"
                    label="Denominador"
                    rows="2"
                    placeholder="Describa el denominador..."
                  ></v-textarea>
                  <v-text-field
                    v-model="indicadorCuantitativo.umbral_des_numeral"
                    variant="outlined"
                    label="Umbral numérico (%)"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Ej: 70"
                  ></v-text-field>
                  <v-select
                    v-model="indicadorCuantitativo.frecuencia_recopilacion"
                    :items="frecuencias"
                    variant="outlined"
                    label="Frecuencia de recopilación"
                    placeholder="Seleccione frecuencia"
                  ></v-select>
                  <v-textarea
                    v-model="indicadorCuantitativo.uso_informacion"
                    variant="outlined"
                    label="Uso de la Información"
                    rows="2"
                    placeholder="¿Cómo se utilizará la información?"
                  ></v-textarea>
                  <v-divider class="my-4"></v-divider>
                  <h4 class="text-h6 mb-3">Umbrales de Desempeño</h4>
                  <v-textarea
                    v-model="indicadorCuantitativo.umbral_des_literal_um1"
                    variant="outlined"
                    label="Umbral bajo (0-40%)"
                    rows="2"
                    placeholder="Describa el desempeño bajo..."
                  ></v-textarea>
                  <v-textarea
                    v-model="indicadorCuantitativo.umbral_des_literal_um2"
                    variant="outlined"
                    label="Umbral medio (41-70%)"
                    rows="2"
                    placeholder="Describa el desempeño medio..."
                  ></v-textarea>
                  <v-textarea
                    v-model="indicadorCuantitativo.umbral_des_literal_um3"
                    variant="outlined"
                    label="Umbral alto (>71%)"
                    rows="2"
                    placeholder="Describa el desempeño alto..."
                  ></v-textarea>
                </v-form>
              </v-window-item>
            </v-window>
          </v-card-text>
          <v-card-actions class="pa-4 justify-end">
            <v-spacer></v-spacer>
            <v-btn color="grey" @click="cerrarModalIndicador" :disabled="cargandoAccion">
              Cancelar
            </v-btn>
            <v-btn color="green" @click="guardarIndicador" :loading="cargandoAccion">
              {{ indicadorEdit.id ? 'Actualizar' : 'Guardar' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Modal: Nuevo/Editar Factor -->
      <v-dialog v-model="dialogFactor" max-width="600" persistent>
        <v-card>
          <v-card-title :class="`text-white ${factorEdit.id ? 'bg-primary' : 'bg-red'}`">
            <v-icon left>{{ factorEdit.id ? 'mdi-pencil' : 'mdi-plus' }}</v-icon>
            {{ factorEdit.id ? 'Editar' : 'Nuevo' }} Factor Crítico
            <v-chip color="white" size="small" class="ml-3">
              {{ obtenerCodigoObjetivo(objetivoSeleccionado) }}
            </v-chip>
          </v-card-title>
          <v-card-text class="pt-4">
            <v-form ref="formFactor">
              <v-textarea
                v-model="factorEdit.factor_critico"
                variant="outlined"
                label="Factor Crítico / de Riesgo *"
                rows="4"
                required
                :rules="[(v) => !!v || 'El factor crítico es requerido']"
                :disabled="cargandoAccion"
                placeholder="Describa el factor crítico o de riesgo..."
              ></v-textarea>
            </v-form>
          </v-card-text>
          <v-card-actions class="pa-4 justify-end">
            <v-btn color="grey" @click="cerrarModalFactor" :disabled="cargandoAccion">
              Cancelar
            </v-btn>
            <v-btn color="red" @click="guardarFactor" :loading="cargandoAccion">
              {{ factorEdit.id ? 'Actualizar' : 'Guardar' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Modal: Detalle Completo del Indicador -->
      <v-dialog v-model="dialogDetalleIndicador" max-width="600">
        <v-card>
          <v-card-title class="bg-info text-white">
            <v-icon left>mdi-chart-line</v-icon>
            Detalle del Indicador
            <v-chip color="white" size="small" class="ml-3">
              {{ indicadorDetalle?.codigo }}
            </v-chip>
          </v-card-title>
          <v-card-text class="pt-4">
            <div v-if="indicadorDetalle">
              <h4 class="text-h6 mb-2">Descripción</h4>
              <p class="text-body-1 mb-4">{{ indicadorDetalle.descripcion }}</p>

              <v-divider class="my-4"></v-divider>

              <h4 class="text-h6 mb-2">Información Adicional</h4>
              <v-table>
                <tbody>
                  <tr v-if="indicadorDetalle.tipo">
                    <td class="font-weight-bold">Tipo:</td>
                    <td>{{ getTipoIndicadorTexto(indicadorDetalle.tipo) }}</td>
                  </tr>
                  <tr v-if="indicadorDetalle.frecuencia_recopilacion">
                    <td class="font-weight-bold">Frecuencia:</td>
                    <td>{{ indicadorDetalle.frecuencia_recopilacion }}</td>
                  </tr>
                  <tr v-if="indicadorDetalle.captura_informacion">
                    <td class="font-weight-bold">Captura de información:</td>
                    <td>{{ indicadorDetalle.captura_informacion }}</td>
                  </tr>
                  <tr v-if="indicadorDetalle.responsabilidad">
                    <td class="font-weight-bold">Responsabilidad:</td>
                    <td>{{ indicadorDetalle.responsabilidad }}</td>
                  </tr>
                  <tr v-if="indicadorDetalle.uso_informacion">
                    <td class="font-weight-bold">Uso de la información:</td>
                    <td>{{ indicadorDetalle.uso_informacion }}</td>
                  </tr>
                  <tr v-if="indicadorDetalle.numerador">
                    <td class="font-weight-bold">Numerador:</td>
                    <td>{{ indicadorDetalle.numerador }}</td>
                  </tr>
                  <tr v-if="indicadorDetalle.denominador">
                    <td class="font-weight-bold">Denominador:</td>
                    <td>{{ indicadorDetalle.denominador }}</td>
                  </tr>
                  <tr v-if="indicadorDetalle.umbral_des_numeral">
                    <td class="font-weight-bold">Umbral numérico:</td>
                    <td>{{ indicadorDetalle.umbral_des_numeral }}%</td>
                  </tr>
                </tbody>
              </v-table>

              <!-- Umbrales de desempeño -->
              <template
                v-if="
                  indicadorDetalle.umbral_des_literal_um1 ||
                  indicadorDetalle.umbral_des_literal_um2 ||
                  indicadorDetalle.umbral_des_literal_um3
                "
              >
                <v-divider class="my-4"></v-divider>
                <h4 class="text-h6 mb-2">Umbrales de Desempeño</h4>
                <v-table>
                  <tbody>
                    <tr v-if="indicadorDetalle.umbral_des_literal_um1">
                      <td class="font-weight-bold" width="30%">Bajo (0-40%):</td>
                      <td>{{ indicadorDetalle.umbral_des_literal_um1 }}</td>
                    </tr>
                    <tr v-if="indicadorDetalle.umbral_des_literal_um2">
                      <td class="font-weight-bold">Medio (41-70%):</td>
                      <td>{{ indicadorDetalle.umbral_des_literal_um2 }}</td>
                    </tr>
                    <tr v-if="indicadorDetalle.umbral_des_literal_um3">
                      <td class="font-weight-bold">Alto (>71%):</td>
                      <td>{{ indicadorDetalle.umbral_des_literal_um3 }}</td>
                    </tr>
                  </tbody>
                </v-table>
              </template>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" @click="dialogDetalleIndicador = false"> Cerrar </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Modal: Detalle Completo del Factor -->
      <v-dialog v-model="dialogDetalleFactor" max-width="500">
        <v-card>
          <v-card-title class="bg-red text-white">
            <v-icon left>mdi-alert-circle</v-icon>
            Detalle del Factor Crítico
          </v-card-title>
          <v-card-text class="pt-4">
            <div v-if="factorDetalle">
              <h4 class="text-h6 mb-2">Descripción</h4>
              <p class="text-body-1">{{ factorDetalle.factor_critico }}</p>

              <v-divider class="my-4"></v-divider>

              <div class="text-caption text-grey">
                <p><v-icon size="small">mdi-information</v-icon> ID: {{ factorDetalle.id }}</p>
              </div>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" @click="dialogDetalleFactor = false"> Cerrar </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <ConfirmDialog></ConfirmDialog>
    </template>

    <v-alert v-if="errorPei && !cargando" type="error" variant="tonal" class="mt-4">
      No se pudo cargar la información del PEI. Por favor intente nuevamente.
    </v-alert>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'
import { usePeiStore } from '@/modules/pei/store/peiStore'
import { useSnackbar } from '@/composables/useSnackbar'
import {
  indicadorPeiServicios,
  objetivoPeiServicios,
  factorPeiServicios,
} from '@/modules/pei/services/peiService'
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import ConfirmDialog from '@/components/layout/partials/ConfirmDialog.vue'

const { openConfirmDialog } = useConfirmDialog()
const { successMsg, errorMsg } = useSnackbar()

const router = useRoute()
const peiID = router.params.id
const peiStore = usePeiStore()

// Configuración
const frecuencias = [
  'Diaria',
  'Semanal',
  'Quincenal',
  'Mensual',
  'Bimestral',
  'Trimestral',
  'Semestral',
  'Anual',
]

// Estados
const cargando = ref(true)
const cargandoAccion = ref(false)
const cargandoEdicion = ref(false)
const cargandoEliminacion = ref(false)
const cargandoEliminacionIndicador = ref(false)
const cargandoEliminacionFactor = ref(false)
const dialogObjetivo = ref(false)
const dialogIndicador = ref(false)
const dialogFactor = ref(false)
const dialogDetalleIndicador = ref(false)
const dialogDetalleFactor = ref(false)
const tabModalIndicador = ref('cualitativo')
const objetivoSeleccionado = ref(null)

// Datos para detalle
const indicadorDetalle = ref(null)
const factorDetalle = ref(null)

// Referencias a formularios
const formObjetivo = ref(null)
const formIndCualitativo = ref(null)
const formIndCuantitativo = ref(null)
const formFactor = ref(null)

// Datos del store - CORREGIDO: peiEstructura contiene { "PEI": {...} }
const { peiEstructura, error: errorPei } = storeToRefs(peiStore)

// Computed para simplificar el acceso
const estructuraPEI = computed(() => {
  return peiEstructura.value || {}
})

const {
  obtenerPeiEstructuraPorId,
  agregarIndicadorCualitativo,
  agregarIndicadorCuantitativo,
  eliminarObjetivo,
  removerObjetivoLocalmente,
} = peiStore

// Formularios
const objetivoEdit = ref({
  id: '',
  codigo: '',
  descripcion: '',
  pei: peiID,
})

const indicadorEdit = ref({
  id: '',
  tipo: '',
})

const indicadorCualitativo = ref({
  codigo: '',
  descripcion: '',
  captura_informacion: '',
  responsabilidad: '',
  frecuencia_recopilacion: '',
  uso_informacion: '',
  umbral_des_literal_um1: '',
  umbral_des_literal_um2: '',
  umbral_des_literal_um3: '',
  objetivo: '',
})

const indicadorCuantitativo = ref({
  codigo: '',
  descripcion: '',
  numerador: '',
  denominador: '',
  umbral_des_numeral: '',
  umbral_des_literal_um1: '',
  umbral_des_literal_um2: '',
  umbral_des_literal_um3: '',
  frecuencia_recopilacion: '',
  uso_informacion: '',
  objetivo: '',
})

const factorEdit = ref({
  id: '',
  factor_critico: '',
  objetivo: '',
})

// Métodos
const getIndicadorColor = (tipo) => {
  if (tipo.includes('cuantitativo')) return 'indigo'
  if (tipo.includes('cualitativo')) return 'teal'
  return 'grey'
}

const getIndicadorColorClass = (tipo) => {
  if (tipo.includes('cuantitativo')) return 'indicador-cuantitativo'
  if (tipo.includes('cualitativo')) return 'indicador-cualitativo'
  return ''
}

const getTipoIndicadorTexto = (tipo) => {
  if (tipo.includes('cuantitativo')) return 'Cuantitativo'
  if (tipo.includes('cualitativo')) return 'Cualitativo'
  return tipo
}

const formatFecha = (fecha) => {
  if (!fecha) return ''
  const date = new Date(fecha)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const truncarTexto = (texto, longitud) => {
  if (!texto) return ''
  if (texto.length <= longitud) return texto
  return texto.substring(0, longitud) + '...'
}

const obtenerCodigoObjetivo = (objetivoId) => {
  if (!estructuraPEI.value?.PEI?.objetivos) return ''
  const objetivo = estructuraPEI.value.PEI.objetivos.find((obj) => obj.id === objetivoId)
  return objetivo ? objetivo.codigo : 'Objetivo'
}

// Métodos para ver detalles
const verDetalleIndicador = (indicador) => {
  indicadorDetalle.value = indicador
  dialogDetalleIndicador.value = true
}

const verDetalleFactor = (factor) => {
  factorDetalle.value = factor
  dialogDetalleFactor.value = true
}

// Gestión de Objetivos
const abrirModalNuevoObjetivo = () => {
  objetivoEdit.value = {
    id: '',
    codigo: '',
    descripcion: '',
    pei: peiID,
  }
  dialogObjetivo.value = true
}

const editarObjetivo = (objetivo) => {
  objetivoEdit.value = {
    id: objetivo.id,
    codigo: objetivo.codigo,
    descripcion: objetivo.descripcion,
    pei: peiID,
  }
  dialogObjetivo.value = true
}

const guardarObjetivo = async () => {
  if (formObjetivo.value) {
    const { valid } = await formObjetivo.value.validate()
    if (!valid) return
  }

  try {
    cargandoAccion.value = true

    if (objetivoEdit.value.id) {
      // Actualizar objetivo existente
      await objetivoPeiServicios.update(objetivoEdit.value.id, objetivoEdit.value)
      successMsg('Objetivo actualizado correctamente')
    } else {
      // Crear nuevo objetivo
      await objetivoPeiServicios.crear(objetivoEdit.value)
      successMsg('Objetivo creado correctamente')
    }

    await cargarDatos()
    cerrarModalObjetivo()
  } catch (error) {
    console.error('Error al guardar objetivo', error)
    errorMsg('No se pudo guardar el objetivo')
  } finally {
    cargandoAccion.value = false
  }
}

const cerrarModalObjetivo = () => {
  dialogObjetivo.value = false
  objetivoEdit.value = {
    id: '',
    codigo: '',
    descripcion: '',
    pei: peiID,
  }
  if (formObjetivo.value) formObjetivo.value.reset()
}

const solicitarEliminarObjetivo = async (objetivo) => {
  const confirmed = await openConfirmDialog({
    title: 'Eliminar Objetivo PEI',
    message: `¿Está seguro que desea eliminar el objetivo "${objetivo.codigo}" y todos sus elementos asociados?`,
    confirmLabel: 'Eliminar',
    cancelLabel: 'Cancelar',
    type: 'delete',
  })

  if (confirmed) {
    try {
      cargandoAccion.value = true
      const eliminado = await eliminarObjetivo(objetivo.id)
      if (eliminado) {
        successMsg('Objetivo eliminado correctamente')
        await cargarDatos()
      } else {
        errorMsg('No se pudo eliminar el objetivo')
      }
    } catch (error) {
      console.error('Error al eliminar objetivo', error)
      errorMsg('Error al eliminar el objetivo')
    } finally {
      cargandoAccion.value = false
    }
  }
}

// Gestión de Indicadores
const abrirModalNuevoIndicador = (objetivoId) => {
  objetivoSeleccionado.value = objetivoId
  indicadorEdit.value = { id: '', tipo: '' }
  indicadorCualitativo.value = {
    codigo: '',
    descripcion: '',
    captura_informacion: '',
    responsabilidad: '',
    frecuencia_recopilacion: '',
    uso_informacion: '',
    umbral_des_literal_um1: '',
    umbral_des_literal_um2: '',
    umbral_des_literal_um3: '',
    objetivo: objetivoId,
  }
  indicadorCuantitativo.value = {
    codigo: '',
    descripcion: '',
    numerador: '',
    denominador: '',
    umbral_des_numeral: '',
    umbral_des_literal_um1: '',
    umbral_des_literal_um2: '',
    umbral_des_literal_um3: '',
    frecuencia_recopilacion: '',
    uso_informacion: '',
    objetivo: objetivoId,
  }
  tabModalIndicador.value = 'cualitativo'
  dialogIndicador.value = true
}

const editarIndicador = (indicador, objetivoId) => {
  objetivoSeleccionado.value = objetivoId
  indicadorEdit.value = { id: indicador.id, tipo: indicador.tipo }

  if (indicador.tipo.includes('cualitativo')) {
    tabModalIndicador.value = 'cualitativo'
    indicadorCualitativo.value = {
      codigo: indicador.codigo,
      descripcion: indicador.descripcion,
      captura_informacion: indicador.captura_informacion || '',
      responsabilidad: indicador.responsabilidad || '',
      frecuencia_recopilacion: indicador.frecuencia_recopilacion || '',
      uso_informacion: indicador.uso_informacion || '',
      umbral_des_literal_um1: indicador.umbral_des_literal_um1 || '',
      umbral_des_literal_um2: indicador.umbral_des_literal_um2 || '',
      umbral_des_literal_um3: indicador.umbral_des_literal_um3 || '',
      objetivo: objetivoId,
    }
  } else if (indicador.tipo.includes('cuantitativo')) {
    tabModalIndicador.value = 'cuantitativo'
    indicadorCuantitativo.value = {
      codigo: indicador.codigo,
      descripcion: indicador.descripcion,
      numerador: indicador.numerador || '',
      denominador: indicador.denominador || '',
      umbral_des_numeral: indicador.umbral_des_numeral || '',
      umbral_des_literal_um1: indicador.umbral_des_literal_um1 || '',
      umbral_des_literal_um2: indicador.umbral_des_literal_um2 || '',
      umbral_des_literal_um3: indicador.umbral_des_literal_um3 || '',
      frecuencia_recopilacion: indicador.frecuencia_recopilacion || '',
      uso_informacion: indicador.uso_informacion || '',
      objetivo: objetivoId,
    }
  }

  dialogIndicador.value = true
}

const guardarIndicador = async () => {
  try {
    if (tabModalIndicador.value === 'cualitativo') {
      if (formIndCualitativo.value) {
        const { valid } = await formIndCualitativo.value.validate()
        if (!valid) return
      }

      cargandoAccion.value = true

      if (indicadorEdit.value.id) {
        // Actualizar indicador cualitativo existente
        await indicadorPeiServicios.updateIndCualitativo(
          indicadorEdit.value.id,
          indicadorCualitativo.value,
        )
        successMsg('Indicador cualitativo actualizado')
        console.log('IND CUAL', indicadorCualitativo.value)
      } else {
        // Crear nuevo indicador cualitativo
        await agregarIndicadorCualitativo(objetivoSeleccionado.value, indicadorCualitativo.value)
        successMsg('Indicador cualitativo creado')
      }
    } else {
      if (formIndCuantitativo.value) {
        const { valid } = await formIndCuantitativo.value.validate()
        if (!valid) return
      }

      cargandoAccion.value = true

      if (indicadorEdit.value.id) {
        // Actualizar indicador cuantitativo existente
        await indicadorPeiServicios.updateIndCuantitativo(
          indicadorEdit.value.id,
          indicadorCuantitativo.value,
        )
        successMsg('Indicador cuantitativo actualizado')
        console.log('IND CUAN', indicadorCuantitativo)
      } else {
        // Crear nuevo indicador cuantitativo
        await agregarIndicadorCuantitativo(objetivoSeleccionado.value, indicadorCuantitativo.value)
        successMsg('Indicador cuantitativo creado')
      }
    }

    await cargarDatos()
    cerrarModalIndicador()
  } catch (error) {
    console.error('Error al guardar indicador', error)
    errorMsg('No se pudo guardar el indicador')
  } finally {
    cargandoAccion.value = false
  }
}

const cerrarModalIndicador = () => {
  dialogIndicador.value = false
  indicadorEdit.value = { id: '', tipo: '' }
  objetivoSeleccionado.value = null
  if (formIndCualitativo.value) formIndCualitativo.value.reset()
  if (formIndCuantitativo.value) formIndCuantitativo.value.reset()
}

const confirmarEliminarIndicador = async (objetivoId, indicadorId, codigo) => {
  const confirmed = await openConfirmDialog({
    title: 'Eliminar Indicador',
    message: `¿Está seguro que desea eliminar el indicador "${codigo}"?`,
    confirmLabel: 'Eliminar',
    cancelLabel: 'Cancelar',
    type: 'delete',
  })

  if (confirmed) {
    try {
      cargandoEliminacionIndicador.value = true
      await indicadorPeiServicios.eliminar(indicadorId)
      successMsg('Indicador eliminado correctamente')
      await cargarDatos()
    } catch (error) {
      console.error('Error al eliminar indicador', error)
      errorMsg('No se pudo eliminar el indicador')
    } finally {
      cargandoEliminacionIndicador.value = false
    }
  }
}

// Gestión de Factores
const abrirModalNuevoFactor = (objetivoId) => {
  objetivoSeleccionado.value = objetivoId
  factorEdit.value = {
    id: '',
    factor_critico: '',
    objetivo_especifico: objetivoId,
  }
  dialogFactor.value = true
}

const editarFactor = (factor, objetivoId) => {
  objetivoSeleccionado.value = objetivoId
  factorEdit.value = {
    id: factor.id,
    factor_critico: factor.factor_critico,
    objetivo: objetivoId,
  }
  dialogFactor.value = true
}

const guardarFactor = async () => {
  if (formFactor.value) {
    const { valid } = await formFactor.value.validate()
    if (!valid) return
  }

  try {
    cargandoAccion.value = true

    if (factorEdit.value.id) {
      // Actualizar factor existente
      await factorPeiServicios.update(factorEdit.value.id, factorEdit.value)
      successMsg('Factor crítico actualizado')
    } else {
      // Crear nuevo factor
      await factorPeiServicios.crear(factorEdit.value)
      successMsg('Factor crítico creado')
    }

    await cargarDatos()
    cerrarModalFactor()
  } catch (error) {
    console.error('Error al guardar factor', error)
    errorMsg('No se pudo guardar el factor crítico')
  } finally {
    cargandoAccion.value = false
  }
}

const cerrarModalFactor = () => {
  dialogFactor.value = false
  factorEdit.value = {
    id: '',
    factor_critico: '',
    objetivo: '',
  }
  objetivoSeleccionado.value = null
  if (formFactor.value) formFactor.value.reset()
}

const confirmarEliminarFactor = async (objetivoId, factorId, descripcion) => {
  const confirmed = await openConfirmDialog({
    title: 'Eliminar Factor Crítico',
    message: `¿Está seguro que desea eliminar el factor crítico "${descripcion.substring(0, 50)}..."?`,
    confirmLabel: 'Eliminar',
    cancelLabel: 'Cancelar',
    type: 'delete',
  })

  if (confirmed) {
    try {
      cargandoEliminacionFactor.value = true
      await factorPeiServicios.eliminar(factorId)
      successMsg('Factor crítico eliminado')
      await cargarDatos()
    } catch (error) {
      console.error('Error al eliminar factor', error)
      errorMsg('No se pudo eliminar el factor crítico')
    } finally {
      cargandoEliminacionFactor.value = false
    }
  }
}

// Carga inicial
const cargarDatos = async () => {
  try {
    cargando.value = true
    await obtenerPeiEstructuraPorId(peiID)
  } catch (error) {
    console.error('Error al cargar datos del PEI', error)
  } finally {
    cargando.value = false
  }
}

onMounted(() => {
  cargarDatos()
})
</script>

<style scoped>
.pei-container {
  max-width: 1400px;
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
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.marco-logico-table {
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
}

.marco-logico-table thead th {
  background-color: #f5f5f5;
  position: sticky;
  top: 0;
  z-index: 2;
  font-weight: 600;
  padding: 16px;
  border-bottom: 2px solid #e0e0e0;
  text-align: left;
}

.marco-logico-table tbody tr {
  transition: background-color 0.2s ease;
}

.marco-logico-table tbody tr:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.objetivo-row td {
  padding: 16px;
  vertical-align: top;
  border-bottom: 1px solid #e0e0e0;
}

.objetivo-cell {
  border-right: 1px solid #e0e0e0;
}

.indicadores-cell {
  border-right: 1px solid #e0e0e0;
}

.factores-cell {
  /* Última columna, sin borde derecho */
}

.objetivo-descripcion {
  max-height: 100px;
  overflow-y: auto;
  padding-right: 8px;
}

.indicadores-container,
.factores-container {
  max-height: 300px;
  overflow-y: auto;
  padding-right: 8px;
}

.indicador-item {
  border-radius: 6px;
  transition: all 0.2s ease;
  padding: 8px;
}

.indicador-cuantitativo {
  background-color: rgba(67, 160, 71, 0.08);
  border-left: 3px solid #43a047;
}

.indicador-cualitativo {
  background-color: rgba(3, 169, 244, 0.08);
  border-left: 3px solid #03a9f4;
}

.factor-item {
  border-radius: 6px;
  transition: all 0.2s ease;
  padding: 8px;
  background-color: rgba(244, 67, 54, 0.05);
  border-left: 3px solid #f44336;
}

.indicador-item:hover,
.factor-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Estilos para el texto con vista detallada */
.texto-contenedor {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.texto-truncado {
  flex: 1;
  min-width: 0; /* Importante para el truncado */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Scroll personalizado */
.indicadores-container::-webkit-scrollbar,
.factores-container::-webkit-scrollbar,
.objetivo-descripcion::-webkit-scrollbar {
  width: 6px;
}

.indicadores-container::-webkit-scrollbar-track,
.factores-container::-webkit-scrollbar-track,
.objetivo-descripcion::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.indicadores-container::-webkit-scrollbar-thumb,
.factores-container::-webkit-scrollbar-thumb,
.objetivo-descripcion::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.indicadores-container::-webkit-scrollbar-thumb:hover,
.factores-container::-webkit-scrollbar-thumb:hover,
.objetivo-descripcion::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Estilos para tabs */
:deep(.v-tab) {
  font-weight: 500;
}

:deep(.v-window-item) {
  padding-top: 16px;
}

/* Responsive */
@media (max-width: 960px) {
  .pei-container {
    padding: 16px 12px;
  }

  .marco-logico-table {
    display: block;
    overflow-x: auto;
  }

  .marco-logico-table thead th {
    font-size: 0.875rem;
    padding: 12px 8px;
  }

  .objetivo-row td {
    padding: 12px 8px;
  }

  .texto-contenedor {
    flex-direction: column;
    align-items: flex-start;
  }

  .texto-truncado {
    margin-bottom: 4px;
  }
}

@media (max-width: 600px) {
  .pei-container {
    padding: 12px 8px;
  }

  :deep(.v-tabs) {
    overflow-x: auto;
  }

  :deep(.v-tab) {
    font-size: 0.75rem;
    padding: 0 12px;
  }
}
</style>
