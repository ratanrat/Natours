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
    reviewcontrolers.settouranduserids, // commit when use method 2||when we use all one handler
    reviewcontrolers.createreview
  ); // fist it comes from touroutes with id then create review
router
  .route('/:id') //for /api/v1/tour creating tour
  .delete(
    authcontroler.protectroutes,
    authcontroler.restrictuser('user'),
    reviewcontrolers.deletereview
  )
  .patch(
    // authcontroler.protectroutes,
    // authcontroler.restrictuser('user'),
    reviewcontrolers.updatereview
  );
module.exports = router;
