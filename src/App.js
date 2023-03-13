import React from 'react';
import './App.css';
import Navbar from './components/navbar-antd';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages';
import Disease from './pages/disease';
import Variant from './pages/variant';
import Gene from './pages/gene';
import Drug from './pages/drug';
import Evidence from './pages/evidence';
import Extract from './pages/extract';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' exact Component={Home} />
        <Route path='/disease' Component={Disease} />
        <Route path='/gene' Component={Gene} />
        <Route path='/variant' Component={Variant} />
        <Route path='/drug' Component={Drug} />
        <Route path='/evidence' Component={Evidence} />
        <Route path='/extract' Component={Extract} />
      </Routes>
    </Router>
  );
}

export default App;
