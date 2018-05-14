import React, { Component } from 'react';
import { Redirect } from 'react-router';

class Admin extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onChangeSelect = this.onChangeSelect.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      ticker: '',
      source: 'binance',
      formSubmitted: false
    };
  }
  onChange(e) {
      this.setState({
        [e.target.name]: e.target.value
      })
    }
  onChangeSelect(e) {
    this.setState({ selectValue: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    const data = {
      ticker: this.state.ticker.trim().toUpperCase(),
      source: this.state.source.trim().toLowerCase(),
      token: localStorage.getItem("jwt")
    };
    // made an api call to the node server
    let config = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    };

    fetch('/api/saveTicker', config)
    .then(() => this.setState({ formSubmitted: true }));
  }

  render() {
    if (this.state.formSubmitted) {
      return <Redirect to="/" />
    }
    return (
      <div>
        <p>welcome to admin</p>
        <form onSubmit={this.onSubmit}>
          <div>
            <label>Ticker: </label><br />
            <input type="text" name="ticker" onChange={this.onChange} value={this.state.ticker} />
          </div>
          <br />

          <label>
            Source:<br />
            <select value={this.state.source} onChange={this.onChangeSelect}>
              <option value="binance">binance</option>
              <option value="coinmarketcap-price">coinmarketcap-price</option>
              <option value="coinmarketcap-volume">coinmarketcap-volume</option>
            </select>
          </label>

          <br />

          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }

}

export default Admin;
