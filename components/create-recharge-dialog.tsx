"use client"

import type React from "react"

import { useState } from "react"
import { useCreateRecharge, type CreateRechargeInput } from "@/hooks/useRecharges"
import api from "@/lib/axios"
import { toast } from "react-hot-toast"

type RechargeFormData = {
    amount: string
    payment_method: string
    payment_reference: string
    notes: string
    payment_proof: string // URL instead of File
}
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Upload, X } from "lucide-react"

interface CreateRechargeDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CreateRechargeDialog({ open, onOpenChange }: CreateRechargeDialogProps) {
    const createRecharge = useCreateRecharge()

    const [formData, setFormData] = useState<RechargeFormData>({
        amount: "",
        payment_method: "",
        payment_reference: "",
        notes: "",
        payment_proof: "",
    })

    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [isUploading, setIsUploading] = useState(false)

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setIsUploading(true)
            try {
                // Upload the file first
                const uploadData = new FormData()
                uploadData.append("file", file)
                const uploadResponse = await api.post('/mobcash/upload', uploadData)
                const uploadedUrl = uploadResponse.data.file

                // Set the URL in form data
                setFormData({ ...formData, payment_proof: uploadedUrl })

                // Create preview from the uploaded file
            const reader = new FileReader()
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string)
            }
            reader.readAsDataURL(file)

                toast.success("Image téléversée avec succès!")
            } catch (error) {
                toast.error("Erreur lors du téléversement de l'image")
                console.error("Upload error:", error)
            } finally {
                setIsUploading(false)
            }
        }
    }

    const removeImage = () => {
        setFormData({ ...formData, payment_proof: "" })
        setImagePreview(null)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        createRecharge.mutate(formData, {
                onSuccess: () => {
                    onOpenChange(false)
                    setFormData({
                        amount: "",
                        payment_method: "",
                        payment_reference: "",
                        notes: "",
                        payment_proof: "",
                    })
                    setImagePreview(null)
                },
        })
    }

    const resetForm = () => {
        setFormData({
            amount: "",
            payment_method: "",
            payment_reference: "",
            notes: "",
            payment_proof: "",
        })
        setImagePreview(null)
    }

    const handleOpenChange = (newOpen: boolean) => {
        onOpenChange(newOpen)
        if (!newOpen) {
            resetForm()
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle>Créer une Recharge</DialogTitle>
                    <DialogDescription>
                        Soumettre une demande de recharge avec preuve de paiement
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto pr-1">
                <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                        <Label htmlFor="amount">Montant (FCFA) *</Label>
                        <Input
                            id="amount"
                            type="number"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            placeholder="50000"
                            required
                            disabled={createRecharge.isPending}
                            min="1"
                            step="1"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="payment_method">Méthode de Paiement *</Label>
                        <Select
                            value={formData.payment_method}
                            onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
                            disabled={createRecharge.isPending}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez une méthode de paiement" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="BANK_TRANSFER">Virement bancaire</SelectItem>
                                <SelectItem value="MOBILE_MONEY">Mobile Money</SelectItem>
                                <SelectItem value="OTHER">Autre</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="payment_reference">Référence de Paiement *</Label>
                        <Input
                            id="payment_reference"
                            value={formData.payment_reference}
                            onChange={(e) => setFormData({ ...formData, payment_reference: e.target.value })}
                            placeholder="Entrez la référence de votre paiement"
                            required
                            disabled={createRecharge.isPending}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Informations supplémentaires sur votre paiement"
                            disabled={createRecharge.isPending}
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="proof_image">Image de Preuve (optionnel)</Label>
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                            {imagePreview ? (
                                <div className="relative">
                                    <img
                                        src={imagePreview}
                                        alt="Aperçu de la preuve"
                                        className="max-w-full h-auto max-h-48 rounded-lg mx-auto"
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="absolute top-2 right-2"
                                        onClick={removeImage}
                                        disabled={createRecharge.isPending}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                                    <div className="text-sm text-muted-foreground mb-2">
                                        Cliquez pour sélectionner une image ou glissez-déposez
                                    </div>
                                    <Input
                                        id="proof_image"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        disabled={createRecharge.isPending || isUploading}
                                        className="max-w-xs mx-auto"
                                    />
                                    {isUploading && (
                                        <div className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Téléversement en cours...
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOpenChange(false)}
                            disabled={createRecharge.isPending}
                        >
                            Annuler
                        </Button>
                            <Button type="submit" disabled={createRecharge.isPending || isUploading}>
                            {createRecharge.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Création...
                                </>
                            ) : (
                                "Créer la Recharge"
                            )}
                        </Button>
                        </div>
                </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}
