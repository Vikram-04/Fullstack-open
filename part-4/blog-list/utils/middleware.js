const logger = require("./logger");

const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: "unknown endpoint" });
};
const ErrorHandler = (error, request, response, next) => {
  logger.error("Error: ", error);
  if (error.name === "ValidationError") {
    if (request.path === "/api/blogs")
      response.status(400).json({ error: "title and url must exist" });
    else if (request.path === "/api/users")
      response.status(400).json({ error: "missing or invalid username" });
  } else if (error.name === "CastError") {
    response.status(400).json({ error: "invalid id" });
  } else if (
    error.name === "MongoServerError" &&
    error.message.includes("E11000 duplicate key error")
  ) {
    response.status(409).json({ error: "username already exists" });
  } else if (error.name === "TypeError" && error.message === "password error") {
    response.status(400).json({ error: "missing or invalid password" });
  }
  next(error);
};
const middleware = { unknownEndpoint, ErrorHandler };
module.exports = middleware;
