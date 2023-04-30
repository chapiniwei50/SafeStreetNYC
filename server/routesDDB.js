var db = require('../server/database.js');
const sjcl = require('sjcl');

//for results if the username and password are correct
var postResultsUser = function (req, res) {
  var emailCheck = req.body.email;
  var passwordCheck = req.body.password;
  var hashPassword = sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(passwordCheck));
  db.passwordLookup(emailCheck, function (err, data) {
    if (data == hashPassword && !err) {
      req.session.password = req.body.password;
      req.session.email = req.body.email;
      req.session.isVerified = true;
    } else {
      req.session.isVerified = false;
    }
    res.send({ "check": req.session.isVerified });
  });
}

var postNewAccount = function (req, res) {
  db.emailLookup(req.body.email, "email", function (err, data) {
    if (data == null || err) {
      var hashPassword = sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(req.body.password));
      req.session.username = req.body.username;
      req.session.email = req.body.email;
      req.session.password = req.body.password;
      db.createAccount(req.session.username, hashPassword, req.session.email, function (err, data) {});
      req.session.isVerified = true;
    } else {
      req.session.isVerified = false;
    }
    res.send({ "check": req.session.isVerified });
  });
}

var externalAuthenticator = function (req, res) {
  db.emailLookup(req.body.email, "email", function (err, data) {
    if (data == null || err) {
      var hashPassword = sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(req.body.password));
      req.session.username = req.body.username;
      req.session.email = req.body.email;
      req.session.password = req.body.password;
      console.log(req.session.username + " " + req.session.email + " " + req.session.password);
      db.createAccount(req.session.username, hashPassword, req.session.email, function (err, data) {});
      req.session.isVerified = true;
    } else {
      req.session.isVerified = true;
      db.passwordLookup(req.session.password, function (err, data) {
        if (data == hashPassword && !err) {
          req.session.password = req.body.password;
          req.session.email = req.body.email;
          req.session.isVerified = true;
        } else {
          req.session.isVerified = false;
        }
    })
   }
   res.send({ "check": req.session.isVerified });
  })
}

module.exports = {
  verifyUser: postResultsUser,
  addUser: postNewAccount,
  verifyExternalUser: externalAuthenticator
}