require("dotenv").config();
const jwt = require("jsonwebtoken");
const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const middleware = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate("user", {
    username: 1,
    name: 1,
  });
  response.json(blog);
});

blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
  body = request.body;
  const user = request.user;
  const newBlog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  });

  const savedBlog = await newBlog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  response.status(201).json(savedBlog);
});

blogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response) => {
    const blog = await Blog.findById(request.params.id);
    if (!blog)
      return response
        .status(404)
        .json({ error: `blog with id ${request.params.id} does not exist` });
    const user = request.user;
    if (blog.user._id.toString() !== user._id.toString()) {
      return response.status(401).json({ error: "unauthorized operation" });
    }
    await blog.deleteOne();
    response.status(204).end();
  },
);

blogsRouter.put("/:id", async (request, response) => {
  const blog = await Blog.findByIdAndUpdate(request.params.id, request.body, {
    returnDocument: "after",
    runValidators: true,
  });
  if (!blog) return response.status(404).end();
  response.json(blog);
});

module.exports = blogsRouter;
