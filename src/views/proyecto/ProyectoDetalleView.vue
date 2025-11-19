<template>
  <v-container>
    <!-- CONTENIDO PRINCIPAL -->
    <v-row v-if="proyecto">
      <!-- Columna principal -->
      <v-col cols="12" md="8" lg="9">
        <div class="d-flex justify-space-between align-center mb-4">
          <PaginaTituloIcono
            :titulo="'Detalles del Proyecto'"
            :icon="'mdi-eye-outline'"
          ></PaginaTituloIcono>
          <v-btn color="success" @click="exportarAExcel" :loading="exportando">
            <v-icon icon="mdi-microsoft-excel" class="mr-2"></v-icon>
            Exportar a Excel
          </v-btn>
        </div>

        <!-- Información básica del proyecto -->
        <v-card variant="outlined" elevation="1" class="mb-4">
          <v-card-title class="d-flex align-center">
            <h3 class="text-h4">{{ proyecto.codigo }}</h3>
            <v-spacer></v-spacer>
            <v-chip :color="getStatusColor(proyecto.estado)" class="ml-2">
              {{ getEstadoTexto(proyecto.estado) }}
            </v-chip>
          </v-card-title>

          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  variant="outlined"
                  label="Título"
                  :model-value="proyecto.titulo"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  variant="outlined"
                  label="Descripción"
                  rows="3"
                  :model-value="proyecto.descripcion"
                  readonly
                ></v-textarea>
              </v-col>
            </v-row>

            <div class="d-flex flex-wrap gap-2 mt-2">
              <v-chip variant="outlined" class="mr-2 mb-2">
                <v-icon icon="mdi-office-building" left></v-icon>
                {{ formatInstanciaGestora(proyecto.instancia_gestora) }}
              </v-chip>

              <v-chip variant="outlined" class="mr-2 mb-2">
                <v-icon icon="mdi-finance" left></v-icon>
                {{ formatProcedenciaFondos(proyecto.procedencia_fondos) }}
              </v-chip>

              <v-chip variant="outlined" class="mr-2 mb-2">
                <v-icon icon="mdi-calendar-start" left></v-icon>
                {{ formatDate(proyecto.fecha_inicio) }}
              </v-chip>

              <v-chip variant="outlined" class="mb-2">
                <v-icon icon="mdi-calendar-end" left></v-icon>
                {{ formatDate(proyecto.fecha_finalizacion) }}
              </v-chip>

              <v-chip variant="outlined" color="primary" class="mb-2">
                <v-icon icon="mdi-cash" left></v-icon>
                ${{ proyecto.presupuesto }}
              </v-chip>
            </div>
          </v-card-text>
        </v-card>

        <!-- OBJETIVO GENERAL -->
        <v-card variant="outlined" elevation="1" class="mb-4" v-if="proyecto.objetivo_general">
          <v-card-title class="d-flex align-center bg-blue-lighten-5">
            <v-icon icon="mdi-bullseye" class="mr-2" color="primary"></v-icon>
            <h3 class="text-h5">Objetivo General</h3>
            <v-chip size="small" color="primary" class="ml-2">
              {{ proyecto.objetivo_general.codigo }}
            </v-chip>
          </v-card-title>

          <v-card-text>
            <!-- Descripción del Objetivo General -->
            <div class="mb-4">
              <p class="text-body-1">{{ proyecto.objetivo_general.descripcion }}</p>
            </div>

            <!-- Supuestos y Riesgos del Objetivo General -->
            <div
              class="mb-4"
              v-if="proyecto.objetivo_general.supuestos || proyecto.objetivo_general.riesgos"
            >
              <v-row>
                <v-col cols="12" md="6" v-if="proyecto.objetivo_general.supuestos">
                  <v-alert type="info" density="compact" title="Supuestos">
                    {{ proyecto.objetivo_general.supuestos }}
                  </v-alert>
                </v-col>
                <v-col cols="12" md="6" v-if="proyecto.objetivo_general.riesgos">
                  <v-alert type="warning" density="compact" title="Riesgos">
                    {{ proyecto.objetivo_general.riesgos }}
                  </v-alert>
                </v-col>
              </v-row>
            </div>

            <!-- Indicadores del Objetivo General -->
            <div v-if="proyecto.objetivo_general.indicador_og?.length" class="mb-6">
              <h4 class="text-h6 mb-3 d-flex align-center">
                <v-icon icon="mdi-chart-line" color="green" class="mr-2"></v-icon>
                Indicadores del Objetivo General
                <v-chip size="small" color="green" class="ml-2">
                  {{ proyecto.objetivo_general.indicador_og.length }}
                </v-chip>
              </h4>
              <IndicadoresLista
                :indicadores="proyecto.objetivo_general.indicador_og"
                tipo="objetivo_general"
              />
            </div>

            <!-- Resultados del Objetivo General -->
            <div v-if="proyecto.objetivo_general.resultados_og?.length" class="mb-4">
              <h4 class="text-h6 mb-3 d-flex align-center">
                <v-icon
                  icon="mdi-checkbox-multiple-marked-circle-outline"
                  color="orange"
                  class="mr-2"
                ></v-icon>
                Resultados del Objetivo General
                <v-chip size="small" color="orange" class="ml-2">
                  {{ proyecto.objetivo_general.resultados_og.length }}
                </v-chip>
              </h4>

              <v-expansion-panels variant="accordion" class="mb-4">
                <v-expansion-panel
                  v-for="(resultado, index) in proyecto.objetivo_general.resultados_og"
                  :key="`og-result-${index}`"
                  class="mb-2"
                >
                  <v-expansion-panel-title>
                    <div class="d-flex align-center">
                      <v-chip size="small" color="orange" class="mr-2">
                        {{ resultado.codigo }}
                      </v-chip>
                      <span class="text-body-1">
                        {{ resultado.descripcion.substring(0, 100) }}
                        {{ resultado.descripcion.length > 100 ? '...' : '' }}
                      </span>
                    </div>
                  </v-expansion-panel-title>

                  <v-expansion-panel-text>
                    <!-- Descripción del Resultado -->
                    <div class="mb-4">
                      <p class="text-body-1">{{ resultado.descripcion }}</p>
                    </div>

                    <!-- Supuestos y Riesgos del Resultado -->
                    <div class="mb-4" v-if="resultado.supuestos || resultado.riesgos">
                      <v-row>
                        <v-col cols="12" md="6" v-if="resultado.supuestos">
                          <v-alert type="info" density="compact" title="Supuestos">
                            {{ resultado.supuestos }}
                          </v-alert>
                        </v-col>
                        <v-col cols="12" md="6" v-if="resultado.riesgos">
                          <v-alert type="warning" density="compact" title="Riesgos">
                            {{ resultado.riesgos }}
                          </v-alert>
                        </v-col>
                      </v-row>
                    </div>

                    <!-- Indicadores del Resultado -->
                    <div v-if="resultado.indicador_res_og?.length" class="mb-4">
                      <h5 class="text-subtitle-1 mb-2 d-flex align-center">
                        <v-icon icon="mdi-chart-bar" size="small" class="mr-2"></v-icon>
                        Indicadores del Resultado
                        <v-chip size="small" color="blue" class="ml-2">
                          {{ resultado.indicador_res_og.length }}
                        </v-chip>
                      </h5>
                      <IndicadoresLista
                        :indicadores="resultado.indicador_res_og"
                        tipo="resultado_og"
                      />
                    </div>

                    <!-- Procesos del Resultado -->
                    <div v-if="resultado.proceso_resultado_og?.length" class="mb-4">
                      <h5 class="text-subtitle-1 mb-2 d-flex align-center">
                        <v-icon icon="mdi-cog-outline" size="small" class="mr-2"></v-icon>
                        Procesos Asociados
                        <v-chip size="small" color="purple" class="ml-2">
                          {{ resultado.proceso_resultado_og.length }}
                        </v-chip>
                      </h5>
                      <v-list lines="two">
                        <v-list-item
                          v-for="(proceso, procIndex) in resultado.proceso_resultado_og"
                          :key="`proc-${procIndex}`"
                        >
                          <v-list-item-title class="font-weight-medium">
                            {{ proceso.codigo }} - {{ proceso.titulo }}
                          </v-list-item-title>
                          <v-list-item-subtitle>
                            {{ proceso.descripcion }}
                          </v-list-item-subtitle>
                        </v-list-item>
                      </v-list>
                    </div>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
          </v-card-text>
        </v-card>

        <!-- OBJETIVOS ESPECÍFICOS -->
        <v-card
          variant="outlined"
          elevation="1"
          class="mb-4"
          v-if="proyecto.objetivo_general?.objetivos_especificos_og?.length"
        >
          <v-card-title class="d-flex align-center bg-green-lighten-5">
            <v-icon icon="mdi-target" class="mr-2" color="green"></v-icon>
            <h3 class="text-h5">Objetivos Específicos</h3>
            <v-chip size="small" color="green" class="ml-2">
              {{ proyecto.objetivo_general.objetivos_especificos_og.length }}
            </v-chip>
          </v-card-title>

          <v-card-text>
            <v-expansion-panels variant="accordion">
              <v-expansion-panel
                v-for="(objEsp, index) in proyecto.objetivo_general.objetivos_especificos_og"
                :key="`oe-${index}`"
                class="mb-4"
              >
                <v-expansion-panel-title>
                  <div class="d-flex align-center">
                    <v-chip size="small" color="green" class="mr-2">
                      {{ objEsp.codigo }}
                    </v-chip>
                    <span class="text-body-1">
                      {{ objEsp.descripcion.substring(0, 120) }}
                      {{ objEsp.descripcion.length > 120 ? '...' : '' }}
                    </span>
                  </div>
                </v-expansion-panel-title>

                <v-expansion-panel-text>
                  <!-- Descripción del Objetivo Específico -->
                  <div class="mb-4">
                    <p class="text-body-1">{{ objEsp.descripcion }}</p>
                  </div>

                  <!-- Indicadores del Objetivo Específico -->
                  <div v-if="objEsp.indicador_oe?.length" class="mb-4">
                    <h5 class="text-subtitle-1 mb-2 d-flex align-center">
                      <v-icon icon="mdi-chart-line" size="small" class="mr-2"></v-icon>
                      Indicadores del Objetivo Específico
                      <v-chip size="small" color="blue" class="ml-2">
                        {{ objEsp.indicador_oe.length }}
                      </v-chip>
                    </h5>
                    <IndicadoresLista
                      :indicadores="objEsp.indicador_oe"
                      tipo="objetivo_especifico"
                    />
                  </div>

                  <!-- Resultados del Objetivo Específico -->
                  <div v-if="objEsp.resultados_oe?.length" class="mb-4">
                    <h5 class="text-subtitle-1 mb-2 d-flex align-center">
                      <v-icon
                        icon="mdi-checkbox-multiple-marked-circle-outline"
                        size="small"
                        class="mr-2"
                      ></v-icon>
                      Resultados
                      <v-chip size="small" color="orange" class="ml-2">
                        {{ objEsp.resultados_oe.length }}
                      </v-chip>
                    </h5>

                    <v-expansion-panels variant="accordion">
                      <v-expansion-panel
                        v-for="(resultado, resIndex) in objEsp.resultados_oe"
                        :key="`oe-result-${resIndex}`"
                        class="mb-2"
                      >
                        <v-expansion-panel-title>
                          <div class="d-flex align-center">
                            <v-chip size="small" color="orange" class="mr-2">
                              {{ resultado.codigo }}
                            </v-chip>
                            <span class="text-body-2">
                              {{ resultado.descripcion.substring(0, 80) }}
                              {{ resultado.descripcion.length > 80 ? '...' : '' }}
                            </span>
                          </div>
                        </v-expansion-panel-title>

                        <v-expansion-panel-text>
                          <!-- Descripción del Resultado -->
                          <div class="mb-4">
                            <p class="text-body-2">{{ resultado.descripcion }}</p>
                          </div>

                          <!-- Indicadores del Resultado -->
                          <div v-if="resultado.indicador_res_oe?.length" class="mb-4">
                            <h6 class="text-subtitle-2 mb-2 d-flex align-center">
                              <v-icon icon="mdi-chart-bar" size="x-small" class="mr-2"></v-icon>
                              Indicadores del Resultado
                              <v-chip size="small" color="blue" class="ml-2">
                                {{ resultado.indicador_res_oe.length }}
                              </v-chip>
                            </h6>
                            <IndicadoresLista
                              :indicadores="resultado.indicador_res_oe"
                              tipo="resultado_oe"
                            />
                          </div>

                          <!-- Productos del Resultado -->
                          <div v-if="resultado.productos_res_oe?.length" class="mb-4">
                            <h6 class="text-subtitle-2 mb-2 d-flex align-center">
                              <v-icon
                                icon="mdi-package-variant"
                                size="x-small"
                                class="mr-2"
                              ></v-icon>
                              Productos del Resultado
                              <v-chip size="small" color="teal" class="ml-2">
                                {{ resultado.productos_res_oe.length }}
                              </v-chip>
                            </h6>
                            <ProductosLista :productos="resultado.productos_res_oe" />
                          </div>

                          <!-- Procesos del Resultado -->
                          <div v-if="resultado.proceso_resultado_oe?.length" class="mb-4">
                            <h6 class="text-subtitle-2 mb-2 d-flex align-center">
                              <v-icon icon="mdi-cog-outline" size="x-small" class="mr-2"></v-icon>
                              Procesos Asociados
                              <v-chip size="small" color="purple" class="ml-2">
                                {{ resultado.proceso_resultado_oe.length }}
                              </v-chip>
                            </h6>
                            <v-list lines="two" density="compact">
                              <v-list-item
                                v-for="(proceso, procIndex) in resultado.proceso_resultado_oe"
                                :key="`proc-oe-${procIndex}`"
                              >
                                <v-list-item-title class="font-weight-medium text-body-2">
                                  {{ proceso.codigo }} - {{ proceso.titulo }}
                                </v-list-item-title>
                                <v-list-item-subtitle class="text-caption">
                                  {{ proceso.descripcion }}
                                </v-list-item-subtitle>
                              </v-list-item>
                            </v-list>
                          </div>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </div>

                  <!-- Productos directos del Objetivo Específico -->
                  <div v-if="objEsp.productos_oe?.length" class="mb-4">
                    <h5 class="text-subtitle-1 mb-2 d-flex align-center">
                      <v-icon icon="mdi-package-variant-closed" size="small" class="mr-2"></v-icon>
                      Productos Directos
                      <v-chip size="small" color="teal" class="ml-2">
                        {{ objEsp.productos_oe.length }}
                      </v-chip>
                    </h5>
                    <ProductosLista :productos="objEsp.productos_oe" />
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Columna lateral -->
      <v-col cols="12" md="4" lg="3">
        <!-- Resumen del proyecto -->
        <v-card class="sticky-card" elevation="6">
          <v-card-title class="bg-primary text-white">
            <h3 class="text-h5">Resumen del Proyecto</h3>
          </v-card-title>
          <v-card-text>
            <!-- Información básica -->
            <div class="mb-4">
              <div class="text-subtitle-2 text-grey">Código</div>
              <div class="text-h6">{{ proyecto.codigo }}</div>
            </div>

            <!-- Progreso general -->
            <div class="d-flex align-center mb-4">
              <v-progress-circular
                :rotate="360"
                :size="80"
                :width="10"
                :model-value="porcentajeCompletado"
                color="primary"
              >
                <strong>{{ porcentajeCompletado }}%</strong>
              </v-progress-circular>

              <div class="ml-4">
                <div class="text-subtitle-1">Progreso total</div>
                <div class="text-caption text-grey">
                  Inicio: {{ formatDate(proyecto.fecha_inicio) }}
                </div>
                <div class="text-caption text-grey">
                  Fin: {{ formatDate(proyecto.fecha_finalizacion) }}
                </div>
              </div>
            </div>

            <!-- Estadísticas -->
            <v-divider class="my-3"></v-divider>
            <h3 class="mb-2">Estadísticas</h3>

            <div class="mb-3">
              <div class="d-flex justify-space-between mb-2">
                <span class="text-caption">Objetivos Específicos</span>
                <v-chip size="small" color="green">
                  {{ contarObjetivosEspecificos }}
                </v-chip>
              </div>
              <div class="d-flex justify-space-between mb-2">
                <span class="text-caption">Resultados</span>
                <v-chip size="small" color="orange">
                  {{ contarResultados }}
                </v-chip>
              </div>
              <div class="d-flex justify-space-between mb-2">
                <span class="text-caption">Productos</span>
                <v-chip size="small" color="teal">
                  {{ contarProductos }}
                </v-chip>
              </div>
              <div class="d-flex justify-space-between mb-2">
                <span class="text-caption">Indicadores OG</span>
                <v-chip size="small" color="blue">
                  {{ contarIndicadoresOG }}
                </v-chip>
              </div>
              <div class="d-flex justify-space-between">
                <span class="text-caption">Indicadores OE</span>
                <v-chip size="small" color="purple">
                  {{ contarIndicadoresOE }}
                </v-chip>
              </div>
            </div>

            <!-- Presupuesto -->
            <v-divider class="my-3"></v-divider>
            <h3 class="mb-2">Presupuesto</h3>

            <div class="d-flex justify-space-between mb-1">
              <span class="text-caption">Asignado</span>
              <span class="text-caption font-weight-bold">${{ proyecto.presupuesto }}</span>
            </div>

            <div class="d-flex justify-space-between mb-2">
              <span class="text-caption">Utilizado</span>
              <span class="text-caption">${{ presupuestoUtilizado }}</span>
            </div>

            <v-progress-linear
              :model-value="porcentajePresupuestoUtilizado"
              height="15"
              color="deep-purple-accent-4"
              rounded
              class="mt-1"
            >
              <template v-slot:default="{ value }">
                <strong>{{ Math.ceil(value) }}%</strong>
              </template>
            </v-progress-linear>

            <!-- Fecha de creación -->
            <v-divider class="my-3"></v-divider>
            <div class="text-caption text-grey">
              Creado: {{ formatDateTime(proyecto.fecha_creacion) }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getStatusColor, getEstadoTexto } from '@/utility/formatters'
