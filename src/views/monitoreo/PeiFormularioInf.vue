<template>
  <v-container>
    <v-card class="pa-8 rounded-lg" elevation="6">
      <v-card-title class="text-h4 font-weight-bold mb-4">
        <v-icon large color="primary" class="mr-3">mdi-file-document-outline</v-icon>
        Informe de Actividades
      </v-card-title>

      <v-divider class="mb-6"></v-divider>

      <v-card-text>
        <v-form @submit.prevent="submitForm">
          <v-expansion-panels class="mb-6">
            <v-expansion-panel>
              <v-expansion-panel-header class="font-weight-bold text-h6">
                <v-icon left>mdi-form-select</v-icon>
                Datos Generales del Informe
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="formData.fecha_realizacion"
                      label="Fecha de Realización"
                      type="date"
                      variant="outlined"
                      required
                      density="comfortable"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="8">
                    <v-text-field
                      v-model="formData.nombre_actividad"
                      label="Nombre de Actividad"
                      placeholder=""
                      variant="outlined"
                      required
                      density="comfortable"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-text-field
                  v-model="formData.beneficiario"
                  label="Responsable de Actividad"
                  placeholder="Nombre completo del responsable"
                  variant="outlined"
                  required
                  density="comfortable"
                  :disabled="true"
                ></v-text-field>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>

          <v-expansion-panels class="mb-6">
            <v-expansion-panel>
              <v-expansion-panel-header class="font-weight-bold text-h6">
                <v-icon left>mdi-tools</v-icon>
                Herramientas Aplicadas y Resultados
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-textarea
                  v-model="formData.descripcion_herramientas"
                  label="Descripción detallada de herramientas y resultados"
                  rows="3"
                  variant="outlined"
                ></v-textarea>
                <v-file-input
                  v-model="formData.herramientas_archivos"
                  label="Adjuntar archivos"
                  placeholder="Selecciona uno o más archivos"
                  multiple
                  chips
                  show-size
                  :accept="acceptedFormats.herramientas"
                  variant="outlined"
                  prepend-icon="mdi-paperclip"
                ></v-file-input>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>

          <v-expansion-panels class="mb-6">
            <v-expansion-panel>
              <v-expansion-panel-header class="font-weight-bold text-h6">
                <v-icon left>mdi-check-all</v-icon>
                Medios de Verificación
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-textarea
                  v-model="formData.medios_verificacion"
                  label="Descripción de medios de verificación"
                  rows="3"
                  variant="outlined"
                ></v-textarea>
                <v-file-input
                  v-model="formData.medios_archivos"
                  label="Adjuntar archivos"
                  placeholder="Selecciona uno o más archivos"
                  multiple
                  chips
                  show-size
                  :accept="acceptedFormats.medios"
                  variant="outlined"
                  prepend-icon="mdi-paperclip"
                ></v-file-input>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>

          <v-expansion-panels class="mb-6">
            <v-expansion-panel>
              <v-expansion-panel-header class="font-weight-bold text-h6">
                <v-icon left>mdi-comment-text-outline</v-icon>
                Comentarios y Recomendaciones
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-textarea
                  v-model="formData.comentarios_recomendaciones"
                  label="Comentarios y recomendaciones adicionales"
                  rows="3"
                  variant="outlined"
                  required
                ></v-textarea>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>

          <v-btn
            color="primary"
            prepend-icon="mdi-send"
            @click="submitForm"
            :loading="loading"
            class="mt-4"
            block
            size="large"
          >
            Enviar Informe
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
// El código del script es funcionalmente el mismo,
// no necesita grandes cambios más allá de la estructura del formulario.
// Puedes usar el mismo <script> que ya tienes.
import axios from 'axios';
import { useUsuario } from '@/modules/usuarios/composables/useUsuario';

export default {
  name: 'FormularioF01',
  setup() {
    const { usuario, informacionUsuarioPorNick } = useUsuario();
    return { usuario, informacionUsuarioPorNick };
  },
  data() {
    return {
      loading: false,
      formData: {
        fecha_realizacion: '',
        nombre_actividad: '',
        beneficiario: '',
        descripcion_herramientas: '',
        herramientas_archivos: [],
        medios_verificacion: '',
        medios_archivos: [],
        comentarios_recomendaciones: '',
      },
      acceptedFormats: {
        herramientas: 'image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx',
        medios: 'image/*,video/*,.mp3,.pdf,.doc,.docx',
      },
    };
  },
  mounted() {
    this.prefillFormData();
  },
  methods: {
    async prefillFormData() {
      try {
        const currentNick = 'ACarvajal';
        await this.informacionUsuarioPorNick({ usuario: currentNick });

        if (this.usuario) {
          this.formData.beneficiario = `${this.usuario.nombre} ${this.usuario.paterno} ${this.usuario.materno}`.trim();
        }
      } catch (err) {
        console.error('Error al pre-llenar los datos del usuario:', err);
      }
    },
    async submitForm() {
      this.loading = true;
      try {
        if (
          !this.formData.fecha_realizacion ||
          !this.formData.nombre_actividad ||
          !this.formData.beneficiario ||
          (!this.formData.descripcion_herramientas && this.formData.herramientas_archivos.length === 0) ||
          (!this.formData.medios_verificacion && this.formData.medios_archivos.length === 0) ||
          !this.formData.comentarios_recomendaciones
        ) {
          throw new Error('Por favor complete todos los campos requeridos del Informe de Actividades, incluyendo la carga de archivos o descripciones.');
        }

        const payload = new FormData();
        payload.append('fecha_realizacion', this.formData.fecha_realizacion);
        payload.append('nombre_actividad', this.formData.nombre_actividad);
        payload.append('responsable_actividad', this.formData.beneficiario);
        payload.append('descripcion_herramientas', this.formData.descripcion_herramientas);
        payload.append('medios_verificacion', this.formData.medios_verificacion);
        payload.append('comentarios_recomendaciones', this.formData.comentarios_recomendaciones);

        if (this.formData.herramientas_archivos.length > 0) {
          this.formData.herramientas_archivos.forEach(file => {
            payload.append('herramientas_archivos', file);
          });
        }
        if (this.formData.medios_archivos.length > 0) {
          this.formData.medios_archivos.forEach(file => {
            payload.append('medios_archivos', file);
          });
        }

        const response = await axios.post(
          'http://127.0.0.1:8000/tu_api_de_informes/crearInforme/',
          payload,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        alert('Informe de Actividades y archivos enviados con éxito');
        this.resetForm();
      } catch (error) {
        console.error('Error completo al enviar el informe:', error.response?.data || error.message);
        const errorMessage =
          error.response?.data?.message || error.message || 'Ocurrió un error inesperado al enviar el informe.';
        alert(`Error: ${errorMessage}`);
      } finally {
        this.loading = false;
      }
    },
    resetForm() {
      this.formData = {
        fecha_realizacion: '',
        nombre_actividad: '',
        beneficiario: '',
        descripcion_herramientas: '',
        herramientas_archivos: [],
        medios_verificacion: '',
        medios_archivos: [],
        comentarios_recomendaciones: '',
      };
      this.prefillFormData();
    },
  },
};
</script>
