"use client"

import { useState, useEffect } from "react"
import api from "@/lib/axios"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { toast } from "react-hot-toast"

interface Credit {
  id: string;
  user: string;
  user_email: string;
  user_fullname: string;
  amount: number;
  note: string;
  created_at: string;
  updated_at: string;
}

const UserSearchDropdown = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm.length >= 2) {
        fetchUsers();
      } else {
        setUsers([]);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res: any = await api.get(`/auth/users`, { params: { search: searchTerm } });
      if (res.data && res.data.results) {
        setUsers(res.data.results);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <Label htmlFor="search-user">Rechercher un Utilisateur</Label>
      <Input
        id="search-user"
        className="uppercase bg-background"
        placeholder="Tapez le nom, email ou téléphone..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsOpen(true);
          onChange(""); // reset
        }}
        onFocus={() => setIsOpen(true)}
      />
      {value && (
         <div className="mt-2 text-sm text-green-600 font-medium">
           UUID sélectionné: {value}
         </div>
      )}
      {isOpen && (searchTerm.length >= 2 || users.length > 0) && (
        <div className="absolute z-[100] w-full mt-1 max-h-60 overflow-y-auto rounded-md border bg-popover text-popover-foreground shadow-md outline-none">
          {loading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">Chargement...</div>
          ) : users.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">Aucun utilisateur trouvé</div>
          ) : (
            <div className="py-1">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 pl-3 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                  onClick={() => {
                    onChange(u.id);
                    setSearchTerm(`${u.first_name || ""} ${u.last_name || ""} (${u.email})`.trim());
                    setIsOpen(false);
                  }}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{u.first_name} {u.last_name}</span>
                    <span className="text-xs text-muted-foreground">{u.email} | {u.phone}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function UserCreditsPage() {
  const [credits, setCredits] = useState<Credit[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<"create" | "update">("create")
  
  const [formData, setFormData] = useState({
    id: "",
    user: "",
    amount: "" as number | string,
    note: ""
  })
  const [formLoading, setFormLoading] = useState(false)

  const fetchCredits = async () => {
    try {
      setLoading(true)
      const res = await api.get("/mobcash/user-credit")
      if (res.data && res.data.results) {
        setCredits(res.data.results)
      } else {
        setCredits([])
      }
    } catch (error) {
      console.error(error)
      toast.error("Erreur lors de la récupération des crédits.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCredits()
  }, [])

  const handleOpenDialog = (mode: "create" | "update", item?: Credit) => {
    setDialogMode(mode)
    if (mode === "create") {
      setFormData({ id: "", user: "", amount: "", note: "" })
    } else if (item) {
      setFormData({ id: item.id, user: item.user, amount: item.amount, note: item.note || "" })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setFormLoading(true)
      if (dialogMode === "create") {
        await api.post("/mobcash/user-credit", {
          user: formData.user,
          amount: Number(formData.amount),
          note: formData.note
        })
        toast.success("Crédit ajouté avec succès.")
      } else {
        await api.patch(`/mobcash/user-credit/${formData.id}`, {
          amount: Number(formData.amount),
          note: formData.note
        })
        toast.success("Crédit modifié avec succès.")
      }
      setIsDialogOpen(false)
      fetchCredits()
    } catch (error) {
      console.error(error)
      toast.error("Erreur lors de l'enregistrement.")
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce crédit ?")) {
      try {
        await api.delete(`/mobcash/user-credit/${id}`)
        toast.success("Crédit supprimé avec succès.")
        fetchCredits()
      } catch (error) {
        console.error(error)
        toast.error("Erreur lors de la suppression.")
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Crédits Utilisateurs
          </h2>
          <p className="text-muted-foreground mt-2">Gérez les crédits des utilisateurs</p>
        </div>
        <Button onClick={() => handleOpenDialog("create")} className="gap-2">
          <Plus size={18} />
          Ajouter un Crédit
        </Button>
      </div>

      <Card className="border border-border/50 shadow-sm">
        <CardHeader className="border-b border-border/50 bg-muted/30">
          <CardTitle className="text-lg font-semibold">Liste des Crédits</CardTitle>
          <CardDescription className="text-sm">Total : {credits.length} crédits</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : credits && credits.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border/50">
                    <TableHead className="font-semibold text-muted-foreground h-12">Date</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">Utilisateur</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">Email</TableHead>
                    <TableHead className="font-semibold text-muted-foreground text-right">Montant</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">Note</TableHead>
                    <TableHead className="font-semibold text-muted-foreground text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {credits.map((item, index) => (
                    <TableRow key={item.id} className={index % 2 === 0 ? "bg-card" : "bg-muted/20"}>
                      <TableCell className="text-muted-foreground">
                        {new Date(item.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-foreground font-medium">
                        {item.user_fullname}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{item.user_email}</TableCell>
                      <TableCell className="text-right font-medium text-green-600 dark:text-green-400">
                        {item.amount.toLocaleString()} XOF
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{item.note}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenDialog("update", item)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="text-destructive hover:text-destructive/90">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">Aucun crédit trouvé</div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "create" ? "Ajouter un Crédit" : "Modifier le Crédit"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            {dialogMode === "create" && (
              <div className="space-y-2">
                <UserSearchDropdown
                  value={formData.user}
                  onChange={(val) => setFormData({ ...formData, user: val })}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="amount">Montant</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Ex: 5000"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value === "" ? "" : Number(e.target.value) })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="note">Note</Label>
              <Input
                id="note"
                placeholder="Ex: Remboursement suite à une erreur"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
              <Button type="submit" disabled={formLoading}>
                {formLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Enregistrer
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
