import { useRef } from "react";
import { Link } from "react-router";
import {
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";

const BlogList = ({ blogs }) => {
  const blogFormRef = useRef();
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Blogs
        </Typography>

        <List>
          {blogs.map((blog) => (
            <ListItem key={blog.id} disablePadding>
              <ListItemButton
                component={Link}
                to={`/blogs/${blog.id}`}
                sx={{
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <ListItemText
                  primary={blog.title}
                  sx={{
                    color: "primary.main",
                    fontWeight: 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};
export default BlogList;
