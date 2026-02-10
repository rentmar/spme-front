<template>
  <v-container fluid class="pa-4">
    <v-card>
      <v-card-title class="bg-blue-darken-3 text-white py-4">
        <v-icon class="mr-2">mdi-folder-information</v-icon>
        Datos del Proyecto
      </v-card-title>

      <v-card-text class="bg-blue-lighten-5 py-5">
        <v-row dense>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="proyecto.codigo"
              label="Código del Proyecto"
              variant="outlined"
              density="comfortable"
              readonly
              bg-color="white"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="8">
            <v-text-field
              v-model="proyecto.titulo"
              label="Nombre del Proyecto"
              variant="outlined"
              density="comfortable"
              readonly
              bg-color="white"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-title class="section-title py-4">
        <v-icon class="mr-2">mdi-chart-tree</v-icon>
        Estructura de Procedencia para Actividad
      </v-card-title>

      <v-card-text class="py-5">
        <div class="mb-6">
          <v-select
            v-model="estructura.nivel1.objetivoGeneral"
            :items="objetivosGenerales"
            item-title="codigo"
            item-value="id"
            label="Objetivo General"
            variant="outlined"
            prepend-icon="mdi-target"
            return-object
            clearable
            @update:model-value="onObjetivoGeneralSelected"
          >
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props" :subtitle="item.raw.descripcion"></v-list-item>
            </template>
          </v-select>
        </div>

        <div v-if="estructura.nivel1.objetivoGeneral">
          <!-- Visualización de estructura seleccionada -->
          <v-card v-if="showStructureTree" class="mb-6" variant="outlined">
            <v-card-title class="bg-grey-lighten-4 py-3">
              <v-icon class="mr-2">mdi-sitemap</v-icon>
              Vista Jerárquica de la Estructura Seleccionada
            </v-card-title>
            <v-card-text class="pt-3">
              <div class="tree-view">
                <div class="tree-node">▶ <strong>PROYECTO:</strong> {{ proyecto.codigo }}</div>

                <!-- NIVEL 1: Objetivo General -->
                <div class="tree-node level-indicator">
                  ├─▶ <span class="level-label">NIVEL 1</span> <strong>OBJETIVO GENERAL:</strong>
                  {{ estructura.nivel1.objetivoGeneral.codigo }}
                </div>

                <!-- Indicadores OG (Nivel 2) -->
                <template v-if="estructura.nivel2.ramaIzquierda.indicadorOG.length > 0">
                  <div class="tree-node level-indicator">
                    │ ├─ <span class="level-label">NIVEL 2</span> <strong>INDICADORES OG:</strong>
                  </div>
                  <div
                    v-for="indicador in estructura.nivel2.ramaIzquierda.indicadorOG"
                    :key="indicador.id"
                    class="tree-node ml-12"
                  >
                    │ │ └─ {{ indicador.codigo }}
                  </div>
                </template>

                <!-- RAMA IZQUIERDA: Resultado OG -->
                <template v-if="estructura.nivel2.ramaIzquierda.resultadoOG">
                  <div class="tree-node level-indicator">
                    │ ├─ <span class="level-label">NIVEL 2</span> <strong>RESULTADO OG:</strong>
                    {{ estructura.nivel2.ramaIzquierda.resultadoOG.codigo }}
                  </div>

                  <!-- NIVEL 3: Indicadores Resultado OG -->
                  <template v-if="estructura.nivel3.ramaIzquierda.indicadorResultadoOG.length > 0">
                    <div class="tree-node level-indicator ml-12">
                      │ │ ├─ <span class="level-label">NIVEL 3</span>
                      <strong>INDICADORES RESULTADO OG:</strong>
                    </div>
                    <div
                      v-for="indicador in estructura.nivel3.ramaIzquierda.indicadorResultadoOG"
                      :key="indicador.id"
                      class="tree-node ml-20"
                    >
                      │ │ │ └─ {{ indicador.codigo }}
                    </div>
                  </template>

                  <!-- NIVEL 3: Proceso OG -->
                  <div
                    v-if="estructura.nivel3.ramaIzquierda.procesoOG"
                    class="tree-node level-indicator ml-12"
                  >
                    │ │ └─ <span class="level-label">NIVEL 3</span> <strong>PROCESO OG:</strong>
                    {{ estructura.nivel3.ramaIzquierda.procesoOG.codigo }}
                  </div>
                </template>

                <!-- RAMA DERECHA: Objetivo Específico -->
                <template v-if="estructura.nivel2.ramaDerecha.objetivoEspecifico">
                  <div class="tree-node level-indicator">
                    │ └─ <span class="level-label">NIVEL 2</span>
                    <strong>OBJETIVO ESPECÍFICO:</strong>
                    {{ estructura.nivel2.ramaDerecha.objetivoEspecifico.codigo }}
                  </div>

                  <!-- NIVEL 3: Indicadores OE -->
                  <template v-if="estructura.nivel3.ramaDerecha.indicadorOE.length > 0">
                    <div class="tree-node level-indicator ml-12">
                      │ ├─ <span class="level-label">NIVEL 3</span> <strong>INDICADORES OE:</strong>
                    </div>
                    <div
                      v-for="indicador in estructura.nivel3.ramaDerecha.indicadorOE"
                      :key="indicador.id"
                      class="tree-node ml-20"
                    >
                      │ │ └─ {{ indicador.codigo }}
                    </div>
                  </template>

                  <!-- NIVEL 3: Producto OE -->
                  <div
                    v-if="estructura.nivel3.ramaDerecha.productoOE"
                    class="tree-node level-indicator ml-12"
                  >
                    │ ├─ <span class="level-label">NIVEL 3</span> <strong>PRODUCTO OE:</strong>
                    {{ estructura.nivel3.ramaDerecha.productoOE.codigo }}
                  </div>

                  <!-- NIVEL 3: Resultado OE -->
                  <div
                    v-if="estructura.nivel3.ramaDerecha.resultadoOE"
                    class="tree-node level-indicator ml-12"
                  >
                    │ ├─ <span class="level-label">NIVEL 3</span> <strong>RESULTADO OE:</strong>
                    {{ estructura.nivel3.ramaDerecha.resultadoOE.codigo }}

                    <!-- NIVEL 4: Indicadores Resultado OE -->
                    <template v-if="estructura.nivel4.resultadoOE.indicadores.length > 0">
                      <div class="tree-node level-indicator ml-12">
                        │ │ ├─ <span class="level-label">NIVEL 4</span>
                        <strong>INDICADORES RESULTADO OE:</strong>
                      </div>
                      <div
                        v-for="indicador in estructura.nivel4.resultadoOE.indicadores"
                        :key="indicador.id"
                        class="tree-node ml-20"
                      >
                        │ │ │ └─ {{ indicador.codigo }}
                      </div>
                    </template>

                    <!-- NIVEL 4: Productos Resultado OE -->
                    <template v-if="estructura.nivel4.resultadoOE.productos.length > 0">
                      <div class="tree-node level-indicator ml-12">
                        │ │ ├─ <span class="level-label">NIVEL 4</span>
                        <strong>PRODUCTOS RESULTADO OE:</strong>
                      </div>
                      <div
                        v-for="producto in estructura.nivel4.resultadoOE.productos"
                        :key="producto.id"
                        class="tree-node ml-20"
                      >
                        │ │ │ └─ {{ producto.codigo }}
                      </div>
                    </template>

                    <!-- NIVEL 4: Proceso Resultado OE -->
                    <div
                      v-if="estructura.nivel4.resultadoOE.proceso"
                      class="tree-node level-indicator ml-12"
                    >
                      │ │ └─ <span class="level-label">NIVEL 4</span>
                      <strong>PROCESO RESULTADO OE:</strong>
                      {{ estructura.nivel4.resultadoOE.proceso.codigo }}
                    </div>
                  </div>

                  <!-- NIVEL 3: Proceso Específico OE -->
                  <div
                    v-if="estructura.nivel3.ramaDerecha.procesoEspecificoOE"
                    class="tree-node level-indicator ml-12"
                  >
                    │ └─ <span class="level-label">NIVEL 3</span> <strong>PROCESO OE:</strong>
                    {{ estructura.nivel3.ramaDerecha.procesoEspecificoOE.codigo }}
                  </div>

                  <!-- NIVEL 4: Proceso Producto OE (depende de Producto OE) -->
                  <div
                    v-if="estructura.nivel4.productoOE.proceso"
                    class="tree-node level-indicator ml-12"
                  >
                    │ ├─ <span class="level-label">NIVEL 4</span>
                    <strong>PROCESO PRODUCTO OE:</strong>
                    {{ estructura.nivel4.productoOE.proceso.codigo }}
                  </div>
                </template>
              </div>
            </v-card-text>
          </v-card>

          <v-row>
            <v-col cols="12" md="6">
              <!-- Columna Izquierda: Procedencia desde Objetivo General -->
              <div class="mb-4">
                <div class="text-h6 mb-2 d-flex align-center">
                  <v-icon color="blue" class="mr-2">mdi-arrow-left-bold</v-icon>
                  Procedencia desde Objetivo General
                </div>

                <!-- NIVEL 2 -->
                <div class="mb-3">
                  <div class="text-subtitle-2 mb-1 level-header">NIVEL 2</div>

                  <v-select
                    v-model="estructura.nivel2.ramaIzquierda.indicadorOG"
                    :items="estructura.nivel1.objetivoGeneral?.indicador_og || []"
                    item-title="codigo"
                    item-value="id"
                    label="Indicador de Objetivo General"
                    variant="outlined"
                    prepend-icon="mdi-chart-line"
                    return-object
                    clearable
                    class="mb-4"
                    multiple
                    chips
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props" :subtitle="item.raw.descripcion"></v-list-item>
                    </template>
                  </v-select>

                  <v-select
                    v-model="estructura.nivel2.ramaIzquierda.resultadoOG"
                    :items="estructura.nivel1.objetivoGeneral?.resultados_og || []"
                    item-title="codigo"
                    item-value="id"
                    label="Resultado de Objetivo General"
                    variant="outlined"
                    prepend-icon="mdi-chart-tree"
                    return-object
                    clearable
                    class="mb-4"
                    @update:model-value="onResultadoOGSelected"
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props" :subtitle="item.raw.descripcion"></v-list-item>
                    </template>
                  </v-select>
                </div>

                <!-- NIVEL 3 -->
                <div v-if="estructura.nivel2.ramaIzquierda.resultadoOG" class="mb-3">
                  <div class="text-subtitle-2 mb-1 level-header">NIVEL 3</div>

                  <v-select
                    v-model="estructura.nivel3.ramaIzquierda.indicadorResultadoOG"
                    :items="estructura.nivel2.ramaIzquierda.resultadoOG?.indicador_res_og || []"
                    item-title="codigo"
                    item-value="id"
                    label="Indicador de Resultado OG"
                    variant="outlined"
                    prepend-icon="mdi-chart-line"
                    return-object
                    clearable
                    class="mb-4"
                    multiple
                    chips
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props" :subtitle="item.raw.descripcion"></v-list-item>
                    </template>
                  </v-select>

                  <v-select
                    v-model="estructura.nivel3.ramaIzquierda.procesoOG"
                    :items="estructura.nivel2.ramaIzquierda.resultadoOG?.proceso_resultado_og || []"
                    item-title="codigo"
                    item-value="id"
                    label="Proceso de Resultado OG"
                    variant="outlined"
                    prepend-icon="mdi-cogs"
                    return-object
                    clearable
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props" :subtitle="item.raw.titulo"></v-list-item>
                    </template>
                  </v-select>
                </div>
              </div>
            </v-col>

            <v-col cols="12" md="6">
              <!-- Columna Derecha: Procedencia desde Objetivo Específico -->
              <div class="mb-4">
                <div class="text-h6 mb-2 d-flex align-center">
                  <v-icon color="green" class="mr-2">mdi-arrow-right-bold</v-icon>
                  Procedencia desde Objetivo Específico
                </div>

                <!-- NIVEL 2 -->
                <div class="mb-3">
                  <div class="text-subtitle-2 mb-1 level-header">NIVEL 2</div>

                  <v-select
                    v-model="estructura.nivel2.ramaDerecha.objetivoEspecifico"
                    :items="estructura.nivel1.objetivoGeneral?.objetivos_especificos_og || []"
                    item-title="codigo"
                    item-value="id"
                    label="Objetivo Específico"
                    variant="outlined"
                    prepend-icon="mdi-target"
                    return-object
                    clearable
                    class="mb-4"
                    @update:model-value="onObjetivoEspecificoSelected"
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props" :subtitle="item.raw.descripcion"></v-list-item>
                    </template>
                  </v-select>
                </div>

                <!-- NIVEL 3 -->
                <div v-if="estructura.nivel2.ramaDerecha.objetivoEspecifico" class="mb-3">
                  <div class="text-subtitle-2 mb-1 level-header">NIVEL 3</div>

                  <v-select
                    v-model="estructura.nivel3.ramaDerecha.indicadorOE"
                    :items="estructura.nivel2.ramaDerecha.objetivoEspecifico?.indicador_oe || []"
                    item-title="codigo"
                    item-value="id"
                    label="Indicador de Objetivo Específico"
                    variant="outlined"
                    prepend-icon="mdi-chart-line"
                    return-object
                    clearable
                    class="mb-4"
                    multiple
                    chips
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props" :subtitle="item.raw.descripcion"></v-list-item>
                    </template>
                  </v-select>

                  <v-select
                    v-model="estructura.nivel3.ramaDerecha.resultadoOE"
                    :items="estructura.nivel2.ramaDerecha.objetivoEspecifico?.resultados_oe || []"
                    item-title="codigo"
                    item-value="id"
                    label="Resultado de Objetivo Específico"
                    variant="outlined"
                    prepend-icon="mdi-chart-tree"
                    return-object
                    clearable
                    class="mb-4"
                    @update:model-value="onResultadoOESelected"
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props" :subtitle="item.raw.descripcion"></v-list-item>
                    </template>
                  </v-select>

                  <v-select
                    v-model="estructura.nivel3.ramaDerecha.productoOE"
                    :items="estructura.nivel2.ramaDerecha.objetivoEspecifico?.productos_oe || []"
                    item-title="codigo"
                    item-value="id"
                    label="Producto de Objetivo Específico"
                    variant="outlined"
                    prepend-icon="mdi-package-variant"
                    return-object
                    clearable
                    class="mb-4"
                    @update:model-value="onProductoOESelected"
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props" :subtitle="item.raw.descripcion"></v-list-item>
                    </template>
                  </v-select>

                  <v-select
                    v-model="estructura.nivel3.ramaDerecha.procesoEspecificoOE"
                    :items="estructura.nivel2.ramaDerecha.objetivoEspecifico?.proceso_oe || []"
                    item-title="codigo"
                    item-value="id"
                    label="Proceso de Objetivo Específico"
                    variant="outlined"
                    prepend-icon="mdi-cogs"
                    return-object
                    clearable
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props" :subtitle="item.raw.titulo"></v-list-item>
                    </template>
                  </v-select>
                </div>

                <!-- NIVEL 4: Elementos que dependen del Resultado OE -->
                <div v-if="estructura.nivel3.ramaDerecha.resultadoOE" class="mb-3">
                  <div class="text-subtitle-2 mb-1 level-header">
                    NIVEL 4 (Dependiente de Resultado OE)
                  </div>

                  <v-select
                    v-model="estructura.nivel4.resultadoOE.indicadores"
                    :items="estructura.nivel3.ramaDerecha.resultadoOE?.indicador_res_oe || []"
                    item-title="codigo"
                    item-value="id"
                    label="Indicador de Resultado OE"
                    variant="outlined"
                    prepend-icon="mdi-chart-line"
                    return-object
                    clearable
                    class="mb-4"
                    multiple
                    chips
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props" :subtitle="item.raw.descripcion"></v-list-item>
                    </template>
                  </v-select>

                  <v-select
                    v-model="estructura.nivel4.resultadoOE.productos"
                    :items="estructura.nivel3.ramaDerecha.resultadoOE?.productos_res_oe || []"
                    item-title="codigo"
                    item-value="id"
                    label="Producto de Resultado OE"
                    variant="outlined"
                    prepend-icon="mdi-package-variant"
                    return-object
                    clearable
                    class="mb-4"
                    multiple
                    chips
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props" :subtitle="item.raw.descripcion"></v-list-item>
                    </template>
                  </v-select>

                  <v-select
                    v-model="estructura.nivel4.resultadoOE.proceso"
                    :items="estructura.nivel3.ramaDerecha.resultadoOE?.proceso_resultado_oe || []"
                    item-title="codigo"
                    item-value="id"
                    label="Proceso de Resultado OE"
                    variant="outlined"
                    prepend-icon="mdi-cogs"
                    return-object
                    clearable
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props" :subtitle="item.raw.titulo"></v-list-item>
                    </template>
                  </v-select>
                </div>

                <!-- NIVEL 4: Proceso Producto OE (depende de Producto OE) -->
                <div v-if="estructura.nivel3.ramaDerecha.productoOE" class="mb-3">
                  <div class="text-subtitle-2 mb-1 level-header">
                    NIVEL 4 (Dependiente de Producto OE)
                  </div>

                  <v-select
                    v-model="estructura.nivel4.productoOE.proceso"
                    :items="estructura.nivel3.ramaDerecha.productoOE?.proceso_producto_oe || []"
                    item-title="codigo"
                    item-value="id"
                    label="Proceso de Producto OE"
                    variant="outlined"
                    prepend-icon="mdi-cogs"
                    return-object
                    clearable
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props" :subtitle="item.raw.titulo"></v-list-item>
                    </template>
                  </v-select>
                </div>
              </div>
            </v-col>
          </v-row>

          <!-- Validación de estructura mínima -->
          <v-alert
            v-if="!esEstructuraValida && estructura.nivel1.objetivoGeneral"
            type="warning"
            variant="outlined"
            class="mt-4"
          >
            <v-icon class="mr-2">mdi-alert</v-icon>
            Debe seleccionar al menos un elemento de la estructura jerárquica
          </v-alert>

          <!-- Formulario para crear actividad -->
          <div class="activity-form-container mt-6">
            <v-card-title class="px-0 pt-2 pb-4">
              <v-icon class="mr-2" color="primary">mdi-plus-circle</v-icon>
              Crear Nueva Actividad
            </v-card-title>

            <v-form ref="formActividad" v-model="formValido">
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="nuevaActividad.codigo"
                    label="Código de Actividad"
                    variant="outlined"
                    clearable
                    density="comfortable"
                    :rules="reglasCodigo"
                    :error-messages="erroresCodigo"
                    @blur="validarCodigoUnico"
                    @input="limpiarErrorCodigo"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="8">
                  <v-text-field
                    v-model="nuevaActividad.titulo"
                    label="Nombre de la Actividad"
                    variant="outlined"
                    clearable
                    density="comfortable"
                    :rules="reglasTitulo"
                    :error-messages="erroresTitulo"
                    @input="limpiarErrorTitulo"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-card-actions class="pt-4">
                <v-spacer></v-spacer>
                <v-btn color="grey" variant="text" @click="resetSeleccion"> Cancelar </v-btn>
                <v-btn
                  color="primary"
                  variant="flat"
                  @click="validarYMostrarConfirmacion"
                  :disabled="!esFormularioValido || !esEstructuraValida"
                  :loading="validando"
                >
                  Crear Actividad
                </v-btn>
              </v-card-actions>
            </v-form>
          </div>
        </div>

        <div v-else class="text-center mt-8">
          <v-alert type="info" variant="outlined">
            <v-icon class="mr-2">mdi-information</v-icon>
            Seleccione un Objetivo General para ver las opciones de procedencia
          </v-alert>
        </div>
      </v-card-text>
    </v-card>

    <!-- Diálogo de confirmación CORREGIDO -->
    <v-dialog v-model="dialogVisible" max-width="800">
      <v-card>
        <v-card-title class="bg-blue-darken-3 text-white">
          <v-icon class="mr-2">mdi-check-circle-outline</v-icon>
          Confirmar Creación de Actividad
        </v-card-title>

        <v-card-text class="py-4">
          <h4 class="text-subtitle-1 mb-2">Datos de la nueva Actividad:</h4>
          <v-list density="compact" class="mb-4">
            <v-list-item>
              <v-list-item-title
                ><strong>Código:</strong> {{ nuevaActividad.codigo }}</v-list-item-title
              >
            </v-list-item>
            <v-list-item>
              <v-list-item-title
                ><strong>Título:</strong> {{ nuevaActividad.titulo }}</v-list-item-title
              >
            </v-list-item>
          </v-list>

          <h4 class="text-subtitle-1 mb-2">Estructura de Procedencia:</h4>
          <v-card variant="outlined" class="pa-3 mb-4">
            <div class="tree-view compact">
              <div class="tree-node">▶ <strong>PROYECTO:</strong> {{ proyecto.codigo }}</div>

              <!-- Objetivo General -->
              <div v-if="collectedData.objetivogeneral" class="tree-node">
                ├─▶ <strong>OBJETIVO GENERAL:</strong>
                {{ collectedData.objetivogeneral.data.codigo }}
              </div>

              <!-- Rama Izquierda -->
              <template v-if="collectedData.indicadorog && collectedData.indicadorog.length > 0">
                <div class="tree-node">│ ├─ <strong>INDICADORES OG:</strong></div>
                <div
                  v-for="indicador in collectedData.indicadorog"
                  :key="indicador.data.id"
                  class="tree-node ml-8"
                >
                  │ │ └─ {{ indicador.data.codigo }}
                </div>
              </template>

              <template v-if="collectedData.resultadoog">
                <div class="tree-node">
                  │ ├─ <strong>RESULTADO OG:</strong> {{ collectedData.resultadoog.data.codigo }}
                </div>

                <template
                  v-if="collectedData.indicadorrog && collectedData.indicadorrog.length > 0"
                >
                  <div class="tree-node ml-8">
                    │ │ ├─ <strong>INDICADORES RESULTADO OG:</strong>
                  </div>
                  <div
                    v-for="indicador in collectedData.indicadorrog"
                    :key="indicador.data.id"
                    class="tree-node ml-12"
                  >
                    │ │ │ └─ {{ indicador.data.codigo }}
                  </div>
                </template>

                <div v-if="collectedData.procesoog" class="tree-node ml-8">
                  │ │ └─ <strong>PROCESO OG:</strong> {{ collectedData.procesoog.data.codigo }}
                </div>
              </template>

              <!-- Rama Derecha -->
              <template v-if="collectedData.objetivoespecifico">
                <div class="tree-node">
                  │ └─ <strong>OBJETIVO ESPECÍFICO:</strong>
                  {{ collectedData.objetivoespecifico.data.codigo }}
                </div>

                <template v-if="collectedData.indicadoroe && collectedData.indicadoroe.length > 0">
                  <div class="tree-node ml-8">│ ├─ <strong>INDICADORES OE:</strong></div>
                  <div
                    v-for="indicador in collectedData.indicadoroe"
                    :key="indicador.data.id"
                    class="tree-node ml-12"
                  >
                    │ │ └─ {{ indicador.data.codigo }}
                  </div>
                </template>

                <div v-if="collectedData.productooe" class="tree-node ml-8">
                  │ ├─ <strong>PRODUCTO OE:</strong> {{ collectedData.productooe.data.codigo }}
                </div>

                <div v-if="collectedData.resultadooe" class="tree-node ml-8">
                  │ ├─ <strong>RESULTADO OE:</strong> {{ collectedData.resultadooe.data.codigo }}

                  <!-- Elementos de nivel 4 que dependen del resultado OE -->
                  <template
                    v-if="collectedData.indicadorroe && collectedData.indicadorroe.length > 0"
                  >
                    <div class="tree-node ml-8">
                      │ │ ├─ <strong>INDICADORES RESULTADO OE:</strong>
                    </div>
                    <div
                      v-for="indicador in collectedData.indicadorroe"
                      :key="indicador.data.id"
                      class="tree-node ml-12"
                    >
                      │ │ │ └─ {{ indicador.data.codigo }}
                    </div>
                  </template>

                  <template
                    v-if="
                      collectedData.productoresultadooe &&
                      collectedData.productoresultadooe.length > 0
                    "
                  >
                    <div class="tree-node ml-8">
                      │ │ ├─ <strong>PRODUCTOS RESULTADO OE:</strong>
                    </div>
                    <div
                      v-for="producto in collectedData.productoresultadooe"
                      :key="producto.data.id"
                      class="tree-node ml-12"
                    >
                      │ │ │ └─ {{ producto.data.codigo }}
                    </div>
                  </template>

                  <div v-if="collectedData.procesoresultadooe" class="tree-node ml-8">
                    │ │ └─ <strong>PROCESO RESULTADO OE:</strong>
                    {{ collectedData.procesoresultadooe.data.codigo }}
                  </div>
                </div>

                <div v-if="collectedData.procesoproductooe" class="tree-node ml-8">
                  │ ├─ <strong>PROCESO PRODUCTO OE:</strong>
                  {{ collectedData.procesoproductooe.data.codigo }}
                </div>

                <div v-if="collectedData.procesoespecificoe" class="tree-node ml-8">
                  │ └─ <strong>PROCESO OE:</strong>
                  {{ collectedData.procesoespecificoe.data.codigo }}
                </div>
              </template>
            </div>
          </v-card>

          <!-- NUEVA SECCIÓN: Listado de Indicadores -->
          <h4 class="text-subtitle-1 mb-2">Indicadores Asociados:</h4>
          <v-card variant="outlined" class="pa-3">
            <v-expansion-panels variant="accordion">
              <!-- Indicadores OG -->
              <v-expansion-panel v-if="indicadoresRecolectados.indicadorog.length > 0">
                <v-expansion-panel-title>
                  <v-icon class="mr-2" color="blue">mdi-chart-line</v-icon>
                  Indicadores de Objetivo General (Nivel 2)
                  <v-chip class="ml-2" size="small">{{
                    indicadoresRecolectados.indicadorog.length
                  }}</v-chip>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-list density="compact">
                    <v-list-item
                      v-for="indicador in indicadoresRecolectados.indicadorog"
                      :key="indicador.id"
                    >
                      <v-list-item-title>
                        <strong>{{ indicador.codigo }}:</strong> {{ indicador.descripcion }}
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-expansion-panel-text>
              </v-expansion-panel>

              <!-- Indicadores Resultado OG -->
              <v-expansion-panel v-if="indicadoresRecolectados.indicadorrog.length > 0">
                <v-expansion-panel-title>
                  <v-icon class="mr-2" color="indigo">mdi-chart-bar</v-icon>
                  Indicadores de Resultado OG (Nivel 3)
                  <v-chip class="ml-2" size="small">{{
                    indicadoresRecolectados.indicadorrog.length
                  }}</v-chip>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-list density="compact">
                    <v-list-item
                      v-for="indicador in indicadoresRecolectados.indicadorrog"
                      :key="indicador.id"
                    >
                      <v-list-item-title>
                        <strong>{{ indicador.codigo }}:</strong> {{ indicador.descripcion }}
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-expansion-panel-text>
              </v-expansion-panel>

              <!-- Indicadores OE -->
              <v-expansion-panel v-if="indicadoresRecolectados.indicadoroe.length > 0">
                <v-expansion-panel-title>
                  <v-icon class="mr-2" color="green">mdi-chart-areaspline</v-icon>
                  Indicadores de Objetivo Específico (Nivel 3)
                  <v-chip class="ml-2" size="small">{{
                    indicadoresRecolectados.indicadoroe.length
                  }}</v-chip>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-list density="compact">
                    <v-list-item
                      v-for="indicador in indicadoresRecolectados.indicadoroe"
                      :key="indicador.id"
                    >
                      <v-list-item-title>
                        <strong>{{ indicador.codigo }}:</strong> {{ indicador.descripcion }}
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-expansion-panel-text>
              </v-expansion-panel>

              <!-- Indicadores Resultado OE -->
              <v-expansion-panel v-if="indicadoresRecolectados.indicadorroe.length > 0">
                <v-expansion-panel-title>
                  <v-icon class="mr-2" color="orange">mdi-chart-box</v-icon>
                  Indicadores de Resultado OE (Nivel 4)
                  <v-chip class="ml-2" size="small">{{
                    indicadoresRecolectados.indicadorroe.length
                  }}</v-chip>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-list density="compact">
                    <v-list-item
                      v-for="indicador in indicadoresRecolectados.indicadorroe"
                      :key="indicador.id"
                    >
                      <v-list-item-title>
                        <strong>{{ indicador.codigo }}:</strong> {{ indicador.descripcion }}
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-expansion-panel-text>
              </v-expansion-panel>

              <!-- Resumen total -->
              <v-expansion-panel>
                <v-expansion-panel-title>
                  <v-icon class="mr-2" color="primary">mdi-chart-timeline</v-icon>
                  Resumen Total de Indicadores
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-list density="compact">
                    <v-list-item>
                      <v-list-item-title>
                        <strong>Total Indicadores OG:</strong>
                        {{ indicadoresRecolectados.indicadorog.length }}
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>
                        <strong>Total Indicadores Resultado OG:</strong>
                        {{ indicadoresRecolectados.indicadorrog.length }}
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>
                        <strong>Total Indicadores OE:</strong>
                        {{ indicadoresRecolectados.indicadoroe.length }}
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>
                        <strong>Total Indicadores Resultado OE:</strong>
                        {{ indicadoresRecolectados.indicadorroe.length }}
                      </v-list-item-title>
                    </v-list-item>
                    <v-divider class="my-2"></v-divider>
                    <v-list-item class="bg-blue-lighten-5">
                      <v-list-item-title class="font-weight-bold">
                        <strong>TOTAL GENERAL:</strong>
                        {{
                          indicadoresRecolectados.indicadorog.length +
                          indicadoresRecolectados.indicadorrog.length +
                          indicadoresRecolectados.indicadoroe.length +
                          indicadoresRecolectados.indicadorroe.length
                        }}
                        indicadores
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="dialogVisible = false"> Cancelar </v-btn>
          <v-btn color="primary" variant="flat" @click="confirmarCreacion">
            Confirmar y Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useActividad } from '@/modules/proyecto/composables/useActividad'
