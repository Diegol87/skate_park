describe("Skate Park", () => {
    it("frontepage can be opened", ()=> {
        cy.visit("http://localhost:3000/login")
        cy.contains("Iniciar Sesion")
    })

    it("Submit ingresar", () => {
        cy.visit("http://localhost:3000/login")
        cy.contains("Ingresar").click()
    })

    it("Click test input", () => {
        cy.visit("http://localhost:3000/login")
        cy.get("input:first").type("test@test.com")
    })
})
