import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory, Link } from 'react-router';
import { loginUser } from '../../actions/user_actions';

class UserLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailError: '',
      passwordError: '',
      showErrors: false,
    };
  }

  
  componentDidUpdate() {
    if (this.props.authenticated) {
      browserHistory.push('/timeline');
    }
  }

  onFormSubmit(event) {
    event.preventDefault();
    if (this.validForm()) {
      const email = this.email.value;
      const password = this.password.value;
      this.props.loginUser({ email, password });
    }
  }

  handleUserEmail(e) {
    const pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    const email = this.email.value;
    const result = email.match(pattern);
    this.setState({ showErrors: false });

    if (email.length === 0) {
      this.setState({ emailError: 'Email debe estar presente' });
    } else if (email.length < 5) {
      this.setState({ emailError: 'Email Invalido, demasiado corto' });
    } else if (result === null) {
      this.setState({ emailError: 'Formato de Email invalido, por favor verifique' });
    } else {
      this.setState({ emailError: '' });
    }
  }

  handleUserPassword(e) {
    const password = this.password.value;
    this.setState({ showErrors: false });

    if (password.length === 0) {
      this.setState({ passwordError: 'Password debe estar presente' });
    } else if (password.length < 5) {
      this.setState({ passwordError: 'Password Invalida, demasiado corta' });
    } else {
      this.setState({ passwordError: '' });
    }
  }

  validForm() {
    if (this.state.emailError === '' && this.state.passwordError === '') {
      return true;
    }

    this.setState({ showErrors: true });
    return false;
  }

  textErrors(input) {
    const section = [];
    if (this.state.showErrors) {
      section.push(
        <p className="inline-error"> { this.state[input] }</p>
      );
    }

    return section;
  }

  registerLink() {
    const section = [];
    if (this.props.allowRegister) {
      section.push(
        <Link to="/register"> Reigstrar Usuario </Link>
      );
    }

    return section;
  }

  firebaseErrors() {
    const section = [];
    if (this.props.error !== '') {
      section.push(
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <button type="button" className="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          { this.props.error }
        </div>
      );
    }

    return section;
  }

  render() {
    return (
      <div className="col-md-6 offset-md-3">
        <form id="frmLogin" className="authentication" role="form" onSubmit={e => this.onFormSubmit(e)}>
          <h2> Iniciar Sesion </h2>
          { this.firebaseErrors() }
          <div className="form-group">
            <label htmlFor="txtEmail">Email: </label>
            <input
              type="email"
              className="form-control"
              id="txtEmail"
              ref={(email) => { this.email = email; }}
              onChange={e => this.handleUserEmail(e)}
              placeholder="Enter email"
              name="email"
            />
            { this.textErrors('emailError') }
          </div>
          <div className="form-group">
            <label htmlFor="txtPassword">Password: </label>
            <input
              type="password"
              className="form-control"
              id="txtPassword"
              ref={(password) => { this.password = password; }}
              onChange={e => this.handleUserPassword(e)}
              placeholder="Password"
              name="password"
            />
            { this.textErrors('passwordError') }
          </div>
          <button type="submit" className="btn btn-primary btn-block">
            Login
          </button>
          <br />
          { this.registerLink() }
        </form>
      </div>
    );
  }
}

UserLogin.propTypes = {
  loginUser: PropTypes.func.isRequired,
  authenticated: PropTypes.bool.isRequired,
  allowRegister: PropTypes.bool.isRequired,
  error: PropTypes.string,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      loginUser,
    },
    dispatch
  );
}

function mapStateToProps(state) {
  return {
    currentUser: state.userStore.currentUser,
    authenticated: state.userStore.authenticated,
    error: state.userStore.error,
    allowRegister: state.userStore.allowRegister,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserLogin);
