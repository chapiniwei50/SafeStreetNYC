import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Container, FormControlLabel, Grid, Link, Slider, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
// import SongCard from '../components/SongCard';
// import { formatDuration } from '../helpers/formatter';

const config = require('../config.json');







export default function SongsPage() {
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  // const [selectedNeighborhood, setSelectedNeighborhood] = useState(null);

  const [neighborhood, setNeighborhood] = useState('');
  const [healthcare, setHealthcare] = useState(3);
  const [safety, setSafety] = useState(3);
  const [price, setPrice] = useState(3);




  function Map(props) {
    const mapRef = React.useRef(null);
  
    React.useEffect(() => {
      // Ensure the script isn't loaded multiple times
      if (!window.googleMapsScriptLoaded) {
        loadGoogleMapsApi();
      } else {
        window.initMap();
      }
    
      window.initMap = initMap;
    
      function loadGoogleMapsApi() {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${props.apikey}&callback=initMap`;
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        window.googleMapsScriptLoaded = true;
      }
    
      function initMap() {
        if (window.google && mapRef.current) {
          new window.google.maps.Map(mapRef.current, {
            center: { lat: 40.7128, lng: -74.0060 },
            zoom: 12,
          });
        }
      }
    }, [props.apikey]);
    
    return <div ref={mapRef} style={{ height: "400px", width: "100%" }} />;
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
    
    // fetch(`http://${config.server_host}:${config.server_port}/getrankhousing?Neighborhood=${neighborhood}` +
    //   `&Healthcare_Weight=${healthcare}` +
    //    `&Safety_Weight=${safety}` +
    //    `&Price_Weight=${price}` 
    // )
    //   .then(res => res.json())
    //   .then(housings => {
    //     console.log(housings);
    //     console.log("effect here")
    //     setData(housings);
    //     console.log(data);
    //   });

    fetch(`http://${config.server_host}:${config.server_port}/getneighborhooddemographics?Neighborhood=${neighborhood}` 
    )
      .then(res => res.json())
      .then(demographics => {
        console.log(demographics);
        console.log("effect here")
        
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
    { field: 'neighborhood', headerName: 'Address', width: 300 },
    { field: 'healthcare', headerName: 'Healthcare Rank', width: 200 },
    { field: 'safety', headerName: 'Safety Rank', width: 200 },
    { field: 'price', headerName: 'Price Rank', width: 200 },
    
  ];
  const rows = [
    // { field: 'neighborhood', headerName: 'Neighborhood', width: 300, renderCell: (params) => (
    //     <Link onClick={() => setSelectedNeighborhood(params.row.song_id)}>{params.value}</Link>
    // ) },
    { id: 'Baruch Houses Family Health Center', Name: 'hey', Location: 'yay', Phone: 'f' },
    { id: 'Aaruch Houses Family Health Center', Name: 'hey', Location: 'yay', Phone: 'f' },
    { id: 'Caruch Houses Family Health Center', Name: 'hey', Location: 'yay', Phone: 'f' },
  ]



  
  const apikey = 'AIzaSyBiQxXOFhKyV-xlXCyFoBAIgshY5UhM7i8';

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
      <h2>Search Neighborhood</h2>
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
      
      <div><h1>My Map</h1><Map apikey ={apikey}/></div>


      <h2>Results</h2>
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