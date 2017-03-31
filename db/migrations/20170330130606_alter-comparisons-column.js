
exports.up = function(knex, Promise) {
  return knex.schema.table('comparisons', function (table) {
    table.dropColumn('product_one_score');
    table.dropColumn('product_two_score');
    table.integer('product_one_votes').defaultTo(0);
    table.integer('product_two_votes').defaultTo(0);
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('comparisons', function (table) {
    table.addColumn('product_one_score');
    table.addColumn('product_two_score');
    table.dropColumn('product_one_votes');
    table.dropColumn('product_two_votes');
  })
};
