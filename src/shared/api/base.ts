"use client"

import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from "axios"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://routewise.ru/api"

export interface ApiError {
  message: string
  statusCode?: number
  detail?: unknown
}

function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("token")
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
})

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data"
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message: string =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data?.detail ||
      error.message ||
      "Ошибка запроса"
    const apiError: ApiError = {
      message: typeof message === "string" ? message : JSON.stringify(message),
      statusCode: error.response?.status,
      detail: error.response?.data,
    }
    return Promise.reject(apiError)
  }
)

export default apiClient
