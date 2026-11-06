const { describe, test, expect, beforeEach } = require("@playwright/test");
const { loginWith, createBlog } = require("./helper");
describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");
    await request.post("/api/users", {
      data: { username: "Vikram-04", name: "Vikram", password: "abcd" },
    });
    await page.goto("/");
    await expect(page).toHaveURL("/");
  });
  test("Blog list is shown", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Blogs" })).toBeVisible();
  });
  describe("Login", () => {
    test("succeeds with right credentials", async ({ page }) => {
      await loginWith(page, "Vikram-04", "abcd");
      await expect(page).toHaveURL("/");
    });
    test("fails with wrong credentials", async ({ page }) => {
      await loginWith(page, "Vikram-04", "wrong");
      const errorDiv = page.getByText("invalid credentials");
      await expect(errorDiv).toHaveCSS("color", "rgb(255, 0, 0)");
      await expect(page).toHaveURL("/login");
    });
  });
  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "Vikram-04", "abcd");
      await expect(page).toHaveURL("/");
    });
    test("new blog can be created", async ({ page }) => {
      await createBlog(page, "Title 1", "Author 1", "url 1");
      await expect(page).toHaveURL("/");
      await expect(page.getByRole("link", { name: "Title 1" })).toBeVisible();
    });
    describe("and a blog exists", () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, "Title 1", "Author 1", "url 1");
        await expect(page).toHaveURL("/");
        await page.getByRole("link", { name: "Title 1" }).click();
        await expect(page).toHaveURL(/\/blogs\/[\w-]+/);
      });
      test("blog can be liked", async ({ page }) => {
        await expect(page.getByText("likes: 0")).toBeVisible();
        await page.getByRole("button", { name: "Like" }).click();
        await expect(page.getByText("likes: 1")).toBeVisible();
      });

      test("then it can be deleted", async ({ page }) => {
        page.on("dialog", async (dialog) => {
          await dialog.accept(); // Clicks "OK"
        });
        await page.getByRole("button", { name: "delete" }).click();
        await expect(page).toHaveURL("/");
        await expect(
          page.getByRole("link", { name: "Title 1" }),
        ).not.toBeVisible();
      });
    });
    describe("and many blogs exist", () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, "Title 1", "Author 1", "url 1", "0");
        await createBlog(page, "Title 2", "Author 2", "url 2", "4");
        await createBlog(page, "Title 3", "Author 3", "url 3", "3");
        await createBlog(page, "Title 4", "Author 4", "url 4", "5");
      });
      test("blogs are arranged in decreasing order of likes", async ({
        page,
      }) => {
        await page
          .locator(".blog")
          .nth(0)
          .getByRole("button", { name: "show" })
          .click();
        await expect(
          page.locator(".blog").nth(0).getByText("likes: 5"),
        ).toBeVisible();
        await page
          .locator(".blog")
          .nth(1)
          .getByRole("button", { name: "show" })
          .click();
        await expect(
          page.locator(".blog").nth(1).getByText("likes: 4"),
        ).toBeVisible();
        await page
          .locator(".blog")
          .nth(2)
          .getByRole("button", { name: "show" })
          .click();
        await expect(
          page.locator(".blog").nth(2).getByText("likes: 3"),
        ).toBeVisible();
        await page
          .locator(".blog")
          .nth(3)
          .getByRole("button", { name: "show" })
          .click();
        await expect(
          page.locator(".blog").nth(3).getByText("likes: 0"),
        ).toBeVisible();
      });
    });
  });
  describe("other user's blog exists", () => {
    beforeEach(async ({ page, request }) => {
      await request.post("/api/users", {
        data: { username: "Vikram-05", name: "Vikram", password: "wxyz" },
      });
      await loginWith(page, "Vikram-05", "wxyz");
      await createBlog(page, "User 2 blog", "Author 1", "url 1", "0");
      await page.getByRole("button", { name: "logout" }).click();
      await loginWith(page, "Vikram-04", "abcd");
    });
    test("other user's blog cannot be deleted", async ({ page }) => {
      await page.getByRole("button", { name: "show" }).click();
      await expect(
        page.getByRole("button", { name: "delete" }),
      ).not.toBeVisible();
    });
  });
});
