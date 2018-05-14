import { UPDATE_TICKERS } from '../actions/types';

const initialState = {
  tickers: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case UPDATE_TICKERS:
      return {
        ...state,
        tickers: action.payload
      }
    default:
      return state;
  }
};
