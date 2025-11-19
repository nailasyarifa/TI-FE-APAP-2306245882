<template>
  <div class="booking-form">
    <h1 class="page-title">{{ isEdit ? 'Edit Booking' : 'Create New Booking' }}</h1>

    <form @submit.prevent="handleSubmit" class="form-card">
      <div class="form-grid">
        <div class="form-group full-width">
          <label for="vehicleId">Vehicle *</label>
          <select id="vehicleId" v-model="form.vehicleId" required @change="onVehicleChange">
            <option value="">Select Vehicle</option>
            <option v-for="vehicle in vehicles" :key="vehicle.id" :value="vehicle.id">
              {{ vehicle.brand }} {{ vehicle.model }} - {{ vehicle.type }} ({{ formatCurrency(vehicle.price) }}/day)
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="pickUpTime">Pick Up Time *</label>
          <input id="pickUpTime" v-model="form.pickUpTime" type="datetime-local" required />
        </div>

        <div class="form-group">
          <label for="dropOffTime">Drop Off Time *</label>
          <input id="dropOffTime" v-model="form.dropOffTime" type="datetime-local" required />
        </div>

        <div class="form-group">
          <label for="pickUpLocation">Pick Up Location *</label>
          <select id="pickUpLocation" v-model="form.pickUpLocation" required>
            <option value="">Select Location</option>
            <option v-for="loc in locations" :key="loc" :value="loc">{{ loc }}</option>
          </select>
        </div>

        <div class="form-group">
          <label for="dropOffLocation">Drop Off Location *</label>
          <select id="dropOffLocation" v-model="form.dropOffLocation" required>
            <option value="">Select Location</option>
            <option v-for="loc in locations" :key="loc" :value="loc">{{ loc }}</option>
          </select>
        </div>

        <div class="form-group">
          <label for="capacityNeeded">Capacity Needed *</label>
          <input id="capacityNeeded" v-model.number="form.capacityNeeded" type="number" min="1" required />
        </div>

        <div class="form-group">
          <label for="transmissionNeeded">Transmission Needed *</label>
          <select id="transmissionNeeded" v-model="form.transmissionNeeded" required>
            <option value="">Select Transmission</option>
            <option value="Manual">Manual</option>
            <option value="Automatic">Automatic</option>
          </select>
        </div>

        <div class="form-group">
          <label>
            <input type="checkbox" v-model="form.includeDriver" />
            Include Driver (+Rp 100,000/day)
          </label>
        </div>

        <div class="form-group full-width">
          <label>Add-Ons (Optional)</label>
          <div class="addon-checkboxes">
            <label v-for="addon in addOns" :key="addon.id" class="addon-checkbox">
              <input type="checkbox" :value="addon.id" v-model="form.selectedAddOns" />
              {{ addon.name }} - {{ formatCurrency(addon.price) }}
            </label>
          </div>
        </div>

        <div class="form-group full-width">
          <label for="status">Status *</label>
          <select id="status" v-model="form.status" required>
            <option value="Upcoming">Upcoming</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Done">Done</option>
          </select>
        </div>

        <div class="form-group full-width price-summary">
          <h3>Estimated Total Price: {{ formatCurrency(calculateTotalPrice()) }}</h3>
        </div>
      </div>

      <div class="form-actions">
        <router-link to="/bookings" class="btn-secondary">Cancel</router-link>
        <button type="submit" class="btn-primary" :disabled="submitting">
          {{ submitting ? 'Saving...' : (isEdit ? 'Update Booking' : 'Create Booking') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { bookingService } from '../services/bookingService';
import { vehicleService } from '../services/vehicleService';
import api from '../services/api';
import type { Vehicle, RentalAddOn } from '../types';

const route = useRoute();
const router = useRouter();
const isEdit = computed(() => route.name === 'BookingEdit');
const bookingId = route.params.id as string;

const vehicles = ref<Vehicle[]>([]);
const addOns = ref<RentalAddOn[]>([]);
const submitting = ref(false);
const selectedVehicle = ref<Vehicle | null>(null);

const locations = [
  'DKI Jakarta', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'Banten',
  'Yogyakarta', 'Bali', 'Sumatera Utara', 'Sumatera Selatan', 'Kalimantan Timur'
];

const form = ref({
  vehicleId: '',
  pickUpTime: '',
  dropOffTime: '',
  pickUpLocation: '',
  dropOffLocation: '',
  capacityNeeded: 4,
  transmissionNeeded: '',
  includeDriver: false,
  status: 'Upcoming',
  selectedAddOns: [] as string[],
});

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const onVehicleChange = () => {
  selectedVehicle.value = vehicles.value.find(v => v.id === form.value.vehicleId) || null;
};

const calculateTotalPrice = (): number => {
  if (!selectedVehicle.value || !form.value.pickUpTime || !form.value.dropOffTime) {
    return 0;
  }

  const pickUp = new Date(form.value.pickUpTime);
  const dropOff = new Date(form.value.dropOffTime);
  const days = Math.max(1, Math.ceil((dropOff.getTime() - pickUp.getTime()) / (1000 * 60 * 60 * 24)));

  let total = selectedVehicle.value.price * days;

  if (form.value.includeDriver) {
    total += 100000 * days;
  }

  form.value.selectedAddOns.forEach(addonId => {
    const addon = addOns.value.find(a => a.id === addonId);
    if (addon) {
      total += addon.price;
    }
  });

  return total;
};

const loadVehicles = async () => {
  try {
    vehicles.value = await vehicleService.getAllVehicles();
  } catch (error) {
    console.error('Failed to load vehicles:', error);
  }
};

const loadAddOns = async () => {
  try {
    const response = await api.get('/addons');
    addOns.value = response.data.data;
  } catch (error) {
    console.error('Failed to load add-ons:', error);
  }
};

const loadBooking = async () => {
  if (!isEdit.value) return;
  
  try {
    const booking = await bookingService.getBookingById(bookingId);
    form.value = {
      vehicleId: booking.vehicle.id,
      pickUpTime: new Date(booking.pickUpTime).toISOString().slice(0, 16),
      dropOffTime: new Date(booking.dropOffTime).toISOString().slice(0, 16),
      pickUpLocation: booking.pickUpLocation,
      dropOffLocation: booking.dropOffLocation,
      capacityNeeded: booking.capacityNeeded,
      transmissionNeeded: booking.transmissionNeeded,
      includeDriver: booking.includeDriver,
      status: booking.status,
      selectedAddOns: booking.listOfAddOns.map(a => a.id),
    };
    selectedVehicle.value = booking.vehicle;
  } catch (error) {
    console.error('Failed to load booking:', error);
    alert('Failed to load booking details');
  }
};

const handleSubmit = async () => {
  submitting.value = true;
  try {
    const bookingData = {
      vehicleId: form.value.vehicleId,
      pickUpTime: new Date(form.value.pickUpTime).toISOString(),
      dropOffTime: new Date(form.value.dropOffTime).toISOString(),
      pickUpLocation: form.value.pickUpLocation,
      dropOffLocation: form.value.dropOffLocation,
      capacityNeeded: form.value.capacityNeeded,
      transmissionNeeded: form.value.transmissionNeeded,
      includeDriver: form.value.includeDriver,
      status: form.value.status,
      addOnIds: form.value.selectedAddOns,
    };

    if (isEdit.value) {
      await bookingService.updateBooking(bookingId, bookingData);
      alert('Booking updated successfully');
    } else {
      await bookingService.createBooking(bookingData);
      alert('Booking created successfully');
    }
    router.push('/bookings');
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to save booking';
    alert(message);
  } finally {
    submitting.value = false;
  }
};

onMounted(() => {
  loadVehicles();
  loadAddOns();
  loadBooking();
});
</script>

<style scoped>
.booking-form {
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

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.addon-checkboxes {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 0.75rem;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 0.375rem;
}

.addon-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: normal;
}

.addon-checkbox input[type="checkbox"] {
  width: auto;
}

.price-summary {
  background-color: #f0fdf4;
  padding: 1.5rem;
  border-radius: 0.5rem;
  text-align: center;
}

.price-summary h3 {
  color: #10b981;
  font-size: 1.5rem;
  margin: 0;
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

  .addon-checkboxes {
    grid-template-columns: 1fr;
  }
}
</style>

