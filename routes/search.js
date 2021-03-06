"use strict";
const amazon = require('amazon-product-api');
const express = require('express');

// creates amazon client
const searchRouter  = express.Router();
const client = amazon.createClient({
  awsId: process.env.AWS_ID,
  awsSecret:process.env.AWS_SECRET,
  awsTag:process.env.AWS_TAG
});

// function to initiate item search api through amazon client
const amzSearch = function(brand, category, keywords) {
  const results = client.itemSearch({
    brand: brand,
    keywords: keywords,
    title: category,
    ItemPage: '1',
    sort: '-price',
    MaximumPrice: '300000',
    MinimumPrice: '30000',
    searchIndex: 'Electronics',
    responseGroup: 'ItemAttributes,Images'
  })
  return results;
}

module.exports = (knex) => {
// get handler for /search path
  searchRouter.get('/', (req, res) => {
    if (!req.session.user) {
      res.redirect('/');
    } else {
      let templateVars = {message: '', current_user: req.session.user};
      res.render("search", templateVars);
    }
  });
// handler for search button
  searchRouter.get("/product", (req, res) => {
    if (!req.session.user) {
      res.redirect('/');
    } else {
      const rand1 = Math.floor(Math.random() * 8);
      const rand2 = Math.floor(Math.random() * 8);
      // const rand3 = Math.floor(Math.random() * 2);
      // const rand4 = Math.floor(Math.random() * 2);
      console.log(req.query.brand1, req.query.brand2);
      Promise.all([
        amzSearch(req.query.brand1, req.query.category, req.query.keywords),
        amzSearch(req.query.brand2, req.query.category, req.query.keywords)
      ])
      .then(function(results) {
        // results is multidimensional array, contains two arrays, each with 10 items
        const pro1 = {
          asin: results[0][rand1].ASIN,
          title: results[0][rand1].ItemAttributes[0].Title,
          type:  results[0][rand1].ItemAttributes[0].ProductTypeName
        }
        const pro2 = {
          asin: results[1][rand2].ASIN,
          title: results[1][rand2].ItemAttributes[0].Title,
          type:  results[1][rand2].ItemAttributes[0].ProductTypeName
        }
        console.log('pro1 asin: ' + pro1.asin);
        console.log('pro2 asin: ' + pro2.asin);
        //queries DB to check if rendered pair exists
        return knex
          .select('*')
          .from('comparisons')
          .where({
            product_one: pro1.asin[0],
            product_two: pro2.asin[0]
          })
          .orWhere({
            product_one: pro2.asin[0],
            product_two: pro1.asin[0]
          })
          .then(function(result) {
            // result will be 1 if rendered pair exists in DB
            console.log(result);
            if(result.length === 0 &&
              pro1.asin[0] !== pro2.asin[0]) {
              return knex
                .insert({product_one: pro1.asin[0], product_two: pro2.asin[0]}).into('comparisons')
                .then(function(result) {
                  // console.log(pro1.type);
                  // return result;
                  const productTitles = {
                      pro1: results[0][rand1].ItemAttributes[0].Title,
                      pro2: results[1][rand2].ItemAttributes[0].Title
                    };
                  // console.log(results[0][rand1])
                  let templateVars = {
                    current_user: req.session.user,
                    br1: {
                      image1: results[0][rand1].LargeImage[0].URL,
                      brand1: results[0][rand1].ItemAttributes[0].Brand,
                      ProductType1: results[0][rand1].ItemAttributes[0].ProductTypeName,
                      DetailPageURL1: results[0][rand1].DetailPageURL,
                      pTitle1: results[0][rand1].ItemAttributes[0].Title,
                      description: results[0][rand1].ItemAttributes[0].Feature,
                      asin: results[0][rand1].ASIN
                    },
                    br2: {
                      image2: results[1][rand2].LargeImage[0].URL,
                      brand2: results[1][rand2].ItemAttributes[0].Brand,
                      ProductType2: results[1][rand2].ItemAttributes[0].ProductTypeName,
                      DetailPageURL2: results[1][rand2].DetailPageURL,
                      pTitle2: results[1][rand2].ItemAttributes[0].Title,
                      description: results[1][rand2].ItemAttributes[0].Feature,
                      asin: results[1][rand2].ASIN
                    }
                  }
                  res.render("searchres", templateVars);
                })
            } else if (result.length > 0 &&
                      pro1.asin[0] !== pro2.asin[0]){
                let templateVars = {
                  current_user: req.session.user,
                  br1: {
                    image1: results[0][rand1].LargeImage[0].URL,
                    brand1: results[0][rand1].ItemAttributes[0].Brand,
                    ProductType1: results[0][rand1].ItemAttributes[0].ProductTypeName,
                    DetailPageURL1: results[0][rand1].DetailPageURL,
                    pTitle1: results[0][rand1].ItemAttributes[0].Title,
                    description: results[0][rand1].ItemAttributes[0].Feature,
                    asin: results[0][rand1].ASIN
                  },
                  br2: {
                    image2: results[1][rand2].LargeImage[0].URL,
                    brand2: results[1][rand2].ItemAttributes[0].Brand,
                    ProductType2: results[1][rand2].ItemAttributes[0].ProductTypeName,
                    DetailPageURL2: results[1][rand2].DetailPageURL,
                    pTitle2: results[1][rand2].ItemAttributes[0].Title,
                    description: results[1][rand2].ItemAttributes[0].Feature,
                    asin: results[1][rand2].ASIN
                  }
              }
              res.render("searchres", templateVars);
            }

            return null;
          })
          // return results;
      })
      .catch(function(err){
        // Error handler for when product doesn't exist
        if (err['Error'] === undefined) {
          let templateVars = {
            current_user: req.session.user,
            message: 'Oops! We could not find any matches to your search.'
          }
          console.log('ERROR', err, '\n ERROR MESSAGE: ', err['Error']);
          // res.json(err);
          res.render("search", templateVars);
        } else {
        // Sometimes, there is a timing issue with the API call,
        // and Amazon gives us an error with the following message:
        // "You are submitting requests too quickly. Please retry your requests at a slower rate."
        // this else condition lets the user know that something went wrong with the process
          let templateVars = {
            current_user: req.session.user,
            message: 'Oops! Sorry, something unexpected happened. Please try searching again.'
          }
          console.log('THERE WAS AN UNEXPECTED ERROR', err, '\n ERROR MESSAGE: ', err['Error'][0]['Message']);
          res.render('search', templateVars);
        }
      });
    }
  });

  //post handler for vote button, inserts votes to corresponding products
  searchRouter.post('/product', (req, res) => {
    console.log('voted pro asin is: ' + req.body.votedAsin, 'unvoted pro asin is: ' + req.body.unvotedAsin);
    const votedPro   = req.body.votedPro;
    const unvotedPro = req.body.unvotedPro;
    const votedAsin = req.body.votedAsin;
    const unvotedAsin = req.body.unvotedAsin;
    const user = req.session.user;
    //pulls out the row within 'comparisons' table containing
    //the same items in the rendered pair.
    knex.select('*')
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
          console.log('shutest', result);
          console.log(result[0].id);
          console.log(result[0].product_one);
          if(result.length > 0) {
            if(result[0].product_one === votedAsin) {
              const currentVotes = result[0].product_one_votes;
              knex('comparisons')
                .where('id', '=', result[0].id)
                .update({
                  product_one_votes: currentVotes + 1
                })
                .then(function(voteCount) {
                  console.log(voteCount);
                })
            } else if(result[0].product_two === votedAsin) {
                const currentVotes = result[0].product_two_votes;
                knex('comparisons')
                  .where('id', '=', result[0].id)
                  .update({
                    product_two_votes: currentVotes + 1
                  })
                .then(function(voteCount) {
                  console.log(voteCount);
                })
              }
          }
          return result;
        }).catch(function(err) {
            console.log(err);
          })
        .then(function(result) {
          //records which users have voted on which pairs
          console.log('this should be the comparison row: '+ result[0].product_one);
          return knex
            .select('*')
            .from('users')
            .where('email', '=', user)
            .then(function(userRow) {
              console.log('user id: ' + userRow[0].id);
              console.log('comparison row id: ' + result[0].id);
              knex
              .insert({
                user_id: userRow[0].id,
                comparisons_id: result[0].id
              })
              .into('votes')
              .then(function(result) {
                console.log(result);
                res.send("OK");
              })
              .catch(function(err) {
                console.log(err);
              })
            })
            .catch(function(err) {
              console.log(err);
            })
          })
        .catch(function(err) {
          console.log(err);
    });
  });

  return searchRouter
};
