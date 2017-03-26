
exports.up = function(knex, Promise) {
  return knex.schema.createTable('comparisons', function(table) {
    table.increments('id');
    table.string('product_one');
    table.string('product_two');
    table.integer('product_one_score');
    table.integer('product_two_score');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('comparisons');
};
