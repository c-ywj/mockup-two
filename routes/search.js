// "use strict";
//
// const express  = require('express');
// const search = express.Router();
//
// module.exports = () => {
//
//   register.get("/", (req, res) => {
//     res.render('register');
//   });
//
//   register.post('/', (req, res) => {
//     let iEmail = req.body.email;
//     let iPassword = req.body.password;
//
//     knex
//       .select('*')
//       .from('users')
//       .where('email', '=', iEmail)
//       .then((result) => {
//         if (result.length === 1) {
//           console.log('This user already exists');
//           res.redirect('/register');
//         } else {
//           knex
//           .insert({email: iEmail, password: iPassword, role: 'Consumer'})
//           .into('users')
//           .then(result => {
//             console.log(`Inserted ${iEmail} into users`);
//             res.redirect('/');
//           })
//           .catch(err => {
//             console.log(err);
//             res.redirect('/register');
//           })
//
//         }
//       })
//       .catch((e) => {
//         console.log('Something went wrong: ', e);
//       })
//   });
//
//   return register;
// }
