const express = require('express');
const Usercontroler = require('./../Controlers/Usercontroler');
const authcontroler = require('./../Controlers/authcontroler');

const router = express.Router(); //declaring it store '/api/v1/users'

router.post('/signup', authcontroler.signup); //create user
router.post('/login', authcontroler.login); //login user

router.post('/forgotpassword', authcontroler.forgotpassword); //send token for password forgot
router.patch('/resetpassword/:token', authcontroler.resetpassword); //get token and change password

//after this all routes check protect routes
router.use(authcontroler.protectroutes);

// get self info
router.get('/me', Usercontroler.getme, Usercontroler.getUser);

//deactive self account
router.delete('/deleteme', Usercontroler.deleteme);

//update selef like name and email except password
router.patch('/updateme', Usercontroler.upateme);

//uuser self update password
router.patch('/changepassword', authcontroler.changepassword);

//after this all routes check protect routes and must be admin
router.use(authcontroler.restrictuser('admin'));

// get all user
router.route('/').get(authcontroler.protectroutes, Usercontroler.getalluser);

router
  .route('/:id') //for /api/v1/user/:id
  .delete(authcontroler.protectroutes, Usercontroler.deleteuser)
  .patch(Usercontroler.updateeuser); //admin update all info of user

module.exports = router;
