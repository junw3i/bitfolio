import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE  } from './types';


function requestLogin(creds) {
    return {
        type: LOGIN_REQUEST,
        isFetching: true,
        isAuthenticated: false,
        creds
    }
}

function receiveLogin(user) {
    return {
        type: LOGIN_SUCCESS,
        isFetching: false,
        isAuthenticated: true,
        payload: user.token
    }
}

function loginError(message) {
    return {
        type: LOGIN_FAILURE,
        isFetching: false,
        isAuthenticated: false,
        message
    }
}

// Calls the API to get a token and dispatches actions along the way
  export function loginUser(creds) {

    let config = {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `email=${creds.email}&password=${creds.password}`
    };
    return dispatch => {
        // We dispatch requestLogin to kickoff the call to the API
        dispatch(requestLogin(creds));

        return fetch('/users/login', config)
            .then(response => response.json().then(user => ({ user, response })))
            .then(({ user, response }) =>  {
                if (!response.ok) {
                    // If there was a problem, we want to
                    // dispatch the error condition
                    dispatch(loginError(user.message));
                    return Promise.reject(user)
                } else {
                    // If login was successful, set the token in local storage
                    localStorage.setItem('jwt', user.token);
                    // Dispatch the success action
                    dispatch(receiveLogin(user))
                }
            }).catch(err => console.log("Error: ", err))
    }
}
