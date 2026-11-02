import { useRef } from "react";
import Blog from "./Blog";
import BlogForm from "./BlogForm";
import Togglable from "./Togglable";

const BlogList = ({ user, blogs }) => {
  const likeBlog = async (blog) => {
    const likedBlog = { ...blog, likes: blog.likes + 1 };
    try {
      const updatedBlog = await blogService.update(likedBlog);
      const sorted = blogs
        .map((b) => (b.id === blog.id ? updatedBlog : b))
        .sort((b1, b2) => b2.likes - b1.likes);
      setBlogs(sorted);
    } catch (e) {
      console.log(e);
      setMessage(["Failed to like blog", "red"]);
      resetMessage();
    }
  };

  const deleteBlog = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?"))
      try {
        await blogService.deleteBlog(id);
        setBlogs(blogs.filter((b) => b.id !== id));
      } catch (e) {
        console.log(e);
        setMessage(["Failed to delete blog", "red"]);
        resetMessage();
      }
  };

  const addBlog = async (newBlog) => {
    try {
      const savedblog = await blogService.create(newBlog);
      const sorted = blogs
        .concat(savedblog)
        .sort((b1, b2) => b2.likes - b1.likes);
      setBlogs(sorted);
      setMessage([
        `a new blog ${savedblog.title} by ${savedblog.author} added`,
        "green",
      ]);
      resetMessage();
      blogFormRef.current.toggleVisibility();
    } catch (e) {
      console.log(e);
      setMessage(["failed to add new blog", "red"]);
      resetMessage();
    }
  };
  const blogFormRef = useRef();
  return (
    <div>
      <h2>Blogs</h2>

      <Togglable buttonLabel="Add Blog" cancelLabel="Cancel" ref={blogFormRef}>
        <BlogForm addBlog={addBlog}></BlogForm>
      </Togglable>
      <ul>
        {blogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            deleteBlog={() => deleteBlog(blog.id)}
            likeBlog={() => likeBlog(blog)}
            user={user}
          ></Blog>
        ))}
      </ul>
    </div>
  );
};
export default BlogList;
