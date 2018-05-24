import { UPDATE_BALANACE } from './types';

// REMOVE_EXPENSE
export const updateBalanceSheet = (balance, portfolio_id) => ({
  type: UPDATE_BALANACE,
  payload: balance,
  portfolio_id
});
