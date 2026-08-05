const supertest = require("supertest");
const { describe, test, beforeEach, after } = require("node:test");
const app = require("../app");
const Blog = require("../models/blog");
const helper = require("./test_helper");
const blog = require("../models/blog");
const { default: mongoose } = require("mongoose");
const assert = require("node:assert");
const logger = require("../utils/logger");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  for (let blog of helper.initialBlogs) {
    const blogObj = new Blog(blog);
    await blogObj.save();
  }
});

test("all blogs are recieved", async () => {
  const response = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
  assert.strictEqual(response.body.length, helper.initialBlogs.length);
});

test("unique identifier is named id", async () => {
  const response = await api.get("/api/blogs");
  assert("id" in response.body[0]);
  assert(!("_id" in response.body[0]));
});

test("post creates a new blog", async () => {
  const newBlog = {
    title: "Blog 4",
    author: "Vikram",
    likes: 21,
  };
  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);
  const response = await api.get("/api/blogs");
  assert.strictEqual(response.body.length, helper.initialBlogs.length + 1);
  const contents = response.body.map((blog) => blog.title);
  assert(contents.includes(newBlog.title));
});

test("likes defaults to 0", async () => {
  const newBlog = {
    title: "Blog 4",
    author: "Vikram",
  };
  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);
  const response = await api.get("/api/blogs");
  const blog = response.body.find((b) => b.title === newBlog.title);
  assert.strictEqual(blog.likes, 0);
});

test("missing title returns 400", async () => {
  const newBlog = {
    url: "url 4",
    author: "Vikram",
    likes: 2,
  };
  await api.post("/api/blogs").send(newBlog).expect(400);
});

test("missing url returns 400", async () => {
  const newBlog = {
    title: "Blog 4",
    author: "Vikram",
    likes: 2,
  };
  await api.post("/api/blogs").send(newBlog).expect(400);
});

after(async () => {
  mongoose.connection.close();
});
