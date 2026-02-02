"use client"

import { useState } from "react"
import { useRecharges, type Recharge, type RechargeFilters } from "@/hooks/useRecharges"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, Search, RefreshCw, AlertCircle, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { CreateRechargeDialog } from "@/components/create-recharge-dialog"
import { CopyButton } from "@/components/copy-button"

export default function RechargesPage() {
  const [filters, setFilters] = useState<RechargeFilters>({
    page: 1,
    page_size: 10,
  })

  const { data: rechargesData, isLoading, isError, error } = useRecharges(filters)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "En attente"
      case "approved":
        return "Approuvé"
      case "rejected":
        return "Rejeté"
      case "expired":
        return "Expiré"
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "default" // Green (success)
      case "rejected":
        return "destructive" // Red (error)
      case "pending":
        return "secondary" // Gray/neutral
      case "expired":
        return "outline" // Border only
      default:
        return "secondary" // Default fallback
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "expired":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return null
    }
  }

  const formatTimeRemaining = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Recharges</h2>
          <p className="text-muted-foreground">Gérez les demandes de recharge</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle Recharge
        </Button>
      </div>

      <Card className="border border-border/50 shadow-sm">
        <CardHeader className="border-b border-border/50 bg-muted/30">
          <CardTitle className="text-lg font-semibold">Filtres</CardTitle>
          <CardDescription className="text-sm">Rechercher et filtrer les recharges</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="search">Rechercher Référence</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Rechercher par référence..."
                  value={filters.search || ""}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value || undefined })}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select
                value={filters.status || "all"}
                onValueChange={(value) => setFilters({ ...filters, status: value === "all" ? undefined : value })}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les Statuts</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="approved">Approuvé</SelectItem>
                  <SelectItem value="rejected">Rejeté</SelectItem>
                  <SelectItem value="expired">Expiré</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border/50 shadow-sm">
        <CardHeader className="border-b border-border/50 bg-muted/30">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">Liste des Recharges</CardTitle>
              <CardDescription className="text-sm mt-1">Total : {rechargesData?.count || 0} recharges</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : isError ? (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-sm text-destructive mb-2">
                    Une erreur est survenue lors du chargement des recharges.
                  </div>
                  {error && <div className="text-xs text-destructive/70 mb-3">{error.message}</div>}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.reload()}
                      className="text-destructive border-destructive/20 hover:bg-destructive/5"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Recharger la page
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => {
                        // Force refetch of recharges
                        window.location.reload()
                      }}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Réessayer
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : rechargesData && rechargesData.results.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border/50">
                      <TableHead className="font-semibold text-muted-foreground h-12">Référence de Paiement</TableHead>
                      <TableHead className="font-semibold text-muted-foreground">Montant</TableHead>
                      <TableHead className="font-semibold text-muted-foreground">Statut</TableHead>
                      <TableHead className="font-semibold text-muted-foreground">Créé le</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rechargesData.results.map((recharge: Recharge, index: number) => (
                      <TableRow key={`${recharge.uid}-${index}`} className={index % 2 === 0 ? "bg-card" : "bg-muted/20"}>
                        <TableCell className="font-mono text-xs text-foreground">
                          <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {recharge.payment_reference || recharge.reference || "-"}
                            <CopyButton value={recharge.payment_reference || recharge.reference || ""} />
                            </div>
                            {recharge.payment_proof && (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">Preuve:</span>
                                <img
                                  src={recharge.payment_proof.startsWith('http') ? recharge.payment_proof : `https://api.zefast.net/media/${recharge.payment_proof}`}
                                  alt="Preuve de paiement"
                                  className="h-8 w-8 object-cover rounded border cursor-pointer"
                                  onClick={() => window.open(recharge.payment_proof?.startsWith('http') ? recharge.payment_proof : `https://api.zefast.net/media/${recharge.payment_proof}`, '_blank')}
                                />
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold text-foreground">
                          {recharge.amount} FCFA
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(recharge.status || "pending")} className="font-medium">
                            <div className="flex items-center gap-1">
                              {getStatusIcon(recharge.status || "pending")}
                              {getStatusLabel(recharge.status || "pending")}
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {new Date(recharge.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between px-6 py-4 border-t border-border/50">
                <div className="text-sm text-muted-foreground">
                  Page {filters.page} sur {Math.ceil((rechargesData?.count || 0) / (filters.page_size || 10))}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
                    disabled={!rechargesData?.previous}
                  >
                    Précédent
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
                    disabled={!rechargesData?.next}
                  >
                    Suivant
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground">Aucune recharge trouvée</div>
          )}
        </CardContent>
      </Card>

      <CreateRechargeDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
    </div>
  )
}
