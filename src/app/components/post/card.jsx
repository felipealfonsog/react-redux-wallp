/* globals alert */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  fetchPosts,
  deletePost,
  updatePendingKey,
  updatePost,
} from '../../actions/user_actions';

class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      textValue: '',
    };
  }

  getActionClasses(key) {
    return (this.props.pendingKey === key) ? 'card-link disabled' : 'card-link';
  }

  getTextClasses(key) {
    return (this.props.pendingKey === key) ? 'editing form-control disabled' : 'editing form-control';
  }

  handleDelete(key) {
    this.props.updatePendingKey(key);
    const type = this.props.filterBy;
    const uid = this.props.currentUser.uid;
    this.props.deletePost(type, uid, key);

    // Defer fetch:
    setTimeout(() => {
      this.props.fetchPosts(type, uid);
    }, 1000);
  }

  handleUpdate(key) {
    this.props.updatePendingKey(key);
    const type = this.props.filterBy;
    const uid = this.props.currentUser.uid;
    const post = { text: this.state.textValue, img: '' };
    this.props.updatePost(type, uid, key, post);

    // Defer fetch:
    setTimeout(() => {
      this.props.fetchPosts(type, uid);
      this.props.updatePendingKey('');
      this.setState({ editMode: false });
    }, 500);
  }

  fireEditMode() {
    const text = this.props.post.text;
    this.setState({ textValue: text, editMode: true });
  }

  buildCard() {
    const post = this.props.post;
    const key = this.props.id;

    const section = [];
    if (this.state.editMode) {
      section.push(
        <textarea
          className={this.getTextClasses(key)}
          rows="3"
          value={this.state.textValue}
          onChange={e => this.handleText(e)}
        />);
    } else {
      section.push(<p className="published"> { post.text } </p>);
    }

    return section;
  }

  handleText(e) {
    const text = e.target.value;
    this.setState({ textValue: text });
  }

  actionButtons() {
    const section = [];
    const key = this.props.id;

    if (!this.state.editMode) {
      section.push(
        <a 
          href="#"
          onClick={() => this.fireEditMode()}
          className={this.getActionClasses(key)}
        >
          Editar
        </a>
      );

      section.push(
        <a
          href="#"
          onClick={() => this.handleDelete(key)}
          className={this.getActionClasses(key) + ' danger'}
        >
          Eliminar
        </a>
      );
    } else {
      section.push(
        <a 
          href="#"
          onClick={() => this.handleUpdate(key)}
          className={this.getActionClasses(key)}
        >
          Guardar
        </a>
      );
    }

    return section;
  }

  render() {
    
    return (
      <div className="col-md-8 offset-md-2">
        <div className="card profile post">
          <div>
            { this.buildCard() }
          </div>
          <hr />
          <div className="row">
            <div className="col-md-6 ">
              <div className="actions">
                { this.actionButtons() }
              </div>
            </div>

            <div className="col-md-6 text-right">
              <p className="author"> {`Publicado por, ${this.props.currentUser.email} `} </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


Card.propTypes = {
  currentUser: PropTypes.shape({ uid: PropTypes.string, email: PropTypes.string }).isRequired,
  fetchPosts: PropTypes.func.isRequired,
  updatePendingKey: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  updatePost: PropTypes.func.isRequired,
  pendingKey: PropTypes.string.isRequired,
  filterBy: PropTypes.string.isRequired,
  post: PropTypes.shape({}),
  id: PropTypes.string,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchPosts,
      deletePost,
      updatePendingKey,
      updatePost,
    },
    dispatch
  );
}

function mapStateToProps(state) {
  return {
    currentUser: state.userStore.currentUser,
    pendingKey: state.userStore.pendingKey,
    filterBy: state.userStore.filterBy,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Card);
