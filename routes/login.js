"use strict";

const express = require('express');
const loginRouter  = express.Router();

module.exports = (knex) => {

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
        if(pword === user[0].password) {
            res.redirect('/');
        } else {
            console.log('wrong password');
          }
      })
      // .catch((e) => {
      //   console.log(e);
      // })
  })
  return loginRouter
};