import { useProyectoStore } from '@/modules/proyecto/store/proyectoStore'
import { useUserStore } from '@/stores/user'
import { useUsuario } from '@/modules/usuarios/composables/useUsuario'
import { useSnackbar } from '@/composables/useSnackbar'

// Props para recibir datos del proyecto desde el componente padre
const props = defineProps({
  proyectoData: {
    type: Object,
    required: true,
  },
})

// INICIALIZAR
const { usuario: usuarioInfo, informacionUsuarioPorNick } = useUsuario()

// Variables reactivas
const proyecto = ref({})
const objetivosGenerales = ref([])
const dialogVisible = ref(false)
const collectedData = ref({})
const showStructureTree = ref(true)
const indicadoresRecolectados = ref({
  indicadorog: [],
  indicadoroe: [],
  indicadorrog: [],
  indicadorroe: [],
})

// Estructura corregida según la jerarquía correcta
const estructura = ref({
  nivel1: {
    objetivoGeneral: null,
  },
  nivel2: {
    ramaIzquierda: {
      indicadorOG: [],
      resultadoOG: null,
    },
    ramaDerecha: {
      objetivoEspecifico: null,
    },
  },
  nivel3: {
    ramaIzquierda: {
      indicadorResultadoOG: [],
      procesoOG: null,
    },
    ramaDerecha: {
      resultadoOE: null,
      indicadorOE: [],
      productoOE: null,
      procesoEspecificoOE: null,
    },
  },
  nivel4: {
    resultadoOE: {
      indicadores: [], // indicador_res_oe
      productos: [], // productos_res_oe
      proceso: null, // proceso_resultado_oe
    },
    productoOE: {
      proceso: null, // proceso_producto_oe
    },
  },
})

