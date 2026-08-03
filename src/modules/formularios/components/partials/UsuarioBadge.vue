<template>
  <div class="usuario-badge">
    <v-icon color="primary" size="18" class="mr-2">mdi-account-circle</v-icon>
    <div>
      <div class="usuario-nombre">{{ nombre || 'No disponible' }}</div>
      <div class="usuario-cargo" v-if="cargo">{{ cargo }}</div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user'
import { computed } from 'vue'

const props = defineProps({
  userId: { type: [Number, String], required: true },
})

const usuarioStore = useUserStore()

const usuario = computed(() => {
  if (!props.userId) return null
  return usuarioStore.listaDeUsuarioCompleta?.find((u) => u.id === props.userId) || null
})

const nombre = computed(() => {
  if (!usuario.value) return null
  return `${usuario.value.nombre || ''} ${usuario.value.paterno || ''} ${usuario.value.materno || ''}`.trim()
})

const cargo = computed(() => usuario.value?.cargo || null)
</script>

<style scoped>
.usuario-badge {
  display: flex;
  align-items: center;
  padding: 4px 0;
}
.usuario-nombre {
  font-size: 13px;
  font-weight: 500;
  color: #333;
  line-height: 1.3;
}
.usuario-cargo {
  font-size: 10px;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
</style>
