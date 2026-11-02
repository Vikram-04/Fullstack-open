import Togglable from "./Togglable";
const Blog = ({ blog, deleteBlog, likeBlog, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };
  if (!blog) {
    return null;
  }
  return (
    <div className="blog">
      <li style={blogStyle}>
        {blog.title} - {blog.author}
        <br />
        {blog.url}
        <br></br>
        <span>likes: {blog.likes}</span>
        {user && <button onClick={likeBlog}>Like</button>}
        <br></br>
        {blog.user.name}
        {user && user.username === blog.user.username && (
          <button onClick={deleteBlog}>Delete</button>
        )}
      </li>
    </div>
  );
};
export default Blog;
