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

describe("when there are initial notes", () => {
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
    const blogs = await helper.blogsInDb();
    assert("id" in blogs[0]);
    assert(!("_id" in blogs[0]));
  });
  describe("addition of new blog", () => {
    test("post creates a new blog", async () => {
      const newBlog = {
        title: "Blog 4",
        author: "Vikram",
        url: "url 4",
        likes: 21,
      };
      await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);
      const blogs = await helper.blogsInDb();
      assert.strictEqual(blogs.length, helper.initialBlogs.length + 1);
      const contents = blogs.map((blog) => blog.title);
      assert(contents.includes(newBlog.title));
    });
    test("likes defaults to 0", async () => {
      const newBlog = {
        title: "Blog 4",
        author: "Vikram",
        url: "url 4",
      };
      await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);
      const blogs = await helper.blogsInDb();
      const blog = blogs.find((b) => b.title === newBlog.title);
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
  });
  describe("deletion of a blog", () => {
    test("succeeds if the id exists", async () => {
      const blogs = await helper.blogsInDb();
      const blogToDelete = blogs[0];
      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);
      const blogsAfter = await helper.blogsInDb();
      assert.strictEqual(blogsAfter.length, helper.initialBlogs.length - 1);
      const contents = blogsAfter.map((b) => b.title);
      assert(!contents.includes(blogToDelete.title));
    });
    test("fails with 404 if id does not exist", async () => {
      const id = await helper.nonExistingId();
      await api.delete(`/api/blogs/${id}`).expect(404);
    });
    test("fails with 400 if invalid id", async () => {
      const id = "5a3d5da59070081a82a3445";
      await api.delete(`/api/blogs/${id}`).expect(400);
    });
  });
  describe("updation of a blog", () => {
    test("succeed if id exists", async () => {
      const blogsBefore = await helper.blogsInDb();
      const blog = blogsBefore[0];
      blog.title = "Updated title";
      await api.put(`/api/blogs/${blog.id}`).send(blog).expect(200);
      const blogsAfter = await helper.blogsInDb();
      const updatedBlog = blogsAfter.find((b) => b.id === blog.id);
      assert.strictEqual(updatedBlog.title, blog.title);
    });
    test("fails with 404 if id does not exist", async () => {
      const id = await helper.nonExistingId();
      await api
        .put(`/api/blogs/${id}`)
        .send(helper.initialBlogs[0])
        .expect(404);
    });
    test("fails with 400 if id is invalid", async () => {
      const id = "5a3d5da59070081a82a3445";
      await api
        .put(`/api/blogs/${id}`)
        .send(helper.initialBlogs[0])
        .expect(400);
    });
  });
});

after(async () => {
  mongoose.connection.close();
});
