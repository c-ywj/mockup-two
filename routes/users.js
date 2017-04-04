"use strict";

const express  = require('express');
const router = express.Router();
const bcrypt   = require('bcrypt');

module.exports = (knex) => {

  router.post('/register', (req, res) => {
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
            req.session.user = iEmail;
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

  // login handlers
  router.get("/login", (req, res) => {
    if (req.session.user) {
      res.redirect('/search');
    } else {
      res.render('login');
    }
  });

  router.post('/login', (req, res) => {
    knex
      .select('*')
      .from('users')
      .where("email", "=", req.body.email)
      .then((user) => {
        const pword = req.body.password;
        let match   = bcrypt.compareSync(pword, user[0].password);
        if(match === true) {
          req.session.user = req.body.email;
          res.send("success");
        } else {
          throw "Wrong password";
        }
      })
      .catch((e) => {
        console.log('Either your email was invalid, or something else went wrong', e);
        res.send("Failed")
      })
  })

  // logout handler
  router.get('/logout', (req, res) => {
    req.session = null;
    res.redirect('/');
  });

  return router;
}
