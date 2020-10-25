/**
 * API Redux middleware
 *
 * This middleware removes the REQUEST, SUCCESS, FAILURE boilerplate of Redux
 * actions with the API. To use it, dispatch an action with `CALL_API` as a key,
 * and inside, specify the parameters of the call.
 *
 * This middleware was based off of the example from the Redux repo:
 * https://github.com/reactjs/redux/blob/master/examples/real-world/src/middleware/api.js
 *
 */

 const apiMiddleware = (api) => ({ dispatch, getState }) => (next) => (action) => {
  const params = action.CALL_API;

  if (isUndefined(params)) {
    return next(action);
  }

  const {
    requestActionTypes,
    call,
    afterResponse = (response) => response,
    transformResponse = (response) => response,
  } = params;

  const actionWith = (data) => {
    const finalAction = { ...action, ...data };
    delete finalAction.CALL_API;
    return finalAction;
  };

  const [requestType, successType, failureType] = requestActionTypes;

  next(actionWith({ type: requestType }));

  const callPromise = call(api, dispatch, getState);

  return callPromise
    .then((response) => next(actionWith({
      type: successType,
      response: transformResponse(response),
    })))
    .then((successAction) => successAction.response)
    .then((response) => {
      afterResponse();
      return response;
    })
    .catch((error) => next(actionWith({ type: failureType, error })));
};

export default apiMiddleware;
