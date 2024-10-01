import { useState } from 'react'
import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { createTheme } from '@mui/material/styles';
import Login from './components/login';
import CssBaseline from '@mui/material/CssBaseline';
import SignUp from './components/signUp';
import PersonalBests from './components/personalBests';
import EditWorkout from './components/editWorkout';
import ViewWorkouts from './components/viewWorkouts';
import Offline from './components/offline';
import { ThemeProvider } from '@emotion/react';


function App() {
  const customTheme = createTheme({
		palette: {
      mode: "dark",
			primary: {
				main: '#04BE00',
                contrastText: '#BDBDBD'
			},
			secondary: {
				main: '#BDBDBD',
                constrastText: '#04BE00'
			},
      background: {
          default: '#313131',
          Paper: '#BDBDBD'
      },
		}
	})

  useEffect(() => {

    // favicon
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/png';
    favicon.href = '/src/static/img/favicon-32x32.png';
    document.head.appendChild(favicon);

    //apple touch
    const appleIcon = document.createElement('link');
    appleIcon.rel = 'apple-touch-icon';
    appleIcon.sizes = '180x180';
    appleIcon.href = '/src/static/img/apple-touch-icon.png';
    document.head.appendChild(appleIcon);

  }, []);



  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      <Routes>
        <Route path='/' element={<Navigate to='/login' />} />
        <Route path='/login' element={<Login customTheme={customTheme}/>} />
        <Route path='/signup' element={<SignUp customTheme={customTheme}/>} />
        <Route path='/personalBests' element={<PersonalBests customTheme={customTheme}/>} />
        <Route path='/editWorkout' element={<EditWorkout customTheme={customTheme}/>} />
        <Route path='/viewWorkouts' element={<ViewWorkouts customTheme={customTheme}/>} />
        <Route path='/offline' element={<Offline customTheme={customTheme}/>} />
      </Routes>
    </ThemeProvider>
  )
}

export default App
