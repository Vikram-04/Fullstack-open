const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const loginRouter = require("express").Router();
const User = require("../models/user");
const { mongoosePopulatedDocumentMarker } = require("mongoose");
loginRouter.post("/", async (request, response) => {
  const { username, password } = request.body;
  const user = await User.findOne({ username: username });
  const passwordCorrect =
    user == null ? false : await bcrypt.compare(password, user.passwordHash);
  if (!(user && passwordCorrect)) {
    return response.status(401).json({ error: "invalid username or password" });
  }
  const tokenForUser = { username: username, id: user._id };
  const token = jwt.sign(tokenForUser, process.env.SECRET);
  response.json({ token: token, username: username, name: user.name });
});
module.exports = loginRouter;
