import { UPDATE_BALANACE } from '../actions/types';

const initialState = {
  initial: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case UPDATE_BALANACE:
      return {
        ...state,
        [action.portfolio_id]: action.payload
      }
    default:
      return state;
  }
};
