const express = require('express');
const cors = require('cors');
require('dotenv').config();
const routes = require('./routes');
const routesDDB = require('./routesDDB');
const bodyParser = require('body-parser')

const app = express();
app.use(cors({
  origin: '*',
}));

var session = require('express-session');
app.use(session({
  secret: 'loginSecret',
  resave: false,
  saveUnitialized: true,
  cookie: { secure: false }
}));

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js and routesDDB.js
app.get('/getlocalcrime', routes.getlocalcrime);
app.get('/getneighborhooddemographics', routes.getneighborhooddemographics);
app.get('/gethospitaltype', routes.gethospitaltype);
app.get('/getlocalhospitals', routes.getlocalhospitals);
app.get('/getrankhousing', routes.getrankhousing);
app.get('/getrankairbnb', routes.getrankairbnb);
app.get('/getavailablerooms', routes.getavailablerooms);
app.get('/findSimilarity', routes.findsimilarbypricecrimeborough);

app.use(bodyParser.json());
app.post('/authenticator', routesDDB.verifyUser);
app.post('/addUser', routesDDB.addUser);
app.get('/externalAuthenticator', routesDDB.verifyExternalUser);
app.get('/isVerified', routesDDB.isVerified);
app.get('/loggingOut', routesDDB.loggingOut);
app.get('/getAvgPercentagePrice', routes.getAvgPercentagePrice);
app.get('/maplocalhospitals', routes.maplocalhospitals);
app.get('/verify', routesDDB.verify);


app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server running at http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/`)
});

module.exports = app;