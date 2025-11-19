<template>
  <div class="booking-detail">
    <div class="header">
      <h1 class="page-title">Booking Details</h1>
      <div class="actions">
        <router-link to="/bookings" class="btn-secondary">Back to List</router-link>
        <router-link :to="`/bookings/${bookingId}/edit`" class="btn-primary">Edit</router-link>
        <button @click="handleCancel" class="btn-danger">Cancel Booking</button>
      </div>
    </div>

    <div v-if="loading" class="loading">Loading booking details...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="booking" class="detail-card">
      <div class="detail-grid">
        <div class="detail-item">
          <label>Booking ID:</label>
          <span>{{ booking.id }}</span>
        </div>
        <div class="detail-item">
          <label>Status:</label>
          <span :class="['status-badge', booking.status.toLowerCase()]">
            {{ booking.status }}
          </span>
        </div>
        <div class="detail-item full-width">
          <label>Vehicle:</label>
          <span>{{ booking.vehicle.brand }} {{ booking.vehicle.model }} ({{ booking.vehicle.type }})</span>
        </div>
        <div class="detail-item">
          <label>Pick Up Time:</label>
          <span>{{ formatDate(booking.pickUpTime) }}</span>
        </div>
        <div class="detail-item">
          <label>Drop Off Time:</label>
          <span>{{ formatDate(booking.dropOffTime) }}</span>
        </div>
        <div class="detail-item">
          <label>Pick Up Location:</label>
          <span>{{ booking.pickUpLocation }}</span>
        </div>
        <div class="detail-item">
          <label>Drop Off Location:</label>
          <span>{{ booking.dropOffLocation }}</span>
        </div>
        <div class="detail-item">
          <label>Capacity Needed:</label>
          <span>{{ booking.capacityNeeded }} passengers</span>
        </div>
        <div class="detail-item">
          <label>Transmission Needed:</label>
          <span>{{ booking.transmissionNeeded }}</span>
        </div>
        <div class="detail-item">
          <label>Include Driver:</label>
          <span>{{ booking.includeDriver ? 'Yes' : 'No' }}</span>
        </div>
        <div class="detail-item">
          <label>Total Price:</label>
          <span class="price">{{ formatCurrency(booking.totalPrice) }}</span>
        </div>
        <div v-if="booking.listOfAddOns.length > 0" class="detail-item full-width">
          <label>Add-Ons:</label>
          <ul class="addon-list">
            <li v-for="addon in booking.listOfAddOns" :key="addon.id">
              {{ addon.name }} - {{ formatCurrency(addon.price) }}
            </li>
          </ul>
        </div>
      </div>

      <div class="status-update-section">
        <h3>Update Status</h3>
        <div class="status-update-form">
          <select v-model="newStatus">
            <option value="Upcoming">Upcoming</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Done">Done</option>
          </select>
          <button @click="handleStatusUpdate" class="btn-primary">Update Status</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { bookingService } from '../services/bookingService';
import type { RentalBooking } from '../types';

const route = useRoute();
const router = useRouter();
const bookingId = route.params.id as string;

const booking = ref<RentalBooking | null>(null);
const loading = ref(false);
const error = ref('');
const newStatus = ref('Upcoming');

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
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const loadBooking = async () => {
  loading.value = true;
  error.value = '';
  try {
    booking.value = await bookingService.getBookingById(bookingId);
    newStatus.value = booking.value.status;
  } catch (err) {
    error.value = 'Failed to load booking details';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const handleStatusUpdate = async () => {
  try {
    await bookingService.updateBookingStatus(bookingId, newStatus.value);
    alert('Status updated successfully');
    await loadBooking();
  } catch (err) {
    alert('Failed to update status');
    console.error(err);
  }
};

const handleCancel = async () => {
  if (!confirm('Are you sure you want to cancel this booking?')) {
    return;
  }
  
  try {
    await bookingService.cancelBooking(bookingId);
    alert('Booking cancelled successfully');
    router.push('/bookings');
  } catch (err) {
    alert('Failed to cancel booking');
    console.error(err);
  }
};

onMounted(() => {
  loadBooking();
});
</script>

<style scoped>
.booking-detail {
  padding: 2rem;
  max-width: 900px;
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

.actions {
  display: flex;
  gap: 1rem;
}

.loading, .error {
  text-align: center;
  padding: 3rem;
  font-size: 1.125rem;
}

.error {
  color: #ef4444;
}

.detail-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-item.full-width {
  grid-column: 1 / -1;
}

.detail-item label {
  font-weight: 600;
  color: #6b7280;
  font-size: 0.875rem;
}

.detail-item span {
  font-size: 1rem;
  color: #111827;
}

.price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #10b981;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  display: inline-block;
  width: fit-content;
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

.addon-list {
  list-style: none;
  padding: 0;
}

.addon-list li {
  padding: 0.5rem;
  background-color: #f9fafb;
  border-radius: 0.375rem;
  margin-bottom: 0.5rem;
}

.status-update-section {
  border-top: 1px solid #e5e7eb;
  padding-top: 1.5rem;
  margin-top: 1.5rem;
}

.status-update-section h3 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: #111827;
}

.status-update-form {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.status-update-form select {
  max-width: 200px;
}

@media (max-width: 768px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>

