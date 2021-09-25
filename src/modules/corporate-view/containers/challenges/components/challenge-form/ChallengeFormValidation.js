import * as ValidationUtil from 'common/utils/validation';

/**
 * Challenge form validation
 */
const validate = values => {
  const errors = {};
  if (!values.isAllStudios) {
    errors.individualStudios = ValidationUtil.required(values.individualStudios);
  }
  errors.language = ValidationUtil.required(values.language);
  errors.challengeType = ValidationUtil.required(values.challengeType);
  errors.numberOfRound = ValidationUtil.required(values.numberOfRound);
  return errors;
};

export default validate;