// Variables para validación
const formValido = ref(false)
const validando = ref(false)
const formActividad = ref(null)
const erroresCodigo = ref([])
const erroresTitulo = ref([])

// Reglas de validación
const reglasCodigo = [
  (v) => !!v || 'El código es requerido',
  (v) => (v && v.length >= 3) || 'El código debe tener al menos 3 caracteres',
  (v) => (v && v.length <= 20) || 'El código no puede exceder 20 caracteres',
  (v) =>
    /^[A-Z0-9_-]+$/.test(v) ||
    'Solo se permiten letras mayúsculas, números, guiones y guiones bajos',
  (v) => /^[A-Z]/.test(v) || 'El código debe comenzar con una letra mayúscula',
]

const reglasTitulo = [
  (v) => !!v || 'El título es requerido',
  (v) => (v && v.length >= 5) || 'El título debe tener al menos 5 caracteres',
  (v) => (v && v.length <= 200) || 'El título no puede exceder 200 caracteres',
  (v) => (v && v.trim().length > 0) || 'El título no puede ser solo espacios en blanco',
]

// Datos del usuario
const usuario = computed(() => {
  return {
    nombre: userStore.usuario,
    role: userStore.rol,
    permisos: userStore.permisos,
  }
})

// Nueva actividad
const nuevaActividad = ref({
  codigo: '',
  titulo: '',
})

