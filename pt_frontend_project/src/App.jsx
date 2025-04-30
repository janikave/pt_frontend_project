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
import Traininglist from './components/Traininglist';


function App() {
  const [tab, setTab] = useState(0);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  }

  return (
    <Container>
      <CssBaseline />
        <AppBar>
        <Toolbar>
          <Typography>
            PT Customers
          </Typography>
        </Toolbar>
        </AppBar>

        <Tabs value={tab} onChange={handleChange}>
          <Tab label="Customers" />
          <Tab label="Training" /> 
        </Tabs>

        {tab === 0 && <Customerlist />}

        {tab === 1 && <Traininglist />}
    </Container>
  )
}

export default App
