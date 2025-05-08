import { useState } from 'react'
import './App.css'
import Customerlist from './components/Customerlist';

import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

import Traininglist from './components/Traininglist';
import TrainingCalendar from './components/Calendar';
import TrainingGraph from './components/Statistics';


function App() {

  // Creating variables to determine and change tabs

  const [tab, setTab] = useState(0);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  }

  return (

    <Container>

      {/* Creating the header and tab menu for navigation */}

      <CssBaseline />
      <AppBar position='fixed'>
        <Toolbar sx={{ backgroundColor: '#36454F' }}>
          <Typography>
            PT Customers
          </Typography>
        </Toolbar>
        <Tabs position='fixed' sx={{ backgroundColor: 'white' }} mt={5} value={tab} onChange={handleChange}>
          <Tab label="Customers" />
          <Tab label="Training" />
          <Tab label="Calendar" />
          <Tab label="Statistics" />
        </Tabs>
      </AppBar>

    {/* Determining components their own tabs */}

      <Box sx={{ mt: 12 }}>
        {tab === 0 && <Customerlist />}

        {tab === 1 && <Traininglist />}

        {tab === 2 && <TrainingCalendar />}

        {tab === 3 && <TrainingGraph />}'
      </Box>
    </Container>
  )
}

export default App
