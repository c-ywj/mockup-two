"use strict";

const express  = require('express');
const voteRouter = express.Router();

module.exports = (knex) => {

  voteRouter.post('/', (req, res) => {
    console.log(req.body.pro1Title, req.body.pro2Title);
  })

  return voteRouter;
};

