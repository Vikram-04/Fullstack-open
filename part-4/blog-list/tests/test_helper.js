const { init } = require("../app");
const Blog = require("../models/blog");
const User = require("../models/user");
const initialBlogs = [
  {
    title: "Blog 1",
    author: "Vicky Shakespeare",
    url: "url 1",
    likes: 10,
  },
  {
    title: "Blog 2",
    author: "James clear",
    url: "url 2",
    likes: 3,
  },
  {
    title: "Blog 3",
    author: "Walter issacson",
    url: "url 3",
    likes: 42,
  },
];

const nonExistingId = async () => {
  const blog = await new Blog(initialBlogs[0]).save();
  const id = blog.id;
  await Blog.findByIdAndDelete(id);
  return id;
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((b) => b.toJSON());
};

const users = [
  {
    username: "root",
    name: "someone",
    password: "password1",
  },
  {
    username: "username2",
    name: "someone",
    password: "password2",
  },
  {
    name: "anyone",
    password: "password3",
  },
  {
    username: "username4",
    name: "no one",
    password: "pa",
  },
  {
    username: "root",
    name: "Vikram",
    password: "jdiwbdk",
  },
];
const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = { initialBlogs, nonExistingId, blogsInDb, users, usersInDb };
