const express = require('express');

const viewsController = require('../Controlers/viewsController');

const authController = require('../Controlers/authcontroler');

const router = express.Router();
// ', authController.isLoggedIn,
router.get('/', viewsController.getOverview);
router.get('/tour/:slug', viewsController.getTour);
router.get('/login', viewsController.getLoginForm);
router.get('/me', authController.protectroutes, viewsController.getAccount);

router.post(
  '/submit-user-data',
  authController.protectroutes,
  viewsController.updateUserData
);

module.exports = router;
