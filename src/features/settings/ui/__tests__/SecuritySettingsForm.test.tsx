import React from "react"
import { screen } from "@testing-library/react"
import { renderWithProviders } from "@/test-utils"
import { SecuritySettingsForm } from "../SecuritySettingsForm"

jest.mock("../../hooks", () => ({
  useChangePassword: () => ({ mutate: jest.fn(), isPending: false }),
}))

describe("SecuritySettingsForm", () => {
  it("renders password fields and 2FA stub", () => {
    renderWithProviders(<SecuritySettingsForm />)
    expect(screen.getByText("securityTab.currentPassword")).toBeInTheDocument()
    expect(screen.getByText("securityTab.newPassword")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "securityTab.changePassword" })).toBeInTheDocument()
    expect(screen.getByText("securityTab.2faTitle")).toBeInTheDocument()
  })
})