// Validaciones
const esFormularioValido = computed(() => {
  return (
    formValido.value &&
    nuevaActividad.value.codigo &&
    nuevaActividad.value.titulo &&
    erroresCodigo.value.length === 0 &&
    erroresTitulo.value.length === 0
  )
})

// Estructura válida considerando la nueva organización
const esEstructuraValida = computed(() => {
  const tieneRamaIzquierda =
    estructura.value.nivel2.ramaIzquierda.resultadoOG ||
    estructura.value.nivel2.ramaIzquierda.indicadorOG.length > 0 ||
    estructura.value.nivel3.ramaIzquierda.indicadorResultadoOG.length > 0 ||
    estructura.value.nivel3.ramaIzquierda.procesoOG

  const tieneRamaDerecha =
    estructura.value.nivel2.ramaDerecha.objetivoEspecifico ||
    estructura.value.nivel3.ramaDerecha.resultadoOE ||
    estructura.value.nivel3.ramaDerecha.productoOE ||
    estructura.value.nivel3.ramaDerecha.procesoEspecificoOE ||
    estructura.value.nivel3.ramaDerecha.indicadorOE.length > 0 ||
    // Elementos de nivel 4 que dependen de resultadoOE
    estructura.value.nivel4.resultadoOE.indicadores.length > 0 ||
    estructura.value.nivel4.resultadoOE.productos.length > 0 ||
    estructura.value.nivel4.resultadoOE.proceso ||
    // Elemento de nivel 4 que depende de productoOE
    estructura.value.nivel4.productoOE.proceso

  return tieneRamaIzquierda || tieneRamaDerecha
})

