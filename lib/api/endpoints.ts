import { apiClient } from "./client";
import type {
  AuthResponse,
  OtpRequestPayload,
  OtpVerifyPayload,
  RegisterPayload,
  LoginPayload,
  User,
  School,
  Product,
  Student,
  Order,
  CreateOrderPayload,
  Address,
  AddressPayload,
  PaginatedResponse,
} from "@/types";

// ─── Auth ────────────────────────────────────────────────────────────────────

export const authApi = {
  requestOtp: (payload: OtpRequestPayload) =>
    apiClient.post<{ message: string }>("/auth/otp/request", payload).then((r) => r.data),

  verifyOtp: (payload: OtpVerifyPayload) =>
    apiClient.post<{ message: string }>("/auth/otp/verify", payload).then((r) => r.data),

  register: (payload: RegisterPayload) =>
    apiClient.post<{ message: string }>("/auth/register", payload).then((r) => r.data),

  verifyRegister: (payload: OtpVerifyPayload) =>
    apiClient.post<AuthResponse>("/auth/register/verify", payload).then((r) => r.data),

  resendRegisterOtp: (payload: OtpRequestPayload) =>
    apiClient.post<{ message: string }>("/auth/register/resend-otp", payload).then((r) => r.data),

  login: (payload: LoginPayload) =>
    apiClient.post<AuthResponse>("/auth/login", payload).then((r) => r.data),

  logout: () =>
    apiClient.post("/auth/logout").then((r) => r.data),

  getProfile: () =>
    apiClient.get<{ data: User }>("/auth/profile").then((r) => r.data.data),

  updateProfile: (payload: Partial<User>) =>
    apiClient.put<{ data: User }>("/auth/profile", payload).then((r) => r.data.data),

  changePassword: (payload: { current_password?: string; password: string; password_confirmation: string }) =>
    apiClient.post("/auth/change-password", payload).then((r) => r.data),
};

// ─── Schools ─────────────────────────────────────────────────────────────────

export const schoolsApi = {
  list: (params?: { search?: string; per_page?: number; page?: number }) =>
    apiClient.get<PaginatedResponse<School>>("/customer/schools", { params }).then((r) => r.data),

  get: (id: number | string) =>
    apiClient.get<{ data: School }>(`/customer/schools/${id}`).then((r) => r.data.data),
};

// ─── Catalog (Products) ───────────────────────────────────────────────────────

export const catalogApi = {
  list: (params?: {
    school_id?: number;
    student_id?: number;
    category?: string;
    gender?: string;
    grade_level?: string;
    search?: string;
    page?: number;
    per_page?: number;
  }) =>
    apiClient.get<PaginatedResponse<Product>>("/customer/catalog", { params }).then((r) => r.data),

  get: (id: number | string) =>
    apiClient.get<{ data: Product }>(`/customer/catalog/${id}`).then((r) => r.data.data),
};

// ─── Students ────────────────────────────────────────────────────────────────

export const studentsApi = {
  list: () =>
    apiClient.get<{ data: Student[] }>("/customer/students").then((r) => r.data.data),

  get: (id: number | string) =>
    apiClient.get<{ data: Student }>(`/customer/students/${id}`).then((r) => r.data.data),

  create: (payload: Omit<Student, "id" | "school">) =>
    apiClient.post<{ data: Student }>("/customer/students", payload).then((r) => r.data.data),

  update: (id: number | string, payload: Partial<Omit<Student, "id" | "school">>) =>
    apiClient.patch<{ data: Student }>(`/customer/students/${id}`, payload).then((r) => r.data.data),

  delete: (id: number | string) =>
    apiClient.delete(`/customer/students/${id}`).then((r) => r.data),
};

// ─── Orders ───────────────────────────────────────────────────────────────────

export const ordersApi = {
  list: () =>
    apiClient.get<{ data: Order[] }>("/customer/orders").then((r) => r.data.data),

  get: (id: number | string) =>
    apiClient.get<{ data: Order }>(`/customer/orders/${id}`).then((r) => r.data.data),

  create: (payload: CreateOrderPayload) =>
    apiClient.post<{ data: Order }>("/customer/orders", payload).then((r) => r.data.data),
};

// ─── Addresses ────────────────────────────────────────────────────────────────

export const addressesApi = {
  list: () =>
    apiClient.get<{ data: Address[] }>("/customer/addresses").then((r) => r.data.data),

  create: (payload: AddressPayload) =>
    apiClient.post<{ data: Address }>("/customer/addresses", payload).then((r) => r.data.data),

  update: (id: number | string, payload: Partial<AddressPayload>) =>
    apiClient.patch<{ data: Address }>(`/customer/addresses/${id}`, payload).then((r) => r.data.data),

  delete: (id: number | string) =>
    apiClient.delete(`/customer/addresses/${id}`).then((r) => r.data),
};
