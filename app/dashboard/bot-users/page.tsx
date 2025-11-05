"use client"

import { useState } from "react"
import { useBotUsers } from "@/hooks/useBotUsers"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CopyButton } from "@/components/copy-button"

export default function BotUsersPage() {
  const [search, setSearch] = useState("")
  const [isBlock, setIsBlock] = useState<string>("all")

  const params = {
    search: search || undefined,
    is_block: isBlock === "all" ? undefined : isBlock === "blocked",
  }

  const { data: users, isLoading } = useBotUsers(params)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Utilisateurs Bot</h2>
        <p className="text-muted-foreground mt-2">Gérez les utilisateurs du bot Telegram</p>
      </div>

      <Card className="border border-border/50 shadow-sm">
        <CardHeader className="border-b border-border/50 bg-muted/30">
          <CardTitle className="text-lg font-semibold">Filtres</CardTitle>
          <CardDescription className="text-sm">Rechercher et filtrer les utilisateurs bot</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="search">Rechercher</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Rechercher par nom ou email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select value={isBlock} onValueChange={setIsBlock}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les Utilisateurs</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="blocked">Bloqué</SelectItem>
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
              <CardTitle className="text-lg font-semibold">Liste des Utilisateurs</CardTitle>
              <CardDescription className="text-sm mt-1">Total : {users?.length || 0} utilisateurs</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : users && users.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border/50">
                    <TableHead className="font-semibold text-muted-foreground h-12">ID</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">ID Telegram</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">Nom</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">Email</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">Créé le</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user, index) => (
                    <TableRow key={user.id} className={index % 2 === 0 ? "bg-card" : "bg-muted/20"}>
                      <TableCell className="font-medium text-foreground">
                        <div className="flex items-center gap-2">
                          {user.id}
                          <CopyButton value={user.id} />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono text-xs">{user.telegram_user_id}</Badge>
                          <CopyButton value={user.telegram_user_id} />
                        </div>
                      </TableCell>
                      <TableCell className="text-foreground">
                        {user.first_name} {user.last_name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{new Date(user.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">Aucun utilisateur trouvé</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