// Iniciar composables y stores
const { crearActividad: crearActividadComposable } = useActividad()
const { successMsg, errorMsg } = useSnackbar()
const proyectoStore = useProyectoStore()
const userStore = useUserStore()

// Preprocesar datos
onMounted(() => {
  preprocesarDatos()
})

// Función para preprocesar los datos de la API
const preprocesarDatos = () => {
  proyecto.value = { ...props.proyectoData }

  // Verificar si existe objetivo_general
  if (proyecto.value.objetivo_general) {
    const objetivoGeneral = proyecto.value.objetivo_general

    // Asegurar que las propiedades existan
    objetivoGeneral.indicador_og = objetivoGeneral.indicador_og || []
    objetivoGeneral.resultados_og = objetivoGeneral.resultados_og || []
    objetivoGeneral.objetivos_especificos_og = objetivoGeneral.objetivos_especificos_og || []

    // Procesar resultados OG
    objetivoGeneral.resultados_og.forEach((resultado) => {
      resultado.indicador_res_og = resultado.indicador_res_og || []
      resultado.proceso_resultado_og = resultado.proceso_resultado_og || []
    })

    // Procesar objetivos específicos
    objetivoGeneral.objetivos_especificos_og.forEach((objetivoEspecifico) => {
      objetivoEspecifico.indicador_oe = objetivoEspecifico.indicador_oe || []
      objetivoEspecifico.resultados_oe = objetivoEspecifico.resultados_oe || []
      objetivoEspecifico.productos_oe = objetivoEspecifico.productos_oe || []
      objetivoEspecifico.proceso_oe = objetivoEspecifico.proceso_oe || []

      // Procesar resultados OE
      objetivoEspecifico.resultados_oe.forEach((resultado) => {
        resultado.indicador_res_oe = resultado.indicador_res_oe || []
        resultado.productos_res_oe = resultado.productos_res_oe || [] // Productos resultado OE
        resultado.proceso_resultado_oe = resultado.proceso_resultado_oe || []
      })

      // Procesar productos OE
      objetivoEspecifico.productos_oe.forEach((producto) => {
        producto.proceso_producto_oe = producto.proceso_producto_oe || []
      })
    })

    objetivosGenerales.value = [objetivoGeneral]
  } else {
    objetivosGenerales.value = []
  }
}

