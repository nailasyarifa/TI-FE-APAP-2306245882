<template>
  <div class="home">
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">
          Welcome to <span class="highlight">Vehicle Rentals</span>
        </h1>
        <p class="hero-subtitle">
          Find and book your ideal vehicle easily. Quick, reliable, and ready for your next adventure!
        </p>
      </div>
      <div class="hero-gradient"></div>
    </div>

    <div class="stats-section">
      <h2 class="section-title">Platform Statistics</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon vehicle-icon">🚗</div>
          <div class="stat-number">{{ stats.totalVehicles }}</div>
          <div class="stat-label">Registered Vehicles</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon vendor-icon">👥</div>
          <div class="stat-number">{{ stats.totalVendors }}</div>
          <div class="stat-label">Registered Vendors</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon booking-icon">📅</div>
          <div class="stat-number">{{ stats.totalBookings }}</div>
          <div class="stat-label">Bookings Made</div>
        </div>
      </div>
    </div>

    <div class="cta-section">
      <router-link to="/vehicles" class="cta-button">
        See Vehicles
      </router-link>
      <router-link to="/bookings/new" class="cta-button">
        Book Rentals
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { homeService } from '../services/homeService';
import type { HomeStats } from '../types';

const stats = ref<HomeStats>({
  totalVehicles: 0,
  totalVendors: 0,
  totalBookings: 0,
});

const loadStats = async () => {
  try {
    stats.value = await homeService.getHomeStats();
  } catch (error) {
    console.error('Failed to load stats:', error);
  }
};

onMounted(() => {
  loadStats();
});
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
}

.hero-section {
  position: relative;
  padding: 4rem 2rem;
  margin-bottom: 3rem;
  overflow: hidden;
}

.hero-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  border-radius: 0 50% 50% 0;
  z-index: -1;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-title {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #111827;
}

.highlight {
  color: #10b981;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: #6b7280;
  max-width: 600px;
}

.stats-section {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 2rem;
  color: #111827;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #111827;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1rem;
  color: #6b7280;
}

.cta-section {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 3rem;
}

.cta-button {
  padding: 1rem 2rem;
  background-color: #10b981;
  color: white;
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1.125rem;
  transition: background-color 0.2s;
}

.cta-button:hover {
  background-color: #059669;
}
</style>

