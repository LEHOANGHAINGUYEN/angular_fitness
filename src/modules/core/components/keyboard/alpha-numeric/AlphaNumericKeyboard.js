import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import BackImg from './images/Back.svg';
import CapImg from './images/Cap.svg';
import HideKeypadImg from './images/HideKeypad.svg';
import CapPressImg from './images/Cap-Press.svg';

import './styles.scss';

class AlphaNumericKeyboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      inputId: undefined,
      isCaps: false,
      containerTarget: '.wrapper-center-login'
    };
  }


  componentWillReceiveProps(newProps) {
    if (newProps.isKeyboardShow && newProps.target !== this.props.target) {
      let target = newProps.target;
      this.show(target);
    } else if (!newProps.isKeyboardShow) {
      this.hide();
    }
    if (newProps.routing && newProps.routing.pathname !== '/login') {
      this.setState({ containerTarget: '.app-container' });
    } else {
      this.setState({ containerTarget: '.wrapper-center-login' });
    }
  }

  show(e) {
    $('#alKeyboard').show();
    $(this.state.containerTarget).addClass('kb-scroll');
    let that = this;
    setTimeout(function () {
      that.setState({
        visible: true,
        inputId: e.target.id
      });
    }, 5);
  }

  hide() {
    this.setState({
      visible: false,
      inputId: undefined
    });
    $(this.state.containerTarget).removeClass('kb-scroll');
    setTimeout(function () {
      $('#alKeyboard').hide();
    }, 200);
  }

  onKeyTouch(e) {
    let newVal = $(`#${this.state.inputId}`).val() + e.target.value;

    if (this.props.change) {
      this.props.change(this.state.inputId, newVal);
    }

    $(`#${this.state.inputId}`).val(newVal);
    $(`#${this.state.inputId}`).trigger('change');
  }

  delete() {
    let inputVal = $(`#${this.state.inputId}`).val();
    let arr = inputVal.split('');
    if (arr.length > 1) {
      arr.splice(arr.length - 1, 1);
      inputVal = arr.join('');
    } else {
      inputVal = '';
    }

    if (this.props.change) {
      this.props.change(this.state.inputId, inputVal);
    }

    $(`#${this.state.inputId}`).val(inputVal);
    $(`#${this.state.inputId}`).trigger('change');
  }

  ok() {
    let e = new $.Event('keypress');
    e.key = 'Enter';
    if (this.props.onEnterCallback) {
      this.props.onEnterCallback(e);
      this.props.actions.core_keyboard.onSubmit();
    }
    this.hide();
  }

  enableCaps() {
    this.setState({ isCaps: !this.state.isCaps });
  }

  render() {
    return (
      <div className='alkeyboard-container'>
        <div id='alKeyboard' className={(this.state.visible ? 'visible ' : '') + this.props.alignment}>
          <div className='kb-row first'>
            <div className='alKeyboard'>
              <input type='button' className='kb-btn numeric-btn' value='1'
                onClick={(e) => this.onKeyTouch.bind(this)(e)} />
            </div>
            <div className='alKeyboard'>
              <input type='button' className='kb-btn numeric-btn' value='2'
                onClick={(e) => this.onKeyTouch.bind(this)(e)} />
            </div>
            <div className='alKeyboard'>
              <input type='button' className='kb-btn numeric-btn' value='3'
                onClick={(e) => this.onKeyTouch.bind(this)(e)} />
            </div>
            <div className='alKeyboard'>
              <input type='button' className='kb-btn numeric-btn' value='4'
                onClick={(e) => this.onKeyTouch.bind(this)(e)} />
            </div>
            <div className='alKeyboard'>
              <input type='button' className='kb-btn numeric-btn' value='5'
                onClick={(e) => this.onKeyTouch.bind(this)(e)} />
            </div>
            <div className='alKeyboard'>
              <input type='button' className='kb-btn numeric-btn' value='6'
                onClick={(e) => this.onKeyTouch.bind(this)(e)} />
            </div>
            <div className='alKeyboard'>
              <input type='button' className='kb-btn numeric-btn' value='7'
                onClick={(e) => this.onKeyTouch.bind(this)(e)} />
            </div>
            <div className='alKeyboard'>
              <input type='button' className='kb-btn numeric-btn' value='8'
                onClick={(e) => this.onKeyTouch.bind(this)(e)} />
            </div>
            <div className='alKeyboard'>
              <input type='button' className='kb-btn numeric-btn' value='9'
                onClick={(e) => this.onKeyTouch.bind(this)(e)} />
            </div>
            <div className='alKeyboard'>
              <input type='button' className='kb-btn numeric-btn' value='0'
                onClick={(e) => this.onKeyTouch.bind(this)(e)} />
            </div>
            <div className='alKeyboard kb-btn spec-btn' onClick={this.delete.bind(this)}>
              <img src={BackImg} className = 'icon'/>
            </div>
          </div>
          <div className='kb-row second'>
            <div className='alKeyboard'>
              <input type='button' className='kb-btn alpha-btn' value={this.state.isCaps ? 'Q' : 'q'}
                onClick={(e) => this.onKeyTouch.bind(this)(e)} />
            </div>
            <div className='alKeyboard'>
              <input type='button' className='kb-btn alpha-btn' value={this.state.isCaps ? 'W' : 'w'}
                onClick={(e) => this.onKeyTouch.bind(this)(e)} />
            </div>
            <div className='alKeyboard'>
              <input type='button' className='kb-btn alpha-btn' value={this.state.isCaps ? 'E' : 'e'}
                onClick={(e) => this.onKeyTouch.bind(this)(e)} />
            </div>
            <div className='alKeyboard'>
              <input type='button' className='kb-btn alpha-btn' value={this.state.isCaps ? 'R' : 'r'}
                onClick={(e) => this.onKeyTouch.bind(this)(e)} />
            </div>
            <div className='alKeyboard'>
              <input type='button' className='kb-btn alpha-btn' value={this.state.isCaps ? 'T' : 't'}
                onClick={(e) => this.onKeyTouch.bind(this)(e)} />
            </div>
            <div className='alKeyboard'>
              <input type='button' className='kb-btn alpha-btn' value={this.state.isCaps ? 'Y' : 'y'}
                onClick={(e) => this.onKeyTouch.bind(this)(e)} />
            </div>
            <div className='alKeyboard'>
              <input type='button' className='kb-btn alpha-btn' value={this.state.isCaps ? 'U' : 'u'}
                onClick={(e) => this.onKeyTouch.bind(this)(e)} />
            </div>
            <div className='alKeyboard'>
              <input type='button' className='kb-btn alpha-btn' value={this.state.isCaps ? 'I' : 'i'}
                onClick={(e) => this.onKeyTouch.bind(this)(e)} />
            </div>
            <div className='alKeyboard'>
              <input type='button' className='kb-btn alpha-btn' value={this.state.isCaps ? 'O' : 'o'}
                onClick={(e) => this.onKeyTouch.bind(this)(e)} />
            </div>
            <div className='alKeyboard'>
              <input type='button' className='kb-btn alpha-btn' value={this.state.isCaps ? 'P' : 'p'}
                onClick={(e) => this.onKeyTouch.bind(this)(e)} />
            </div>
          </div>
          <div className='kb-row third'>
            <div className='alKeyboard'>
              <input type='button' className='kb-btn alpha-btn' value={this.state.isCaps ? 'A' : 'a'}
                onClick={(e) => this.onKeyTouch.bind(this)(e)} />
            </div>
            <div className='alKeyboard'>
              <input type='button' className='kb-btn alpha-btn' value={this.state.isCaps ? 'S' : 's'}
                onClick={(e) => this.onKeyTouch.bind(this)(e)} />
            </div>
            <div className='alKeyboard'>
              <input type='button' className='kb-btn alpha-btn' value={this.state.isCaps ? 'D' : 'd'}
                onClick={(e) => this.onKeyTouch.bind(this)(e)} />
            </div>
            <div className='alKeyboard'>
              <input type='button' className='kb-btn alpha-btn' value={this.state.isCaps ? 'F' : 'f'}
                onClick={(e) => this.onKeyTouch.bind(this)(e)} />
            </div>
            <div className='alKeyboard'>
              <input type='button' className='kb-btn alpha-btn' value={this.state.isCaps ? 'G' : 'g'}
                onClick={(e) => this.onKeyTouch.bind(this)(e)} />
            </div>
            <div className='alKeyboard'>
              <input type='button' className='kb-btn alpha-btn' value={this.state.isCaps ? 'H' : 'h'}
                onClick={(e) => this.onKeyTouch.bind(this)(e)} />
            </div>
            <div className='alKeyboard'>
              <input type='button' className='kb-btn alpha-btn' value={this.state.isCaps ? 'J' : 'j'}
                onClick={(e) => this.onKeyTouch.bind(this)(e)} />
            </div>
            <div className='alKeyboard'>
              <input type='button' className='kb-btn alpha-btn' value={this.state.isCaps ? 'K' : 'k'}
                onClick={(e) => this.onKeyTouch.bind(this)(e)} />
            </div>
            <div className='alKeyboard'>
              <input type='button' className='kb-btn alpha-btn' value={this.state.isCaps ? 'L' : 'l'}
                onClick={(e) => this.onKeyTouch.bind(this)(e)} />
            </div>
            <div className='alKeyboard'>
              <input type='button' className='kb-btn alpha-btn' value={'@'}
                onClick={(e) => this.onKeyTouch.bind(this)(e)} />
            </div>
          </div>
          <div className='kb-row fourth'>
            <div className='alKeyboard kb-btn spec-btn cap-btn' onClick={this.enableCaps.bind(this)}>
              <img src={this.state.isCaps ? CapPressImg : CapImg} className = 'icon'/>
            </div>
            <div className='alKeyboard'>
              <input type='button' className='kb-btn alpha-btn' value={this.state.isCaps ? 'Z' : 'z'}
                onClick={(e) => this.onKeyTouch.bind(this)(e)} />
            </div>
            <div className='alKeyboard'>
              <input type='button' className='kb-btn alpha-btn' value={this.state.isCaps ? 'X' : 'x'}
                onClick={(e) => this.onKeyTouch.bind(this)(e)} />
            </div>
            <div className='alKeyboard'>
              <input type='button' className='kb-btn alpha-btn' value={this.state.isCaps ? 'C' : 'c'}
                onClick={(e) => this.onKeyTouch.bind(this)(e)} />
            </div>
            <div className='alKeyboard'>
              <input type='button' className='kb-btn alpha-btn' value={this.state.isCaps ? 'V' : 'v'}
                onClick={(e) => this.onKeyTouch.bind(this)(e)} />
            </div>
            <div className='alKeyboard'>
              <input type='button' className='kb-btn alpha-btn' value={this.state.isCaps ? 'B' : 'b'}
                onClick={(e) => this.onKeyTouch.bind(this)(e)} />
            </div>
            <div className='alKeyboard'>
              <input type='button' className='kb-btn alpha-btn' value={this.state.isCaps ? 'N' : 'n'}
                onClick={(e) => this.onKeyTouch.bind(this)(e)} />
            </div>
            <div className='alKeyboard'>
              <input type='button' className='kb-btn alpha-btn' value={this.state.isCaps ? 'M' : 'm'}
                onClick={(e) => this.onKeyTouch.bind(this)(e)} />
            </div>
            <div className='alKeyboard'>
              <input type='button' className='kb-btn alpha-btn' value='.'
                onClick={(e) => this.onKeyTouch.bind(this)(e)} />
            </div>
            <div className='alKeyboard'>
              <input type='button' className='kb-btn alpha-btn' value='/'
                onClick={(e) => this.onKeyTouch.bind(this)(e)} />
            </div>
          </div>
          <div className='kb-row fifth'>
            <div className='alKeyboard kb-btn spec-btn' onClick={(e) => this.hide.bind(this)(e, true)}>
              <img src={HideKeypadImg} className = 'icon'/>
            </div>
            <div className='alKeyboard space'>
              <input type='button' className='kb-btn alpha-btn space-btn' value=' '
                onClick={(e) => this.onKeyTouch.bind(this)(e)} />
            </div>
            <div className='alKeyboard'>
              <input type='button' className='kb-btn alpha-btn ok-btn' value='OK'
                onClick={() => this.ok.bind(this)()} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AlphaNumericKeyboard.propTypes = {
  actions: PropTypes.any,
  alignment: PropTypes.string,
  change: PropTypes.func,
  onEnterCallback: PropTypes.func,
  target: PropTypes.any
};

export default connect(state => ({
  routing: state.routing.locationBeforeTransitions,
  isKeyboardShow: state.core_keyboard.isShow,
  change: state.core_keyboard.change,
  target: state.core_keyboard.target,
  onEnterCallback: state.core_keyboard.onEnterCallback
}))(AlphaNumericKeyboard);
