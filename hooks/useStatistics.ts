"use client"

import { useQuery } from "@tanstack/react-query"
import api from "@/lib/axios"

export interface DashboardStats {
  total_users: number
  active_users: number
  inactive_users: number
  total_bonus: number
  bot_stats: {
    total_transactions: number
    total_deposits: number
    total_withdrawals: number
    total_users: number
  }
  total_transactions: number
  transactions_by_app: Record<string, {
    count: number
    total_amount: number
  }>
  balance_bizao: number
  deposits_bizao: {
    count: number
    amount: number
  }
  withdrawals_bizao: {
    count: number
    amount: number
  }
  rewards: {
    total: number
  }
  disbursements: {
    count: number
    amount: number
  }
  advertisements: {
    total: number
    active: number
  }
  coupons: {
    total: number
    active: number
  }
}

export interface VolumeTransactions {
  deposits: {
    total_amount: number
    total_count: number
  }
  withdrawals: {
    total_amount: number
    total_count: number
  }
  net_volume: number
  evolution: {
    daily: Array<{
      date: string
      type_trans: "deposit" | "withdrawal"
      total_amount: number
      count: number
    }>
    weekly: Array<{
      week: string
      type_trans: "deposit" | "withdrawal"
      total_amount: number
      count: number
    }>
    monthly: Array<{
      month: string
      type_trans: "deposit" | "withdrawal"
      total_amount: number
      count: number
    }>
    yearly: Array<{
      year: string
      type_trans: "deposit" | "withdrawal"
      total_amount: number
      count: number
    }>
  }
}

export interface UserGrowth {
  new_users: {
    daily: Array<{
      date: string
      count: number
    }>
    weekly: Array<{
      week: string
      count: number
    }>
    monthly: Array<{
      month: string
      count: number
    }>
  }
  active_users_count: number
  users_by_source: Array<{
    source: string
    count: number
  }>
  status: {
    blocked: number
    active: number
    inactive: number
  }
}

export interface ReferralSystem {
  parrainages_count: number
  total_referral_bonus: number
  top_referrers: Array<any>
  activation_rate: number
}

export interface Statistics {
  dashboard_stats: DashboardStats
  volume_transactions: VolumeTransactions
  user_growth: UserGrowth
  referral_system: ReferralSystem
}

export function useStatistics() {
  return useQuery({
    queryKey: ["statistics"],
    queryFn: async () => {
      const res = await api.get<Statistics>("/mobcash/statistics")
      return res.data
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: (failureCount, error: any) => {
      // Don't retry on authentication errors - let the interceptor handle token refresh
      if (error?.response?.status === 401) {
        console.log("🔐 Statistics query: Not retrying 401 error - letting interceptor handle token refresh")
        return false
      }
      // Retry other errors up to 2 times
      return failureCount < 2
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

