import React from 'react';
import { Field, reduxForm, propTypes as formPropTypes } from 'redux-form';
import { Button } from '../../components';

const PasswordForgottenForm = props => {
  const { handleSubmit, pristine, submitting } = props;
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <Field name="email" component="input" type="email" />
      <p>We will send you instructions to your email.</p>
      <Button type="submit" disabled={pristine || submitting}>Send</Button>
    </form>
  );
};

PasswordForgottenForm.propTypes = { ...formPropTypes };

const defaultFormName = 'PasswordForgottenForm';

export default reduxForm({ form: defaultFormName })(PasswordForgottenForm);
