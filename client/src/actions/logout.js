import { LOGOUT } from './types';

function logout() {
  return {
    type: LOGOUT,
    isAuthenticated: false
  }
}

export const logoutUser = (tickers) => {
  return dispatch => {
    dispatch(logout());
  }
}
