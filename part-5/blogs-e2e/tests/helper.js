const loginWith = async (page, username, password) => {
  await page.getByLabel("username").fill(username);
  await page.getByLabel("password").fill(password);
  await page.getByRole("button", { name: "Login" }).click();
};
const createBlog = async (page, title, author, url, likes) => {
  await page.getByRole("button", { name: "Add Blog" }).click();
  await page.getByRole("textbox", { name: "title:" }).fill(title);
  await page.getByRole("textbox", { name: "author:" }).fill(author);
  await page.getByRole("textbox", { name: "url:" }).fill(url);
  await page.getByRole("textbox", { name: "likes:" }).fill(likes);
  await page.getByRole("button", { name: "Add" }).click();
};
module.exports = { loginWith, createBlog };
