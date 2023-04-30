import { useEffect, useState, React } from 'react';
import { Button, Checkbox, Container, FormControlLabel, Grid, Link, Slider, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,PieChart, Pie, Cell, Legend } from 'recharts';
import {useNavigate} from "react-router-dom";
// import SongCard from '../components/SongCard';
// import { formatDuration } from '../helpers/formatter';

const config = require('../config.json');


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FFC107', '#36C9A7', '#E74C3C', '#3498DB'];




export default function SongsPage() {
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  // const [selectedNeighborhood, setSelectedNeighborhood] = useState(null);

  const [neighborhood, setNeighborhood] = useState('');
  const [healthcare, setHealthcare] = useState(3);
  const [safety, setSafety] = useState(3);
  const [price, setPrice] = useState(3);
  const [barRadar, setBarRadar] = useState(true);
  const [chartData, setChartData] = useState(true);
  const [chartDataG, setChartDataG] = useState(true);
  
 
const testdata =[];
const navigation = useNavigate();

function myFunction() {
  console.log("HIIII");
    fetch(`http://${config.server_host}:${config.server_port}/isVerified`)
    .then(response => response.json())
    .then(data =>{
      if(!data.check) {
        navigation('/')
      }
      console.log(data)
    })
  }

  useEffect(() => {
    myFunction();
  });


  function Map(props) {
    useEffect(() => {
      // Load the Google Maps API script
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBiQxXOFhKyV-xlXCyFoBAIgshY5UhM7i8&callback=initMap`;
      script.async = true;
      document.body.appendChild(script);
  
      // Initialize the map
      window.initMap = () => {
        // Create a new map object
        const map = new window.google.maps.Map(document.getElementById("map"), {
          center: { lat: 40.7128, lng: -74.0060 },
          zoom: 12,
        });
  
        // Add a marker to the map
        // const marker = new window.google.maps.Marker({
        //   position: { lat: -34.397, lng: 150.644 },
        //   map: map,
        //   title: "Sydney",
        // });
      };
    }, [props.apiKey]);
  
    return <div id="map" style={{ height: "400px" }}></div>;
  }

  // function Map(props) {
 
  //   const { center, zoom } = props;
  
  //   return (
  //     <div style={{ height: '100vh', width: '100%' }}>
  //       <GoogleMapReact
  //         bootstrapURLKeys={{ key: "AIzaSyBiQxXOFhKyV-xlXCyFoBAIgshY5UhM7i8" }}
  //         defaultCenter={center}
  //         defaultZoom={zoom}
  //       >
  //         {/* Add markers, polygons, or other map components here */}
  //       </GoogleMapReact>
  //     </div>
  //   );
  // }


 

  // useEffect(() => {
  //   console.log("use effect")
  //   fetch(`http://${config.server_host}:${config.server_port}/getrankhousing`)
  //     .then(res => res.json())
  //     .then(housings => {
  //       console.log(housings);
  //       // console.log("effect here")
  //       // setData(housings);
  //     });
  // }, []);


  // const healthcare_weight = req.query.Healthcare_Weight ?? 0;
  // const safety_weight = req.query.Safety_Weight ?? 0;
  // const price_weight = req.query.Price_Weight ?? 0;
  // const neighborhood = req.query.Neighborhood;


  const search = () => {
    console.log("search")
    
    fetch(`http://${config.server_host}:${config.server_port}/getrankhousing?Neighborhood=${neighborhood}` +
      `&Healthcare_Weight=${healthcare}` +
       `&Safety_Weight=${safety}` +
       `&Price_Weight=${price}` 
    )
      .then(res => res.json())
      .then(housings => {
        console.log(housings);
        console.log("effect here")
        setData(housings);
        console.log(data);
      });

    fetch(`http://${config.server_host}:${config.server_port}/getneighborhooddemographics?Neighborhood=${neighborhood}` 
    )
      .then(res => res.json())
      .then(demographics => {
        console.log(demographics);
        console.log("effect here")
        const chartG =[];
        const chartD = [];
       
          let obj = {
            name: 'American Indian',
            value: demographics[0].PCT_American_Indian
          }
          chartD.push(obj);
          obj ={
            name: 'Asian',
            value: demographics[0].PCT_Asian
          }
          obj ={
            name: 'Black',
            value: demographics[0].PCT_Black
          }
          chartD.push(obj);
          obj ={
            name: 'Latino',
            value: demographics[0].PCT_Latino
          }
          chartD.push(obj);
          obj ={
            name: 'Other Ethnicity',
            value: demographics[0].PCT_Other_Ethnicity
          }
          chartD.push(obj);
          obj ={
            name: 'White',
            value: demographics[0].PCT_White
          }
          chartD.push(obj);
          obj ={
            name: 'Pacific Islander',
            value: demographics[0].PCT_Pacific_Islander
          }
          chartD.push(obj);
          obj ={
            name: 'Female',
            value: demographics[0].PCT_Female
          }
          chartG.push(obj);
          obj ={
            name: 'Male',
            value: demographics[0].PCT_Male
          }
          chartG.push(obj);
          console.log(chartD);
          console.log(chartG);
        
        setChartData(chartD);
        setChartDataG(chartG);
  
        
      });
  }


  // This defines the columns of the table of songs used by the DataGrid component.
  // The format of the columns array and the DataGrid component itself is very similar to our
  // LazyTable component. The big difference is we provide all data to the DataGrid component
  // instead of loading only the data we need (which is necessary in order to be able to sort by column)
  const columns = [
    // { field: 'neighborhood', headerName: 'Neighborhood', width: 300, renderCell: (params) => (
    //     <Link onClick={() => setSelectedNeighborhood(params.row.song_id)}>{params.value}</Link>
    // ) },
    { field: 'Address', headerName: 'Address', width: 300 },
    { field: 'Rank_Address', headerName: 'Total Rank', width: 200 },
    { field: 'Rank_Healthcare', headerName: 'Healthcare Rank', width: 200 },
    { field: 'Rank_Crime', headerName: 'Safety Rank', width: 200 },
    { field: 'Rank_Price', headerName: 'Price Rank', width: 200 },
    
  ];
  const rows = [
    // { field: 'neighborhood', headerName: 'Neighborhood', width: 300, renderCell: (params) => (
    //     <Link onClick={() => setSelectedNeighborhood(params.row.song_id)}>{params.value}</Link>
    // ) },
    { id: 'Baruch Houses Family Health Center', Name: 'hey', Location: 'yay', Phone: 'f' },
    { id: 'Aaruch Houses Family Health Center', Name: 'hey', Location: 'yay', Phone: 'f' },
    { id: 'Caruch Houses Family Health Center', Name: 'hey', Location: 'yay', Phone: 'f' },
  ]

  const handleGraphChange = () => {
    setBarRadar(!barRadar);
  };


  
  const apikey = 'AIzaSyBiQxXOFhKyV-xlXCyFoBAIgshY5UhM7i8';


 

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

  // This component makes uses of the Grid component from MUI (https://mui.com/material-ui/react-grid/).
  // The Grid component is super simple way to create a page layout. Simply make a <Grid container> tag
  // (optionally has spacing prop that specifies the distance between grid items). Then, enclose whatever
  // component you want in a <Grid item xs={}> tag where xs is a number between 1 and 12. Each row of the
  // grid is 12 units wide and the xs attribute specifies how many units the grid item is. So if you want
  // two grid items of the same size on the same row, define two grid items with xs={6}. The Grid container
  // will automatically lay out all the grid items into rows based on their xs values.
  return (
    <Container>

      {/* {selectedNeighborhood && <SongCard neighborhood={selectedNeighborhood} handleClose={() => setSelectedNeighborhood(null)} />} */}
      <h2>Search Housing Neighborhood</h2>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <TextField label='Neighborhood' value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} style={{ width: "100%" }}/>
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
        {/* TODO (TASK 24): add sliders for danceability, energy, and valence (they should be all in the same row of the Grid) */}
        {/* Hint: consider what value xs should be to make them fit on the same row. Set max, min, and a reasonable step. Is valueLabelFormat is necessary? */}
       
    
      </Grid>
     

      <Button onClick={() => search() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
        Search
      </Button>
     
     
      
      <Grid container spacing={6}>
      {/* <div><h1>My Map</h1><Map apikey ={apikey}/></div> */}
      <Grid item xs={6}>
      <div >
        
      <h2>Race Distribution</h2>
          { // This ternary statement returns a BarChart if barRadar is true, and a RadarChart otherwise
            barRadar
              ? (
                <ResponsiveContainer height={250}>
               <PieChart width={400} height={400}>
          
          <Pie dataKey="value" data={chartData} cx="20%" cy="50%"innerRadius={40} outerRadius={80} fill="#82ca9d" />
          <Tooltip />
        </PieChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer height={250}>
                  {/* TODO (TASK 21): display the same data as the bar chart using a radar chart */}
                  {/* Hint: refer to documentation at https://recharts.org/en-US/api/RadarChart */}
                  {/* Hint: note you can omit the <Legend /> element and only need one Radar element, as compared to the sample in the docs */}
                  <PieChart width={400} height={400}>
          
          <Pie dataKey="value" data={chartData} cx="20%" cy="50%" innerRadius={40} outerRadius={80} fill="#82ca9d" />
          <Tooltip />
        </PieChart>
                </ResponsiveContainer>
              )
          }
        </div>
        </Grid>
       
        <Grid item xs={6}>
        <div >
        <h2>Gender Distribution</h2>
          { // This ternary statement returns a BarChart if barRadar is true, and a RadarChart otherwise
            barRadar
              ? (
                <ResponsiveContainer height={250}>
               <PieChart width={400} height={400}>
          
          <Pie dataKey="value" data={chartDataG} cx="20%" cy="50%"innerRadius={40} outerRadius={80} fill="#cd95ed" />
          <Tooltip />
        </PieChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer height={250}>
                  {/* TODO (TASK 21): display the same data as the bar chart using a radar chart */}
                  {/* Hint: refer to documentation at https://recharts.org/en-US/api/RadarChart */}
                  {/* Hint: note you can omit the <Legend /> element and only need one Radar element, as compared to the sample in the docs */}
                  <PieChart width={400} height={400}>
          
          <Pie dataKey="value" data={chartDataG} cx="20%" cy="50%" innerRadius={40} outerRadius={80} fill="#82ca9d" />
          <Tooltip />
        </PieChart>
                </ResponsiveContainer>
              )
          }
        </div>
</Grid>
</Grid>
      <div>
        
    </div>

      <h2>Housings By Rank in Neighborhood</h2>
      {/* Notice how similar the DataGrid component is to our LazyTable! What are the differences? */}
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />
      
    </Container>
    
  );
}