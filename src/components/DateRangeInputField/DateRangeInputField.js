import React, { Component, PropTypes } from 'react';
import { Field } from 'redux-form';
import classNames from 'classnames';
import { START_DATE, END_DATE } from '../../util/dates';
import { ValidationError } from '../../components';

import DateRangeInput from './DateRangeInput';
import css from './DateRangeInputField.css';

class DateRangeInputFieldComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { focusedInput: null };
    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // Update focusedInput in case a new value for it is
    // passed in the props. This may occur if the focus
    // is manually set to the date picker.
    if (nextProps.focusedInput && nextProps.focusedInput !== this.props.focusedInput) {
      this.setState({ focusedInput: nextProps.focusedInput });
    }
  }

  handleBlur(focusedInput) {
    this.setState({ focusedInput: null });
    this.props.input.onBlur(focusedInput);
    // notify the containing component that the focused
    // input has changed.
    this.props.onFocusedInputChange(null);
  }

  handleFocus(focusedInput) {
    this.setState({ focusedInput });
    this.props.input.onFocus(focusedInput);
  }

  render() {
    /* eslint-disable no-unused-vars */
    const {
      className,
      rootClassName,
      startDateId,
      startDateLabel,
      endDateId,
      endDateLabel,
      input,
      meta,
      useMobileMargins,
      // extract focusedInput and onFocusedInputChange so that
      // the same values will not be passed on to subcomponents
      focusedInput,
      onFocusedInputChange,
      ...rest
    } = this.props;
    /* eslint-disable no-unused-vars */

    if (startDateLabel && !startDateId) {
      throw new Error('startDateId required when a startDateLabel is given');
    }

    if (endDateLabel && !endDateId) {
      throw new Error('endDateId required when a endDateLabel is given');
    }

    const { touched, error } = meta;
    const value = input.value;

    // If startDate is valid label changes color and bottom border changes color too
    const startDateIsValid = value && value.startDate instanceof Date;
    const startDateLabelClasses = classNames(css.startDateLabel, {
      [css.labelSuccess]: false, //startDateIsValid,
    });
    const startDateBorderClasses = classNames(css.input, {
      [css.inputSuccess]: startDateIsValid,
      [css.inputError]: touched && !startDateIsValid && typeof error === 'string',
      [css.hover]: this.state.focusedInput === START_DATE,
    });

    // If endDate is valid label changes color and bottom border changes color too
    const endDateIsValid = value && value.endDate instanceof Date;
    const endDateLabelClasses = classNames(css.endDateLabel, {
      [css.labelSuccess]: false, //endDateIsValid,
    });
    const endDateBorderClasses = classNames(css.input, {
      [css.inputSuccess]: endDateIsValid,
      [css.inputError]: touched && !endDateIsValid && typeof error === 'string',
      [css.hover]: this.state.focusedInput === END_DATE,
    });

    const label = startDateLabel && endDateLabel
      ? <div className={classNames(css.labels, { [css.mobileMargins]: useMobileMargins })}>
          <label className={startDateLabelClasses} htmlFor={startDateId}>{startDateLabel}</label>
          <label className={endDateLabelClasses} htmlFor={endDateId}>{endDateLabel}</label>
        </div>
      : null;

    // eslint-disable-next-line no-unused-vars
    const { onBlur, onFocus, ...restOfInput } = input;
    const inputProps = {
      onBlur: this.handleBlur,
      onFocus: this.handleFocus,
      useMobileMargins,
      ...restOfInput,
      ...rest,
      focusedInput: this.state.focusedInput,
    };
    const classes = classNames(rootClassName || css.fieldRoot, className);
    const errorClasses = classNames({ [css.mobileMargins]: useMobileMargins });

    return (
      <div className={classes}>
        {label}
        <DateRangeInput {...inputProps} />
        <div
          className={classNames(css.inputBorders, {
            [css.mobileMargins]: useMobileMargins && !this.state.focusedInput,
          })}
        >
          <div className={startDateBorderClasses} />
          <div className={endDateBorderClasses} />
        </div>
        <ValidationError className={errorClasses} fieldMeta={meta} />
      </div>
    );
  }
}

DateRangeInputFieldComponent.defaultProps = {
  className: null,
  rootClassName: null,
  useMobileMargins: false,
  endDateId: null,
  endDateLabel: null,
  endDatePlaceholderText: null,
  startDateId: null,
  startDateLabel: null,
  startDatePlaceholderText: null,
  focusedInput: null,
  onFocusedInputChange: null,
};

const { bool, func, object, oneOf, string } = PropTypes;

DateRangeInputFieldComponent.propTypes = {
  className: string,
  rootClassName: string,
  useMobileMargins: bool,
  endDateId: string,
  endDateLabel: string,
  endDatePlaceholderText: string,
  startDateId: string,
  startDateLabel: string,
  startDatePlaceholderText: string,
  input: object.isRequired,
  meta: object.isRequired,
  focusedInput: oneOf([START_DATE, END_DATE]),
  onFocusedInputChange: func,
};

const DateRangeInputField = props => {
  return <Field component={DateRangeInputFieldComponent} {...props} />;
};

export { DateRangeInput };
export default DateRangeInputField;
