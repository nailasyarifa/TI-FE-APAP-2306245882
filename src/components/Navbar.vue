<template>
  <nav class="navbar">
    <div class="navbar-container">
      <router-link to="/" class="navbar-logo">
        Vehicle Rental App
      </router-link>
      <div class="navbar-menu">
        <router-link to="/vehicles" class="navbar-item" active-class="active">
          Vehicles
        </router-link>
        <router-link to="/bookings" class="navbar-item" active-class="active">
          Bookings
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
</script>

<style scoped>
.navbar {
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #10b981;
  text-decoration: none;
  transition: color 0.3s;
}

.navbar-logo:hover {
  color: #059669;
}

.navbar-menu {
  display: flex;
  gap: 2rem;
}

.navbar-item {
  color: #4b5563;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
}

.navbar-item:hover {
  color: #10b981;
  background-color: #f0fdf4;
}

.navbar-item.active {
  color: #10b981;
  background-color: #f0fdf4;
}
</style>

