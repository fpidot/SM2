/**
 * ================ API error handling utilities ================
 *
 * This module exports helpers that can be used to check if API
 * response errors are some specific error cases.
 *
 * NOTE: most of the functions are tied to an endpoint, and should not
 * be used to check error responses from any other endpoint. Check the
 * name and the docstring of the function to ensure correct usage.
 */

import {
  ERROR_CODE_TRANSACTION_LISTING_NOT_FOUND,
  ERROR_CODE_TRANSACTION_INVALID_TRANSITION,
  ERROR_CODE_TRANSACTION_ALREADY_REVIEWED_BY_CUSTOMER,
  ERROR_CODE_TRANSACTION_ALREADY_REVIEWED_BY_PROVIDER,
  ERROR_CODE_PAYMENT_FAILED,
  ERROR_CODE_EMAIL_TAKEN,
  ERROR_CODE_EMAIL_NOT_FOUND,
  ERROR_CODE_EMAIL_NOT_VERIFIED,
  ERROR_CODE_TOO_MANY_VERIFICATION_REQUESTS,
  ERROR_CODE_UPLOAD_OVER_LIMIT,
} from './propTypes';

const errorAPIErrors = error => {
  return error && error.apiErrors ? error.apiErrors : [];
};

const hasErrorWithCode = (error, code) => {
  return errorAPIErrors(error).some(apiError => {
    return apiError.code === code;
  });
};

/**
 * return apiErrors from error response
 */
const responseAPIErrors = error => {
  return error && error.data && error.data.errors ? error.data.errors : [];
};

/**
 * Check if the given API error (from `sdk.currentuser.create()`) is
 * due to the email address already being in use.
 */
export const isSignupEmailTakenError = error => hasErrorWithCode(error, ERROR_CODE_EMAIL_TAKEN);

/**
 * Check if the given API error (from `sdk.currentuser.changeEmail()`) is
 * due to the email address already being in use.
 */
export const isChangeEmailTakenError = error => hasErrorWithCode(error, ERROR_CODE_EMAIL_TAKEN);

/**
 * Check if the given API error (from
 * `sdk.currentUser.sendVerificationEmail()`) is due to too many
 * active email verification requests.
 *
 * There qre only a specific amount of active verification requests
 * allowed, and the user has to wait for them to expire to be able to
 * request sending new verification emails.
 */
export const isTooManyEmailVerificationRequestsError = error =>
  hasErrorWithCode(error, ERROR_CODE_TOO_MANY_VERIFICATION_REQUESTS);

/**
 * Check if the given API error (from
 * `sdk.images.uploadListingImage()`) is due to the image being over
 * the size limit.
 */
export const isUploadListingImageOverLimitError = error =>
  hasErrorWithCode(error, ERROR_CODE_UPLOAD_OVER_LIMIT);

/**
 * Check if the given API error (from
 * `sdk.images.uploadProfileImage()`) is due to the image being over
 * the size limit.
 */
export const isUploadProfileImageOverLimitError = error =>
  hasErrorWithCode(error, ERROR_CODE_UPLOAD_OVER_LIMIT);

/**
 * Check if the given API error (from `sdk.passwordReset.request()`)
 * is due to no user having the given email address.
 */
export const isPasswordRecoveryEmailNotFoundError = error =>
  hasErrorWithCode(error, ERROR_CODE_EMAIL_NOT_FOUND);

/**
 * Check if the given API error (from `sdk.passwordReset.request()`)
 * is due to the email not being verified, preventing the reset.
 */
export const isPasswordRecoveryEmailNotVerifiedError = error =>
  hasErrorWithCode(error, ERROR_CODE_EMAIL_NOT_VERIFIED);

/**
 * Check if the given API error (from `sdk.transaction.initiate()` or
 * `sdk.transaction.initiateSpeculative()`) is due to the listing
 * being closed or deleted.
 */
export const isTransactionInitiateListingNotFoundError = error =>
  hasErrorWithCode(error, ERROR_CODE_TRANSACTION_LISTING_NOT_FOUND);

/**
 * Check if the given API error (from `sdk.transaction.initiate()`) is
 * due to the transaction total amount being too low for Stripe.
 */
export const isTransactionInitiateAmountTooLowError = error => {
  return responseAPIErrors(error).some(apiError => {
    const isPaymentFailedError =
      apiError.status === 402 && apiError.code === ERROR_CODE_PAYMENT_FAILED;
    let isAmountTooLow = false;

    try {
      // TODO: This is a temporary solution until a proper error code
      // for this specific error is received in the response.
      const msg = apiError.meta.stripe_message;
      isAmountTooLow =
        msg.startsWith('Amount must be at least') ||
        msg.startsWith('Amount must convert to at least');
    } catch (e) {
      // Ignore
    }

    return isPaymentFailedError && isAmountTooLow;
  });
};

/**
 * Check if the given API error (from `sdk.transactions.transition(id, transition, params)`)
 * is due to invalid transition attempt.
 */
export const isTransactionsTransitionInvalidTransition = error =>
  error &&
  error.status === 409 &&
  hasErrorWithCode(error, ERROR_CODE_TRANSACTION_INVALID_TRANSITION);

/**
 * Check if the given API error (from `sdk.transactions.transition(id, transition, params)`)
 * is due to already sent review.
 */
export const isTransactionsTransitionAlreadyReviewed = error =>
  error &&
  error.status === 409 &&
  (hasErrorWithCode(error, ERROR_CODE_TRANSACTION_ALREADY_REVIEWED_BY_CUSTOMER) ||
    hasErrorWithCode(error, ERROR_CODE_TRANSACTION_ALREADY_REVIEWED_BY_PROVIDER));

/**
 * Check if the given API error (from `sdk.currentUser.changeEmail(params)`)
 * is due to giving wrong password.
 */
export const isChangeEmailWrongPassword = error => error && error.status === 403;

/**
 * Check if the given API error (from `sdk.currentUser.changePassword(params)`)
 * is due to giving wrong password.
 */
export const isChangePasswordWrongPassword = error => error && error.status === 403;


/**
 * Check if the given API error (from
 * 'sdk.currentUser.createStripeAccount(payoutDetails)') is due to
 * invalid postal code in the given country.
*/
export const isStripeInvalidPostalCode = error => {
  const msgRe = /^Invalid [A-Z]{2} postal code$/;
  return errorAPIErrors(error).some(apiError => {
    // Stripe doesn't seem to give an error code for this specific
    // case, so we have to recognize it from the message.
    const msg = apiError.meta && apiError.meta.stripe_message ? apiError.meta.stripe_message : '';
    return msgRe.test(msg);
  });
};

export const storableError = error => {
  const { name, message, status, statusText } = error;
  // Status, statusText, and data.errors are (possibly) added to the error object by SDK
  const apiErrors = responseAPIErrors(error);

  // Returned object is the same as prop type check in util/proptypes -> error
  return {
    type: 'error',
    name,
    message,
    status,
    statusText,
    apiErrors,
  };
};
