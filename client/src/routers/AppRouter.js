import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Create from '../components/Create';
import Login from '../components/Login';
import Dashboard from '../components/Dashboard';
import Admin from '../components/Admin';

const AppRouter = () => (
  <BrowserRouter>
    <div className="App">
      <header className="App-header">
        <Navbar />
      </header>
      <Route path="/" component={Dashboard} exact={true} />
      <Route path="/register" component={Create} />
      <Route path="/admin" component={Admin} />
      <Route path="/login" component={Login} />
    </div>
  </BrowserRouter>
);

export default AppRouter;
