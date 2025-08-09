import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './contexts/DataContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Records from './pages/Records';
import Search from './pages/Search';
import TimeTracking from './pages/TimeTracking';

function App() {
  return (
    <DataProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/records" element={<Records />} />
            <Route path="/search" element={<Search />} />
            <Route path="/time-tracking" element={<TimeTracking />} />
          </Routes>
        </Layout>
      </Router>
    </DataProvider>
  );
}

export default App;