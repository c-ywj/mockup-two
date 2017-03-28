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
const rand1 = Math.floor(Math.random() * 5);
const rand2 = Math.floor(Math.random() * 5);

module.exports = (knex) => {
  searchRouter.get("/", (req, res) => {
    console.log(req.query.brand1, req.query.brand2);
    Promise.all([
      client.itemSearch({
        brand: req.query.brand1,
        // keywords: 'television',
        title: req.query.product,
        ItemPage: 1,
        sort: 'salesrank',
        searchIndex: 'Electronics',
        responseGroup: 'ItemAttributes,Images'
      }),
      client.itemSearch({
        brand: req.query.brand2,
        // keywords: 'television',
        title: req.query.product,
        ItemPage: 1,
        sort: 'salesrank',
        searchIndex: 'Electronics',
        responseGroup: 'ItemAttributes,Images'
      })]).
    then(function(results){
      const productTitles = {
        pro1: results[0][rand1].ItemAttributes[0].Title,
        pro2: results[1][rand2].ItemAttributes[0].Title
      };
      console.log(results[0][rand1])
      let templateVars = {
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
            description: results[0][rand2].ItemAttributes[0].Feature
          }
          // jsonObj: res.json(results)
      }
        console.log(rand1, rand2);
        res.render("test2", templateVars);
        return productTitles;
    }).then(function(results) {
        console.log(results);
        knex.insert({product_one: results.pro1[0], product_two: results.pro2[0]})
            .into('comparisons')
            .then(function(results) {
              return results;
            })
            .catch(function(err) {
              console.log(err);
            })
    }).catch(function(err){
      console.log('ERROR', err);
    });

  });

  return searchRouter
};
