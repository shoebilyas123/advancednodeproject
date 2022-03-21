const Page = require("./helpers/page");

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto("http://localhost:3000");
});

afterEach(async () => {
  await page.close();
});

describe("When logged in", () => {
  beforeEach(async () => {
    await page.login();
    await page.click("a.btn-floating");
  });

  test("Can see create form", async () => {
    const label = await page.getContentsOf("form label");
    expect(label).toEqual("Blog Title");
  });

  describe("And using invalid inputs", () => {
    beforeEach(async () => {
      await page.click("form button");
    });

    test("the form shows error message", async () => {
      const title = await page.$eval(".title .red-text", (el) => el.innerHTML);
      const content = await page.$eval(
        ".content .red-text",
        (el) => el.innerHTML
      );

      expect(title).toMatch("You must provide a value");
      expect(content).toMatch("You must provide a value");
    });
  });

  describe("Using valid inputs", () => {
    beforeEach(async () => {
      await page.type(".title input", "Blog Title");
      await page.type(".content input", "Blog Content");
      await page.click("form button");
    });

    test("We are taken tot the review screen", async () => {
      const reviewTitle = await page.$eval("form h5", (el) => el.innerHTML);
      expect(reviewTitle).toMatch("Please confirm your entries");
    });

    test("Our new blog is addded to the index page", async () => {
      await page.click("button.green");
      await page.waitFor(".card");
      const cardTitle = await page.$eval(
        ".card-content .card-title",
        (el) => el.innerHTML
      );
      const cardPara = await page.$eval(
        ".card-content p",
        (el) => el.innerHTML
      );

      expect(cardTitle).toMatch("Blog Title");
      expect(cardPara).toMatch("Blog Content");
    });
  });
});
