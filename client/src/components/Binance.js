import React, { Component } from 'react';

class Binance extends Component {
  constructor(props) {
    super(props);
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

  render() {
    return (
      <div>
        <b>{this.props.tickData.ticker}</b>
        <p>{this.state.price}</p>
      </div>
    )
  }
}

export default Binance;
