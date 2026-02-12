import React from "react"
import { screen } from "@testing-library/react"
import { renderWithProviders } from "@/test-utils"
import { ReportsPage } from "../ReportsPage"

jest.mock("../../hooks", () => ({
  useAdminReports: () => ({
    data: { pages: [{ data: [{ id: "r1", type: "post", targetId: "1", reason: "spam", status: "pending", reporterId: 1, createdAt: "" }] }] },
    fetchNextPage: jest.fn(),
    hasNextPage: false,
    isFetchingNextPage: false,
    isLoading: false,
    error: null,
  }),
  useResolveReport: () => ({ mutate: jest.fn(), isPending: false }),
}))
jest.mock("../AdminLayout", () => ({ AdminLayout: ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div> }))
jest.mock("../ReportDetailDialog", () => ({ ReportDetailDialog: () => null }))

describe("ReportsPage", () => {
  it("renders reports", () => {
    renderWithProviders(<ReportsPage />)
    expect(screen.getByTestId("layout")).toBeInTheDocument()
    expect(screen.getByText(/spam/)).toBeInTheDocument()
  })
})
