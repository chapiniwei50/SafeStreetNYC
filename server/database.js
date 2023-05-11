var AWS = require('aws-sdk');
require('dotenv').config();
AWS.config.update({
  region: process.env.REGION,
  accessKeyId: process.env.ACCESSKEY,
  secretAccessKey: process.env.SECRETACCESSKEY
});
var db = new AWS.DynamoDB();

//gets username input and returns the password (this is just for one column)
var myDB_getPassword = function (searchTerm, callback) {
  var params = {
    KeyConditions: {
      email: {
        ComparisonOperator: 'EQ',
        AttributeValueList: [{ S: searchTerm }]
      }
    },
    TableName: "accounts",
    AttributesToGet: ['password']
  };

  db.query(params, function (err, data) {
    if (err || data.Items.length == 0) {
      callback(err, null);
    } else {
      callback(err, data.Items[0].password.S);
    }
  });
}

//gets email input and returns the username if existing
var myDB_getEmail = function (searchTerm, language, callback) {
  var params = {
    KeyConditions: {
      email: {
        ComparisonOperator: 'EQ',
        AttributeValueList: [{ S: searchTerm }]
      }
    },
    TableName: "accounts",
    AttributesToGet: ['email']
  };

  db.query(params, function (err, data) {
    if (err || data.Items.length == 0) {
      callback(err, null);
    } else {
      callback(err, data.Items[0].email.S);
    }
  });
}

//gets username input and returns the username if existing
var myDB_userInfo = function (searchTerm, language, callback) {
  var params = {
    Key: {
      "email": {
        S: searchTerm
      }
    },
    TableName: "accounts"
  };
  db.getItem(params, function (err, data) {
    if (err) {
      console.log(err);
      callback(err, null);
    } else {
      callback(err, data.Item);
    }
  });
}

//create a new account with the right db parameters
var myDB_createAccount =
  function (newUsername, newPassword,
    newEmail, callback) {
    var params = {
      TableName: "accounts",
      Item: {
        "username": { S: newUsername },
        "email": { S: newEmail },
        "password": { S: newPassword },
      }
    };

    db.putItem(params, function (err, data) {
      if (err) {
        console.log("error: " + err);
      }
    });
  }

module.exports = {
  passwordLookup: myDB_getPassword,
  emailLookup: myDB_getEmail,
  createAccount: myDB_createAccount,
  getUserInfo: myDB_userInfo
};