// Métodos para manejar selecciones
const onObjetivoGeneralSelected = () => {
  // Limpiar toda la estructura cuando cambia el objetivo general
  estructura.value = {
    nivel1: { objetivoGeneral: estructura.value.nivel1.objetivoGeneral },
    nivel2: {
      ramaIzquierda: { indicadorOG: [], resultadoOG: null },
      ramaDerecha: { objetivoEspecifico: null },
    },
    nivel3: {
      ramaIzquierda: { indicadorResultadoOG: [], procesoOG: null },
      ramaDerecha: {
        resultadoOE: null,
        indicadorOE: [],
        productoOE: null,
        procesoEspecificoOE: null,
      },
    },
    nivel4: {
      resultadoOE: {
        indicadores: [],
        productos: [],
        proceso: null,
      },
      productoOE: {
        proceso: null,
      },
    },
  }
}

const onResultadoOGSelected = () => {
  estructura.value.nivel3.ramaIzquierda.indicadorResultadoOG = []
  estructura.value.nivel3.ramaIzquierda.procesoOG = null
}

const onObjetivoEspecificoSelected = () => {
  estructura.value.nivel3.ramaDerecha.indicadorOE = []
  estructura.value.nivel3.ramaDerecha.resultadoOE = null
  estructura.value.nivel3.ramaDerecha.productoOE = null
  estructura.value.nivel3.ramaDerecha.procesoEspecificoOE = null

  // Limpiar nivel 4
  estructura.value.nivel4.resultadoOE = {
    indicadores: [],
    productos: [],
    proceso: null,
  }
  estructura.value.nivel4.productoOE = {
    proceso: null,
  }
}

const onResultadoOESelected = () => {
  // Limpiar solo los elementos de nivel 4 que dependen de resultadoOE
  estructura.value.nivel4.resultadoOE = {
    indicadores: [],
    productos: [],
    proceso: null,
  }
}

const onProductoOESelected = () => {
  // Limpiar solo el proceso producto OE
  estructura.value.nivel4.productoOE = {
    proceso: null,
  }
}

// Métodos de validación
const limpiarErrorCodigo = () => (erroresCodigo.value = [])
const limpiarErrorTitulo = () => (erroresTitulo.value = [])

const validarCodigoUnico = async () => {
  if (!nuevaActividad.value.codigo) return

  const codigo = nuevaActividad.value.codigo.trim().toUpperCase()

  if (!/^[A-Z][A-Z0-9_-]{2,19}$/.test(codigo)) {
    erroresCodigo.value = ['Formato de código inválido']
    return
  }

  const codigosExistentes = ['ACT001', 'ACT002', 'PROC001']
  if (codigosExistentes.includes(codigo)) {
    erroresCodigo.value = ['Este código ya está en uso']
    return
  }

  limpiarErrorCodigo()
}

