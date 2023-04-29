import { useEffect, useState } from 'react';
import { Box, Button, ButtonGroup, Link, Modal } from '@mui/material';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { NavLink } from 'react-router-dom';

import { formatDuration } from '../helpers/formatter';
const config = require('../config.json');

// SongCard is a modal (a common example of a modal is a dialog window).
// Typically, modals will conditionally appear (specified by the Modal's open property)
// but in our implementation whether the Modal is open is handled by the parent component
// (see HomePage.js for example), since it depends on the state (selectedSongId) of the parent
export default function SongCard({ neighborhood, handleClose }) {
  const [data, setData] = useState({});

  const [barRadar, setBarRadar] = useState(true);

  // TODO (TASK 20): fetch the song specified in songId and based on the fetched album_id also fetch the album data
  // Hint: you need to both fill in the callback and the dependency array (what variable determines the information you need to fetch?)
  // Hint: since the second fetch depends on the information from the first, try nesting the second fetch within the then block of the first (pseudocode is provided)
  useEffect(() => {
    // Hint: here is some pseudocode to guide you
    fetch(`http://${config.server_host}:${config.server_port}/gethouseranking/${neighborhood}`)
      .then(res => res.json())
      .then(resJson => {
        setData(resJson)
        })
  }, []);

  // const chartData = [
  //   { name: 'Danceability', value: songData.danceability },
  //   { name: 'Energy', value: songData.energy },
  //   { name: 'Valence', value: songData.valence },
  // ];

  // const handleGraphChange = () => {
  //   setBarRadar(!barRadar);
  // };

  return (
    <Modal
      open={true}
      onClose={handleClose}
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <Box
        p={3}
        style={{ background: 'white', borderRadius: '16px', border: '2px solid #000', width: 600 }}
      >
        <h1>{data.Address}</h1>
        <h2>Address:&nbsp;
          {/* <NavLink to={`/albums/${albumData.album_id}`}>{albumData.title}</NavLink> */}
        </h2>
        <p>Healtchare Rank: {data.Rank_Healthcare}</p>
        <p>Safety Rank: {data.Rank_Crime} bpm</p>
        <p>Price Rank: {data.Rank_Price}</p>
       
       
        <Button onClick={handleClose} style={{ left: '50%', transform: 'translateX(-50%)' }} >
          Close
        </Button>
      </Box>
    </Modal>
  );
}