"use strict";

const express     = require('express');
const loginRouter = express.Router();
const bcrypt      = require('bcrypt');

module.exports    = (knex) => {

  loginRouter.get("/", (req, res) => {
    res.render('login');
  });

  loginRouter.post('/', (req, res) => {
    knex
      .select('*')
      .from('users')
      .where("email", "=", req.body.email)
      .then((user) => {
        const pword = req.body.password;
        let match   = bcrypt.compareSync(pword, user[0].password);
        if(match === true) {
          res.send("success");
            // res.redirect('/');
        } else {
          throw "Wrong password";
        }
      })
      .catch((e) => {
        console.log('Either your email was invalid, or something else went wrong', e);
        res.send("Failed")
      })
  })
  return loginRouter
};
