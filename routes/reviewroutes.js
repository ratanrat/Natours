const express = require('express');

const reviewcontrolers = require('./../Controlers/reviewcontroler');

const authcontroler = require('./../Controlers/authcontroler');

const router = express.Router({ mergeParams: true }); //getting routes api  from app.js and mergerparams for nested routes geting params from touroutes

//after this all routes check protect routes
router.use(authcontroler.protectroutes);

router
  .route('/')
  .get(reviewcontrolers.getallreview) // protect routes exicute for authorize the acces limit of login user
  .post(
    authcontroler.restrictuser('user'),
    reviewcontrolers.settouranduserids, // commit when use method 2||when we use all one handler
    reviewcontrolers.createreview
  ); // fist it comes from touroutes with id then create review
router
  .route('/:id') //for /api/v1/tour creating tour
  .get(reviewcontrolers.getReview)
  .delete(
    authcontroler.restrictuser('user', 'admin'),
    reviewcontrolers.deletereview
  )
  .patch(
    authcontroler.restrictuser('user', 'admin'),
    reviewcontrolers.updatereview
  );
module.exports = router;
