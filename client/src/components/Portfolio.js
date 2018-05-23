  import React from 'react';
import RecentTrades from './RecentTrades';
import BalanceSheet from './BalanceSheet';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const Portfolio = ({portfolio}) => (
  <div>
    <h3>{portfolio.portfolio_name}</h3>
    <div className="portfolio-container">
      <Paper className="paper-activity" elevation={8}>
        <RecentTrades key={portfolio.id} portfolio_id={portfolio.id}/>
      </Paper>
      <Paper className="paper-balancesheet" elevation={8}>
        <BalanceSheet key={portfolio.id} portfolio_id={portfolio.id} asset_type={portfolio.asset_type}/>
      </Paper>
    </div>
  </div>
);

export default Portfolio
