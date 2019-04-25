module.exports = (message, statusCode, args) => {
  const obj = {};

  Object.assign(obj, {
    message: message,
    statusCode: statusCode
  });

  if (args) {
    Object.assign(obj, args);
  }

  return Object.assign(new Error(), obj);
};
