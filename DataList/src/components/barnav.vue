<script setup>
const enlaces = [
  { nombre: "Agregar", ruta: "/inicio", routeName: "Home" },
  { nombre: "Editar", ruta: "/servicios", routeName: "Servicios" },
  { nombre: "Perfil", ruta: "/perfil", routeName: "PerfilUsuario" },
];
</script>
<template>
  <nav class="navbar">
    <!-- Sección derecha: Enlaces de navegación -->
    <ul class="navbar-menu">
      <li v-for="item in enlaces" :key="item.routeName">
        <RouterLink
          :to="item.ruta"
          class="nav-link"
          :class="{ activo: nombreRutaActual === item.routeName }"
        >
          {{ item.nombre }}
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding: 0rem 2rem;
  background-color: #1e293b;
  color: #ffffff;
  width: 64%;
  height: 40px;
}

.badge-ruta {
  background-color: #3b82f6;
  padding: 0.25rem 0.25rem;
  border-radius: 999px;
  font-size: 0.85rem;
}

.navbar-menu {
  display: flex;
  list-style: none;
  gap: 1.5rem;
  margin: 0;
  padding: 0;
}

.nav-link {
  color: #cbd5e1;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-link:hover,
.nav-link.activo {
  color: #38bdf8;
  border-bottom: 2px solid #38bdf8;
}
</style>
