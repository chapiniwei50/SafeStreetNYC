import { AppBar, Container, Toolbar, Typography } from '@mui/material'
import { NavLink } from 'react-router-dom';

// The hyperlinks in the NavBar contain a lot of repeated formatting code so a
// helper component NavText local to the file is defined to prevent repeated code.
const NavText = ({ href, text, isMain }) => {
  return (
    <Typography
      variant={isMain ? 'h7' : 'h7'}
      noWrap
      style={{
        marginRight: '30px',
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

// Here, we define the NavBar. Note that we heavily leverage MUI components
// to make the component look nice. Feel free to try changing the formatting
// props to how it changes the look of the component.
export default function NavBar() {
  return (
    <AppBar position='static'>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <NavText href='/housing' text='SafeStreetNYC' isMain />
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