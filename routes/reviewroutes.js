const express = require('express');

const reviewcontrolers = require('./../Controlers/reviewcontroler');

const authcontroler = require('./../Controlers/authcontroler');

const router = express.Router(); //getting routes api  from app.js

router
  .route('/')
  .get(reviewcontrolers.getallreview) // protect routes exicute for authorize the acces limit of login user
  .post(authcontroler.protectroutes, reviewcontrolers.createreview); //for /api/v1/tour creating tour

// router.route('/').post(
//   authcontroler.protectroutes,
//   authcontroler.restrictuser('user'), //only user can write review
//   reviewcontroler.createreview
// );

// router.route('/').get(reviewcontroler.getallreview);

module.exports = router;
