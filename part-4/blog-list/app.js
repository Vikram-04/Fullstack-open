const express = require("express");
const mongoose = require("mongoose");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");
const blogsRouter = require("./controllers/blogs");
const config = require("./utils/config");
const morgan = require("morgan");

const app = express();

const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);
mongoose
  .connect(config.MONGODB_URI, { family: 4 })
  .then(() => {
    logger.info("connected to mongodb");
  })
  .catch((error) => logger.error(error));

app.use(express.json());
app.use(morgan("dev"));

app.use("/api/blogs", blogsRouter);

app.use(middleware.unknownEndpoint);

module.exports = app;
