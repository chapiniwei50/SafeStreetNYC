var db = require('../server/database.js');
const sjcl = require('sjcl');

// TODO The code for your own routes should go here
var getMain = function (req, res) {
  req.session.currWall = null;
  req.session.isVerified = false;
  res.render('main.ejs');
}

//render homepage
//NEW: getHomepage, homepage.ejs
var getHomepage = function (req, res) {
  req.session.currWall = null;
  if (!req.session.username) {
    return res.redirect('/')
  }
  res.render('homepage.ejs', { "check": req.session.isVerified })
}

//for results if the username and password are correct
var postResultsUser = function (req, res) {
  req.session.currWall = null;
  var usernameCheck = req.body.username;
  var passwordCheck = req.body.password;
  var hashPassword = sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(passwordCheck));
  db.passwordLookup(usernameCheck, function (err, data) {
    if (data == hashPassword && !err) {
      req.session.username = req.body.username;
      req.session.password = req.body.password;
      req.session.isVerified = true;
      res.render('checklogin.ejs', { "check": req.session.isVerified });
    } else {
      req.session.isVerified = false;
      res.render('checklogin.ejs', { "check": req.session.isVerified });
    }
  });
}

//gets signup page
var getSignup = function (req, res) {
  req.session.currWall = null;
  res.render('signup.ejs', { "check": req.session.isVerified });
}

//gets logout page
var getLogout = function (req, res) {
  req.session.currWall = null;
  req.session.isVerified = false;
  res.render('main.ejs', {});
      req.session.username = null;
	  req.session.destroy();
}
module.exports = {
  get_main: getMain,
  verifyUser: postResultsUser,
  get_signup: getSignup,
  get_logout: getLogout,
  get_homepage: getHomepage
}