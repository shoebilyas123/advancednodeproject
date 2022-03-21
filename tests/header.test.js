const Page = require("./helpers/page");

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto("http://localhost:3000");
});

afterEach(async () => {
  await page.close();
});

test("Header has the correct text", async () => {
  const text = await page.getContentsOf("a.brand-logo");
  expect(text).toEqual("Blogster");
});

test("Clicking login starts OAuth flow", async () => {
  let url = null;
  await page.click(".right a");
  url = await page.url();
  expect(url).toMatch(/accounts\.google\.com/);
});

test("When signed in, shows log out button", async () => {
  await page.login();
  const logoutText = await page.getContentsOf('a[href="/auth/logout"]');
  expect(logoutText).toEqual("Logout");
});
