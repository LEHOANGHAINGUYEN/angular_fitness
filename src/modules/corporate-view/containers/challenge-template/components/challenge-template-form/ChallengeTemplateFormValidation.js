import * as ValidationUtil from 'common/utils/validation';

/**
 * Challenge form validation
 */
const validate = values => {
  const errors = {};
  errors.Base64Logo = ValidationUtil.required(values.Base64Logo);
  errors.TemplateName = ValidationUtil.required(values.TemplateName);
  errors.FitnessTypeId = ValidationUtil.required(values.FitnessTypeId);
  errors.Title = ValidationUtil.required(values.Title);
  return errors;
};

export default validate;
