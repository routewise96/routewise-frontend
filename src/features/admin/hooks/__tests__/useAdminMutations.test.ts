import React from "react"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useBanUser, useResolveReport } from "../useAdminMutations"
import { adminApi } from "@/shared/api"

jest.mock("@/shared/api", () => ({
  adminApi: {
    banUser: jest.fn(),
    resolveReport: jest.fn(),
  },
}))

const mockBanUser = adminApi.banUser as jest.Mock
const mockResolveReport = adminApi.resolveReport as jest.Mock

function createWrapper() {
  const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } })
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client }, children)
  }
}

describe("useBanUser", () => {
  beforeEach(() => {
    mockBanUser.mockResolvedValue({ success: true })
  })

  it("calls adminApi.banUser and invalidates users", async () => {
    const { result } = renderHook(() => useBanUser(), { wrapper: createWrapper() })
    result.current.mutate({ id: "1", reason: "spam" })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockBanUser).toHaveBeenCalledWith("1", "spam")
  })
})

describe("useResolveReport", () => {
  beforeEach(() => {
    mockResolveReport.mockResolvedValue({ success: true })
  })

  it("calls adminApi.resolveReport with action", async () => {
    const { result } = renderHook(() => useResolveReport(), { wrapper: createWrapper() })
    result.current.mutate({ id: "r1", action: "dismiss" })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockResolveReport).toHaveBeenCalledWith("r1", "dismiss")
  })
})
