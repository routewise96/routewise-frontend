import React from "react"
import { screen } from "@testing-library/react"
import { renderWithProviders } from "@/test-utils"
import { NotificationSettingsForm } from "../NotificationSettingsForm"

jest.mock("../../hooks", () => ({
  useNotificationSettings: () => ({
    data: {
      like: true,
      comment: true,
      follow: false,
      repost: true,
      mention: false,
      geo: false,
      ai: true,
      system: true,
    },
    isLoading: false,
    error: null,
  }),
  useUpdateNotificationSettings: () => ({ mutate: jest.fn() }),
}))

describe("NotificationSettingsForm", () => {
  it("renders checkboxes for each notification type", () => {
    renderWithProviders(<NotificationSettingsForm />)
    expect(screen.getByText("notificationsTab.like")).toBeInTheDocument()
    expect(screen.getByText("notificationsTab.comment")).toBeInTheDocument()
    expect(screen.getByText("notificationsTab.system")).toBeInTheDocument()
  })
})
