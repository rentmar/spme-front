<template>
  <v-card>
    <v-card-title class="text-h5">Gestión de Indicadores</v-card-title>
    <v-card-text>
      <v-stepper v-model="paso" non-linear>
        <!--Encabezado-->
        <v-stepper-header>
          <v-stepper-item
            editable
            :complete="paso > index + 1"
            v-for="(titulo, index) in titulos"
            v-bind:key="index"
            v-bind:value="index + 1"
          >
            {{ titulo }}
          </v-stepper-item>
        </v-stepper-header>
        <!--Contenido-->
        <v-stepper-window>
          <!--Paso 1-->
          <v-stepper-window-item :value="1">
            <v-card flat>
              <v-card-text>
                <v-row>
                  <!-- Columna izquierda - Controles -->
                  <v-col cols="12" md="6" class="pr-md-4">
                    <v-radio-group v-model="indicador.tipoRelacion" class="mb-4">
                      <v-radio label="Objetivo General" value="objetivoGeneral"></v-radio>
                      <v-radio label="Objetivo Específico" value="objetivoEspecifico"></v-radio>
                      <v-radio label="Resultado" value="resultado"></v-radio>
                      <v-radio label="Producto" value="producto"></v-radio>
                    </v-radio-group>

                    <v-select
                      v-if="indicador.tipoRelacion"
                      :label="`Seleccione ${indicador.tipoRelacion === 'objetivoEspecifico' ? 'objetivo específico' : indicador.tipoRelacion}`"
                      :items="elementosRelacionados"
                      item-title="descripcion"
                      item-value="codigo"
                      v-model="indicador[indicador.tipoRelacion]"
                      return-object
                      variant="outlined"
                    ></v-select>
                  </v-col>

                  <!-- Columna derecha - Visualización de datos -->
                  <v-col cols="12" md="6" class="pl-md-4">
                    <v-card variant="outlined" class="pa-4">
                      <v-card-title class="text-h6">Previsualización</v-card-title>
                      <v-divider class="my-2"></v-divider>

                      <div v-if="indicador.tipoRelacion">
                        <h4 class="text-subtitle-1 font-weight-bold mb-2">
                          {{
                            indicador.tipoRelacion === 'objetivoEspecifico'
                              ? 'Objetivo Específico'
                              : indicador.tipoRelacion === 'resultado'
                                ? 'Resultado'
                                : indicador.tipoRelacion === 'producto'
                                  ? 'Producto'
                                  : 'Objetivo General'
                          }}
                        </h4>

                        <template v-if="indicador[indicador.tipoRelacion]">
                          <p>
                            <strong>Código:</strong> {{ indicador[indicador.tipoRelacion].codigo }}
                          </p>
                          <p>
                            <strong>Descripción:</strong>
                            {{ indicador[indicador.tipoRelacion].descripcion }}
                          </p>
                        </template>
                        <template v-else>
                          <p class="text-grey">Seleccione un elemento</p>
                        </template>

                        <v-divider class="my-3"></v-divider>

                        <h4 class="text-subtitle-1 font-weight-bold mb-2">
                          Configuración del Indicador
                        </h4>
                        <p><strong>Tipo:</strong> {{ indicador.tipo || 'No definido' }}</p>
                        <p>
                          <strong>Tipo de valor:</strong>
                          {{ indicador.tipo_valor || 'No definido' }}
                        </p>
                      </div>
                      <div v-else>
                        <p class="text-grey">Seleccione un tipo de relación</p>
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-stepper-window-item>
          <!--Paso 2-->
          <v-stepper-window-item :value="2">
            <v-card flat>
              <v-card-text>
                <v-row>
                  <!-- Columna izquierda - Selectores -->
                  <v-col cols="12" md="6" class="pr-md-4">
                    <v-radio-group v-model="indicador.tipo_valor" class="mb-4">
                      <v-radio
                        :label="`Literal (${store.TIPOS_VALOR.LITERAL})`"
                        :value="store.TIPOS_VALOR.LITERAL"
                      ></v-radio>
                      <v-radio
                        :label="`Numérico (${store.TIPOS_VALOR.NUMERICO})`"
                        :value="store.TIPOS_VALOR.NUMERICO"
                      ></v-radio>
                      <v-radio
                        :label="`Porcentual (${store.TIPOS_VALOR.PORCENTUAL})`"
                        :value="store.TIPOS_VALOR.PORCENTUAL"
                      ></v-radio>
                    </v-radio-group>

                    <v-radio-group v-model="indicador.tipo" class="mt-4">
                      <v-radio
                        :label="`Tipo GUIA (${store.TIPOS_INDICADOR.GUIA})`"
                        :value="store.TIPOS_INDICADOR.GUIA"
                      ></v-radio>
                      <v-radio
                        :label="`Tipo SMART (${store.TIPOS_INDICADOR.SMART})`"
                        :value="store.TIPOS_INDICADOR.SMART"
                      ></v-radio>
                    </v-radio-group>
                  </v-col>

                  <!-- Columna derecha - Tarjeta de información -->
                  <v-col cols="12" md="6" class="pl-md-4">
                    <v-card variant="outlined" class="pa-4">
                      <v-card-title class="text-h6">Configuración del Indicador</v-card-title>
                      <v-divider class="my-2"></v-divider>

                      <div v-if="indicador.tipoRelacion">
                        <h4 class="text-subtitle-1 font-weight-bold mb-2">
                          Relación seleccionada:
                        </h4>
                        <p>
                          <strong>Tipo:</strong>
                          {{
                            indicador.tipoRelacion === 'objetivoEspecifico'
                              ? 'Objetivo Específico'
                              : indicador.tipoRelacion === 'resultado'
                                ? 'Resultado'
                                : indicador.tipoRelacion === 'producto'
                                  ? 'Producto'
                                  : 'Objetivo General'
                          }}
                        </p>
                        <p v-if="indicador[indicador.tipoRelacion]">
                          <strong>Elemento:</strong>
                          {{ indicador[indicador.tipoRelacion].descripcion || 'Sin descripción' }}
                        </p>
                      </div>

                      <v-divider class="my-3"></v-divider>

                      <h4 class="text-subtitle-1 font-weight-bold mb-2">Tipo de Indicador</h4>
                      <p><strong>Formato:</strong> {{ indicador.tipo || 'No seleccionado' }}</p>
                      <p>
                        <strong>Tipo de valor:</strong>
                        {{ indicador.tipo_valor || 'No seleccionado' }}
                      </p>

                      <v-divider class="my-3"></v-divider>

                      <h4 class="text-subtitle-1 font-weight-bold mb-2">Resumen</h4>
                      <p>
                        Se crearán indicadores de tipo <strong>{{ indicador.tipo }}</strong> con
                        valores <strong>{{ indicador.tipo_valor }}</strong>
                      </p>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-stepper-window-item>
          <!--Paso 3-->
          <v-stepper-window-item :value="3">
            <v-card flat>
              <v-card-text>
                <v-text-field
                  label="Redacción del indicador"
                  v-model="indicador.redaccion"
                  required
                  variant="outlined"
                ></v-text-field>

                <v-text-field
                  label="Fuente de verificación"
                  v-model="indicador.fuente_verificacion"
                  variant="outlined"
                ></v-text-field>

                <v-text-field
                  label="Población objetivo"
                  v-model="indicador.target_poblacion"
                  variant="outlined"
                ></v-text-field>

                <v-text-field
                  label="Línea base"
                  v-model="indicador.baseline"
                  variant="outlined"
                ></v-text-field>

                <template v-if="indicador.tipo_valor !== store.TIPOS_VALOR.LITERAL">
                  <v-row>
                    <v-col cols="6">
                      <v-text-field
                        label="Meta Q1"
                        v-model="indicador.target_q1"
                        type="number"
                        variant="outlined"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        label="Meta Q2"
                        v-model="indicador.target_q2"
                        type="number"
                        variant="outlined"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        label="Meta Q3"
                        v-model="indicador.target_q3"
                        type="number"
                        variant="outlined"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        label="Meta Q4"
                        v-model="indicador.target_q4"
                        type="number"
                        variant="outlined"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </template>
              </v-card-text>
            </v-card>
          </v-stepper-window-item>
          <!--Paso 4-->
          <v-stepper-window-item :value="4">
            <v-card flat>
              <v-card-text>
                <v-card variant="outlined" class="mb-4">
                  <v-card-title class="text-h5">Resumen del Indicador</v-card-title>
                  <v-card-subtitle
                    >Revise cuidadosamente la información antes de enviar</v-card-subtitle
                  >

                  <v-divider class="my-2"></v-divider>

                  <v-card-text>
                    <!-- Sección de Relación -->
                    <div v-if="indicador.tipoRelacion" class="mb-4">
                      <h4 class="text-subtitle-1 font-weight-bold">Relación del Indicador</h4>
                      <v-divider class="my-2"></v-divider>
                      <p>
                        <strong>Tipo:</strong>
                        {{
                          indicador.tipoRelacion === 'objetivoEspecifico'
                            ? 'Objetivo Específico'
                            : indicador.tipoRelacion === 'resultado'
                              ? 'Resultado'
                              : indicador.tipoRelacion === 'producto'
                                ? 'Producto'
                                : 'Objetivo General'
                        }}
                      </p>
                      <p v-if="indicador[indicador.tipoRelacion]">
                        <strong>Elemento relacionado:</strong>
                        {{ indicador[indicador.tipoRelacion].codigo }} -
                        {{ indicador[indicador.tipoRelacion].descripcion }}
                      </p>
                    </div>

                    <!-- Sección de Configuración -->
                    <div class="mb-4">
                      <h4 class="text-subtitle-1 font-weight-bold">Configuración del Indicador</h4>
                      <v-divider class="my-2"></v-divider>
                      <p><strong>Tipo de valor:</strong> {{ indicador.tipo_valor }}</p>
                      <p><strong>Formato:</strong> {{ indicador.tipo }}</p>
                    </div>

                    <!-- Sección de Datos -->
                    <div class="mb-4" v-if="indicador.redaccion">
                      <h4 class="text-subtitle-1 font-weight-bold">Datos del Indicador</h4>
                      <v-divider class="my-2"></v-divider>
                      <p><strong>Redacción:</strong> {{ indicador.redaccion }}</p>
                      <p v-if="indicador.fuente_verificacion">
                        <strong>Fuente de verificación:</strong> {{ indicador.fuente_verificacion }}
                      </p>
                      <p v-if="indicador.target_poblacion">
                        <strong>Población objetivo:</strong> {{ indicador.target_poblacion }}
                      </p>
                      <p v-if="indicador.baseline">
                        <strong>Línea base:</strong> {{ indicador.baseline }}
                      </p>

                      <template v-if="indicador.tipo_valor !== store.TIPOS_VALOR.LITERAL">
                        <p v-if="indicador.target_q1">
                          <strong>Meta Q1:</strong> {{ indicador.target_q1 }}
                        </p>
                        <p v-if="indicador.target_q2">
                          <strong>Meta Q2:</strong> {{ indicador.target_q2 }}
                        </p>
                        <p v-if="indicador.target_q3">
                          <strong>Meta Q3:</strong> {{ indicador.target_q3 }}
                        </p>
                        <p v-if="indicador.target_q4">
                          <strong>Meta Q4:</strong> {{ indicador.target_q4 }}
                        </p>
                      </template>
                    </div>

                    <!-- Sección de Validación -->
                    <v-alert type="info" variant="tonal" class="mt-4">
                      Verifique que toda la información sea correcta antes de enviar. Esta acción no
                      se puede deshacer.
                    </v-alert>
                  </v-card-text>
                </v-card>
              </v-card-text>
            </v-card>
          </v-stepper-window-item>
        </v-stepper-window>
      </v-stepper>
    </v-card-text>
    <v-card-actions class="mt-4">
      <!--Boton Retroceder-->
      <v-btn @click="paso--" :disabled="paso === 1" variant="outlined">Atras</v-btn>
      <v-spacer></v-spacer>
      <!-- Boton avanzar -->
      <v-btn v-if="paso < 4" @click="paso++" variant="outlined" color="primary">Siguiente</v-btn>
      <v-btn v-else @click="enviarFormulario" variant="elevated" color="success">ENVIAR</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useNuevoProyectoStore } from '../../store/nuevoProyectoStore'

