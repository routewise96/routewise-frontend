import apiClient from "../base"

export interface MediaFile {
  id: number
  userId: number
  fileName: string
  fileUrl: string
  mimeType: string
  size: number
  createdAt: string
}

export const mediaApi = {
  uploadFile: (file: File): Promise<MediaFile> => {
    const formData = new FormData()
    formData.append("file", file)
    return apiClient
      .post("/media/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data)
  },
}