const validarTitulo = () => {
  const titulo = nuevaActividad.value.titulo?.trim()

  if (!titulo) {
    erroresTitulo.value = ['El título es requerido']
    return false
  }

  if (titulo.length < 5) {
    erroresTitulo.value = ['El título debe tener al menos 5 caracteres']
    return false
  }

  if (titulo.length > 200) {
    erroresTitulo.value = ['El título no puede exceder 200 caracteres']
    return false
  }

  if (/^\d+$/.test(titulo)) {
    erroresTitulo.value = ['El título no puede contener solo números']
    return false
  }

  limpiarErrorTitulo()
  return true
}

const validarFormulario = async () => {
  validando.value = true
  const { valid } = await formActividad.value.validate()

  if (!valid) {
    validando.value = false
    return false
  }

  await validarCodigoUnico()
  const tituloValido = validarTitulo()

  if (erroresCodigo.value.length > 0 || !tituloValido) {
    validando.value = false
    return false
  }

  validando.value = false
  return true
}

// Convertir estructura unificada al formato de collectedData
const obtenerEstructuraProcedencia = () => {
  const estructuraPlana = {}

  const agregarElemento = (clave, valor) => {
    if (valor) {
      if (Array.isArray(valor)) {
        if (valor.length > 0) {
          estructuraPlana[clave] = valor.map((data) => ({
            tipo: clave,
            data: data,
          }))
        }
      } else {
        estructuraPlana[clave] = {
          tipo: clave,
          data: valor,
        }
      }
    }
  }

  // Mapear todas las propiedades
  agregarElemento('objetivogeneral', estructura.value.nivel1.objetivoGeneral)
  agregarElemento('indicadorog', estructura.value.nivel2.ramaIzquierda.indicadorOG)
  agregarElemento('resultadoog', estructura.value.nivel2.ramaIzquierda.resultadoOG)
  agregarElemento('indicadorrog', estructura.value.nivel3.ramaIzquierda.indicadorResultadoOG)
  agregarElemento('procesoog', estructura.value.nivel3.ramaIzquierda.procesoOG)
  agregarElemento('objetivoespecificoog', estructura.value.nivel2.ramaDerecha.objetivoEspecifico)
  agregarElemento('indicadoroe', estructura.value.nivel3.ramaDerecha.indicadorOE)
  agregarElemento('resultadooe', estructura.value.nivel3.ramaDerecha.resultadoOE)
  agregarElemento('productooe', estructura.value.nivel3.ramaDerecha.productoOE)
  agregarElemento('procesooe', estructura.value.nivel3.ramaDerecha.procesoEspecificoOE)

  // Elementos de nivel 4 que dependen de resultadoOE
  agregarElemento('indicadorroe', estructura.value.nivel4.resultadoOE.indicadores)
  agregarElemento('productoroe', estructura.value.nivel4.resultadoOE.productos)
  agregarElemento('procesoroe', estructura.value.nivel4.resultadoOE.proceso)

  // Elemento de nivel 4 que depende de productoOE
  agregarElemento('procesopoe', estructura.value.nivel4.productoOE.proceso)

  return estructuraPlana
}

// Obtener selecciones simples con IDs
const obtenerSeleccionesSimples = () => {
  const seleccionesSimples = {}

  if (estructura.value.nivel1.objetivoGeneral) {
    seleccionesSimples.objetivoGeneralId = estructura.value.nivel1.objetivoGeneral.id
  }

  // Indicadores OG
  if (estructura.value.nivel2.ramaIzquierda.indicadorOG.length > 0) {
    seleccionesSimples.indicadorOGIds = estructura.value.nivel2.ramaIzquierda.indicadorOG.map(
      (item) => item.id,
    )
  }

  if (estructura.value.nivel2.ramaIzquierda.resultadoOG) {
    seleccionesSimples.resultadoOGId = estructura.value.nivel2.ramaIzquierda.resultadoOG.id
  }

  // Indicadores Resultado OG
  if (estructura.value.nivel3.ramaIzquierda.indicadorResultadoOG.length > 0) {
    seleccionesSimples.indicadorResultadoOGIds =
      estructura.value.nivel3.ramaIzquierda.indicadorResultadoOG.map((item) => item.id)
  }

  if (estructura.value.nivel3.ramaIzquierda.procesoOG) {
    seleccionesSimples.procesoOGId = estructura.value.nivel3.ramaIzquierda.procesoOG.id
  }

  if (estructura.value.nivel2.ramaDerecha.objetivoEspecifico) {
    seleccionesSimples.objetivoEspecificoId =
      estructura.value.nivel2.ramaDerecha.objetivoEspecifico.id
  }

  // Indicadores OE
  if (estructura.value.nivel3.ramaDerecha.indicadorOE.length > 0) {
    seleccionesSimples.indicadorOEIds = estructura.value.nivel3.ramaDerecha.indicadorOE.map(
      (item) => item.id,
    )
  }

  if (estructura.value.nivel3.ramaDerecha.resultadoOE) {
    seleccionesSimples.resultadoOEId = estructura.value.nivel3.ramaDerecha.resultadoOE.id
  }

  if (estructura.value.nivel3.ramaDerecha.productoOE) {
    seleccionesSimples.productoOEId = estructura.value.nivel3.ramaDerecha.productoOE.id
  }

  // Elementos de nivel 4 que dependen de resultadoOE
  if (estructura.value.nivel4.resultadoOE.indicadores.length > 0) {
    seleccionesSimples.indicadorResultadoOEIds =
      estructura.value.nivel4.resultadoOE.indicadores.map((item) => item.id)
  }

  if (estructura.value.nivel4.resultadoOE.productos.length > 0) {
    seleccionesSimples.productoResultadoOEIds = estructura.value.nivel4.resultadoOE.productos.map(
      (item) => item.id,
    )
  }

  if (estructura.value.nivel4.resultadoOE.proceso) {
    seleccionesSimples.procesoResultadoOEId = estructura.value.nivel4.resultadoOE.proceso.id
  }

  // Elemento de nivel 4 que depende de productoOE
  if (estructura.value.nivel4.productoOE.proceso) {
    seleccionesSimples.procesoProductoOEId = estructura.value.nivel4.productoOE.proceso.id
  }

  if (estructura.value.nivel3.ramaDerecha.procesoEspecificoOE) {
    seleccionesSimples.procesoEspecificoOEId =
      estructura.value.nivel3.ramaDerecha.procesoEspecificoOE.id
  }

  return seleccionesSimples
}

