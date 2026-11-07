import { useState } from "react";
import { Button, TextField } from "@mui/material";
const BlogForm = ({ addBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const handleSubmit = (event) => {
    event.preventDefault();
    addBlog({ title, author, url });
    setTitle("");
    setAuthor("");
    setUrl("");
  };
  const style = { marginTop: 10 };
  return (
    <form onSubmit={handleSubmit}>
      <h2>Add blogs</h2>
      <div>
        <TextField
          style={style}
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
          }}
          type="text"
          label="Title "
          variant="standard"
        ></TextField>
      </div>

      <div>
        <TextField
          style={style}
          value={author}
          onChange={(event) => {
            setAuthor(event.target.value);
          }}
          variant="standard"
          type="text"
          label="Author"
        ></TextField>
      </div>

      <div>
        <TextField
          style={style}
          variant="standard"
          value={url}
          onChange={(event) => {
            setUrl(event.target.value);
          }}
          type="text"
          label="URL"
        ></TextField>
      </div>
      <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
        Add
      </Button>
    </form>
  );
};
export default BlogForm;
