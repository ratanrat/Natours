const express = require('express');

const Tourcontrolers = require('./../Controlers/Tourcontroler');

const authcontroler = require('./../Controlers/authcontroler');

const router = express.Router(); //getting routes api  from app.js

const reviewroute = require('./../routes/reviewroutes'); // for nested routes

router.use('/:toourID/review', reviewroute); //craete review on specific tour
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(Tourcontrolers.getToursWithin);
// /tours-within?distance=233&center=-40,45&unit=mi
// /tours-within/233/center/-40,45/unit/mi

router.route('/distances/:latlng/unit/:unit').get(Tourcontrolers.getDistances);
router
  .route('/')
  .get(Tourcontrolers.getalltour) // protect routes exicute for authorize the acces limit of login user
  .post(
    authcontroler.protectroutes,
    authcontroler.restrictuser('admin', 'lead_guide'),
    Tourcontrolers.createtour
  ); //for /api/v1/tour creating tour

router
  .route('/:id')
  .get(Tourcontrolers.gettouronid)
  .patch(
    authcontroler.protectroutes,
    authcontroler.restrictuser('admin', 'lead_guide'),
    Tourcontrolers.updatetour
  )
  .delete(
    authcontroler.protectroutes,
    authcontroler.restrictuser('admin', 'lead_guide'),
    Tourcontrolers.deletetour
  ); // for /api/v1/tour/id

module.exports = router;
