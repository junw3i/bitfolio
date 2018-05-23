import React, { Component } from 'react';

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
  },
  table: {


  },
});

class BalanceSheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balances: []
    };
    setTimeout(() => {
      // crypto
      if (this.props.asset_type == 'cryptocurrencies') {
        this.state.balances.forEach((tick, index) => {
          if (tick.market_price === null) {
            console.log(index, tick);
            fetch('/api/price/crypto/' + tick.ticker)
            .then(response => response.json())
            .then(data => {
              console.log(data);
              this.state.balances[index].market_price = data;
            })
          }
        })
      }
    }, 5000)
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
    })
    .catch(error => console.log("error from fetch", error))
  }

  render() {
    const { classes } = this.props;
    const balanceLines = this.state.balances.map((asset) => {
      let avg_cost = null;
      let amount = null;
      if (asset.avg_cost) {
        avg_cost = asset.avg_cost.toLocaleString('en-US', {minimumFractionDigits: 2})
      }
      if (asset.amount) {
        amount = asset.amount.toLocaleString('en-US', {minimumFractionDigits: 2})
      }
      return (
        <TableRow key={asset.ticker} hover={true}>
          <TableCell padding="dense" component="th" scope="row">
            {asset.ticker}
          </TableCell>

          <TableCell padding="dense" numeric>{amount}</TableCell>
          <TableCell padding="dense" numeric>{avg_cost}</TableCell>
          <TableCell padding="dense" numeric>{asset.market_price}</TableCell>
          <TableCell padding="dense" numeric>{asset.mv}</TableCell>
          <TableCell padding="dense" numeric>{asset.mv_percent}</TableCell>

        </TableRow>
      )
    });
    return (
      <div>
        Balance Sheet

        <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell padding="dense">Ticker</TableCell>
            <TableCell padding="dense"
              numeric>Quantity</TableCell>
            <TableCell padding="dense" numeric>Avg Cost Price</TableCell>
            <TableCell padding="dense" numeric>Market Price</TableCell>
            <TableCell padding="dense" numeric>MV</TableCell>
            <TableCell padding="dense" numeric>%</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {balanceLines}
        </TableBody>
      </Table>
      </div>
    );
  }
}

export default withStyles(styles)(BalanceSheet);
