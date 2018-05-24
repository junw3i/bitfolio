import React from 'react';
import RecentTrades from './RecentTrades';
import BalanceSheetCrypto from './BalanceSheetCrypto';
import BalanceSheetShares from './BalanceSheetShares';
import CustomCrypto from './CustomCrypto';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const Portfolio = ({portfolio}) => {
  if (portfolio.asset_type === 'cryptocurrencies') {
    return (
      <div>
        <h3>{portfolio.portfolio_name}</h3>
        <div className="portfolio-container">
          <Paper className="paper-activity" elevation={8}>
            <RecentTrades key={portfolio.id} portfolio_id={portfolio.id}/>
          </Paper>

            <BalanceSheetCrypto key={portfolio.id} portfolio_id={portfolio.id} asset_type={portfolio.asset_type} />


        </div>
      </div>
    )
  } else if (portfolio.asset_type === 'shares') {
    return (
      <div>
        <h3>{portfolio.portfolio_name}</h3>
        <div className="portfolio-container">
          <Paper className="paper-activity" elevation={8}>
            <RecentTrades key={portfolio.id} portfolio_id={portfolio.id}/>
          </Paper>
          <Paper className="paper-balancesheet-shares" elevation={8}>
            <BalanceSheetShares key={portfolio.id} portfolio_id={portfolio.id} asset_type={portfolio.asset_type} />
          </Paper>
        </div>
      </div>
    )
  }
};

export default Portfolio
