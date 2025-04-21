<template>
  <v-container>
    <v-row>
      <!-- Columna principal -->
      <v-col cols="12" md="9" lg="9"> </v-col>
      <!-- Columna lateral -->
      <v-col cols="12" md="3" lg="3">
        <!-- Tarjeta de acciones -->
        <v-card class="mb-4" elevation="2">
          <v-card-title class="primary white--text">
            <v-icon left>mdi-cog</v-icon>
            Acciones
          </v-card-title>
          <v-list density="comfortable">
            <v-list-item
              to="/proyecto/nuevo"
              title="Nuevo Proyecto"
              prepend-icon="mdi-plus-circle"
              class="text-primary"
            ></v-list-item>

            <v-list-item title="Exportar lista" prepend-icon="mdi-file-export"></v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup></script>

<style scoped></style>
