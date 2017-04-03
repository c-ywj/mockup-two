"use strict";
const amazon = require('amazon-product-api');
const express = require('express');
// const rand1 = require('random-seed').create(seed),
// const rand = require('random-seed').create(seed);

const searchRouter  = express.Router();
const client = amazon.createClient({
  awsId: process.env.AWS_ID,
  awsSecret:process.env.AWS_SECRET,
  awsTag:process.env.AWS_TAG
});

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

  searchRouter.get('/', (req, res) => {
    if (!req.session.user) {
      res.redirect('/');
    } else {
      let templateVars = {message: '', current_user: req.session.user};
      res.render("search", templateVars);
    }
  });

  searchRouter.get("/product", (req, res) => {
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
      const pro1 = {
        title: results[0][rand1].ItemAttributes[0].Title,
        type:  results[0][rand1].ItemAttributes[0].ProductTypeName
      }
      const pro2 = {
        title: results[1][rand2].ItemAttributes[0].Title,
        type:  results[1][rand2].ItemAttributes[0].ProductTypeName
      }
      console.log('pro1 type: ' + pro1.type);
      console.log('pro2 type: ' + pro2.type);
      return knex
        .select('*')
        .from('comparisons')
        .where({
          product_one: pro1.title[0],
          product_two: pro2.title[0]
        })
        .orWhere({
          product_one: pro2.title[0],
          product_two: pro1.title[0]
        })
        .then(function(result) {
          console.log(result);
          if(result.length === 0 &&
            pro1.title[0] !== pro2.title[0]) {
            return knex
              .insert({product_one: pro1.title[0], product_two: pro2.title[0]}).into('comparisons')
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
                  },
                  br2: {
                    image2: results[1][rand2].LargeImage[0].URL,
                    brand2: results[1][rand2].ItemAttributes[0].Brand,
                    ProductType2: results[1][rand2].ItemAttributes[0].ProductTypeName,
                    DetailPageURL2: results[1][rand2].DetailPageURL,
                    pTitle2: results[1][rand2].ItemAttributes[0].Title,
                    description: results[1][rand2].ItemAttributes[0].Feature
                  }
                }
                res.render("searchres", templateVars);
              })
          } else if (result.length > 0 &&
                    pro1.title[0] !== pro2.title[0]){
              let templateVars = {
                current_user: req.session.user,
                br1: {
                  image1: results[0][rand1].LargeImage[0].URL,
                  brand1: results[0][rand1].ItemAttributes[0].Brand,
                  ProductType1: results[0][rand1].ItemAttributes[0].ProductTypeName,
                  DetailPageURL1: results[0][rand1].DetailPageURL,
                  pTitle1: results[0][rand1].ItemAttributes[0].Title,
                  description: results[0][rand1].ItemAttributes[0].Feature,
                },
                br2: {
                  image2: results[1][rand2].LargeImage[0].URL,
                  brand2: results[1][rand2].ItemAttributes[0].Brand,
                  ProductType2: results[1][rand2].ItemAttributes[0].ProductTypeName,
                  DetailPageURL2: results[1][rand2].DetailPageURL,
                  pTitle2: results[1][rand2].ItemAttributes[0].Title,
                  description: results[1][rand2].ItemAttributes[0].Feature
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
  });

  searchRouter.post('/product', (req, res) => {
    console.log('voted pro is: ' +req.body.votedPro, 'unvoted pro is: ' + req.body.unvotedPro);
    const votedPro   = req.body.votedPro;
    const unvotedPro = req.body.unvotedPro;
    const user = req.session.user;
    console.log('user is : ' + user);
    knex.select('*')
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
          console.log(result);
          console.log(result[0].id);
          console.log(result[0].product_one);
          if(result.length > 0) {
            if(result[0].product_one === votedPro) {
              const currentVotes = result[0].product_one_votes;
              knex('comparisons')
                .where('id', '=', result[0].id)
                .update({
                  product_one_votes: currentVotes + 1
                })
              .then(function(voteCount) {
                console.log(voteCount);
              })
            } else if(result[0].product_two === votedPro) {
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
        }) .catch(function(err) {
              console.log(err);
            })
        .then(function(result) {
          console.log('this should be the comparison row: '+ result[0].product_one);
          return knex.select('*')
                  .from('users')
                  .where('email', '=', user)
                  .then(function(userRow) {
                    console.log('user id: ' + userRow[0].id);
                    console.log('comparison row id: ' + result[0].id);
                    knex.insert({
                      user_id: userRow[0].id,
                      comparisons_id: result[0].id
                    }).into('votes')
                    .then(function(result) {
                      console.log(result);
                    }).catch(function(err) {
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
