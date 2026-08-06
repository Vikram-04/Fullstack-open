const logger = require("./logger");

const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: "unknown endpoint" });
};
const ErrorHandler = (error, request, response, next) => {
  logger.error("Error: ", error);
  if (error.name === "ValidationError") {
    response.status(400).json({ error: "title and url must exist" });
  } else if (error.name === "CastError") {
    response.status(400).json({ error: "invalid id" });
  }
  next(error);
};
const middleware = { unknownEndpoint, ErrorHandler };
module.exports = middleware;
