<template>
  <div class="vehicle-detail">
    <div class="header">
      <h1 class="page-title">Vehicle Details</h1>
      <div class="actions">
        <router-link to="/vehicles" class="btn-secondary">Back to List</router-link>
        <router-link :to="`/vehicles/${vehicleId}/edit`" class="btn-primary">Edit</router-link>
        <button @click="handleDelete" class="btn-danger">Delete</button>
      </div>
    </div>

    <div v-if="loading" class="loading">Loading vehicle details...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="vehicle" class="detail-card">
      <div class="detail-grid">
        <div class="detail-item">
          <label>ID:</label>
          <span>{{ vehicle.id }}</span>
        </div>
        <div class="detail-item">
          <label>Type:</label>
          <span>{{ vehicle.type }}</span>
        </div>
        <div class="detail-item">
          <label>Brand:</label>
          <span>{{ vehicle.brand }}</span>
        </div>
        <div class="detail-item">
          <label>Model:</label>
          <span>{{ vehicle.model }}</span>
        </div>
        <div class="detail-item">
          <label>Production Year:</label>
          <span>{{ vehicle.productionYear }}</span>
        </div>
        <div class="detail-item">
          <label>License Plate:</label>
          <span>{{ vehicle.licensePlate }}</span>
        </div>
        <div class="detail-item">
          <label>Capacity:</label>
          <span>{{ vehicle.capacity }} passengers</span>
        </div>
        <div class="detail-item">
          <label>Transmission:</label>
          <span>{{ vehicle.transmission }}</span>
        </div>
        <div class="detail-item">
          <label>Fuel Type:</label>
          <span>{{ vehicle.fuelType }}</span>
        </div>
        <div class="detail-item">
          <label>Location:</label>
          <span>{{ vehicle.location }}</span>
        </div>
        <div class="detail-item">
          <label>Status:</label>
          <span :class="['status-badge', vehicle.status.toLowerCase()]">
            {{ vehicle.status }}
          </span>
        </div>
        <div class="detail-item">
          <label>Price per Day:</label>
          <span class="price">{{ formatCurrency(vehicle.price) }}</span>
        </div>
        <div class="detail-item full-width">
          <label>Rental Vendor:</label>
          <span>{{ vehicle.rentalVendor.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { vehicleService } from '../services/vehicleService';
import type { Vehicle } from '../types';

const route = useRoute();
const router = useRouter();
const vehicleId = route.params.id as string;

const vehicle = ref<Vehicle | null>(null);
const loading = ref(false);
const error = ref('');

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const loadVehicle = async () => {
  loading.value = true;
  error.value = '';
  try {
    vehicle.value = await vehicleService.getVehicleById(vehicleId);
  } catch (err) {
    error.value = 'Failed to load vehicle details';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const handleDelete = async () => {
  if (!confirm('Are you sure you want to delete this vehicle?')) {
    return;
  }
  
  try {
    await vehicleService.deleteVehicle(vehicleId);
    alert('Vehicle deleted successfully');
    router.push('/vehicles');
  } catch (err) {
    alert('Failed to delete vehicle');
    console.error(err);
  }
};

onMounted(() => {
  loadVehicle();
});
</script>

<style scoped>
.vehicle-detail {
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

.status-badge.available {
  background-color: #d1fae5;
  color: #065f46;
}

.status-badge.unavailable {
  background-color: #fee2e2;
  color: #991b1b;
}

@media (max-width: 768px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>

