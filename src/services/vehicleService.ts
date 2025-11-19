import api from './api';
import type { Vehicle, ApiResponse } from '../types';

export const vehicleService = {
  async getAllVehicles(): Promise<Vehicle[]> {
    const response = await api.get<ApiResponse<Vehicle[]>>('/vehicles');
    return response.data.data;
  },

  async getVehicleById(id: string): Promise<Vehicle> {
    const response = await api.get<ApiResponse<Vehicle>>(`/vehicles/${id}`);
    return response.data.data;
  },

  async createVehicle(vehicle: Partial<Vehicle>): Promise<Vehicle> {
    const response = await api.post<ApiResponse<Vehicle>>('/vehicles', vehicle);
    return response.data.data;
  },

  async updateVehicle(id: string, vehicle: Partial<Vehicle>): Promise<Vehicle> {
    const response = await api.put<ApiResponse<Vehicle>>(`/vehicles/${id}`, vehicle);
    return response.data.data;
  },

  async deleteVehicle(id: string): Promise<void> {
    await api.delete(`/vehicles/${id}`);
  },

  async searchVehicles(keyword: string, type?: string): Promise<Vehicle[]> {
    const params: any = {};
    if (keyword) params.keyword = keyword;
    if (type && type !== 'All Types') params.type = type;
    
    const response = await api.get<ApiResponse<Vehicle[]>>('/vehicles/search', { params });
    return response.data.data;
  },
};

