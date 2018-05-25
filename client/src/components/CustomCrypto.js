import React, { Component } from 'react';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {


  },
});

class CustomCrypto extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        Custom Metrics
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  balance_sheet: state.balance_sheet[ownProps.portfolio_id]
});

export default connect(mapStateToProps)(withStyles(styles)(CustomCrypto));
