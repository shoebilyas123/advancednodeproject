const redis = require("redis");
const { promisify } = require("util");
const mongoose = require("mongoose");

const redisURL = "redis://127.0.0.1:6379";
const client = redis.createClient(redisURL);
client.hget = promisify(client.hget);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function (options = {}) {
  this.useCache = true;
  this._hashK = JSON.stringify(options.key || "default#22375_s33df44674511");
  return this;
};

mongoose.Query.prototype.exec = async function () {
  if (!this.useCache) {
    return exec.apply(this, arguments);
  }

  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name,
    })
  );

  const cacheValue = await client.hget(this._hashK, key);
  if (cacheValue) {
    const doc = JSON.parse(cacheValue);
    return Array.isArray(doc)
      ? doc.map((d) => new this.model(d))
      : new this.model(doc);
  } else {
    const result = await exec.apply(this, arguments);

    client.hset(this._hashK, key, JSON.stringify(result));
    return result;
  }
};
