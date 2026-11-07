import { useEffect, useImperativeHandle, useRef, useState } from "react";
import loginService from "./services/login";
import blogService from "./services/blog";
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import { Link, Route, Routes, useMatch, useNavigate } from "react-router";
import BlogList from "./components/BlogList";
import LoginForm from "./components/LoginForm";
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";

function App() {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);

  function resetMessage() {
    setTimeout(() => {
      setMessage(null);
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
      setMessage({ content: "Invalid credentials", type: "failure" });
      resetMessage();
      console.log(e);
    }
  };
  const padding = {
    padding: 5,
  };
  const match = useMatch("/blogs/:id");
  const blog = match ? blogs.find((b) => b.id == match.params.id) : null;

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
      setMessage({ content: "Failed to like blog", type: "failure" });
      resetMessage();
    }
  };

  const deleteBlog = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?"))
      try {
        await blogService.deleteBlog(id);
        setBlogs(blogs.filter((b) => b.id !== id));
        navigate("/");
      } catch (e) {
        console.log(e);
        setMessage({ content: "Failed to delete blog", type: "failure" });
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
      setMessage({
        content: `New blog ${savedblog.title} by ${savedblog.author} added`,
        type: "success",
      });
      navigate("/");
      resetMessage();
    } catch (e) {
      console.log(e);
      setMessage({ content: "Failed to add new blog", type: "failure" });
      resetMessage();
    }
  };
  const style = { "&:hover": { bgcolor: "rgba(255,255,255,0.3)" } };
  return (
    <Container>
      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar>
          <Typography variant="h6" component="div">
            Blog App
          </Typography>
          <Box sx={{ ml: "auto", display: "flex", gap: 2 }}>
            <Button color="inherit" component={Link} to="/" sx={style}>
              Blogs
            </Button>
            {user && (
              <Button
                color="inherit"
                component={Link}
                to="/blogs/create"
                sx={style}
              >
                New blog
              </Button>
            )}
            {!user && (
              <Button component={Link} color="inherit" sx={style} to="/login">
                Login
              </Button>
            )}
            {user && (
              <Button
                color="inherit"
                sx={style}
                onClick={() => {
                  window.localStorage.removeItem("loggedBlogAppUser");
                  setUser(null);
                  navigate("/");
                }}
              >
                Logout
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Notification message={message} />
      <Routes>
        <Route
          path="/blogs/create"
          element={<BlogForm addBlog={addBlog}></BlogForm>}
        />
        <Route
          path="/blogs/:id"
          element={
            <Blog
              blog={blog}
              deleteBlog={() => deleteBlog(blog.id)}
              likeBlog={() => likeBlog(blog)}
              user={user}
            />
          }
        />
        <Route path="/" element={<BlogList blogs={blogs} user={user} />} />
        <Route
          path="/login"
          element={<LoginForm handleSubmit={handleSubmit} />}
        />
      </Routes>
    </Container>
  );
}

export default App;
