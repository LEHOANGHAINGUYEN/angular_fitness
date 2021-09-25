/**
 * React / Redux dependencies
 */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import { intlShape, injectIntl } from 'react-intl';

import './styles.scss';
import { ModalType } from './ModalType';
import { ModalResult } from './ModalResult';

/**
 * Using react bootstrap modal for this implementation
 * Reference to: https://react-bootstrap.github.io/components.html#modals
 */
export class ModalRedux extends React.Component {
  constructor(props) {
    super(props);
  }

  /**
   * Close this modal
   */
  close() {
    if (this.props.options.onClose &&
      typeof this.props.options.onClose === 'function') {
      this.props.options.onClose(ModalResult.Cancel);
    }
    this.props.actions.core_modal.hide();
  }

  /**
   * Event is fired when click on cancel button
   */
  cancel() {
    this.close();
  }

  /**
   * Event is fired when click on OK button
   */
  ok() {
    if (this.props.options.onClose &&
      typeof this.props.options.onClose === 'function') {
      this.props.options.onClose(ModalResult.Ok);
    }
    this.props.actions.core_modal.hide();
  }

  /**
   * Populate bsClass for header based on modalType
   */
  populateBsClassHeader() {
    let bsClass = 'modal-header';

    switch (this.props.options.modalType) {
      case ModalType.Success:
        return `${bsClass} alert-success`;
      case ModalType.Info:
        return `${bsClass} alert-info`;
      case ModalType.Error:
        return `${bsClass} alert-danger`;
      case ModalType.Confirm:
        return `${bsClass} alert-warning`;
      case ModalType.Custom:
        return `${bsClass} ${this.props.options.headerClass || ''}`;
      default:
        return bsClass;
    }
  }

  /**
   * Render footer for this modal based on modal type
   */
  renderFooterModal() {
    const {intl, options} = this.props;
    const {modalType, hasFooter} = options;

    if (modalType === ModalType.Confirm
      || (modalType === ModalType.Custom && hasFooter)) {
      return (
        <Modal.Footer>
          <button className='btn' onClick={this.cancel.bind(this)}>{intl.formatMessage({ id: 'General.CancelBtn' })}</button>
          <button className='btn btn-primary' onClick={this.ok.bind(this)}>{intl.formatMessage({ id: 'General.OkBtn' })}</button>
        </Modal.Footer>
      );
    }
    if (modalType === ModalType.Custom) {
      return undefined;
    }
    return (
      <Modal.Footer>
        <button className='btn btn-primary' onClick={this.ok.bind(this)}>{'OK'}</button>
      </Modal.Footer>
    );
  }

  /**
   * Render body modal based on
   */
  renderBodyModal() {
    if (this.props.options.modalType === ModalType.Custom) {
      if (!this.props.options.component) {
        throw new Error('Please specify the react component when using custom modal!');
      }

      const WrappedComponent = this.props.options.component;
      const { props } = this.props.options;

      return <WrappedComponent
        ok={this.ok.bind(this)}
        close={this.close.bind(this)}
        {...props} />;
    }

    return this.props.options.message;
  }

  render() {
    return (
      <div>
        <Modal
          show={this.props.isOpen === true}
          onHide={this.close.bind(this)}
          bsSize={this.props.options.size}
          backdrop={this.props.options.backdrop || true}
          dialogClassName={this.props.options.className || ''}>
          <Modal.Header closeButton={true} bsClass={this.populateBsClassHeader()}>
            <Modal.Title>{this.props.options.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.renderBodyModal()}
          </Modal.Body>
          {this.renderFooterModal()}
        </Modal>
      </div>
    );
  }
}

/**
 * Typechecking With PropTypes
 * Reference https://facebook.github.io/react/docs/typechecking-with-proptypes.html
 * Proptypes: https://github.com/facebook/prop-types
 */
ModalRedux.propTypes = {
  actions: PropTypes.any,
  intl: intlShape.isRequired,
  isOpen: PropTypes.bool,
  options: PropTypes.any
};

export default injectIntl(connect(state => ({
  isOpen: state.core_modal.isOpen,
  options: state.core_modal.options
}))(ModalRedux));
