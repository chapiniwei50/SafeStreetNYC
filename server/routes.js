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

// GET /getlocalcrime
const getlocalcrime = async function(req, res) {
  const dataList = [];
  const latitude = req.query.Latitude ?? 0;
  const longitude = req.query.Logitude ?? 0;
  const distance = req.query.Distance ?? 0;

  connection.query(`
    WITH crime_range AS (
      SELECT Crime_Description
      FROM Crimes2
      WHERE ( POW((Latitude - ${latitude}) * 111320, 2) + POW((Longitude - ${longitude}) * 84100, 2)) < POW(${distance},2)
    )
    SELECT Crime_Description, COUNT(Crime_Description) As Count
    FROM crime_range
    GROUP BY Crime_Description;
    `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      for(let i = 0; i < data.length; i++) {
        let obj = {
          Crime_Description: data[i].Crime_Description,
          Count: data[i].Count
        }
        dataList.push(obj);
      }
      res.json(dataList);
    }
  });
}

// GET /getneighborhooddemographics/:neighborhood
const getneighborhooddemographics = async function(req, res) {
  const neighborhood = req.params.neighborhood;
  const dataList = [];

  connection.query(`
    WITH airbnb AS (
      SELECT property_id, longitude, latitude, neighborhood
      FROM Airbnb
      WHERE UPPER(neighborhood) like '%${neighborhood}%'
    ),
    housing AS (
        SELECT longitude, latitude, neighborhood
        FROM Property_Sales
        WHERE UPPER(Neighborhood) like '%${neighborhood}%' -- upper case
    ),
    demographics AS (
        SELECT (SUM(Count_Male) / SUM(Count_Gender_Total)) as PCT_Male,
              (SUM(Count_Female) / SUM(Count_Gender_Total)) as PCT_Female,
              (SUM(Count_Hispanic_Latino) / SUM(Count_Ethnicity_Total)) as PCT_Latino,
              (SUM(Count_American_Indian) / SUM(Count_Ethnicity_Total)) as PCT_American_Indian,
              (SUM(Count_Asian) / SUM(Count_Ethnicity_Total)) as PCT_Asian,
              (SUM(Count_White) / SUM(Count_Ethnicity_Total)) as PCT_White,
              (SUM(Count_Black) / SUM(Count_Ethnicity_Total)) as PCT_Black,
              (SUM(Count_Pacific_Islander) / SUM(Count_Ethnicity_Total)) as PCT_Pacific_Islander,
              (SUM(Count_Other_Ethnicity) / SUM(Count_Ethnicity_Total)) as PCT_Other_Ethnicity,
              N.neighborhood
        FROM ZIP_Code_Neighborhood N JOIN Demographics D ON N.ZIP_Code = D.ZIP_Code
        GROUP BY N.Neighborhood
        HAVING N.neighborhood like '%${neighborhood}%'
    )
    SELECT DISTINCT D.neighborhood as neighborhood, PCT_Male, PCT_Female, PCT_American_Indian, PCT_Asian, PCT_Black, PCT_Latino,
          PCT_Pacific_Islander, PCT_White, PCT_Other_Ethnicity
    FROM (demographics D JOIN housing H ON UPPER(D.Neighborhood) LIKE CONCAT('%', UPPER(H.Neighborhood), '%'))
            JOIN airbnb A ON UPPER(D.Neighborhood) LIKE CONCAT('%', UPPER(A.neighborhood), '%')
    `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      for(let i = 0; i < data.length; i++) {
        let obj = {
          neighborhood: data[i].neighborhood,
          PCT_Male: data[i].PCT_Male,
          PCT_Female: data[i].PCT_Female,
          PCT_American_Indian: data[i].PCT_American_Indian,
          PCT_Asian: data[i].PCT_Asian,
          PCT_Black: data[i].PCT_Black,
          PCT_Latino: data[i].PCT_Latino,
          PCT_Pacific_Islander: data[i].PCT_Pacific_Islander,
          PCT_White: data[i].PCT_White,
          PCT_Other_Ethnicity: data[i].PCT_Other_Ethnicity
        }
        dataList.push(obj);
      }
      res.json(dataList);
    }
  });
}

// GET /gethospitaltype
const gethospitaltype = async function(req, res) {
  const dataList = [];
  const facility_type = req.query. Facility_Type;

  connection.query(`
      SELECT Name, Location, Phone, Latitude, Longitude
      FROM Hospitals
      WHERE Facility_Type LIKE '%${facility_type}%'
    `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      for(let i = 0; i < data.length; i++) {
        let obj = {
          Name: data[i].Name,
          Location: data[i].Location,
          Phone: data[i].Phone,
          Latitude: data[i].Latitude,
          Longitude: data[i].Longitude
        }
        dataList.push(obj);
      }
      res.json(dataList);
    }
  });
}

// GET /getlocalhospitals
const getlocalhospitals = async function(req, res) {
  const dataList = [];
  const latitude = req.query.Latitude ?? 0;
  const longitude = req.query.Logitude ?? 0;
  const distance = req.query.Distance ?? 0;

  connection.query(`
    WITH hospital_range AS (
      SELECT Facility_Type
      FROM Hospitals
      WHERE ( POW((Latitude - ${latitude}) * 111320, 2) + POW((Longitude - ${longitude}) * 84100, 2)) < POW(${distance},2)
    )
    SELECT Facility_Type, COUNT(Facility_Type) As Count
    FROM hospital_range
    GROUP BY Facility_Type;
    `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      for(let i = 0; i < data.length; i++) {
        let obj = {
          Facility_Type: data[i].Facility_Type,
          Count: data[i].Count,
        }
        dataList.push(obj);
      }
      res.json(dataList);
    }
  });
}

module.exports = {
  getlocalcrime,
  getneighborhooddemographics,
  gethospitaltype,
  getlocalhospitals
}