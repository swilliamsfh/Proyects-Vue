<template>
  <div class="Login_ontainer">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="username">Usuario:</label>
        <input type="text" id="username" v-model="username" required />
      </div>
      <div class="form-group">
        <label for="password">Contraseña:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">Iniciar sesión</button>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useAuthStore } from "@/store/auth";

const authStore = useAuthStore();
const username = ref("");
const password = ref("");

const handleLogin = async () => {
  try {
    await authStore.loginUser({
      username: username.value,
      password: password.value,
    });
  } catch (error) {
    // El error ya es capturado y guardado en authStore.errorMsg por Pinia,
    // pero mantenemos el catch por si necesitas ejecutar algo extra en el componente.
    console.error("Fallo en el inicio de sesión");
    console.log("Login response:", authStore.errorMsg);
  } finally {
  }
};
</script>
