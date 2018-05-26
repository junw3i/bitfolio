import { CREATE_REQUEST, CREATE_SUCCESS, CREATE_FAILURE  } from './types';

function requestCreate(creds) {
  return {
    type: CREATE_REQUEST,
    isFetching: true,
    isAuthenticated: false,
    creds
  }
}

function receiveCreate(user) {
  return {
    type: CREATE_SUCCESS,
    isFetching: false,
    isAuthenticated: true,
    payload: user.token
  }
}

function createError(message) {
  return {
    type: CREATE_FAILURE,
    isFetching: false,
    isAuthenticated: false,
    message
  }
}

// Calls the API to get a token and dispatches actions along the way
export function createUser(creds) {

  let config = {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: `email=${creds.email}&password=${creds.password}`
  };
  return dispatch => {
    // We dispatch requestLogin to kickoff the call to the API
    dispatch(requestCreate(creds));

    return fetch('/users/create', config)
    .then(response => response.json().then(user => ({ user, response })))
    .then(({ user, response }) =>  {
        if (!response.ok) {
        // If there was a problem, we want to
        // dispatch the error condition
        dispatch(createError(user.message));
        return Promise.reject(user)
      } else {
        // If login was successful, set the token in local storage
        localStorage.setItem('jwt', user.token);
        // Dispatch the success action
        dispatch(receiveCreate(user))
      }
    }).catch(err => console.log("Error: ", err))
  }
}
