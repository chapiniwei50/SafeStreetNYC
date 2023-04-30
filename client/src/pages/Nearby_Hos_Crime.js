import { useEffect, useState, React } from 'react';
import { Button, Checkbox, Container, FormControlLabel, Grid, Link, Slider, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
// import SongCard from '../components/SongCard';
// import { formatDuration } from '../helpers/formatter';

const config = require('../config.json');







export default function SongsPage() {
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [dataC, setDataC] = useState([]);
  // const [selectedNeighborhood, setSelectedNeighborhood] = useState(null);

  const [address, setAddress] = useState('');
 
  const [distance, setDistance] = useState(700);


  ;
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


//!!!!!!!!!!!!!GET LONGITUDE LATITUDE!!!!!!!!!!!!!




  const search = async () => {
    console.log("search");
 
  // Get latitude and longitude
  const latLng = await getLatLng(address);
 if (!latLng) {
  console.log("Unable to find latitude and longitude for the provided address.");
  return;
  }
  
  console.log(latLng);
  
  fetch(
  `http://${config.server_host}:${config.server_port}/getlocalhospitals?Distance=${distance}` +
  `&Longitude=${latLng.lng}` +
  `&Latitude=${latLng.lat}`
  )
  .then((res) => res.json())
  .then((hospitals) => {
  console.log(hospitals);
  console.log("effect here");
  setData(hospitals);
  console.log(data);
  });
      fetch(`http://${config.server_host}:${config.server_port}/getlocalcrime?Distance=${distance}` +
    `&Longitude=${latLng.lng}` +
    `&Latitude=${latLng.lat}` 
    )
      .then(res => res.json())
      .then(crimes => {
        console.log(crimes);
        console.log("effect here")
        for(let i = 0; i < crimes.length; i++){

        }
        setDataC(crimes);
        console.log(dataC);
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
    { field: 'Facility_Type', headerName: 'Hospital Type', width: 400 },
    { field: 'Count', headerName: 'Count', width: 300 },
    
  ]

  const columnsC = [
    // { field: 'neighborhood', headerName: 'Neighborhood', width: 300, renderCell: (params) => (
    //     <Link onClick={() => setSelectedNeighborhood(params.row.song_id)}>{params.value}</Link>
    // ) },
    { field: 'Crime_Description', headerName: 'Crime Type', width: 400 },
    { field: 'Count', headerName: 'Count', width: 300 },
    
  ]
  
  
  const apikey = 'AIzaSyBiQxXOFhKyV-xlXCyFoBAIgshY5UhM7i8';

  const getLatLng = async (address) => {
    const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
    )}&key=${config.apiKey}`
  );
    const data = await response.json();
    if (data.results && data.results.length > 0) {
    const location = data.results[0].geometry.location;
    return { lat: location.lat, lng: location.lng };
    } else {
      return null;
    }
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
      <h2>Search Address</h2>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <TextField label='address' value={address} onChange={(e) => setAddress(e.target.value)} style={{ width: "100%" }}/>
        </Grid>
        
        <Grid item xs={4}>
          <p>Distance</p>
          <Slider
            value={distance}
            min={500}
            max={2000}
            step={100}
            onChange={(e, newValue) => setDistance(newValue)}
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
      
      {/* <div><h1>My Map</h1><Map apikey ={apikey}/></div> */}


      <h2>Nearby Hospital Types</h2>
      {/* Notice how similar the DataGrid component is to our LazyTable! What are the differences? */}
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />

<h2>Nearby Crimes Types</h2>
      {/* Notice how similar the DataGrid component is to our LazyTable! What are the differences? */}
      <DataGrid
        rows={dataC}
        columns={columnsC}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />
      
    </Container>
    
  );
}