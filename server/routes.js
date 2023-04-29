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

// GET /getneighborhooddemographics
const getneighborhooddemographics = async function(req, res) {
  console.log("in get neghborhood dem")
  const neighborhood = req.query.Neighborhood;
  const dataList = [];
  console.log(neighborhood);

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
        console.log(data[i])
        // let obj = {
        //   neighborhood: data[i].neighborhood,
        //   PCT_Male: data[i].PCT_Male,
        //   PCT_Female: data[i].PCT_Female,
        //   PCT_American_Indian: data[i].PCT_American_Indian,
        //   PCT_Asian: data[i].PCT_Asian,
        //   PCT_Black: data[i].PCT_Black,
        //   PCT_Latino: data[i].PCT_Latino,
        //   PCT_Pacific_Islander: data[i].PCT_Pacific_Islander,
        //   PCT_White: data[i].PCT_White,
        //   PCT_Other_Ethnicity: data[i].PCT_Other_Ethnicity
        // }
        // dataList.push(obj);
      }
      res.json(dataList);
    }
  });
}

// GET /gethospitaltype
const gethospitaltype = async function(req, res) {
  console.log("in get hospital type")
  const dataList = [];
  const facility_type = req.query.Facility_Type;
  console.log(facility_type);
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
          id: data[i].Name,
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

// GET /getrankhousing
const getrankhousing = async function(req, res) {
  console.log("in get rank housing")
  const dataList = [];
  const healthcare_weight = req.query.Healthcare_Weight ?? 0;
  const safety_weight = req.query.Safety_Weight ?? 0;
  const price_weight = req.query.Price_Weight ?? 0;
  const neighborhood = req.query.Neighborhood ?? '';
  console.log(healthcare_weight);
  console.log(safety_weight);
  console.log(price_weight);
  console.log(neighborhood);
  connection.query(`
  WITH neighborhood_housing AS (
      SELECT Address, Latitude, Longitude, Sale_Price
      FROM Property_Sales
      WHERE Neighborhood LIKE '%${neighborhood}%' AND Sale_Price != 0
      GROUP BY Latitude, Longitude
  ),
  rank_temp_crimes AS (
      SELECT COUNT(N.Address) AS crimes_count, N.Address
      FROM neighborhood_housing N LEFT JOIN Crimes2 C ON (POW((N.Latitude - (C.Latitude)) * 111320, 2)
          + POW((N.Longitude - (C.Longitude)) * 84100, 2)) < POW(1000,2)
      GROUP BY N.Latitude, N.Longitude, N.Address
  ),
  rank_crimes AS (
      SELECT *, NTILE(10) OVER (ORDER BY crimes_count DESC) AS group_col
      FROM rank_temp_crimes
  ),
  rank_temp_healthcare AS (
      SELECT COUNT(H.Name) AS healthcare_count, N.Address
      FROM neighborhood_housing N LEFT JOIN Hospitals H ON (POW((N.Latitude - (H.Latitude)) * 111320, 2)
          + POW((N.Longitude - (H.Longitude)) * 84100, 2)) < POW(1000,2)
      GROUP BY N.Latitude, N.Longitude, N.Address
  ),
  rank_healthcare AS (
      SELECT *, NTILE(10) OVER (ORDER BY healthcare_count ASC) AS group_col
      FROM rank_temp_healthcare
  ),
  rank_temp_price AS (
      SELECT Sale_Price, Address
      FROM neighborhood_housing
  ),
  rank_price AS(
      SELECT *, NTILE(10) OVER (ORDER BY Sale_Price DESC) AS group_col
      FROM rank_temp_price
  )
  SELECT RC.Address, (RC.group_col * ${safety_weight} + RH.group_col * ${healthcare_weight} + RP.group_col * ${price_weight}) AS Total_Rank,
        RC.group_col AS rank_crime, RH.group_col AS rank_healthcare, RP.group_col AS rank_price
  FROM (rank_crimes RC JOIN rank_healthcare RH ON RC.Address = RH.Address)
          JOIN rank_price RP ON RC.Address = RP.Address
  ORDER BY Total_Rank DESC;
    `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      for(let i = 0; i < data.length; i++) {
        console.log(data[i]);
        let obj = {
          id:  data[i].Address,
          Address: data[i].Address,
          Rank_Address: data[i].Total_Rank,
          Rank_Crime: data[i].rank_crime,
          Rank_Healthcare: data[i].rank_healthcare,
          Rank_Price: data[i].rank_price
       
        }
        dataList.push(obj);
      }
      res.json(dataList);
    }
  });
}

