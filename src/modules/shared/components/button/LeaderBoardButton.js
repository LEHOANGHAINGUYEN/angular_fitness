import React from 'react';
import PropTypes from 'prop-types';

import './styles.scss';

export default class LeaderBoardButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isHover: false
    };
  }
  isHover() {
    this.setState({ isHover: true });
  }
  isNotHover() {
    this.setState({ isHover: false });
  }
  render() {
    const { content } = this.props;
    let buttonContent;

    if (typeof content === 'string') {
      buttonContent = <img src={content} className='image-leader-board-button' />;
    } else {
      buttonContent = content;
    }

    let cssButton = this.state.isHover === true ? 'content-top-hover' : 'content-top';
    return (
      <div className='leader-board-button' onClick={() => this.props.handleClick()}
        onMouseEnter={this.isHover.bind(this)} onMouseLeave={this.isNotHover.bind(this)}>
        <div className={cssButton}>
          {buttonContent}
        </div>
        <div className='content-bottom'>
          <p className='text-leader-board-button'>{this.props.title}</p>
        </div>
      </div>
    );
  }
}

LeaderBoardButton.propTypes = {
  content: PropTypes.any,
  handleClick: PropTypes.func,
  img: PropTypes.any,
  title: PropTypes.object
}
  ;
