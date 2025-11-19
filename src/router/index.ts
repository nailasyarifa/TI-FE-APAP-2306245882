import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import VehicleList from '../views/VehicleList.vue';
import VehicleDetail from '../views/VehicleDetail.vue';
import VehicleForm from '../views/VehicleForm.vue';
import BookingList from '../views/BookingList.vue';
import BookingDetail from '../views/BookingDetail.vue';
import BookingForm from '../views/BookingForm.vue';
import BookingStatistics from '../views/BookingStatistics.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/vehicles',
      name: 'VehicleList',
      component: VehicleList,
    },
    {
      path: '/vehicles/new',
      name: 'VehicleCreate',
      component: VehicleForm,
    },
    {
      path: '/vehicles/:id',
      name: 'VehicleDetail',
      component: VehicleDetail,
    },
    {
      path: '/vehicles/:id/edit',
      name: 'VehicleEdit',
      component: VehicleForm,
    },
    {
      path: '/bookings',
      name: 'BookingList',
      component: BookingList,
    },
    {
      path: '/bookings/new',
      name: 'BookingCreate',
      component: BookingForm,
    },
    {
      path: '/bookings/statistics',
      name: 'BookingStatistics',
      component: BookingStatistics,
    },
    {
      path: '/bookings/:id',
      name: 'BookingDetail',
      component: BookingDetail,
    },
    {
      path: '/bookings/:id/edit',
      name: 'BookingEdit',
      component: BookingForm,
    },
  ],
});

export default router;

