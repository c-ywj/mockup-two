"use strict";

require('dotenv').config();

const amazon      = require('amazon-product-api');

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");
const login = require("./routes/login");

const client = amazon.createClient({
  awsId: process.env.awsId,
  awsSecret:process.env.awsSecret,
  awsTag:process.env.awsTag
});

// const search = require('./routes/search');

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Mount all resource routes
app.use("/register", usersRoutes(knex));
app.use('/login', login(knex));
// app.use('/search',search);
// Home page
app.get("/", (req, res) => {

  res.render("index");
});


app.get('/search', (req,res) => {
  res.render('search');
});


app.post('/search', (req,res) => {
  client.itemSearch({
    brand: req.params.brand1,
    // keywords: 'television',
    title: req.params.product,
    ItemPage: 1,
    sort: 'salesrank',
    searchIndex: 'Electronics',
    responseGroup: 'ItemAttributes,Images'
  }).then(function(results){
    // app.get("/test", (req, res) => {
      console.log(results);
      // let templateVars = {
      //   image1: results[0].LargeImage[0].URL,
      //   brand1: results[0].ItemAttributes[0].Brand,
      //   ProductType1: results[0].ItemAttributes[0].ProductTypeName,
      //   DetailPageURL1: results[0].DetailPageURL
      //     // jsonObj: res.json(results)
      // };
        // res.render("test2", templateVars);
    // });
  }).catch(function(err){
    console.log(err);
  });
});

app.get("/test", (req, res) => {
  let templateVars = function(results){
    image1: results[0].LargeImage[0].URL,
    brand1: results[0].ItemAttributes[0].Brand,
    ProductType1: results[0].ItemAttributes[0].ProductTypeName,
    DetailPageURL1: results[0].DetailPageURL
      // jsonObj: res.json(results)
  };
    res.render("test2", templateVars);

});


app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
