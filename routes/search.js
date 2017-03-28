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
const rand3 = Math.floor(Math.random() * 2);
const rand4 = Math.floor(Math.random() * 2);

const amzSearch = function(brand, category) {
    const results = client.itemSearch({
                    brand: brand,
                    // keywords: 'television',
                    title: category,
                    ItemPage: 1,
                    sort: 'salesrank',
                    searchIndex: 'Electronics',
                    responseGroup: 'ItemAttributes,Images'
                  })
                    return results;
}
module.exports = (knex) => {
  searchRouter.get("/", (req, res) => {
    console.log(req.query.brand1, req.query.brand2);
    Promise.all([
      amzSearch(req.query.brand1, req.query.category),
      amzSearch(req.query.brand2, req.query.category)
    ])
    .then(function(results) {
      const pro1 = {
        title: results[rand3][rand1].ItemAttributes[0].Title,
        type:  results[rand3][rand1].ItemAttributes[0].ProductTypeName
      }
      const pro2 = {
        title: results[rand4][rand2].ItemAttributes[0].Title,
        type:  results[rand4][rand2].ItemAttributes[0].ProductTypeName
      }
      console.log('this is pro1 :' + pro1.type);
      console.log('this is pro2 :' + pro2.type);
      knex.select('*').from('comparisons')
                      .where('product_one', '=', pro1.title[0],
                             'product_two', '=', pro2.title[0]
                             )
        .then(function(result) {
          console.log(result);
          if(result.length === 0 && pro1.type[0] === pro2.type[0] && pro1.title !== pro2.title) {
            knex.insert({product_one: pro1.title, product_two: pro2.title}).into('comparisons')
                .then(function(result) {
                  // console.log(pro1.type);
                  // return result;
                  const productTitles = {
                      pro1: results[rand3][rand1].ItemAttributes[0].Title,
                      pro2: results[rand4][rand2].ItemAttributes[0].Title
                    };
                  // console.log(results[0][rand1])
                  let templateVars = {
                    br1: {
                      image1: results[rand3][rand1].LargeImage[0].URL,
                      brand1: results[rand3][rand1].ItemAttributes[0].Brand,
                      ProductType1: results[rand3][rand1].ItemAttributes[0].ProductTypeName,
                      DetailPageURL1: results[rand3][rand1].DetailPageURL,
                      pTitle1: results[rand3][rand1].ItemAttributes[0].Title,
                      description: results[rand3][rand1].ItemAttributes[0].Feature,
                    },
                    br2: {
                      image2: results[rand4][rand2].LargeImage[0].URL,
                      brand2: results[rand4][rand2].ItemAttributes[0].Brand,
                      ProductType2: results[rand4][rand2].ItemAttributes[0].ProductTypeName,
                      DetailPageURL2: results[rand4][rand2].DetailPageURL,
                      pTitle2: results[rand4][rand2].ItemAttributes[0].Title,
                      description: results[rand4][rand2].ItemAttributes[0].Feature
                    }
                  }
              res.render("test2", templateVars);
            })
            .catch(function(err) {
              console.log(err);
              res.status(500).render("error");
            })
          } else {
              const productTitles = {
                pro1: results[rand3][rand1].ItemAttributes[0].Title,
                pro2: results[rand4][rand2].ItemAttributes[0].Title
              };
                  // console.log(results[0][rand1])
              let templateVars = {
                br1: {
                  image1: results[rand3][rand1].LargeImage[0].URL,
                  brand1: results[rand3][rand1].ItemAttributes[0].Brand,
                  ProductType1: results[rand3][rand1].ItemAttributes[0].ProductTypeName,
                  DetailPageURL1: results[rand3][rand1].DetailPageURL,
                  pTitle1: results[rand3][rand1].ItemAttributes[0].Title,
                  description: results[rand3][rand1].ItemAttributes[0].Feature,
                },
                br2: {
                  image2: results[rand4][rand2].LargeImage[0].URL,
                  brand2: results[rand4][rand2].ItemAttributes[0].Brand,
                  ProductType2: results[rand4][rand2].ItemAttributes[0].ProductTypeName,
                  DetailPageURL2: results[rand4][rand2].DetailPageURL,
                  pTitle2: results[rand4][rand2].ItemAttributes[0].Title,
                  description: results[rand4][rand2].ItemAttributes[0].Feature
                }
             }
            res.render("test2", templateVars);
          }
        }).catch(function(err) {
          console.log(err);
          res.status(500).render("error");
        })
        // return results;
    })
    .catch(function(err){
      console.log('ERROR', err);
    });

  });

  return searchRouter
};
