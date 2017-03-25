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
      .where('email', '=', iEmail)
      .then((result) => {
        console.log(result);
        if (result.length === 1) {
          console.log('this user already exists');
          res.redirect('/register');
        } else {
          console.log(iEmail)

          knex
          .insert({email: iEmail, password: iPassword, role: 'Consumer'})
          .into('users')
          .then(result => {
            console.log(result)
            res.redirect('/');
            console.log(`inserted ${iEmail} into users`);
          })
          .catch(err => {
            console.log(err)
          })

        }
        // result.forEach(function(user) {
        //   if (user.email !== iEmail) {
        //   } else {
        //     res.redirect('/register');
        //   }
        })
      .catch((e) => {
        console.log('something went wrong: ', e);
      })

  });

  return register;
}
