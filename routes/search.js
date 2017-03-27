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
    console.log(req, req.query.brand1, req.query.product);
    client.itemSearch({
      brand: req.query.brand1,
      // keywords: 'television',
      title: req.query.product,
      ItemPage: 1,
      sort: 'salesrank',
      searchIndex: 'Electronics',
      responseGroup: 'ItemAttributes,Images'
    }).then(function(results){
      console.log(results);
      let templateVars = {
        image1: results[0].LargeImage[0].URL,
        brand1: results[0].ItemAttributes[0].Brand,
        ProductType1: results[0].ItemAttributes[0].ProductTypeName,
        DetailPageURL1: results[0].DetailPageURL
          // jsonObj: res.json(results)
      }
        res.render("test2", templateVars);
    }).catch(function(err){
      console.log('test', JSON.stringify(err));
    });

  });

  return searchRouter
};
