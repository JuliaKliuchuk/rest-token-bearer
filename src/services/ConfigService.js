require('dotenv').config();

/**
 * MySQL config
 * @type {Object}
 */
const MySQL = {
  DB_NAME: process.env.DB_NAME || 'MyDB',
  DB_USER: process.env.DB_USER || 'root',
  DB_PASS: process.env.DB_PASS || null,
  DB_HOST: process.env.DB_HOST || '127.0.0.1',
  DB_PORT: process.env.DB_PORT || 3306,
  DB_POOL: {
    max: 500,
    min: 2,
    idle: 10000
  }
};

/**
 * CACHE config
 * @type {Object}
 */
const Cache = {
  CACHE_USER: process.env.CACHE_USER || null,
  CACHE_PASS: process.env.CACHE_PASS || null,
  CACHE_HOST: process.env.CACHE_HOST || '127.0.0.1',
  CACHE_PORT: process.env.CACHE_PORT || 6379,
  CACHE_TTL:  process.env.CACHE_TTL || 300

};

/**
 * JWT config
 * @type {Object}
 */
const Jwt = {
  JWT_TTL: process.env.JWT_TTL || 600,
  JWT_KEY: process.env.JWT_KEY || 'BiNGJkZDJjZmY0YjIxZmUyZTU4MGM2YjAiLCJpYXQiOjE',
};

/**
 * APP config
 * @type {Object}
 */
const App = {
  APP_PORT: process.env.APP_PORT || 8000
};

module.exports.ConfigService = {
  MySQL: MySQL,
  Cache: Cache,
  Jwt: Jwt,
  App: App
};
