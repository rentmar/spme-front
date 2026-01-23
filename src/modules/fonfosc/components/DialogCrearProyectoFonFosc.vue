<template>
  <v-dialog v-model="dialog" max-width="1200" persistent scrollable fullscreen>
    <v-card>
      <!-- Header del diálogo -->
      <v-toolbar color="primary" density="compact">
        <v-toolbar-title class="text-white">
          <v-icon left>mdi-file-plus</v-icon>
          NUEVO PROYECTO FONFOSC (MODO PRUEBA)
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon color="white" @click="cerrarDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <!-- Contenedor principal con scroll -->
      <div class="dialog-content">
        <!-- Stepper con altura automática -->
        <v-stepper v-model="pasoActual" :items="pasos" editable class="stepper-custom">
          <!-- Paso 1: Datos Institucionales -->
          <template v-slot:item.1>
            <v-card flat class="paso-card">
              <v-card-title class="text-h6 bg-blue-lighten-5 pa-4">
                <v-icon left color="primary">mdi-office-building</v-icon>
                Datos Institucionales
              </v-card-title>
              <v-card-text class="pt-6">
                <v-form>
                  <v-row>
                    <v-col cols="12">
                      <v-select
                        v-model="institucionSeleccionada"
                        :items="institucionesRegistradas"
                        item-title="nombre_completo"
                        item-value="id"
                        label="Seleccione institución registrada (opcional)"
                        variant="outlined"
                        placeholder="Busque o seleccione una institución"
                        @update:model-value="cargarDatosInstitucion"
                        clearable
                      >
                        <template v-slot:item="{ props, item }">
                          <v-list-item v-bind="props">
                            <template v-slot:prepend>
                              <v-icon>mdi-office-building</v-icon>
                            </template>
                            <v-list-item-title>
                              <strong>{{ item.raw.sigla }}</strong> - {{ item.raw.nombre }}
                            </v-list-item-title>
                            <v-list-item-subtitle>
                              {{ item.raw.departamento }} • {{ item.raw.email }}
                            </v-list-item-subtitle>
                          </v-list-item>
                        </template>
                      </v-select>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="datosProyecto.institucion.sigla"
                        label="SIGLA"
                        variant="outlined"
                        placeholder="Ej: ACLO"
                        :readonly="institucionSeleccionada !== null"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="datosProyecto.institucion.nombre"
                        label="Nombre de la institución"
                        variant="outlined"
                        placeholder="Ej: Fundación Acción Cultural Loyola"
                        :readonly="institucionSeleccionada !== null"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="datosProyecto.institucion.departamento"
                        :items="departamentosBolivia"
                        label="Departamento de intervención"
                        variant="outlined"
                        placeholder="Seleccione departamento"
                        :readonly="institucionSeleccionada !== null"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="datosProyecto.institucion.email"
                        label="Correo electrónico"
                        variant="outlined"
                        type="email"
                        placeholder="ejemplo@institucion.org"
                        :readonly="institucionSeleccionada !== null"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="datosProyecto.institucion.responsable"
                        label="Responsable"
                        variant="outlined"
                        placeholder="Nombre completo del responsable"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
            </v-card>
          </template>

          <!-- Paso 2: Resumen del Proyecto -->
          <template v-slot:item.2>
            <v-card flat class="paso-card">
              <v-card-title class="text-h6 bg-blue-lighten-5 pa-4">
                <v-icon left color="primary">mdi-text-box-outline</v-icon>
                Resumen del Proyecto
              </v-card-title>
              <v-card-text class="pt-6">
                <v-form>
                  <v-textarea
                    v-model="datosProyecto.resumen_proyecto"
                    label="Resumen del plan estratégico"
                    variant="outlined"
                    rows="6"
                    placeholder="Describa brevemente el proyecto..."
                  ></v-textarea>
                </v-form>
              </v-card-text>
            </v-card>
          </template>

          <!-- Paso 3: Información General -->
          <template v-slot:item.3>
            <v-card flat class="paso-card">
              <v-card-title class="text-h6 bg-blue-lighten-5 pa-4">
                <v-icon left color="primary">mdi-information</v-icon>
                Información General del Proyecto
              </v-card-title>
              <v-card-text class="pt-6">
                <v-form>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="datosProyecto.codigo"
                        label="Código del proyecto"
                        variant="outlined"
                        placeholder="Ej: FF00001"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="datosProyecto.categoria"
                        :items="categoriasProyecto"
                        label="Categoría"
                        variant="outlined"
                        placeholder="Seleccione categoría"
                      ></v-select>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="datosProyecto.titulo"
                        label="Título del proyecto"
                        variant="outlined"
                        placeholder="Título descriptivo del proyecto"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="datosProyecto.fecha_inicio"
                        label="Fecha de inicio"
                        variant="outlined"
                        type="date"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="datosProyecto.fecha_cierre"
                        label="Fecha de cierre"
                        variant="outlined"
                        type="date"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        v-model="datosProyecto.cobertura_geografica"
                        label="Cobertura geográfica"
                        variant="outlined"
                        rows="3"
                        placeholder="Describa la ubicación geográfica del proyecto..."
                        auto-grow
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
            </v-card>
          </template>

          <!-- Paso 4: Contexto -->
          <template v-slot:item.4>
            <v-card flat class="paso-card">
              <v-card-title class="text-h6 bg-blue-lighten-5 pa-4">
                <v-icon left color="primary">mdi-earth</v-icon>
                Pertinencia
              </v-card-title>
              <v-card-text class="pt-6">
                <v-form>
                  <v-textarea
                    v-model="datosProyecto.pertinencia.contexto"
                    label="¿Cuáles son los factores políticos, económicos y sociales relevantes para el proyecto?"
                    variant="outlined"
                    rows="8"
                    placeholder="Describa el contexto del proyecto..."
                    auto-grow
                  ></v-textarea>
                </v-form>
              </v-card-text>
            </v-card>
          </template>

          <!-- Paso 5: Problemática -->
          <template v-slot:item.5>
            <v-card flat class="paso-card">
              <v-card-title class="text-h6 bg-blue-lighten-5 pa-4">
                <v-icon left color="primary">mdi-alert-circle</v-icon>
                Problemática Identificada
              </v-card-title>
              <v-card-text class="pt-6">
                <v-form>
                  <v-textarea
                    v-model="datosProyecto.pertinencia.problematica"
                    label="¿Cuál es la problemática central o la necesidad identificada que asume el proyecto?"
                    variant="outlined"
                    rows="6"
                    placeholder="Describa la problemática central..."
                    auto-grow
                  ></v-textarea>
                  <div class="mt-4">
                    <v-text-field
                      v-model="datosProyecto.pertinencia.fuentes"
                      label="Fuentes de información"
                      variant="outlined"
                      placeholder="Cite las fuentes utilizadas..."
                    ></v-text-field>
                  </div>
                </v-form>
              </v-card-text>
            </v-card>
          </template>

          <!-- Paso 6: Respuesta al Problema -->
          <template v-slot:item.6>
            <v-card flat class="paso-card">
              <v-card-title class="text-h6 bg-blue-lighten-5 pa-4">
                <v-icon left color="primary">mdi-lightbulb-on</v-icon>
                Respuesta del Proyecto
              </v-card-title>
              <v-card-text class="pt-6">
                <v-form>
                  <v-textarea
                    v-model="datosProyecto.pertinencia.respuesta_problematica"
                    label="¿Cómo responde el proyecto a la problemática o necesidad identificada?"
                    variant="outlined"
                    rows="6"
                    placeholder="Describa cómo el proyecto responde a la problemática..."
                    auto-grow
                  ></v-textarea>
                </v-form>
              </v-card-text>
            </v-card>
          </template>

          <!-- Paso 7: Pertinencia PEI -->
          <template v-slot:item.7>
            <v-card flat class="paso-card">
              <v-card-title class="text-h6 bg-blue-lighten-5 pa-4">
                <v-icon left color="primary">mdi-target</v-icon>
                Pertinencia PEI
              </v-card-title>
              <v-card-text class="pt-6">
                <v-form>
                  <v-select
                    v-model="datosProyecto.pei.objetivos"
                    :items="objetivosPEI"
                    label="Objetivos PEI relacionados"
                    variant="outlined"
                    multiple
                    chips
                    placeholder="Seleccione objetivos PEI"
                  ></v-select>

                  <div class="mt-6">
                    <h4 class="text-h6 mb-3">Factores de Riesgo</h4>
                    <v-textarea
                      v-model="datosProyecto.pei.factores_riesgo"
                      label="Describa los factores de riesgo identificados"
                      variant="outlined"
                      rows="4"
                      placeholder="Describa los factores de riesgo..."
                      auto-grow
                    ></v-textarea>
                  </div>
                </v-form>
              </v-card-text>
            </v-card>
          </template>

          <!-- Paso 8: Contribución a Objetivos -->
          <template v-slot:item.8>
            <v-card flat class="paso-card">
              <v-card-title class="text-h6 bg-blue-lighten-5 pa-4">
                <v-icon left color="primary">mdi-chart-timeline-variant</v-icon>
                Contribución a Objetivos PEI
              </v-card-title>
              <v-card-text class="pt-6">
                <v-form>
                  <v-textarea
                    v-model="datosProyecto.pei.contribucion_objetivos"
                    label="¿Cómo se contribuye a los objetivos y factores críticos mediante el proyecto?"
                    variant="outlined"
                    rows="6"
                    placeholder="Describa la contribución del proyecto a los objetivos PEI..."
                    auto-grow
                  ></v-textarea>
                </v-form>
              </v-card-text>
            </v-card>
          </template>

          <!-- Paso 9: Marcos Internacionales -->
          <template v-slot:item.9>
            <v-card flat class="paso-card">
              <v-card-title class="text-h6 bg-blue-lighten-5 pa-4">
                <v-icon left color="primary">mdi-earth</v-icon>
                Marcos Internacionales
              </v-card-title>
              <v-card-text class="pt-6">
                <v-form>
                  <v-select
                    v-model="datosProyecto.marcos_internacionales.principios_estambul"
                    :items="principiosEstambul"
                    label="Principios de Estambul"
                    variant="outlined"
                    multiple
                    chips
                    placeholder="Seleccione principios aplicables"
                  ></v-select>

                  <div class="mt-6">
                    <v-select
                      v-model="datosProyecto.marcos_internacionales.ods"
                      :items="odsItems"
                      label="Objetivos de Desarrollo Sostenible (ODS)"
                      variant="outlined"
                      multiple
                      chips
                      placeholder="Seleccione ODS relacionados"
                    ></v-select>
                  </div>

                  <div class="mt-6">
                    <v-textarea
                      v-model="datosProyecto.marcos_internacionales.descripcion"
                      label="Explique cómo el proyecto se enmarca en estos marcos internacionales"
                      variant="outlined"
                      rows="6"
                      placeholder="Describa la relación con los marcos internacionales..."
                      auto-grow
                    ></v-textarea>
                  </div>
                </v-form>
              </v-card-text>
            </v-card>
          </template>

          <!-- Paso 10: Población Meta -->
          <template v-slot:item.10>
            <v-card flat class="paso-card">
              <v-card-title class="text-h6 bg-blue-lighten-5 pa-4">
                <v-icon left color="primary">mdi-account-group</v-icon>
                Población Meta
              </v-card-title>
              <v-card-text class="pt-6">
                <v-form>
                  <h4 class="text-h6 mb-3">Población Meta Directa</h4>
                  <v-table class="mb-6">
                    <thead>
                      <tr>
                        <th>Grupo</th>
                        <th>Hombres</th>
                        <th>Mujeres</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <v-text-field
                            v-model="datosProyecto.poblacion.directa.grupo"
                            label="Grupo"
                            variant="underlined"
                            placeholder="Ej: Familias productoras"
                          ></v-text-field>
                        </td>
                        <td>
                          <v-text-field
                            v-model="datosProyecto.poblacion.directa.hombres"
                            label="Hombres"
                            variant="underlined"
                            type="number"
                            min="0"
                          ></v-text-field>
                        </td>
                        <td>
                          <v-text-field
                            v-model="datosProyecto.poblacion.directa.mujeres"
                            label="Mujeres"
                            variant="underlined"
                            type="number"
                            min="0"
                          ></v-text-field>
                        </td>
                        <td>
                          <v-text-field
                            :value="
                              parseInt(datosProyecto.poblacion.directa.hombres || 0) +
                              parseInt(datosProyecto.poblacion.directa.mujeres || 0)
                            "
                            label="Total"
                            variant="underlined"
                            readonly
                          ></v-text-field>
                        </td>
                      </tr>
                    </tbody>
                  </v-table>

                  <h4 class="text-h6 mb-3">Población Meta Indirecta</h4>
                  <v-textarea
                    v-model="datosProyecto.poblacion.indirecta.descripcion"
                    label="Descripción de la población indirecta"
                    variant="outlined"
                    rows="3"
                    placeholder="Describa la población indirecta..."
                    auto-grow
                  ></v-textarea>

                  <v-text-field
                    v-model="datosProyecto.poblacion.indirecta.total"
                    label="Total estimado"
                    variant="outlined"
                    type="number"
                    min="0"
                    placeholder="Número total estimado"
                    class="mt-4"
                  ></v-text-field>

                  <v-textarea
                    v-model="datosProyecto.poblacion.indirecta.metodologia_calculo"
                    label="Metodología de cálculo"
                    variant="outlined"
                    rows="2"
                    placeholder="Explique cómo se calculó la población indirecta..."
                    auto-grow
                    class="mt-4"
                  ></v-textarea>
                </v-form>
              </v-card-text>
            </v-card>
          </template>

          <!-- Paso 11: Experticia Institucional -->
          <template v-slot:item.11>
            <v-card flat class="paso-card">
              <v-card-title class="text-h6 bg-blue-lighten-5 pa-4">
                <v-icon left color="primary">mdi-school</v-icon>
                Experticia Institucional
              </v-card-title>
              <v-card-text class="pt-6">
                <v-form>
                  <v-textarea
                    v-model="datosProyecto.experticia_institucional"
                    label="¿Cuál es la experticia institucional previa para el desarrollo del Proyecto?"
                    variant="outlined"
                    rows="6"
                    placeholder="Describa la experticia institucional..."
                    auto-grow
                  ></v-textarea>
                </v-form>
              </v-card-text>
            </v-card>
          </template>

          <!-- Paso 12: Resumen y Confirmación -->
          <template v-slot:item.12>
            <v-card flat class="paso-card">
              <v-card-title class="text-h6 bg-blue-lighten-5 pa-4">
                <v-icon left color="primary">mdi-check-all</v-icon>
                Resumen y Confirmación
              </v-card-title>
              <v-card-text class="pt-6">
                <div class="resumen-container">
                  <h4 class="text-h6 mb-4">Resumen del Proyecto</h4>

                  <!-- Información General -->
                  <v-card variant="outlined" class="mb-4">
                    <v-card-title class="text-subtitle-1 bg-grey-lighten-4">
                      Información General
                    </v-card-title>
                    <v-card-text>
                      <v-list density="compact">
                        <v-list-item>
                          <template v-slot:prepend>
                            <v-icon>mdi-tag</v-icon>
                          </template>
                          <v-list-item-title
                            >Código: {{ datosProyecto.codigo || 'No definido' }}</v-list-item-title
                          >
                        </v-list-item>
                        <v-list-item>
                          <template v-slot:prepend>
                            <v-icon>mdi-text</v-icon>
                          </template>
                          <v-list-item-title
                            >Título: {{ datosProyecto.titulo || 'No definido' }}</v-list-item-title
                          >
                        </v-list-item>
                        <v-list-item>
                          <template v-slot:prepend>
                            <v-icon>mdi-calendar</v-icon>
                          </template>
                          <v-list-item-title
                            >Período: {{ datosProyecto.fecha_inicio || 'No definida' }} -
                            {{ datosProyecto.fecha_cierre || 'No definida' }}</v-list-item-title
                          >
                        </v-list-item>
                        <v-list-item>
                          <template v-slot:prepend>
                            <v-icon>mdi-category</v-icon>
                          </template>
                          <v-list-item-title
                            >Categoría:
                            {{ datosProyecto.categoria || 'No definida' }}</v-list-item-title
                          >
                        </v-list-item>
                      </v-list>
                    </v-card-text>
                  </v-card>

                  <!-- Institución -->
                  <v-card variant="outlined" class="mb-4">
                    <v-card-title class="text-subtitle-1 bg-grey-lighten-4">
                      Institución
                    </v-card-title>
                    <v-card-text>
                      <v-list density="compact">
                        <v-list-item>
                          <v-list-item-title
                            >{{ datosProyecto.institucion.nombre || 'No definida' }} ({{
                              datosProyecto.institucion.sigla || 'No definida'
                            }})</v-list-item-title
                          >
                        </v-list-item>
                        <v-list-item>
                          <v-list-item-title
                            >Departamento:
                            {{
                              datosProyecto.institucion.departamento || 'No definido'
                            }}</v-list-item-title
                          >
                        </v-list-item>
                        <v-list-item>
                          <v-list-item-title
                            >Email:
                            {{
                              datosProyecto.institucion.email || 'No definido'
                            }}</v-list-item-title
                          >
                        </v-list-item>
                        <v-list-item>
                          <v-list-item-title
                            >Responsable:
                            {{
                              datosProyecto.institucion.responsable || 'No definido'
                            }}</v-list-item-title
                          >
                        </v-list-item>
                      </v-list>
                    </v-card-text>
                  </v-card>

                  <!-- Población Meta -->
                  <v-card variant="outlined" class="mb-4">
                    <v-card-title class="text-subtitle-1 bg-grey-lighten-4">
                      Población Meta
                    </v-card-title>
                    <v-card-text>
                      <v-list density="compact">
                        <v-list-item>
                          <v-list-item-title
                            >Directa:
                            {{
                              parseInt(datosProyecto.poblacion.directa.hombres || 0) +
                              parseInt(datosProyecto.poblacion.directa.mujeres || 0)
                            }}
                            personas ({{
                              datosProyecto.poblacion.directa.grupo || 'No definido'
                            }})</v-list-item-title
                          >
                        </v-list-item>
                        <v-list-item>
                          <v-list-item-title
                            >Indirecta:
                            {{ datosProyecto.poblacion.indirecta.total || 0 }}
                            personas</v-list-item-title
                          >
                        </v-list-item>
                      </v-list>
                    </v-card-text>
                  </v-card>

                  <!-- PEI y Objetivos -->
                  <v-card variant="outlined" class="mb-4">
                    <v-card-title class="text-subtitle-1 bg-grey-lighten-4">
                      Pertinencia PEI
                    </v-card-title>
                    <v-card-text>
                      <v-list density="compact">
                        <v-list-item>
                          <v-list-item-title
                            >Objetivos PEI:
                            {{ datosProyecto.pei.objetivos.length || 0 }}
                            seleccionados</v-list-item-title
                          >
                        </v-list-item>
                      </v-list>
                    </v-card-text>
                  </v-card>

                  <!-- Confirmación -->
                  <div class="mt-6">
                    <v-alert type="info" variant="tonal" class="mb-4">
                      <template v-slot:title>
                        <strong>Modo Prueba - Validaciones Deshabilitadas</strong>
                      </template>
                      Puede crear el proyecto sin completar todos los campos.
                    </v-alert>

                    <!-- Checkbox opcional -->
                    <v-checkbox
                      v-model="aceptarTerminos"
                      label="Confirmo que la información proporcionada es verídica y completa"
                    ></v-checkbox>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </template>
        </v-stepper>
      </div>

      <!-- Acciones del stepper - Deshabilitar validaciones -->
      <v-card-actions class="pa-4 justify-space-between actions-bar">
        <v-btn
          color="grey"
          @click="pasoAnterior"
          :disabled="pasoActual === 1 || cargando"
          prepend-icon="mdi-arrow-left"
        >
          Anterior
        </v-btn>

        <div>
          <v-chip color="primary" variant="flat" class="mr-2">
            Paso {{ pasoActual }} de {{ pasos.length }}
          </v-chip>
        </div>

        <div>
          <v-btn color="grey" @click="cerrarDialog" :disabled="cargando" class="mr-2">
            Cancelar
          </v-btn>
          <v-btn
            v-if="pasoActual < pasos.length"
            color="primary"
            @click="siguientePaso"
            :loading="cargando"
            prepend-icon="mdi-arrow-right"
          >
            Siguiente
          </v-btn>
          <v-btn
            v-else
            color="success"
            @click="confirmarCreacion"
            :loading="cargando"
            prepend-icon="mdi-check"
          >
            Crear Proyecto (Prueba)
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'

