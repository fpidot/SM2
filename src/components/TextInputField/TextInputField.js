import React, { Component, PropTypes } from 'react';
import { Field } from 'redux-form';
import classNames from 'classnames';
import { ValidationError, ExpandingTextarea } from '../../components';

import css from './TextInputField.css';

class TextInputFieldComponent extends Component {
  componentWillUnmount() {
    if (this.props.clearOnUnmount) {
      this.props.input.onChange('');
    }
  }
  render() {
    /* eslint-disable no-unused-vars */
    const {
      rootClassName,
      className,
      clearOnUnmount,
      id,
      label,
      type,
      input,
      meta,
      ...rest
    } = this.props;
    /* eslint-enable no-unused-vars */

    if (label && !id) {
      throw new Error('id required when a label is given');
    }

    const { valid, invalid, touched, error } = meta;
    const isTextarea = type === 'textarea';

    // Error message and input error styles are only shown if the
    // field has been touched and the validation has failed.
    const hasError = touched && invalid && error;

    const inputClasses = classNames(css.input, {
      [css.inputSuccess]: valid,
      [css.inputError]: hasError,
    });
    const inputProps = isTextarea
      ? { className: inputClasses, id, ...input, ...rest }
      : { className: inputClasses, id, type, ...input, ...rest };

    const classes = classNames(rootClassName || css.root, className);
    return (
      <div className={classes}>
        {label ? <label htmlFor={id}>{label}</label> : null}
        {isTextarea ? <ExpandingTextarea {...inputProps} /> : <input {...inputProps} />}
        <ValidationError fieldMeta={meta} />
      </div>
    );
  }
}

TextInputFieldComponent.defaultProps = {
  rootClassName: null,
  className: null,
  clearOnUnmount: false,
  id: null,
  label: null,
};

const { string, bool, shape, func, object } = PropTypes;

TextInputFieldComponent.propTypes = {
  rootClassName: string,
  className: string,

  clearOnUnmount: bool,

  // Label is optional, but if it is given, an id is also required so
  // the label can reference the input in the `for` attribute
  id: string,
  label: string,

  // Either 'textarea' or something that is passed to the input element
  type: string.isRequired,

  // Generated by redux-form's Field component
  input: shape({
    onChange: func.isRequired,
  }).isRequired,
  meta: object.isRequired,
};

const TextInputField = props => {
  return <Field component={TextInputFieldComponent} {...props} />;
};

export default TextInputField;