const props = defineProps({
  tipoRelacion: String,
  indicadorEditando: Object,
  componentePadreIndex: Number,
})

//Inicializar el store
const store = useNuevoProyectoStore()
const loading = ref('')
//Pasos del stepper
const paso = ref(1)
//Titulos de los headers
const titulos = ['Seleccion de relacion', 'Tipo de indicador', 'Datos', 'Confirmacion']
// Datos del indicador
const indicador = ref({
  tipoRelacion: props.tipoRelacion || '',
  tipo: '',
  tipo_valor: '',
  redaccion: '',
  fuente_verificacion: '',
  target_poblacion: '',
  baseline: '',
  target_q1: '',
  target_q2: '',
  target_q3: '',
  target_q4: '',
  objetivoGeneral: null,
  objetivoEspecifico: null,
  resultado: null,
  producto: null,
})

// Elementos relacionados según el tipo
const elementosRelacionados = computed(() => {
  switch (indicador.value.tipoRelacion) {
    case 'objetivoGeneral':
      return store.nuevoProyecto.objetivoGeneral
    case 'objetivoEspecifico':
      return store.nuevoProyecto.objetivoEspecifico
    case 'resultado':
      return store.nuevoProyecto.resultados
    case 'producto':
      return store.nuevoProyecto.productos
    default:
      return []
  }
})
watch(
  () => indicador.value.tipoRelacion,
  (nuevoTipo, viejoTipo) => {
    // Limpiar selección anterior cuando cambia el tipo de relación
    if (viejoTipo && nuevoTipo !== viejoTipo) {
      indicador.value[viejoTipo] = null
    }
  },
)
const enviarFormulario = async () => {
  try {
    loading.value = true

    // Construir el objeto indicador completo
    const indicadorCompleto = {
      ...indicador.value,
      // Asegurarse de incluir el código del elemento relacionado
      codigoElementoRelacionado: indicador.value[indicador.value.tipoRelacion]?.codigo || '',
      descripcionElementoRelacionado:
        indicador.value[indicador.value.tipoRelacion]?.descripcion || '',
      tipoElementoRelacionado: indicador.value.tipoRelacion,
      // Generar un ID único temporal (en producción usaría un ID real)
      id: Date.now().toString(),
    }

    // Si estamos editando un indicador existente
    if (props.indicadorEditando) {
      await store.actualizarIndicador({
        componentePadreIndex: props.componentePadreIndex,
        indicador: indicadorCompleto,
        indiceIndicador: props.indicadorEditando.index,
      })
    } else {
      // Si es un nuevo indicador
      await store.agregarIndicador({
        componentePadreIndex: props.componentePadreIndex,
        indicador: indicadorCompleto,
      })
    }

    // Éxito - mostrar notificación y cerrar modal o limpiar formulario
    /* store.mostrarNotificacion({
      texto: props.indicadorEditando
        ? 'Indicador actualizado correctamente'
        : 'Indicador creado correctamente',
      color: 'success',
    }) */

    // Limpiar el formulario o cerrar el diálogo según sea necesario
    if (!props.indicadorEditando) {
      // Resetear el formulario para nuevo ingreso
      indicador.value = {
        tipoRelacion: props.tipoRelacion || '',
        tipo: '',
        tipo_valor: '',
        redaccion: '',
        fuente_verificacion: '',
        target_poblacion: '',
        baseline: '',
        target_q1: '',
        target_q2: '',
        target_q3: '',
        target_q4: '',
        objetivoGeneral: null,
        objetivoEspecifico: null,
        resultado: null,
        producto: null,
      }
      paso.value = 1
    } else {
      // Si estábamos editando, emitir evento para cerrar el diálogo
    }
  } catch (error) {
    console.error('Error al guardar el indicador:', error)
    /* store.mostrarNotificacion({
      texto: 'Error al guardar el indicador: ' + error.message,
      color: 'error',
    }) */
  } finally {
    loading.value = false
  }
}
</script>

<style scoped></style>
