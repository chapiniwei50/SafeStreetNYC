const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js
app.get('/getlocalcrime', routes.getlocalcrime);
app.get('/getneighborhooddemographics/:neighborhood', routes.getneighborhooddemographics);
app.get('/gethospitaltype', routes.gethospitaltype);
app.get('/getlocalhospitals', routes.getlocalhospitals);

app.get('/authenticator', routesDDB.postResultsUser);


app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;