import { useEffect, useState } from 'react';
import { Box, Button, ButtonGroup, Link, Modal } from '@mui/material';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { NavLink } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';

import { formatDuration } from '../helpers/formatter';
const config = require('../config.json');

// SongCard is a modal (a common example of a modal is a dialog window).
// Typically, modals will conditionally appear (specified by the Modal's open property)
// but in our implementation whether the Modal is open is handled by the parent component
// (see HomePage.js for example), since it depends on the state (selectedSongId) of the parent
export default function SongCard({ id, handleClose }) {
  const [data, setData] = useState({});
  const [pageSize, setPageSize] = useState(10);
  // TODO (TASK 20): fetch the song specified in songId and based on the fetched album_id also fetch the album data
  // Hint: you need to both fill in the callback and the dependency array (what variable determines the information you need to fetch?)
  // Hint: since the second fetch depends on the information from the first, try nesting the second fetch within the then block of the first (pseudocode is provided)
  useEffect(() => { 
    // Hint: here is some pseudocode to guide you
    console.log(id);
    fetch(`http://${config.server_host}:${config.server_port}/findSimilarity?Property=${id}`)
      .then(res => res.json())
      .then(airbnbs => {
        console.log(airbnbs);
        setData(airbnbs)
        
       })
      },[]);

   
      const columns = [
        { field: 'Name', headerName: 'Name', width: 200 },
        { field: 'Price', headerName: 'Price', width: 100 },
        { field: 'Room_Type', headerName: 'Room Type', width: 200 },
        { field: 'Avg_Neighborhood_Price', headerName: 'Average Neighborhood Price', width: 200 },
        { field: 'Crime_Count', headerName: 'Crime Count', width: 100 },
        { field: 'Hospital_Count', headerName: 'Hospital Count', width: 200 },

        
      ];

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
        <h2>Airbnbs with Simliar Prices</h2>
<DataGrid
  rows={data}
  columns={columns}
  pageSize={pageSize}
  rowsPerPageOptions={[5, 10, 25]}
  onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
  autoHeight
/> 
       
             
        <Button onClick={handleClose} style={{ left: '50%', transform: 'translateX(-50%)' }} >
          Close
        </Button>
      </Box>
 
    </Modal>
  );
}

