const mysql = require('mysql')
const config = require('./config.json')

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});
connection.connect((err) => err && console.log(err));

/******************
 * WARM UP ROUTES *
 ******************/

// Route 1: GET /author/:type
const author = async function(req, res) {
  // TODO (TASK 1): replace the values of name and pennKey with your own
  const name = 'Jiwoong Matt Park';
  const pennKey = 'mtp0326';

  // checks the value of type the request parameters
  // note that parameters are required and are specified in server.js in the endpoint by a colon (e.g. /author/:type)
  if (req.params.type === 'name') {
    // res.send returns data back to the requester via an HTTP response
    res.send(`Created by ${name}`);
  } else if (req.params.type === 'pennkey') {
    // TODO (TASK 2): edit the else if condition to check if the request parameter is 'pennkey' and if so, send back response 'Created by [pennkey]'
    res.send(`Created by ${pennKey}`);
  } else {
    // we can also send back an HTTP status code to indicate an improper request
    res.status(400).send(`'${req.params.type}' is not a valid author type. Valid types are 'name' and 'pennkey'.`);
  }
}

// Route 2: GET /random
const random = async function(req, res) {
  // you can use a ternary operator to check the value of request query values
  // which can be particularly useful for setting the default value of queries
  // note if users do not provide a value for the query it will be undefined, which is falsey
  const explicit = req.query.explicit === 'true' ? 1 : 0;

  // Here is a complete example of how to query the database in JavaScript.
  // Only a small change (unrelated to querying) is required for TASK 3 in this route.
  connection.query(`
    SELECT *
    FROM Songs
    WHERE explicit <= ${explicit}
    ORDER BY RAND()
    LIMIT 1
  `, (err, data) => {
    if (err || data.length === 0) {
      // if there is an error for some reason, or if the query is empty (this should not be possible)
      // print the error message and return an empty object instead
      console.log(err);
      res.json({});
    } else {
      // Here, we return results of the query as an object, keeping only relevant data
      // being song_id and title which you will add. In this case, there is only one song
      // so we just directly access the first element of the query results array (data)
      // TODO (TASK 3): also return the song title in the response
      res.json({
        song_id: data[0].song_id,
        title: data[0].title
      });
    }
  });
}

/********************************
 * BASIC SONG/ALBUM INFO ROUTES *
 ********************************/

// Route 3: GET /song/:song_id
const song = async function(req, res) {
  // TODO (TASK 4): implement a route that given a song_id, returns all information about the song
  // Most of the code is already written for you, you just need to fill in the query
  const songID = req.params.song_id;

  connection.query(`
    SELECT *
    FROM Songs
    WHERE song_id = '${songID}'
    `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json({
        song_id: data[0].song_id,
        album_id: data[0].album_id,
        title: data[0].title,
        number: data[0].number,
        duration: data[0].duration,
        plays: data[0].plays,
        danceability: data[0].danceability,
        energy: data[0].energy,
        valence: data[0].valence,
        tempo: data[0].tempo,
        key_mode: data[0].key_mode,
        explicit: data[0].explicit
      });
    }
  });
}

// Route 4: GET /album/:album_id
const album = async function(req, res) {
  // TODO (TASK 5): implement a route that given a album_id, returns all information about the album
  const albumID = req.params.album_id;

  connection.query(`
    SELECT *
    FROM Albums
    WHERE album_id = '${albumID}'
    `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json({
        album_id: data[0].album_id,
        title: data[0].title,
        release_date: data[0].release_date,
        thumbnail_url: data[0].thumbnail_url
      });
    }
  });
}

// Route 5: GET /albums
const albums = async function(req, res) {
  // TODO (TASK 6): implement a route that returns all albums ordered by release date (descending)
  // Note that in this case you will need to return multiple albums, so you will need to return an array of objects
  const albumID = req.params.album_id;
  const albumList = [];

  connection.query(`
    SELECT *
    FROM Albums
    ORDER BY release_date DESC
    `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      for(let i = 0; i < data.length; i++) {
        let obj = {
          album_id: data[i].album_id,
          title: data[i].title,
          release_date: data[i].release_date,
          thumbnail_url: data[i].thumbnail_url
        }
        albumList.push(obj);
      }
      res.json(albumList);
    }
  });
}

// Route 6: GET /album_songs/:album_id
const album_songs = async function(req, res) {
  // TODO (TASK 7): implement a route that given an album_id, returns all songs on that album ordered by track number (ascending)
  const albumID = req.params.album_id;
  const songList = [];

  connection.query(`
    SELECT *
    FROM Songs
    WHERE album_id = '${albumID}'
    ORDER BY number ASC
    `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      for(let i = 0; i < data.length; i++) {
        let obj = {
          song_id: data[i].song_id,
          title: data[i].title,
          number: data[i].number,
          duration: data[i].duration,
          plays: data[i].plays
        }
        songList.push(obj);
      }
      res.json(songList);
    }
  });
}

/************************
 * ADVANCED INFO ROUTES *
 ************************/

