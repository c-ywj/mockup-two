"use strict";

const express  = require('express');
const register = express.Router();

module.exports = (knex) => {

  register.get("/", (req, res) => {
    res.render('register');
  });

  register.post('/', (req, res) => {
    let iEmail = req.body.email;
    let iPassword = req.body.password;

    knex
      .select('*')
      .from('users')
      .then((result) => {
        result.forEach(function(user) {
          if (user.email !== iEmail) {
            knex('users').insert([{email: iEmail}, {password: iPassword}, {role: 'Consumer'}]);

            // res.redirect('/');
            console.log(`inserted ${iEmail} into users`);
          } else {
            console.log('this user already exists');
            res.redirect('/register');
          }
        });
      })
      .catch((e) => {
        console.log('something went wrong: ', e);
      })

  });

  return register;
}