// GET /getrankairbnb
const getrankairbnb = async function(req, res) {
  const dataList = [];
  const healthcare_weight = req.query.Healthcare_Weight ?? 0;
  const safety_weight = req.query.Safety_Weight ?? 0;
  const price_weight = req.query.Price_Weight ?? 0;
  const neighborhood = req.query.Neighborhood;

  connection.query(`
    WITH neighborhood_housing AS (
      SELECT Property_Id, Latitude, Longitude, (Price + Service_Fee) AS Airbnb_Price
      FROM Airbnb
      WHERE UPPER(Neighborhood) LIKE '%${neighborhood}%' AND (Price + Service_Fee) != 0
      GROUP BY Latitude, Longitude
    ),
    rank_temp_crimes AS (
        SELECT COUNT(N.Property_Id) AS crimes_count, N.Property_Id
        FROM neighborhood_housing N LEFT JOIN Crimes2 C ON (POW((N.Latitude - (C.Latitude)) * 111320, 2)
            + POW((N.Longitude - (C.Longitude)) * 84100, 2)) < POW(1000,2)
        GROUP BY N.Latitude, N.Longitude, N.Property_Id
    ),
    rank_crimes AS (
        SELECT *, NTILE(10) OVER (ORDER BY crimes_count DESC) AS group_col
        FROM rank_temp_crimes
    ),
    rank_temp_healthcare AS (
        SELECT COUNT(H.Name) AS healthcare_count, N.Property_Id
        FROM neighborhood_housing N LEFT JOIN Hospitals H ON (POW((N.Latitude - (H.Latitude)) * 111320, 2)
            + POW((N.Longitude - (H.Longitude)) * 84100, 2)) < POW(1000,2)
        GROUP BY N.Latitude, N.Longitude, N.Property_Id
    ),
    rank_healthcare AS (
        SELECT *, NTILE(10) OVER (ORDER BY healthcare_count ASC) AS group_col
        FROM rank_temp_healthcare
    ),
    rank_temp_price AS (
        SELECT Airbnb_Price, Property_Id
        FROM neighborhood_housing
    ),
    rank_price AS(
        SELECT *, NTILE(10) OVER (ORDER BY Airbnb_Price DESC) AS group_col
        FROM rank_temp_price
    )
    SELECT RC.Property_Id as Property_Id, (RC.group_col * ${safety_weight} + RH.group_col * ${healthcare_weight} + RP.group_col * ${price_weight}) AS Total_Rank,
          RC.group_col AS Rank_Crime, RH.group_col AS Rank_Healthcare, RP.group_col AS Rank_Price
    FROM (rank_crimes RC JOIN rank_healthcare RH ON RC.Property_Id = RH.Property_Id)
            JOIN rank_price RP ON RC.Property_Id = RP.Property_Id
    ORDER BY Total_Rank DESC;
    `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      for(let i = 0; i < data.length; i++) {
        let obj = {
          Property_Id: data[i].Property_Id,
          Rank_Address: data[i].Rank_Address,
          Rank_Crime: data[i].Rank_Crime,
          Rank_Healthcare: data[i].Rank_Healthcare,
          Rank_Price: data[i].Rank_Price
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
  getlocalhospitals,
  getrankhousing,
  getrankairbnb
}
