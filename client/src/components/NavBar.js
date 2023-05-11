import { AppBar, Container, Toolbar, Typography } from '@mui/material'
import { NavLink } from 'react-router-dom';

const NavText = ({ href, text, isMain }) => {
  return (
    <Typography
      variant={isMain ? 'h7' : 'h7'}
      noWrap
      style={{
        marginRight: '75px',
        fontFamily: 'Gill Sans',
        fontWeight: 700,
        letterSpacing: '.3rem',
      }}
    >
      <NavLink
        to={href}
        style={{
          color: 'inherit',
          textDecoration: 'none',
        }}
      >
        {text}
      </NavLink>
    </Typography>
  )
}

export default function NavBar() {
  return (
    <AppBar position='static'>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <NavText href='/intro' text='SafeStreetNYC' isMain />
          <NavText href='/airbnb' text='AIRBNB' />
          <NavText href='/housing' text='HOUSINGS' />
          <NavText href='/hospitals' text='HOSPITALS' />
          <NavText href='/nearby' text='NEARBY HOSPITALS&CRIME' />
          <NavText href='/logout' text='LOGOUT' />
        </Toolbar>
      </Container>
    </AppBar>
  );
}