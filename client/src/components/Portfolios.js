import React, { Component } from 'react';
import Benchmark from './Benchmark';
import Portfolio from './Portfolio';
import EOD from './EOD';
import { connect } from 'react-redux';
import { updatePortfolios } from '../actions/portfolio';

class Portfolios extends Component {
  constructor(props) {
    super(props);
    const jwt = localStorage.getItem("jwt");
    if (!!jwt) {
      let config = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ token: jwt})
      };
      fetch('/api/portfolio/get', config)
      .then(response =>
        response.json())
        .then(data => {
          this.props.updatePortfolios(data);
        })
      }
    this.state = {
      benchmarkList: ['BTCUSDT', 'BNBUSDT', 'NASDAQ', 'S&P']
    };
  }
  render() {

    const benchmarks = this.state.benchmarkList.map((tick) => {
      return (
        <Benchmark tick={tick} key={tick} />
      )
    });
    const portfoliosEOD = this.props.portfolios.map((portfolio) => {
      return (
        <EOD portfolio={portfolio} key={portfolio.id} />
      )
    });
    const portfolios = this.props.portfolios.map((portfolio) => {
      return (
        <Portfolio portfolio={portfolio} key={portfolio.id} />
      )
    });
    return (
      <div className="container-benchmark">
        <div className="benchmarks">{benchmarks}{portfoliosEOD}</div>
        {portfolios}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  portfolios: state.portfolio.portfolios
});

export default connect(mapStateToProps, { updatePortfolios })(Portfolios);
