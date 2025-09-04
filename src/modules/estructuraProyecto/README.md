# Módulo estructuraProyecto

Modulo para la edicion y analisis de la estrcutura del proyecto.

---

### Componentes

- **`EstructuraProyecto.vue`**: Muestra y permite la edición del perfil de usuario.

### Stores (Pinia)

- **`userStore`**: Contiene el estado de autenticación (`isAuthenticated`), el objeto de usuario (`currentUser`) y las acciones para `login`, `logout` y `fetchProfile`.

### Endpoints de API

- `GET /api/users/me`
- `PATCH /api/users/me`
- `POST /api/auth/login`

### Guía de Uso

Para usar el `userStore` en cualquier componente, impórtalo y úsalo de la siguiente manera:

```javascript
import { useUserStore } from '@/stores/userStore'
import { onMounted } from 'vue'

const userStore = useUserStore()

onMounted(() => {
  if (userStore.isAuthenticated) {
    userStore.fetchProfile()
  }
})
```
