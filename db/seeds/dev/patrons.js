const libraryPatronData = require('../../../libraryPatronData');

const createPatron = (knex, patron) => {
  return knex('patrons').insert({
    first_name: patron.first_name,
    last_name: patron.last_name,
    email: patron.email,
    address: patron.address,
    phone_number: patron.phone_number,
    overdue_fees: patron.overdue_fees
  }, 'id')
    .then(patronId => {
      let loanPromises = [];

      patron.library_loans.forEach(loan => {
        loanPromises.push(
          createLoan(knex, {
            title: loan.title,
            author: loan.author,
            ISBN: loan.ISBN,
            overdue: loan.overdue,
            patron_id: patronId[0]
          })
        )
      });
      return Promise.all(loanPromises);
    })
};

const createLoan = (knex, loan) => {
  return knex('library_loans').insert(loan);
}

exports.seed = (knex) => {
  return knex('library_loans').del()
    .then(() => knex('patrons').del())
    .then(() => {
      let patronPromises = [];

      libraryPatronData.forEach(patron => {
        patronPromises.push(createPatron(knex, patron));
      });

      return Promise.all(patronPromises);
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};