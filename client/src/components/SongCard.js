import { useEffect, useState } from 'react';
import { Box, Button, ButtonGroup, Link, Modal } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

export default function SongCard({ id, handleClose }) {
  const [data, setData] = useState({});
  const [pageSize, setPageSize] = useState(10);
  useEffect(() => {
    fetch(`http://${process.env.REACT_APP_SERVER_HOST}:${process.env.REACT_APP_SERVER_PORT}/findSimilarity?Property=${id}`)
      .then(res => res.json())
      .then(airbnbs => {
        setData(airbnbs)

      })
  }, []);


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

