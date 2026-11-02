import { useEffect, useImperativeHandle, useRef, useState } from "react";
import loginService from "./services/login";
import blogService from "./services/blog";
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import { Link, Route, Routes, useNavigate } from "react-router";
import BlogList from "./components/BlogList";
import LoginForm from "./components/LoginForm";

function App() {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
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
  const navigate = useNavigate();
  const handleSubmit = async (username, password) => {
    try {
      const user = await loginService.login({ username, password });
      setUser(user);
      blogService.setToken(user.token);
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      navigate("/");
    } catch (e) {
      setMessage(["invalid credentials", "red"]);
      resetMessage();
      console.log(e);
    }
  };
  const padding = {
    padding: 5,
  };
  return (
    <div>
      <div>
        <Link to="/" style={padding}>
          Blogs
        </Link>
        {!user && (
          <Link to="/login" style={padding}>
            Login
          </Link>
        )}
        {user && (
          <button
            onClick={() => {
              window.localStorage.removeItem("loggedBlogAppUser");
              setUser(null);
            }}
          >
            Logout
          </button>
        )}
      </div>
      <Notification message={message[0]} color={message[1]}></Notification>
      <Routes>
        <Route path="/" element={<BlogList blogs={blogs} user={user} />} />
        <Route
          path="/login"
          element={<LoginForm handleSubmit={handleSubmit} />}
        />
      </Routes>
    </div>
  );
}

export default App;