import IndicadoresLista from '@/modules/proyecto/components/partials/IndicadoresLista.vue'
import ProductosLista from '@/modules/proyecto/components/partials/ProductosLista.vue'
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'

// Estado para exportación
const exportando = ref(false)

// DATOS DE PRUEBA DIRECTOS
const proyecto = ref({
  id: 1,
  codigo: 'CBM',
  titulo: 'Educacion inclusiva',
  descripcion: 'Incorporacion de enfoque de inclusion sistema educativo',
  fecha_creacion: '2025-09-16T08:44:18.186044-04:00',
  fecha_inicio: '2025-09-15',
  fecha_finalizacion: '2025-10-12',
  estado: 'EP',
  presupuesto: '4564.00',
  instancia_gestora: ['UG'],
  procedencia_fondos: ['FP'],
  objetivo_general: {
    id: 1,
    kpis: [],
    indicador_og: [
      {
        id: 1,
        codigo: 'IND001-OO',
        descripcion:
          'Actas, listas de participantes, reportes de actividades, políticas públicas propuestas o formuladas, fotografías.',
        redaccion: 'GUIA',
        fuente_verificacion: 'Fuentes de verificacion',
        target_poblacion: '',
        fechaTargetPoblacion: null,
        tipo: 'A-Z',
        frecuencia: 'MENSUAL',
        responsable: null,
        baseline: '',
        fechaLineaBase: null,
        target_q1: '',
        fechaTargetQ1: null,
        target_q2: '',
        fechaTargetQ2: null,
        target_q3: '',
        fechaTargetQ3: null,
        target_q4: null,
        fechaTargetQ4: null,
        polymorphic_ctype: 29,
        objetivo_general: 1,
      },
      {
        id: 5,
        codigo: 'IND002-OO',
        descripcion: 'Descripcion del IND002-OO',
        redaccion: 'GUIA',
        fuente_verificacion: 'Fuentes de verificacion',
        target_poblacion: '14',
        fechaTargetPoblacion: '2025-10-12',
        tipo: '1-9',
        frecuencia: 'MENSUAL',
        responsable: null,
        baseline: '0',
        fechaLineaBase: '2025-10-01',
        target_q1: '25',
        fechaTargetQ1: '2025-10-02',
        target_q2: '',
        fechaTargetQ2: null,
        target_q3: '',
        fechaTargetQ3: null,
        target_q4: null,
        fechaTargetQ4: null,
        polymorphic_ctype: 29,
        objetivo_general: 1,
      },
    ],
    resultados_og: [
      {
        id: 4,
        indicador_res_og: [
          {
            id: 7,
            codigo: 'IND001-R001-OG',
            descripcion: 'Descripcion IND001-R001-OG',
            redaccion: 'GUIA',
            fuente_verificacion: 'Fuente Verificacion',
            target_poblacion: '',
            fechaTargetPoblacion: null,
            tipo: '1-9',
            frecuencia: 'MENSUAL',
            responsable: null,
            baseline: '',
            fechaLineaBase: null,
            target_q1: '',
            fechaTargetQ1: null,
            target_q2: '',
            fechaTargetQ2: null,
            target_q3: '',
            fechaTargetQ3: null,
            target_q4: null,
            fechaTargetQ4: null,
            polymorphic_ctype: 22,
            resultado_og: 4,
          },
          {
            id: 8,
            codigo: 'IND002-R0-OG',
            descripcion: '',
            redaccion: 'GUIA',
            fuente_verificacion: 'Fuente Verificacion',
            target_poblacion: '',
            fechaTargetPoblacion: null,
            tipo: 'A-Z',
            frecuencia: 'MENSUAL',
            responsable: null,
            baseline: '',
            fechaLineaBase: null,
            target_q1: '',
            fechaTargetQ1: null,
            target_q2: '',
            fechaTargetQ2: null,
            target_q3: '',
            fechaTargetQ3: null,
            target_q4: null,
            fechaTargetQ4: null,
            polymorphic_ctype: 22,
            resultado_og: 4,
          },
        ],
        proceso_resultado_og: [
          {
            id: 1,
            actividades: [],
            codigo: 'PROC001-R001-OG',
            titulo: 'Procesos Res OG',
            descripcion: 'DEscripcion Res OG',
            resultado_og: 4,
            resultado_oe: null,
            producto_oe: null,
          },
        ],
        actividad_resultado_og: [],
        codigo: 'R001-OG',
        descripcion: 'Descripcion del resultado de obj gral',
        supuestos: 'sup res obj gral',
        riesgos: 'riesg res obj gral',
        polymorphic_ctype: 34,
        objetivo_general: 1,
      },
      {
        id: 5,
        indicador_res_og: [],
        proceso_resultado_og: [],
        actividad_resultado_og: [],
        codigo: 'R002-OG',
        descripcion: 'Descripcion del resultado de obj gral R002-OG',
        supuestos: 'sup res obj gralR002-OG',
        riesgos: 'riesg res obj gralR002-OG',
        polymorphic_ctype: 34,
        objetivo_general: 1,
      },
    ],
    objetivos_especificos_og: [
      {
        id: 1,
        indicador_oe: [
          {
            id: 3,
            codigo: 'IND001-SPO1',
            descripcion: 'Documento de propuesta de Politica Publica de Educacion',
            redaccion: 'SMART',
            fuente_verificacion: '',
            target_poblacion: '',
            fechaTargetPoblacion: null,
            tipo: 'A-Z',
            frecuencia: 'MENSUAL',
            responsable: '',
            baseline: '0',
            fechaLineaBase: null,
            target_q1: '1',
            fechaTargetQ1: null,
            target_q2: '',
            fechaTargetQ2: null,
            target_q3: '',
            fechaTargetQ3: null,
            target_q4: null,
            fechaTargetQ4: null,
            polymorphic_ctype: 28,
            objetivo_especifico: 1,
          },
        ],
        resultados_oe: [
          {
            id: 1,
            indicador_res_oe: [
              {
                id: 2,
                codigo: 'IND001-RES01-SPO1',
                descripcion:
                  'Prueba de ingreso y salida de los procesos de formación, modulos de formación, materiales listas de participantes, fotografías.',
                redaccion: 'GUIA',
                fuente_verificacion: '',
                target_poblacion: '1',
                fechaTargetPoblacion: null,
                tipo: '1-9',
                frecuencia: 'MENSUAL',
                responsable: null,
                baseline: '0',
                fechaLineaBase: null,
                target_q1: '40',
                fechaTargetQ1: null,
                target_q2: '',
                fechaTargetQ2: null,
                target_q3: '',
                fechaTargetQ3: null,
                target_q4: null,
                fechaTargetQ4: null,
                polymorphic_ctype: 33,
                resultado_obj_especifico: 1,
              },
            ],
            productos_res_oe: [
              {
                id: 1,
                codigo: 'PROD001-RES01-SPO1',
                descripcion: 'Producto de res01',
                supuestos: 'sup prod',
                riesgos: 'risk prod',
                entregado: false,
                polymorphic_ctype: 32,
                objetivo_especifico: null,
              },
            ],
            proceso_resultado_oe: [
              {
                id: 2,
                actividades: [],
                codigo: 'PROC001-RES01-SPO1',
                titulo: 'Proceso Resultado OE',
                descripcion: '',
                resultado_og: null,
                resultado_oe: 1,
                producto_oe: null,
              },
            ],
            actividad_resultado_oe: [],
            codigo: 'RES01-SPO1',
            descripcion:
              'Representantes de 5 Federaciones Nacionales (FEBOPDIF, FENACIEBO, FEBOLDI, FEBOLDIPSI, FEBOS), el Comité Nacional de Educación Inclusiva y el Comité Nacional de Incidencia, se han articulado y fortalecido capacidades en incidencia política, enfoque de género, el derecho a defender derechos, educación inclusiva, comunicación para la incidencia y metodologías de diálogos multiactor.',
            supuestos: '',
            riesgos: '',
            polymorphic_ctype: 31,
            objetivo_especifico: 1,
          },
          {
            id: 2,
            indicador_res_oe: [],
            productos_res_oe: [],
            proceso_resultado_oe: [],
            actividad_resultado_oe: [],
            codigo: 'RES02-SPO1',
            descripcion:
              'Federaciones Nacionales de personas con discapacidad y Comités Nacionales articulados, inciden en la implementación de una política pública de educación inclusiva para personas con discapacidad, con autoridades nacionales, OPD y sociedad civil.',
            supuestos: '',
            riesgos: '',
            polymorphic_ctype: 31,
            objetivo_especifico: 1,
          },
        ],
        productos_oe: [
          {
            id: 2,
            proceso_producto_oe: [
              {
                id: 3,
                actividades: [],
                codigo: 'PROC',
                titulo: 'Proceso Producto OE',
                descripcion: '',
                resultado_og: null,
                resultado_oe: null,
                producto_oe: 2,
              },
            ],
            actividad_producto_oe: [],
            codigo: 'P001-SO',
            descripcion: 'cdcsdc',
            supuestos: 'sup prod oe',
            riesgos: 'risk oe',
            entregado: false,
            polymorphic_ctype: 30,
            objetivo_especifico: 1,
          },
        ],
        codigo: 'SPO1',
        descripcion:
          'Promover la articulación entre las Federaciones de personas con discapacidad (OPD); FEBOPDIF, FENACIEBO, FEBOLDI, FEBOLDIPSI, FEBOS, el Comité Nacional de Educación Inclusiva y el Comité de Incidencia Política, para la formulación de una Política Pública de Educación Inclusiva para personas con discapacidad.',
        supuestos: '',
        riesgos: '',
        proyecto: null,
        objetivo_general: 1,
      },
      {
        id: 2,
        indicador_oe: [],
        resultados_oe: [],
        productos_oe: [],
        codigo: 'SPO2',
        descripcion: '',
        supuestos: '',
        riesgos: '',
        proyecto: null,
        objetivo_general: 1,
      },
    ],
    codigo: 'OO',
    descripcion:
      'Contribuir al fortalecimiento de competencias estratégicas y capacidades de mujeres y hombres dirigentes con discapacidad de organizaciones nacionales, para promover la inclusión social, el ejercicio del derecho a la educación, y el diálogo multiactor, facilitando su acceso a espacios público-políticos para la formulación de políticas inclusivas.',
    supuestos: '',
    riesgos:
      'Injerencia Político-Partidaria en las OPD: La politización de las OPD puede llevar a conflictos de interés y comprometer la independencia y eficacia de las organizaciones en la promoción de los derechos de las personas con discapacidad.',
    proyecto: 1,
  },
  objetivos_especificos: [],
})

