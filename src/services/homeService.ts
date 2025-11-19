import api from "./api";
import type { HomeStats, ApiResponse } from "../types";

export const homeService = {
  async getHomeStats(): Promise<HomeStats> {
    const response = await api.get<ApiResponse<HomeStats>>("/home");
    return response.data.data;
  },
};
