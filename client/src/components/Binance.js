import React, { Component } from 'react';
import { removeTicker } from '../actions/market';
import { connect } from 'react-redux';

class Binance extends Component {
  constructor(props) {
    super(props);
    this.handleRemove = this.handleRemove.bind(this);
    this.state = { price: '' }
  }
  // componentDidMount(){
  //   fetch('/price')
  //   .then(res => res.json())
  //   .then(price => this.setState({ price }));
  // }
  componentDidMount(){
    let wsEndPoint = 'wss://stream.binance.com:9443/ws/' + this.props.tickData.ticker.toLowerCase() + '@aggTrade'
    this.connection = new WebSocket(wsEndPoint);
    this.connection.onmessage = evt => {
      // add the new message to state
      let tickData = JSON.parse(evt.data);
      this.setState({ price : parseFloat(tickData.p).toFixed(2) })
    };
  }

  componentWillUnmount() {
    this.connection.close();
  }

  handleRemove(e) {
    this.connection.close();
    const data = {
      id: this.props.tickData.id
    };
    let config = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    };
    fetch('/api/removeTicker', config)
    .then(() => {
      console.log("ticker removed in db");
    });
    this.props.removeTicker(this.props.tickers, this.props.tickData);

  }

  render() {
    return (
      <div>
        <b>{this.props.tickData.ticker}</b>
        <p>{this.state.price}</p>
        <button onClick={this.handleRemove}>Remove</button>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  tickers: state.market.tickers
});

export default connect(mapStateToProps, { removeTicker })(Binance);
