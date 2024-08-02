import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/ui/theme-provider';
import PrivateRoute from './components/privateRoute';
import { Toaster } from "@/components/ui/toaster";

// Lazy load the components
const Dashboard = lazy(() => import('./components/dashboard'));
const Authorize = lazy(() => import('./components/authorize'));
const DisplayInventory = lazy(() => import('./components/tabs/displayInventory'));
const AddIventoryForm = lazy(() => import('./components/tabs/addInventoryForm'));
const DisplayShipping = lazy(() => import('./components/tabs/displayShipping'));
const AddShippingForm = lazy(() => import('./components/tabs/addShippingForm'));
const DisplayReceiving = lazy(() => import('./components/tabs/displayReceiving'));
const AddReceivingForm = lazy(() => import('./components/tabs/addReceivingForm'));
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
              <Route path="add" element={<AddIventoryForm />} />
              <Route path="shipping" element={<DisplayShipping />} />
              <Route path="addShipping" element={<AddShippingForm />} />
              <Route path="receiving" element={<DisplayReceiving/>} />
              <Route path="addReceiving" element={<AddReceivingForm/>} />
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
