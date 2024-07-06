import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/ui/theme-provider';
import Dashboard from './components/dashboard';
import Authorize from './components/authorize';
import PrivateRoute from './components/privateRoute';

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          <Route path="/authorize" element={<Authorize />} />
          <Route path="/" element={<PrivateRoute element={<Dashboard />} />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
