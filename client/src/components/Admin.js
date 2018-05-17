import React, { Component } from 'react';
import { Redirect } from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: theme.mixins.gutters({
  paddingTop: 16,
  paddingBottom: 16,
  marginTop: theme.spacing.unit * 3,
}),
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  menu: {
    width: 200,
  },
  select: {
    minWidth: 90
  },
  input: {
    minWidth: 200
  }
});

class Admin extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onChangeSelect = this.onChangeSelect.bind(this);
    this.onChangeSelectAsset = this.onChangeSelectAsset.bind(this);
    this.onChangeSelectPortfolio = this.onChangeSelectPortfolio.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onSubmitPortfolio = this.onSubmitPortfolio.bind(this);
    this.state = {
      ticker: '',
      source: 'binance',
      formSubmitted: false,
      portfolioName: null,
      asset_type: 'cryptocurrencies',
      portfolio_id: 0,
      activity_ticker: null,
      type: null,
      activity_date: null,
      price: null,
      quantity: null,
      fees: null,
      net_proceeds: null
    };
  }
  onChange(e) {
      this.setState({
        [e.target.name]: e.target.value
      })
    }
  onChangeSelect(e) {
    this.setState({ source: e.target.value });
  }
  onChangeSelectAsset(e) {
    this.setState({ asset_type: e.target.value });
  }
  onChangeSelectPortfolio(e) {
    this.setState({ portfolio_id: e.target.value });
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

  onSubmitPortfolio(e) {
    e.preventDefault();
    const data = {
      portfolioName: this.state.portfolioName.trim(),
      asset_type: this.state.asset_type,
      token: localStorage.getItem("jwt")
    };
    // made an api call to the node server
    let config = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    };

    fetch('/api/portfolio/save', config)
    .then(() => this.setState({ formSubmitted: true }));
  }

  render() {
    const { classes } = this.props;

    if (this.state.formSubmitted) {
      return <Redirect to="/" />
    }
    return (
      <div className="container-admin">
        <Paper className="paper" elevation={8}>
          <form onSubmit={this.onSubmit}>
            <Typography variant="headline" component="p">
              Add Market Data
            </Typography>
            <TextField
              id="ticker"
              label="Ticker"
              name="ticker"
              margin="normal"
              value={this.state.ticker}
              onChange={this.onChange}
            />

            <Select
              value={this.state.source}
              onChange={this.onChangeSelect}
              inputProps={{
                name: 'source',
                id: 'source'
              }}
            >
              <MenuItem value="binance">
                binance
              </MenuItem>
              <MenuItem value={"coinmarketcap-price"}>coinmarketcap-price</MenuItem>
              <MenuItem value={"coinmarketcap-volume"}>coinmarketcap-volume</MenuItem>
              <MenuItem value={"yahoo-price"}>yahoo-price</MenuItem>
            </Select>
            <br />
              <Button className="admin-button" type="submit">
                Submit
              </Button>
          </form>
        </Paper>

        <Paper className="paper" elevation={8}>
          <form onSubmit={this.onSubmitPortfolio}>
            <Typography variant="headline" component="p">
              Add Portfolio
            </Typography>
            <TextField
              id="portfolioName"
              label="Name"
              name="portfolioName"
              margin="normal"
              value={this.state.portfolioName}
              onChange={this.onChange}
              />

              <Select
                value={this.state.asset_type}
                onChange={this.onChangeSelectAsset}
                inputProps={{
                  name: 'asset_type',
                  id: 'asset_type'
                }}
              >
                <MenuItem value="cryptocurrencies">
                  cryptocurrencies
                </MenuItem>
                <MenuItem value={"shares"}>shares</MenuItem>
              </Select>
              <br />
              <Button className="admin-button" type="submit">
                Submit
              </Button>
          </form>
        </Paper>



        <Paper className="paper" elevation={8}>
          <form onSubmit={this.onSubmitPortfolio}>
            <Typography variant="headline" component="p">
              Add Activity
            </Typography>
            <div className="input-row">
              <p className="p-inline">Portfolio Name</p>
              <Select
                className={classes.select}
                value={this.state.portfolio_id}
                onChange={this.onChangeSelectPortfolio}
                inputProps={{
                  name: 'portfolio_id',
                  id: 'portfolio_id'
                }}
              >
                {this.props.portfolios.map((portfolio) => {
                  return (
                    <MenuItem value={portfolio.id}>
                      {portfolio.portfolio_name}
                    </MenuItem>
                  )
                })}
              </Select>
            </div>

            <TextField
              className={classes.input}
              id="portfolioName"
              label="Name"
              name="portfolioName"
              margin="normal"
              value={this.state.portfolioName}
              onChange={this.onChange}
              />


              <br />
              <Button className="admin-button" type="submit">
                Submit
              </Button>
          </form>
        </Paper>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  portfolios: state.portfolio.portfolios
});

export default connect(mapStateToProps, {}) (withStyles(styles)(Admin));
