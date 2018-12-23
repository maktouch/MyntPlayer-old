const config = require('./config');
const Promise = require('bluebird');
const Redis = require('ioredis');
Redis.Promise = Promise;

const connections = {};

module.exports = function createRedis(identifier = 'default') {
  if (connections[identifier]) {
    return connections[identifier];
  }

  const retryStrategy = times => {
    const delay = Math.min(times * 100, 10000);
    return delay;
  };

  const redisConfig = {
    port: config.REDIS_SERVICE_PORT,
    host: config.REDIS_SERVICE_HOST,
    retryStrategy,
  };

  if (config.REDIS_PREFIX) {
    redisConfig.keyPrefix = config.REDIS_PREFIX;
  }

  const redis = new Redis(redisConfig);

  connections[identifier] = redis;

  return redis;
};
