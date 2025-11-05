"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Network, ArrowLeftRight, Wallet, TrendingUp } from "lucide-react"

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Utilisateurs",
      value: "-",
      description: "Utilisateurs bots enregistrés",
      icon: Users,
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
    },
    {
      title: "Réseaux",
      value: "-",
      description: "Réseaux de paiement actifs",
      icon: Network,
      iconColor: "text-accent",
      iconBg: "bg-accent/10",
    },
    {
      title: "Transactions",
      value: "-",
      description: "Total des transactions",
      icon: ArrowLeftRight,
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
    },
    {
      title: "Solde Total",
      value: "-",
      description: "Dans toutes les caisses",
      icon: Wallet,
      iconColor: "text-accent",
      iconBg: "bg-accent/10",
    },
  ]

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Tableau de Bord
        </h2>
        <p className="text-muted-foreground text-lg">Bienvenue sur le tableau de bord administrateur Zefest</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card 
              key={stat.title}
              className="group relative border border-border/50 bg-card hover:border-primary/30 transition-all duration-200 hover:shadow-md"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-sm font-semibold text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2.5 rounded-lg ${stat.iconBg} ${stat.iconColor} transition-colors`}>
                  <Icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <TrendingUp className="h-4 w-4 text-muted-foreground/60" />
                </div>
                <p className="text-sm text-muted-foreground mt-3 font-medium">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
