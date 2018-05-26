import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { createUser } from '../actions/create';

import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      confirmPassword: '',
      errorMessage: null
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  onChange(e) {
      this.setState({
        [e.target.name]: e.target.value
      })
  }
  onSubmit(e) {
    e.preventDefault();
    const creds = {
      email: this.state.email.trim(), password: this.state.password.trim()
    };
    if (this.state.password === null) {
      this.setState({ errorMessage: 'password cannot be empty'});
    } else if (this.state.password === this.state.confirmPassword) {
      this.setState({ errorMessage: null});
      this.props.createUser(creds);
    } else {
      this.setState({ errorMessage: 'Password do not match'});
    }
  }

  render() {
    const jwt = localStorage.getItem("jwt");
    if (!!jwt) {
      return <Redirect to="/" />
    }

    let errorMessage;
    if (this.state.errorMessage !== '') {
      errorMessage = this.state.errorMessage;
    }
    return (
      <div>
        <Typography variant="headline" component="p">
          Register
        </Typography>
      <form onSubmit={this.onSubmit}>
        <TextField
          id="email"
          label="email"
          name="email"
          margin="normal"
          type="email"
          value={this.state.email}
          onChange={this.onChange}
        />
        <br />
        <p>{errorMessage}</p>
        <TextField
          id="password"
          label="password"
          name="password"
          margin="normal"
          type="password"
          value={this.state.password}
          onChange={this.onChange}
        />
        <br />
        <TextField
          id="confirmPassword"
          label="confirm password"
          name="confirmPassword"
          margin="normal"
          type="password"
          value={this.state.confirmPassword}
          onChange={this.onChange}
        />
        <br />
        <Button className="admin-button" type="submit">
          Submit
        </Button>
      </form>
      </div>
    );
  }
}

Create.propTypes = {
  createUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  token: state.token,
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { createUser })(Create);
