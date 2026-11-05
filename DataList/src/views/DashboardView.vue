<template>
  <div>
    <h1>Bienvenido a tu Panel Privado</h1>
    <p>Esta información es confidencial.</p>
    <button @click="handleLogout">Cerrar Sesión</button>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const handleLogout = () => {
  // 1. Destruir la sesión actual
  localStorage.removeItem("user_token");

  // 2. Mandar al usuario al login
  router.push({ name: "login" });
};
</script>
