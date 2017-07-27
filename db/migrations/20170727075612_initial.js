
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('inventory', function(table) {
      table.increments('id').primary();
      table.string('title');
      table.string('description');
      table.string('link');
      table.integer('price');
      table.timestamps(true, true);
    }),
    knex.schema.createTable('history', function(table) {
      table.increments('id').primary();
      table.integer('total');
      table.timestamps(true, true);
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('inventory'),
    knex.schema.dropTable('history')
  ]);
};
