/// <reference types="cypress" />

describe("Admin panel", () => {
  beforeEach(() => {
    cy.visit("/login")
    // Login as admin (adjust selectors and credentials per your app)
    cy.get('input[name="email"], input[type="email"]').first().type("admin@test.ru")
    cy.get('input[name="password"], input[type="password"]').first().type("password123")
    cy.get('button[type="submit"]').click()
    cy.url().should("include", "/")
  })

  it("admin can open admin panel and see users", () => {
    cy.visit("/admin/dashboard")
    cy.url().should("include", "/admin")
    cy.visit("/admin/users")
    cy.get("table, [role='table'], .rounded-lg").should("exist")
  })

  it("admin can open reports", () => {
    cy.visit("/admin/reports")
    cy.url().should("include", "/admin/reports")
  })
})
