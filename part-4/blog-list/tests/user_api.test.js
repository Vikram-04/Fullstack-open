const supertest = require("supertest");
const app = require("../app");
const { describe, beforeEach, test, after } = require("node:test");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const helper = require("./test_helper");
const { default: mongoose } = require("mongoose");
const assert = require("node:assert");
const api = supertest(app);

describe("when there is one user initially", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const { username, name, password } = helper.users[0];
    const user = new User({
      username,
      name,
      passwordHash: await bcrypt.hash(password, 10),
    });
    await user.save();
  });
  test("valid user can be created", async () => {
    const usersBefore = await helper.usersInDb();
    const newUser = helper.users[1];
    await api.post("/api/users").send(newUser).expect(201);
    const usersAfter = await helper.usersInDb();
    assert.strictEqual(usersAfter.length, usersBefore.length + 1);
    const usernames = usersAfter.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });
  test("invalid username fails with 400", async () => {
    const usersBefore = await helper.usersInDb();
    const newUser = helper.users[2];
    const response = await api.post("/api/users").send(newUser).expect(400);
    assert(response.body.error.includes("missing or invalid username"));
    const usersAfter = await helper.usersInDb();
    assert.strictEqual(usersAfter.length, usersBefore.length);
  });
  test("invalid password fails with 400", async () => {
    const usersBefore = await helper.usersInDb();
    const newUser = helper.users[3];
    const response = await api.post("/api/users").send(newUser).expect(400);
    assert(response.body.error.includes("missing or invalid password"));
    const usersAfter = await helper.usersInDb();
    assert.strictEqual(usersAfter.length, usersBefore.length);
  });
  test("existing username fails with 409", async () => {
    const usersBefore = await helper.usersInDb();
    const newUser = helper.users[4];
    const response = await api.post("/api/users").send(newUser).expect(409);
    assert(response.body.error.includes("username already exists"));
    const usersAfter = await helper.usersInDb();
    assert.strictEqual(usersAfter.length, usersBefore.length);
  });
});
after(async () => {
  mongoose.connection.close();
});
