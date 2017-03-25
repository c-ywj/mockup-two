
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('products').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('products').insert({name: 'tv model x', brand: 'samsung', category: 'smart tv'}),
        knex('products').insert({name: 'laptop model x', brand: 'hp', category: 'laptop'}),
        knex('products').insert({name: 'phone model y', brand: 'sony', category: 'smartphone'})
      ]);
    });
};
