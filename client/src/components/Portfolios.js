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
      .catch(error => console.log("error from fetch", error))
      }
    this.state = {
      benchmarkList: ['BTCUSDT', 'BNBUSDT', 'NASDAQ', 'S&P']
    };
  }
  render() {
    if (this.props.auth) {
      const benchmarks = this.state.benchmarkList.map((tick) => {
        return (
          <Benchmark tick={tick} key={tick} />
        )
      });
      const portfoliosEOD = this.props.portfolios.map((portfolio) => {
        if (this.props.auth) {
          return (
            <EOD portfolio={portfolio} key={portfolio.id} />
          )
        } else {
          return null;
        }
      });

      const portfolios = this.props.portfolios.map((portfolio) => {
        if (this.props.auth) {
          return (
            <Portfolio portfolio={portfolio} key={portfolio.id} />
          )
        } else {
          return null
        }
      });

      return (
        <div className="container-benchmark">
          <div className="benchmarks">{benchmarks}{portfoliosEOD}</div>
          {portfolios}
        </div>
      );
    } else {
      // return public view
      return null;
    }


  }
}

const mapStateToProps = state => ({
  portfolios: state.portfolio.portfolios,
  auth: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { updatePortfolios })(Portfolios);
