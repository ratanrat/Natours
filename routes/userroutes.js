const express = require('express');
const Usercontroler = require('./../Controlers/Usercontroler');
const authcontroler = require('./../Controlers/authcontroler');

const router = express.Router(); //declaring it store '/api/v1/users'

router.post('/forgotpassword', authcontroler.forgotpassword);
router.patch('/resetpassword/:token', authcontroler.resetpassword);
router.post('/signup', authcontroler.signup);
router.post('/login', authcontroler.login);
router.delete('/deleteme', authcontroler.protectroutes, Usercontroler.deleteme);

router
  .route('/')
  .get(Usercontroler.getalluser)
  .post(Usercontroler.createuser); //for /api/v1/user

router.route('/:id').delete(Usercontroler.deleteuser); //for /api/v1/user/:id
router.patch(
  '/changepassword',
  authcontroler.protectroutes,
  authcontroler.changepassword
);
router.patch('/updateme', authcontroler.protectroutes, Usercontroler.upateme);

module.exports = router;
