<template>
  <v-container class="roles-admin-container">
    <!-- Overlay de carga -->
    <v-overlay :model-value="loading" class="align-center justify-center" persistent opacity="0.8">
      <div class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
          width="6"
        ></v-progress-circular>
        <p class="mt-4 text-h6">Cargando roles...</p>
      </div>
    </v-overlay>

    <!-- CONTENIDO PRINCIPAL -->
    <template v-if="!loading">
      <v-row>
        <v-col cols="12">
          <PaginaTituloIcono :titulo="'ADMINISTRACIÓN DE ROLES'" :icon="'mdi-shield-account'" />

          <!-- Barra de acciones -->
          <!-- Barra de acciones mejorada -->
          <div class="roles-admin-actions mb-4">
            <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreateDialog">
              Nuevo Rol
            </v-btn>

            <v-btn
              color="success"
              prepend-icon="mdi-upload"
              @click="openImportDialog"
              :loading="importingRoles"
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
              :loading="exportingRoles"
            >
              Exportar Excel
            </v-btn>

            <v-text-field
              v-model="search"
              label="Buscar roles"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              class="ml-4"
              style="max-width: 300px"
            ></v-text-field>
          </div>

          <!-- Tabla de roles -->
          <v-card variant="outlined">
            <v-toolbar color="primary" density="compact">
              <v-toolbar-title>LISTA DE ROLES</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon color="white" @click="refreshRoles" :loading="refreshing">
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
            </v-toolbar>

            <v-data-table
              :headers="headers"
              :items="filteredRoles"
              :search="search"
              :loading="tableLoading"
              loading-text="Cargando roles..."
              no-data-text="No hay roles registrados"
              :items-per-page="10"
            >
              <!-- Nombre y descripción -->
              <template v-slot:item.name="{ item }">
                <div class="d-flex align-center">
                  <v-chip :color="getRoleColor(item.name)" class="mr-3">
                    <v-icon start>mdi-shield</v-icon>
                    {{ item.name }}
                  </v-chip>
                  <span>{{ item.description }}</span>
                </div>
              </template>

              <!-- Permisos -->
              <template v-slot:item.permissions="{ item }">
                <div class="d-flex flex-wrap gap-1">
                  <v-chip
                    v-for="permission in item.permissions"
                    :key="permission"
                    size="small"
                    color="indigo"
                  >
                    {{ permission }}
                  </v-chip>
                  <v-chip v-if="item.permissions.length === 0" size="small" color="grey">
                    Sin permisos
                  </v-chip>
                </div>
              </template>

              <!-- Estado -->
              <template v-slot:item.active="{ item }">
                <v-chip :color="item.active ? 'success' : 'error'">
                  {{ item.active ? 'Activo' : 'Inactivo' }}
                </v-chip>
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
                  <v-btn
                    icon
                    size="small"
                    color="error"
                    variant="text"
                    @click="confirmDeleteRole(item)"
                    class="ml-1"
                    :loading="loadingDelete"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    size="small"
                    color="secondary"
                    variant="text"
                    @click="openPermissionsDialog(item)"
                    class="ml-1"
                  >
                    <v-icon>mdi-key</v-icon>
                  </v-btn>
                </div>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <!-- Diálogo Crear/Editar Rol -->
    <v-dialog v-model="roleDialog" max-width="600" persistent>
      <v-card>
        <v-card-title>{{ isEditing ? 'Editar Rol' : 'Crear Nuevo Rol' }}</v-card-title>
        <v-card-text>
          <v-form ref="roleForm" @submit.prevent="saveRole">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="currentRole.name"
                  label="Nombre del rol*"
                  :rules="[required]"
                  variant="outlined"
                  :disabled="isEditing"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="currentRole.active"
                  :items="statusOptions"
                  label="Estado*"
                  :rules="[required]"
                  variant="outlined"
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="currentRole.description"
                  label="Descripción"
                  variant="outlined"
                  rows="2"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="grey" @click="roleDialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="saveRole" :loading="savingRole">
            {{ isEditing ? 'Actualizar' : 'Guardar' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo Permisos -->
    <v-dialog v-model="permissionsDialog" max-width="800" persistent>
      <v-card>
        <v-card-title>Administrar Permisos: {{ currentRole.name }}</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6" v-for="module in permissionModules" :key="module.name">
              <v-card variant="outlined" class="mb-4">
                <v-toolbar color="indigo" density="compact">
                  <v-toolbar-title class="text-white">{{ module.label }}</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                  <v-list>
                    <v-list-item v-for="permission in module.permissions" :key="permission.value">
                      <template v-slot:prepend>
                        <v-checkbox
                          v-model="currentRole.permissions"
                          :value="permission.value"
                          hide-details
                        ></v-checkbox>
                      </template>
                      <v-list-item-title>{{ permission.label }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="grey" @click="permissionsDialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="savePermissions" :loading="savingPermissions">
            Guardar Permisos
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Confirmar eliminación -->
    <v-dialog v-model="confirmDeleteDialog" max-width="500" persistent>
      <v-card>
        <v-card-title class="bg-error text-white">
          <v-icon icon="mdi-alert-circle" class="mr-2"></v-icon>
          Confirmar eliminación
        </v-card-title>
        <v-card-text class="pt-4">
          <p class="text-body-1">
            ¿Está seguro que desea eliminar el rol <strong>{{ roleToDelete?.name }}</strong
            >?
          </p>
          <p class="text-caption text-medium-emphasis mt-2">
            Esta acción no se puede deshacer. Los usuarios con este rol perderán sus permisos.
          </p>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="grey" @click="confirmDeleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" @click="deleteRole" :loading="loadingDelete">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Diálogo de importación -->
    <v-dialog v-model="importDialog" max-width="600" persistent>
      <v-card>
        <v-card-title>Importar Roles desde Excel</v-card-title>
        <v-card-text>
          <v-alert v-if="importError" type="error" class="mb-4">
            {{ importError }}
          </v-alert>

          <v-alert type="info" class="mb-4">
            El archivo Excel debe contener las siguientes columnas:
            <ul class="mt-2">
              <li><strong>name</strong> (Nombre del rol, requerido)</li>
              <li><strong>description</strong> (Descripción)</li>
              <li><strong>active</strong> (Activo: true/false)</li>
              <li><strong>permissions</strong> (Permisos separados por comas)</li>
            </ul>
            <p class="mt-2">Nota: Los roles existentes con el mismo nombre serán actualizados.</p>
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
            :loading="importingRoles"
          >
            Importar Roles
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <ConfirmDialog></ConfirmDialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSnackbar } from '@/composables/useSnackbar'
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import ConfirmDialog from '@/components/layout/partials/ConfirmDialog.vue'
import * as XLSX from 'xlsx'

const { successMsg, errorMsg } = useSnackbar()
const { openConfirmDialog } = useConfirmDialog()

//Propiedades para importación/exportación
const loadingMessage = ref('Cargando roles...')
const importingRoles = ref(false)
const exportingRoles = ref(false)
const importDialog = ref(false)
const importFile = ref(null)
const previewData = ref([])
const importError = ref('')
const fileInput = ref(null)

const previewHeaders = [
  { title: 'Nombre', key: 'name' },
  { title: 'Descripción', key: 'description' },
  { title: 'Estado', key: 'active' },
  { title: 'Permisos', key: 'permissions' },
]

// Datos y estado
const loading = ref(true)
const tableLoading = ref(false)
const savingRole = ref(false)
const loadingEdit = ref(false)
const loadingDelete = ref(false)
const refreshing = ref(false)
const savingPermissions = ref(false)

const roles = ref([])
const search = ref('')
const roleDialog = ref(false)
const permissionsDialog = ref(false)
const confirmDeleteDialog = ref(false)
const isEditing = ref(false)

const currentRole = ref({
  id: '',
  name: '',
  description: '',
  permissions: [],
  active: true,
})

const roleToDelete = ref(null)
const roleForm = ref(null)

// Opciones para selects
const statusOptions = [
  { title: 'Activo', value: true },
  { title: 'Inactivo', value: false },
]

// Módulos de permisos (ajustar según necesidades)
const permissionModules = ref([
  {
    name: 'dashboard',
    label: 'Dashboard',
    permissions: [{ value: 'dashboard.view', label: 'Ver Dashboard' }],
  },
  {
    name: 'users',
    label: 'Usuarios',
    permissions: [
      { value: 'users.view', label: 'Ver Usuarios' },
      { value: 'users.create', label: 'Crear Usuarios' },
      { value: 'users.edit', label: 'Editar Usuarios' },
      { value: 'users.delete', label: 'Eliminar Usuarios' },
    ],
  },
  {
    name: 'roles',
    label: 'Roles',
    permissions: [
      { value: 'roles.view', label: 'Ver Roles' },
      { value: 'roles.create', label: 'Crear Roles' },
      { value: 'roles.edit', label: 'Editar Roles' },
      { value: 'roles.delete', label: 'Eliminar Roles' },
      { value: 'roles.assign', label: 'Asignar Roles' },
    ],
  },
  {
    name: 'pei',
    label: 'PEI',
    permissions: [
      { value: 'pei.view', label: 'Ver PEI' },
      { value: 'pei.create', label: 'Crear PEI' },
      { value: 'pei.edit', label: 'Editar PEI' },
      { value: 'pei.delete', label: 'Eliminar PEI' },
      { value: 'pei.manage', label: 'Gestionar PEI' },
    ],
  },
  {
    name: 'reports',
    label: 'Reportes',
    permissions: [
      { value: 'reports.view', label: 'Ver Reportes' },
      { value: 'reports.generate', label: 'Generar Reportes' },
      { value: 'reports.export', label: 'Exportar Reportes' },
    ],
  },
])

// Headers de la tabla
const headers = [
  { title: 'Nombre', key: 'name', sortable: true },
  { title: 'Permisos', key: 'permissions', sortable: false },
  { title: 'Estado', key: 'active', width: '120px' },
  { title: 'Acciones', key: 'actions', sortable: false, width: '180px' },
]

// Reglas de validación
const required = (v) => !!v || 'Campo requerido'

// Computed
const filteredRoles = computed(() => {
  return roles.value.filter(
    (role) =>
      role.name.toLowerCase().includes(search.value.toLowerCase()) ||
      role.description.toLowerCase().includes(search.value.toLowerCase()),
  )
})

// Métodos
const fetchRoles = async () => {
  try {
    tableLoading.value = true
    // Simulación de API - en un proyecto real usarías tu llamada API
    roles.value = [
      {
        id: '1',
        name: 'admin',
        description: 'Administrador del sistema con todos los permisos',
        permissions: permissionModules.value.flatMap((m) => m.permissions.map((p) => p.value)),
        active: true,
        createdAt: '2023-01-15',
      },
      {
        id: '2',
        name: 'editor',
        description: 'Editor de contenido con permisos limitados',
        permissions: ['dashboard.view', 'users.view', 'pei.view', 'pei.edit', 'reports.view'],
        active: true,
        createdAt: '2023-02-20',
      },
      {
        id: '3',
        name: 'viewer',
        description: 'Solo lectura, sin permisos de edición',
        permissions: ['dashboard.view', 'users.view', 'pei.view', 'reports.view'],
        active: true,
        createdAt: '2023-03-10',
      },
      {
        id: '4',
        name: 'auditor',
        description: 'Rol para auditoría del sistema',
        permissions: [
          'dashboard.view',
          'users.view',
          'pei.view',
          'reports.view',
          'reports.generate',
        ],
        active: false,
        createdAt: '2023-04-05',
      },
    ]
  } catch (error) {
    errorMsg('Error al cargar roles')
    console.error('Error fetching roles:', error)
  } finally {
    loading.value = false
    tableLoading.value = false
  }
}

const refreshRoles = async () => {
  refreshing.value = true
  await fetchRoles()
  refreshing.value = false
}

const openCreateDialog = () => {
  currentRole.value = {
    id: '',
    name: '',
    description: '',
    permissions: [],
    active: true,
  }
  isEditing.value = false
  roleDialog.value = true
}

const openEditDialog = (role) => {
  currentRole.value = { ...role }
  isEditing.value = true
  roleDialog.value = true
}

const openPermissionsDialog = (role) => {
  currentRole.value = { ...role }
  permissionsDialog.value = true
}

const saveRole = async () => {
  const { valid } = await roleForm.value.validate()
  if (!valid) return

  try {
    savingRole.value = true

    // Simulación de API - en un proyecto real harías una llamada API aquí
    if (isEditing.value) {
      // Actualizar rol
      const index = roles.value.findIndex((r) => r.id === currentRole.value.id)
      if (index !== -1) {
        roles.value[index] = { ...currentRole.value }
      }
      successMsg('Rol actualizado correctamente')
    } else {
      // Crear rol
      const newRole = {
        ...currentRole.value,
        id: (roles.value.length + 1).toString(),
        createdAt: new Date().toISOString().split('T')[0],
      }
      roles.value.unshift(newRole)
      successMsg('Rol creado correctamente')
    }

    roleDialog.value = false
  } catch (error) {
    errorMsg('Error al guardar rol')
    console.error('Error saving role:', error)
  } finally {
    savingRole.value = false
  }
}

const savePermissions = async () => {
  try {
    savingPermissions.value = true

    // Simulación de API - en un proyecto real harías una llamada API aquí
    const index = roles.value.findIndex((r) => r.id === currentRole.value.id)
    if (index !== -1) {
      roles.value[index].permissions = [...currentRole.value.permissions]
    }

    successMsg('Permisos actualizados correctamente')
    permissionsDialog.value = false
  } catch (error) {
    errorMsg('Error al guardar permisos')
    console.error('Error saving permissions:', error)
  } finally {
    savingPermissions.value = false
  }
}

const confirmDeleteRole = (role) => {
  roleToDelete.value = role
  confirmDeleteDialog.value = true
}

const deleteRole = async () => {
  try {
    loadingDelete.value = true

    // Simulación de API - en un proyecto real harías una llamada API aquí
    roles.value = roles.value.filter((r) => r.id !== roleToDelete.value.id)
    successMsg('Rol eliminado correctamente')
    confirmDeleteDialog.value = false
  } catch (error) {
    errorMsg('Error al eliminar rol')
    console.error('Error deleting role:', error)
  } finally {
    loadingDelete.value = false
  }
}

const getRoleColor = (roleName) => {
  const colors = {
    admin: 'error',
    editor: 'warning',
    viewer: 'success',
    auditor: 'indigo',
  }
  return colors[roleName.toLowerCase()] || 'primary'
}

// Ciclo de vida
onMounted(() => {
  fetchRoles()
})

/***************** Metodos exportacion/importacion ********************/
const openImportDialog = () => {
  importDialog.value = true
  importFile.value = null
  previewData.value = []
  importError.value = ''
}

const cancelImport = () => {
  importDialog.value = false
  importFile.value = null
  previewData.value = []
}

const handleFileImport = (event) => {
  const file = event.target.files[0]
  if (file) {
    importFile.value = file
    previewImport()
  }
}

const previewImport = async () => {
  if (!importFile.value) return

  try {
    loadingMessage.value = 'Procesando archivo Excel...'
    importingRoles.value = true

    const data = await readExcelFile(importFile.value)
    previewData.value = data.map((item) => ({
      name: item.name || '',
      description: item.description || '',
      active: item.active !== undefined ? item.active : true,
      permissions: item.permissions ? item.permissions.split(',').map((p) => p.trim()) : [],
    }))

    importError.value = ''
  } catch (error) {
    console.error('Error al procesar archivo:', error)
    importError.value = 'Error al procesar el archivo. Verifique el formato.'
    previewData.value = []
  } finally {
    importingRoles.value = false
    loadingMessage.value = 'Cargando roles...'
  }
}

const readExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)
        resolve(jsonData)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'))
    }

    reader.readAsArrayBuffer(file)
  })
}

