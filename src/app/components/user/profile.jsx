/* globals alert */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import { updateUser, fetchUser } from '../../actions/user_actions';

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.props.fetchUser();
  }

  componentWillMount() {
    if (!this.props.authenticated) {
      browserHistory.push('/');
    }
  }

  render() {
    return (
      <div className="col-md-8 offset-md-2">
        <div className="card profile">
          <img
            className="card-img-top"
            src="http://tri-cell.com/wp-content/uploads/2016/05/mobius-placeholder-2.png"
            alt="Card image cap"
            height="200px"
          />
          <div className="card-body">
            <h5 className="card-title">Perfil de Usuario</h5>
            <p className="card-text">Aca puede ver su informacion, modificar, y eliminar su cuenta. </p>
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">{ this.props.currentUser.email }</li>
            <li className="list-group-item">{ '***********' } </li>
            <li className="list-group-item"> 20 / 04 / 18 </li>
          </ul>
          <div className="card-body">
            <a href="#" onClick={() => alert('En desarrollo')} className="card-link"> Cambiar Contraseña </a>
            <a href="#" onClick={() => alert('En desarrollo')} className="card-link danger"> Eliminar Cuenta </a>
          </div>
        </div>
      </div>
    );
  }
}

UserProfile.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  currentUser: PropTypes.shape({ email: PropTypes.string }),
  fetchUser: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ updateUser, fetchUser }, dispatch);
}

function mapStateToProps(state) {
  return {
    currentUser: state.userStore.currentUser,
    authenticated: state.userStore.authenticated,
    error: state.userStore.error,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);