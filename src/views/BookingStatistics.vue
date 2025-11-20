<template>
  <div class="booking-statistics">
    <h1 class="page-title">Rental Booking Dashboard</h1>

    <div class="filters">
      <div class="filter-group">
        <label for="periodSelect">View By:</label>
        <select id="periodSelect" v-model="selectedPeriod" @change="loadChartData">
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
        </select>
      </div>

      <div class="filter-group">
        <label for="yearSelect">Year:</label>
        <select id="yearSelect" v-model="selectedYear" @change="loadChartData">
          <option v-for="year in availableYears" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="loading">Loading chart data...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="chart-container">
      <canvas ref="chartCanvas"></canvas>
    </div>

    <div v-if="!loading && !error && chartData" class="data-table">
      <h3>Booking Data</h3>
      <table>
        <thead>
          <tr>
            <th v-for="(label, index) in chartData.labels" :key="index">{{ label }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td v-for="(count, index) in chartData.counts" :key="index">{{ count }}</td>
          </tr>
        </tbody>
      </table>
      <div class="total">Total Bookings: {{ chartData.total }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { Chart, registerables } from 'chart.js';
import { bookingService } from '../services/bookingService';
import type { BookingChartData } from '../types';

// Register Chart.js components
Chart.register(...registerables);

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

const chartData = ref<BookingChartData | null>(null);
const loading = ref(false);
const error = ref('');

const selectedPeriod = ref<'monthly' | 'quarterly'>('monthly');
const selectedYear = ref(new Date().getFullYear());

// Generate available years (current year and 5 years back)
const availableYears = ref<number[]>([]);
for (let i = 0; i < 6; i++) {
  availableYears.value.push(new Date().getFullYear() - i);
}

const loadChartData = async () => {
  loading.value = true;
  error.value = '';
  try {
    chartData.value = await bookingService.getBookingChart(
      selectedPeriod.value,
      selectedYear.value
    );
  } catch (err) {
    error.value = 'Failed to load chart data';
    console.error(err);
  } finally {
    loading.value = false;
    // Wait for DOM to update after loading is set to false
    await nextTick();
    updateChart();
  }
};

const updateChart = () => {
  if (!chartCanvas.value || !chartData.value) {
    console.log('Chart update skipped:', {
      hasCanvas: !!chartCanvas.value,
      hasData: !!chartData.value
    });
    return;
  }

  console.log('Creating chart with data:', chartData.value);

  // Destroy existing chart if it exists
  if (chartInstance) {
    chartInstance.destroy();
  }

  const ctx = chartCanvas.value.getContext('2d');
  if (!ctx) {
    console.error('Failed to get canvas context');
    return;
  }

  const chartTitle = selectedPeriod.value === 'monthly'
    ? `Booking Results (Monthly) for ${selectedYear.value}`
    : `Booking Results (Quarterly) for ${selectedYear.value}`;

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: chartData.value.labels,
      datasets: [{
        label: 'Number of Bookings',
        data: chartData.value.counts,
        backgroundColor: '#4ADE80',
        borderColor: '#22C55E',
        borderWidth: 1,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: chartTitle,
          font: {
            size: 18,
            weight: 'bold'
          },
          color: '#10b981'
        },
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              return `Bookings: ${context.parsed.y}`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            precision: 0
          },
          title: {
            display: true,
            text: 'Number of Bookings'
          }
        },
        x: {
          title: {
            display: true,
            text: selectedPeriod.value === 'monthly' ? 'Month' : 'Quarter'
          }
        }
      }
    }
  });

  console.log('Chart created successfully');
};

onMounted(() => {
  loadChartData();
});

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
});
</script>

<style scoped>
.booking-statistics {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.page-title {
  font-size: 2rem;
  color: #10b981;
  text-align: center;
  margin-bottom: 2rem;
  font-weight: bold;
}

.filters {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 600;
  color: #374151;
}

.filter-group select {
  padding: 0.5rem 1rem;
  border: 2px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  background-color: white;
  cursor: pointer;
  transition: border-color 0.2s;
}

.filter-group select:hover {
  border-color: #10b981;
}

.filter-group select:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.loading,
.error {
  text-align: center;
  padding: 3rem;
  font-size: 1.125rem;
}

.error {
  color: #ef4444;
}

.chart-container {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
  min-height: 450px;
  position: relative;
}

.chart-container canvas {
  height: 400px !important;
  width: 100% !important;
}

.data-table {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.data-table h3 {
  color: #111827;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.data-table table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

.data-table th,
.data-table td {
  padding: 0.75rem;
  text-align: center;
  border: 1px solid #e5e7eb;
}

.data-table th {
  background-color: #f9fafb;
  font-weight: 600;
  color: #374151;
}

.data-table td {
  color: #111827;
}

.data-table .total {
  text-align: right;
  font-weight: 600;
  color: #10b981;
  font-size: 1.125rem;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-group {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-group select {
    width: 100%;
  }

  .data-table {
    overflow-x: auto;
  }
}
</style>