const confirmImport = async () => {
  if (previewData.value.length === 0) return

  try {
    loadingMessage.value = 'Importando roles...'
    importingRoles.value = true

    // Validar datos antes de importar
    const invalidRoles = previewData.value.filter((role) => !role.name)

    if (invalidRoles.length > 0) {
      throw new Error(`${invalidRoles.length} roles no tienen nombre`)
    }

    // Simular llamada API para importar
    // En un proyecto real, aquí enviarías los datos al backend
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Procesar los datos importados
    previewData.value.forEach((importedRole) => {
      const existingIndex = roles.value.findIndex((r) => r.name === importedRole.name)

      if (existingIndex >= 0) {
        // Actualizar rol existente
        roles.value[existingIndex] = {
          ...roles.value[existingIndex],
          description: importedRole.description || roles.value[existingIndex].description,
          active:
            importedRole.active !== undefined
              ? importedRole.active
              : roles.value[existingIndex].active,
          permissions: importedRole.permissions || roles.value[existingIndex].permissions,
        }
      } else {
        // Crear nuevo rol
        const newRole = {
          id: `import-${Date.now()}-${roles.value.length}`,
          name: importedRole.name,
          description: importedRole.description || '',
          permissions: importedRole.permissions || [],
          active: importedRole.active !== undefined ? importedRole.active : true,
          createdAt: new Date().toISOString().split('T')[0],
        }
        roles.value.unshift(newRole)
      }
    })

    successMsg(`${previewData.value.length} roles importados/actualizados correctamente`)
    importDialog.value = false
  } catch (error) {
    console.error('Error al importar roles:', error)
    importError.value = error.message
  } finally {
    importingRoles.value = false
    loadingMessage.value = 'Cargando roles...'
  }
}

const exportToExcel = async () => {
  try {
    exportingRoles.value = true

    // Preparar datos para exportación
    const dataToExport = filteredRoles.value.map((role) => ({
      name: role.name,
      description: role.description,
      active: role.active,
      permissions: role.permissions.join(', '),
      createdAt: role.createdAt,
    }))

    // Crear libro de Excel
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(dataToExport)
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Roles')

    // Generar archivo y descargar
    const dateStr = new Date().toISOString().slice(0, 10)
    XLSX.writeFile(workbook, `roles_${dateStr}.xlsx`)

    successMsg('Exportación completada correctamente')
  } catch (error) {
    console.error('Error al exportar a Excel:', error)
    errorMsg('Error al exportar los datos')
  } finally {
    exportingRoles.value = false
  }
}

/***************** Fin Metodos exportacion/importacion ********************/
</script>

<style scoped>
.roles-admin-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 16px;
}

.roles-admin-actions {
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
  .roles-admin-container {
    padding: 16px 12px;
  }

  .roles-admin-actions {
    flex-direction: column;
    align-items: flex-start;
  }

  .roles-admin-actions .v-text-field {
    max-width: 100%;
    width: 100%;
    margin-left: 0 !important;
  }
}
</style>
