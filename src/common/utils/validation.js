const isEmpty = value => value === undefined || value === null || value === '';
const join = (rules) => (value, data) => rules.map(rule => rule(value, data)).filter(error => !!error)[0];

export function pattern(regex, errorMsg) {
  return value => {
    // Let's not start a debate on email regex. This is just for an example app!
    if (!isEmpty(value) && !regex.test(value)) {
      return errorMsg || 'Invalid value';
    }
    return undefined;
  };
}

export function required(value, errorMsg) {
  if (isEmpty(value)) {
    return errorMsg || 'This field is required!';
  }

  return undefined;
}

export function isRequired(errorMsg) {
  return value => {
    if (isEmpty(value)) {
      return errorMsg || 'This field is required!';
    }

    return undefined;
  };
}

export function minLength(min, errorMsg) {
  return value => {
    if (!isEmpty(value) && value.length < min) {
      return errorMsg || `Must be at least ${min} characters`;
    }
    return '';
  };
}

export function maxLength(max, errorMsg) {
  return value => {
    if (!isEmpty(value) && value.length > max) {
      return errorMsg || `Must be no more than ${max} characters`;
    }
    return '';
  };
}


export function integer(value, errorMsg) {
  if (!Number.isInteger(Number(value))) {
    return errorMsg || 'Must be an integer';
  }
  return '';
}

export function oneOf(enumeration, errorMsg) {
  return value => {
    if (!~enumeration.indexOf(value)) {
      return errorMsg || `Must be one of: ${enumeration.join(', ')}`;
    }
    return '';
  };
}

export function match(field, errorMsg) {
  return (value, data) => {
    if (data && data[field]) {
      if (value !== data[field]) {
        return errorMsg || 'Do not match';
      }
    }
    return '';
  };
}

export function createValidator(rules) {
  return (data = {}) => {
    const errors = {};
    Object.keys(rules).forEach((key) => {
      const rule = join([].concat(rules[key])); // concat enables both functions and arrays of functions
      const error = rule(data[key], data);
      if (error) {
        errors[key] = error;
      }
    });
    return errors;
  };
}

export function isValidPassword(errorMsg) {
  // eslint-disable-next-line max-len
  const rex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\(\)\`\~\_\-\+\=\{\}\[\]\|\\\:\;\"\'\,\<\.\>\?/])(?=.{8,})/;

  return value => {
    if (!isEmpty(value) && !rex.test(value)) {
      return errorMsg || 'Your password must be at least 8 characters, contains at least one uppercase character, one lowercase character, one special character, and one number.';
    }

    return undefined;
  };
}

export const phoneFormatter = number => {
  if (number && number.charAt(0) === '0') {
    number = `1${number.substr(1, number.length - 1)}`;
  }
  if (!number) {return '';}
  if (number.indexOf('.') >= 0) {return phoneFormatter(number.replace(/(\-|\(|\)|\.)+/g, ''));}
  const splitter = /.{1,3}/g;
  return number.substring(0, 7).match(splitter).join('.') + number.substring(7);
};
/**
 * Remove dashes added by the formatter. We want to store phones as plain numbers
 */
export const phoneParser = number => {
  if (number) {number = number.replace(/(\-|\(|\)|\.)+/g, '');}
  let numberAfterFormat = number ? number.replace(/[.]/g, '') : '';
  return numberAfterFormat.substring(0, 15);
};

export default {
  createValidator,
  match,
  oneOf,
  integer,
  maxLength,
  minLength,
  required,
  pattern,
  isValidPassword,
  phoneFormatter,
  phoneParser
};
