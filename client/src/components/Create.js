import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createUser } from '../actions/create';

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
    let errorMessage;
    if (this.state.errorMessage !== '') {
      errorMessage = this.state.errorMessage;
    }
    return (
      <div>
      Register
      <form onSubmit={this.onSubmit}>
        <div>
          <label>Email: </label><br />
          <input type="text" name="email" onChange={this.onChange} value={this.state.email} />
        </div>
        <br />
        {errorMessage}
        <div>
          <label>Password: </label><br />
          <input type="password" name="password" onChange={this.onChange} value={this.state.password} />
        </div>
        <div>
          <label>Confirm Password: </label><br />
          <input type="password" name="confirmPassword" onChange={this.onChange} value={this.state.confirmPassword} />
        </div>
        <br />
        <button type="submit">Submit</button>
      </form>
      </div>
    );
  }
}

Create.propTypes = {
  createUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  token: state.token
});

export default connect(mapStateToProps, { createUser })(Create);
