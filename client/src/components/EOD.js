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


class EOD extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: null,
      returns: 0,
      nav: 0
    }
  }

  componentDidMount(){
    const data = {
      portfolio_id: this.props.portfolio.id,
      token: localStorage.getItem("jwt")
    };
    let config = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    };
    fetch('/api/portfolio/eodnav', config)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      this.setState({
        date: data.datetime_utc,
        nav: data.nav,
        returns: (data.returns * 100).toFixed(2),
      });
    })
    .catch(error => console.log("error from fetch", error))
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
              {this.state.nav}
            </Typography>
            <Typography className="benchmark-tick" variant="caption">
              {this.props.portfolio.portfolio_name}
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
              {this.state.nav}
            </Typography>
            <Typography className="benchmark-tick" variant="caption">
              {this.props.portfolio.portfolio_name}
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
              {this.state.nav}
            </Typography>
            <Typography className="benchmark-tick" variant="caption">
              {this.props.portfolio.portfolio_name}
            </Typography>
          </div>
        </Card>
      )
    }

  }
}

export default withStyles(styles)(EOD);
