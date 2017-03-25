
exports.up = function(knex, Promise) {
  return knex.schema.createTable('products', function (table) {
    table.increments('id');
    table.string('name');
    table.string('brand');
    table.string('category');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('products');
};
