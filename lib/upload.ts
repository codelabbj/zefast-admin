import api from "./axios"
import { toast } from "react-hot-toast"

/**
 * Uploads a file to the server and returns the file value from response
 * @param file - The file to upload
 * @returns Promise<string> - The file value from the upload API response
 */
export async function uploadFile(file: File): Promise<string> {
  try {
    const formData = new FormData()
    formData.append("file", file)

    const response = await api.post<{ file: string } | string>("/mobcash/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    // Handle both string response and object response with 'file' key
    const fileValue = typeof response.data === "string" ? response.data : response.data.file
    
    if (!fileValue) {
      throw new Error("No file value returned from server")
    }

    return fileValue
  } catch (error: any) {
    const errorMessage = 
      error.response?.data?.details ||
      error.response?.data?.detail ||
      error.response?.data?.error ||
      error.response?.data?.message ||
      "Erreur lors du téléchargement du fichier"
    
    toast.error(errorMessage)
    throw error
  }
}

