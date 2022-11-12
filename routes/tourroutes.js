const express = require('express');
const Tourcontrolers = require('./../Controlers/Tourcontroler');
const authcontroler = require('./../Controlers/authcontroler');

const router = express.Router(); //getting routes api  from app.js

router
  .route('/')
  .get(authcontroler.protectroute, Tourcontrolers.getalltour)
  .post(Tourcontrolers.createtour); //for /api/v1/tour creating tour

router
  .route('/:id')
  .get(Tourcontrolers.gettouronid)
  .patch(Tourcontrolers.updatetour)
  .delete(Tourcontrolers.deletetour); // for /api/v1/tour/id

module.exports = router;
