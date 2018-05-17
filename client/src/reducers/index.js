import { combineReducers } from 'redux';
import userReducer from './userReducer';
import marketReducer from './marketReducer';
import portfolioReducer from './portfolioReducer';

export default combineReducers({
  auth: userReducer,
  market: marketReducer,
  portfolio: portfolioReducer
});
