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
// Home page
app.get("/", (req, res) => {
  res.render("index");
});

const client = amazon.createClient({
  awsId: process.env.AWS_ID,
  awsSecret: process.env.AWS_SECRET,
  awsTag: process.env.AWS_TAG
});

client.itemSearch({
  brand: 'Samsung',
  keywords: 'television',
  title: 'TV',
  ItemPage: 1,
  sort: 'salesrank',
  searchIndex: 'Electronics',
  condition: 'New',
  responseGroup: 'ItemAttributes,Images'
}).then(function(results){
  app.get("/test", (req, res) => {
    let templateVars = {
      image1: results[0].LargeImage[0].URL,
      brand1: results[0].ItemAttributes[0].Brand,
      ProductType1: results[0].ItemAttributes[0].ProductTypeName,
      DetailPageURL1: results[0].DetailPageURL
    };
    res.json(results);
    res.render("test2", templateVars);
  });
    return results;
})
// .then(function(results) {
//     knex.insert({
//       name: results[0].ItemAttributes[0].Title,
//       brand: results[0].ItemAttributes[0].Brand,
//       category: results[0].ItemAttributes[0].ProductTypeName
//     }).into('products')
//       .then(function(results) {
//         console.log('hit here, should be inserted');
//       });
// })

.catch(function(err){
  console.log(err);
});


app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
