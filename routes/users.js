"use strict";

const express  = require('express');
const register = express.Router();
const bcrypt   = require('bcrypt');

module.exports = (knex) => {

  register.get("/", (req, res) => {
    res.render('register');
  });

  register.post('/', (req, res) => {
    let iEmail      = req.body.email;
    let iPassword   = req.body.password;
    let hashed_pass = bcrypt.hashSync(iPassword, 10);

    knex
      .select('*')
      .from('users')
      .where('email', '=', iEmail)
      .then((result) => {
        if (result.length === 1) {
          console.log('This user already exists');
          res.send('failed');
        } else {
          knex
          .insert({email: iEmail, password: hashed_pass, role: 'Consumer'})
          .into('users')
          .then(result => {
            console.log(`Inserted ${iEmail} into users`);
            // res.redirect('/');
            res.send("success");
          })
          .catch(err => {
            console.log(err);
            res.send('Failed');
          })

        }
      })
      .catch((e) => {
        console.log('Something went wrong: ', e);
      })
  });

  return register;
}
