import { CREATE_SUCCESS, LOGIN_SUCCESS, LOGGED_IN, LOGOUT } from '../actions/types';

const initialState = {
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
      case LOGOUT:
        return {
          ...state,
          isAuthenticated: action.isAuthenticated
        }
    default:
      return state;
  }
};
