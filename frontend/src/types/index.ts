// User and Authentication Types
export enum Role {
  ADMIN = "ADMIN",
  DASHBOARD_ADMIN = "DASHBOARD_ADMIN",
  MANUFACTURER = "MANUFACTURER",
  RETAILER = "RETAILER",
}

export interface User {
  id: string;
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
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}

// Product Types
export interface Product {
  id: string;
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
  id: string;
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

// Order Types
export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  totalPrice: number;
  imageUrl?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: number;
  userName: string;
  userEmail: string;
  status: OrderStatus;
  subtotal: number;
  tax?: number;
  shippingCost?: number;
  discount?: number;
  total: number;
  shippingAddress?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingPincode?: string;
  shippingCountry?: string;
  billingAddress?: string;
  billingCity?: string;
  billingState?: string;
  billingPincode?: string;
  billingCountry?: string;
  contactEmail: string;
  contactPhone: string;
  paymentMethod?: string;
  paymentStatus?: string;
  paymentTransactionId?: string;
  notes?: string;
  trackingNumber?: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  orderItems: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItemRequest {
  productId: string;
  quantity: number;
  unitPrice?: number;
}

export interface OrderRequest {
  items: OrderItemRequest[];
  shippingAddress?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingPincode?: string;
  shippingCountry?: string;
  billingAddress?: string;
  billingCity?: string;
  billingState?: string;
  billingPincode?: string;
  billingCountry?: string;
  contactEmail: string;
  contactPhone: string;
  paymentMethod?: string;
  notes?: string;
  shippingCost?: number;
  discount?: number;
}

export interface OrderStatusUpdateRequest {
  status: OrderStatus;
  trackingNumber?: string;
  cancellationReason?: string;
  notes?: string;
}

export interface OrderStats {
  totalOrders?: number;
  totalSpent?: number;
  totalRevenue?: number;
}

// API Error Type
export interface ApiError {
  error: string;
  message?: string;
  timestamp?: string;
}

