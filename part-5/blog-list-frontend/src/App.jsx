import { useEffect, useImperativeHandle, useRef, useState } from "react";
import loginService from "./services/login";
import blogService from "./services/blog";

const Blog = ({ blog, deleteBlog, likeBlog, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };
  console.log(blog.user.name);
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
  );
};

const Notification = ({ message, color }) => {
  if (message === null) return null;
  const messageStyle = {
    border: `solid 2px ${color}`,
    color: `${color}`,
    padding: "5px",
    borderRadius: "5px",
    marginBottom: "20px",
    textAlign: "center",
    fontSize: "20px",
    marginInline: "30px",
    backgroundColor: "lightGray",
  };

  return <div style={messageStyle}>{message}</div>;
};

const Togglable = (props) => {
  const [visible, setVisible] = useState(false);
  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };
  const toggleVisibility = () => {
    setVisible(!visible);
  };
  useImperativeHandle(props.ref, () => {
    return { toggleVisibility };
  });
  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <br></br>
        <button onClick={toggleVisibility}>{props.cancelLabel}</button>
      </div>
    </div>
  );
};

const BlogForm = ({ addBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const [likes, setLikes] = useState("");
  const handleSubmit = (event) => {
    event.preventDefault();
    addBlog({ title, author, likes, url });
    setTitle("");
    setAuthor("");
    setUrl("");
    setLikes("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add blogs</h2>
      <div>
        <label>
          title:
          <input
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
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
              setAuthor(event.target.value);
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
              setUrl(event.target.value);
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
              setLikes(event.target.value);
            }}
            type="text"
          ></input>
        </label>
      </div>

      <button type="submit">Add</button>
    </form>
  );
};

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState([null, null]);

  function resetMessage() {
    setTimeout(() => {
      setMessage([null, null]);
    }, 5000);
  }

  useEffect(() => {
    const fetchBlogs = async () => {
      const initialBlogs = await blogService.getAll();
      const sorted = [...initialBlogs].sort((b1, b2) => b2.likes - b1.likes);
      setBlogs(sorted);
    };
    fetchBlogs();
  }, []);

  useEffect(() => {
    const loggedUser = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUser) {
      const user = JSON.parse(loggedUser);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const loginForm = () => (
    <form onSubmit={handleSubmit}>
      <h2>log in to application</h2>
      <div>
        <label>
          username:
          <input
            value={username}
            onChange={(event) => {
              setUsername(event.target.value);
            }}
            type="text"
          ></input>
        </label>
      </div>

      <div>
        <label>
          password:
          <input
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
            type="text"
          ></input>
        </label>
      </div>

      <button type="submit">Login</button>
    </form>
  );
  const blogFormRef = useRef();
  const loggedInUI = () => (
    <div>
      <h2>Blogs</h2>
      <p>{user.name} logged in</p>
      <button
        onClick={() => {
          window.localStorage.removeItem("loggedBlogAppUser");
          setUser(null);
        }}
      >
        Logout
      </button>
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

  const likeBlog = async (blog) => {
    const likedBlog = { ...blog, likes: blog.likes + 1 };
    try {
      const updatedBlog = await blogService.update(likedBlog);
      setBlogs(blogs.map((b) => (b.id === blog.id ? updatedBlog : b)));
    } catch (e) {
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
        setMessage(["Failed to delete blog", "red"]);
        resetMessage();
      }
  };

  const addBlog = async (newBlog) => {
    try {
      const savedblog = await blogService.create(newBlog);
      setBlogs(blogs.concat(savedblog));
      setMessage([
        `a new blog ${savedblog.title} by ${savedblog.author} added`,
        "green",
      ]);
      resetMessage();
      blogFormRef.current.toggleVisibility();
    } catch (e) {
      setMessage([`failed to add new blog`, "red"]);
      resetMessage();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      setUser(user);
      blogService.setToken(user.token);
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      setUsername("");
      setPassword("");
    } catch (e) {
      setMessage(["invalid credentials", "red"]);
      resetMessage();
      console.log(e);
    }
  };
  return (
    <div>
      <Notification message={message[0]} color={message[1]}></Notification>
      {!user && loginForm()}
      {user && loggedInUI()}
    </div>
  );
}

export default App;
