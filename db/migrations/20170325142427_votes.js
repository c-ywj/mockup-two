
exports.up = function(knex, Promise) {
  return knex.schema.createTable('votes', function(table) {
    table.increments('id');
    table.integer('product_id').references('products.id').onDelete('CASCADE');
    table.integer('user_id').references('users.id').onDelete('CASCADE');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('votes');
};
