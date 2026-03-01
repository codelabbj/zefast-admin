"use client"

import { useState } from "react"
import { useDeposits, useCaisses, type DepositFilters } from "@/hooks/useDeposits"
import { usePlatforms } from "@/hooks/usePlatforms"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Wallet, Plus, Search } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CopyButton } from "@/components/copy-button"
import { CreateDepositDialog } from "@/components/create-deposit-dialog"

export default function DepositsPage() {
  const { data: caisses, isLoading: caissesLoading } = useCaisses()
  // const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Caisses</h2>
        <p className="text-muted-foreground">Consultez les soldes de caisse</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Aperçu des Caisses</CardTitle>
          <CardDescription>Solde actuel pour chaque plateforme</CardDescription>
        </CardHeader>
        <CardContent>
          {caissesLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : caisses && caisses.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {caisses.map((caisse) => (
                <Card key={caisse.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{caisse.bet_app_details.name}</CardTitle>
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{caisse.solde} FCFA</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {caisse.updated_at
                        ? `Mis à jour le ${new Date(caisse.updated_at).toLocaleDateString()}`
                        : "Aucune mise à jour"}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">Aucune caisse trouvée</div>
          )}
        </CardContent>
      </Card>

      {/* <CreateDepositDialog open={dialogOpen} onOpenChange={setDialogOpen} /> */}
    </div>
  )
}
