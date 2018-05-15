import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { loggedIn } from '../actions/auth';
import { logoutUser } from '../actions/logout';

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    const jwt = localStorage.getItem("jwt");
    if (!!jwt) {
      this.props.loggedIn(true);
    }
  }

  onClick(e) {
    localStorage.removeItem('jwt');
    this.props.logoutUser();
  }

  render() {
    return (

      <div>

          <NavLink to="/" exact={true}>Dashboard</NavLink>
          {this.props.auth && <button onClick={this.onClick}>Logout</button>}
          {this.props.auth && <NavLink to="/admin">Admin</NavLink>}
          {!this.props.auth && <NavLink to="/login">Login</NavLink>}
          {!this.props.auth && <NavLink to="/register">Sign up</NavLink>}

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

export default connect(mapStateToProps, { loggedIn, logoutUser })(Navbar);
