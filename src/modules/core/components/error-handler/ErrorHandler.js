/**
 * React / Redux dependencies
 */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

/**
 * Using react-s-alert for this implementation
 * Reference to: https://github.com/juliancwirko/react-s-alert
 */
export class ErrorHandler extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    const { actions, error } = this.props;

    if (error) {
      actions.core_errorHandler.handleError(error);
    }
  }

  render() {
    return <div />;
  }
}

/**
 * Typechecking With PropTypes
 * Reference https://facebook.github.io/react/docs/typechecking-with-proptypes.html
 * Proptypes: https://github.com/facebook/prop-types
 */
ErrorHandler.propTypes = {
  actions: PropTypes.any,
  error: PropTypes.any
};

export default connect(state => ({
  error: state.core_errorHandler.error
}))(ErrorHandler);
