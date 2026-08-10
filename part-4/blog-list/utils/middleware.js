const jwt = require("jsonwebtoken");
const logger = require("./logger");
const User = require("../models/user");

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
  } else if (error.name === "JsonWebTokenError") {
    response.status(401).json({ error: "invalid token" });
  }
  next(error);
};

const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    request.token = authorization.replace("Bearer ", "");
  } else request.token = null;
  next();
};

const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "invalid token" });
  }
  const user = await User.findById(decodedToken.id);
  if (!user) {
    return response.status(401).json({ error: "missing or invalid user id" });
  }
  request.user = user;
  next();
};

const middleware = {
  unknownEndpoint,
  ErrorHandler,
  tokenExtractor,
  userExtractor,
};
module.exports = middleware;
