import React, { Component } from 'react';

class Price extends Component {
  constructor(props) {
    super(props);
    this.state = { price: [] }
  }
  componentDidMount(){
    fetch('/price')
    .then(res => res.json())
    .then(price => this.setState({ price }));
  }

  render() {
    return (
      <div>
        <b>{this.props.tickData.ticker}</b>
      </div>
    )
  }
}

export default Price;
