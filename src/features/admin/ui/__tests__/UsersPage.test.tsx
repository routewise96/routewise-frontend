import React from "react"
import { screen } from "@testing-library/react"
import { renderWithProviders } from "@/test-utils"
import { UsersPage } from "../UsersPage"

jest.mock("../../hooks", () => ({
  useAdminUsers: () => ({
    data: { pages: [{ data: [{ id: 1, username: "admin_user", email: "admin@test.ru", role: "admin" }] }] },
    fetchNextPage: jest.fn(),
    hasNextPage: false,
    isFetchingNextPage: false,
    isLoading: false,
    error: null,
  }),
  useBanUser: () => ({ mutate: jest.fn(), isPending: false }),
  useUnbanUser: () => ({ mutate: jest.fn() }),
  useVerifyBusiness: () => ({ mutate: jest.fn(), isPending: false }),
}))
jest.mock("../AdminLayout", () => ({ AdminLayout: ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div> }))
jest.mock("../BanUserDialog", () => ({ BanUserDialog: () => null }))
jest.mock("../VerifyBusinessDialog", () => ({ VerifyBusinessDialog: () => null }))

describe("UsersPage", () => {
  it("renders users table", () => {
    renderWithProviders(<UsersPage />)
    expect(screen.getByTestId("layout")).toBeInTheDocument()
    expect(screen.getByText("admin_user")).toBeInTheDocument()
  })
})
