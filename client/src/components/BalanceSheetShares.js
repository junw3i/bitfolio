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

class BalanceSheetShares extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balances: []
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
            console.log(total);
            this.setState({
              balances: temp_balance
            })
          })
        }
      })
    }, 4000)
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
      })
    })
    .catch(error => console.log("error from fetch", error))
  }

  render() {
    const { classes } = this.props;
    let temp = this.state.balances
    const balanceLines = temp.map((asset) => {
      console.log(asset);
      let avg_cost = null;
      let amount = null;
      let mv = null;
      if (asset.avg_cost) {
        avg_cost = asset.avg_cost.toLocaleString('en-US', {minimumFractionDigits: 2})
      }
      if (asset.amount) {
        amount = asset.amount.toLocaleString('en-US', {minimumFractionDigits: 2})
      }
      if (asset.mv) {
        mv = parseFloat(asset.mv).toLocaleString('en-US', {minimumFractionDigits: 0})

      }
      return (
        <TableRow key={asset.ticker} hover={true}>
          <TableCell padding="dense" component="th" scope="row">
            {asset.ticker}
          </TableCell>

          <TableCell padding="dense" numeric>{amount}</TableCell>
          <TableCell padding="dense" numeric>{avg_cost}</TableCell>
          <TableCell padding="dense" numeric></TableCell>
          <TableCell padding="dense" numeric>{asset.market_price}</TableCell>
          <TableCell padding="dense" numeric>{mv}</TableCell>

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
            <TableCell padding="dense" numeric>Cost Price</TableCell>
            <TableCell padding="dense" numeric>Total Cost </TableCell>
            <TableCell padding="dense" numeric>Market Price</TableCell>
            <TableCell padding="dense" numeric>MV</TableCell>
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

export default withStyles(styles)(BalanceSheetShares);
