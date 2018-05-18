import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import moment from 'moment';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    width: '100%',
  },
  date : {
    paddingLeft: 12,
    paddingRight: 12
  }
});

class RecentTrades extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trades: []
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
    fetch('/api/portfolio/activity', config)
    .then((response) => response.json())
    .then((data) => {
      this.setState({
        trades: data,
      });
    })
    .catch(error => console.log("error from fetch", error))
  }

  render() {
    const { classes } = this.props;
    const tradeLines = this.state.trades.map((trade) => {
      if (trade.type === "BUY") {
        return (
          <TableRow key={trade.id} hover={true}>
            <TableCell padding="dense" component="th" scope="row">
              {trade.ticker}
            </TableCell>
            <TableCell padding="dense"
              className={classes.date} numeric>{moment(trade.activity_date).add((moment().utcOffset()), 'm').format("DD-MMM HH:mm")}</TableCell>
            <TableCell className="green" padding="dense" numeric>{trade.type}</TableCell>
            <TableCell padding="dense" numeric>{trade.quantity}</TableCell>
            <TableCell padding="dense" numeric>{trade.price}</TableCell>
            <TableCell padding="dense" numeric>{trade.net_proceeds}</TableCell>
          </TableRow>
        )
      } else if (trade.type === "SELL") {
        return (
          <TableRow key={trade.id} hover={true}>
            <TableCell padding="dense" component="th" scope="row">
              {trade.ticker}
            </TableCell>
            <TableCell padding="dense"
              className={classes.date} numeric>{moment(trade.activity_date).add((moment().utcOffset()), 'm').format("DD-MMM HH:mm")}</TableCell>
            <TableCell className="red" padding="dense" numeric>{trade.type}</TableCell>
            <TableCell padding="dense" numeric>{trade.quantity}</TableCell>
            <TableCell padding="dense" numeric>{trade.price}</TableCell>
            <TableCell padding="dense" numeric>{trade.net_proceeds}</TableCell>
          </TableRow>
        )
      } else {
        return (
          <TableRow key={trade.id} hover={true}>
            <TableCell padding="dense" component="th" scope="row">
              {trade.ticker}
            </TableCell>
            <TableCell padding="dense" className={classes.date} numeric>{moment(trade.activity_date).add((moment().utcOffset()), 'm').format("DD-MMM HH:mm")}</TableCell>
            <TableCell padding="dense" numeric>{trade.type}</TableCell>
            <TableCell padding="dense" numeric>{trade.quantity}</TableCell>
            <TableCell padding="dense" numeric>{trade.price}</TableCell>
            <TableCell padding="dense" numeric>{trade.net_proceeds}</TableCell>
          </TableRow>
        )
      }
    });
    return (
      <div>
        Last 10 Activities
        <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell padding="dense">Ticker</TableCell>
            <TableCell padding="dense"
              className={classes.date}
              numeric>Trade Date</TableCell>
            <TableCell padding="dense" numeric>Type</TableCell>
            <TableCell padding="dense" numeric>Quantity</TableCell>
            <TableCell padding="dense" numeric>Price</TableCell>
            <TableCell padding="dense" numeric>Proceeds</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tradeLines}
        </TableBody>
      </Table>
      </div>
    );
  }

}

export default withStyles(styles)(RecentTrades);
