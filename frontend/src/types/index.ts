// User and Authentication Types
export enum Role {
  ADMIN = "ADMIN",
  DASHBOARD_ADMIN = "DASHBOARD_ADMIN",
  MANUFACTURER = "MANUFACTURER",
  RETAILER = "RETAILER",
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: Role;
}

export interface JwtResponse {
  token: string;
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}

// Product Types
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory?: string;
  stockQuantity: number;
  minOrderQuantity: number;
  maxOrderQuantity?: number;
  weight?: number;
  dimensions?: string;
  color?: string;
  material?: string;
  brand?: string;
  modelNumber?: string;
  sku?: string;
  barcode?: string;
  isActive: boolean;
  isFeatured: boolean;
  tags?: string;
  warrantyPeriod?: string;
  returnPolicy?: string;
  shippingInfo?: string;
  manufacturerId: number;
  manufacturerName: string;
  manufacturerEmail: string;
  imageUrls?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory?: string;
  stockQuantity: number;
  minOrderQuantity?: number;
  maxOrderQuantity?: number;
  weight?: number;
  dimensions?: string;
  color?: string;
  material?: string;
  brand?: string;
  modelNumber?: string;
  sku?: string;
  barcode?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  tags?: string;
  warrantyPeriod?: string;
  returnPolicy?: string;
  shippingInfo?: string;
  imageUrls?: string[];
}

export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

// Manufacturer Types
export enum ManufacturerStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
  INACTIVE = "INACTIVE",
}

export interface Manufacturer {
  id: number;
  userId?: number;
  companyName: string;
  contactPerson: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  gstNumber?: string;
  panNumber?: string;
  licenseNumber?: string;
  licenseValidity?: string;
  status: ManufacturerStatus;
  verified: boolean;
  verificationNotes?: string;
  verifiedBy?: number;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ManufacturerRequest {
  companyName: string;
  contactPerson: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  gstNumber?: string;
  panNumber?: string;
  licenseNumber?: string;
  licenseValidity?: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface ManufacturerVerificationRequest {
  status: ManufacturerStatus;
  verificationNotes?: string;
}

// Dashboard Stats Types
export interface DashboardStats {
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  activeCount: number;
  suspendedCount: number;
  inactiveCount: number;
  verifiedCount: number;
  unverifiedCount: number;
}

// API Error Type
export interface ApiError {
  error: string;
  message?: string;
  timestamp?: string;
}

