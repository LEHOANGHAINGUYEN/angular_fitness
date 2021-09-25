/**
 * React / Redux dependencies
 */
import React from 'react';
import './styles.scss';
import PropTypes from 'prop-types';

export class ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      base64Logo: '',
      fileName: ''
    };
  }

  handleImageChange(e) {
    const {
      input: { value, onChange }
    } = this.props;
    let image = value;
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      image = reader.result;

      this.setState({
        base64Logo: reader.result,
        fileName: file.name
      });
      onChange(image);
    };
    reader.readAsDataURL(file);
  }

  render() {
    const {
      input: { value }, isDisabled, meta: { error }
    } = this.props;
    return <div className='upload-file'>
      <label className='title'>{'Upload Logo'}</label>
      <div className={`upload-image input-form${error ? ' has-error' : ''}`}>
        <input id='file-upload-value' readOnly={true} type='text'
          value={this.state.fileName} className='file-upload-value'/>
        <label htmlFor='file-upload' className={`custom-file-upload${isDisabled ? ' disabled' : ''}`}>{'Attach'}</label>
        <input id='file-upload' type='file' onChange={(e) => this.handleImageChange(e)} />
        {(error && <div className='text-danger-tooltip'>{error}</div>)}
      </div>
      {value && <div className='challenge-image'>
        <img id='myImg' src={value} alt='your image' />
      </div>}
    </div>;
  }
}
ImageUpload.propTypes = {
  base64Logo: PropTypes.any,
  input: PropTypes.object,
  isDisabled: PropTypes.bool,
  meta: PropTypes.object
};