// Props y Emits
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'crear-proyecto'])

// Estados
const dialog = ref(false)
const pasoActual = ref(1)
const cargando = ref(false)
const aceptarTerminos = ref(false)
const institucionSeleccionada = ref(null)

// Listas de opciones
const departamentosBolivia = [
  'La Paz',
  'Cochabamba',
  'Santa Cruz',
  'Oruro',
  'Potosí',
  'Tarija',
  'Chuquisaca',
  'Beni',
  'Pando',
]

const categoriasProyecto = [
  'Fortalecimiento de la sociedad civil',
  'Desarrollo productivo',
  'Educación y cultura',
  'Salud comunitaria',
  'Medio ambiente y recursos naturales',
  'Género e inclusión',
  'Desarrollo infantil temprano',
  'Gobernanza local',
]

const objetivosPEI = [
  'OBJ001 - Mejora de la seguridad alimentaria',
  'OBJ002 - Conservación de recursos hídricos',
  'OBJ003 - Fortalecimiento organizacional',
  'OBJ004 - Desarrollo de capacidades productivas',
  'OBJ005 - Mejora de servicios básicos',
  'OBJ006 - Promoción de derechos humanos',
]

const principiosEstambul = [
  'Respeto y defensa de los derechos humanos',
  'Igualdad y no discriminación',
  'Empoderamiento y participación',
  'Sostenibilidad ambiental',
  'Transparencia y rendición de cuentas',
]

