import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { updateBalanceSheet } from '../actions/balanceSheet';

import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  }
});

class BalanceSheetCrypto extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balances: [],
      custom: {},
      initial: {
        original_nav: 0,
        total_adjustments: 0
      },
      total: null
    };
    setTimeout(() => {
      // crypto
      let temp_balance = this.state.balances
      this.state.balances.forEach((tick, index) => {
        if (tick.market_price === null) {
          fetch('/api/price/crypto/' + tick.ticker)
          .then(response => response.json())
          .then(data => {
            temp_balance[index].market_price = data.payload;
            temp_balance[index].mv = (tick.amount * data.payload).toFixed(0);
            let total = 0;
            for (var i=0; i<temp_balance.length; i++) {
              total += temp_balance[i].mv ? parseFloat(temp_balance[i].mv) : 0;
            }
            this.setState({
              balances: temp_balance,
              total
            })
            this.props.updateBalanceSheet(temp_balance, this.props.portfolio_id);
          })
        }
      })
    }, 3000)
  }

  componentDidMount() {
    const data = {
      portfolio_id: this.props.portfolio_id,
      token: localStorage.getItem("jwt")
    };
    let config = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    };
    fetch('/api/portfolio/balance', config)
    .then((response) => response.json())
    .then((data) => {
      this.setState({
        balances: data,
      });
      this.props.updateBalanceSheet(data, this.props.portfolio_id);
    })
    .catch(error => console.log("error from fetch", error))

    fetch('/api/custom/data', config)
    .then((response) => response.json())
    .then((data) => {
      this.setState({
        custom: data,
      });
    })
    .catch(error => console.log("error from fetch custom", error))

    fetch('/api/custom/initial', config)
    .then((response) => response.json())
    .then((data) => {
      this.setState({
        initial: data,
      });
    })
    .catch(error => console.log("error from fetch custom initial", error))

  }


  render() {
    const { classes } = this.props;
    let asset_price, asset_amount, base_amount, lower_bound_price, upper_bound_price, profits, total, initial_gain;
    let temp = this.state.balances
    const balanceLines = temp.map((asset) => {

      if (asset.ticker === 'BNB') {
        asset_price = asset.market_price;
        asset_amount = asset.amount;


      } else if (asset.ticker === 'USDT' || asset.ticker === 'USD') {
        base_amount = asset.amount;
      }
      if (base_amount && asset_price && asset_amount) {
        let starting_price = this.state.custom.starting_price;
        let step = this.state.custom.step;
        let spread = this.state.custom.spread;
        let qty = this.state.custom.qty;
        lower_bound_price = asset_price;
        upper_bound_price = asset_price;
        // calculate bankrupt condition
        while (base_amount > 0) {
          let multiplyer = Math.max(Math.ceil((starting_price - lower_bound_price) / step), 1)
          lower_bound_price = (lower_bound_price * (1-spread)).toFixed(2)
          base_amount = base_amount - (lower_bound_price * qty * multiplyer)
        }
        // calculate exit condition
        while (asset_amount > 0) {
          let multiplyer = Math.max(Math.ceil((starting_price - upper_bound_price) / step), 1);
          upper_bound_price = (upper_bound_price * (1+parseFloat(spread))).toFixed(2)
          asset_amount = asset_amount - (qty * multiplyer)
        }
      }

      let amount = null;
      let mv = null;

      if (asset.amount) {
        amount = asset.amount.toLocaleString('en-US', {minimumFractionDigits: 2})
      }
      if (asset.mv) {
        mv = parseFloat(asset.mv).toLocaleString('en-US', {minimumFractionDigits: 0})
      }
      if (this.state.custom.profits) {
        profits = this.state.custom.profits.toLocaleString('en-US', {minimumFractionDigits: 2})
      }
      if (this.state.total) {
        total = this.state.total.toLocaleString('en-US', {minimumFractionDigits: 2})
        if (this.state.initial.original_nav > 0) {
          initial_gain = ((((this.state.total + this.state.initial.total_adjustments)/ this.state.initial.original_nav) - 1) * 100).toFixed(2)
        }
      }

      return (
        <TableRow key={asset.ticker} hover={true}>
          <TableCell padding="dense" component="th" scope="row">
            {asset.ticker}
          </TableCell>

          <TableCell padding="dense" numeric>{amount}</TableCell>
          <TableCell padding="dense" numeric>{asset.market_price}</TableCell>
          <TableCell padding="dense" numeric>{mv}</TableCell>

        </TableRow>
      )
    });
    return (
      <div className="bs-custom">
        <Paper className="paper-balancesheet-crypto" elevation={8}>
          Balance Sheet
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell padding="dense">Ticker</TableCell>
                <TableCell padding="dense"
                  numeric>Quantity</TableCell>
                <TableCell padding="dense" numeric>Market Price</TableCell>
                <TableCell padding="dense" numeric>MV</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {balanceLines}
            </TableBody>
          </Table>
        </Paper>

        <Paper className="paper-custom" elevation={8}>
          Metrics
          <Table className={classes.table}>

            <TableBody>
              <TableRow key="profits" hover={true}>
                <TableCell padding="dense" component="th" scope="row">
                  PnL
                </TableCell>

                <TableCell padding="dense" numeric>{profits.toFixed(2)}</TableCell>
              </TableRow>

              <TableRow key="lower" hover={true}>
                <TableCell padding="dense" component="th" scope="row">
                  Lower Bound
                </TableCell>
                <TableCell padding="dense" numeric>{lower_bound_price}</TableCell>
              </TableRow>

              <TableRow key="upper" hover={true}>
                <TableCell padding="dense" component="th" scope="row">
                  Upper Bound
                </TableCell>
                <TableCell padding="dense" numeric>{upper_bound_price}</TableCell>
              </TableRow>

              <TableRow key="upper" hover={true}>
                <TableCell padding="dense" component="th" scope="row">
                  NAV
                </TableCell>
                <TableCell padding="dense" numeric>{total}</TableCell>
              </TableRow>

              <TableRow key="upper" hover={true}>
                <TableCell padding="dense" component="th" scope="row">
                  Gain Since Inception
                </TableCell>
                <TableCell padding="dense" className={initial_gain>0 ? "green" : "red"} numeric>{initial_gain}%</TableCell>
              </TableRow>

            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  }
}

BalanceSheetCrypto.propTypes = {
  updateBalanceSheet: PropTypes.func.isRequired,
};


const mapStateToProps = state => ({
  portfolios: state.portfolio.portfolios
});

export default connect(mapStateToProps, { updateBalanceSheet })(withStyles(styles)(BalanceSheetCrypto));
