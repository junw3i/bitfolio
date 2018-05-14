import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { loggedIn } from '../actions/auth';

class Navbar extends Component {
  constructor(props) {
    super(props);
    const jwt = localStorage.getItem("jwt");
    if (!!jwt) {
      this.props.loggedIn(true);
    }
  }

  render() {
    return (
      <div>
        <NavLink to="/" exact={true}>Dashboard</NavLink>
        {this.props.auth && <p>logout</p>}
        {!this.props.auth && <NavLink to="/login">Login</NavLink>}
        {!this.props.auth && <NavLink to="/register">Sign up</NavLink>}
        this is the nav bar.
      </div>
    );
  }
}

Navbar.propTypes = {
  loggedIn: PropTypes.func.isRequired,
  auth: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { loggedIn })(Navbar);
