"use client"

import { useDeposits, useCaisses } from "@/hooks/useDeposits"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, Wallet } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CopyButton } from "@/components/copy-button"

export default function DepositsPage() {
  const { data: depositsData, isLoading: depositsLoading } = useDeposits()
  const { data: caisses, isLoading: caissesLoading } = useCaisses()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Dépôts & Caisses</h2>
        <p className="text-muted-foreground">Consultez les dépôts et soldes de caisse</p>
      </div>

      <Tabs defaultValue="caisses" className="w-full">
        <TabsList>
          <TabsTrigger value="caisses">Caisses</TabsTrigger>
          <TabsTrigger value="deposits">Dépôts</TabsTrigger>
        </TabsList>

        <TabsContent value="caisses" className="space-y-4">
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
                        <CardTitle className="text-sm font-medium">{caisse.bet_app.name}</CardTitle>
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
        </TabsContent>

        <TabsContent value="deposits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Liste des Dépôts</CardTitle>
              <CardDescription>Total : {depositsData?.count || 0} dépôts</CardDescription>
            </CardHeader>
            <CardContent>
              {depositsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : depositsData && depositsData.results.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Plateforme</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Créé le</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {depositsData.results.map((deposit) => (
                      <TableRow key={deposit.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {deposit.id}
                            <CopyButton value={deposit.id} />
                          </div>
                        </TableCell>
                        <TableCell>{deposit.bet_app.name}</TableCell>
                        <TableCell>
                          <Badge variant="default" className="font-mono">
                            {deposit.amount} FCFA
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(deposit.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">Aucun dépôt trouvé</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
