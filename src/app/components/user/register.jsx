import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { registerUser, registerStatus } from '../../actions/user_actions';

class UserRegister extends Component {
  componentWillMount() {
    if (!this.props.allowRegister) {
      browserHistory.push('/');
    }
  }

  componentDidUpdate() {
    if (this.props.authenticated) {
      browserHistory.push('/timeline');
    }
  }

  
  onFormSubmit(event) {
    event.preventDefault();
    const email = this.email.value;
    const password = this.password.value;
    this.props.registerUser({ email, password });
  }

  firebaseErrors() {
    const section = [];
    if (this.props.error !== '') {
      section.push(
        <p className="firebase-error"> { this.props.error } </p>
      );
    }

    return section;
  }

  render() {
    return (
      <div className="col-md-6 offset-md-3">
        <form id="frmRegister" className="authentication" role="form" onSubmit={e => this.onFormSubmit(e)}>
          <h2>Registrar Usuario</h2>
          { this.firebaseErrors() }
          <div className="form-group">
            <label htmlFor="txtRegEmail">Email: </label>
            <input
              type="email"
              className="form-control"
              ref={(email) => { this.email = email; }}
              id="txtEmail"
              placeholder="Enter email"
              name="email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="txtRegPass">Password: </label>
            <input
              type="password"
              className="form-control"
              ref={(password) => { this.password = password; }}
              id="txtPass"
              placeholder="Password"
              name="password"
            />
          </div>
          <button type="submit" className="btn btn-default btn-block">
            Registrar
          </button>
          <br />
          <Link to="/">Iniciar Sesion</Link>
        </form>
      </div>
    );
  }
}

UserRegister.propTypes = {
  registerUser: PropTypes.func.isRequired,
  authenticated: PropTypes.bool.isRequired,
  allowRegister: PropTypes.bool.isRequired,
  error: PropTypes.string,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      registerUser,
      registerStatus,
    },
    dispatch
  );
}

function mapStateToProps(state) {
  return {
    currentUser: state.userStore.currentUser,
    authenticated: state.userStore.authenticated,
    allowRegister: state.userStore.allowRegister,
    error: state.userStore.error,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserRegister);
