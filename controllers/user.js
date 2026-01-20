const User = require("../models/user");

/**
 * RENDER SIGNUP FORM
 */
module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

/**
 * SIGNUP LOGIC
 */
module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);

    // Auto-login after signup
    req.login(registeredUser, (err) => {
      if (err) return next(err);

      req.flash("success", "Welcome to StayEasy!");
      return res.redirect("/listings");
    });
  } catch (err) {
    req.flash("danger", err.message);
    return res.redirect("/signup");
  }
};

/**
 * RENDER LOGIN FORM
 */
module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

/**
 * LOGIN SUCCESS HANDLER
 * (Passport already authenticated user before this runs)
 */
module.exports.login = (req, res) => {
  req.flash("success", "Welcome Back!");
  res.redirect(res.locals.returnTo || "/listings");
};

/**
 * LOGOUT
 */
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.flash("success", "Goodbye!");
    res.redirect("/listings");
  });
};
