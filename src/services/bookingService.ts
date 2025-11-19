import api from './api';
import type { RentalBooking, ApiResponse, BookingStatistics } from '../types';

export const bookingService = {
  async getAllBookings(): Promise<RentalBooking[]> {
    const response = await api.get<ApiResponse<RentalBooking[]>>('/bookings');
    return response.data.data;
  },

  async getBookingById(id: string): Promise<RentalBooking> {
    const response = await api.get<ApiResponse<RentalBooking>>(`/bookings/${id}`);
    return response.data.data;
  },

  async createBooking(booking: Partial<RentalBooking>): Promise<RentalBooking> {
    const response = await api.post<ApiResponse<RentalBooking>>('/bookings', booking);
    return response.data.data;
  },

  async updateBooking(id: string, booking: Partial<RentalBooking>): Promise<RentalBooking> {
    const response = await api.put<ApiResponse<RentalBooking>>(`/bookings/${id}`, booking);
    return response.data.data;
  },

  async updateBookingStatus(id: string, status: string): Promise<RentalBooking> {
    const response = await api.put<ApiResponse<RentalBooking>>(`/bookings/${id}/status`, null, {
      params: { status }
    });
    return response.data.data;
  },

  async cancelBooking(id: string): Promise<void> {
    await api.delete(`/bookings/${id}`);
  },

  async getBookingStatistics(): Promise<BookingStatistics> {
    const response = await api.get<ApiResponse<BookingStatistics>>('/bookings/statistics');
    return response.data.data;
  },
};

