<!-- AsideArbolPresupuesto.vue -->
<template>
  <div class="arbol-aside">
    <div class="arbol-content">
      <!-- ═══════════ PROYECTO (Raíz) ═══════════ -->
      <div class="arbol-raiz">
        <div class="raiz-header">
          <v-icon color="primary" size="22">mdi-folder-home</v-icon>
          <div class="ml-2">
            <div class="text-body-2 font-weight-bold">PROYTESTMONITOREO</div>
            <div class="text-caption text-medium-emphasis">Presupuesto: Bs 500,000</div>
          </div>
        </div>
        <v-progress-linear model-value="70" color="primary" height="4" rounded class="mt-2 mb-1" />
        <div class="d-flex justify-space-between text-caption">
          <span>Planificado: Bs 350,000</span>
          <span class="text-success">Saldo: Bs 150,000</span>
        </div>
      </div>

      <!-- ═══════════ ÁRBOL ═══════════ -->
      <v-treeview
        :items="arbolItems"
        density="compact"
        item-value="id"
        item-title="titulo"
        open-on-click
        expand-icon="mdi-chevron-down"
        collapse-icon="mdi-chevron-up"
      >
        <template #title="{ item }">
          <div class="tree-node">
            <v-icon v-if="item.icono" size="14" :color="item.iconoColor" class="mr-1">
              {{ item.icono }}
            </v-icon>

            <!-- Chip de tipo: Actividad / Subactividad / Financiador / Resumen -->
            <v-chip
              v-if="item.tipo"
              size="x-small"
              :color="tipoColor(item.tipo)"
              variant="flat"
              class="mr-1"
            >
              {{ item.tipo }}
            </v-chip>

            <v-chip
              v-if="item.estado"
              size="x-small"
              :color="item.color"
              variant="flat"
              class="mr-1"
            >
              {{ item.estado }}
            </v-chip>
            <span class="text-body-2">{{ item.titulo }}</span>
            <v-spacer></v-spacer>
            <span class="text-caption font-weight-medium">{{ item.monto }}</span>
          </div>
        </template>

        <template #append="{ item }">
          <v-chip v-if="item.excluida" size="x-small" color="grey" variant="flat" class="ml-1">
            Excluida
          </v-chip>
        </template>
      </v-treeview>
    </div>
  </div>
</template>

<script setup>
defineEmits(['close'])

const tipoColor = (tipo) =>
  ({
    Actividad: 'primary',
    Subactividad: 'secondary',
    Financiador: 'green',
    Resumen: 'info',
  })[tipo] || 'default'

