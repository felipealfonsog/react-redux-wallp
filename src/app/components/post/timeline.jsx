/* globals alert */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import Card from './card';

import {
  updateUser,
  fetchUser,
  savePost,
  fetchPosts,
  deletePost,
  updateFilterBy,
} from '../../actions/user_actions';


class PostTimeline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textError: 'Texto no puede estar vacio',
      showErrors: false,
      selectValue: 'friends',
      textValue: '',
    };

    this.props.fetchUser();
    const type = this.props.filterBy;
    const uid = this.props.currentUser.uid;
    this.props.fetchPosts(type, uid);
  }

  componentWillMount() {
    if (!this.props.authenticated) {
      browserHistory.push('/');
    }
  }

  onFormSubmit() {
    if (this.validForm()) {
      const text = this.state.textValue;
      const type = this.state.selectValue;
      const uid = this.props.currentUser.uid;
      const post = { text, image: '' };

      this.props.savePost(type, uid, post);
      this.setState({ selectValue: 'friends' });
      this.setState({ textValue: '', textError: 'Texto no puede estar vacio' });

      // Defer fetch:
      setTimeout(() => {
        this.props.updateFilterBy(type);
        this.props.fetchPosts(type, uid);
      }, 1550);
    }
  }

  getFilterClasses(type) {
    return (this.props.filterBy === type) ? 'card-link disabled' : 'card-link';
  }

  toggleFilter(type) {
    const uid = this.props.currentUser.uid;
    this.props.updateFilterBy(type);
    this.props.fetchPosts(type, uid);
  }

  buildPosts() {
    const section = [];
    const posts = this.props.posts === null ? [] : this.props.posts;

    Object.keys(posts).reverse().forEach((key) => {
      const current = posts[key];
      
      section.push(
        <Card post={current} id={key} />
      );
    });

    return section;
  }

  // To component ->
  selectionBar() {
    const section = [];
    section.push(
      <div className="col-md-8 offset-md-2">
        <div className="card profile selection-bar">
          <div className="card-body">
            <a
              href="#"
              onClick={() => this.toggleFilter('publics')}
              className={this.getFilterClasses('publics')}
            >
              Publico
            </a>
            <a
              href="#"
              onClick={() => this.toggleFilter('friends')}
              className={this.getFilterClasses('friends')}
            >
              Amigos
            </a>
          </div>
        </div>
      </div>
    );

    return section;
  }

  validForm() {
    if (this.state.textError === '') {
      return true;
    }

    this.setState({ showErrors: true });
    return false;
  }

  handleText(e) {
    const text = e.target.value;
    this.setState({ textValue: text });
    this.setState({ showErrors: false });

    if (text.length < 1) {
      this.setState({ textError: 'Texto no puede estar vacio' });
    } else if (!text.replace(/\s/g, '').length) {
      this.setState({ textError: 'Debe colocar algo mas que espacios vacios' });
    } else {
      this.setState({ textError: '' });
    }
  }

  handleSelect(event) {
    this.setState({ selectValue: event.target.value });
  }

  textErrors() {
    const section = [];
    if (this.state.showErrors) {
      section.push(
        <p className="post-error"> { this.state.textError }</p>
      );
    }

    return section;
  }

  render() {
    return (
      <div className="timeline">
        <div className="col-md-8 offset-md-2">
          <div className="card profile form">
            <form>
              <div className="form-group">
                <label className="form-title">¿Como te sientes hoy?</label>
                { this.textErrors() }
                <textarea
                  className="form-control"
                  id="txtPost"
                  rows="3"
                  value={this.state.textValue}
                  onChange={e => this.handleText(e)}
                  placeholder="¡Cuentale a tus amigos que esta pasando!"
                />
              </div>
            </form>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4 offset-md-6">
                  <select
                    className="form-control"
                    value={this.state.selectValue} onChange={e => this.handleSelect(e)}
                  >
                    <option value="friends"> Amigos </option>
                    <option value="publics"> Publico </option>
                  </select>
                </div>
                <div className="col-md-2">
                  <button
                    className="btn btn-primary my-2 my-sm-0 btn-block"
                    type="button"
                    onClick={() => this.onFormSubmit()}
                  >
                    Publicar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        { this.selectionBar() }
        { this.buildPosts() }
      </div>
    );
  }
}

PostTimeline.defaultProps = {
  posts: [],
};

PostTimeline.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  fetchUser: PropTypes.func.isRequired,
  fetchPosts: PropTypes.func.isRequired,
  updateFilterBy: PropTypes.func.isRequired,
  savePost: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({ uid: PropTypes.string }).isRequired,
  posts: PropTypes.shape({}),
  filterBy: PropTypes.string.isRequired,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      updateUser,
      fetchUser,
      savePost,
      fetchPosts,
      deletePost,
      updateFilterBy,
    },
    dispatch
  );
}

function mapStateToProps(state) {
  return {
    currentUser: state.userStore.currentUser,
    authenticated: state.userStore.authenticated,
    error: state.userStore.error,
    posts: state.userStore.posts,
    filterBy: state.userStore.filterBy,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PostTimeline);