// Hook onMounted - Simulamos carga de datos
onMounted(() => {
  console.log('Datos de prueba cargados:', proyecto.value)
})

// Estadísticas computadas
const contarObjetivosEspecificos = computed(() => {
  return proyecto.value?.objetivo_general?.objetivos_especificos_og?.length || 0
})

const contarResultados = computed(() => {
  let count = 0
  const og = proyecto.value?.objetivo_general
  if (og?.resultados_og) count += og.resultados_og.length
  if (og?.objetivos_especificos_og) {
    og.objetivos_especificos_og.forEach((oe) => {
      if (oe.resultados_oe) count += oe.resultados_oe.length
    })
  }
  return count
})

const contarProductos = computed(() => {
  let count = 0
  const og = proyecto.value?.objetivo_general
  if (og?.objetivos_especificos_og) {
    og.objetivos_especificos_og.forEach((oe) => {
      if (oe.productos_oe) count += oe.productos_oe.length
      if (oe.resultados_oe) {
        oe.resultados_oe.forEach((resultado) => {
          if (resultado.productos_res_oe) count += resultado.productos_res_oe.length
        })
      }
    })
  }
  return count
})

const contarIndicadoresOG = computed(() => {
  let count = 0
  const og = proyecto.value?.objetivo_general
  if (og?.indicador_og) count += og.indicador_og.length
  if (og?.resultados_og) {
    og.resultados_og.forEach((resultado) => {
      if (resultado.indicador_res_og) count += resultado.indicador_res_og.length
    })
  }
  return count
})

