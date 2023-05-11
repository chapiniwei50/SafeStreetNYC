import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Container, FormControlLabel, Grid, Link, Slider, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, PieChart, Pie, Cell, Legend } from 'recharts';
import SongCard from '../components/SongCard';
import { useNavigate } from "react-router-dom";
import { ReactSession } from 'react-client-session';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FFC107', '#36C9A7', '#E74C3C', '#3498DB'];

var styleP = {
  color: 'black',
  fontSize: '70px',
  fontFamily: 'Gill Sans',
  padding: '60px',
};


export default function SongsPage() {
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [dataR, setDataR] = useState([]);

  const [neighborhood, setNeighborhood] = useState('');
  const [healthcare, setHealthcare] = useState(3);
  const [safety, setSafety] = useState(3);
  const [price, setPrice] = useState(3);
  const [percentD, setPercent] = useState(null);
  const [barRadar, setBarRadar] = useState(true);
  const [chartData, setChartData] = useState(true);
  const [chartDataG, setChartDataG] = useState(true);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);

  const testdata = [];
  var isLoggedIn;
  const navigation = useNavigate();
  function MyComponent() {
    const isLoggedIn = ReactSession.get('user');
    if (!isLoggedIn) {
      navigation('/')
    }
  }

  useEffect(() => {
    MyComponent();

  }, []);


  function Map(props) {
    const mapRef = React.useRef(null);

    function initMap() {
      if (!window.google || !window.google.maps) {
        console.log("Google Maps API has not been loaded yet");
        return;
      }

      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 40.7128, lng: -74.0060 },
        zoom: 11,
      });

      var counter = 0;
      if (data.length > 0) {
        data.forEach(airbnbMark => {
          if (airbnbMark.Latitude && airbnbMark.Longitude && counter < 10) {

            const marker = new window.google.maps.Marker({
              position: { lat: airbnbMark.Latitude, lng: airbnbMark.Longitude },
              map: map,
              title: airbnbMark["Name"],
            });

            marker.addListener('click', () => {
              const infowindow = new window.google.maps.InfoWindow({
                content: airbnbMark["Name"],
              });
              infowindow.open(map, marker);
            });
            counter++;
          }
        });
      }
    }

    useEffect(() => {
      window.initMap = initMap;

      if (!window.googleMapsScriptLoaded) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${props.apikey}&callback=initMap`;
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        window.googleMapsScriptLoaded = true;
      } else {
        initMap();
      }
    }, [props.apikey, neighborhood]);

    return <div ref={mapRef} style={{ height: "400px", width: "100%" }} />;
  }

  const search = () => {

    fetch(`http://${process.env.REACT_APP_SERVER_HOST}:${process.env.REACT_APP_SERVER_PORT}/getrankairbnb?Neighborhood=${neighborhood}` +
      `&Healthcare_Weight=${healthcare}` +
      `&Safety_Weight=${safety}` +
      `&Price_Weight=${price}`
    )
      .then(res => res.json())
      .then(housings => {

        setData(housings);

      });
    fetch(`http://${process.env.REACT_APP_SERVER_HOST}:${process.env.REACT_APP_SERVER_PORT}/getavailablerooms?Neighborhood=${neighborhood}`

    )
      .then(res => res.json())
      .then(rooms => {


        setDataR(rooms);

      });

    fetch(`http://${process.env.REACT_APP_SERVER_HOST}:${process.env.REACT_APP_SERVER_PORT}/getneighborhooddemographics?Neighborhood=${neighborhood}`
    )
      .then(res => res.json())
      .then(demographics => {




        if (demographics.length == undefined) {
          alert('No Matching Results');
        } else {

          const chartD = [];
          const chartG = [];

          let obj = {
            name: 'Asian',
            value: demographics[0].PCT_Asian
          }
          obj = {
            name: 'Black',
            value: demographics[0].PCT_Black
          }
          chartD.push(obj);
          obj = {
            name: 'Latino',
            value: demographics[0].PCT_Latino
          }
          chartD.push(obj);
          obj = {
            name: 'Other Ethnicity',
            value: demographics[0].PCT_Other_Ethnicity
          }
          chartD.push(obj);
          obj = {
            name: 'White',
            value: demographics[0].PCT_White
          }
          chartD.push(obj);
          obj = {
            name: 'Pacific Islander',
            value: demographics[0].PCT_Pacific_Islander
          }
          chartD.push(obj);
          obj = {
            name: 'Female',
            value: demographics[0].PCT_Female
          }
          chartG.push(obj);
          obj = {
            name: 'Male',
            value: demographics[0].PCT_Male
          }
          chartG.push(obj);



          setChartData(chartD);
          setChartDataG(chartG);
        }


      });
    fetch(`http://${process.env.REACT_APP_SERVER_HOST}:${process.env.REACT_APP_SERVER_PORT}/getAvgPercentagePrice?Neighborhood=${neighborhood}`

    )
      .then(res => res.json())
      .then(percentData => {

        setPercent(percentData);

        const myDiv = document.getElementById("myDiv"); // get a reference to the div element
        const fieldText = Number(percentData[0].AVG_Price_Percentage.toFixed(2)) + "%"; // create a text node with the 'field' property value

        styleP = {
          color: percentData[0].AVG_Price_Percentage > 0 ? 'red' : 'green',
          fontSize: '70px',
          fontFamily: 'Gill Sans',
          padding: '60px',
        }

        myDiv.innerHTML = fieldText;
      });
  }


  const columns = [
    {
      field: 'Name', headerName: 'Airbnb Name', width: 300, renderCell: (params) => (

        <Link onClick={() => setSelectedPropertyId(params.row.id)}>{params.value}</Link>
      )
    },
    { field: 'Total_Rank', headerName: 'Total Rank', width: 200 },
    { field: 'Rank_Healthcare', headerName: 'Healthcare Rank', width: 200 },
    { field: 'Rank_Crime', headerName: 'Safety Rank', width: 200 },
    { field: 'Rank_Price', headerName: 'Price Rank', width: 200 },

  ];

  const columnsR = [
    { field: 'Room_Type', headerName: 'Room Type', width: 300 },
    { field: 'Room_Count', headerName: 'Room Count', width: 200 },
    { field: 'Instant_Bookability_Ratio', headerName: 'Instant Bookability Ratio', width: 200 },

  ];
  const rows = [
    { id: 'Baruch Houses Family Health Center', Name: 'hey', Location: 'yay', Phone: 'f' },
    { id: 'Aaruch Houses Family Health Center', Name: 'hey', Location: 'yay', Phone: 'f' },
    { id: 'Caruch Houses Family Health Center', Name: 'hey', Location: 'yay', Phone: 'f' },
  ]

  const handleGraphChange = () => {
    setBarRadar(!barRadar);
  };



  const apikey = process.env.REACT_APP_APIKEY;




  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Container>

      {selectedPropertyId && <SongCard id={selectedPropertyId} handleClose={() => setSelectedPropertyId(null)} />}
      <h2>Search Neighborhood for Airbnb</h2>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <TextField label='Neighborhood' value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} style={{ width: "100%" }} />
        </Grid>
        <Grid item xs={4}>
          <p>Healthcare</p>
          <Slider
            value={healthcare}
            min={0}
            max={10}
            step={1}
            onChange={(e, newValue) => setHealthcare(newValue)}
            valueLabelDisplay='auto'
            valueLabelFormat={value => <div>{value}</div>}
          />
        </Grid>
        <Grid item xs={4}>
          <p>Safety</p>
          <Slider
            value={safety}
            min={0}
            max={10}
            step={1}
            onChange={(e, newValue) => setSafety(newValue)}
            valueLabelDisplay='auto'
            valueLabelFormat={value => <div>{value}</div>}
          />
        </Grid>

        <Grid item xs={4}>
          <p>Price</p>
          <Slider
            value={price}
            min={0}
            max={10}
            step={1}
            onChange={(e, newValue) => setPrice(newValue)}
            valueLabelDisplay='auto'
            valueLabelFormat={value => <div>{value}</div>}
          />
        </Grid>
      </Grid>

      <Button onClick={() => search()} style={{ left: '50%', transform: 'translateX(-50%)' }}>
        Search
      </Button>

      <h2>Airbnb Locations</h2>
      <Map apikey={apikey} />

      <Grid container spacing={4}>
        <Grid item xs={4}>
          <div >

            <h2>Demographics</h2>

            <ResponsiveContainer height={250}>
              <PieChart width={400} height={400}>

                <Pie dataKey="value" data={chartData} cx="30%" cy="50%" innerRadius={40} outerRadius={80} fill="#82ca9d" />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>


          </div>
        </Grid>

        <Grid item xs={4}>
          <div >
            <h2>Gender Distribution</h2>
            <ResponsiveContainer height={250}>
              <PieChart width={400} height={400}>

                <Pie dataKey="value" data={chartDataG} cx="30%" cy="50%" innerRadius={40} outerRadius={80} fill="#cd95ed" />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

          </div>
        </Grid>
        <Grid item xs={4}>

          <h2>Residential Avg Price Difference from NYC Avg</h2>
          <div id="myDiv" style={styleP} >
          </div>
        </Grid>
      </Grid>
      <div>

      </div>

      <h2>Airbnb Rank</h2>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />

      <h2>Available Room Types</h2>
      <DataGrid
        rows={dataR}
        columns={columnsR}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />

    </Container>

  );
}