const odsItems = [
  'ODS 1 - Fin de la pobreza',
  'ODS 2 - Hambre cero',
  'ODS 3 - Salud y bienestar',
  'ODS 4 - Educación de calidad',
  'ODS 5 - Igualdad de género',
  'ODS 6 - Agua limpia y saneamiento',
  'ODS 7 - Energía asequible y no contaminante',
  'ODS 8 - Trabajo decente y crecimiento económico',
  'ODS 10 - Reducción de las desigualdades',
  'ODS 13 - Acción por el clima',
  'ODS 15 - Vida de ecosistemas terrestres',
  'ODS 16 - Paz, justicia e instituciones sólidas',
]

// Instituciones registradas en el sistema (datos de ejemplo)
const institucionesRegistradas = ref([
  {
    id: 1,
    sigla: 'ACLO',
    nombre: 'Fundación Acción Cultural Loyola',
    nombre_completo: 'ACLO - Fundación Acción Cultural Loyola',
    departamento: 'Tarija',
    email: 'aclotarija@aclo.org.bo',
    telefono: '71860940',
    direccion: 'Calle Comercio #123, Tarija',
    contacto_principal: 'Juan Pérez',
  },
  {
    id: 2,
    sigla: 'CESU',
    nombre: 'Centro de Estudios Superiores Universitarios',
    nombre_completo: 'CESU - Centro de Estudios Superiores Universitarios',
    departamento: 'Cochabamba',
    email: 'info@cesu.edu.bo',
    telefono: '4245678',
    direccion: 'Av. Blanco Galindo km 5, Cochabamba',
    contacto_principal: 'María Rodríguez',
  },
  {
    id: 3,
    sigla: 'SER',
    nombre: 'Servicios Educativos Rurales',
    nombre_completo: 'SER - Servicios Educativos Rurales',
    departamento: 'La Paz',
    email: 'contacto@ser.org.bo',
    telefono: '2247890',
    direccion: 'Calle Murillo #456, La Paz',
    contacto_principal: 'Carlos López',
  },
  {
    id: 4,
    sigla: 'FAM',
    nombre: 'Fundación Amazonía',
    nombre_completo: 'FAM - Fundación Amazonía',
    departamento: 'Beni',
    email: 'amazonia@fam.org.bo',
    telefono: '3467890',
    direccion: 'Calle 6 de Agosto #789, Trinidad',
    contacto_principal: 'Ana Morales',
  },
  {
    id: 5,
    sigla: 'PROSALUD',
    nombre: 'Fundación Prosalud',
    nombre_completo: 'PROSALUD - Fundación Prosalud',
    departamento: 'Santa Cruz',
    email: 'info@prosalud.org.bo',
    telefono: '3356789',
    direccion: 'Av. Cristo Redentor #101, Santa Cruz',
    contacto_principal: 'Pedro Sánchez',
  },
])

