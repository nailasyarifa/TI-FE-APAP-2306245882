<template>
  <div class="vehicle-list">
    <h1 class="page-title">Vehicle List</h1>

    <div class="actions-bar">
      <div class="left-actions">
        <router-link to="/vehicles/new" class="btn-primary">
          Add A New Vehicle
        </router-link>
      </div>
      <div class="right-actions">
        <select v-model="selectedType" @change="handleFilter" class="filter-select">
          <option value="All Types">All Types</option>
          <option value="Sedan">Sedan</option>
          <option value="SUV">SUV</option>
          <option value="MPV">MPV</option>
          <option value="Luxury">Luxury</option>
        </select>
        <input
          v-model="searchKeyword"
          @input="handleSearch"
          type="text"
          placeholder="Search vehicles..."
          class="search-input"
        />
      </div>
    </div>

    <div v-if="loading" class="loading">Loading vehicles...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="vehicles.length === 0" class="no-data">No vehicles found</div>
    <table v-else class="table">
      <thead>
        <tr>
          <th>No</th>
          <th>ID</th>
          <th>Type</th>
          <th>Brand</th>
          <th>Model</th>
          <th>Capacity</th>
          <th>Status</th>
          <th>Price per Day</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(vehicle, index) in vehicles" :key="vehicle.id">
          <td>{{ index + 1 }}</td>
          <td>{{ vehicle.id }}</td>
          <td>{{ vehicle.type }}</td>
          <td>{{ vehicle.brand }}</td>
          <td>{{ vehicle.model }}</td>
          <td>{{ vehicle.capacity }}</td>
          <td>
            <span :class="['status-badge', vehicle.status.toLowerCase()]">
              {{ vehicle.status }}
            </span>
          </td>
          <td>{{ formatCurrency(vehicle.price) }}</td>
          <td>
            <router-link :to="`/vehicles/${vehicle.id}`" class="btn-detail">
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
import { vehicleService } from '../services/vehicleService';
import type { Vehicle } from '../types';

const vehicles = ref<Vehicle[]>([]);
const loading = ref(false);
const error = ref('');
const searchKeyword = ref('');
const selectedType = ref('All Types');

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const loadVehicles = async () => {
  loading.value = true;
  error.value = '';
  try {
    vehicles.value = await vehicleService.getAllVehicles();
  } catch (err) {
    error.value = 'Failed to load vehicles';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const handleSearch = async () => {
  loading.value = true;
  error.value = '';
  try {
    vehicles.value = await vehicleService.searchVehicles(searchKeyword.value, selectedType.value);
  } catch (err) {
    error.value = 'Failed to search vehicles';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const handleFilter = async () => {
  await handleSearch();
};

onMounted(() => {
  loadVehicles();
});
</script>

<style scoped>
.vehicle-list {
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
  flex-wrap: wrap;
}

.left-actions {
  display: flex;
  gap: 1rem;
}

.right-actions {
  display: flex;
  gap: 1rem;
  flex: 1;
  max-width: 500px;
}

.filter-select {
  width: 150px;
}

.search-input {
  flex: 1;
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

.status-badge.available {
  background-color: #d1fae5;
  color: #065f46;
}

.status-badge.unavailable {
  background-color: #fee2e2;
  color: #991b1b;
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

