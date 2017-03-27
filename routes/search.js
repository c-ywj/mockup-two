"use strict";
const amazon = require('amazon-product-api');
const express = require('express');
const searchRouter  = express.Router();
const client = amazon.createClient({
  awsId: process.env.AWS_ID,
  awsSecret:process.env.AWS_SECRET,
  awsTag:process.env.AWS_TAG
});

module.exports = () => {
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

      console.log(results[0][0])
      let templateVars = {
        br1: {
          image1: results[0][0].LargeImage[0].URL,
          brand1: results[0][0].ItemAttributes[0].Brand,
          ProductType1: results[0][0].ItemAttributes[0].ProductTypeName,
          DetailPageURL1: results[0][0].DetailPageURL
        },
          br2: {
            image2: results[1][0].LargeImage[0].URL,
            brand2: results[1][0].ItemAttributes[0].Brand,
            ProductType2: results[1][0].ItemAttributes[0].ProductTypeName,
            DetailPageURL1: results[1][0].DetailPageURL
          }
          // jsonObj: res.json(results)
      }
        res.render("test2", templateVars);
    }).catch(function(err){
      console.log('ERROR', err);
    });

  });

  return searchRouter
};
