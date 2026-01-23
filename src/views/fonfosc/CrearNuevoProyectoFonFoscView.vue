<template>
  <v-container>
    <v-stepper v-model="currentStep" class="stepper-responsive">
      <!-- Header del Stepper -->
      <v-stepper-header class="mb-4">
        <v-stepper-item
          :complete="currentStep > 1"
          :value="1"
          title="Información Básica"
          subtitle="Datos del proyecto"
          editable
        ></v-stepper-item>

        <v-divider></v-divider>

        <v-stepper-item
          :complete="currentStep > 2"
          :value="2"
          title="Marco Lógico"
          subtitle="Objetivos y resultados"
          editable
        ></v-stepper-item>

        <v-divider></v-divider>

        <v-stepper-item
          :value="3"
          title="Presupuesto"
          subtitle="Financiamiento"
          editable
        ></v-stepper-item>
      </v-stepper-header>

      <!-- Contenido del Stepper - SE AJUSTA AL CONTENIDO -->
      <v-stepper-window>
        <!-- Paso 1 -->
        <v-stepper-window-item :value="1">
          <v-card class="mb-4">
            <v-card-title class="text-h6">
              <v-icon left color="primary">mdi-information</v-icon>
              Información Básica del Proyecto
            </v-card-title>

            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Nombre del Proyecto *"
                    v-model="form.nombre"
                    outlined
                    required
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Código FONFOSC"
                    v-model="form.codigo"
                    outlined
                    hint="Ej: FONFOSC-2024-001"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    label="Descripción"
                    v-model="form.descripcion"
                    outlined
                    rows="3"
                    hint="Describe brevemente el proyecto"
                  ></v-textarea>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Monto Solicitado ($) *"
                    v-model="form.monto"
                    type="number"
                    outlined
                    prefix="$"
                    :rules="[rules.required, rules.numeric]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Duración (meses) *"
                    v-model="form.duracion"
                    type="number"
                    outlined
                    suffix="meses"
                    :rules="[rules.required, rules.numeric]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-menu v-model="menuFechaInicio" :close-on-content-click="false">
                    <template v-slot:activator="{ props }">
                      <v-text-field
                        v-bind="props"
                        label="Fecha de Inicio *"
                        v-model="form.fechaInicio"
                        outlined
                        readonly
                        :rules="[rules.required]"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="form.fechaInicio"
                      @update:model-value="menuFechaInicio = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" md="6">
                  <v-menu v-model="menuFechaFin" :close-on-content-click="false">
                    <template v-slot:activator="{ props }">
                      <v-text-field
                        v-bind="props"
                        label="Fecha de Finalización *"
                        v-model="form.fechaFin"
                        outlined
                        readonly
                        :rules="[rules.required]"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="form.fechaFin"
                      @update:model-value="menuFechaFin = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
            </v-card-text>

            <v-card-actions class="pa-4">
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="currentStep = 2" :disabled="!paso1Valido" large>
                Continuar al Paso 2
                <v-icon end>mdi-arrow-right</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-stepper-window-item>

        <!-- Paso 2 -->
        <v-stepper-window-item :value="2">
          <v-card class="mb-4">
            <v-card-title class="text-h6">
              <v-icon left color="primary">mdi-chart-timeline-variant</v-icon>
              Marco Lógico del Proyecto
            </v-card-title>

            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <v-textarea
                    label="Objetivo General *"
                    v-model="form.objetivoGeneral"
                    outlined
                    rows="2"
                    :rules="[rules.required]"
                    hint="¿Qué se espera lograr con este proyecto?"
                  ></v-textarea>
                </v-col>
                <v-col cols="12">
                  <div class="mb-2 text-subtitle-1">Objetivos Específicos *</div>
                  <div v-for="(obj, index) in form.objetivosEspecificos" :key="index" class="mb-2">
                    <v-textarea
                      v-model="form.objetivosEspecificos[index]"
                      outlined
                      rows="1"
                      :label="`Objetivo ${index + 1}`"
                      hide-details
                      class="mb-2"
                    ></v-textarea>
                  </div>
                  <v-btn
                    @click="agregarObjetivo"
                    color="primary"
                    outlined
                    size="small"
                    class="mt-2"
                  >
                    <v-icon left small>mdi-plus</v-icon>
                    Agregar otro objetivo
                  </v-btn>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    label="Resultados Esperados *"
                    v-model="form.resultados"
                    outlined
                    rows="3"
                    :rules="[rules.required]"
                    hint="¿Qué productos o servicios se entregarán?"
                  ></v-textarea>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    label="Indicadores de Impacto"
                    v-model="form.indicadores"
                    outlined
                    rows="2"
                    hint="Métricas para medir el éxito del proyecto"
                  ></v-textarea>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    label="Beneficiarios Directos"
                    v-model="form.beneficiarios"
                    outlined
                    rows="2"
                    hint="¿Quiénes se beneficiarán directamente?"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-card-text>

            <v-card-actions class="pa-4">
              <v-btn color="grey" @click="currentStep = 1" large>
                <v-icon start>mdi-arrow-left</v-icon>
                Volver al Paso 1
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="currentStep = 3" :disabled="!paso2Valido" large>
                Continuar al Paso 3
                <v-icon end>mdi-arrow-right</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-stepper-window-item>

        <!-- Paso 3 -->
        <v-stepper-window-item :value="3">
          <v-card class="mb-4">
            <v-card-title class="text-h6">
              <v-icon left color="primary">mdi-cash-multiple</v-icon>
              Presupuesto del Proyecto
            </v-card-title>

            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <div class="text-subtitle-1 mb-3">Distribución del Presupuesto</div>

                  <v-table class="elevation-1">
                    <thead>
                      <tr>
                        <th class="text-left" style="width: 35%">Rubro *</th>
                        <th class="text-left" style="width: 25%">Monto ($) *</th>
                        <th class="text-left" style="width: 30%">Justificación</th>
                        <th class="text-left" style="width: 10%"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(rubro, index) in form.rubros" :key="index">
                        <td>
                          <v-text-field
                            v-model="rubro.nombre"
                            outlined
                            dense
                            hide-details
                            :rules="[rules.required]"
                          ></v-text-field>
                        </td>
                        <td>
                          <v-text-field
                            v-model="rubro.monto"
                            type="number"
                            prefix="$"
                            outlined
                            dense
                            hide-details
                            :rules="[rules.required, rules.numeric]"
                          ></v-text-field>
                        </td>
                        <td>
                          <v-text-field
                            v-model="rubro.justificacion"
                            outlined
                            dense
                            hide-details
                          ></v-text-field>
                        </td>
                        <td class="text-center">
                          <v-btn
                            icon
                            size="small"
                            color="error"
                            @click="eliminarRubro(index)"
                            :disabled="form.rubros.length <= 1"
                          >
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </v-table>

                  <v-btn @click="agregarRubro" color="primary" outlined class="mt-4">
                    <v-icon left>mdi-plus</v-icon>
                    Agregar Rubro
                  </v-btn>
                </v-col>

                <v-col cols="12">
                  <v-divider class="my-4"></v-divider>

                  <div class="d-flex justify-space-between align-center">
                    <div class="text-h6">Total del Presupuesto:</div>
                    <div class="text-h5 text-primary font-weight-bold">
                      ${{ totalPresupuesto.toLocaleString() }}
                    </div>
                  </div>
                </v-col>

                <v-col cols="12">
                  <v-alert type="info" variant="tonal" class="mt-4">
                    <template v-slot:prepend>
                      <v-icon>mdi-information</v-icon>
                    </template>
                    <div class="text-body-2">
                      <strong>Resumen del Proyecto:</strong><br />
                      • Nombre: {{ form.nombre || 'No definido' }}<br />
                      • Duración: {{ form.duracion || '0' }} meses<br />
                      • Monto solicitado: ${{ form.monto || '0' }}<br />
                      • Rubros presupuestarios: {{ form.rubros.length }}
                    </div>
                  </v-alert>
                </v-col>
              </v-row>
            </v-card-text>

            <v-card-actions class="pa-4">
              <v-btn color="grey" @click="currentStep = 2" large>
                <v-icon start>mdi-arrow-left</v-icon>
                Volver al Paso 2
              </v-btn>
              <v-spacer></v-spacer>

              <v-btn color="grey" @click="guardarBorrador" outlined large>
                <v-icon start>mdi-content-save</v-icon>
                Guardar Borrador
              </v-btn>

              <v-btn
                color="success"
                @click="guardarProyecto"
                :disabled="!paso3Valido"
                :loading="loading"
                large
              >
                <v-icon start>mdi-check</v-icon>
                Finalizar y Guardar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-stepper-window-item>
      </v-stepper-window>
    </v-stepper>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentStep = ref(1)
