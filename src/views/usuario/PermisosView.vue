<template>
  <v-container class="django-permisos-container">
    <!-- Overlay de carga -->
    <v-overlay :model-value="cargando" class="align-center justify-center" persistent opacity="0.8">
      <div class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
          width="6"
        ></v-progress-circular>
        <p class="mt-4 text-h6">Cargando permisos del sistema...</p>
      </div>
    </v-overlay>

    <!-- CONTENIDO PRINCIPAL -->
    <template v-if="!cargando">
      <v-row>
        <v-col cols="12">
          <PaginaTituloIcono
            :titulo="'ADMINISTRACIÓN DE PERMISOS SISTEMA'"
            :icon="'mdi-key-chain'"
          />

          <!-- Tabs para usuarios, grupos y permisos -->
          <v-tabs v-model="tabActual" color="primary" grow>
            <v-tab value="usuarios">
              <v-icon start>mdi-account</v-icon>
              Usuarios
            </v-tab>
            <v-tab value="grupos">
              <v-icon start>mdi-account-group</v-icon>
              Grupos
            </v-tab>
            <v-tab value="permisos">
              <v-icon start>mdi-lock</v-icon>
              Permisos
            </v-tab>
          </v-tabs>

          <v-window v-model="tabActual">
            <!-- Tab de Usuarios -->
            <v-window-item value="usuarios">
              <v-card variant="outlined" class="mt-4">
                <v-toolbar color="primary" density="compact">
                  <v-toolbar-title>USUARIOS DEL SISTEMA</v-toolbar-title>
                  <v-spacer></v-spacer>

                  <v-tooltip text="Agregar Nuevo Usuario" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-bind="props"
                        icon
                        color="black"
                        size="large"
                        class="mx-1"
                        @click="abrirModalNuevoUsuario()"
                        :disabled="cargandoAccion"
                      >
                        <v-icon>mdi-account-plus</v-icon>
                      </v-btn>
                    </template>
                  </v-tooltip>
                </v-toolbar>

                <v-card-text>
                  <div class="table-responsive">
                    <v-table class="permisos-table">
                      <thead>
                        <tr>
                          <th>USUARIO</th>
                          <th>ESTADO</th>
                          <th>GRUPOS</th>
                          <th>PERMISOS</th>
                          <th>ACCIONES</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="usuario in usuarios" :key="`usuario-${usuario.id}`">
                          <!-- Usuario -->
                          <td>
                            <div class="d-flex align-center">
                              <v-avatar size="36" color="primary" class="mr-3">
                                <v-icon>mdi-account</v-icon>
                              </v-avatar>
                              <div>
                                <strong>{{ usuario.username }}</strong>
                                <div class="text-caption">{{ usuario.email }}</div>
                              </div>
                            </div>
                          </td>

                          <!-- Estado -->
                          <td>
                            <v-chip :color="usuario.is_active ? 'green' : 'red'" variant="flat">
                              {{ usuario.is_active ? 'Activo' : 'Inactivo' }}
                            </v-chip>
                            <v-chip
                              v-if="usuario.is_superuser"
                              color="orange"
                              variant="flat"
                              class="ml-1"
                            >
                              Superusuario
                            </v-chip>
                          </td>

                          <!-- Grupos -->
                          <td>
                            <div class="d-flex flex-wrap gap-2">
                              <v-chip
                                v-for="grupo in usuario.groups"
                                :key="`grupo-${grupo.id}`"
                                size="small"
                                color="indigo"
                                variant="outlined"
                              >
                                {{ grupo.name }}
                              </v-chip>
                              <span
                                v-if="usuario.groups.length === 0"
                                class="text-caption text-medium-emphasis"
                                >Sin grupos</span
                              >
                            </div>
                          </td>

                          <!-- Permisos -->
                          <td>
                            <div class="d-flex flex-wrap gap-2">
                              <v-chip
                                v-for="permiso in usuario.user_permissions"
                                :key="`permiso-${permiso.id}`"
                                size="small"
                                color="teal"
                                variant="outlined"
                              >
                                {{ formatPermisoDjango(permiso.name) }}
                              </v-chip>
                              <span
                                v-if="usuario.user_permissions.length === 0"
                                class="text-caption text-medium-emphasis"
                                >Sin permisos directos</span
                              >
                            </div>
                          </td>

                          <!-- Acciones -->
                          <td>
                            <div class="d-flex">
                              <v-btn
                                icon
                                size="small"
                                color="primary"
                                @click.stop="editarUsuario(usuario)"
                                :loading="cargandoEdicion"
                              >
                                <v-icon>mdi-pencil</v-icon>
                              </v-btn>
                              <v-btn
                                icon
                                size="small"
                                color="error"
                                @click.stop="solicitarEliminarUsuario(usuario)"
                                class="ml-1"
                                :loading="cargandoEliminacion"
                              >
                                <v-icon>mdi-delete</v-icon>
                              </v-btn>
                              <v-btn
                                icon
                                size="small"
                                color="info"
                                @click.stop="gestionarPermisosUsuario(usuario)"
                                class="ml-1"
                                :loading="cargandoPermisos"
                              >
                                <v-icon>mdi-shield-account</v-icon>
                              </v-btn>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </v-table>
                  </div>
                </v-card-text>
              </v-card>
            </v-window-item>

            <!-- Tab de Grupos -->
            <v-window-item value="grupos">
              <v-card variant="outlined" class="mt-4">
                <v-toolbar color="primary" density="compact">
                  <v-toolbar-title>GRUPOS DEL SISTEMA</v-toolbar-title>
                  <v-spacer></v-spacer>

                  <v-tooltip text="Agregar Nuevo Grupo" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-bind="props"
                        icon
                        color="black"
                        size="large"
                        class="mx-1"
                        @click="abrirModalNuevoGrupo()"
                        :disabled="cargandoAccion"
                      >
                        <v-icon>mdi-account-group-plus</v-icon>
                      </v-btn>
                    </template>
                  </v-tooltip>
                </v-toolbar>

                <v-card-text>
                  <div class="table-responsive">
                    <v-table class="permisos-table">
                      <thead>
                        <tr>
                          <th>NOMBRE</th>
                          <th>USUARIOS</th>
                          <th>PERMISOS</th>
                          <th>ACCIONES</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="grupo in grupos" :key="`grupo-${grupo.id}`">
                          <!-- Nombre -->
                          <td>
                            <strong>{{ grupo.name }}</strong>
                          </td>

                          <!-- Usuarios -->
                          <td>
                            <div class="d-flex align-center">
                              <v-avatar size="36" color="indigo" class="mr-3">
                                <v-icon>mdi-account-group</v-icon>
                              </v-avatar>
                              <div>
                                <span class="text-body-2">{{ grupo.users.length }} usuario(s)</span>
                              </div>
                            </div>
                          </td>

                          <!-- Permisos -->
                          <td>
                            <div class="d-flex flex-wrap gap-2">
                              <v-chip
                                v-for="permiso in grupo.permissions"
                                :key="`permiso-${permiso.id}`"
                                size="small"
                                color="teal"
                                variant="outlined"
                              >
                                {{ formatPermisoDjango(permiso.name) }}
                              </v-chip>
                              <span
                                v-if="grupo.permissions.length === 0"
                                class="text-caption text-medium-emphasis"
                                >Sin permisos</span
                              >
                            </div>
                          </td>

                          <!-- Acciones -->
                          <td>
                            <div class="d-flex">
                              <v-btn
                                icon
                                size="small"
                                color="primary"
                                @click.stop="editarGrupo(grupo)"
                                :loading="cargandoEdicion"
                              >
                                <v-icon>mdi-pencil</v-icon>
                              </v-btn>
                              <v-btn
                                icon
                                size="small"
                                color="error"
                                @click.stop="solicitarEliminarGrupo(grupo)"
                                class="ml-1"
                                :loading="cargandoEliminacion"
                              >
                                <v-icon>mdi-delete</v-icon>
                              </v-btn>
                              <v-btn
                                icon
                                size="small"
                                color="info"
                                @click.stop="gestionarPermisosGrupo(grupo)"
                                class="ml-1"
                                :loading="cargandoPermisos"
                              >
                                <v-icon>mdi-shield-account</v-icon>
                              </v-btn>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </v-table>
                  </div>
                </v-card-text>
              </v-card>
            </v-window-item>

            <!-- Tab de Permisos -->
            <v-window-item value="permisos">
              <v-card variant="outlined" class="mt-4">
                <v-toolbar color="primary" density="compact">
                  <v-toolbar-title>PERMISOS DEL SISTEMA</v-toolbar-title>
                  <v-spacer></v-spacer>
                </v-toolbar>

                <v-card-text>
                  <div class="table-responsive">
                    <v-table class="permisos-table">
                      <thead>
                        <tr>
                          <th>NOMBRE</th>
                          <th>APLICACIÓN</th>
                          <th>MODELO</th>
                          <th>CODIGO</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="permiso in permisos" :key="`permiso-${permiso.id}`">
                          <!-- Nombre -->
                          <td>
                            <strong>{{ permiso.name }}</strong>
                          </td>

                          <!-- Aplicación -->
                          <td>
                            <v-chip size="small" color="blue-grey" variant="flat">
                              {{ permiso.content_type.app_label }}
                            </v-chip>
                          </td>

                          <!-- Modelo -->
                          <td>
                            {{ formatModeloDjango(permiso.content_type.model) }}
                          </td>

                          <!-- Código -->
                          <td>
                            <code>{{ permiso.codename }}</code>
                          </td>
                        </tr>
                      </tbody>
                    </v-table>
                  </div>
                </v-card-text>
              </v-card>
            </v-window-item>
          </v-window>
        </v-col>
      </v-row>

      <!-- MODALES -->
      <!-- Modal para usuario -->
      <v-dialog v-model="dialogUsuario" max-width="600" persistent>
        <v-card>
          <v-card-title>{{
            usuarioEditando ? 'Editar Usuario' : 'Agregar Nuevo Usuario'
          }}</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="nuevoUsuario.username"
              label="Nombre de usuario"
              variant="outlined"
              required
              :disabled="cargandoAccion"
            ></v-text-field>

            <v-text-field
              v-model="nuevoUsuario.email"
              label="Correo electrónico"
              variant="outlined"
              type="email"
              :disabled="cargandoAccion"
            ></v-text-field>

            <v-text-field
              v-model="nuevoUsuario.password"
              label="Contraseña"
              variant="outlined"
              type="password"
              :disabled="cargandoAccion"
              :required="!usuarioEditando"
            ></v-text-field>

            <v-checkbox
              v-model="nuevoUsuario.is_active"
              label="Usuario activo"
              color="primary"
              hide-details
            ></v-checkbox>

            <v-checkbox
              v-model="nuevoUsuario.is_superuser"
              label="Superusuario"
              color="orange"
              hide-details
              class="mt-2"
            ></v-checkbox>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn color="grey" @click="cerrarModalUsuario">Cancelar</v-btn>
            <v-btn color="primary" @click="guardarUsuario" :loading="cargandoAccion">
              {{ usuarioEditando ? 'Actualizar' : 'Guardar' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Modal para grupo -->
      <v-dialog v-model="dialogGrupo" max-width="600" persistent>
        <v-card>
          <v-card-title>{{ grupoEditando ? 'Editar Grupo' : 'Agregar Nuevo Grupo' }}</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="nuevoGrupo.name"
              label="Nombre del grupo"
              variant="outlined"
              required
              :disabled="cargandoAccion"
            ></v-text-field>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn color="grey" @click="cerrarModalGrupo">Cancelar</v-btn>
            <v-btn color="primary" @click="guardarGrupo" :loading="cargandoAccion">
              {{ grupoEditando ? 'Actualizar' : 'Guardar' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Modal para gestionar permisos -->
      <v-dialog v-model="dialogGestionPermisos" max-width="800" persistent>
        <v-card>
          <v-card-title>
            {{ gestionPermisosTitulo }}
            <v-chip color="primary" variant="outlined" class="ml-2">
              {{ gestionPermisosTipo === 'usuario' ? 'Usuario' : 'Grupo' }}
            </v-chip>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-card variant="outlined">
                  <v-card-title class="text-subtitle-1">Permisos disponibles</v-card-title>
                  <v-card-text>
                    <v-treeview
                      :items="permisosDisponiblesTree"
                      selectable
                      selection-type="independent"
                      v-model="permisosSeleccionados"
                      return-object
                    ></v-treeview>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" md="6">
                <v-card variant="outlined">
                  <v-card-title class="text-subtitle-1">Grupos</v-card-title>
                  <v-card-text>
                    <v-list lines="two">
                      <v-list-item v-for="grupo in gruposDisponibles" :key="grupo.id">
                        <template v-slot:prepend>
                          <v-checkbox
                            v-model="gruposSeleccionados"
                            :value="grupo.id"
                            color="primary"
                            hide-details
                          ></v-checkbox>
                        </template>
                        <v-list-item-title>{{ grupo.name }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn color="grey" @click="cerrarModalGestionPermisos">Cancelar</v-btn>
            <v-btn color="primary" @click="guardarPermisos" :loading="cargandoPermisos">
              Guardar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Modal de confirmación - Eliminar -->
      <v-dialog v-model="dialogConfirmarEliminacion" max-width="500" persistent>
        <v-card>
          <v-card-title class="bg-error text-white">
            <v-icon icon="mdi-alert-circle" class="mr-2"></v-icon>
            Confirmar eliminación
          </v-card-title>
          <v-card-text class="pt-4">
            <p class="text-body-1">
              ¿Está seguro que desea eliminar
              <template v-if="elementoAEliminar.tipo === 'usuario'">
                al usuario <strong>{{ elementoAEliminar.nombre }}</strong
                >?
              </template>
              <template v-else-if="elementoAEliminar.tipo === 'grupo'">
                el grupo <strong>{{ elementoAEliminar.nombre }}</strong
                >?
              </template>
            </p>
            <p class="text-caption text-medium-emphasis mt-2">Esta acción no se puede deshacer.</p>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn
              color="grey"
              @click="dialogConfirmarEliminacion = false"
              :disabled="cargandoEliminacion"
            >
              Cancelar
            </v-btn>
            <v-btn color="error" @click="confirmarEliminar" :loading="cargandoEliminacion">
              Eliminar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <ConfirmDialog></ConfirmDialog>
    </template>

    <v-alert v-if="error && !cargando" type="error" variant="tonal" class="mt-4">
      No se pudo cargar la información de permisos. Por favor intente nuevamente.
    </v-alert>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PaginaTituloIcono from '@/components/layout/partials/PaginaTituloIcono.vue'
import { useSnackbar } from '@/composables/useSnackbar'
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import ConfirmDialog from '@/components/layout/partials/ConfirmDialog.vue'

const { successMsg, errorMsg } = useSnackbar()

// Estados
const cargando = ref(true)
const cargandoAccion = ref(false)
const cargandoEdicion = ref(false)
const cargandoEliminacion = ref(false)
const cargandoPermisos = ref(false)
const error = ref(null)

// Tabs
const tabActual = ref('usuarios')

// Datos
const usuarios = ref([])
const grupos = ref([])
const permisos = ref([])
const gruposDisponibles = ref([])

// Modales
const dialogUsuario = ref(false)
const dialogGrupo = ref(false)
const dialogGestionPermisos = ref(false)
const dialogConfirmarEliminacion = ref(false)

// Formularios
const usuarioEditando = ref(null)
const nuevoUsuario = ref({
  username: '',
  email: '',
  password: '',
  is_active: true,
  is_superuser: false,
})

const grupoEditando = ref(null)
const nuevoGrupo = ref({
  name: '',
})

// Gestión de permisos
const gestionPermisosTipo = ref('usuario') // 'usuario' o 'grupo'
const gestionPermisosTitulo = ref('')
const gestionPermisosId = ref(null)
const permisosDisponiblesTree = ref([])
const permisosSeleccionados = ref([])
const gruposSeleccionados = ref([])

// Eliminación
const elementoAEliminar = ref({
  id: null,
  tipo: '', // 'usuario' o 'grupo'
  nombre: '',
})

// Métodos
const cargarDatos = async () => {
  try {
    cargando.value = true
    error.value = null

    // Simular carga de datos de Django REST Framework
    await Promise.all([cargarUsuarios(), cargarGrupos(), cargarPermisos()])
  } catch (err) {
    console.error('Error al cargar datos de permisos', err)
    error.value = 'No se pudieron cargar los permisos'
  } finally {
    cargando.value = false
  }
}

const cargarUsuarios = async () => {
  // Simular API de Django
  usuarios.value = [
    {
      id: 1,
      username: 'admin',
      email: 'admin@example.com',
      is_active: true,
      is_superuser: true,
      groups: [{ id: 1, name: 'Administradores' }],
      user_permissions: [
        { id: 1, codename: 'add_user', name: 'Can add user' },
        { id: 2, codename: 'change_user', name: 'Can change user' },
      ],
    },
    {
      id: 2,
      username: 'editor',
      email: 'editor@example.com',
      is_active: true,
      is_superuser: false,
      groups: [{ id: 2, name: 'Editores' }],
      user_permissions: [],
    },
    {
      id: 3,
      username: 'usuario1',
      email: 'usuario1@example.com',
      is_active: true,
      is_superuser: false,
      groups: [],
      user_permissions: [],
    },
  ]
}

const cargarGrupos = async () => {
  // Simular API de Django
  grupos.value = [
    {
      id: 1,
      name: 'Administradores',
      users: [1],
      permissions: [
        {
          id: 1,
          codename: 'add_user',
          name: 'Can add user',
          content_type: { app_label: 'auth', model: 'user' },
        },
        {
          id: 2,
          codename: 'change_user',
          name: 'Can change user',
          content_type: { app_label: 'auth', model: 'user' },
        },
      ],
    },
    {
      id: 2,
      name: 'Editores',
      users: [2],
      permissions: [
        {
          id: 3,
          codename: 'view_user',
          name: 'Can view user',
          content_type: { app_label: 'auth', model: 'user' },
        },
      ],
    },
  ]

  gruposDisponibles.value = grupos.value
}

const cargarPermisos = async () => {
  // Simular API de Django
  permisos.value = [
    {
      id: 1,
      codename: 'add_user',
      name: 'Can add user',
      content_type: { app_label: 'auth', model: 'user' },
    },
    {
      id: 2,
      codename: 'change_user',
      name: 'Can change user',
      content_type: { app_label: 'auth', model: 'user' },
    },
    {
      id: 3,
      codename: 'view_user',
      name: 'Can view user',
      content_type: { app_label: 'auth', model: 'user' },
    },
    {
      id: 4,
      codename: 'delete_user',
      name: 'Can delete user',
      content_type: { app_label: 'auth', model: 'user' },
    },
    {
      id: 5,
      codename: 'add_group',
      name: 'Can add group',
      content_type: { app_label: 'auth', model: 'group' },
    },
    {
      id: 6,
      codename: 'change_group',
      name: 'Can change group',
      content_type: { app_label: 'auth', model: 'group' },
    },
  ]

  // Organizar permisos en árbol por aplicación
  const apps = {}
  permisos.value.forEach((permiso) => {
    if (!apps[permiso.content_type.app_label]) {
      apps[permiso.content_type.app_label] = {
        id: `app-${permiso.content_type.app_label}`,
        name: permiso.content_type.app_label,
        children: [],
      }
    }

    const modeloNode = apps[permiso.content_type.app_label].children.find(
      (n) => n.id === `model-${permiso.content_type.model}`,
    )

    if (!modeloNode) {
      apps[permiso.content_type.app_label].children.push({
        id: `model-${permiso.content_type.model}`,
        name: formatModeloDjango(permiso.content_type.model),
        children: [
          {
            id: permiso.id,
            name: permiso.name,
          },
        ],
      })
    } else {
      modeloNode.children.push({
        id: permiso.id,
        name: permiso.name,
      })
    }
  })

  permisosDisponiblesTree.value = Object.values(apps)
}

const abrirModalNuevoUsuario = () => {
  usuarioEditando.value = null
  nuevoUsuario.value = {
    username: '',
    email: '',
    password: '',
    is_active: true,
    is_superuser: false,
  }
  dialogUsuario.value = true
}

const editarUsuario = (usuario) => {
  usuarioEditando.value = usuario
  nuevoUsuario.value = {
    username: usuario.username,
    email: usuario.email,
    password: '',
    is_active: usuario.is_active,
    is_superuser: usuario.is_superuser,
  }
  dialogUsuario.value = true
}

const guardarUsuario = async () => {
  try {
    cargandoAccion.value = true

    // Validación básica
    if (!nuevoUsuario.value.username) {
      errorMsg('El nombre de usuario es requerido')
      return
    }

    // Simular guardado en API
    await new Promise((resolve) => setTimeout(resolve, 800))

    if (usuarioEditando.value) {
      // Actualizar usuario
      const index = usuarios.value.findIndex((u) => u.id === usuarioEditando.value.id)
      if (index !== -1) {
        usuarios.value[index] = {
          ...usuarios.value[index],
          username: nuevoUsuario.value.username,
          email: nuevoUsuario.value.email,
          is_active: nuevoUsuario.value.is_active,
          is_superuser: nuevoUsuario.value.is_superuser,
        }
      }
      successMsg('Usuario actualizado correctamente')
    } else {
      // Crear nuevo usuario
      const nuevoId = Math.max(...usuarios.value.map((u) => u.id), 0) + 1
      usuarios.value.push({
        id: nuevoId,
        username: nuevoUsuario.value.username,
        email: nuevoUsuario.value.email,
        is_active: nuevoUsuario.value.is_active,
        is_superuser: nuevoUsuario.value.is_superuser,
        groups: [],
        user_permissions: [],
      })
      successMsg('Usuario creado correctamente')
    }

    cerrarModalUsuario()
  } catch (error) {
    console.error('Error al guardar usuario', error)
    errorMsg('No se pudo guardar el usuario')
  } finally {
    cargandoAccion.value = false
  }
}

const cerrarModalUsuario = () => {
  dialogUsuario.value = false
  usuarioEditando.value = null
}

const abrirModalNuevoGrupo = () => {
  grupoEditando.value = null
  nuevoGrupo.value = {
    name: '',
  }
  dialogGrupo.value = true
}

const editarGrupo = (grupo) => {
  grupoEditando.value = grupo
  nuevoGrupo.value = {
    name: grupo.name,
  }
  dialogGrupo.value = true
}

const guardarGrupo = async () => {
  try {
    cargandoAccion.value = true

    // Validación básica
    if (!nuevoGrupo.value.name) {
      errorMsg('El nombre del grupo es requerido')
      return
    }

    // Simular guardado en API
    await new Promise((resolve) => setTimeout(resolve, 800))

    if (grupoEditando.value) {
      // Actualizar grupo
      const index = grupos.value.findIndex((g) => g.id === grupoEditando.value.id)
      if (index !== -1) {
        grupos.value[index].name = nuevoGrupo.value.name
      }
      successMsg('Grupo actualizado correctamente')
    } else {
      // Crear nuevo grupo
      const nuevoId = Math.max(...grupos.value.map((g) => g.id), 0) + 1
      grupos.value.push({
        id: nuevoId,
        name: nuevoGrupo.value.name,
        users: [],
        permissions: [],
      })
      gruposDisponibles.value = grupos.value
      successMsg('Grupo creado correctamente')
    }

    cerrarModalGrupo()
  } catch (error) {
    console.error('Error al guardar grupo', error)
    errorMsg('No se pudo guardar el grupo')
  } finally {
    cargandoAccion.value = false
  }
}

const cerrarModalGrupo = () => {
  dialogGrupo.value = false
  grupoEditando.value = null
}

const gestionarPermisosUsuario = (usuario) => {
  gestionPermisosTipo.value = 'usuario'
  gestionPermisosTitulo.value = `Permisos de ${usuario.username}`
  gestionPermisosId.value = usuario.id

  // Cargar permisos actuales del usuario
  permisosSeleccionados.value = usuario.user_permissions.map((p) => p.id)

  // Cargar grupos actuales del usuario
  gruposSeleccionados.value = usuario.groups.map((g) => g.id)

  dialogGestionPermisos.value = true
}

const gestionarPermisosGrupo = (grupo) => {
  gestionPermisosTipo.value = 'grupo'
  gestionPermisosTitulo.value = `Permisos del grupo ${grupo.name}`
  gestionPermisosId.value = grupo.id

  // Cargar permisos actuales del grupo
  permisosSeleccionados.value = grupo.permissions.map((p) => p.id)

  dialogGestionPermisos.value = true
}

const guardarPermisos = async () => {
  try {
    cargandoPermisos.value = true

    // Simular guardado en API
    await new Promise((resolve) => setTimeout(resolve, 800))

    if (gestionPermisosTipo.value === 'usuario') {
      // Actualizar permisos de usuario
      const usuarioIndex = usuarios.value.findIndex((u) => u.id === gestionPermisosId.value)
      if (usuarioIndex !== -1) {
        usuarios.value[usuarioIndex].user_permissions = permisos.value.filter((p) =>
          permisosSeleccionados.value.includes(p.id),
        )

        // Actualizar grupos del usuario
        usuarios.value[usuarioIndex].groups = grupos.value.filter((g) =>
          gruposSeleccionados.value.includes(g.id),
        )
      }
      successMsg('Permisos de usuario actualizados')
    } else {
      // Actualizar permisos de grupo
      const grupoIndex = grupos.value.findIndex((g) => g.id === gestionPermisosId.value)
      if (grupoIndex !== -1) {
        grupos.value[grupoIndex].permissions = permisos.value.filter((p) =>
          permisosSeleccionados.value.includes(p.id),
        )
      }
      successMsg('Permisos de grupo actualizados')
    }

    cerrarModalGestionPermisos()
  } catch (error) {
    console.error('Error al guardar permisos', error)
    errorMsg('No se pudieron guardar los permisos')
  } finally {
    cargandoPermisos.value = false
  }
}

const cerrarModalGestionPermisos = () => {
  dialogGestionPermisos.value = false
  permisosSeleccionados.value = []
  gruposSeleccionados.value = []
}

const solicitarEliminarUsuario = (usuario) => {
  elementoAEliminar.value = {
    id: usuario.id,
    tipo: 'usuario',
    nombre: usuario.username,
  }
  dialogConfirmarEliminacion.value = true
}

const solicitarEliminarGrupo = (grupo) => {
  elementoAEliminar.value = {
    id: grupo.id,
    tipo: 'grupo',
    nombre: grupo.name,
  }
  dialogConfirmarEliminacion.value = true
}

const confirmarEliminar = async () => {
  try {
    cargandoEliminacion.value = true

    // Simular eliminación en API
    await new Promise((resolve) => setTimeout(resolve, 800))

    if (elementoAEliminar.value.tipo === 'usuario') {
      // Eliminar usuario
      usuarios.value = usuarios.value.filter((u) => u.id !== elementoAEliminar.value.id)
      successMsg('Usuario eliminado correctamente')
    } else {
      // Eliminar grupo
      grupos.value = grupos.value.filter((g) => g.id !== elementoAEliminar.value.id)
      gruposDisponibles.value = gruposDisponibles.value.filter(
        (g) => g.id !== elementoAEliminar.value.id,
      )

      // Quitar el grupo de los usuarios
      usuarios.value.forEach((usuario) => {
        usuario.groups = usuario.groups.filter((g) => g.id !== elementoAEliminar.value.id)
      })

      successMsg('Grupo eliminado correctamente')
    }

    dialogConfirmarEliminacion.value = false
  } catch (error) {
    console.error('Error al eliminar', error)
    errorMsg('No se pudo completar la eliminación')
  } finally {
    cargandoEliminacion.value = false
  }
}

// Helpers para mostrar datos
const formatPermisoDjango = (permisoName) => {
  // Eliminar el prefijo "Can " de los permisos de Django
  return permisoName.replace(/^Can /, '')
}

const formatModeloDjango = (modelName) => {
  // Formatear nombres de modelo para mostrarlos mejor
  const nombres = {
    user: 'Usuario',
    group: 'Grupo',
    permission: 'Permiso',
  }
  return nombres[modelName] || modelName
}

// Carga inicial
onMounted(() => {
  cargarDatos()
})
</script>

<style scoped>
.django-permisos-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 16px;
}

.permisos-table {
  border-collapse: separate;
  border-spacing: 0 8px;
  width: 100%;
}

.permisos-table thead th {
  background-color: #f5f5f5;
  position: sticky;
  top: 0;
  z-index: 2;
  font-weight: 600;
  padding: 12px 16px;
}

@media (max-width: 960px) {
  .django-permisos-container {
    padding: 16px 12px;
  }

  .permisos-table {
    display: block;
    overflow-x: auto;
  }
}
</style>
