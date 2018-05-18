import React, { Component } from 'react';

import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import moment from 'moment';

const styles = {
  title: {
    paddingLeft: 3,
    paddingTop: 3,
    fontSize: '0.6rem'
  }
};


class Benchmark extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: null,
      returns: 0,
      price: null
    }
  }

  componentDidMount(){
    fetch('/api/benchmark/daily/' + this.props.tick)
    .then((response) => response.json())
    .then((data) => {
      data = JSON.parse(data.payload);
      this.setState({
        date: data.utc_datetime,
        price: data.price,
        returns: (data.returns * 100).toFixed(2),
      });
    })
  }


  render() {
    let date = moment(this.state.date);
    date = date.add(-1, 'day');
    const { classes } = this.props;

    if (this.state.returns > 0) {
      return (
        <Card className="card-benchmark">
          <Typography className={classes.title} variant="caption" align="left">
            {date.format("YYYY-MM-DD")}
          </Typography>
          <div className="returns-green">
            {this.state.returns}%
          </div>
          <div className="bottom-flex">
            <Typography className="benchmark-tick" variant="caption">
              {this.state.price}
            </Typography>
            <Typography className="benchmark-tick" variant="caption">
              {this.props.tick}
            </Typography>
          </div>
        </Card>
      )
    } else if (this.state.returns < 0) {
      return (
        <Card className="card-benchmark">
          <Typography className={classes.title} variant="caption" align="left">
            {date.format("YYYY-MM-DD")}
          </Typography>
          <div className="returns-red">
            {this.state.returns}%
          </div>
          <div className="bottom-flex">
            <Typography className="benchmark-tick" variant="caption">
              {this.state.price}
            </Typography>
            <Typography className="benchmark-tick" variant="caption">
              {this.props.tick}
            </Typography>
          </div>
        </Card>
      )
    } else {
      return (
        <Card className="card-benchmark">
          <Typography className={classes.title} variant="caption" align="left">
            {date.format("YYYY-MM-DD")}
          </Typography>
          <div className="returns-black">
            {this.state.returns}%
          </div>
          <div className="bottom-flex">
            <Typography className="benchmark-tick" variant="caption">
              {this.state.price}
            </Typography>
            <Typography className="benchmark-tick" variant="caption">
              {this.props.tick}
            </Typography>
          </div>
        </Card>
      )
    }

  }
}

export default withStyles(styles)(Benchmark);