const loading = ref(false)
const menuFechaInicio = ref(false)
const menuFechaFin = ref(false)

// Reglas de validación
const rules = {
  required: (value) => !!value || 'Campo requerido',
  numeric: (value) => !isNaN(value) || 'Debe ser un número válido',
}

// Formulario
const form = ref({
  nombre: '',
  codigo: '',
  descripcion: '',
  monto: '',
  duracion: '',
  fechaInicio: null,
  fechaFin: null,
  objetivoGeneral: '',
  objetivosEspecificos: ['', '', ''],
  resultados: '',
  indicadores: '',
  beneficiarios: '',
  rubros: [
    { nombre: 'Personal', monto: '', justificacion: 'Honorarios del equipo de trabajo' },
    {
      nombre: 'Equipos y Materiales',
      monto: '',
      justificacion: 'Adquisición de equipos necesarios',
    },
    { nombre: 'Gastos Operativos', monto: '', justificacion: 'Transporte, viáticos, etc.' },
  ],
})

// Validaciones por paso
const paso1Valido = computed(() => {
  return (
    form.value.nombre &&
    form.value.monto &&
    form.value.duracion &&
    form.value.fechaInicio &&
    form.value.fechaFin
  )
})

const paso2Valido = computed(() => {
  return (
    form.value.objetivoGeneral &&
    form.value.objetivosEspecificos.some((obj) => obj.trim()) &&
    form.value.resultados
  )
})

