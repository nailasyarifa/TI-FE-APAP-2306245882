<template>
  <div class="vehicle-form">
    <h1 class="page-title">{{ isEdit ? 'Edit Vehicle' : 'Add New Vehicle' }}</h1>

    <form @submit.prevent="handleSubmit" class="form-card">
      <div class="form-grid">
        <div class="form-group">
          <label for="type">Type *</label>
          <select id="type" v-model="form.type" required>
            <option value="">Select Type</option>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="MPV">MPV</option>
            <option value="Luxury">Luxury</option>
          </select>
        </div>

        <div class="form-group">
          <label for="brand">Brand *</label>
          <input id="brand" v-model="form.brand" type="text" required />
        </div>

        <div class="form-group">
          <label for="model">Model *</label>
          <input id="model" v-model="form.model" type="text" required />
        </div>

        <div class="form-group">
          <label for="productionYear">Production Year *</label>
          <input id="productionYear" v-model.number="form.productionYear" type="number" min="1900" :max="new Date().getFullYear()" required />
        </div>

        <div class="form-group">
          <label for="licensePlate">License Plate *</label>
          <input id="licensePlate" v-model="form.licensePlate" type="text" required />
        </div>

        <div class="form-group">
          <label for="capacity">Capacity *</label>
          <input id="capacity" v-model.number="form.capacity" type="number" min="1" required />
        </div>

        <div class="form-group">
          <label for="transmission">Transmission *</label>
          <select id="transmission" v-model="form.transmission" required>
            <option value="">Select Transmission</option>
            <option value="Manual">Manual</option>
            <option value="Automatic">Automatic</option>
          </select>
        </div>

        <div class="form-group">
          <label for="fuelType">Fuel Type *</label>
          <select id="fuelType" v-model="form.fuelType" required>
            <option value="">Select Fuel Type</option>
            <option value="Bensin">Bensin</option>
            <option value="Diesel">Diesel</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Listrik">Listrik</option>
          </select>
        </div>

        <div class="form-group">
          <label for="location">Location *</label>
          <select id="location" v-model="form.location" required>
            <option value="">Select Location</option>
            <option v-for="loc in locations" :key="loc" :value="loc">{{ loc }}</option>
          </select>
        </div>

        <div class="form-group">
          <label for="price">Price per Day (IDR) *</label>
          <input id="price" v-model.number="form.price" type="number" min="0" step="1000" required />
        </div>

        <div class="form-group">
          <label for="status">Status *</label>
          <select id="status" v-model="form.status" required>
            <option value="">Select Status</option>
            <option value="Available">Available</option>
            <option value="In Use">In Use</option>
            <option value="Unavailable">Unavailable</option>
          </select>
        </div>

        <div class="form-group">
          <label for="rentalVendorId">Rental Vendor *</label>
          <select id="rentalVendorId" v-model.number="form.rentalVendorId" required>
            <option value="">Select Vendor</option>
            <option v-for="vendor in vendors" :key="vendor.id" :value="vendor.id">
              {{ vendor.name }}
            </option>
          </select>
        </div>
      </div>

      <div class="form-actions">
        <router-link to="/vehicles" class="btn-secondary">Cancel</router-link>
        <button type="submit" class="btn-primary" :disabled="submitting">
          {{ submitting ? 'Saving...' : (isEdit ? 'Update Vehicle' : 'Create Vehicle') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { vehicleService } from '../services/vehicleService';
import api from '../services/api';
import type { RentalVendor } from '../types';

const route = useRoute();
const router = useRouter();
const isEdit = computed(() => route.name === 'VehicleEdit');
const vehicleId = route.params.id as string;

const vendors = ref<RentalVendor[]>([]);
const submitting = ref(false);

const locations = [
  'DKI Jakarta', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'Banten',
  'Yogyakarta', 'Bali', 'Sumatera Utara', 'Sumatera Selatan', 'Kalimantan Timur'
];

const form = ref({
  type: '',
  brand: '',
  model: '',
  productionYear: new Date().getFullYear(),
  licensePlate: '',
  capacity: 4,
  transmission: '',
  fuelType: '',
  location: '',
  price: 0,
  status: 'Available',
  rentalVendorId: 0,
});

const loadVendors = async () => {
  try {
    const response = await api.get('/vendors');
    vendors.value = response.data.data;
  } catch (error) {
    console.error('Failed to load vendors:', error);
  }
};

const loadVehicle = async () => {
  if (!isEdit.value) return;
  
  try {
    const vehicle = await vehicleService.getVehicleById(vehicleId);
    form.value = {
      type: vehicle.type,
      brand: vehicle.brand,
      model: vehicle.model,
      productionYear: vehicle.productionYear,
      licensePlate: vehicle.licensePlate,
      capacity: vehicle.capacity,
      transmission: vehicle.transmission,
      fuelType: vehicle.fuelType,
      location: vehicle.location,
      price: vehicle.price,
      status: vehicle.status,
      rentalVendorId: vehicle.rentalVendor.id,
    };
  } catch (error) {
    console.error('Failed to load vehicle:', error);
    alert('Failed to load vehicle details');
  }
};

const handleSubmit = async () => {
  submitting.value = true;
  try {
    if (isEdit.value) {
      await vehicleService.updateVehicle(vehicleId, form.value);
      alert('Vehicle updated successfully');
    } else {
      await vehicleService.createVehicle(form.value);
      alert('Vehicle created successfully');
    }
    router.push('/vehicles');
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to save vehicle';
    alert(message);
  } finally {
    submitting.value = false;
  }
};

onMounted(() => {
  loadVendors();
  loadVehicle();
});
</script>

<style scoped>
.vehicle-form {
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
}

.page-title {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #111827;
}

.form-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>

