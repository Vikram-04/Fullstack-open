const { describe, test } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");
const blog = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
];
const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
];
const singleAuthor = [
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
];
describe("total likes", () => {
  test("of empty blogs", () =>
    assert.strictEqual(listHelper.totalLikes([]), 0));
  test("of one blog", () => assert.strictEqual(listHelper.totalLikes(blog), 7));
  test("of many blogs", () =>
    assert.strictEqual(listHelper.totalLikes(blogs), 36));
});

describe("favourite blog", () => {
  test("among 0 blogs is null", () => {
    assert.equal(listHelper.favoriteBlog([]), null);
  });
  test("among single blog is blog itself", () => {
    assert.deepEqual(listHelper.favoriteBlog(blog), blog[0]);
  });
  test("among many blogs is the blog with most likes", () => {
    assert.deepEqual(listHelper.favoriteBlog(blogs), {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0,
    });
  });
});

describe("most blogs", () => {
  test("when 0 blogs is null", () => {
    assert.equal(listHelper.mostBlogs([]), null);
  });
  test("when single author is author itself", () => {
    assert.deepEqual(listHelper.mostBlogs(singleAuthor), {
      author: "Edsger W. Dijkstra",
      blogs: 2,
    });
  });
  test("when many authors is author with most blogs", () => {
    assert.deepEqual(listHelper.mostBlogs(blogs), {
      author: "Robert C. Martin",
      blogs: 3,
    });
  });
});
describe("most likes", () => {
  test("when 0 blogs is null", () => {
    assert.equal(listHelper.mostLikes([]), null);
  });
  test("when single author is author itself", () => {
    assert.deepEqual(listHelper.mostLikes(singleAuthor), {
      author: "Edsger W. Dijkstra",
      likes: 17,
    });
  });
  test("when many authors is author with most likes", () => {
    assert.deepEqual(listHelper.mostLikes(blogs), {
      author: "Edsger W. Dijkstra",
      likes: 17,
    });
  });
});
