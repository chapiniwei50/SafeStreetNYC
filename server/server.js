const express = require('express');
const cors = require('cors');
const config = require('./config');
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
// provide their handlers that we implemented in routes.js
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
// app.get('/author/:type', routes.author);
// app.get('/random', routes.random);
// app.get('/song/:song_id', routes.song);
// app.get('/album/:album_id', routes.album);
// app.get('/albums', routes.albums);
// app.get('/album_songs/:album_id', routes.album_songs);
// app.get('/top_songs', routes.top_songs);
// app.get('/top_albums', routes.top_albums);
// app.get('/search_songs', routes.search_songs);


app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;