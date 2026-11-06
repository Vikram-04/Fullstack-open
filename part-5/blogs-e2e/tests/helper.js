const { expect } = require("@playwright/test");
const loginWith = async (page, username, password) => {
  await page.goto("/login");
  await page.getByLabel("username").fill(username);
  await page.getByLabel("password").fill(password);
  await page.getByRole("button", { name: "Login" }).click();
};
const createBlog = async (page, title, author, url) => {
  await page.goto("/blogs/create");
  await page.getByRole("textbox", { name: "title:" }).fill(title);
  await page.getByRole("textbox", { name: "author:" }).fill(author);
  await page.getByRole("textbox", { name: "url:" }).fill(url);
  await page.getByRole("button", { name: "Add" }).click();
};
module.exports = { loginWith, createBlog };
