import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/ui/theme-provider';
import PrivateRoute from './components/privateRoute';
import { Toaster } from "@/components/ui/toaster";

// Lazy load the components
const Dashboard = lazy(() => import('./components/dashboard'));
const Authorize = lazy(() => import('./components/authorize'));
const DisplayInventory = lazy(() => import('./components/displayInventory'));
const AddForm = lazy(() => import('./components/addForm'));
const DisplayShipping = lazy(() => import('./components/displayShipping'));
const AddShippingForm = lazy(() => import('./components/addShippingForm'));
const DisplayItem = lazy(() => import('./components/displayItem')); 

const App = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/authorize" element={<Authorize />} />
            <Route path="/" element={<PrivateRoute element={<Dashboard />} />}>
              <Route path="dashboard" element={<div></div>} />
              <Route path="inventory" element={<DisplayInventory />} />
              <Route path="add" element={<AddForm />} />
              <Route path="shipping" element={<DisplayShipping />} />
              <Route path="addShipping" element={<AddShippingForm />} />
              <Route path="receiving" element={<div>Receiving</div>} />
              <Route path="addReceiving" element={<div>Add Receiving</div>} />
              <Route path="/item/:type/:id" element={<DisplayItem />} />
            </Route>
          </Routes>
          <Toaster />
        </Suspense>
      </Router>
    </ThemeProvider>
  );
};

export default App;
