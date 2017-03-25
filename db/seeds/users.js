exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(function () {
      return Promise.all([
        knex('users').insert({email: 'test@test.com', password: '123', role: 'regular'}),
        knex('users').insert({email: 'test2@test2.com', password: '123', role: 'regular'}),
        knex('users').insert({email: 'admin@admin.com', password: '123', role: 'admin'})
      ]);
    });
};
