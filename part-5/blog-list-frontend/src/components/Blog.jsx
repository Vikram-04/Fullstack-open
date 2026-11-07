import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Paper,
  Typography,
} from "@mui/material";
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
    <Card variant="outlined" component={Paper}>
      <CardContent>
        <Typography variant="h4" component="div">
          {blog.title}
        </Typography>
        <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
          by {blog.author}
        </Typography>
        <Typography variant="body2">
          <Button component="a" href={blog.url} sx={{ textTransform: "none" }}>
            {blog.url}
          </Button>
        </Typography>
        <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
          Added by {blog.user.name}
        </Typography>
        <Typography component="div">{blog.likes} Likes</Typography>
        {user && (
          <Button
            onClick={likeBlog}
            variant="outlined"
            sx={{ color: "blue", borderColor: "blue", mt: 1 }}
          >
            Like
          </Button>
        )}
        {user && user.username === blog.user.username && (
          <Button
            variant="outlined"
            onClick={deleteBlog}
            sx={{ color: "red", borderColor: "red", ml: 1, mt: 1 }}
          >
            Delete
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
export default Blog;
