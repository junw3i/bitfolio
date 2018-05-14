import { combineReducers } from 'redux';
import userReducer from './userReducer';
import marketReducer from './marketReducer';

export default combineReducers({
  auth: userReducer,
  market: marketReducer
});
