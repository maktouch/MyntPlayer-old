require('dotenv').config({ silent: true });

module.exports = {
  REDIS_SERVICE_PORT: process.env.REDIS_SERVICE_PORT || '6379',
  REDIS_PREFIX: process.env.REDIS_PREFIX || 'dev',
  REDIS_SERVICE_HOST: process.env.REDIS_SERVICE_HOST || '127.0.0.1',
  PORT: 9305,
};
