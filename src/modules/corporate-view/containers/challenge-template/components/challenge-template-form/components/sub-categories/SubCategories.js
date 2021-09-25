/**
 * React / Redux dependencies
 */
import React from 'react';
import * as _ from 'lodash';

import './styles.scss';
import PropTypes from 'prop-types';

export class SubCategories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      challengeSub: '',
      listSubCategorys: [],
      isValid: false
    };
  }

  challengeSubCategory(e) {
    this.setState({
      challengeSub: e.target.value,
      isValid: true
    });
  }

  addSubCategory() {
    const {
      input: { value, onChange }
    } = this.props;
    let subCategories = _.cloneDeep(value) || [];
    let templateTypeNameObject = { TemplateTypeName: this.state.challengeSub };
    let isValid = (templateTypeNameObject.TemplateTypeName !== '');

    subCategories.map(item => {
      if (item.TemplateTypeName === templateTypeNameObject.TemplateTypeName) {
        isValid = false;
      }
    });

    if (!isValid) {
      // handle invalid
    } else {
      // clear the text box
      this.setState({
        challengeSub: '',
        isValid: true
      });
      subCategories.push(templateTypeNameObject);
      onChange(subCategories);
    }
  }

  deleteSubCategory(subCategory) {
    const {
      input: { value, onChange }
    } = this.props;
    let subCategories = _.cloneDeep(value) || [];
    let newSubCategories = subCategories.filter(function (e) {
      return e.TemplateTypeName !== subCategory.TemplateTypeName;
    });
    onChange(newSubCategories);
  }

  checkValid() {
    let newSubCategory = document.getElementById('challengeSub');
    return !(newSubCategory && newSubCategory.value.trim() === '');
  }

  renderListSubCategory() {
    const {
      input: { value }, isDisabled
    } = this.props;
    return (
      <div>
        {(value || []).map((subCategory, index) => {
          return (
            <div key={index} className='sub-category'>
              {subCategory.TemplateTypeName}
              {!isDisabled && <button
                type='button'
                onClick={this.deleteSubCategory.bind(this, subCategory)}
                className='btn-delete-sub-category'>
                <i className='fa fa-times' />
              </button>}
            </div>
          );
        })}
      </div>
    );
  }

  render() {
    const { isDisabled } = this.props;
    return (
      <div className='template-sub-category' >
        <label className={'title'}>{'Sub Category(ies)'}</label>
        <div className='column-sub-category'>
          <input
            ref={(challengeSub) => {
              this.challengeSub = challengeSub;
            }}
            type='text'
            id='challengeSub'
            disabled={isDisabled}
            value={this.state.challengeSub}
            className='form-sub-category form-control ' onChange={this.challengeSubCategory.bind(this)} />
          <button
            type='button'
            className='btn-primary btn-add-sub-category' disabled={!this.state.isValid || isDisabled || !this.checkValid.bind(this)()} onClick={this.addSubCategory.bind(this)}>
            <i className='fa fa-plus' />
          </button>
        </div>
        <div className='list-sub-category'>{this.renderListSubCategory()}</div>
      </div>
    );
  }
}
SubCategories.propTypes = {
  input: PropTypes.object,
  isDisabled: PropTypes.bool
};
