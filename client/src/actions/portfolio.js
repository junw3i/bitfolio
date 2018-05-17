import { UPDATE_PORTFOLIOS } from './types';

function update(portfolios) {
  return {
    type: UPDATE_PORTFOLIOS,
    payload: portfolios
  }
}

export const updatePortfolios = (portfolios) => {
  return dispatch => {
    dispatch(update(portfolios));
  }
}
