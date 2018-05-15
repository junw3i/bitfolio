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

export const removeTicker = (tickers, ticker) => {
  var index = tickers.indexOf(ticker);
  if (index > -1) {
    tickers.splice(index, 1);
    let tickersClone = tickers.slice(0);
    return dispatch => {
      dispatch(update(tickersClone));
    }
  }
}
