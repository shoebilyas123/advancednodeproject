const redis = require("redis");
const { promisify } = require("util");
const configKeys = require("../config/keys");

const client = redis.createClient(configKeys.redisURL);
client.hget = promisify(client.hget);

exports.clearCache = async (req, res, next) => {
  await next();
  client.del(JSON.stringify(req.user.id));
};
