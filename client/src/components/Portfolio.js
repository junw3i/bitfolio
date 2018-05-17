import React from 'react';
import RecentTrades from './RecentTrades';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const Portfolio = ({portfolio}) => (
  <Paper className="paper-portfolio" elevation={8}>
    {portfolio.portfolio_name}
    <RecentTrades portfolio_id={portfolio.id}/>
  </Paper>
);

export default Portfolio