// Pasos del stepper
const pasos = ref([
  'Datos Institucionales',
  'Resumen del Proyecto',
  'Información General',
  'Contexto',
  'Problemática',
  'Respuesta al Problema',
  'Pertinencia PEI',
  'Contribución a Objetivos',
  'Marcos Internacionales',
  'Población Meta',
  'Experticia Institucional',
  'Resumen',
])

// Estructura de datos del proyecto
const datosProyecto = ref({
  institucion: {
    sigla: '',
    nombre: '',
    departamento: '',
    email: '',
    responsable: '',
  },
  resumen_proyecto: '',
  codigo: '',
  titulo: '',
  fecha_inicio: '',
  fecha_cierre: '',
  categoria: '',
  cobertura_geografica: '',
  pertinencia: {
    contexto: '',
    problematica: '',
    fuentes: '',
    respuesta_problematica: '',
  },
  pei: {
    objetivos: [],
    factores_riesgo: '',
    contribucion_objetivos: '',
  },
  marcos_internacionales: {
    principios_estambul: [],
    ods: [],
    descripcion: '',
  },
  poblacion: {
    directa: {
      grupo: '',
      hombres: 0,
      mujeres: 0,
    },
    indirecta: {
      descripcion: '',
      total: 0,
      metodologia_calculo: '',
    },
  },
  experticia_institucional: '',
})

