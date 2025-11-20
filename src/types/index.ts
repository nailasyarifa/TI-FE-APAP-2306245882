export interface RentalVendor {
  id: number;
  name: string;
  email: string;
  phone: string;
  listOfLocations: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Vehicle {
  id: string;
  rentalVendor: RentalVendor;
  type: string;
  brand: string;
  model: string;
  productionYear: number;
  location: string;
  licensePlate: string;
  capacity: number;
  transmission: string;
  fuelType: string;
  price: number;
  status: string;
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RentalAddOn {
  id: string;
  name: string;
  price: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface RentalBooking {
  id: string;
  vehicle: Vehicle;
  pickUpTime: string;
  dropOffTime: string;
  pickUpLocation: string;
  dropOffLocation: string;
  capacityNeeded: number;
  transmissionNeeded: string;
  totalPrice: number;
  includeDriver: boolean;
  status: string;
  listOfAddOns: RentalAddOn[];
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface HomeStats {
  totalVehicles: number;
  totalVendors: number;
  totalBookings: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface BookingStatistics {
  totalBookings: number;
  upcomingBookings: number;
  ongoingBookings: number;
  completedBookings: number;
  totalRevenue: number;
}

export interface BookingChartData {
  period: "monthly" | "quarterly";
  year: number;
  labels: string[];
  counts: number[];
  total: number;
}
