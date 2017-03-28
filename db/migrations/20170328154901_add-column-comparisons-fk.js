
exports.up = function(knex, Promise) {
  return knex.schema.table('votes', function(table) {
    table.integer('comparisons_id').references('comparisons.id').onDelete('CASCADE');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('votes', function(table) {
    table.dropForeign('comparisons_id');
    table.dropColumn('comparisons_id');
  })
};
