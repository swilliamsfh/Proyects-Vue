<template>
  <nav>
    <!-- Enlaces de navegación -->
    <router-link to="/">Inicio</router-link> |
    <router-link to="/about">Acerca de</router-link>
    <router-link v-if="authStore.showHide" to="#" @click.prevent="logout"
      >Cerrar sesión</router-link
    >
  </nav>

  <!-- Aquí se inyectará el componente de la ruta activa (HomeView o AboutView) -->
  <router-view />
</template>
<script setup>
import { useAuthStore } from "@/store/auth";

const authStore = useAuthStore();
console.log("authStore.showHide:", authStore.showHide);
function logout() {
  authStore.logout();
}
</script>
