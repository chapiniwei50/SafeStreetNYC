const mysql = require('mysql')
const dotenv = require('dotenv').config();

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: process.env.RDS_HOST,
  user: process.env.RDS_USER,
  password: process.env.RDS_PASSWORD,
  port: process.env.RDS_PORT,
  database: process.env.RDS_DB
});
connection.connect((err) => err && console.log(err));

// GET /getlocalcrime
const getlocalcrime = async function (req, res) {
  const dataList = [];
  const latitude = req.query.Latitude ?? 0;
  const longitude = req.query.Longitude ?? 0;
  const distance = req.query.Distance ?? 0;


  connection.query(`
    WITH crime_range AS (
      SELECT Crime_Description
      FROM Crimes3
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
      for (let i = 0; i < data.length; i++) {
        let obj = {
          id: data[i].Crime_Description,
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





const getneighborhooddemographics = async function (req, res) {
  const neighborhood = req.query.Neighborhood;
  const dataList = [];
  connection.query(`
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
    `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      for (let i = 0; i < data.length; i++) {
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
const gethospitaltype = async function (req, res) {
  const dataList = [];
  const facility_type = req.query.Facility_Type;

  connection.query(`
      SELECT Name, Location, Phone, Latitude, Longitude
      FROM Hospitals
      WHERE Facility_Type LIKE '%${facility_type}%'
    `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      for (let i = 0; i < data.length; i++) {
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
const getlocalhospitals = async function (req, res) {
  const dataList = [];
  const latitude = req.query.Latitude ?? 0;
  const longitude = req.query.Longitude ?? 0;
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
      for (let i = 0; i < data.length; i++) {
        let obj = {
          id: data[i].Facility_Type,
          Facility_Type: data[i].Facility_Type,
          Count: data[i].Count,
        }
        dataList.push(obj);
      }
      res.json(dataList);
    }
  });
}

// GET /maplocalhospitals
const maplocalhospitals = async function (req, res) {
  const dataList = [];
  const latitude = req.query.Latitude ?? 0;
  const longitude = req.query.Longitude ?? 0;
  const distance = req.query.Distance ?? 0;

  connection.query(`
    WITH hospital_range AS (
      SELECT Facility_Type, Name, Latitude, Longitude
      FROM Hospitals
      WHERE ( POW((Latitude - ${latitude}) * 111320, 2) + POW((Longitude - ${longitude}) * 84100, 2)) < POW(${distance},2)
    )
    SELECT Facility_Type, Name, Latitude, Longitude
    FROM hospital_range;
    `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      for (let i = 0; i < data.length; i++) {
        let obj = {
          Name: data[i].Name,
          Facility_Type: data[i].Facility_Type,
          Latitude: data[i].Latitude,
          Longitude: data[i].Longitude
        }
        dataList.push(obj);
      }
      res.json(dataList);
    }
  });
}


// GET /getrankhousing
const getrankhousing = async function (req, res) {
  const dataList = [];
  const healthcare_weight = req.query.Healthcare_Weight ?? 0;
  const safety_weight = req.query.Safety_Weight ?? 0;
  const price_weight = req.query.Price_Weight ?? 0;
  const neighborhood = req.query.Neighborhood ?? '';

  connection.query(`
    WITH neighborhood_housing AS (
      SELECT DISTINCT Address, Latitude, Longitude, Sale_Price
      FROM Property_Sales
      WHERE UPPER(Neighborhood) LIKE UPPER('${neighborhood}') AND Sale_Price != 0
      GROUP BY Latitude, Longitude
    ),
    rank_temp_crimes AS (
      SELECT COUNT(N.Address) AS crimes_count, N.Address
      FROM neighborhood_housing N LEFT JOIN (SELECT * FROM Crimes3 LIMIT 100) C ON (POW((N.Latitude - (C.Latitude)) * 111320, 2)
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
      SELECT Sale_Price, Address, Latitude, Longitude
      FROM neighborhood_housing
    ),
    rank_price AS(
      SELECT *, NTILE(10) OVER (ORDER BY Sale_Price DESC) AS group_col
      FROM rank_temp_price
    )
    SELECT RC.Address, RC.group_col * (${safety_weight} / (${safety_weight}+${healthcare_weight}+${price_weight})) + RH.group_col * (${healthcare_weight} / (${safety_weight}+${healthcare_weight}+${price_weight})) + RP.group_col * (${price_weight} / (${safety_weight}+${healthcare_weight}+${price_weight})) AS Total_Rank,
        RC.group_col AS Rank_Crime, RH.group_col AS Rank_Healthcare, RP.group_col AS Rank_Price, RP.Latitude AS Latitude, RP.Longitude AS Longitude
    FROM (rank_crimes RC JOIN rank_healthcare RH ON RC.Address = RH.Address)
          JOIN rank_price RP ON RC.Address = RP.Address
    ORDER BY Total_Rank DESC;
    `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      for (let i = 0; i < data.length; i++) {

        let obj = {
          id: data[i].Address,
          Address: data[i].Address,
          Rank_Address: data[i].Total_Rank,
          Rank_Crime: data[i].Rank_Crime,
          Rank_Healthcare: data[i].Rank_Healthcare,
          Rank_Price: data[i].Rank_Price,
          Latitude: data[i].Latitude,
          Longitude: data[i].Longitude
        }
        dataList.push(obj);
      }
      res.json(dataList);
    }
  });
}

// GET /getrankairbnb
const getrankairbnb = async function (req, res) {
  const dataList = [];
  const healthcare_weight = req.query.Healthcare_Weight ?? 0;
  const safety_weight = req.query.Safety_Weight ?? 0;
  const price_weight = req.query.Price_Weight ?? 0;
  const neighborhood = req.query.Neighborhood;

  connection.query(`
    WITH neighborhood_housing AS (
      SELECT Property_Id, Name, Latitude, Longitude, (Price + Service_Fee) AS Airbnb_Price
      FROM Airbnb
      WHERE UPPER(Neighborhood) = UPPER('${neighborhood}') AND (Price + Service_Fee) != 0
      GROUP BY Latitude, Longitude
  ),
  rank_temp_crimes AS (
      SELECT COUNT(N.Property_Id) AS crimes_count, N.Property_Id, N.Name
      FROM neighborhood_housing N
      LEFT JOIN (SELECT * FROM Crimes3 LIMIT 100) C ON (POW((N.Latitude - C.Latitude) * 111320, 2)
          + POW((N.Longitude - C.Longitude) * 84100, 2)) < POW(1000, 2)
      GROUP BY N.Latitude, N.Longitude, N.Property_Id
  ),
  rank_crimes AS (
      SELECT *, NTILE(10) OVER (ORDER BY crimes_count DESC) AS group_col
      FROM rank_temp_crimes
  ),
  rank_temp_healthcare AS (
      SELECT COUNT(H.Name) AS healthcare_count, N.Property_Id
      FROM neighborhood_housing N
      LEFT JOIN Hospitals2 H ON (POW((N.Latitude - H.Latitude) * 111320, 2)
          + POW((N.Longitude - H.Longitude) * 84100, 2)) < POW(1000, 2)
      GROUP BY N.Latitude, N.Longitude, N.Property_Id
  ),
  rank_healthcare AS (
      SELECT *, NTILE(10) OVER (ORDER BY healthcare_count ASC) AS group_col
      FROM rank_temp_healthcare
  ),
  rank_temp_price AS (
      SELECT Airbnb_Price, Property_Id, Longitude, Latitude
      FROM neighborhood_housing
  ),
  rank_price AS (
      SELECT *, NTILE(10) OVER (ORDER BY Airbnb_Price DESC) AS group_col
      FROM rank_temp_price
  )
  SELECT RC.Property_Id, RC.Name as Name, RC.group_col * (${safety_weight} / (${safety_weight}+${healthcare_weight}+${price_weight})) + RH.group_col * (${healthcare_weight} / (${safety_weight}+${healthcare_weight}+${price_weight})) + RP.group_col * (${price_weight} / (${safety_weight}+${healthcare_weight}+${price_weight})) AS Total_Rank,
        RC.group_col AS Rank_Crime, RH.group_col AS Rank_Healthcare, RP.group_col AS Rank_Price, RP.Longitude AS Longitude, RP.Latitude AS Latitude
  FROM rank_crimes RC
  JOIN rank_healthcare RH ON RC.Property_Id = RH.Property_Id
  JOIN rank_price RP ON RC.Property_Id = RP.Property_Id
  ORDER BY Total_Rank DESC;
    `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {

      for (let i = 0; i < data.length; i++) {
        let obj = {
          id: data[i].Property_Id,

          Name: data[i].Name,
          Total_Rank: data[i].Total_Rank,
          Rank_Crime: data[i].Rank_Crime,
          Rank_Healthcare: data[i].Rank_Healthcare,
          Rank_Price: data[i].Rank_Price,
          Latitude: data[i].Latitude,
          Longitude: data[i].Longitude
        }
        dataList.push(obj);
      }
      res.json(dataList);
    }
  });
}

const findsimilarbypricecrimeborough = async function (req, res) {
  const property = req.query.Property ?? 0;
  dataList = [];

  connection.query(`
    SELECT
      A2.Name, A2.Property_id, A2.Price, A2.Room_Type, AVG(A3.Price) AS Avg_Neighborhood_Price,
      CrimeStats.Crime_Count, HospitalStats.Hospital_Count
    FROM
      Airbnb A1
    JOIN
      Airbnb A2 ON A1.Neighborhood = A2.Neighborhood
      AND A2.Price BETWEEN A1.Price * 0.9 AND A1.Price * 1.1
      AND A2.Property_id <> A1.Property_id
    JOIN
      Airbnb A3 ON A2.Neighborhood = A3.Neighborhood
    JOIN
      (SELECT Borough, COUNT(*) AS Crime_Count FROM Crimes GROUP BY Borough) CrimeStats ON A2.Borough = CrimeStats.Borough
    JOIN
      (SELECT Borough, COUNT(*) AS Hospital_Count FROM Hospitals GROUP BY Borough) HospitalStats ON A2.Borough = HospitalStats.Borough
    WHERE
      A1.Property_id = ${property}
    GROUP BY
      A2.Property_id, A2.Price, A2.Room_Type, CrimeStats.Crime_Count, HospitalStats.Hospital_Count;
    `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      for (let i = 0; i < data.length; i++) {
        let obj = {
          id: data[i].Property_id,
          Name: data[i].Name,
          Room_Type: data[i].Room_Type,
          Price: data[i].Price,
          Avg_Neighborhood_Price: data[i].Avg_Neighborhood_Price,
          Crime_Count: data[i].Crime_Count,
          Hospital_Count: data[i].Hospital_Count
        }
        dataList.push(obj);
      }

      res.json(dataList);
    }
  });
}
const getavailablerooms = async function (req, res) {
  const neighborhood = req.query.neighborhood ?? 0;
  const dataList = [];
  connection.query(`
    SELECT
      a.Room_Type,
      COUNT(a.Room_Type) AS Room_Count,
      AVG(a.Instant_Bookable) AS Instant_Bookability_Ratio
    FROM
      Airbnb AS a
      JOIN ZIP_Code_Neighborhood AS n ON a.Neighborhood LIKE CONCAT('%', n.Neighborhood, '%')
    WHERE
      n.Neighborhood = ${neighborhood}
    GROUP BY
      a.Room_Type
    ORDER BY
      Room_Count DESC;

    `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {

      for (let i = 0; i < data.length; i++) {


        let obj = {
          id: data[i].Room_Type,
          Room_Type: data[i].Room_Type,
          Room_Count: data[i].Room_Count,
          Instant_Bookability_Ratio: data[i].Instant_Bookability_Ratio
        }
        dataList.push(obj);
      }
      res.json(dataList);
    }
  });
}
// GET /getAvgPercentagePrice
const getAvgPercentagePrice = async function (req, res) {
  const dataList = [];
  const neighborhood = req.query.Neighborhood;

  connection.query(`
    WITH airbnb_price AS (
        SELECT AVG(Service_Fee + Price) AS APrice, Neighborhood
        FROM Airbnb
        GROUP BY Neighborhood
    ),
    housing_price AS (
        SELECT (AVG(Sale_Price))/1000 AS HPrice, Neighborhood
        FROM Property_Sales
        GROUP BY Neighborhood
    ),
    temp_combine_price AS (
        SELECT APrice, HPrice, airbnb_price.Neighborhood AS ANeighbor, housing_price.Neighborhood AS HNeighbor
        FROM airbnb_price
        LEFT JOIN housing_price ON UPPER(airbnb_price.Neighborhood) = UPPER(housing_price.Neighborhood)
        UNION
        SELECT APrice, HPrice, airbnb_price.Neighborhood AS ANeighbor, housing_price.Neighborhood AS HNeighbor
        FROM airbnb_price
        RIGHT JOIN housing_price ON UPPER(airbnb_price.Neighborhood) = UPPER(housing_price.Neighborhood)
    ),
    combine_price AS (
        SELECT APrice, HPrice, COALESCE(UPPER(ANeighbor), UPPER(HNeighbor)) AS Total_Neighbor
        FROM temp_combine_price
    ),
    avg_price AS (
        SELECT AVG(COALESCE(APrice, 0) + COALESCE(HPrice, 0)) AS Avg_Price, COUNT(*) AS Neighborhood_Length
        FROM combine_price
    )
    SELECT ((((COALESCE(C.APrice, 0) + COALESCE(C.HPrice, 0)) - A.Avg_Price) / Neighborhood_Length) * 100)
        AS AVG_Price_Percentage, Total_Neighbor
    FROM combine_price C, avg_price A
    WHERE Total_Neighbor = UPPER('${neighborhood}');
    `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {

      for (let i = 0; i < data.length; i++) {
        let obj = {
          Neighborhood: data[i].Total_Neighbor,
          AVG_Price_Percentage: data[i].AVG_Price_Percentage
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
  getrankairbnb,
  findsimilarbypricecrimeborough,
  getavailablerooms,
  getAvgPercentagePrice,
  maplocalhospitals

}
