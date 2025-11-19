<template>
  <div class="booking-statistics">
    <div class="header">
      <h1 class="page-title">Booking Statistics</h1>
      <router-link to="/bookings" class="btn-secondary">Back to Bookings</router-link>
    </div>

    <div v-if="loading" class="loading">Loading statistics...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="stats-container">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-number">{{ stats.totalBookings }}</div>
          <div class="stat-label">Total Bookings</div>
        </div>

        <div class="stat-card upcoming">
          <div class="stat-icon">📅</div>
          <div class="stat-number">{{ stats.upcomingBookings }}</div>
          <div class="stat-label">Upcoming Bookings</div>
        </div>

        <div class="stat-card ongoing">
          <div class="stat-icon">🚗</div>
          <div class="stat-number">{{ stats.ongoingBookings }}</div>
          <div class="stat-label">Ongoing Bookings</div>
        </div>

        <div class="stat-card completed">
          <div class="stat-icon">✅</div>
          <div class="stat-number">{{ stats.completedBookings }}</div>
          <div class="stat-label">Completed Bookings</div>
        </div>

        <div class="stat-card revenue">
          <div class="stat-icon">💰</div>
          <div class="stat-number">{{ formatCurrency(stats.totalRevenue) }}</div>
          <div class="stat-label">Total Revenue</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { bookingService } from '../services/bookingService';
import type { BookingStatistics } from '../types';

const stats = ref<BookingStatistics>({
  totalBookings: 0,
  upcomingBookings: 0,
  ongoingBookings: 0,
  completedBookings: 0,
  totalRevenue: 0,
});

const loading = ref(false);
const error = ref('');

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const loadStatistics = async () => {
  loading.value = true;
  error.value = '';
  try {
    stats.value = await bookingService.getBookingStatistics();
  } catch (err) {
    error.value = 'Failed to load statistics';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadStatistics();
});
</script>

<style scoped>
.booking-statistics {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-title {
  font-size: 2rem;
  color: #111827;
}

.loading, .error {
  text-align: center;
  padding: 3rem;
  font-size: 1.125rem;
}

.error {
  color: #ef4444;
}

.stats-container {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.stat-card {
  background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 2px solid #e5e7eb;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.stat-card.upcoming {
  border-color: #3b82f6;
  background: linear-gradient(135deg, #dbeafe 0%, #ffffff 100%);
}

.stat-card.ongoing {
  border-color: #f59e0b;
  background: linear-gradient(135deg, #fef3c7 0%, #ffffff 100%);
}

.stat-card.completed {
  border-color: #10b981;
  background: linear-gradient(135deg, #d1fae5 0%, #ffffff 100%);
}

.stat-card.revenue {
  border-color: #8b5cf6;
  background: linear-gradient(135deg, #ede9fe 0%, #ffffff 100%);
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
  font-weight: 500;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>

