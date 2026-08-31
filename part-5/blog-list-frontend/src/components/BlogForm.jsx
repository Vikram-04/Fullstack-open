import { useState } from 'react'
const BlogForm = ({ addBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [likes, setLikes] = useState('')
  const handleSubmit = (event) => {
    event.preventDefault()
    addBlog({ title, author, likes, url })
    setTitle('')
    setAuthor('')
    setUrl('')
    setLikes('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add blogs</h2>
      <div>
        <label>
          title:
          <input
            value={title}
            onChange={(event) => {
              setTitle(event.target.value)
            }}
            type="text"
          ></input>
        </label>
      </div>

      <div>
        <label>
          author:
          <input
            value={author}
            onChange={(event) => {
              setAuthor(event.target.value)
            }}
            type="text"
          ></input>
        </label>
      </div>

      <div>
        <label>
          url:
          <input
            value={url}
            onChange={(event) => {
              setUrl(event.target.value)
            }}
            type="text"
          ></input>
        </label>
      </div>

      <div>
        <label>
          likes:
          <input
            value={likes}
            onChange={(event) => {
              setLikes(event.target.value)
            }}
            type="text"
          ></input>
        </label>
      </div>

      <button type="submit">Add</button>
    </form>
  )
}
export default BlogForm
