const express = require('express');
const Tourcontrolers = require('./../Controlers/Tourcontroler');

const router = express.Router(); //declaring

router
  .route('/')

  .post(Tourcontrolers.createtour); //for /api/v1/tour creating tour

// router
//   .route('/:id')
//   .get(Tourcontrolers.gettouronid)
//   .patch(Tourcontrolers.updatetour)
//   .delete(Tourcontrolers.deletetour); // for /api/v1/tour/id

module.exports = router;