const contarIndicadoresOE = computed(() => {
  let count = 0
  const og = proyecto.value?.objetivo_general
  if (og?.objetivos_especificos_og) {
    og.objetivos_especificos_og.forEach((oe) => {
      if (oe.indicador_oe) count += oe.indicador_oe.length
      if (oe.resultados_oe) {
        oe.resultados_oe.forEach((resultado) => {
          if (resultado.indicador_res_oe) count += resultado.indicador_res_oe.length
        })
      }
    })
  }
  return count
})

// Porcentaje de avance del proyecto
const porcentajeCompletado = computed(() => {
  return 35 // Ejemplo estático para demostración
})

const presupuestoUtilizado = computed(() => {
  return 1200 // Ejemplo estático
})

const porcentajePresupuestoUtilizado = computed(() => {
  const presupuesto = parseFloat(proyecto.value?.presupuesto) || 0
  return presupuesto > 0 ? (presupuestoUtilizado.value / presupuesto) * 100 : 0
})

// Funciones de utilidad
const formatDate = (dateString) => {
  if (!dateString) return 'No definida'
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('es-ES', options)
}

const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return 'No definida'
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
  return new Date(dateTimeString).toLocaleDateString('es-ES', options)
}

const formatInstanciaGestora = (instancias) => {
  if (!instancias || !Array.isArray(instancias)) return 'No definida'
  return instancias.join(', ')
}

const formatProcedenciaFondos = (fondos) => {
  if (!fondos || !Array.isArray(fondos)) return 'No definida'
  return fondos.join(', ')
}

// Función para exportar a Excel
const exportarAExcel = async () => {
  exportando.value = true
  try {
    // Simulamos la exportación
    await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log('Exportando proyecto a Excel:', proyecto.value)
    alert('Proyecto exportado exitosamente a Excel')
  } catch (error) {
    console.error('Error al exportar a Excel:', error)
    alert('Error al exportar a Excel')
  } finally {
    exportando.value = false
  }
}
</script>

<style scoped>
.v-card {
  margin-bottom: 24px;
}

.v-card:last-child {
  margin-bottom: 0;
}

.sticky-card {
  position: sticky;
  top: 20px;
}

.v-card {
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15) !important;
}

.v-expansion-panel {
  border-radius: 6px !important;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.text-caption {
  font-size: 0.75rem;
}

.gap-2 {
  gap: 8px;
}
</style>
