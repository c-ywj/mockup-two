"use strict";

const express  = require('express');
const voteRouter = express.Router();

module.exports = (knex) => {

  voteRouter.post('/', (req, res) => {
    console.log('voted pro is: ' +req.body.votedPro, 'unvoted pro is: ' + req.body.unvotedPro);
    const votedPro   = req.body.votedPro;
    const unvotedPro = req.body.unvotedPro;
    knex('comparisons').where({
      product_one: votedPro,
      product_two: unvotedPro
    }).select('*').then(function(result) {
      console.log(result);
    }).catch(function(err) {
      console.log(err);
    })
  })

  return voteRouter;
};

