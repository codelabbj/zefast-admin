"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/axios"
import { toast } from "react-hot-toast"

export interface Recharge {
  uid: string
  reference: string
  amount: number
  formatted_amount: string
  status: "pending" | "approved" | "rejected" | "expired"
  status_display: string
  created_at: string
  expires_at: string
  time_remaining: number
  is_expired: boolean
  can_submit_proof: boolean
  transaction_date: string | null
  proof_description: string
  rejection_reason: string | null
  admin_notes: string | null
  reviewed_at: string | null
  processed_at: string | null
  payment_reference?: string
  payment_proof?: string
}

export interface RechargesResponse {
  count: number
  next: string | null
  previous: string | null
  results: Recharge[]
}

export interface RechargeFilters {
  page?: number
  page_size?: number
  search?: string
  status?: string
  ordering?: string
}

export interface CreateRechargeInput {
  amount: string
  payment_method: string
  payment_reference: string
  notes: string
  payment_proof?: string
}

export function useRecharges(filters: RechargeFilters = {}) {
  return useQuery({
    queryKey: ["recharges", filters],
    queryFn: async () => {
      const res = await api.get<RechargesResponse>("/mobcash/recharge-mobcash-balance", { params: filters })
      return res.data
    },
  })
}

export function useCreateRecharge() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateRechargeInput) => {
      const payload: any = {
        amount: data.amount,
        payment_method: data.payment_method,
        payment_reference: data.payment_reference,
        notes: data.notes,
      }

      if (data.payment_proof) {
        payload.payment_proof = data.payment_proof
      }

      const res = await api.post<Recharge>("/mobcash/recharge-mobcash-balance", payload)
      return res.data
    },
    onSuccess: () => {
      toast.success("Recharge créée avec succès!")
      queryClient.invalidateQueries({ queryKey: ["recharges"] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erreur lors de la création de la recharge")
    },
  })
}
