// import React, { useEffect, useState } from 'react';
// import { Button, Checkbox, Container, FormControlLabel, Grid, Link, Slider, TextField } from '@mui/material';
// import { DataGrid } from '@mui/x-data-grid';
// import hospitalsData from './hospitals.json';
// // import SongCard from '../components/SongCard';
// // import { formatDuration } from '../helpers/formatter';

// const config = require('../config.json');







// export default function SongsPage() {
//   const [pageSize, setPageSize] = useState(10);
//   const [data, setData] = useState([]);
//   // const [selectedNeighborhood, setSelectedNeighborhood] = useState(null);

//   const [hospital_type, setHospitalType] = useState('');
 



//   // function Map(props) {
//   //   // useEffect(() => {
//   //   //   // Load the Google Maps API script
//   //   //   const script = document.createElement("script");
//   //   //   script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDFhAnBjuTlAKWeaNkNuvtMkz-z73LJYmI&callback=initMap`;
//   //   //   script.async = true;
//   //   //   document.body.appendChild(script);
  
//   //   //   // Initialize the map
//   //   //   window.initMap = () => {
//   //   //     // Create a new map object
//   //   //     const map = new window.google.maps.Map(document.getElementById("map"), {
//   //   //       center: { lat: 40.7128, lng: -74.0060 },
//   //   //       zoom: 12,
//   //   //     });
  
//   //   //     // Add a marker to the map
//   //   //     // const marker = new window.google.maps.Marker({
//   //   //     //   position: { lat: -34.397, lng: 150.644 },
//   //   //     //   map: map,
//   //   //     //   title: "Sydney",
//   //   //     // });
//   //   //   };
//   //   // }, [props.apikey]);
  
//   //   // return <div id="map" style={{ height: "400px" }}></div>;
//   //   const mapRef = React.useRef(null);

//   //   useEffect(() => {
//   //     // Ensure the script isn't loaded multiple times
//   //     if (!window.googleMapsScriptLoaded) {
//   //       loadGoogleMapsApi();
//   //     } else {
//   //       initMap();
//   //     }
  
//   //     window.initMap = initMap;
  
//   //     function loadGoogleMapsApi() {
//   //       const script = document.createElement('script');
//   //       script.src = `https://maps.googleapis.com/maps/api/js?key=${props.apikey}&callback=initMap`;
//   //       script.async = true;
//   //       script.defer = true;
//   //       document.body.appendChild(script);
//   //       window.googleMapsScriptLoaded = true;
//   //     }
  
//   //     function initMap() {
//   //       new window.google.maps.Map(mapRef.current, {
//   //         center: { lat: 40.7128, lng: -74.0060 },
//   //         zoom: 12,
//   //       });
//   //     }
  
//   //   }, [props.apikey]);
  
//   //   return <div ref={mapRef} style={{ height: "400px", width: "100%" }} />;
  
//   // }

//   // function Map(props) {
//   //   const mapRef = React.useRef(null);

//   // // Declare initMap outside of the useEffect hook
//   // function initMap() {
//   //   const map = new window.google.maps.Map(mapRef.current, {
//   //     center: { lat: 40.7128, lng: -74.0060 },
//   //     zoom: 12,
//   //   });

//   //   // Add markers to the map
//   //   hospitalsData.forEach(hospital => {
//   //     if(hospital.Latitude && hospital.Longitude) {
//   //       const marker = new window.google.maps.Marker({
//   //         position: { lat: hospital.Latitude, lng: hospital.Longitude },
//   //         map: map,
//   //         title: hospital["Facility Name"],
//   //       });
  
//   //       // Add a click listener to the marker
//   //       marker.addListener('click', () => {
//   //         const infowindow = new window.google.maps.InfoWindow({
//   //           content: hospital["Facility Name"],
//   //         });
//   //         infowindow.open(map, marker);
//   //       });
//   //     }
//   //   });
//   // }

//   // useEffect(() => {
//   //   window.initMap = initMap; // Set the global initMap function

//   //   // Only load the Google Maps API script if it hasn't been loaded already
//   //   if (!window.googleMapsScriptLoaded) {
//   //     const script = document.createElement('script');
//   //     script.src = `https://maps.googleapis.com/maps/api/js?key=${props.apikey}&callback=initMap`;
//   //     script.async = true;
//   //     script.defer = true;
//   //     document.body.appendChild(script);
//   //     window.googleMapsScriptLoaded = true;
//   //   } else {
//   //     // If the script has already been loaded, just call initMap
//   //     initMap();
//   //   }
//   // }, [props.apikey]);

