import axios from 'axios';
import { isNil } from 'lodash/fp';


const BASE_URL = process.env.REACT_APP_OPS_PORTAL_API_BASE_URL;

export const API_HTTP_CODES_TO_ERROR_MESSAGES = {
  401: 'Unable to authenticate with the server. Log out and try again.',
  403: 'You are not allowed to access this site.',
  404: 'Couldn\'t connect to the server.',
  500: 'There was an error with the server.',
};

/**
 * Transforms server errors into error messages that make sense to users
 */
export const transformServerError = (err) => {
  if (isNil(err) || isNil(err.response)) {
    return 'An unknown error occurred.';
  }

  const { response } = err;

  if (response && response.status && API_HTTP_CODES_TO_ERROR_MESSAGES[response.status]) {
    return API_HTTP_CODES_TO_ERROR_MESSAGES[response.status];
  }

  if (response && response.data && response.data.message) {
    return response.data.message;
  }

  return 'An unknown error occurred.';
};

/**
 * Our axios instance
 */
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  transformResponse: [
    ...axios.defaults.transformResponse,
    (data) => (data),
  ],
});
