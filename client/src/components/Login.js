import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { loginUser } from '../actions/login';

import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
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
    this.props.loginUser(creds);
  }

  render() {

    const jwt = localStorage.getItem("jwt");
    if (!!jwt) {
      return <Redirect to="/" />
    }

    return (
      <div>
        <Typography variant="headline" component="p">
          Login
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
        <Button className="admin-button" type="submit">
          Submit
        </Button>

      </form>
      </div>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { loginUser })(Login);