// Route 7: GET /top_songs
const top_songs = async function(req, res) {
  const page = req.query.page;
  const songList = [];
  // TODO (TASK 8): use the ternary (or nullish) operator to set the pageSize based on the query or default to 10
  const pageSize = req.query.page_size ?? 10;

  if (!page) {
    // TODO (TASK 9)): query the database and return all songs ordered by number of plays (descending)
    connection.query(`
      SELECT S.song_id, A.title as album, S.album_id, S.plays, S.title
      FROM Songs S JOIN Albums A ON S.album_id = A.album_id
      ORDER BY S.plays DESC
      `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        for(let i = 0; i < data.length; i++) {
          let obj = {
            song_id: data[i].song_id,
            title: data[i].title,
            album_id: data[i].album_id,
            album: data[i].album,
            plays: data[i].plays
          }
          songList.push(obj);
        }
        res.json(songList);
      }
    });
  } else {
    // TODO (TASK 10): reimplement TASK 9 with pagination
    // Hint: use LIMIT and OFFSET (see https://www.w3schools.com/php/php_mysql_select_limit.asp)
    connection.query(`
      SELECT S.song_id, A.title as album, S.album_id, S.plays, S.title
      FROM Songs S JOIN Albums A ON S.album_id = A.album_id
      ORDER BY plays DESC
      LIMIT ${pageSize}
      OFFSET ${(page - 1)*pageSize}
      `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        for(let i = 0; i < data.length; i++) {
          let obj = {
            song_id: data[i].song_id,
            title: data[i].title,
            album_id: data[i].album_id,
            album: data[i].album,
            plays: data[i].plays
          }
          songList.push(obj);
        }
        res.json(songList);
      }
    });
  }
}

// Route 8: GET /top_albums
const top_albums = async function(req, res) {
  // TODO (TASK 11): return the top albums ordered by aggregate number of plays of all songs on the album (descending), with optional pagination (as in route 7)
  
  const page = req.query.page;
  const albumList = [];
  // TODO (TASK 8): use the ternary (or nullish) operator to set the pageSize based on the query or default to 10
  const pageSize = req.query.page_size ?? 10;

  if (!page) {
    // TODO (TASK 9)): query the database and return all songs ordered by number of plays (descending)
    connection.query(`
      With sum_albums as (
        SELECT A.album_id, SUM(S.plays) as plays
        FROM Albums A JOIN Songs S on A.album_id = S.album_id
        GROUP BY A.title
      )
      SELECT A.album_id, A.title, SA.plays
            FROM Albums A JOIN sum_albums SA ON A.album_id = SA.album_id
            GROUP BY A.album_id, A.title, SA.plays
            ORDER BY SA.plays DESC
      `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        for(let i = 0; i < data.length; i++) {
          let obj = {
            title: data[i].title,
            album_id: data[i].album_id,
            plays: data[i].plays
          }
          albumList.push(obj);
        }
        res.json(albumList);
      }
    });
  } else {
    // TODO (TASK 10): reimplement TASK 9 with pagination
    // Hint: use LIMIT and OFFSET (see https://www.w3schools.com/php/php_mysql_select_limit.asp)
    connection.query(`
      With sum_albums as (
        SELECT A.album_id, SUM(S.plays) as plays
        FROM Albums A JOIN Songs S on A.album_id = S.album_id
        GROUP BY A.title
      )
      SELECT A.album_id, A.title, SA.plays
            FROM Albums A JOIN sum_albums SA ON A.album_id = SA.album_id
            GROUP BY A.album_id, A.title, SA.plays
            ORDER BY SA.plays DESC
      LIMIT ${pageSize}
      OFFSET ${(page - 1)*pageSize}
      `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        for(let i = 0; i < data.length; i++) {
          let obj = {
            song_id: data[i].song_id,
            title: data[i].title,
            album_id: data[i].album_id,
            album: data[i].album,
            plays: data[i].plays
          }
          albumList.push(obj);
        }
        res.json(albumList);
      }
    });
  }
}

// Route 9: GET /search_albums
const search_songs = async function(req, res) {
  // TODO (TASK 12): return all songs that match the given search query with parameters defaulted to those specified in API spec ordered by title (ascending)
  // Some default parameters have been provided for you, but you will need to fill in the rest
  const songList = [];
  const title = req.query.title ?? '';
  const durationLow = req.query.duration_low ?? 60;
  const durationHigh = req.query.duration_high ?? 660;
  const plays_low = req.query.plays_low ?? 0;
  const plays_high = req.query.plays_high ?? 1100000000;
  const danceability_low = req.query.danceability_low ?? 0;
  const danceability_high = req.query.danceability_high ?? 1;
  const energy_low = req.query.energy_low ?? 0;
  const energy_high = req.query.energy_high ?? 1;
  const valence_low = req.query.valence_low ?? 0;
  const valence_high = req.query.valence_high ?? 1;
  const explicit = req.query.explicit ?? -1;

  connection.query(`
    SELECT *
    FROM Songs
    WHERE title LIKE '%${title}%'
      AND (duration >= ${durationLow} AND duration <= ${durationHigh})
      AND (plays >= ${plays_low} AND plays <= ${plays_high})
      AND (danceability >= ${danceability_low} AND danceability <= ${danceability_high})
      AND (energy >= ${energy_low} AND energy <= ${energy_high})
      AND (valence >= ${valence_low} AND valence <= ${valence_high})
      AND (
          ((${explicit} != 1 OR ${explicit} = -1) AND explicit = 0)
          OR
          (${explicit} = 1 AND (explicit = 0 OR explicit = 1))
          
      )
    ORDER BY title ASC
    `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      for(let i = 0; i < data.length; i++) {
        let obj = {
          song_id: data[i].song_id,
          album_id: data[i].album_id,
          title: data[i].title,
          number: data[i].number,
          duration: data[i].duration,
          plays: data[i].plays,
          danceability: data[i].danceability,
          energy: data[i].energy,
          valence: data[i].valence,
          tempo: data[i].tempo,
          key_mode: data[i].key_mode,
          explicit: data[i].explicit
        }
        songList.push(obj);
      }
      res.json(songList);
    }
  });
}

module.exports = {
  author,
  random,
  song,
  album,
  albums,
  album_songs,
  top_songs,
  top_albums,
  search_songs,
}

