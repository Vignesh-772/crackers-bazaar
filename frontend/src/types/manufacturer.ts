export enum ManufacturerStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SUSPENDED = 'SUSPENDED',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export interface Manufacturer {
  id: number;
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
}

export interface ManufacturerVerificationRequest {
  status: ManufacturerStatus;
  verificationNotes?: string;
}

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
