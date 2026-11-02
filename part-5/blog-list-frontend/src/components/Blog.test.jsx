import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import Blog from "./Blog";
const loggedInUser = { username: "Jack-04", name: "Jack" };
const loggedInUserBlog = {
  title: "how-to-prepare-for-q4-planning",
  author: "Daniel carnegie",
  url: "https://www.dalecarnegie.com/blog/how-to-prep",
  likes: 3,
  user: loggedInUser,
};
const otherUserBlog = {
  title: "An Open Letter to A Communal Brown Person Who Condemns Racism",
  author: " Mekhala Saran",
  url: "https://www.thequint.com/voices/blogs/an-open-letter-to-a-communal-brown-person-who-condemns-racism",
  likes: 0,
  user: { name: "Vicky", username: "Vicky-28" },
};

test("Blog information and the number of likes are displayed to unauthenticated users, buttons are not displayed", () => {
  render(<Blog blog={otherUserBlog} user={null}></Blog>);
  screen.getByText(otherUserBlog.title, { exact: false });
  screen.getByText(otherUserBlog.author, { exact: false });
  screen.getByText(otherUserBlog.url, { exact: false });
  screen.getByText(`likes: ${otherUserBlog.likes}`, { exact: false });
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
});

test("Authenticated users who are not the blog’s creator are shown only the like button", async () => {
  render(<Blog blog={otherUserBlog} user={loggedInUser}></Blog>);
  expect(screen.getByRole("button", { name: "Like" })).toBeVisible();
  expect(
    screen.queryByRole("button", { name: "Delete" }),
  ).not.toBeInTheDocument();
});
test("The blog’s creator is also shown the delete button", async () => {
  render(<Blog blog={loggedInUserBlog} user={loggedInUser} />);
  expect(screen.getByRole("button", { name: "Like" })).toBeVisible();
  expect(screen.getByRole("button", { name: "Delete" })).toBeVisible();
});
