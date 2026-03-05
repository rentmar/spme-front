<template>
  <div class="informacion-cuantitativa">
    <!-- Encabezado con toggle principal -->
    <div class="header-section">
      <div class="d-flex align-center justify-space-between w-100 mb-4">
        <div class="d-flex align-center">
          <v-switch
            v-model="seccionHabilitada"
            density="compact"
            color="primary"
            hide-details
            class="mt-0 mr-3"
          >
            <template v-slot:label>
              <h3 class="text-h6 mb-0">
                <v-icon icon="mdi-chart-bar" class="mr-2"></v-icon>
                Información Cuantitativa
              </h3>
            </template>
          </v-switch>
        </div>

        <v-chip :color="seccionHabilitada ? 'primary' : 'grey'" variant="outlined" class="ml-2">
          <v-icon
            :icon="seccionHabilitada ? 'mdi-check-circle' : 'mdi-close-circle'"
            size="small"
            class="mr-1"
          ></v-icon>
          {{ seccionHabilitada ? 'Activado' : 'Desactivado' }}
        </v-chip>
      </div>

      <!-- Mensaje de estado -->
      <v-alert :type="seccionHabilitada ? 'info' : 'warning'" density="compact" class="mb-4">
        <v-icon :icon="seccionHabilitada ? 'mdi-information' : 'mdi-alert'" class="mr-2"></v-icon>
        {{
          seccionHabilitada
            ? 'Complete la información cuantitativa según sea necesario'
            : 'Esta sección está desactivada. No se incluirá en el registro.'
        }}
      </v-alert>
    </div>

    <!-- Contenido de la sección (solo visible si está habilitada) -->
    <v-slide-y-transition>
      <div v-if="seccionHabilitada">
        <!-- Cabecera con botón de registrar -->
        <div class="sub-header-section mb-6">
          <div class="d-flex align-center justify-space-between">
            <div>
              <h4 class="text-subtitle-1 mb-1">Datos de Participantes</h4>
              <div class="text-caption text-medium-emphasis">
                Complete los datos según sus necesidades
              </div>
            </div>

            <v-btn
              color="primary"
              @click="registrarInformacion"
              :loading="registrando"
              class="registrar-btn"
              :disabled="!puedeRegistrar"
            >
              <v-icon icon="mdi-content-save" class="mr-2"></v-icon>
              {{ registrando ? 'Registrando...' : 'Registrar' }}
            </v-btn>
          </div>
        </div>

        <!-- Número de Participantes (Obligatorio si se activa la sección) -->
        <div class="mb-6">
          <div class="d-flex align-center justify-space-between mb-2">
            <h4 class="text-subtitle-1">
              <v-icon icon="mdi-account-multiple" class="mr-2"></v-icon>
              Total de Participantes *
            </h4>
            <v-chip color="primary" variant="outlined" size="small"> Requerido </v-chip>
          </div>

          <v-text-field
            v-model="totalParticipantes"
            label="Total de Participantes"
            type="number"
            min="0"
            variant="outlined"
            required
            :rules="[
              (v) => !!v || 'Campo requerido',
              (v) => v >= 0 || 'Debe ser mayor o igual a 0',
            ]"
            @update:model-value="actualizarTotales"
          ></v-text-field>
        </div>

        <!-- Sección de Género -->
        <div class="mb-6 seccion-con-toggle">
          <div class="seccion-header">
            <div class="d-flex align-center justify-space-between">
              <h4 class="text-subtitle-1 mb-1">
                <v-icon icon="mdi-gender-male-female" class="mr-2"></v-icon>
                Identidad de Género
              </h4>
              <v-switch
                v-model="habilitadoGenero"
                density="compact"
                color="primary"
                hide-details
                class="mt-0"
              >
                <template v-slot:label>
                  <span
                    class="text-caption"
                    :class="habilitadoGenero ? 'text-primary' : 'text-grey'"
                  >
                    {{ habilitadoGenero ? 'Registrar' : 'Omitir' }}
                  </span>
                </template>
              </v-switch>
            </div>
            <div v-if="habilitadoGenero" class="text-caption text-medium-emphasis mb-3">
              <v-icon icon="mdi-information" size="small" class="mr-1"></v-icon>
              Complete los datos de género de los participantes
            </div>
            <div v-else class="text-caption text-grey mb-3">
              <v-icon icon="mdi-skip-next" size="small" class="mr-1"></v-icon>
              Esta subsección no se incluirá
            </div>
          </div>

          <v-slide-y-transition>
            <div v-if="habilitadoGenero">
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="varones"
                    label="Hombres"
                    type="number"
                    min="0"
                    variant="outlined"
                    @update:model-value="actualizarTotales"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="mujeres"
                    label="Mujeres"
                    type="number"
                    min="0"
                    variant="outlined"
                    @update:model-value="actualizarTotales"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="otro"
                    label="Otro"
                    type="number"
                    min="0"
                    variant="outlined"
                    @update:model-value="actualizarTotales"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="pnd"
                    label="PND"
                    type="number"
                    min="0"
                    variant="outlined"
                    @update:model-value="actualizarTotales"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-alert
                v-if="errorGenero && habilitadoGenero"
                type="error"
                density="compact"
                class="mt-1"
              >
                <v-icon icon="mdi-alert-circle" class="mr-1"></v-icon>
                La suma de género ({{ sumaGenero }}) no coincide con el total de participantes ({{
                  totalParticipantes
                }})
              </v-alert>
            </div>
          </v-slide-y-transition>
        </div>

        <!-- Sección de Edades -->
        <div class="mb-6 seccion-con-toggle">
          <div class="seccion-header">
            <div class="d-flex align-center justify-space-between">
              <h4 class="text-subtitle-1 mb-1">
                <v-icon icon="mdi-account-group" class="mr-2"></v-icon>
                Participantes por Edades
              </h4>
              <v-switch
                v-model="habilitadoEdades"
                density="compact"
                color="primary"
                hide-details
                class="mt-0"
              >
                <template v-slot:label>
                  <span
                    class="text-caption"
                    :class="habilitadoEdades ? 'text-primary' : 'text-grey'"
                  >
                    {{ habilitadoEdades ? 'Registrar' : 'Omitir' }}
                  </span>
                </template>
              </v-switch>
            </div>
            <div v-if="habilitadoEdades" class="text-caption text-medium-emphasis mb-3">
              <v-icon icon="mdi-information" size="small" class="mr-1"></v-icon>
              Distribuya los participantes por grupos de edad
            </div>
            <div v-else class="text-caption text-grey mb-3">
              <v-icon icon="mdi-skip-next" size="small" class="mr-1"></v-icon>
              Esta subsección no se incluirá
            </div>
          </div>

          <v-slide-y-transition>
            <div v-if="habilitadoEdades">
              <v-row>
                <v-col v-for="(grupo, index) in gruposEdad" :key="index" cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="grupoEdadValues[grupo.key]"
                    :label="grupo.label"
                    type="number"
                    min="0"
                    variant="outlined"
                    @update:model-value="actualizarTotales"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-alert
                v-if="errorEdades && habilitadoEdades"
                type="error"
                density="compact"
                class="mt-1"
              >
                <v-icon icon="mdi-alert-circle" class="mr-1"></v-icon>
                La suma de edades ({{ sumaEdades }}) no coincide con el total de participantes ({{
                  totalParticipantes
                }})
              </v-alert>
            </div>
          </v-slide-y-transition>
        </div>

        <!-- Sección de Discapacidad -->
        <div class="mb-6 seccion-con-toggle">
          <div class="seccion-header">
            <div class="d-flex align-center justify-space-between">
              <h4 class="text-subtitle-1 mb-1">
                <v-icon icon="mdi-wheelchair-accessibility" class="mr-2"></v-icon>
                Personas con Discapacidad
              </h4>
              <v-switch
                v-model="habilitadoDiscapacidad"
                density="compact"
                color="primary"
                hide-details
                class="mt-0"
              >
                <template v-slot:label>
                  <span
                    class="text-caption"
                    :class="habilitadoDiscapacidad ? 'text-primary' : 'text-grey'"
                  >
                    {{ habilitadoDiscapacidad ? 'Registrar' : 'Omitir' }}
                  </span>
                </template>
              </v-switch>
            </div>
            <div v-if="habilitadoDiscapacidad" class="text-caption text-medium-emphasis mb-3">
              <v-icon icon="mdi-information" size="small" class="mr-1"></v-icon>
              Registre la participación de personas con discapacidad
            </div>
            <div v-else class="text-caption text-grey mb-3">
              <v-icon icon="mdi-skip-next" size="small" class="mr-1"></v-icon>
              Esta subsección no se incluirá
            </div>
          </div>

          <v-slide-y-transition>
            <div v-if="habilitadoDiscapacidad">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="totalConDiscapacidad"
                    label="Total de personas con discapacidad"
                    type="number"
                    min="0"
                    :max="maxDiscapacidad"
                    variant="outlined"
                    :error="errorTotalDiscapacidad"
                    :error-messages="errorTotalDiscapacidad ? [`Máximo: ${maxDiscapacidad}`] : []"
                    @update:model-value="validarDiscapacidad"
                  ></v-text-field>
                </v-col>
              </v-row>

              <!-- Tipos de discapacidad -->
              <div class="mb-4">
                <v-card variant="outlined" class="pa-4">
                  <v-card-title class="text-subtitle-2 font-weight-medium pb-2">
                    Distribución por tipo de discapacidad
                  </v-card-title>

                  <v-row
                    v-for="(discapacidad, index) in tiposDiscapacidad"
                    :key="index"
                    class="mb-3"
                  >
                    <v-col cols="12" sm="6" md="5">
                      <v-text-field
                        v-model="discapacidad.tipo"
                        :label="`Tipo de discapacidad ${index + 1}`"
                        variant="outlined"
                        density="compact"
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4" md="3">
                      <v-text-field
                        v-model="discapacidad.cantidad"
                        label="Cantidad"
                        type="number"
                        min="0"
                        :max="maxDiscapacidadIndividual(index)"
                        variant="outlined"
                        density="compact"
                        :error="errorCantidadDiscapacidad(index)"
                        @update:model-value="validarDiscapacidadIndividual(index)"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="1" md="1" class="d-flex align-center">
                      <v-btn
                        v-if="tiposDiscapacidad.length > 1"
                        icon
                        size="small"
                        variant="text"
                        color="error"
                        @click="eliminarDiscapacidad(index)"
                      >
                        <v-icon icon="mdi-delete"></v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>

                  <v-btn
                    color="primary"
                    variant="outlined"
                    @click="agregarDiscapacidad"
                    size="small"
                    block
                    class="mt-2"
                  >
                    <v-icon icon="mdi-plus" class="mr-1"></v-icon>
                    Agregar tipo de discapacidad
                  </v-btn>
                </v-card>
              </div>

              <!-- Necesidades de accesibilidad -->
              <div class="mb-3">
                <v-textarea
                  v-model="necesidadesAccesibilidad"
                  label="Necesidades de accesibilidad identificadas"
                  variant="outlined"
                  rows="2"
                  placeholder="Ej: Intérprete de lengua de señas, materiales en braille, rampas de acceso, etc."
                ></v-textarea>
              </div>

              <v-alert
                v-if="errorDiscapacidad && habilitadoDiscapacidad"
                type="error"
                density="compact"
                class="mt-2"
              >
                <v-icon icon="mdi-alert-circle" class="mr-1"></v-icon>
                La suma por tipo de discapacidad ({{ sumaDiscapacidades }}) no coincide con el total
                registrado ({{ totalConDiscapacidad }})
              </v-alert>
            </div>
          </v-slide-y-transition>
        </div>

        <!-- Sección de Ocupaciones -->
        <div class="mb-6 seccion-con-toggle">
          <div class="seccion-header">
            <div class="d-flex align-center justify-space-between">
              <h4 class="text-subtitle-1 mb-1">
                <v-icon icon="mdi-briefcase" class="mr-2"></v-icon>
                Ocupación
              </h4>
              <v-switch
                v-model="habilitadoOcupaciones"
                density="compact"
                color="primary"
                hide-details
                class="mt-0"
              >
                <template v-slot:label>
                  <span
                    class="text-caption"
                    :class="habilitadoOcupaciones ? 'text-primary' : 'text-grey'"
                  >
                    {{ habilitadoOcupaciones ? 'Registrar' : 'Omitir' }}
                  </span>
                </template>
              </v-switch>
            </div>
            <div v-if="habilitadoOcupaciones" class="text-caption text-medium-emphasis mb-3">
              <v-icon icon="mdi-information" size="small" class="mr-1"></v-icon>
              Registre las ocupaciones de los participantes
            </div>
            <div v-else class="text-caption text-grey mb-3">
              <v-icon icon="mdi-skip-next" size="small" class="mr-1"></v-icon>
              Esta subsección no se incluirá
            </div>
          </div>

          <v-slide-y-transition>
            <div v-if="habilitadoOcupaciones">
              <div v-for="(ocupacion, index) in ocupaciones" :key="index" class="mb-3">
                <v-row>
                  <v-col cols="12" sm="8">
                    <v-text-field
                      v-model="ocupacion.nombre"
                      :label="`Ocupación ${index + 1}`"
                      variant="outlined"
                      placeholder="Ej: Estudiantes, Trabajadores, etc."
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="3">
                    <v-text-field
                      v-model="ocupacion.cantidad"
                      label="Cantidad"
                      type="number"
                      min="0"
                      variant="outlined"
                      @update:model-value="actualizarTotales"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="1" class="d-flex align-center">
                    <v-btn
                      v-if="ocupaciones.length > 1"
                      variant="text"
                      color="error"
                      size="small"
                      @click="eliminarOcupacion(index)"
                    >
                      <v-icon icon="mdi-delete"></v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </div>
              <v-btn color="primary" variant="outlined" @click="agregarOcupacion" size="small">
                <v-icon icon="mdi-plus" class="mr-1"></v-icon>
                Agregar Ocupación
              </v-btn>
              <v-alert
                v-if="errorOcupaciones && habilitadoOcupaciones"
                type="error"
                density="compact"
                class="mt-2"
              >
                <v-icon icon="mdi-alert-circle" class="mr-1"></v-icon>
                La suma de ocupaciones ({{ sumaOcupaciones }}) no coincide con el total de
                participantes ({{ totalParticipantes }})
              </v-alert>
            </div>
          </v-slide-y-transition>
        </div>

        <!-- Sección de Localidades -->
        <div class="mb-6 seccion-con-toggle">
          <div class="seccion-header">
            <div class="d-flex align-center justify-space-between">
              <h4 class="text-subtitle-1 mb-1">
                <v-icon icon="mdi-map-marker" class="mr-2"></v-icon>
                Localidades
              </h4>
              <v-switch
                v-model="habilitadoLocalidades"
                density="compact"
                color="primary"
                hide-details
                class="mt-0"
              >
                <template v-slot:label>
                  <span
                    class="text-caption"
                    :class="habilitadoLocalidades ? 'text-primary' : 'text-grey'"
                  >
                    {{ habilitadoLocalidades ? 'Registrar' : 'Omitir' }}
                  </span>
                </template>
              </v-switch>
            </div>
            <div v-if="habilitadoLocalidades" class="text-caption text-medium-emphasis mb-3">
              <v-icon icon="mdi-information" size="small" class="mr-1"></v-icon>
              Registre la procedencia de los participantes
            </div>
            <div v-else class="text-caption text-grey mb-3">
              <v-icon icon="mdi-skip-next" size="small" class="mr-1"></v-icon>
              Esta subsección no se incluirá
            </div>
          </div>

          <v-slide-y-transition>
            <div v-if="habilitadoLocalidades">
              <div class="mb-2">
                <v-alert
                  v-if="errorLocalidades && habilitadoLocalidades"
                  type="error"
                  density="compact"
                >
                  <v-icon icon="mdi-alert-circle" class="mr-1"></v-icon>
                  La suma por localidad ({{ sumaLocalidades }}) no coincide con el total de
                  participantes ({{ totalParticipantes }})
                </v-alert>
              </div>
              <div
                v-for="(localidad, index) in localidades"
                :key="index"
                class="mb-4 pa-3"
                style="border: 1px solid #e0e0e0; border-radius: 8px"
              >
                <v-row>
                  <v-col cols="12" sm="3">
                    <v-text-field
                      v-model="localidad.departamento"
                      :label="`Departamento ${index + 1}`"
                      variant="outlined"
                      placeholder="Nombre del departamento"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="3">
                    <v-text-field
                      v-model="localidad.municipio"
                      :label="`Municipio ${index + 1}`"
                      variant="outlined"
                      placeholder="Nombre del municipio"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="3">
                    <v-text-field
                      v-model="localidad.localidad"
                      :label="`Localidad ${index + 1}`"
                      variant="outlined"
                      placeholder="Nombre de la localidad"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="2">
                    <v-text-field
                      v-model="localidad.cantidad"
                      :label="`Cantidad ${index + 1}`"
                      type="number"
                      min="0"
                      variant="outlined"
                      @update:model-value="actualizarTotales"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="1" class="d-flex align-center">
                    <v-btn
                      v-if="localidades.length > 1"
                      variant="text"
                      color="error"
                      size="small"
                      @click="eliminarLocalidad(index)"
                    >
                      <v-icon icon="mdi-delete"></v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </div>
              <v-btn color="primary" variant="outlined" @click="agregarLocalidad" size="small">
                <v-icon icon="mdi-plus" class="mr-1"></v-icon>
                Agregar Localidad
              </v-btn>
            </div>
          </v-slide-y-transition>
        </div>

        <!-- Sección de Organizaciones -->
        <div class="mb-6 seccion-con-toggle">
          <div class="seccion-header">
            <div class="d-flex align-center justify-space-between">
              <h4 class="text-subtitle-1 mb-1">
                <v-icon icon="mdi-office-building" class="mr-2"></v-icon>
                Organizaciones Participantes
              </h4>
              <v-switch
                v-model="habilitadoOrganizaciones"
                density="compact"
                color="primary"
                hide-details
                class="mt-0"
              >
                <template v-slot:label>
                  <span
                    class="text-caption"
                    :class="habilitadoOrganizaciones ? 'text-primary' : 'text-grey'"
                  >
                    {{ habilitadoOrganizaciones ? 'Registrar' : 'Omitir' }}
                  </span>
                </template>
              </v-switch>
            </div>
            <div v-if="habilitadoOrganizaciones" class="text-caption text-medium-emphasis mb-3">
              <v-icon icon="mdi-information" size="small" class="mr-1"></v-icon>
              Registre las organizaciones participantes
            </div>
            <div v-else class="text-caption text-grey mb-3">
              <v-icon icon="mdi-skip-next" size="small" class="mr-1"></v-icon>
              Esta subsección no se incluirá
            </div>
          </div>

          <v-slide-y-transition>
            <div v-if="habilitadoOrganizaciones">
              <div v-for="(organizacion, index) in organizaciones" :key="index" class="mb-2">
                <v-row>
                  <v-col cols="12" sm="8">
                    <v-text-field
                      v-model="organizaciones[index]"
                      :label="`Organización ${index + 1}`"
                      variant="outlined"
                      placeholder="Nombre de la organización"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="3">
                    <v-text-field
                      v-model="organizacionCantidades[index]"
                      :label="`Cantidad ${index + 1}`"
                      type="number"
                      min="0"
                      variant="outlined"
                      @update:model-value="actualizarTotales"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="1" class="d-flex align-center">
                    <v-btn
                      v-if="organizaciones.length > 1"
                      variant="text"
                      color="error"
                      size="small"
                      @click="eliminarOrganizacion(index)"
                    >
                      <v-icon icon="mdi-delete"></v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </div>
              <v-btn color="primary" variant="outlined" @click="agregarOrganizacion" size="small">
                <v-icon icon="mdi-plus" class="mr-1"></v-icon>
                Agregar Organización
              </v-btn>
              <v-alert
                v-if="errorOrganizaciones && habilitadoOrganizaciones"
                type="error"
                density="compact"
                class="mt-2"
              >
                <v-icon icon="mdi-alert-circle" class="mr-1"></v-icon>
                La suma por organización ({{ sumaOrganizaciones }}) no coincide con el total de
                participantes ({{ totalParticipantes }})
              </v-alert>
            </div>
          </v-slide-y-transition>
        </div>

        <!-- Sección de Archivos -->
        <div class="mb-4 seccion-con-toggle">
          <div class="seccion-header">
            <div class="d-flex align-center justify-space-between">
              <h4 class="text-subtitle-1 mb-1">
                <v-icon icon="mdi-paperclip" class="mr-2"></v-icon>
                Documentos Adjuntos
              </h4>
              <v-switch
                v-model="habilitadoArchivos"
                density="compact"
                color="primary"
                hide-details
                class="mt-0"
              >
                <template v-slot:label>
                  <span
                    class="text-caption"
                    :class="habilitadoArchivos ? 'text-primary' : 'text-grey'"
                  >
                    {{ habilitadoArchivos ? 'Adjuntar' : 'Omitir' }}
                  </span>
                </template>
              </v-switch>
            </div>
            <div v-if="habilitadoArchivos" class="text-caption text-medium-emphasis mb-3">
              <v-icon icon="mdi-information" size="small" class="mr-1"></v-icon>
              Adjunte documentos relacionados con la actividad
            </div>
            <div v-else class="text-caption text-grey mb-3">
              <v-icon icon="mdi-skip-next" size="small" class="mr-1"></v-icon>
              Esta subsección no se incluirá
            </div>
          </div>

          <v-slide-y-transition>
            <div v-if="habilitadoArchivos">
              <!-- Input principal para agregar archivos -->
              <div class="mb-4">
                <v-file-input
                  v-model="nuevoArchivo"
                  label="Agregar archivos"
                  variant="outlined"
                  multiple
                  chips
                  clearable
                  counter
                  :show-size="1000"
                  accept="*/*"
                  :hint="`Seleccione uno o más archivos`"
                  persistent-hint
                  @update:model-value="agregarArchivos"
                ></v-file-input>
              </div>

              <!-- Lista de archivos existentes -->
              <div v-if="archivos.length > 0" class="mt-3">
                <v-card variant="outlined">
                  <v-card-title class="text-subtitle-1 bg-grey-lighten-4">
                    <v-icon icon="mdi-file-document-multiple" class="mr-2"></v-icon>
                    Archivos adjuntos ({{ archivos.length }})
                  </v-card-title>
                  <v-card-text>
                    <v-list density="compact">
                      <v-list-item v-for="(archivo, index) in archivos" :key="index" class="mb-2">
                        <template v-slot:prepend>
                          <v-avatar color="primary" size="40" class="mr-3">
                            <v-icon icon="mdi-file" color="white"></v-icon>
                          </v-avatar>
                        </template>

                        <v-list-item-title class="font-weight-medium">
                          {{ archivo.name }}
                        </v-list-item-title>
                        <v-list-item-subtitle class="text-caption">
                          <v-icon icon="mdi-weight" size="small" class="mr-1"></v-icon>
                          {{ formatFileSize(archivo.size) }}
                        </v-list-item-subtitle>

                        <template v-slot:append>
                          <v-btn
                            icon
                            size="small"
                            variant="text"
                            color="error"
                            @click="eliminarArchivo(index)"
                          >
                            <v-icon icon="mdi-trash-can"></v-icon>
                          </v-btn>
                        </template>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>
              </div>
            </div>
          </v-slide-y-transition>
        </div>

        <!-- Alertas de validación -->
        <v-alert v-if="tieneErroresValidacion" type="error" density="compact" class="mt-4">
          <v-icon icon="mdi-alert-circle" class="mr-2"></v-icon>
          Hay errores en las subsecciones activadas que deben corregirse antes de registrar.
        </v-alert>

        <!-- Resumen de subsecciones activas -->
        <div class="mt-6">
          <v-card variant="outlined">
            <v-card-title class="text-subtitle-1 bg-grey-lighten-4">
              <v-icon icon="mdi-clipboard-list" class="mr-2"></v-icon>
              Resumen de Subsecciones Activadas
            </v-card-title>
            <v-card-text>
              <v-list density="compact">
                <v-list-item
                  v-for="(seccion, index) in subseccionesResumen"
                  :key="index"
                  class="mb-1"
                >
                  <template v-slot:prepend>
                    <v-avatar
                      :color="seccion.habilitada ? 'primary' : 'grey-lighten-3'"
                      size="32"
                      class="mr-3"
                    >
                      <v-icon :color="seccion.habilitada ? 'white' : 'grey'" size="small">
                        {{ seccion.habilitada ? 'mdi-check-circle' : 'mdi-close-circle' }}
                      </v-icon>
                    </v-avatar>
                  </template>

                  <v-list-item-title class="font-weight-medium">
                    {{ seccion.nombre }}
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-caption">
                    <v-icon
                      :icon="seccion.habilitada ? 'mdi-check' : 'mdi-close'"
                      size="small"
                      class="mr-1"
                      :color="seccion.habilitada ? 'success' : 'grey'"
                    ></v-icon>
                    {{ seccion.habilitada ? 'Incluida' : 'Excluida' }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </div>
      </div>
    </v-slide-y-transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'

// ============================
// DEFINICIÓN DEL EVENTO PARA REGISTRAR EN EL PADRE
// ============================
const emit = defineEmits(['registrar-informacion', 'estado-habilitacion'])

// ============================
// VARIABLE PRINCIPAL DE HABILITACIÓN (SECCIÓN COMPLETA)
// ============================
const seccionHabilitada = ref(false)

// ============================
// VARIABLES DE HABILITACIÓN POR SUBSECCIÓN
// ============================
const habilitadoGenero = ref(false)
const habilitadoEdades = ref(false)
const habilitadoDiscapacidad = ref(false)
const habilitadoOcupaciones = ref(false)
const habilitadoLocalidades = ref(false)
const habilitadoOrganizaciones = ref(false)
const habilitadoArchivos = ref(false)

// ============================
// VARIABLES DE ESTADO
// ============================
const registrando = ref(false)

// ============================
// DATOS REACTIVOS (ESTRUCTURA ORIGINAL)
// ============================
const totalParticipantes = ref(0)
const varones = ref(0)
const mujeres = ref(0)
const otro = ref(0)
const pnd = ref(0)
const archivos = ref([])
const nuevoArchivo = ref([])

// Datos para discapacidad
const totalConDiscapacidad = ref(0)
const necesidadesAccesibilidad = ref('')
const tiposDiscapacidad = ref([
  { tipo: 'Discapacidad Visual', cantidad: 0 },
  { tipo: 'Discapacidad Auditiva', cantidad: 0 },
  { tipo: 'Discapacidad Fisica', cantidad: 0 },
  { tipo: 'Discapacidad Psiquico/mental', cantidad: 0 },
  { tipo: 'Discapacidad Intelectual', cantidad: 0 },
  { tipo: 'Discapacidad Multiple', cantidad: 0 },
])

// Grupos de edad
const gruposEdad = [
  { key: 'edad_0_11', label: '0-11 años' },
  { key: 'edad_12_17', label: '12-17 años' },
  { key: 'edad_18_29', label: '18-29 años' },
  { key: 'edad_30_59', label: '30-59 años' },
  { key: 'edad_60_adelante', label: '60 años en adelante' },
]

// Valores de grupos de edad
const grupoEdadValues = reactive({
  edad_0_11: 0,
  edad_12_17: 0,
  edad_18_29: 0,
  edad_30_59: 0,
  edad_60_adelante: 0,
})

// Ocupaciones
const ocupaciones = ref([{ nombre: '', cantidad: 0 }])

// Localidades
const localidades = ref([
  {
    departamento: '',
    municipio: '',
    localidad: '',
    cantidad: 0,
  },
])

// Organizaciones
const organizaciones = ref([''])
const organizacionCantidades = ref([0])

// ============================
// COMPUTED PROPERTIES
// ============================
const sumaGenero = computed(() => {
  if (!habilitadoGenero.value) return 0
  return (
    parseInt(varones.value || 0) +
    parseInt(mujeres.value || 0) +
    parseInt(otro.value || 0) +
    parseInt(pnd.value || 0)
  )
})

const sumaEdades = computed(() => {
  if (!habilitadoEdades.value) return 0
  return Object.values(grupoEdadValues).reduce((sum, value) => {
    return sum + parseInt(value || 0)
  }, 0)
})

const sumaDiscapacidades = computed(() => {
  if (!habilitadoDiscapacidad.value) return 0
  return tiposDiscapacidad.value.reduce((sum, discapacidad) => {
    return sum + parseInt(discapacidad.cantidad || 0)
  }, 0)
})

const sumaOcupaciones = computed(() => {
  if (!habilitadoOcupaciones.value) return 0
  return ocupaciones.value.reduce((sum, ocupacion) => {
    return sum + parseInt(ocupacion.cantidad || 0)
  }, 0)
})

const sumaLocalidades = computed(() => {
  if (!habilitadoLocalidades.value) return 0
  return localidades.value.reduce((sum, localidad) => {
    return sum + parseInt(localidad.cantidad || 0)
  }, 0)
})

const sumaOrganizaciones = computed(() => {
  if (!habilitadoOrganizaciones.value) return 0
  return organizacionCantidades.value.reduce((sum, cantidad) => {
    return sum + parseInt(cantidad || 0)
  }, 0)
})

// Validaciones de consistencia
const errorGenero = computed(() => {
  if (!habilitadoGenero.value) return false
  return sumaGenero.value !== parseInt(totalParticipantes.value || 0)
})

const errorEdades = computed(() => {
  if (!habilitadoEdades.value) return false
  return sumaEdades.value !== parseInt(totalParticipantes.value || 0)
})

const errorDiscapacidad = computed(() => {
  if (!habilitadoDiscapacidad.value) return false
  return sumaDiscapacidades.value !== parseInt(totalConDiscapacidad.value || 0)
})

const errorOcupaciones = computed(() => {
  if (!habilitadoOcupaciones.value) return false
  return sumaOcupaciones.value !== parseInt(totalParticipantes.value || 0)
})

const errorLocalidades = computed(() => {
  if (!habilitadoLocalidades.value) return false
  return sumaLocalidades.value !== parseInt(totalParticipantes.value || 0)
})

const errorOrganizaciones = computed(() => {
  if (!habilitadoOrganizaciones.value) return false
  return sumaOrganizaciones.value !== parseInt(totalParticipantes.value || 0)
})

// Validaciones para discapacidad
const maxDiscapacidad = computed(() => {
  return parseInt(totalParticipantes.value || 0)
})

const errorTotalDiscapacidad = computed(() => {
  if (!habilitadoDiscapacidad.value) return false
  return parseInt(totalConDiscapacidad.value || 0) > parseInt(totalParticipantes.value || 0)
})

const maxDiscapacidadIndividual = (index) => {
  const totalDiscapacidad = parseInt(totalConDiscapacidad.value || 0)
  const sumaRestante = tiposDiscapacidad.value.reduce((sum, disc, i) => {
    if (i !== index) {
      return sum + parseInt(disc.cantidad || 0)
    }
    return sum
  }, 0)

  return Math.max(0, totalDiscapacidad - sumaRestante)
}

const errorCantidadDiscapacidad = (index) => {
  if (!habilitadoDiscapacidad.value) return false
  const cantidad = parseInt(tiposDiscapacidad.value[index]?.cantidad || 0)
  const maxPermitido = maxDiscapacidadIndividual(index)
  return cantidad > maxPermitido
}

// Resumen de subsecciones
const subseccionesResumen = computed(() => {
  return [
    { nombre: 'Identidad de Género', habilitada: habilitadoGenero.value },
    { nombre: 'Participantes por Edades', habilitada: habilitadoEdades.value },
    { nombre: 'Personas con Discapacidad', habilitada: habilitadoDiscapacidad.value },
    { nombre: 'Ocupación', habilitada: habilitadoOcupaciones.value },
    { nombre: 'Localidades', habilitada: habilitadoLocalidades.value },
    { nombre: 'Organizaciones Participantes', habilitada: habilitadoOrganizaciones.value },
    { nombre: 'Documentos Adjuntos', habilitada: habilitadoArchivos.value },
  ]
})

const tieneSubseccionesActivas = computed(() => {
  return [
    habilitadoGenero.value,
    habilitadoEdades.value,
    habilitadoDiscapacidad.value,
    habilitadoOcupaciones.value,
    habilitadoLocalidades.value,
    habilitadoOrganizaciones.value,
    habilitadoArchivos.value,
  ].some(Boolean)
})

// Validación general (solo aplica si la sección está habilitada)
const tieneErroresValidacion = computed(() => {
  if (!seccionHabilitada.value) return false

  const errores = []

  if (habilitadoGenero.value && errorGenero.value) errores.push('genero')
  if (habilitadoEdades.value && errorEdades.value) errores.push('edades')
  if (habilitadoDiscapacidad.value && (errorDiscapacidad.value || errorTotalDiscapacidad.value))
    errores.push('discapacidad')
  if (habilitadoOcupaciones.value && errorOcupaciones.value) errores.push('ocupaciones')
  if (habilitadoLocalidades.value && errorLocalidades.value) errores.push('localidades')
  if (habilitadoOrganizaciones.value && errorOrganizaciones.value) errores.push('organizaciones')

  return errores.length > 0
})

// Computed para organizaciones con datos combinados
const organizacionesConCantidad = computed(() => {
  if (!habilitadoOrganizaciones.value) return []
  return organizaciones.value
    .map((nombre, index) => ({
      nombre: nombre,
      cantidad: parseInt(organizacionCantidades.value[index] || 0),
    }))
    .filter((org) => org.nombre || org.cantidad > 0)
})

// Validador principal que habilita/deshabilita el registro
const puedeRegistrar = computed(() => {
  // 1. La sección debe estar habilitada
  if (!seccionHabilitada.value) return false

  // 2. Total de participantes es obligatorio y válido
  const totalValido = parseInt(totalParticipantes.value || 0) > 0
  if (!totalValido) return false

  // 3. Si hay subsecciones activas, no deben tener errores
  if (tieneSubseccionesActivas.value && tieneErroresValidacion.value) {
    return false
  }

  return true
})

// ============================
// MÉTODO PARA REGISTRAR INFORMACIÓN
// ============================
const registrarInformacion = async () => {
  if (!puedeRegistrar.value) return

  registrando.value = true

  try {
    // Si la sección NO está habilitada, enviar null
    if (!seccionHabilitada.value) {
      emit('registrar-informacion', null)
      return
    }

    // Preparar los datos para registrar (RESPETANDO LA ESTRUCTURA JSON ORIGINAL)
    const datosParaRegistrar = {
      // Metadatos (original)
      timestamp: new Date().toISOString(),
      estado: 'registrado',
      seccionHabilitada: seccionHabilitada.value,

      // Datos principales (original)
      totalParticipantes: parseInt(totalParticipantes.value) || 0,

      // Género (original - solo si está habilitado)
      genero: habilitadoGenero.value
        ? {
            varones: parseInt(varones.value) || 0,
            mujeres: parseInt(mujeres.value) || 0,
            otro: parseInt(otro.value) || 0,
            pnd: parseInt(pnd.value) || 0,
            suma: sumaGenero.value,
            error: errorGenero.value,
            completado: Boolean(varones.value || mujeres.value || otro.value || pnd.value),
            habilitado: true,
          }
        : null,

      // Edades (original - solo si está habilitado)
      edades: habilitadoEdades.value
        ? {
            ...grupoEdadValues,
            suma: sumaEdades.value,
            error: errorEdades.value,
            completado: Object.values(grupoEdadValues).some((val) => val > 0),
            habilitado: true,
          }
        : null,

      // Discapacidad (original - solo si está habilitado)
      discapacidad: habilitadoDiscapacidad.value
        ? {
            total: parseInt(totalConDiscapacidad.value) || 0,
            tipos: tiposDiscapacidad.value.map((d) => ({
              tipo: d.tipo,
              cantidad: parseInt(d.cantidad) || 0,
            })),
            necesidades: necesidadesAccesibilidad.value,
            suma: sumaDiscapacidades.value,
            error: errorDiscapacidad.value || errorTotalDiscapacidad.value,
            completado: Boolean(totalConDiscapacidad.value || necesidadesAccesibilidad.value),
            habilitado: true,
          }
        : null,

      // Ocupaciones (original - solo si está habilitado)
      ocupaciones: habilitadoOcupaciones.value
        ? {
            datos: ocupaciones.value.map((o) => ({
              nombre: o.nombre,
              cantidad: parseInt(o.cantidad) || 0,
            })),
            suma: sumaOcupaciones.value,
            error: errorOcupaciones.value,
            completado: ocupaciones.value.some((o) => o.nombre || o.cantidad > 0),
            habilitado: true,
          }
        : null,

      // Localidades (original - solo si está habilitado)
      localidades: habilitadoLocalidades.value
        ? {
            datos: localidades.value.map((l) => ({
              departamento: l.departamento,
              municipio: l.municipio,
              localidad: l.localidad,
              cantidad: parseInt(l.cantidad) || 0,
            })),
            suma: sumaLocalidades.value,
            error: errorLocalidades.value,
            completado: localidades.value.some(
              (l) => l.departamento || l.municipio || l.localidad || l.cantidad > 0,
            ),
            habilitado: true,
          }
        : null,

      // Organizaciones (original - solo si está habilitado)
      organizaciones: habilitadoOrganizaciones.value
        ? {
            datos: organizacionesConCantidad.value,
            suma: sumaOrganizaciones.value,
            error: errorOrganizaciones.value,
            completado: organizacionesConCantidad.value.some(
              (org) => org.nombre || org.cantidad > 0,
            ),
            habilitado: true,
          }
        : null,

      // Archivos (original - solo si está habilitado)
      archivos: habilitadoArchivos.value
        ? {
            total: archivos.value.length,
            lista: archivos.value.map((a, index) => ({
              id: index,
              nombre: a.name,
              tamaño: a.size,
              tipo: a.type,
              fechaModificacion: a.lastModified,
            })),
            tamañoTotal: archivos.value.reduce((total, a) => total + (a.size || 0), 0),
          }
        : null,

      // Validaciones (original)
      validaciones: {
        genero: habilitadoGenero.value ? !errorGenero.value : null,
        edades: habilitadoEdades.value ? !errorEdades.value : null,
        discapacidad: habilitadoDiscapacidad.value ? !errorDiscapacidad.value : null,
        ocupaciones: habilitadoOcupaciones.value ? !errorOcupaciones.value : null,
        localidades: habilitadoLocalidades.value ? !errorLocalidades.value : null,
        organizaciones: habilitadoOrganizaciones.value ? !errorOrganizaciones.value : null,
        totalDiscapacidad: habilitadoDiscapacidad.value ? !errorTotalDiscapacidad.value : null,
        totalesCoinciden: calcularTotalesCoinciden(),
        tieneErrores: calcularErroresTotales(),
      },

      // Estadísticas (original)
      estadisticas: {
        sumaTotal: sumaGenero.value,
        archivosTotal: archivos.value.length,
        tamañoTotalArchivos: archivos.value.reduce((total, a) => total + (a.size || 0), 0),
        organizacionesTotal: organizacionesConCantidad.value.length,
        promedioPorOrganizacion: calcularPromedioOrganizaciones(),
        seccionesCompletadas: calcularSeccionesCompletadas(),
        subseccionesActivas: calcularSubseccionesActivas(),
      },
    }

    // Emitir el evento al componente padre
    emit('registrar-informacion', datosParaRegistrar)

    // Simular un pequeño delay para mostrar el estado de carga
    await new Promise((resolve) => setTimeout(resolve, 800))
  } catch (error) {
    console.error('Error al registrar información:', error)
  } finally {
    registrando.value = false
  }
}

// ============================
// FUNCIONES AUXILIARES
// ============================
const calcularTotalesCoinciden = () => {
  if (!seccionHabilitada.value) return null

  const total = parseInt(totalParticipantes.value || 0)
  let coinciden = true

  if (habilitadoGenero.value) coinciden = coinciden && sumaGenero.value === total
  if (habilitadoEdades.value) coinciden = coinciden && sumaEdades.value === total
  if (habilitadoOcupaciones.value) coinciden = coinciden && sumaOcupaciones.value === total
  if (habilitadoLocalidades.value) coinciden = coinciden && sumaLocalidades.value === total
  if (habilitadoOrganizaciones.value) coinciden = coinciden && sumaOrganizaciones.value === total

  return coinciden
}

const calcularErroresTotales = () => {
  if (!seccionHabilitada.value) return false

  let errores = false

  if (habilitadoGenero.value && errorGenero.value) errores = true
  if (habilitadoEdades.value && errorEdades.value) errores = true
  if (habilitadoDiscapacidad.value && (errorDiscapacidad.value || errorTotalDiscapacidad.value))
    errores = true
  if (habilitadoOcupaciones.value && errorOcupaciones.value) errores = true
  if (habilitadoLocalidades.value && errorLocalidades.value) errores = true
  if (habilitadoOrganizaciones.value && errorOrganizaciones.value) errores = true

  return errores
}

const calcularPromedioOrganizaciones = () => {
  if (!seccionHabilitada.value || !habilitadoOrganizaciones.value) return 0
  const orgsConDatos = organizacionesConCantidad.value
  if (orgsConDatos.length === 0) return 0
  return Math.round(sumaOrganizaciones.value / orgsConDatos.length)
}

const calcularSeccionesCompletadas = () => {
  if (!seccionHabilitada.value) return 0

  const secciones = [
    Boolean(totalParticipantes.value > 0),
    habilitadoGenero.value && Boolean(varones.value || mujeres.value || otro.value || pnd.value),
    habilitadoEdades.value && Object.values(grupoEdadValues).some((val) => val > 0),
    habilitadoDiscapacidad.value &&
      Boolean(totalConDiscapacidad.value || necesidadesAccesibilidad.value),
    habilitadoOcupaciones.value && ocupaciones.value.some((o) => o.nombre || o.cantidad > 0),
    habilitadoLocalidades.value &&
      localidades.value.some((l) => l.departamento || l.municipio || l.localidad || l.cantidad > 0),
    habilitadoOrganizaciones.value &&
      organizacionesConCantidad.value.some((org) => org.nombre || org.cantidad > 0),
    habilitadoArchivos.value && archivos.value.length > 0,
  ]

  return secciones.filter(Boolean).length
}

const calcularSubseccionesActivas = () => {
  return [
    habilitadoGenero.value,
    habilitadoEdades.value,
    habilitadoDiscapacidad.value,
    habilitadoOcupaciones.value,
    habilitadoLocalidades.value,
    habilitadoOrganizaciones.value,
    habilitadoArchivos.value,
  ].filter(Boolean).length
}

// ============================
// MÉTODOS AUXILIARES
// ============================
const agregarDiscapacidad = () => {
  tiposDiscapacidad.value.push({ tipo: '', cantidad: 0 })
}

const eliminarDiscapacidad = (index) => {
  if (tiposDiscapacidad.value.length > 1) {
    tiposDiscapacidad.value.splice(index, 1)
  }
}

const validarDiscapacidad = () => {
  // Validación automática
}

const validarDiscapacidadIndividual = (index) => {
  // Validación automática
}

const agregarOcupacion = () => {
  ocupaciones.value.push({ nombre: '', cantidad: 0 })
}

const eliminarOcupacion = (index) => {
  if (ocupaciones.value.length > 1) {
    ocupaciones.value.splice(index, 1)
  }
}

const agregarLocalidad = () => {
  localidades.value.push({
    departamento: '',
    municipio: '',
    localidad: '',
    cantidad: 0,
  })
}

const eliminarLocalidad = (index) => {
  if (localidades.value.length > 1) {
    localidades.value.splice(index, 1)
  }
}

const agregarOrganizacion = () => {
  organizaciones.value.push('')
  organizacionCantidades.value.push(0)
}

const eliminarOrganizacion = (index) => {
  if (organizaciones.value.length > 1) {
    organizaciones.value.splice(index, 1)
    organizacionCantidades.value.splice(index, 1)
  }
}

const agregarArchivos = (nuevosArchivos) => {
  if (nuevosArchivos && nuevosArchivos.length > 0) {
    archivos.value.push(...nuevosArchivos)
    nuevoArchivo.value = []
  }
}

const eliminarArchivo = (index) => {
  archivos.value.splice(index, 1)
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const actualizarTotales = () => {
  // Forzar reactividad
}

// Watch para resetear datos cuando se deshabilita la sección
watch(seccionHabilitada, (nuevoValor) => {
  if (!nuevoValor) {
    // Resetear todos los datos cuando se deshabilita la sección
    totalParticipantes.value = 0
    varones.value = 0
    mujeres.value = 0
    otro.value = 0
    pnd.value = 0
    totalConDiscapacidad.value = 0
    necesidadesAccesibilidad.value = ''
    tiposDiscapacidad.value = [
      { tipo: 'Discapacidad Visual', cantidad: 0 },
      { tipo: 'Discapacidad Auditiva', cantidad: 0 },
      { tipo: 'Discapacidad Fisica', cantidad: 0 },
      { tipo: 'Discapacidad Psiquico/mental', cantidad: 0 },
      { tipo: 'Discapacidad Intelectual', cantidad: 0 },
      { tipo: 'Discapacidad Multiple', cantidad: 0 },
    ]
    Object.keys(grupoEdadValues).forEach((key) => {
      grupoEdadValues[key] = 0
    })
    ocupaciones.value = [{ nombre: '', cantidad: 0 }]
    localidades.value = [
      {
        departamento: '',
        municipio: '',
        localidad: '',
        cantidad: 0,
      },
    ]
    organizaciones.value = ['']
    organizacionCantidades.value = [0]
    archivos.value = []
    nuevoArchivo.value = []

    // Deshabilitar todas las subsecciones
    habilitadoGenero.value = false
    habilitadoEdades.value = false
    habilitadoDiscapacidad.value = false
    habilitadoOcupaciones.value = false
    habilitadoLocalidades.value = false
    habilitadoOrganizaciones.value = false
    habilitadoArchivos.value = false
  }
})

/************************************ FUNCIONES PARA LA VALIDACION *******************************/
const emitirEstadoHabilitacion = () => {
  emit('estado-habilitacion', {
    seccionHabilitada: seccionHabilitada.value,
    totalParticipantes: parseInt(totalParticipantes.value) || 0,
  })
}

//Watcher para emitir estado estado
watch(
  seccionHabilitada,
  (nuevoValor) => {
    console.log('🔄 Sección cambió a:', nuevoValor ? 'ACTIVADA' : 'DESACTIVADA')
    emitirEstadoHabilitacion()
  },
  { immediate: true },
)

//Emitir cambios totalParticipantes
watch(totalParticipantes, (nuevoTotal) => {
  console.log('🔄 Total participantes cambió a:', nuevoTotal)
  emitirEstadoHabilitacion()
})
</script>

<style scoped>
.informacion-cuantitativa {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  background-color: #fafafa;
}

.header-section {
  margin-bottom: 16px;
}

.sub-header-section {
  padding-bottom: 16px;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 24px;
}

.registrar-btn {
  min-width: 140px;
}

.seccion-con-toggle {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  background-color: #ffffff;
  transition: all 0.3s ease;
}

.seccion-con-toggle:not(:has(.seccion-header .v-switch[aria-checked='true'])) {
  background-color: #fafafa;
  border-color: #e0e0e0;
}

.seccion-header {
  margin-bottom: 16px;
}

.seccion-header h4 {
  color: #333;
}

.w-100 {
  width: 100%;
}

/* Responsive */
@media (max-width: 600px) {
  .informacion-cuantitativa {
    padding: 12px;
  }

  .header-section {
    flex-direction: column;
    align-items: stretch;
  }

  .registrar-btn {
    width: 100%;
    margin-top: 12px;
  }

  .seccion-con-toggle {
    padding: 12px;
  }
}
</style>
