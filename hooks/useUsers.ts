"use client"

import { useQuery } from "@tanstack/react-query"
import api from "@/lib/axios"

export interface User {
  id: string
  bonus_available: number
  is_superuser: boolean
  username: string
  first_name: string
  last_name: string
  email: string
  is_delete: boolean
  phone: string
  otp: string | null
  otp_created_at: string | null
  is_block: boolean
  referrer_code: string | null
  referral_code: string
  is_active: boolean
  is_staff: boolean
  is_supperuser: boolean
  date_joined: string
  last_login: string
}

export interface UsersResponse {
  count: number
  next: string | null
  previous: string | null
  results: User[]
}

interface UsersParams {
  search?: string
  is_block?: boolean
}

export function useUsers(params: UsersParams = {}) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: async () => {
      const res = await api.get<UsersResponse>("/auth/users", { params })
      return res.data
    },
  })
}

