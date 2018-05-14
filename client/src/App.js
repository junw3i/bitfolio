import React, { Component } from 'react';
import './App.css';
import { Provider } from 'react-redux';
import store from './store';
import AppRouter from './routers/AppRouter';

class App extends Component {
  constructor() {
    super()
    this.state = {users: [], token: '', isAuthenticated: false};
  }

  render() {
    return (
      <Provider store={store}>
        <AppRouter />
      </Provider>
    );
  }
}

export default App;
