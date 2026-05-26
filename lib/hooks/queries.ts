import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useProductCache } from "@/lib/store/productCache";
import { useSchoolCache } from "@/lib/store/schoolCache";
import {
  authApi,
  schoolsApi,
  catalogApi,
  studentsApi,
  ordersApi,
  addressesApi,
} from "@/lib/api/endpoints";
import type {
  LoginPayload,
  OtpRequestPayload,
  OtpVerifyPayload,
  RegisterPayload,
  CreateOrderPayload,
  AddressPayload,
  Student,
} from "@/types";

// ─── Auth ────────────────────────────────────────────────────────────────────
export const useProfile = () =>
  useQuery({ queryKey: ["profile"], queryFn: authApi.getProfile, retry: false });

export const useLogin = () =>
  useMutation({ mutationFn: (p: LoginPayload) => authApi.login(p) });

export const useRequestOtp = () =>
  useMutation({ mutationFn: (p: OtpRequestPayload) => authApi.requestOtp(p) });

export const useVerifyOtp = () =>
  useMutation({ mutationFn: (p: OtpVerifyPayload) => authApi.verifyOtp(p) });

export const useRegister = () =>
  useMutation({ mutationFn: (p: RegisterPayload) => authApi.register(p) });

// ─── Schools ─────────────────────────────────────────────────────────────────
export const useSchools = (params?: { search?: string; per_page?: number; page?: number }) =>
  useQuery({
    queryKey: ["schools", params],
    queryFn: () => schoolsApi.list(params),
  });

export const useSchool = (id: number | string) => {
  const cached = useSchoolCache((s) => s.cache[Number(id)]);
  return useQuery({
    queryKey: ["school", id],
    queryFn: () => schoolsApi.get(id),
    enabled: !!id && !cached,
    initialData: cached,
    retry: false,
  });
};

// ─── Catalog ─────────────────────────────────────────────────────────────────
export const useCatalog = (params?: {
  school_id?: number;
  student_id?: number;
  category?: string;
  gender?: string;
  grade_level?: string;
  search?: string;
  page?: number;
  per_page?: number;
}) =>
  useQuery({
    queryKey: ["catalog", params],
    queryFn: () => catalogApi.list(params),
    enabled: !!(params?.school_id || params?.student_id),
  });

export const useProduct = (id: number | string) => {
  const cached = useProductCache((s) => s.cache[Number(id)]);
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => catalogApi.get(id),
    // Only attempt API call if not already in cache (API endpoint may not exist)
    enabled: !!id && !cached,
    initialData: cached,
    retry: false,
  });
};

// ─── Students ────────────────────────────────────────────────────────────────
export const useStudents = () =>
  useQuery({ queryKey: ["students"], queryFn: studentsApi.list, retry: false });

export const useStudent = (id: number | string) =>
  useQuery({
    queryKey: ["student", id],
    queryFn: () => studentsApi.get(id),
    enabled: !!id,
  });

export const useCreateStudent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: Omit<Student, "id" | "school">) => studentsApi.create(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["students"] }),
  });
};

export const useUpdateStudent = (id: number | string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: Partial<Omit<Student, "id" | "school">>) => studentsApi.update(id, p),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["students"] });
      qc.invalidateQueries({ queryKey: ["student", id] });
    },
  });
};

export const useDeleteStudent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => studentsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["students"] }),
  });
};

// ─── Orders ───────────────────────────────────────────────────────────────────
export const useOrders = () =>
  useQuery({ queryKey: ["orders"], queryFn: ordersApi.list, retry: false });

export const useOrder = (id: number | string) =>
  useQuery({
    queryKey: ["order", id],
    queryFn: () => ordersApi.get(id),
    enabled: !!id,
  });

export const useCreateOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: CreateOrderPayload) => ordersApi.create(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
};

// ─── Addresses ────────────────────────────────────────────────────────────────
export const useAddresses = () =>
  useQuery({ queryKey: ["addresses"], queryFn: addressesApi.list, retry: false });

export const useCreateAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: AddressPayload) => addressesApi.create(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["addresses"] }),
  });
};

export const useUpdateAddress = (id: number | string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: Partial<AddressPayload>) => addressesApi.update(id, p),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["addresses"] }),
  });
};

export const useDeleteAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => addressesApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["addresses"] }),
  });
};
