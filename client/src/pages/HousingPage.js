import { useEffect, useState, React } from 'react';
import { Button, Checkbox, Container, FormControlLabel, Grid, Link, Slider, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SongCard from '../components/SongCard';
import { formatDuration } from '../helpers/formatter';

const config = require('../config.json');

export default function SongsPage() {
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(null);

  const [neighborhood, setNeighborhood] = useState('');
  const [healthcare, setHealthcare] = useState(33);
  const [safety, setSafety] = useState(33);
  const [price, setPrice] = useState(33);
 



  function Map(props) {
    useEffect(() => {
      // Load the Google Maps API script
      const script = document.createElement("script");
      script.src = ``;
      script.async = true;
      document.body.appendChild(script);
  
      // Initialize the map
      window.initMap = () => {
        // Create a new map object
        const map = new window.google.maps.Map(document.getElementById("map"), {
          center: { lat: 40.7128, lng: -74.0060 },
          zoom: 12,
        });

        // const stateLayer = map.getFeatureLayer(window.google.maps.FeatureType.ADMINISTRATIVE_AREA_LEVEL_1);
  
        // stateLayer.style = (placeFeature) => {
        //   const displayName = placeFeature.feature.displayName;
        /// SOME MARKER
      // }
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


 

  useEffect(() => {
    console.log("use effect")
    fetch(`http://${config.server_host}:${config.server_port}/getrankhousing`)
      .then(res => res.json())
      .then(resJson => {
        // const housings = resJson.map((song) => ({ id: song.song_id, ...song }));
        console.log("here")
        // setData(housings);
      });
  }, []);


  // const healthcare_weight = req.query.Healthcare_Weight ?? 0;
  // const safety_weight = req.query.Safety_Weight ?? 0;
  // const price_weight = req.query.Price_Weight ?? 0;
  // const neighborhood = req.query.Neighborhood;


  const search = () => {
    console.log("search")
    fetch(`http://${config.server_host}:${config.server_port}/getrankhousing?Neighborhood=${neighborhood}` +
      `&healthcare=${healthcare}` +
       `&safety=${safety}` +
       `&price=${price}` 
    )

  
      .then(res => res.json())
      .then(resJson => {
        // DataGrid expects an array of objects with a unique id.
        // To accomplish this, we use a map with spread syntax (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
        // const songsWithId = resJson.map((song) => ({ id: song.song_id, ...song }));
        // setData(songsWithId);
         console.log("here")
      });
  }


  // This defines the columns of the table of songs used by the DataGrid component.
  // The format of the columns array and the DataGrid component itself is very similar to our
  // LazyTable component. The big difference is we provide all data to the DataGrid component
  // instead of loading only the data we need (which is necessary in order to be able to sort by column)
  const columns = [
    { field: 'neighborhood', headerName: 'Neighborhood', width: 300, renderCell: (params) => (
        <Link onClick={() => setSelectedNeighborhood(params.row.song_id)}>{params.value}</Link>
    ) },
    { field: 'healthcare', headerName: 'Healthcare', width: 200 },
    { field: 'safety', headerName: 'Safety', width: 200 },
    { field: 'price', headerName: 'Price', width: 200 },
    
  ]


  
  const apikey = '';

  // This component makes uses of the Grid component from MUI (https://mui.com/material-ui/react-grid/).
  // The Grid component is super simple way to create a page layout. Simply make a <Grid container> tag
  // (optionally has spacing prop that specifies the distance between grid items). Then, enclose whatever
  // component you want in a <Grid item xs={}> tag where xs is a number between 1 and 12. Each row of the
  // grid is 12 units wide and the xs attribute specifies how many units the grid item is. So if you want
  // two grid items of the same size on the same row, define two grid items with xs={6}. The Grid container
  // will automatically lay out all the grid items into rows based on their xs values.
  return (
    <Container>
      {selectedNeighborhood && <SongCard neighborhood={selectedNeighborhood} handleClose={() => setSelectedNeighborhood(null)} />}
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
            max={100}
            step={10}
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
            max={100}
            step={10}
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
            max={100}
            step={10}
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

      <div>
      <h3></h3>
      {/*  */}
      <Map apikey ={apikey}/>
    </div>


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