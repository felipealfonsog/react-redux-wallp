import firebase from 'firebase';
import swal from 'sweetalert'
import { FIREBASE_CONFIG } from '../config';
import userMessages from '../messages/user';

import {
  UPDATE_FIREBASE_USER,
  CHANGE_FIREBASE_USER_PASSWORD,
  LOGOUT_USER,
  AUTH_USER,
  AUTH_ERROR,
  ALLOW_REGISTER,
  UPDATE_TIMELINE,
  UPDATE_PENDING_KEY,
  UPDATE_FILTER_BY,
} from './types';

const firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);
const firebaseAuth = firebaseApp.auth();
const firebaseDb = firebaseApp.database();

export function authUser(user) {
  return {
    type: AUTH_USER,
    user,
  };
}

export function authError(error) {
  return {
    type: AUTH_ERROR,
    error,
  };
}

export function registerUser(user) {
  return (dispatch) => {
    firebaseAuth.createUserWithEmailAndPassword(user.email, user.password)
    .then((response) => {
      dispatch(authUser(response));
    })
    .catch((error) => {
      dispatch(authError(userMessages.register.error[error.code]));
    });
  };
}

export function loginUser(user) {
  return (dispatch) => {
    firebaseAuth.signInWithEmailAndPassword(user.email, user.password)
    .then((userInfo) => {
      dispatch(authUser(userInfo));
    })
    .catch((error) => {
      dispatch(authError(userMessages.login.error[error.code]));
    });
  };
}

export function fetchUser() {
  return (dispatch) => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        dispatch(authUser(user));
      }
    });
  };
}

export function updateUser(user) {
  return {
    type: UPDATE_FIREBASE_USER,
    user,
  };
}

export function changePassword(newPassword) {
  return {
    type: CHANGE_FIREBASE_USER_PASSWORD,
    newPassword,
  };
}

export function logoutUser() {
  return {
    type: LOGOUT_USER,
  };
}

export function logoutFirebaseUser() {
  return (dispatch) => {
    firebaseAuth.signOut().then(() => {
      dispatch(logoutUser());
    });
  };
}

export function allowRegister(status) {
  return {
    type: ALLOW_REGISTER,
    status,
  };
}

export function registerStatus() {
  return (dispatch) => {
    firebaseDb.ref('/allowRegister').once('value').then((snapshot) => {
      dispatch(allowRegister(snapshot.val()));
    });
  };
}

export function savePost(type, uid, post) {
  return () => {
    firebaseDb.ref('/posts/' + uid + '/' + type).push(post, (error) => {
      if (error) {
        swal('Oops!', 'Ha ocurrido un error de comunicacion, intentalo nuevamente', 'error');
        console.log(error);
      } else {
        swal('Excelente!', 'Tu publicacion se ha enviado correctamente', 'success');
      }
    });
  };
}

export function updateTimeline(posts) {
  return {
    type: UPDATE_TIMELINE,
    posts,
  };
}

export function fetchPosts(type, uid) {
  return (dispatch) => {
    console.log('fetch posts');
    firebaseDb.ref('/posts/' + uid + '/' + type).once('value').then((snapshot) => {
      dispatch(updateTimeline(snapshot.val()));
    });
  };
}

export function deletePost(type, uid, id) {
  return () => {
    firebaseDb.ref('/posts/' + uid + '/' + type).child(id).remove();
  };
}

export function updatePendingKey(key) {
  return {
    type: UPDATE_PENDING_KEY,
    key,
  };
}

export function updateFilterBy(filter) {
  return {
    type: UPDATE_FILTER_BY,
    filter,
  };
}

export function updatePost(type, uid, id, post) {
  return () => {
    console.log('update posts');
    firebaseDb.ref('/posts/' + uid + '/' + type).child(id).update(post);
  };
}
