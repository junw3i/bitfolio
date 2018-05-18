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
      return (
        <TableRow key={asset.ticker} hover={true}>
          <TableCell padding="dense" component="th" scope="row">
            {asset.ticker}
          </TableCell>

          <TableCell padding="dense" numeric>{asset.amount}</TableCell>

          <TableCell padding="dense" numeric>{asset.avg_cost}</TableCell>

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
