import { LOGGED_IN  } from './types';

// Calls the API to get a token and dispatches actions along the way
export function loggedIn(status) {
  return dispatch => {
      dispatch({
        type: LOGGED_IN,
        payload: status
      });
  }
}
