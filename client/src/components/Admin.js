import React, { Component } from 'react';
import { Redirect } from 'react-router';

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
});

class Admin extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onChangeSelect = this.onChangeSelect.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      ticker: '',
      source: 'binance',
      formSubmitted: false
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
                <em>binance</em>
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
          <form onSubmit={this.onSubmit}>
            <Typography variant="headline" component="p">
              Add Portfolio Data
            </Typography>
          </form>
        </Paper>
      </div>
    );
  }

}

export default withStyles(styles)(Admin);
