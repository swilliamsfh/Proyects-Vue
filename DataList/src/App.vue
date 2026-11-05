<template>
  <nav>
    <!-- Enlaces de navegación -->
    <router-link to="/">Inicio</router-link> |
    <router-link to="/about">Acerca de</router-link>
  </nav>

  <!-- Aquí se inyectará el componente de la ruta activa (HomeView o AboutView) -->
  <router-view />
</template>
