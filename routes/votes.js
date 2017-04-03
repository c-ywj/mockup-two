"use strict";

const express  = require('express');
const voteRouter = express.Router();

module.exports = (knex) => {

  voteRouter.post('/', (req, res) => {
    const votedPro = req.body.votedPro;
    const unvotedPro = req.body.unvotedPro;
    const votedAsin = req.body.votedAsin;
    const unvotedAsin = req.body.unvotedAsin;
    knex.select("*")
        .from('comparisons')
        .where({
          product_one: votedAsin,
          product_two: unvotedAsin
        })
        .orWhere({
          product_one: unvotedAsin,
          product_two: votedAsin
        })
        .then(function(result) {
          console.log(result);
          const p1v = result[0].product_one_votes;
          const p2v = result[0].product_two_votes;
          // const img1 = result[1].LargeImage[0].URL;
          // const img2 = result[1].LargeImage[0].URL;
          console.log('product one votes: ' + p1v);
          console.log('product two votes: ' + p2v);
          const pairResult = {};
          if(result.length > 0) {
            if(result[0].product_one === votedPro) {
              pairResult.winner = {
                title: votedPro,
                score: p1v + 1,
                // img:img1
              }
              pairResult.loser = {
                title: unvotedPro,
                score: p2v,
                // img:img2
              }

            } else if (result[0].product_two === votedPro) {
              pairResult.winner = {
                title: votedPro,
                score: p2v + 1,
                // img:img1
              }
              pairResult.loser = {
                title: unvotedPro,
                score: p1v,
                // img:img2
              }
            }
            res.json(pairResult);
          }
        })
  })

  return voteRouter;
};
