import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
// import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Navbar from '../components/Navbar';
import Create from '../components/Create';
import Login from '../components/Login';
import Dashboard from '../components/Dashboard';
import Admin from '../components/Admin';

const AppRouter = () => (
  // <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Route path="/" component={Dashboard} exact={true} />
        <Route path="/register" component={Create} />
        <Route path="/admin" component={Admin} />
        <Route path="/login" component={Login} />
      </div>
    </BrowserRouter>
  // </MuiThemeProvider>
);

export default AppRouter;
