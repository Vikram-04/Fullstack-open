const { describe, test, expect, beforeEach } = require("@playwright/test");
const { loginWith, createBlog } = require("./helper");
describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");
    await request.post("/api/users", {
      data: { username: "Vikram-04", name: "Vikram", password: "abcd" },
    });
    await page.goto("http://localhost:5173");
  });
  test("Login form is shown", async ({ page }) => {
    await expect(page.getByText("log in to application")).toBeVisible();
  });
  describe("Login", () => {
    test("succeeds with right credentials", async ({ page }) => {
      await loginWith(page, "Vikram-04", "abcd");
      await expect(page.getByText("Vikram logged in")).toBeVisible();
    });
    test("fails with wrong credentials", async ({ page }) => {
      await loginWith(page, "Vikram-04", "wrong");
      const errorDiv = page.getByText("invalid credentials");
      await expect(errorDiv).toHaveCSS("color", "rgb(255, 0, 0)");
      await expect(page.getByText("Vikram logged in")).not.toBeVisible();
    });
  });
  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "Vikram-04", "abcd");
    });
    test("new blog can be created", async ({ page }) => {
      await createBlog(page, "Title 1", "Author 1", "url 1", "0");
      await expect(page.getByText("Title 1 - Author 1showurl")).toBeVisible();
    });
    describe("and a blog exists", () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, "Title 1", "Author 1", "url 1", "0");
      });
      test("blog can be liked", async ({ page }) => {
        await page.getByRole("button", { name: "show" }).click();
        await expect(page.getByText("likes: 0")).toBeVisible();
        await page.getByRole("button", { name: "Like" }).click();
        await expect(page.getByText("likes: 1")).toBeVisible();
      });
    });
  });
});
