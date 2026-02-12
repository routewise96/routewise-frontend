import apiClient from "../base"
import type { AuthResponse, LoginCredentials, RegisterData } from "../../types/api"

const isDev = typeof process !== "undefined" && process.env.NODE_ENV === "development"

export const authApi = {
  login: (credentials: LoginCredentials): Promise<AuthResponse> =>
    apiClient.post("/auth/login", credentials).then((r) => r.data),

  register: (data: RegisterData): Promise<AuthResponse> =>
    apiClient.post("/auth/register", data).then((r) => r.data),

  logout: (): Promise<void> => Promise.resolve(),

  changePassword: (oldPassword: string, newPassword: string): Promise<{ success: boolean }> =>
    apiClient
      .post("/auth/change-password", { oldPassword, newPassword })
      .then((r) => r.data)
      .catch((err) => {
        if (isDev) {
          console.warn("[MOCK] authApi.changePassword called")
          return { success: true }
        }
        return Promise.reject(err)
      }),

  forgotPassword: (email: string): Promise<{ success: boolean }> =>
    apiClient.post("/auth/forgot-password", { email }).then((r) => r.data),

  resetPassword: (token: string, newPassword: string): Promise<{ success: boolean }> =>
    apiClient.post("/auth/reset-password", { token, newPassword }).then((r) => r.data),
}
