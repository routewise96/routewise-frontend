import apiClient from "../base"
import type { Booking } from "../../types/api"

export const bookingsApi = {
  getAll: (page = 1): Promise<Booking[]> =>
    apiClient.get("/bookings", { params: { page } }).then((r) => r.data),
}
