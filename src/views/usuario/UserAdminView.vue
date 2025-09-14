<template>
  <v-container class="users-admin-container">
    <!-- Overlay de carga -->
    <v-overlay :model-value="loading" class="align-center justify-center" persistent opacity="0.8">
      <div class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
          width="6"
        ></v-progress-circular>
        <p class="mt-4 text-h6">Cargando usuarios...</p>
      </div>
    </v-overlay>

    <!-- CONTENIDO PRINCIPAL -->
    <template v-if="!loading">
      <v-row>
        <v-col cols="12">
          <PaginaTituloIcono :titulo="'ADMINISTRACIÓN DE USUARIOS'" :icon="'mdi-account-cog'" />

          <!-- Barra de acciones -->
          <div class="users-admin-actions mb-4">
            <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreateDialog">
              Nuevo Usuario
            </v-btn>

            <!-- <v-btn
              color="success"
              prepend-icon="mdi-upload"
              @click="openImportDialog"
              :loading="importingUsers"
            >
              Importar Excel
              <input
                ref="fileInput"
                type="file"
                accept=".xlsx, .xls, .csv"
                style="display: none"
                @change="handleFileImport"
              />
            </v-btn>

            <v-btn
              color="info"
              prepend-icon="mdi-download"
              @click="exportToExcel"
              :loading="exportingUsers"
            >
              Exportar Excel
            </v-btn> -->

            <v-text-field
              v-model="search"
              label="Buscar usuarios"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              class="ml-4"
              style="max-width: 300px"
            ></v-text-field>

            <v-btn
              variant="outlined"
              color="secondary"
              prepend-icon="mdi-filter"
              class="ml-2"
              @click="filterDialog = true"
            >
              Filtros
            </v-btn>
          </div>

          <!-- Tabla de usuarios -->
          <v-card variant="outlined">
            <v-data-table
              :headers="headers"
              :items="filteredUsers"
              :search="search"
              :loading="tableLoading"
              loading-text="Cargando usuarios..."
              no-data-text="No hay usuarios registrados"
              :items-per-page="10"
            >
              <!-- Avatar y nombre -->
              <template v-slot:item.user="{ item }">
                <div class="d-flex align-center">
                  <v-avatar size="36" color="grey-lighten-2" class="mr-3">
                    <v-img v-if="item.avatar" :src="item.avatar"></v-img>
                    <span v-else class="text-caption">{{ getInitials(item.nombre) }}</span>
                  </v-avatar>
                  <div>
                    <div class="font-weight-medium">{{ item.nombre }} {{ item.paterno }}  {{ item.marterno }}</div>
                    <div class="text-caption text-medium-emphasis">{{ item.usuario }}</div>
                  </div>
                </div>
              </template>

              <!-- Estado -->
              <template v-slot:item.status="{ item }">
                <v-chip :color="getStatusColor(item.status)" size="small">
                  {{ getStatusText(item.status) }}
                </v-chip>
              </template>

              <!-- Roles -->
              <template v-slot:item.roles="{ item }">
                <div class="d-flex flex-wrap gap-1">
                  <v-chip
                    v-for="role in item.roles"
                    :key="role"
                    :color="getRoleColor(role)"
                    size="small"
                  >
                    {{ role }}
                  </v-chip>
                </div>
              </template>

              <!-- Último acceso -->
              <template v-slot:item.permisos="{ item }">
                {{ item.permisos || 'No definido' }}
              </template>

              <!-- Acciones -->
              <template v-slot:item.actions="{ item }">
                <div class="d-flex">
                  <v-btn
                    icon
                    size="small"
                    color="primary"
                    variant="text"
                    @click="openEditDialog(item)"
                    :loading="loadingEdit"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>

                  <v-menu>
                    <template v-slot:activator="{ props }">
                      <v-btn
                        icon
                        size="small"
                        color="secondary"
                        variant="text"
                        v-bind="props"
                        class="ml-1"
                      >
                      <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>
                    <v-list density="compact">
                      <v-list-item @click="openResetPasswordDialog(item)">
                        <template v-slot:prepend>
                          <v-icon icon="mdi-key"></v-icon>
                        </template>
                        <v-list-item-title>Resetear contraseña</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="toggleUserStatus(item)">
                        <template v-slot:prepend>
                          <v-icon
                            :icon="
                              item.status === 'active' ? 'mdi-account-off' : 'mdi-account-check'
                            "
                          ></v-icon>
                        </template>
                        <v-list-item-title>
                          {{ item.status === 'active' ? 'Desactivar' : 'Activar' }}
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="viewUserDetails(item)">
                        <template v-slot:prepend>
                          <v-icon icon="mdi-eye"></v-icon>
                        </template>
                        <v-list-item-title>Ver detalles</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <!-- Diálogos -->
    <!-- Diálogo de importación -->
    <!-- <v-dialog v-model="importDialog" max-width="600" persistent>
      <v-card>
        <v-card-title>Importar Usuarios desde Excel</v-card-title>
        <v-card-text>
          <v-alert v-if="importError" type="error" class="mb-4">
            {{ importError }}
          </v-alert>

          <v-alert type="info" class="mb-4">
            El archivo Excel debe contener las siguientes columnas:
            <ul class="mt-2">
              <li><strong>Nombre</strong> (Requerido)</li>
              <li><strong>Email</strong> (Requerido)</li>
              <li><strong>Roles</strong> (Separados por comas: admin,user)</li>
              <li><strong>Estado</strong> (active, inactive, pending, blocked)</li>
              <li><strong>Teléfono</strong> (Opcional)</li>
            </ul>
          </v-alert>

          <v-file-input
            v-model="importFile"
            accept=".xlsx, .xls, .csv"
            label="Seleccionar archivo Excel"
            prepend-icon="mdi-file-excel"
            variant="outlined"
            @update:modelValue="previewImport"
          ></v-file-input>

          <v-data-table
            v-if="previewData.length > 0"
            :headers="previewHeaders"
            :items="previewData"
            class="mt-4"
            height="300"
          ></v-data-table>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="grey" @click="cancelImport">Cancelar</v-btn>
          <v-btn
            color="primary"
            @click="confirmImport"
            :disabled="previewData.length === 0"
            :loading="importingUsers"
          >
            Importar Usuarios
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->
    <!-- Crear/Editar Usuario -->
    <v-dialog v-model="userDialog" max-width="800" persistent>
      <v-card>
        <v-card-title>{{ isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario' }}</v-card-title>
        <v-card-text>
          <v-form ref="userForm" @submit.prevent="saveUser">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="currentUser.nombre"
                label="Nombre"
                :rules="[required]"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="currentUser.paterno"
                label="Apellido Paterno"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="currentUser.materno"
                label="Apellido Materno"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="currentUser.ci"
                label="C.I."
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="currentUser.usuario"
                label="Nombre de Usuario"
                :rules="[required]"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="currentUser.cargo"
                label="Cargo"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="currentUser.banco"
                label="Banco"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="currentUser.numero_cuenta"
                label="Número de Cuenta"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="currentUser.tipo_cuenta"
                label="Tipo de Cuenta"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" v-if="!isEditing">
              <v-text-field
                v-model="currentUser.password"
                label="Contraseña"
                :rules="[required, minLength(8)]"
                type="password"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" v-if="!isEditing">
              <v-text-field
                v-model="currentUser.passwordConfirm"
                label="Confirmar contraseña"
                :rules="[required, passwordMatch]"
                type="password"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="currentUser.permisos"
                :items="availablePermissions"
                label="Permisos"
                :rules="[required]"
                variant="outlined"
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="currentUser.is_active"
                :items="statusOptions"
                label="Estado"
                :rules="[required]"
                variant="outlined"
              ></v-select>
            </v-col>
          </v-row>
        </v-form>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="grey" @click="userDialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="saveUser" :loading="savingUser">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Resetear contraseña -->
    <v-dialog v-model="resetPasswordDialog" max-width="500" persistent>
      <v-card>
        <v-card-title>Resetear contraseña</v-card-title>
        <v-card-text>
          <v-form ref="resetForm" @submit.prevent="resetPassword">
            <v-text-field
              v-model="newPassword"
              label="Nueva contraseña"
              :rules="[required, minLength(8)]"
              type="password"
              variant="outlined"
            ></v-text-field>
            <v-text-field
              v-model="newPasswordConfirm"
              label="Confirmar nueva contraseña"
              :rules="[required, passwordMatch]"
              type="password"
              variant="outlined"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="grey" @click="resetPasswordDialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="resetPassword" :loading="resettingPassword"
            >Confirmar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Confirmar eliminación -->
    <!-- <v-dialog v-model="confirmDeleteDialog" max-width="500" persistent>
      <v-card>
        <v-card-title class="bg-error text-white">
          <v-icon icon="mdi-alert-circle" class="mr-2"></v-icon>
          Confirmar eliminación
        </v-card-title>
        <v-card-text class="pt-4">
          <p class="text-body-1">
            ¿Está seguro que desea eliminar al usuario <strong>{{ userToDelete?.name }}</strong
            >?
          </p>
          <p class="text-caption text-medium-emphasis mt-2">Esta acción no se puede deshacer.</p>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="grey" @click="confirmDeleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" @click="deleteUser" :loading="loadingDelete">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->

    <!-- Filtros -->
    <v-dialog v-model="filterDialog" max-width="600" persistent>
      <v-card>
        <v-card-title>Filtrar usuarios</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="filters.status"
                :items="statusOptions"
                label="Estado"
                clearable
                variant="outlined"
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="filters.roles"
                :items="availableRoles"
                label="Roles"
                multiple
                chips
                clearable
                variant="outlined"
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-menu v-model="dateMenu.from" :close-on-content-click="false">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-model="filters.dateFrom"
                    label="Fecha desde"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="props"
                    variant="outlined"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="filters.dateFrom"
                  @update:model-value="dateMenu.from = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" md="6">
              <v-menu v-model="dateMenu.to" :close-on-content-click="false">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-model="filters.dateTo"
                    label="Fecha hasta"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="props"
                    variant="outlined"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="filters.dateTo"
                  @update:model-value="dateMenu.to = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="grey" @click="clearFilters">Limpiar</v-btn>
          <v-btn color="primary" @click="applyFilters">Aplicar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import axios from 'axios'
import { ref, computed, onMounted } from 'vue'
//import { useAuthStore } from '@/stores/auth'
import { useSnackbar } from '@/composables/useSnackbar'
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'
//import * as XLSX from 'xlsx'

const { successMsg, errorMsg } = useSnackbar()
//const authStore = useAuthStore()

// Nuevas propiedades para importación/exportación
//const loadingMessage = ref('Cargando usuarios...')
// const importingUsers = ref(false)
// const exportingUsers = ref(false)
// const importDialog = ref(false)
// const importFile = ref(null)
// const previewData = ref([])
// const importError = ref('')
// const fileInput = ref(null)
const availablePermissions = ['A', 'B', 'C', 'D'] // Ajustar según tus permisos
const userForm = ref(null)

// const previewHeaders = [
//   { title: 'Nombre', key: 'name' },
//   { title: 'Email', key: 'email' },
//   { title: 'Roles', key: 'roles' },
//   { title: 'Estado', key: 'status' },
//   { title: 'Teléfono', key: 'phone' },
// ]

// Datos y estado
const loading = ref(true)
const tableLoading = ref(false)
const savingUser = ref(false)
const loadingEdit = ref(false)
//const loadingDelete = ref(false)
const resettingPassword = ref(false)

const users = ref([])
const search = ref('')
const userDialog = ref(false)
const resetPasswordDialog = ref(false)
//const confirmDeleteDialog = ref(false)
const filterDialog = ref(false)
const isEditing = ref(false)

const currentUser = ref({
  id:null,
  usuario: '',
  nombre: '',
  paterno: '',
  materno: '',
  ci: '',
  cargo: '',
  banco: '',
  numero_cuenta: '',
  tipo_cuenta: '',
  is_active: true,
  password: '',
  passwordConfirm: '',
  permisos: '',
})

//const userToDelete = ref(null)
const userIdToReset = ref(null);
const newPassword = ref('')
const newPasswordConfirm = ref('')

const filters = ref({
  status: null,
  roles: [],
  dateFrom: null,
  dateTo: null,
})

const dateMenu = ref({
  from: false,
  to: false,
})

// Opciones para selects
const statusOptions = [
  { title: 'Activo', value: 'active' },
  { title: 'Inactivo', value: 'inactive' },
  { title: 'Pendiente', value: 'pending' },
  { title: 'Bloqueado', value: 'blocked' },
]

const availableRoles = ['admin', 'editor', 'user', 'guest', 'manager', 'auditor']

// Headers de la tabla
const headers = [
  { title: 'Usuario', key: 'user', sortable: false },
  { title: 'Estado', key: 'status', width: '120px' },
  { title: 'Roles', key: 'roles', sortable: false },
  { title: 'Permisos', key: 'permisos', width: '150px' },
  { title: 'Acciones', key: 'actions', sortable: false, width: '150px' },
]

// Reglas de validación
const required = (v) => !!v || 'Campo requerido'
const minLength = (length) => (v) => (v && v.length >= length) || `Mínimo ${length} caracteres`
const passwordMatch = () =>
  newPassword.value === newPasswordConfirm.value || 'Las contraseñas no coinciden'

// Computed
const filteredUsers = computed(() => {
  return users.value.filter((user) => {
    // Filtro por estado
    if (filters.value.status && user.status !== filters.value.status) return false

    // Filtro por roles
    if (
      filters.value.roles.length > 0 &&
      !filters.value.roles.some((role) => user.roles.includes(role))
    ) {
      return false
    }

    // Filtro por fecha
    if (filters.value.dateFrom && new Date(user.createdAt) < new Date(filters.value.dateFrom)) {
      return false
    }
    if (filters.value.dateTo && new Date(user.createdAt) > new Date(filters.value.dateTo)) {
      return false
    }

    return true
  })
})

// Métodos
const fetchUsers = async () => {
  try {
    tableLoading.value = true
    loading.value = true
    const response = await axios.get('http://127.0.0.1:8000/autenticacion_api/listaUsuarios/');
    const data = response.data;
    users.value = data.usuarios.map(user => ({
    id: user.id,
    nombre: user.nombre,
    paterno: user.paterno,
    materno: user.materno,
    ci: user.ci,
    usuario: user.usuario,
    cargo: user.cargo,
    banco: user.banco,
    numero_cuenta: user.numero_cuenta,
    tipo_cuenta: user.tipo_cuenta,
    permisos: user.permisos,
    is_active: user.es_activo,
    roles: [user.cargo],
    status: user.es_activo ? 'active' : 'inactive',
    avatar: null,
    lastLogin: null,
    }));
  } catch (error) {
    errorMsg('Error al cargar usuarios')
    console.error('Error fetching users:', error)
  } finally {
    loading.value = false
    tableLoading.value = false
  }
}

const openCreateDialog = () => {
  currentUser.value = {
    usuario: '',
    nombre: '',
    paterno: '',
    materno: '',
    ci: '',
    cargo: '',
    banco: '',
    numero_cuenta: '',
    tipo_cuenta: '',
    is_active: true,
    password: '',
    passwordConfirm: '',
    permisos: '',
  }
  isEditing.value = false
  userDialog.value = true
}

const openEditDialog = (user) => {
  console.log(user)
  currentUser.value = { ...user }
  isEditing.value = true
  userDialog.value = true
}

const saveUser = async () => {
  const { valid } = await userForm.value.validate()

  if (!valid) {
    return
  }

  try {
    savingUser.value = true

    const payload = {
      usuario: currentUser.value.usuario,
      nombre: currentUser.value.nombre,
      paterno: currentUser.value.paterno,
      materno: currentUser.value.materno,
      ci: currentUser.value.ci,
      cargo: currentUser.value.cargo,
      banco: currentUser.value.banco,
      numero_cuenta: currentUser.value.numero_cuenta,
      tipo_cuenta: currentUser.value.tipo_cuenta,
      is_active: currentUser.value.is_active,
      permisos: currentUser.value.permisos,
    };

    if (isEditing.value) {
      const updatePayload = {
        ...payload,
        id_usuario: currentUser.value.id,
      };
       await axios.put(
        'http://127.0.0.1:8000/autenticacion_api/actualizarUsuario/',
        updatePayload
      );
      successMsg('Usuario actualizado correctamente');
    } else {

      const createPayload = {
        ...payload,
        password: currentUser.value.password,
      };

      await axios.post(
        'http://127.0.0.1:8000/autenticacion_api/crearUsuario/',
        createPayload
      )
      successMsg('Usuario creado correctamente')
    }
    userDialog.value = false
  } catch (error) {
    errorMsg('Error al guardar usuario')
    console.error('Error saving user:', error)
    if (error.response) {
      console.error('Datos de error:', error.response.data)
    }
  } finally {
    savingUser.value = false
  }
}

// const confirmDeleteUser = (user) => {
//   userToDelete.value = user
//   confirmDeleteDialog.value = true
// }

// const deleteUser = async () => {
//   try {
//     loadingDelete.value = true

//     // Simulación de API - en un proyecto real harías una llamada API aquí
//     users.value = users.value.filter((u) => u.id !== userToDelete.value.id)
//     successMsg('Usuario eliminado correctamente')
//     confirmDeleteDialog.value = false
//   } catch (error) {
//     errorMsg('Error al eliminar usuario')
//     console.error('Error deleting user:', error)
//   } finally {
//     loadingDelete.value = false
//   }
// }

const openResetPasswordDialog = (user) => {
  userIdToReset.value = user.id;
  newPassword.value = ''
  newPasswordConfirm.value = ''
  resetPasswordDialog.value = true
}

const resetPassword = async () => {
  try {
    resettingPassword.value = true

    const userId = userIdToReset.value;
    const newPwd = newPassword.value;

    if (!userId || !newPwd) {
      errorMsg('ID de usuario y nueva contraseña son requeridos.');
      return;
    }

    const payload = {
      id_usuario: userId,
      password: newPwd,
    };

    await axios.put(
      'http://127.0.0.1:8000/autenticacion_api/cambiarPwdUsuario/',
      payload
    );

    successMsg('Contraseña actualizada correctamente')
    resetPasswordDialog.value = false
  } catch (error) {
    errorMsg('Error al resetear contraseña')
    console.error('Error resetting password:', error)
  } finally {
    resettingPassword.value = false
  }
}

const toggleUserStatus = async (user) => {
  try {
    loadingEdit.value = true

    const nuevoEstado = !user.is_active;

    const payload = {
      id_usuario: user.id,
      activo: nuevoEstado,
    };

    await axios.put(
      'http://127.0.0.1:8000/autenticacion_api/cambiarEstadoUsuario/',
      payload
    );

    const userToUpdate = users.value.find((u) => u.id === user.id);
    if (userToUpdate) {
      userToUpdate.is_active = nuevoEstado;
    }

    const index = users.value.findIndex((u) => u.id === user.id)
    if (index !== -1) {
      users.value[index].status = user.status === 'active' ? 'inactive' : 'active'
      successMsg(`Usuario ${user.status === 'active' ? 'desactivado' : 'activado'} correctamente`)
    }
  } catch (error) {
    errorMsg('Error al cambiar estado del usuario')
    console.error('Error toggling user status:', error)
  } finally {
    loadingEdit.value = false
  }
}

const viewUserDetails = (user) => {
  // Navegar a la vista de detalles del usuario
  console.log('Viewing user details:', user)
}

const applyFilters = () => {
  filterDialog.value = false
}

const clearFilters = () => {
  filters.value = {
    status: null,
    roles: [],
    dateFrom: null,
    dateTo: null,
  }
  filterDialog.value = false
}

// const formatDate = (dateString) => {
//   if (!dateString) return ''
//   const options = { year: 'numeric', month: 'short', day: 'numeric' }
//   return new Date(dateString).toLocaleDateString(undefined, options)
// }

const getInitials = (name) => {
  if (!name) return ''
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

const getStatusColor = (status) => {
  const colors = {
    active: 'success',
    inactive: 'error',
    pending: 'warning',
    blocked: 'grey',
  }
  return colors[status] || 'primary'
}

const getStatusText = (status) => {
  const texts = {
    active: 'Activo',
    inactive: 'Inactivo',
    pending: 'Pendiente',
    blocked: 'Bloqueado',
  }
  return texts[status] || status
}

const getRoleColor = (role) => {
  const colors = {
    admin: 'error',
    editor: 'warning',
    user: 'success',
    guest: 'grey',
    manager: 'indigo',
    auditor: 'deep-purple',
  }
  return colors[role] || 'primary'
}

// Ciclo de vida
onMounted(() => {
  fetchUsers()
})

//*************** Exportar a Excel ********************/
// const openImportDialog = () => {
//   importDialog.value = true
//   importFile.value = null
//   previewData.value = []
//   importError.value = ''
// }

// const cancelImport = () => {
//   importDialog.value = false
//   importFile.value = null
//   previewData.value = []
// }

// const handleFileImport = (event) => {
//   const file = event.target.files[0]
//   if (file) {
//     importFile.value = file
//     previewImport()
//   }
// }

// const previewImport = async () => {
//   if (!importFile.value) return

//   try {
//     loadingMessage.value = 'Procesando archivo Excel...'
//     importingUsers.value = true

//     const data = await readExcelFile(importFile.value)
//     previewData.value = data.map((item) => ({
//       name: item.Nombre || item.name || '',
//       email: item.Email || item.email || '',
//       roles: item.Roles || item.roles || 'user',
//       status: item.Estado || item.status || 'active',
//       phone: item.Teléfono || item.phone || '',
//     }))

//     importError.value = ''
//   } catch (error) {
//     console.error('Error al procesar archivo:', error)
//     importError.value = 'Error al procesar el archivo. Verifique el formato.'
//     previewData.value = []
//   } finally {
//     importingUsers.value = false
//     loadingMessage.value = 'Cargando usuarios...'
//   }
// }

// const readExcelFile = (file) => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader()

//     reader.onload = (e) => {
//       try {
//         const data = new Uint8Array(e.target.result)
//         const workbook = XLSX.read(data, { type: 'array' })
//         const firstSheetName = workbook.SheetNames[0]
//         const worksheet = workbook.Sheets[firstSheetName]
//         const jsonData = XLSX.utils.sheet_to_json(worksheet)
//         resolve(jsonData)
//       } catch (error) {
//         reject(error)
//       }
//     }

//     reader.onerror = () => {
//       reject(new Error('Error al leer el archivo'))
//     }

//     reader.readAsArrayBuffer(file)
//   })
// }

// const confirmImport = async () => {
//   if (previewData.value.length === 0) return

//   try {
//     loadingMessage.value = 'Importando usuarios...'
//     importingUsers.value = true

//     // Validar datos antes de importar
//     const invalidUsers = previewData.value.filter(
//       (user) => !user.name || !user.email || !validateEmail(user.email),
//     )

//     if (invalidUsers.length > 0) {
//       throw new Error(`${invalidUsers.length} usuarios tienen datos inválidos (nombre o email)`)
//     }

//     // Simular llamada API para importar
//     // En un proyecto real, aquí enviarías los datos al backend
//     await new Promise((resolve) => setTimeout(resolve, 1500))

//     // Agregar usuarios importados a la lista
//     const newUsers = previewData.value.map((user, index) => ({
//       id: `import-${Date.now()}-${index}`,
//       name: user.name,
//       email: user.email,
//       roles: user.roles.split(',').map((r) => r.trim()),
//       status: user.status || 'active',
//       phone: user.phone || '',
//       createdAt: new Date().toISOString().split('T')[0],
//       lastLogin: null,
//       notes: 'Importado desde Excel',
//     }))

//     users.value = [...newUsers, ...users.value]
//     successMsg(`${previewData.value.length} usuarios importados correctamente`)
//     importDialog.value = false
//   } catch (error) {
//     console.error('Error al importar usuarios:', error)
//     importError.value = error.message
//   } finally {
//     importingUsers.value = false
//     loadingMessage.value = 'Cargando usuarios...'
//   }
// }

// const exportToExcel = async () => {
//   try {
//     exportingUsers.value = true

//     // Preparar datos para exportación
//     const dataToExport = filteredUsers.value.map((user) => ({
//       Nombre: user.name,
//       Email: user.email,
//       Roles: user.roles.join(', '),
//       Estado: getStatusText(user.status),
//       Teléfono: user.phone,
//       'Último acceso': user.lastLogin ? formatDate(user.lastLogin) : 'Nunca',
//       'Fecha creación': user.createdAt,
//     }))

//     // Crear libro de Excel
//     const workbook = XLSX.utils.book_new()
//     const worksheet = XLSX.utils.json_to_sheet(dataToExport)
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Usuarios')

//     // Generar archivo y descargar
//     const dateStr = new Date().toISOString().slice(0, 10)
//     XLSX.writeFile(workbook, `usuarios_${dateStr}.xlsx`)

//     successMsg('Exportación completada correctamente')
//   } catch (error) {
//     console.error('Error al exportar a Excel:', error)
//     errorMsg('Error al exportar los datos')
//   } finally {
//     exportingUsers.value = false
//   }
// }

// const validateEmail = (email) => {
//   return /.+@.+\..+/.test(email)
// }

//*************** Fin Exportar a Excel ********************/
</script>

<style scoped>
.users-admin-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 16px;
}

.users-admin-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.v-card {
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

@media (max-width: 960px) {
  .users-admin-container {
    padding: 16px 12px;
  }

  .users-admin-actions {
    flex-direction: column;
    align-items: flex-start;
  }

  .users-admin-actions .v-text-field {
    max-width: 100%;
    width: 100%;
    margin-left: 0 !important;
  }
}
</style>
