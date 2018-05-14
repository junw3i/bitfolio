import { CREATE_SUCCESS, LOGIN_SUCCESS, LOGGED_IN } from '../actions/types';

const initialState = {
  token: '',
  isAuthenticated: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        auth: action.payload,
        isAuthenticated: true

      }
      case CREATE_SUCCESS:
        console.log("user_reducer", action.payload);
        return {
          ...state,
          auth: action.payload,
          isAuthenticated: true
        }
      case LOGGED_IN:
        return {
          ...state,
          isAuthenticated: action.payload
        }
    default:
      return state;
  }
};
