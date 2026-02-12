import React from "react"
import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { renderWithProviders } from "@/test-utils"
import { LanguageSettingsForm } from "../LanguageSettingsForm"

const mockSetLocale = jest.fn()
jest.mock("@/app/providers/I18nProvider", () => ({
  useLocaleContext: () => ({ setLocale: mockSetLocale }),
}))

describe("LanguageSettingsForm", () => {
  beforeEach(() => mockSetLocale.mockClear())

  it("renders ru and en options", () => {
    renderWithProviders(<LanguageSettingsForm />)
    expect(screen.getByText("languageTab.ru")).toBeInTheDocument()
    expect(screen.getByText("languageTab.en")).toBeInTheDocument()
  })

  it("calls setLocale when selecting en", async () => {
    const user = userEvent.setup()
    renderWithProviders(<LanguageSettingsForm />)
    const enRadio = screen.getByRole("radio", { name: /languageTab.en/i })
    await user.click(enRadio)
    expect(mockSetLocale).toHaveBeenCalledWith("en")
  })
})