// Watcher para sincronizar prop
watch(
  () => props.modelValue,
  (value) => {
    dialog.value = value
  },
)

watch(dialog, (value) => {
  emit('update:modelValue', value)
})

// Métodos
const cerrarDialog = () => {
  resetearFormulario()
  dialog.value = false
}

// Método simplificado para siguiente paso SIN validación
const siguientePaso = async () => {
  if (pasoActual.value < pasos.value.length) {
    pasoActual.value++
  }
}

const pasoAnterior = () => {
  if (pasoActual.value > 1) {
    pasoActual.value--
  }
}

// Cargar datos de la institución seleccionada
const cargarDatosInstitucion = (institucionId) => {
  if (institucionId) {
    const institucion = institucionesRegistradas.value.find((inst) => inst.id === institucionId)

    if (institucion) {
      datosProyecto.value.institucion = {
        sigla: institucion.sigla,
        nombre: institucion.nombre,
        departamento: institucion.departamento,
        email: institucion.email,
        responsable: institucion.contacto_principal || '',
      }
    }
  } else {
    datosProyecto.value.institucion = {
      sigla: '',
      nombre: '',
      departamento: '',
      email: '',
      responsable: '',
    }
  }
}

const resetearFormulario = () => {
  pasoActual.value = 1
  aceptarTerminos.value = false
  cargando.value = false
  institucionSeleccionada.value = null

  datosProyecto.value = {
    institucion: {
      sigla: '',
      nombre: '',
      departamento: '',
      email: '',
      responsable: '',
    },
    resumen_proyecto: '',
    codigo: '',
    titulo: '',
    fecha_inicio: '',
    fecha_cierre: '',
    categoria: '',
    cobertura_geografica: '',
    pertinencia: {
      contexto: '',
      problematica: '',
      fuentes: '',
      respuesta_problematica: '',
    },
    pei: {
      objetivos: [],
      factores_riesgo: '',
      contribucion_objetivos: '',
    },
    marcos_internacionales: {
      principios_estambul: [],
      ods: [],
      descripcion: '',
    },
    poblacion: {
      directa: {
        grupo: '',
        hombres: 0,
        mujeres: 0,
      },
      indirecta: {
        descripcion: '',
        total: 0,
        metodologia_calculo: '',
      },
    },
    experticia_institucional: '',
  }
}

