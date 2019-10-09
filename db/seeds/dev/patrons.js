exports.seed = function(knex) {
  return knex('library_loans').del()
    .then(() => knex('patrons').del())
    .then(() => {
      return Promise.all([
        
        // Insert a single paper, return the paper ID, insert 2 footnotes
        knex('patrons').insert({
          first_name: "Raymond",
          last_name: "Insall",
          email: "rinsall0@dot.gov",
          address: "21481 Gina Park",
          phone_number: "730-614-3737",
          overdue_fees: "$6.17"
        }, 'id')
        .then(patron => {
          return knex('library_loans').insert([
            {
              title: "erat nulla tempus vivamus",
              author: "Rafael Pittway",
              ISBN: "621650931-4",
              overdue: true,
              patron_id: patron[0]
            },
            {
              title: "mattis nibh ligula",
              author: "Tadeas Jobke",
              ISBN: "888516458-7",
              overdue: true,
              patron_id: patron[0]
            },
            {
              title: "donec odio justo",
              author: "Nerta Laxe",
              ISBN: "957764532-1",
              overdue: false,
              patron_id: patron[0]
            }
          ])
        })
        .then(() => console.log('Seeding complete!'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ])
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
