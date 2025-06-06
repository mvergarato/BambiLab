import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Beats from './pages/Beats';
import Login from './pages/Login';
import Register from './components/Register';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      {/* Layout flex-column para que el footer quede abajo */}
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        {/* Main con flex-grow para ocupar espacio disponible */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/beats" element={<Beats />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
