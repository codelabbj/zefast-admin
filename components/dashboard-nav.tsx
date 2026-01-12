"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Users,
  Network,
  Phone,
  Award as IdCard,
  Bell,
  Gift,
  ArrowLeftRight,
  Settings,
  LayoutDashboard,
  Wallet,
  Layers,
  Bot,
  Ticket,
  Megaphone,
  CreditCard,
} from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Tableau de Bord", icon: LayoutDashboard },
  { href: "/dashboard/users", label: "Utilisateurs", icon: Users },
  { href: "/dashboard/bot-users", label: "Utilisateurs Bot", icon: Users },
  { href: "/dashboard/networks", label: "Réseaux", icon: Network },
  { href: "/dashboard/telephones", label: "Téléphones", icon: Phone },
  { href: "/dashboard/user-app-ids", label: "IDs Utilisateur", icon: IdCard },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/bonuses", label: "Bonus", icon: Gift },
  { href: "/dashboard/coupons", label: "Coupons", icon: Ticket },
  { href: "/dashboard/advertisements", label: "Publicités", icon: Megaphone },
  { href: "/dashboard/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/dashboard/recharges", label: "Recharges", icon: CreditCard },
  { href: "/dashboard/bot-transactions", label: "Transactions Bot", icon: Bot },
  { href: "/dashboard/platforms", label: "Plateformes", icon: Layers },
  // { href: "/dashboard/deposits", label: "Dépôts & Caisses", icon: Wallet },
  { href: "/dashboard/settings", label: "Paramètres", icon: Settings },
]

interface DashboardNavProps {
  onNavigate?: () => void
}

export function DashboardNav({ onNavigate }: DashboardNavProps = {}) {
  const pathname = usePathname()

  return (
    <nav className="space-y-2">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 relative overflow-hidden",
              isActive
                ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]"
                : "text-muted-foreground hover:bg-muted/80 hover:text-foreground hover:translate-x-1",
            )}
          >
            {/* Active indicator */}
            {isActive && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/30 rounded-r-full"></div>
            )}
            
            {/* Icon with gradient background when active */}
            <div className={cn(
              "flex items-center justify-center transition-all duration-200",
              isActive 
                ? "p-1.5 rounded-lg bg-white/20" 
                : "group-hover:scale-110"
            )}>
              <Icon className={cn(
                "h-5 w-5 transition-all duration-200",
                isActive ? "text-white" : ""
              )} />
            </div>
            
            <span className={cn(
              "transition-all duration-200 font-medium",
              isActive ? "text-white" : ""
            )}>
              {item.label}
            </span>
            
            {/* Hover effect */}
            {!isActive && (
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl"></div>
            )}
          </Link>
        )
      })}
    </nav>
  )
}
