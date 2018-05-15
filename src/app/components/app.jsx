import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser, logoutFirebaseUser, registerStatus } from '../actions/user_actions';

class App extends Component {
  componentWillMount() {
    this.props.fetchUser();
    this.props.registerStatus();
  }

  handleLogOut() {
    this.props.logoutFirebaseUser();
    browserHistory.push('/');
  }

  buildNavigation() {
    const section = [];
    if (this.props.authenticated) {
      section.push(
        <div className="collapse navbar-collapse" id="navbarColor02">
          <ul className="navbar-nav mr-auto">
            <li className={`nav-item ${this.checkItemActive('/timeline')}`}>
              <Link to="/timeline" className="nav-link">Inicio</Link>
            </li>
            <li className={`nav-item ${this.checkItemActive('/profile')}`}>
              <Link to="/profile" className="nav-link">Perfil</Link>
            </li>
          </ul>
          <span className="navbar-text welcome">
            {`Hola, ${this.props.currentUser.email}`}
          </span>
          <button
            className="btn btn-secondary my-2 my-sm-0"
            type="button"
            onClick={() => this.handleLogOut()}
          >
            Logout
          </button>
        </div>
      );
    }

    return section;
  }

  checkItemActive(path) {
    return (path === this.props.location.pathname) ? 'active' : '';
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <a className="navbar-brand" href="#">React Challenge</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor02" aria-controls="navbarColor02" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          { this.buildNavigation() }
        </nav>
        <div className="container">
         {this.props.children}
        </div>
      </div>
    );
  }
}

App.propTypes = {
  location: PropTypes.shape({ pathname: PropTypes.string }).isRequired,
  currentUser: PropTypes.shape({ email: PropTypes.string }).isRequired,
  authenticated: PropTypes.bool.isRequired,
  children: PropTypes.shape({}).isRequired,
  fetchUser: PropTypes.func.isRequired,
  registerStatus: PropTypes.func.isRequired,
  logoutFirebaseUser: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchUser,
      logoutFirebaseUser,
      registerStatus,
    },
    dispatch
  );
}

function mapStateToProps(state) {
  return {
    currentUser: state.userStore.currentUser,
    authenticated: state.userStore.authenticated,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