// Función para recolectar solo indicadores
const recolectarIndicadores = () => {
  return {
    indicadorog: estructura.value.nivel2.ramaIzquierda.indicadorOG.map((item) => ({
      id: item.id,
      codigo: item.codigo,
      descripcion: item.descripcion,
      tipo: 'indicadorog',
      nivel: 2,
      rama: 'izquierda',
    })),
    indicadoroe: estructura.value.nivel3.ramaDerecha.indicadorOE.map((item) => ({
      id: item.id,
      codigo: item.codigo,
      descripcion: item.descripcion,
      tipo: 'indicadoroe',
      nivel: 3,
      rama: 'derecha',
    })),
    indicadorrog: estructura.value.nivel3.ramaIzquierda.indicadorResultadoOG.map((item) => ({
      id: item.id,
      codigo: item.codigo,
      descripcion: item.descripcion,
      tipo: 'indicadorrog',
      nivel: 3,
      rama: 'izquierda',
    })),
    indicadorroe: estructura.value.nivel4.resultadoOE.indicadores.map((item) => ({
      id: item.id,
      codigo: item.codigo,
      descripcion: item.descripcion,
      tipo: 'indicadorroe',
      nivel: 4,
      rama: 'derecha',
    })),
  }
}

const validarYMostrarConfirmacion = async () => {
  const esValido = await validarFormulario()
  if (esValido) {
    collectedData.value = obtenerEstructuraProcedencia()

    // Recolectar indicadores para mostrar en el diálogo
    indicadoresRecolectados.value = recolectarIndicadores()

    dialogVisible.value = true
  }
}

const confirmarCreacion = async () => {
  dialogVisible.value = false

  // Recolectar indicadores separadamente
  const indicadoresRecolectadosData = recolectarIndicadores()

  proyectoStore.almacenarNodosProcedenciaActividad({
    ...collectedData.value,
    indicadores_seccion: indicadoresRecolectadosData,
  })

  const actividadDatos = {
    codigo: nuevaActividad.value.codigo,
    nombreCorto: nuevaActividad.value.titulo,
    descripcion: '',
    supuestos: '',
    riesgos: '',
    objetivo_de_actividad: '',
    descripcion_evaluacion: '',
    descripcion_tipo_actividad: '',
    fecha_programada: null,
    fecha_inicio: null,
    fecha_cierre: null,
    presupuesto: '0',
    presupuestoGlobal: '0',
    totalReportado: '0',
    totalEjecutado: '0',
    saldo: '0',
    gradoEjecucion: null,
    procedencia_fondos: null,
    estado: 'CRD',
    rutaTrazadoIndicadores: null,
    factoresCriticos: null,
    estructuraProcedencia: {
      datosProcedencia: collectedData.value,
      indicadores_recolectados: indicadoresRecolectadosData,
      nodosRelacionados: proyectoStore.nodosVinculadosActividad,
      seleccionesSimples: obtenerSeleccionesSimples(),
    },
    estaInactiva: false,
    tipo: 1,
    proceso: null,
    resultado_og: null,
    resultado_oe: null,
    producto_oe: null,
    objetivo_pei: null,
    indicador_pei: null,
    proyecto: proyecto.value.id,
    responsable: null,
  }

  const usr = { usuario: usuario.value.nombre }

  try {
    await informacionUsuarioPorNick(usr)
    actividadDatos.responsable = usuarioInfo.value.id
    await crearActividadComposable(actividadDatos)
    successMsg('Actividad Creada')
    emit('crear-actividad', actividadDatos)
    resetSeleccion()
  } catch (e) {
    console.error(e)
    errorMsg('Error al Crear Actividad')
  }
}

const resetSeleccion = () => {
  estructura.value = {
    nivel1: { objetivoGeneral: null },
    nivel2: {
      ramaIzquierda: { indicadorOG: [], resultadoOG: null },
      ramaDerecha: { objetivoEspecifico: null },
    },
    nivel3: {
      ramaIzquierda: { indicadorResultadoOG: [], procesoOG: null },
      ramaDerecha: {
        resultadoOE: null,
        indicadorOE: [],
        productoOE: null,
        procesoEspecificoOE: null,
      },
    },
    nivel4: {
      resultadoOE: {
        indicadores: [],
        productos: [],
        proceso: null,
      },
      productoOE: {
        proceso: null,
      },
    },
  }

  nuevaActividad.value = { codigo: '', titulo: '', responsable: '' }
  erroresCodigo.value = []
  erroresTitulo.value = []

  if (formActividad.value) {
    formActividad.value.resetValidation()
  }
}

const emit = defineEmits(['crear-actividad'])
</script>

<style scoped>
.h-100 {
  height: 100%;
}
.section-title {
  background: linear-gradient(45deg, #1976d2, #0d47a1);
  color: white;
}
.tree-view {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  line-height: 1.6;
  background-color: #fafafa;
  padding: 16px;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
}
.tree-view.compact {
  font-size: 0.85rem;
  padding: 12px;
}
.tree-node {
  padding: 2px 0;
  white-space: pre;
}
.level-indicator {
  background-color: rgba(0, 0, 0, 0.02);
  border-left: 3px solid #1976d2;
  padding-left: 8px;
  margin: 4px 0;
}
.level-label {
  background-color: #1976d2;
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.7rem;
  font-weight: bold;
  margin-right: 8px;
}
.level-header {
  background-color: #e3f2fd;
  padding: 6px 12px;
  border-radius: 4px;
  border-left: 4px solid #1976d2;
  font-weight: 600;
  color: #1565c0;
  margin-bottom: 12px;
}
.activity-form-container {
  border: 2px dashed #1976d2;
  border-radius: 8px;
  padding: 20px;
  background-color: #e3f2fd;
  margin-top: 32px;
}
.activity-form-container .v-card-title {
  color: #1565c0;
  font-weight: 600;
}
.v-card {
  border-radius: 8px;
}
.v-card-title {
  padding: 16px;
}
.v-card-text {
  padding: 20px;
}
.bg-blue-lighten-5 {
  padding-top: 24px;
  padding-bottom: 24px;
}
.text-h6 .v-icon[color='blue'] {
  color: #1976d2 !important;
}
.text-h6 .v-icon[color='green'] {
  color: #4caf50 !important;
}
.mb-3 {
  margin-bottom: 20px !important;
}
.mb-4 {
  margin-bottom: 24px !important;
}
.v-select {
  background-color: white;
}
@media (max-width: 960px) {
  .tree-view {
    font-size: 0.8rem;
    overflow-x: auto;
  }
  .activity-form-container {
    padding: 16px;
  }
  .level-header {
    font-size: 0.8rem;
  }
}
</style>
