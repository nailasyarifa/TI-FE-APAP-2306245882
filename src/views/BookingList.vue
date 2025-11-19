<template>
  <div class="booking-list">
    <h1 class="page-title">Booking List</h1>

    <div class="actions-bar">
      <div class="left-actions">
        <router-link to="/bookings/new" class="btn-primary">
          Create New Booking
        </router-link>
        <router-link to="/bookings/statistics" class="btn-primary">
          View Statistics
        </router-link>
      </div>
    </div>

    <div v-if="loading" class="loading">Loading bookings...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="bookings.length === 0" class="no-data">No bookings found</div>
    <table v-else class="table">
      <thead>
        <tr>
          <th>No</th>
          <th>ID</th>
          <th>Vehicle</th>
          <th>Pick Up</th>
          <th>Drop Off</th>
          <th>Status</th>
          <th>Total Price</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(booking, index) in bookings" :key="booking.id">
          <td>{{ index + 1 }}</td>
          <td>{{ booking.id }}</td>
          <td>{{ booking.vehicle.brand }} {{ booking.vehicle.model }}</td>
          <td>{{ formatDate(booking.pickUpTime) }}</td>
          <td>{{ formatDate(booking.dropOffTime) }}</td>
          <td>
            <span :class="['status-badge', booking.status.toLowerCase()]">
              {{ booking.status }}
            </span>
          </td>
          <td>{{ formatCurrency(booking.totalPrice) }}</td>
          <td>
            <router-link :to="`/bookings/${booking.id}`" class="btn-detail">
              Detail
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { bookingService } from '../services/bookingService';
import type { RentalBooking } from '../types';

const bookings = ref<RentalBooking[]>([]);
const loading = ref(false);
const error = ref('');

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const loadBookings = async () => {
  loading.value = true;
  error.value = '';
  try {
    bookings.value = await bookingService.getAllBookings();
  } catch (err) {
    error.value = 'Failed to load bookings';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadBookings();
});
</script>

<style scoped>
.booking-list {
  padding: 2rem;
}

.page-title {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #111827;
}

.actions-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.left-actions {
  display: flex;
  gap: 1rem;
}

.loading, .error, .no-data {
  text-align: center;
  padding: 3rem;
  font-size: 1.125rem;
}

.error {
  color: #ef4444;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-badge.upcoming {
  background-color: #dbeafe;
  color: #1e40af;
}

.status-badge.ongoing {
  background-color: #fef3c7;
  color: #92400e;
}

.status-badge.done {
  background-color: #d1fae5;
  color: #065f46;
}

.btn-detail {
  padding: 0.5rem 1rem;
  background-color: #10b981;
  color: white;
  text-decoration: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: background-color 0.2s;
  display: inline-block;
}

.btn-detail:hover {
  background-color: #059669;
}
</style>

