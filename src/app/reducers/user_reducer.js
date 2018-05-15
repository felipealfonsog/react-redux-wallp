import {
  LOGOUT_USER,
  AUTH_USER,
  AUTH_ERROR,
  ALLOW_REGISTER,
  UPDATE_TIMELINE,
  UPDATE_FILTER_BY,
  UPDATE_PENDING_KEY,
} from '../actions/types';

const initialState = {
  authenticated: false,
  error: '',
  currentUser: {},
  allowRegister: false,
  posts: [],
  pendingKey: '',
  filterBy: 'friends',
};

export default function userStore(state = initialState, action) {
  switch (action.type) {
  case AUTH_USER:
    return {
      ...state,
      authenticated: true,
      currentUser: action.user,
      error: '',
    };
  case LOGOUT_USER:
    return {
      ...state,
      authenticated: false,
      currentUser: {},
      error: '',
    };
  case AUTH_ERROR:
    return {
      ...state,
      authenticated: false,
      error: action.error,
    };
  case ALLOW_REGISTER:
    return {
      ...state,
      allowRegister: action.status,
    };
  case UPDATE_TIMELINE:
    return {
      ...state,
      posts: action.posts,
    };
  case UPDATE_PENDING_KEY:
    return {
      ...state,
      pendingKey: action.key,
    };
  case UPDATE_FILTER_BY:
    return {
      ...state,
      filterBy: action.filter,
    };
  default:
    return state;
  }
}