//   //   return <div ref={mapRef} style={{ height: "400px", width: "100%" }} />;
//   // }

//   function Map(props) {
//     const mapRef = React.useRef(null);
  
//     // Declare initMap outside of the useEffect hook
//     function initMap() {
//       if(!window.google || !window.google.maps) {
//         console.log("Google Maps API has not been loaded yet");
//         return;
//       }
      
//       const map = new window.google.maps.Map(mapRef.current, {
//         center: { lat: 40.7128, lng: -74.0060 },
//         zoom: 12,
//       });
  
//       // Add markers to the map
//       hospitalsData.forEach(hospital => {
//         if(hospital.Latitude && hospital.Longitude) {
//           const marker = new window.google.maps.Marker({
//             position: { lat: hospital.Latitude, lng: hospital.Longitude },
//             map: map,
//             title: hospital["Facility Name"],
//           });
  
//           // Add a click listener to the marker
//           marker.addListener('click', () => {
//             const infowindow = new window.google.maps.InfoWindow({
//               content: hospital["Facility Name"],
//             });
//             infowindow.open(map, marker);
//           });
//         }
//       });
//     }
  
//     useEffect(() => {
//       window.initMap = initMap; // Set the global initMap function
  
//       // Only load the Google Maps API script if it hasn't been loaded already
//       if (!window.googleMapsScriptLoaded) {
//         const script = document.createElement('script');
//         script.src = `https://maps.googleapis.com/maps/api/js?key=${props.apikey}&callback=initMap`;
//         script.async = true;
//         script.defer = true;
//         document.body.appendChild(script);
//         window.googleMapsScriptLoaded = true;
//       } else {
//         // If the script has already been loaded, just call initMap
//         initMap();
//       }
//     }, [props.apikey]);
  
//     return <div ref={mapRef} style={{ height: "400px", width: "100%" }} />;
//   }
  


  

//   // function Map(props) {
 
//   //   const { center, zoom } = props;
  
//   //   return (
//   //     <div style={{ height: '100vh', width: '100%' }}>
//   //       <GoogleMapReact
//   //         bootstrapURLKeys={{ key: "AIzaSyBiQxXOFhKyV-xlXCyFoBAIgshY5UhM7i8" }}
//   //         defaultCenter={center}
//   //         defaultZoom={zoom}
//   //       >
//   //         {/* Add markers, polygons, or other map components here */}
//   //       </GoogleMapReact>
//   //     </div>
//   //   );
//   // }


 

//   // useEffect(() => {
//   //   console.log("use effect")
//   //   fetch(`http://${config.server_host}:${config.server_port}/getrankhousing`)
//   //     .then(res => res.json())
//   //     .then(housings => {
//   //       console.log(housings);
//   //       // console.log("effect here")
//   //       // setData(housings);
//   //     });
//   // }, []);


//   // const healthcare_weight = req.query.Healthcare_Weight ?? 0;
//   // const safety_weight = req.query.Safety_Weight ?? 0;
//   // const price_weight = req.query.Price_Weight ?? 0;
//   // const neighborhood = req.query.Neighborhood;


//   const search = () => {
//     console.log("search")
    
//     fetch(`http://${config.server_host}:${config.server_port}/gethospitaltype?Facility_Type=${hospital_type}`
//     )
//       .then(res => res.json())
//       .then(hospitals => {
//         console.log(hospitals);
//         console.log("effect here")
//         setData(hospitals);
//         console.log(data);
//       });
//   }


//   // This defines the columns of the table of songs used by the DataGrid component.
//   // The format of the columns array and the DataGrid component itself is very similar to our
//   // LazyTable component. The big difference is we provide all data to the DataGrid component
//   // instead of loading only the data we need (which is necessary in order to be able to sort by column)
//   const columns = [
//     // { field: 'neighborhood', headerName: 'Neighborhood', width: 300, renderCell: (params) => (
//     //     <Link onClick={() => setSelectedNeighborhood(params.row.song_id)}>{params.value}</Link>
//     // ) },
//     { field: 'Name', headerName: 'Name', width: 400 },
//     { field: 'Location', headerName: 'Location', width: 300 },
//     { field: 'Phone', headerName: 'Phone', width: 300 },
    
//   ]
  
  
//   const apikey = 'AIzaSyDFhAnBjuTlAKWeaNkNuvtMkz-z73LJYmI';