// Método simplificado para confirmar creación SIN validación
const confirmarCreacion = async () => {
  try {
    cargando.value = true

    const proyectoData = {
      ...datosProyecto.value,
      estado: 'Estructuracion',
      fecha_creacion: new Date().toISOString(),
      institucion_id: institucionSeleccionada.value || null,
    }

    console.log('Proyecto a crear (modo prueba):', proyectoData)
    emit('crear-proyecto', proyectoData)

    setTimeout(() => {
      cerrarDialog()
    }, 1500)
  } catch (error) {
    console.error('Error al crear proyecto:', error)
  } finally {
    cargando.value = false
  }
}

// Método para abrir el diálogo desde fuera
const abrirDialog = () => {
  resetearFormulario()
  dialog.value = true
}

// Exponer métodos
defineExpose({
  abrirDialog,
  cerrarDialog,
})
</script>

<style scoped>
/* Diálogo con altura automática */
.dialog-content {
  max-height: calc(85vh - 120px); /* 85% de la altura de viewport menos header y actions */
  overflow-y: auto;
  padding: 16px;
}

/* Stepper con altura automática */
.stepper-custom {
  box-shadow: none;
  min-height: auto;
}

.stepper-custom :deep(.v-stepper-header) {
  box-shadow: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
}

.stepper-custom :deep(.v-stepper-item__title) {
  font-size: 0.875rem;
}

