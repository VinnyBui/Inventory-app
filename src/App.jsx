import React, { useState, useEffect } from 'react';
import { auth } from './config/firebase';
import { ThemeProvider } from './components/ui/theme-provider';
import Dashboard from './components/dashboard';


const App = () => {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Dashboard/>
      </ThemeProvider>
    </>
  )
}

export default App;
