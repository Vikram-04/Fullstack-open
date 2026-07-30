const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, item) => sum + item["likes"], 0);
};

const favoriteBlog = (blogs) => {
  let fav = null;
  blogs.forEach((blog) => {
    if (!fav) {
      fav = blog;
    } else if (blog.likes > fav.likes) {
      fav = blog;
    }
  });
  return fav;
};

const mostBlogs = (blogs) => {
  let authors = {};
  blogs.forEach((blog) => {
    if (Object.hasOwn(authors, blog.author)) {
      authors[blog.author] += 1;
    } else {
      authors[blog.author] = 1;
    }
  });
  let most_blogs = null;
  for (const [author, blogs] of Object.entries(authors)) {
    if (!most_blogs) {
      most_blogs = { author: author, blogs: blogs };
    } else if (blogs > most_blogs.blogs) {
      most_blogs.author = author;
      most_blogs.blogs = blogs;
    }
  }
  return most_blogs;
};

const mostLikes = (blogs) => {
  let authors = {};
  blogs.forEach((blog) => {
    if (Object.hasOwn(authors, blog.author)) {
      authors[blog.author] += blog.likes;
    } else {
      authors[blog.author] = blog.likes;
    }
  });
  let most_liked = null;
  for (const [author, likes] of Object.entries(authors)) {
    if (!most_liked) {
      most_liked = { author: author, likes: likes };
    } else if (likes > most_liked.likes) {
      most_liked.author = author;
      most_liked.likes = likes;
    }
  }
  return most_liked;
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
