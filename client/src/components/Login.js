import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { loginUser } from '../actions/login';

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
      Login
      <form onSubmit={this.onSubmit}>
        <div>
          <label>Email: </label><br />
          <input type="text" name="email" onChange={this.onChange} value={this.state.email} />
        </div>
        <br />
        <div>
          <label>Password: </label><br />
          <input type="password" name="password" onChange={this.onChange} value={this.state.password} />
        </div>
        <br />
        <button type="submit">Submit</button>
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
