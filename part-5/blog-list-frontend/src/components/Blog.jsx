import Togglable from './Togglable'
const Blog = ({ blog, deleteBlog, likeBlog, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }
  return (
    <div>
      <li style={blogStyle}>
        {blog.title} - {blog.author}
        <Togglable buttonLabel="show" cancelLabel="hide">
          {blog.url}
          <br></br>
          likes: {blog.likes}
          <button onClick={likeBlog}>Like</button>
          <br></br>
          {blog.user.name}
        </Togglable>
        {user.username === blog.user.username && (
          <button onClick={deleteBlog}>Delete</button>
        )}
      </li>
    </div>
  )
}
export default Blog
