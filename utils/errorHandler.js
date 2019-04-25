const logger = require("./logger");

module.exports = (err, req, res, next) => {
  let errorResponse = {};

  const errReqObject = {
    startTime: req._startTime,
    method: req.method,
    url: req.url,
    params: req.params,
    query: req.query,
    body: req.body,
    headers: req.headers
  };

  const errStack = {
    errStack: err.stack
  };

  Object.assign(err, errReqObject);

  Object.assign(err, errStack);

  logger.error(err);

  errorResponse.type = err.type ? err.type : "Error";

  errorResponse.message = err.message
    ? err.message
    : "Oops! Something went wrong!";

  if (err.validationErrors) {
    errorResponse.validationErrors = err.validationErrors;
  }

  const errorStatusCode = err.statusCode ? err.statusCode : 500;

  if (process.env.NODE_ENV === "dev") {
    console.log(req);
    console.log(err);
    console.log("=========");
    errorResponse.reqInfo = errReqObject;
    if (err.validationErrorObject) {
      errorResponse.validationErrorObject = err.validationErrorObject;
    }
  }

  res.status(errorStatusCode).send(errorResponse);
};
