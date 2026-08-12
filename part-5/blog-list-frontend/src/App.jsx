import { useEffect, useState } from "react";
import loginService from "./services/login";
import blogService from "./services/blog";

const Blog = ({ blog }) => {
  const blogStyle = {
    paddingTop: "5px",
    fontSize: "15px",
  };
  return (
    <li style={blogStyle}>
      {blog.title} - {blog.author}
    </li>
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

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const [likes, setLikes] = useState("");
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
      setBlogs(initialBlogs);
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

  const loggedInUI = () => (
    <div>
      <form onSubmit={addBlog}>
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
      <ul>
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog}></Blog>
        ))}
      </ul>
    </div>
  );

  const addBlog = async (event) => {
    event.preventDefault();
    const newBlog = { title, author, url, likes };
    try {
      const savedblog = await blogService.create(newBlog);
      setBlogs(blogs.concat(savedblog));
      setMessage([
        `a new blog ${savedblog.title} by ${savedblog.author} added`,
        "green",
      ]);
      resetMessage();
      setTitle("");
      setAuthor("");
      setUrl("");
      setLikes("");
    } catch (e) {
      setMessage(`failed to add new blog`, "red");
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
