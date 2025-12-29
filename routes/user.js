const express = require('express');
const router = express.Router();
const User = require("../models/user"); 
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async(req, res) => {
    try {
         let {username,email,password} = req.body;
    const newUser = new User({username,email});
    const registeredUser = await User.register(newUser,password);
    req.flash("success", "Welcome to StayEasy!");
        res.redirect("/listings");
    } catch (err) {
        req.flash("danger", `${err.message}`);
            return res.redirect("/signup");
    }
   
})); 

//login route
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

router.post("/login",passport.authenticate("local", {  failureRedirect: "/login",failureFlash: true, successFlash: true }), async(req, res) => {
    req.flash("success", "Welcome Back!");
    res.redirect("/listings");
});
module.exports = router;
