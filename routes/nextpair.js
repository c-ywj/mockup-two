"use strict";
const amazon = require('amazon-product-api');
const express = require('express');
const nextPairRouter  = express.Router();
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

  nextPairRouter.post("/", (req, res) => {
    if (!req.session.user) {
      res.redirect('/');
    } else {
      const rand1 = Math.floor(Math.random() * 8);
      const rand2 = Math.floor(Math.random() * 8);
      Promise.all([
        amzSearch(req.body.brand1, req.body.category, req.body.keywords),
        amzSearch(req.body.brand2, req.body.category, req.body.keywords)
      ])
      .then(function(results) {
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
                  res.json(templateVars);
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
              res.json(templateVars);
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
  return nextPairRouter;
};