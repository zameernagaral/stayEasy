const express = require('express');
const router = express.Router();
const User = require("../models/user"); 
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { route } = require('./listing');
const {isLoggedIn, saveRedirectUrl} = require('../middleware.js');
const userController = require('../controllers/user.js');

router.route("signup").get(userController.renderSignupForm).post(wrapAsync( userController.signup)); 
//login route
router.route("/login").get(userController.renderLoginForm).post(saveRedirectUrl,passport.authenticate("local", {  failureRedirect: "/login",failureFlash: true, successFlash: true }), userController.login);


router.get("/logout",userController.logout);
module.exports = router;
