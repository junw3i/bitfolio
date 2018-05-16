import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { loggedIn } from '../actions/auth';
import { logoutUser } from '../actions/logout';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.onLogout = this.onLogout.bind(this);
    const jwt = localStorage.getItem("jwt");
    if (!!jwt) {
      this.props.loggedIn(true);
    }
  }

  onLogout(e) {
    localStorage.removeItem('jwt');
    this.props.logoutUser();
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar className="navbar" position="static" color="inherit">
          <Toolbar className="toolbar">

            <NavLink to="/" exact={true}>
              <Button color="inherit">Dashboard</Button>
            </NavLink>

            {this.props.auth && <NavLink to="/admin"><Button color="inherit">Control Panel</Button></NavLink>}
            {this.props.auth && <Button color="inherit" onClick={this.onLogout}>Sign Out</Button>}
            {!this.props.auth && <NavLink to="/register"><Button color="inherit">Sign up</Button></NavLink>}
            {!this.props.auth && <NavLink to="/login"><Button color="inherit">Login</Button></NavLink>}
          </Toolbar>
        </AppBar>
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

export default connect(mapStateToProps, { loggedIn, logoutUser })(withStyles(styles)(Navbar));
