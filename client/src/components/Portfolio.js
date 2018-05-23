import React from 'react';
import RecentTrades from './RecentTrades';
import BalanceSheetCrypto from './BalanceSheetCrypto';
import BalanceSheetShares from './BalanceSheetShares';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const Portfolio = ({portfolio}) => {
  let balanceSheet;

  if (portfolio.asset_type === 'cryptocurrencies') {
    balanceSheet = <Paper className="paper-balancesheet-crypto" elevation={8}>
      <BalanceSheetCrypto key={portfolio.id} portfolio_id={portfolio.id} asset_type={portfolio.asset_type} />
    </Paper>
  } else if (portfolio.asset_type === 'shares') {
    balanceSheet = <Paper className="paper-balancesheet-shares" elevation={8}>
      <BalanceSheetShares key={portfolio.id} portfolio_id={portfolio.id} asset_type={portfolio.asset_type} />
  </Paper>
  }
  return (
    <div>
      <h3>{portfolio.portfolio_name}</h3>
      <div className="portfolio-container">
        <Paper className="paper-activity" elevation={8}>
          <RecentTrades key={portfolio.id} portfolio_id={portfolio.id}/>
        </Paper>
        {balanceSheet}
      </div>
    </div>
  )
};

export default Portfolio
