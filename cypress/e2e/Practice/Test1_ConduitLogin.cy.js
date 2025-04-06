// /// <reference types="cypress" />

// describe('Login Functionality',function(){
//     Cypress.on('uncaught:exception', (err, runnable) => {
//         return false; // prevent app errors from failing test
//       });

//     it.skip('Login Test using Conduit',function(){
//         cy.visit('https://react-redux.realworld.io/')
//         cy.get('a[href="#login"]').click()
//         cy.get('input[placeholder="Email"]').type('cypressdemo@gmail.com')
//         cy.get('input[placeholder="Password"]').type('cypressdemo')
//         cy.get('button[type="submit"]').click()
//         cy.get('a[href="#settings"]').click()
//         cy.get('.btn.btn-outline-danger').click()
//     })
// })