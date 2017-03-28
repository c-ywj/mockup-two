
exports.up = function(knex, Promise) {
  return knex.schema.table('votes', function(table) {
         table.dropForeign('product_id');
         table.dropColumn('product_id');
         });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('votes', function(table) {
    table.addForeign('product_id');
    table.addColumn('product_id');
  })
};
