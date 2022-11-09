const express = require('express');
const Usercontroler = require('./../Controlers/Usercontroler');
const authcontroler = require('./../Controlers/authcontroler');

const router = express.Router(); //declaring it store '/api/v1/users'
router.post('/signup', authcontroler.signup);
router
  .route('/')
  .get(Usercontroler.getalluser)
  .post(Usercontroler.createuser); //for /api/v1/user

router.route('/:id').delete(Usercontroler.deleteuser); //for /api/v1/user/:id

module.exports = router;
