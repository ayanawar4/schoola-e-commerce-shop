// ─── Auth ───────────────────────────────────────────────────────────────────
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  phone_country_code: string;
  email?: string;
  has_password: boolean;
  created_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface OtpRequestPayload {
  phone_country_code: string;
  phone: string;
}

export interface OtpVerifyPayload {
  phone_country_code: string;
  phone: string;
  code: string;
}

export interface RegisterPayload {
  phone_country_code: string;
  phone: string;
  first_name: string;
  last_name: string;
  password: string;
  password_confirmation: string;
  email?: string;
}

export interface LoginPayload {
  phone_country_code?: string;
  phone?: string;
  email?: string;
  password: string;
}

// ─── School ──────────────────────────────────────────────────────────────────
export interface School {
  id: number;
  name: { ar: string; en: string } | string;
  slug: string;
  address?: string;
  phone?: string;
  email?: string;
  latitude?: number;
  longitude?: number;
  grades?: string[];
  is_active: boolean;
  logo_url?: string;
  curriculum?: string;
  products_count?: number;
}

// ─── Product / Catalog ───────────────────────────────────────────────────────
export interface ProductImage {
  id: number;
  url: string;
  is_primary: boolean;
}

export interface ProductVariant {
  id: number;
  size: string;
  color?: string;
  stock: number;
  price?: number;
}

export interface Product {
  id: number;
  name: string | { ar: string; en: string };
  sku: string;
  price: number;
  description?: string;
  category?: string;
  gender?: "male" | "female" | "unisex";
  grade_level?: string;
  rating?: number;
  reviews_count?: number;
  stock?: number;
  status: "pending" | "approved" | "rejected" | "active";
  school?: School;
  school_id?: number;
  images?: (ProductImage | string)[];
  sizes?: string[];
  variants?: ProductVariant[];
  created_at?: string;
}

// ─── Student ─────────────────────────────────────────────────────────────────
export interface StudentSizes {
  shirt?: string;
  pants?: string;
  skirt?: string;
  shoes?: string;
  jacket?: string;
}

export interface Student {
  id: number;
  name: string;
  school_id: number;
  school?: School;
  grade?: string;
  gender?: "male" | "female";
  sizes: StudentSizes;
}

// ─── Order ───────────────────────────────────────────────────────────────────
export type OrderStatus =
  | "pending"
  | "pending_payment"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "instapay" | "full" | "partial";

export interface OrderLine {
  id: number;
  product_id: number;
  product?: Product;
  quantity: number;
  unit_price: number;
  total?: number;
  size_snapshot?: Record<string, string>;
}

export interface Order {
  id: number;
  order_number?: string;
  student_id?: number;
  student?: Student;
  items?: OrderLine[];
  lines?: OrderLine[];
  payment_method: PaymentMethod;
  downpayment_amount?: number;
  payment_reference?: string;
  notes?: string;
  status: OrderStatus;
  subtotal: number;
  total: number;
  currency?: string;
  created_at: string;
}

export interface CreateOrderPayload {
  student_id: number;
  lines: { product_id: number; quantity: number; size?: string }[];
  payment_method: PaymentMethod;
  downpayment_amount: number;
  payment_reference: string;
  notes?: string;
}

// ─── Address ─────────────────────────────────────────────────────────────────
export interface Address {
  id: number;
  label: "home" | "work" | "other";
  full_name: string;
  phone: string;
  street: string;
  building_number?: string;
  floor?: string;
  apartment_number?: string;
  city: string;
  country: string;
  is_default: boolean;
}

export interface AddressPayload {
  label: "home" | "work" | "other";
  full_name: string;
  phone: string;
  street: string;
  building_number?: string;
  floor?: string;
  apartment_number?: string;
  city: string;
  country: string;
  is_default?: boolean;
}

// ─── Cart (local state) ───────────────────────────────────────────────────────
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

// ─── API Responses ────────────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  data: T[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  links?: {
    first?: string;
    last?: string;
    prev?: string;
    next?: string;
  };
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
