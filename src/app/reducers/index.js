import { combineReducers } from 'redux';
import userStore from './user_reducer';

const rootReducer = combineReducers({
    userStore,
});

export default rootReducer;
