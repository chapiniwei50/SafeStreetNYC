import React, { useEffect, useState } from 'react';
import { Button, TextField, Container, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from "react-router-dom";
import { ReactSession } from 'react-client-session';

export default function SongsPage() {
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [hospital_type, setHospitalType] = useState('');

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
        zoom: 12,
      });

      if (data.length > 0) {
        data.forEach(hospital => {
          if (hospital.Latitude && hospital.Longitude) {
            const marker = new window.google.maps.Marker({
              position: { lat: hospital.Latitude, lng: hospital.Longitude },
              map: map,
              title: hospital["Name"],
            });

            marker.addListener('click', () => {
              const infowindow = new window.google.maps.InfoWindow({
                content: hospital["Name"],
              });
              infowindow.open(map, marker);
            });
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
    }, [props.apikey, hospital_type]);

    return <div ref={mapRef} style={{ height: "400px", width: "100%" }} />;
  }

  const search = () => {

    fetch(`http://${process.env.REACT_APP_SERVER_HOST}:${process.env.REACT_APP_SERVER_PORT}/gethospitaltype?Facility_Type=${hospital_type}`
    )
      .then(res => res.json())
      .then(hospitals => {
        if (hospitals.length == undefined) {
          alert('No Matching Results')
        } else {
          setData(hospitals);
        }
      });
  }

  const columns = [
    { field: 'Name', headerName: 'Name', width: 400 },
    { field: 'Location', headerName: 'Location', width: 500 },
    { field: 'Phone', headerName: 'Phone', width: 300 },
  ]

  const apikey = process.env.REACT_APP_APIKEY;

  return (
    <Container>
      <h2>Search Hospital Type</h2>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <TextField label='Hospital Type' value={hospital_type} onChange={(e) => setHospitalType(e.target.value)} style={{ width: "100%" }} />
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

      <h2>Hospital Locations</h2>
      <Map apikey={apikey} />

      <h2>Hospitals</h2>
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