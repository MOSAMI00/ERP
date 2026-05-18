export interface SharedOption {
  value: string;
  label: string;
}

export interface SharedStatus extends SharedOption {
  name: string;
  tone: 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'neutral' | string;
}

export interface SharedStatuses {
  rental: SharedStatus[];
  payment: SharedStatus[];
  equipment: SharedStatus[];
  kyc: SharedStatus[];
}

export interface AuthUser {
  id: number;
  full_name?: string;
  name?: string;
  email?: string;
  phone?: string;
  type?: 'tenant' | 'owner' | string;
  status?: string;
  kyc_status?: string;
  avatar?: string | null;
  rating?: number | null;
  governorate?: string | null;
}

export interface SharedPageProps {
  [key: string]: unknown;
  auth?: {
    user?: AuthUser | null;
    admin?: Record<string, unknown> | null;
  };
  flash?: {
    success?: string | null;
    error?: string | null;
    warning?: string | null;
  };
  notifications_count?: number;
  unread_notifications_count?: number;
  sharedData?: {
    governorates: SharedOption[];
    statuses: SharedStatuses;
  };
}
