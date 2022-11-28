const express = require('express');

const reviewcontrolers = require('./../Controlers/reviewcontroler');

const authcontroler = require('./../Controlers/authcontroler');

const router = express.Router({ mergeParams: true }); //getting routes api  from app.js and mergerparams for nested routes geting params from touroutes

router
  .route('/')
  .get(reviewcontrolers.getallreview) // protect routes exicute for authorize the acces limit of login user
  .post(
    authcontroler.protectroutes,
    authcontroler.restrictuser('user'),
    reviewcontrolers.createreview
  ); //for /api/v1/tour creating tour

module.exports = router;
