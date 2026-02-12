import React from "react"
import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { renderWithProviders } from "@/test-utils"
import { ProfileSettingsForm } from "../ProfileSettingsForm"

jest.mock("@/features/auth", () => ({
  useAuth: () => ({
    user: { id: 1, username: "testuser", email: "test@test.ru", bio: "" },
  }),
}))

jest.mock("@/features/profile/hooks", () => ({
  useUpdateProfile: () => ({
    mutate: jest.fn(),
    isPending: false,
  }),
}))

describe("ProfileSettingsForm", () => {
  it("renders form with username and bio", () => {
    renderWithProviders(<ProfileSettingsForm />)
    expect(screen.getByDisplayValue("testuser")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "save" })).toBeInTheDocument()
  })

  it("validates required username", async () => {
    const user = userEvent.setup()
    renderWithProviders(<ProfileSettingsForm />)
    const nameInput = screen.getByDisplayValue("testuser")
    await user.clear(nameInput)
    await user.click(screen.getByRole("button", { name: "save" }))
    await waitFor(() => {
      expect(screen.getByText("Min 2")).toBeInTheDocument()
    })
  })
})
