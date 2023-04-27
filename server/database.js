var AWS = require('aws-sdk');
AWS.config.update({ 
    region: 'us-east-1',
    accessKeyId: 'AKIAUFTWIGAVYHESOC5V',
    secretAccessKey: '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'
 });
var db = new AWS.DynamoDB();

//gets username input and returns the password (this is just for one column)
var myDB_getPassword = function (searchTerm, callback) {
  var params = {
    KeyConditions: {
      username: {
        ComparisonOperator: 'EQ',
        AttributeValueList: [{ S: searchTerm }]
      }
    },
    TableName: "users",
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

//gets username input and returns the username if existing
var myDB_getUsername = function (searchTerm, language, callback) {
  var params = {
    KeyConditions: {
      username: {
        ComparisonOperator: 'EQ',
        AttributeValueList: [{ S: searchTerm }]
      }
    },
    TableName: "users",
    AttributesToGet: ['username']
  };

  db.query(params, function (err, data) {
    if (err || data.Items.length == 0) {
      callback(err, null);
    } else {
      callback(err, data.Items[0].username.S);
    }
  });
}

//gets username input and returns the username if existing
var myDB_userInfo = function (searchTerm, language, callback) {
  var params = {
    Key: {
      "username": {
        S: searchTerm
      }
    },
    TableName: "users"
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
  function (newUsername, newPassword, newFullname, newAffiliation,
    newEmail, newBirthday, newInterest, newPfpURL, callback) {

    var interestArr = [];
    for (let i = 0; i < newInterest.length; i++) {
      var newIt =
      {
        "S": newInterest[i]
      }
      interestArr.push(newIt);
    }

    var params = {
      TableName: "users",
      Item: {
        "username": { S: newUsername },
        "affiliation": { S: newAffiliation },
        "birthday": { S: newBirthday },
        "email": { S: newEmail },
        "fullname": { S: newFullname },
        "interest": { L: interestArr },
        "password": { S: newPassword },
        "pfpURL": { S: newPfpURL }
      }
    };

    db.putItem(params, function (err, data) {
      if (err) {
        console.log("error: " + err);
      }
    });
  }

var database = {
  passwordLookup: myDB_getPassword,
  usernameLookup: myDB_getUsername,
  createAccount: myDB_createAccount,
  getUserInfo: myDB_userInfo
};

module.exports = database;