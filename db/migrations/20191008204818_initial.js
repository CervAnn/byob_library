exports.up = function(knex) {
  return Promise.all([
    knex.schema.createTable('patrons', function(table) {
      table.increments('id').primary();
      table.string('first_name');
      table.string('last_name');
      table.string('email');
      table.string('address');
      table.string('phone_number');
      table.string('overdue_fees');

      table.timestamps(true, true);
    }),
    knex.schema.createTable('library_loans', function(table) {
      table.increments('id').primary();
      table.string('title');
      table.string('author');
      table.string('ISBN');
      table.string('overdue');
      table.integer('patron_id').unsigned();
      table.foreign('patron_id')
        .references('patrons.id');

      table.timestamps(true, true);
    })
  ])
  
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.dropTable('library_loans'),
    knex.schema.dropTable('patrons')
  ]);
};
