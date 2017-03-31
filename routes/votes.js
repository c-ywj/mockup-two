"use strict";

const express  = require('express');
const voteRouter = express.Router();

module.exports = (knex) => {

  voteRouter.post('/', (req, res) => {
    const votedPro = req.body.votedPro;
    const unvotedPro = req.body.unvotedPro;
    knex.select("*")
        .from('comparisons')
        .where({
          product_one: votedPro,
          product_two: unvotedPro
        })
        .orWhere({
          product_one: unvotedPro,
          product_two: votedPro
        })
        .then(function(result) {
          const p1v = result[0].product_one_votes;
          const p2v = result[0].product_two_votes;
          console.log('product one votes: ' + p1v);
          console.log('product two votes: ' + p2v);
          if(result.length > 0) {
            if(result[0].product_one === votedPro) {
              const winner = {
                title: votedPro,
                score: p1v
              };
              const loser = {
                title: unvotedPro,
                score: p2v
              };
              return winner, loser;
            } else if(result[0].product_two === votedPro) {
              const winner = {
                title: votedPro,
                score: p2v
              };
              const loser = {
                title: unvotedPro,
                score: p1v
              }
              return winner, loser;
            }
          }
        })
  })

  return voteRouter;
};