//   // This component makes uses of the Grid component from MUI (https://mui.com/material-ui/react-grid/).
//   // The Grid component is super simple way to create a page layout. Simply make a <Grid container> tag
//   // (optionally has spacing prop that specifies the distance between grid items). Then, enclose whatever
//   // component you want in a <Grid item xs={}> tag where xs is a number between 1 and 12. Each row of the
//   // grid is 12 units wide and the xs attribute specifies how many units the grid item is. So if you want
//   // two grid items of the same size on the same row, define two grid items with xs={6}. The Grid container
//   // will automatically lay out all the grid items into rows based on their xs values.
//   return (
//     <Container>
      
//       {/* {selectedNeighborhood && <SongCard neighborhood={selectedNeighborhood} handleClose={() => setSelectedNeighborhood(null)} />} */}
//       <h2>Search Hospital Type</h2>
//       <Grid container spacing={6}>
//         <Grid item xs={12}>
//           <TextField label='Hospital Type' value={hospital_type} onChange={(e) => setHospitalType(e.target.value)} style={{ width: "100%" }}/>
//         </Grid>
        
       
//         {/* TODO (TASK 24): add sliders for danceability, energy, and valence (they should be all in the same row of the Grid) */}
//         {/* Hint: consider what value xs should be to make them fit on the same row. Set max, min, and a reasonable step. Is valueLabelFormat is necessary? */}
       
    
//       </Grid>
     

//       <Button onClick={() => search() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
//         Search
//       </Button>
      
//       <div><h1>My Map</h1><Map apikey ={apikey}/></div>


//       <h2>Results</h2>
//       {/* Notice how similar the DataGrid component is to our LazyTable! What are the differences? */}
//       <DataGrid
//         rows={data}
//         columns={columns}
//         pageSize={pageSize}
//         rowsPerPageOptions={[5, 10, 25]}
//         onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
//         autoHeight
//       />
      
//     </Container>
    
//   );
// }


// NEW CODE
import React, { useEffect, useState } from 'react';
import { Button, TextField, Container, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import hospitalsData from './hospitals.json';
const config = require('../config.json');

export default function SongsPage() {
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [hospitalName, setHospitalName] = useState('');

  function Map(props) {
    const mapRef = React.useRef(null);
  
    function initMap() {
      if(!window.google || !window.google.maps) {
        console.log("Google Maps API has not been loaded yet");
        return;
      }
      
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 40.7128, lng: -74.0060 },
        zoom: 12,
      });
  
      const filteredHospitals = hospitalsData.filter(hospital => 
        hospital["Facility Name"].toLowerCase().includes(hospitalName.toLowerCase())
      );
  
      filteredHospitals.forEach(hospital => {
        if(hospital.Latitude && hospital.Longitude) {
          const marker = new window.google.maps.Marker({
            position: { lat: hospital.Latitude, lng: hospital.Longitude },
            map: map,
            title: hospital["Facility Name"],
          });
  
          marker.addListener('click', () => {
            const infowindow = new window.google.maps.InfoWindow({
              content: hospital["Facility Name"],
            });
            infowindow.open(map, marker);
          });
        }
      });
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
    }, [props.apikey, hospitalName]);
  
    return <div ref={mapRef} style={{ height: "400px", width: "100%" }} />;
  }
  
  const search = () => {
    fetch(`http://${config.server_host}:${config.server_port}/gethospitaltype?Facility_Type=${hospitalName}`)
      .then(res => res.json())
      .then(hospitals => {
        setData(hospitals);
      });
  }

  const columns = [
    { field: 'Name', headerName: 'Name', width: 400 },
    { field: 'Location', headerName: 'Location', width: 300 },
    { field: 'Phone', headerName: 'Phone', width: 300 },
  ]
  
  const apikey = 'AIzaSyDFhAnBjuTlAKWeaNkNuvtMkz-z73LJYmI';

  return (
    <Container>
      <h2>Search Hospital Name</h2>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <TextField label='Hospital Name' value={hospitalName} onChange={(e) => setHospitalName(e.target.value)} style={{ width: "100%" }}/>
        </Grid>
      </Grid>
  
      <Button 
        variant="contained"
        color="primary"
        onClick={search} 
        style={{ marginTop: '10px', marginBottom: '20px' }}
      >
        Search
      </Button>
  
      <h2>Map:</h2>
      <Map apikey={apikey} />
  
      <h2>Hospitals:</h2>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid 
          rows={data} 
          columns={columns} 
          pageSize={pageSize} 
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)} 
          rowsPerPageOptions={[5, 10, 20]} 
          pagination 
        />
      </div>
    </Container>
  );
}