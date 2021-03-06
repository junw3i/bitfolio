import React, { Component } from 'react';
import { removeTicker } from '../actions/market';
import { connect } from 'react-redux';

import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  title: {
    paddingLeft: 3,
    paddingTop: 3
  }
};

class Binance extends Component {
  constructor(props) {
    super(props);
    this.handleRemove = this.handleRemove.bind(this);
    this.state = { price: '' };
  }

  componentDidMount(){
    let wsEndPoint = 'wss://stream.binance.com:9443/ws/' + this.props.tickData.ticker.toLowerCase() + '@aggTrade'
    this.connection = new WebSocket(wsEndPoint);
    this.connection.onmessage = evt => {
      // add the new message to state
      let tickData = JSON.parse(evt.data);
      let price = parseFloat(tickData.p)
      if (price / 10 > 1) {
        price = price.toFixed(2);
      } else {
        price = price.toFixed(4);
      }
      this.setState({ price })
    };
  }

  componentWillUnmount() {
    this.connection.close();
  }

  handleRemove(e) {
    this.connection.close();
    const data = {
      id: this.props.tickData.id
    };
    let config = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    };
    fetch('/api/removeTicker', config)
    .then(() => {
      console.log("ticker removed in db");
    });
    this.props.removeTicker(this.props.tickers, this.props.tickData);

  }



  render() {
    const { classes } = this.props;
    return (
      <Card className="card">
        <Typography className={classes.title} variant="caption" align="left">
          {this.props.tickData.ticker}
        </Typography>
        <Typography variant="title" align="center" className="price">
          {this.state.price}
        </Typography>

        <Button className="button" size="small" onClick={this.handleRemove}><Typography className="button-text" variant="caption">
          Remove
        </Typography></Button>

      </Card>
    )
  }
}

const mapStateToProps = state => ({
  tickers: state.market.tickers
});

export default connect(mapStateToProps, { removeTicker })(withStyles(styles)(Binance));
