import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';

import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

import moment from 'moment';

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
    width: 190,
  },
  menu: {
    width: 190,
  },
  select: {
    minWidth: 190,
    marginLeft: 7,
    marginRight: 7
  },
  input: {
    minWidth: 190,
    marginLeft: 7,
    marginRight: 7
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
    this.onSubmitActivity = this.onSubmitActivity.bind(this);
    this.onChangeSelectType = this.onChangeSelectType.bind(this);
    this.onChangeCaps = this.onChangeCaps.bind(this);
    this.onChangePrice = this.onChangePrice.bind(this);
    this.onChangeQuantity = this.onChangeQuantity.bind(this);
    this.onChangeFees = this.onChangeFees.bind(this);
    this.state = {
      ticker: '',
      source: 'binance',
      formSubmitted: false,
      portfolioName: '',
      asset_type: 'cryptocurrencies',
      portfolio_id: '',
      activity_ticker: '',
      base_currency: '',
      type: "BUY",
      activity_date: '',
      price: '',
      quantity: '',
      fees: 0,
      net_proceeds: '',
      allTypes: ['BUY', "SELL", "SUB", "REDM", "INTL"]
    };
  }
  onChange(e) {
      this.setState({
        [e.target.name]: e.target.value
      })
    }
  onChangePrice(e) {
      let net_proceeds = this.state.net_proceeds;
      if (!isNaN(e.target.value) && !isNaN(this.state.quantity) && !isNaN(this.state.fees)) {
        net_proceeds = e.target.value * this.state.quantity - this.state.fees
        if (net_proceeds / 10 > 1) {
          net_proceeds = net_proceeds.toFixed(2);
        } else {
          net_proceeds = net_proceeds.toFixed(4);
        }
      }
      this.setState({
        [e.target.name]: e.target.value,
        net_proceeds
      });
    }
    onChangeQuantity(e) {
        let net_proceeds = this.state.net_proceeds;
        if (!isNaN(e.target.value) && !isNaN(this.state.quantity) && !isNaN(this.state.fees)) {
          net_proceeds = e.target.value * this.state.price - this.state.fees
          if (net_proceeds / 10 > 1) {
            net_proceeds = net_proceeds.toFixed(2);
          } else {
            net_proceeds = net_proceeds.toFixed(4);
          }
        }
        this.setState({
          [e.target.name]: e.target.value,
          net_proceeds
        });
      }
      onChangeFees(e) {
          let net_proceeds = this.state.net_proceeds;
          if (!isNaN(e.target.value) && !isNaN(this.state.quantity) && !isNaN(this.state.fees)) {
            net_proceeds = this.state.price * this.state.quantity - e.target.value;
            if (net_proceeds / 10 > 1) {
              net_proceeds = net_proceeds.toFixed(2);
            } else {
              net_proceeds = net_proceeds.toFixed(4);
            }
          }
          this.setState({
            [e.target.name]: e.target.value,
            net_proceeds
          });
        }
  onChangeCaps(e) {
    this.setState({
      [e.target.name]: e.target.value.toUpperCase()
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
  onChangeSelectType(e) {
    this.setState({ type: e.target.value })
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

  onSubmitActivity(e) {
    e.preventDefault();
    console.log("fired");
    let activity_date = moment.utc(this.state.activity_date, 'YYYY-MM-DD');
    activity_date = (moment(activity_date).add(-(moment().utcOffset()), 'm'));
    activity_date = activity_date.format().toString();

    let asset_type;
    this.props.portfolios.forEach((portfolio) => {
      if (portfolio.id === this.state.portfolio_id) {
        asset_type = portfolio.asset_type
      }
    })

    let quantity;
    let net_proceeds;
    if (this.state.type === "BUY" || this.state.type === "REDM") {
      quantity = this.state.quantity;
      net_proceeds = -this.state.net_proceeds;
    } else if (this.state.type === "SELL" || "SUB") {
      quantity = -this.state.quantity;
      net_proceeds = this.state.net_proceeds;
    }

    const data = {
      portfolio_id: this.state.portfolio_id,
      activity_ticker: this.state.activity_ticker,
      base_currency: this.state.base_currency,
      type: this.state.type,
      activity_date,
      price: this.state.price || null,
      quantity: quantity || null,
      fees: this.state.fees,
      net_proceeds,
      asset_type,
      token: localStorage.getItem("jwt")
    };
    // made an api call to the node server
    let config = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    };
    console.log(config);
    fetch('/api/trades/save', config)
    .then(() => this.setState({ formSubmitted: true }));
  }

  render() {
    const { classes } = this.props;

    if (this.state.formSubmitted) {
      return <Redirect to="/" />
    }
    return (
      <div className="container-admin">
        <Paper className="paper" elevation={8} key="market-data">
          <form onSubmit={this.onSubmit}>
            <Typography variant="headline" component="p">
              Add Market Data
            </Typography>
            <TextField
              id="ticker"
              label="ticker"
              name="ticker"
              margin="normal"
              value={this.state.ticker}
              onChange={this.onChange}
            />
            <FormControl>
              <InputLabel htmlFor="source">source</InputLabel>
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
            </FormControl>
            <br />
              <Button className="admin-button" type="submit">
                Submit
              </Button>
          </form>
        </Paper>

        <Paper className="paper" elevation={8} key="add-portfolio">
          <form onSubmit={this.onSubmitPortfolio}>
            <Typography variant="headline" component="p">
              Add Portfolio
            </Typography>
            <TextField
              id="portfolioName"
              label="name"
              name="portfolioName"
              margin="normal"
              value={this.state.portfolioName}
              onChange={this.onChange}
              />
              <FormControl>
                <InputLabel htmlFor="asset_type">asset type</InputLabel>
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
              </FormControl>
              <br />
              <Button className="admin-button" type="submit">
                Submit
              </Button>
          </form>
        </Paper>

        <Paper className="paper" elevation={8} key="add-activity">
          <form onSubmit={this.onSubmitActivity}>
            <Typography variant="headline" component="p">
              Add Activity
            </Typography>
              <FormControl>
              <InputLabel htmlFor="portfolio_id">portfolio</InputLabel>
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
              </FormControl>
            <br />
            <TextField
              className={classes.input}
              id="activity_ticker"
              label="ticker"
              name="activity_ticker"
              margin="dense"
              value={this.state.activity_ticker}
              onChange={this.onChangeCaps}
              />

            <TextField
              className={classes.input}
              id="base_currency"
              label="base currency"
              name="base_currency"
              margin="dense"
              value={this.state.base_currency}
              onChange={this.onChangeCaps}
              />

            <TextField
              className={classes.input}
              id="activity_date"
              name="activity_date"
              label="date"
              type="date"
              onChange={this.onChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <FormControl>
            <InputLabel htmlFor="type">type</InputLabel>
            <Select
              className={classes.select}
              value={this.state.type}
              onChange={this.onChangeSelectType}
              inputProps={{
                name: 'type',
                id: 'type'
              }}
            >
              {this.state.allTypes.map((type) => {
                return (
                  <MenuItem value={type} key={type}>
                    {type}
                  </MenuItem>
                )
              })}
            </Select>
            </FormControl>

            <TextField
              className={classes.input}
              id="price"
              label="price"
              name="price"
              margin="dense"
              value={this.state.price}
              onChange={this.onChangePrice}
              />
            <TextField
              className={classes.input}
              id="quantity"
              label="quantity"
              name="quantity"
              margin="dense"
              value={this.state.quantity}
              onChange={this.onChangeQuantity}
              />
            <TextField
              className={classes.input}
              id="fees"
              label="fees"
              name="fees"
              margin="dense"
              value={this.state.fees}
              onChange={this.onChangeFees}
              />
            <TextField
              className={classes.input}
              id="net_proceeds"
              label="net proceeds"
              name="net_proceeds"
              margin="dense"
              value={this.state.net_proceeds}
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