const paso3Valido = computed(() => {
  return form.value.rubros.every((r) => r.nombre && r.monto) && totalPresupuesto.value > 0
})

// Total del presupuesto
const totalPresupuesto = computed(() => {
  return form.value.rubros.reduce((total, rubro) => {
    return total + (parseFloat(rubro.monto) || 0)
  }, 0)
})

// Métodos
const agregarObjetivo = () => {
  form.value.objetivosEspecificos.push('')
}

const agregarRubro = () => {
  form.value.rubros.push({ nombre: '', monto: '', justificacion: '' })
}

const eliminarRubro = (index) => {
  if (form.value.rubros.length > 1) {
    form.value.rubros.splice(index, 1)
  }
}

const guardarBorrador = () => {
  // Guardar en localStorage o enviar a API como borrador
  localStorage.setItem('borrador-fonfosc', JSON.stringify(form.value))
  alert('Borrador guardado exitosamente')
}

const guardarProyecto = async () => {
  loading.value = true

  try {
    // Simular envío a API
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Aquí iría la lógica real de guardado
    console.log('Proyecto guardado:', form.value)

    // Limpiar borrador
    localStorage.removeItem('borrador-fonfosc')

    // Redirigir
    router.push('/fonfosc/lista')

    alert('¡Proyecto FONFOSC creado exitosamente!')
  } catch (error) {
    console.error('Error al guardar:', error)
    alert('Error al guardar el proyecto. Intente nuevamente.')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Stepper que se ajusta al contenido */
.stepper-responsive {
  max-width: 1200px;
  margin: 0 auto;
}

/* Ajustar el header en móviles */
@media (max-width: 960px) {
  .v-stepper-header {
    flex-direction: column;
    gap: 8px;
  }

  .v-stepper-item {
    width: 100%;
  }

  .v-divider {
    display: none;
  }
}

/* Animación suave entre pasos */
.v-stepper-window-item {
  transition: opacity 0.3s ease;
}

/* Mejorar scroll en contenido largo */
.v-card-text {
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 8px;
}

/* Scrollbar personalizado */
.v-card-text::-webkit-scrollbar {
  width: 6px;
}

.v-card-text::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.v-card-text::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.v-card-text::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
