const express = require('express');
const Usercontroler = require('./../Controlers/Usercontroler');

const router = express.Router(); //declaring

router.route('/').get(Usercontroler.getalluser).post(Usercontroler.createuser); //for /api/v1/user

router.route('/:id').delete(Usercontroler.deleteuser); //for /api/v1/user/:id

module.exports = router;