/* Tarjetas de pasos con altura automática */
.paso-card {
  min-height: auto;
  margin-bottom: 16px;
}

/* Barra de acciones fija */
.actions-bar {
  position: sticky;
  bottom: 0;
  background: white;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  z-index: 10;
}

/* Scrollbar personalizado */
.dialog-content::-webkit-scrollbar {
  width: 8px;
}

.dialog-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.dialog-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.dialog-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Ajustes para textareas que crecen automáticamente */
:deep(.v-textarea .v-field) {
  min-height: auto !important;
}

/* Ajustes responsive */
@media (max-width: 960px) {
  .stepper-custom :deep(.v-stepper-header) {
    flex-direction: column;
    height: auto;
  }

  .stepper-custom :deep(.v-stepper-header .v-stepper-item) {
    margin-bottom: 8px;
  }

  .dialog-content {
    max-height: calc(75vh - 120px);
  }
}

@media (max-width: 600px) {
  .dialog-content {
    max-height: calc(70vh - 120px);
    padding: 8px;
  }

  .actions-bar {
    flex-direction: column;
    gap: 8px;
  }

  .actions-bar > div {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
}

/* Para evitar que el contenido se expanda demasiado en pantallas grandes */
@media (min-width: 1200px) {
  .dialog-content {
    max-height: calc(80vh - 120px);
  }
}

/* Estilos para la sección de resumen */
.resumen-container {
  max-height: 500px;
  overflow-y: auto;
  padding-right: 8px;
}

.resumen-container::-webkit-scrollbar {
  width: 6px;
}

.resumen-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.resumen-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}
</style>
