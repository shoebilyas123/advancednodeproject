const buffer = require("safe-buffer").Buffer;
const KeyGrip = require("keygrip");
const keys = require("../../config/keys");
const key = new KeyGrip([keys.cookieKey]);

module.exports = (user) => {
  const sessionObject = { passport: { user: user._id.toString() } };
  const session = buffer.from(JSON.stringify(sessionObject)).toString("base64");

  const sig = key.sign("session=" + session);

  return { signature: sig, session };
};
