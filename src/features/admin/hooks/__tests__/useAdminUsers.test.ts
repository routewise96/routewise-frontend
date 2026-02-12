import React from "react"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useAdminUsers } from "../useAdminUsers"
import { adminApi } from "@/shared/api"

jest.mock("@/shared/api", () => ({
  adminApi: { getUsers: jest.fn() },
}))

const mockGetUsers = adminApi.getUsers as jest.Mock

function wrapper() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return function W({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client }, children)
  }
}

describe("useAdminUsers", () => {
  beforeEach(() => {
    mockGetUsers.mockResolvedValue({
      data: [{ id: 1, username: "u1", email: "u1@test.ru", role: "user" }],
      meta: { page: 1, limit: 20, total: 1, hasMore: false },
    })
  })

  it("calls API and returns data", async () => {
    const { result } = renderHook(() => useAdminUsers(), { wrapper: wrapper() })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockGetUsers).toHaveBeenCalledWith({ page: 1 })
    expect(result.current.data?.pages[0].data).toHaveLength(1)
  })

  it("passes search and role", async () => {
    const { result } = renderHook(
      () => useAdminUsers({ search: "x", role: "business" }),
      { wrapper: wrapper() }
    )
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockGetUsers).toHaveBeenCalledWith({
      search: "x",
      role: "business",
      page: 1,
    })
  })
})
