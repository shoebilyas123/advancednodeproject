const puppeteer = require("puppeteer");
const sessionFactory = require("../factories/sessionFactory");
const userFactory = require("../factories/userFactory");

class Page {
  static async build() {
    const browser = await puppeteer.launch({
      headless: true,
    });
    const browserPage = await browser.newPage();

    const customPage = new Page(browserPage);

    return new Proxy(customPage, {
      get: function (target, property) {
        return (
          customPage[property] || browser[property] || browserPage[property]
        );
      },
    });
  }

  constructor(page) {
    this.page = page;
  }

  async login() {
    const user = await userFactory();
    const { signature, session } = sessionFactory(user);

    await this.page.setCookie({
      name: "session",
      value: session,
    });
    await this.page.setCookie({
      name: "session.sig",
      value: signature,
    });
    await this.page.goto("http://localhost:3000/blogs");
    await this.page.waitFor('a[href="/auth/logout"]');
  }
  async getContentsOf(selectorText) {
    return await this.page.$eval(selectorText, (el) => el.innerHTML);
  }

  async getContentsofAll(selectorText) {
    return await this.page.$$(selectorText, (elems) =>
      elems.map((el) => el.innerHTML)
    );
  }
}

module.exports = Page;
