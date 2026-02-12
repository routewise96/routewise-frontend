/// <reference types="cypress" />

describe("Settings page", () => {
  beforeEach(() => {
    cy.visit("/login")
    cy.get('input[name="email"], input[type="email"]').first().type("user@test.ru")
    cy.get('input[name="password"], input[type="password"]').first().type("password123")
    cy.get('button[type="submit"]').click()
    cy.url().should("include", "/")
  })

  it("user can open settings and see tabs", () => {
    cy.visit("/settings")
    cy.url().should("include", "/settings")
    cy.contains("profile", { matchCase: false }).should("exist")
    cy.contains("security", { matchCase: false }).should("exist")
    cy.contains("notifications", { matchCase: false }).should("exist")
    cy.contains("language", { matchCase: false }).should("exist")
  })

  it("user can switch to notifications tab", () => {
    cy.visit("/settings")
    cy.contains("notifications", { matchCase: false }).click()
    cy.get("[role='checkbox']").should("have.length.at.least", 1)
  })

  it("user can switch language", () => {
    cy.visit("/settings")
    cy.contains("language", { matchCase: false }).click()
    cy.get("[role='radiogroup']").should("exist")
  })
})
