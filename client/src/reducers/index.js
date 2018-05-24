import { combineReducers } from 'redux';
import userReducer from './userReducer';
import marketReducer from './marketReducer';
import portfolioReducer from './portfolioReducer';
import balanceSheetReducer from './balanceSheetReducer';

export default combineReducers({
  auth: userReducer,
  market: marketReducer,
  portfolio: portfolioReducer,
  balance_sheet: balanceSheetReducer
});
