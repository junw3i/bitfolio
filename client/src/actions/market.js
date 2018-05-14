import { UPDATE_TICKERS } from './types';

function update(tickers) {
  return {
    type: UPDATE_TICKERS,
    payload: tickers
  }
}

export function updateTickers(tickers) {
  return dispatch => {
    dispatch(update(tickers));
  }
}
