import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/ui/theme-provider';
import PrivateRoute from './components/privateRoute';
import { Toaster } from "@/components/ui/toaster";

// Lazy load the components
const Dashboard = lazy(() => import('./components/dashboard'));
const Authorize = lazy(() => import('./components/authorize'));

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router basename="/Inventory-app">
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/authorize" element={<Authorize />} />
            <Route path="/" element={<PrivateRoute element={<Dashboard />} />} />
          </Routes>
          <Toaster />
        </Suspense>
      </Router>
    </ThemeProvider>
  );
};

export default App;
