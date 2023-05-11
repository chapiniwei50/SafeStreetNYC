import React, { useEffect, useState, PureComponent } from 'react';
import { Button, Checkbox, Container, FormControlLabel, Grid, Link, Slider, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from "react-router-dom";
import { ReactSession } from 'react-client-session';

export default function SongsPage() {
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [dataC, setDataC] = useState([]);
  const [barRadar, setBarRadar] = useState(true);
  const [hospitalLocation, setHospitalLocation] = useState([]);

  const [address, setAddress] = useState('');

  const [distance, setDistance] = useState(700);


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

      if (hospitalLocation.length > 0) {
        hospitalLocation.forEach(hospital => {
          if (hospital.Latitude && hospital.Longitude) {
            const marker = new window.google.maps.Marker({
              position: { lat: hospital.Latitude, lng: hospital.Longitude },
              map: map,
              title: hospital["Name"],
            });

            marker.addListener('click', () => {
              const infowindow = new window.google.maps.InfoWindow({
                content: hospital["Facility_Type"] + ": " + hospital["Name"]
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
    }, [props.apikey]);

    return <div ref={mapRef} style={{ height: "400px", width: "100%" }} />;
  }

  const search = async () => {
    const latLng = await getLatLng(address);
    if (!latLng) {
      console.log("Unable to find latitude and longitude for the provided address.");
      alert('No Matching Results');
      return;
    }

    fetch(
      `http://${process.env.REACT_APP_SERVER_HOST}:${process.env.process.env.REACT_APP_SERVER_PORT}/maplocalhospitals?Distance=${distance}` +
      `&Longitude=${latLng.lng}` +
      `&Latitude=${latLng.lat}`
    )
      .then((res) => res.json())
      .then((maplocations) => {

        setHospitalLocation(maplocations);

      });

    fetch(
      `http://${process.env.REACT_APP_SERVER_HOST}:${process.env.process.env.REACT_APP_SERVER_PORT}/getlocalhospitals?Distance=${distance}` +
      `&Longitude=${latLng.lng}` +
      `&Latitude=${latLng.lat}`
    )
      .then((res) => res.json())
      .then((hospitals) => {

        setData(hospitals);

      });
    fetch(`http://${process.env.REACT_APP_SERVER_HOST}:${process.env.process.env.REACT_APP_SERVER_PORT}/getlocalcrime?Distance=${distance}` +
      `&Longitude=${latLng.lng}` +
      `&Latitude=${latLng.lat}`
    )
      .then(res => res.json())
      .then(crimes => {

        setDataC(crimes);

      });
  }
  const columns = [
    { field: 'Facility_Type', headerName: 'Hospital Type', width: 400 },
    { field: 'Count', headerName: 'Count', width: 300 },

  ]

  const columnsC = [
    { field: 'Crime_Description', headerName: 'Crime Type', width: 400 },
    { field: 'Count', headerName: 'Count', width: 300 },

  ]

  const apikey = process.env.REACT_APP_APIKEY;

  const getLatLng = async (address) => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${apikey}`
    );
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return { lat: location.lat, lng: location.lng };
    } else {
      return null;
    }
  };

  const datatest = [
    {
      name: 'Page A',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Page D',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'Page E',
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: 'Page F',
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: 'Page G',
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];
  return (
    <Container>
      <h2>Search Address</h2>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <TextField label='address' value={address} onChange={(e) => setAddress(e.target.value)} style={{ width: "100%" }} />
        </Grid>

        <Grid item xs={4}>
          <p>Distance (m)</p>
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

      </Grid>


      <Button onClick={() => search()} style={{ left: '50%', transform: 'translateX(-50%)' }}>
        Search
      </Button>

      <h2>Nearby Hospital Locations</h2>
      <Map apikey={apikey} />

      <h2>Nearby Hospital Types</h2>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <div >
            <h2>Crime Distribution</h2>


            <ResponsiveContainer height={400}>
              <BarChart
                width={800}

                data={dataC}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Crime_Description" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Count" fill="#f5b8da" />

              </BarChart>
            </ResponsiveContainer>


          </div>
        </Grid>
      </Grid>
      <h2>Nearby Crimes Types</h2>
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