const arbolItems = [
  {
    id: 1,
    titulo: 'Actividades',
    color: 'primary',
    children: [
      // ═══ Actividad A - PLAN - Con desglose ═══
      {
        id: 'a-1',
        titulo: 'Reunión de aliados',
        tipo: 'Actividad',
        estado: 'PLAN',
        color: 'warning',
        monto: 'Bs 150,000',
        children: [
          {
            id: 'a-1-t-1',
            titulo: 'Traslado de mobiliario',
            tipo: 'Subactividad',
            monto: 'Bs 60,000',
            icono: 'mdi-checkbox-blank-outline',
            iconoColor: 'grey',
            children: [
              {
                id: 'a-1-t-1-f1',
                titulo: 'TGN',
                tipo: 'Financiador',
                monto: 'Bs 40,000',
                icono: 'mdi-cash',
                iconoColor: 'green',
              },
              {
                id: 'a-1-t-1-f2',
                titulo: 'IDH',
                tipo: 'Financiador',
                monto: 'Bs 20,000',
                icono: 'mdi-cash',
                iconoColor: 'green',
              },
            ],
          },
          {
            id: 'a-1-t-2',
            titulo: 'Preparación de materiales',
            tipo: 'Subactividad',
            monto: 'Bs 40,000',
            icono: 'mdi-checkbox-blank-outline',
            iconoColor: 'grey',
            children: [
              {
                id: 'a-1-t-2-f1',
                titulo: 'TGN',
                tipo: 'Financiador',
                monto: 'Bs 25,000',
                icono: 'mdi-cash',
                iconoColor: 'green',
              },
              {
                id: 'a-1-t-2-f2',
                titulo: 'Propios',
                tipo: 'Financiador',
                monto: 'Bs 15,000',
                icono: 'mdi-cash',
                iconoColor: 'green',
              },
            ],
          },
          {
            id: 'a-1-resumen',
            titulo: 'Total tareas: Bs 100,000',
            tipo: 'Resumen',
            monto: 'Saldo: Bs 50,000',
            icono: 'mdi-chart-pie',
            iconoColor: 'primary',
          },
        ],
      },
      // ═══ Actividad B - EJEC - Con desglose ═══
      {
        id: 'a-2',
        titulo: 'Seminario de actualización',
        tipo: 'Actividad',
        estado: 'EJEC',
        color: 'info',
        monto: 'Bs 200,000',
        children: [
          {
            id: 'a-2-t-1',
            titulo: 'Contratación de facilitadores',
            tipo: 'Subactividad',
            monto: 'Bs 80,000',
            icono: 'mdi-checkbox-blank-outline',
            iconoColor: 'grey',
            children: [
              {
                id: 'a-2-t-1-f1',
                titulo: 'TGN',
                tipo: 'Financiador',
                monto: 'Bs 50,000',
                icono: 'mdi-cash',
                iconoColor: 'green',
              },
              {
                id: 'a-2-t-1-f2',
                titulo: 'MISEREOR',
                tipo: 'Financiador',
                monto: 'Bs 30,000',
                icono: 'mdi-cash',
                iconoColor: 'green',
              },
            ],
          },
          {
            id: 'a-2-t-2',
            titulo: 'Compra de materiales',
            tipo: 'Subactividad',
            monto: 'Bs 45,000',
            icono: 'mdi-checkbox-blank-outline',
            iconoColor: 'grey',
            children: [
              {
                id: 'a-2-t-2-f1',
                titulo: 'UNITAS',
                tipo: 'Financiador',
                monto: 'Bs 45,000',
                icono: 'mdi-cash',
                iconoColor: 'green',
              },
            ],
          },
          {
            id: 'a-2-resumen',
            titulo: 'Total tareas: Bs 125,000',
            tipo: 'Resumen',
            monto: 'Saldo: Bs 75,000',
            icono: 'mdi-chart-pie',
            iconoColor: 'primary',
          },
        ],
      },
      // ═══ Actividad C - PLAN - Sin desglose ═══
      {
        id: 'a-3',
        titulo: 'Capacitación al personal',
        tipo: 'Actividad',
        estado: 'PLAN',
        color: 'warning',
        monto: 'Bs 80,000',
        children: [
          {
            id: 'a-3-t-1',
            titulo: 'Alquiler de salón',
            tipo: 'Subactividad',
            monto: 'Bs 30,000',
            icono: 'mdi-checkbox-blank-outline',
            iconoColor: 'grey',
          },
          {
            id: 'a-3-t-2',
            titulo: 'Refrigerios',
            tipo: 'Subactividad',
            monto: 'Bs 15,000',
            icono: 'mdi-checkbox-blank-outline',
            iconoColor: 'grey',
          },
          {
            id: 'a-3-resumen',
            titulo: 'Total tareas: Bs 45,000',
            tipo: 'Resumen',
            monto: 'Saldo: Bs 35,000',
            icono: 'mdi-chart-pie',
            iconoColor: 'primary',
          },
        ],
      },
      // ═══ Actividad D - CRD (Excluida) ═══
      {
        id: 'a-4',
        titulo: 'Actividad de prueba',
        tipo: 'Actividad',
        estado: 'CRD',
        color: 'grey',
        monto: 'Bs 100,000',
        excluida: true,
      },
    ],
  },
]
</script>

<style scoped>
.arbol-aside {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
}

.arbol-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.arbol-raiz {
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
  border-left: 4px solid rgb(var(--v-theme-primary));
  margin-bottom: 16px;
}

.raiz-header {
  display: flex;
  align-items: center;
}

.tree-node {
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
}

:deep(.v-treeview-item) {
  padding-left: 8px;
}

:deep(.v-treeview-item__toggle) {
  margin-right: 4px;
}

:deep(.v-treeview-item__content) {
  padding: 4px 0;
}
</style>
