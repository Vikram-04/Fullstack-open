const { init } = require("../app");
const Blog = require("../models/blog");
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

module.exports = { initialBlogs, nonExistingId, blogsInDb };
