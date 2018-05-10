import React, { Component } from 'react';

class Price extends Component {
  constructor(props) {
    super(props);
    this.state = { price: [] }
  }
  componentDidMount(){
    console.log("price mounted");
    fetch('/price')
    .then(res => res.json())
    .then(price => this.setState({ price }));
  }

  render() {
    console.log("price", this.state.price);
    let prices = this.state.price.map(p =>
      <div key={p.id}>{p.username}</div>
    );
    return (
      <div>
      PRICE
      <div>{prices}</div>
      </div>
    )
  }
}

export default Price;
