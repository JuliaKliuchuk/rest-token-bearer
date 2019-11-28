const Redis = require('redis');
const Promise = require('bluebird');
Promise.promisifyAll(Redis);

const {ConfigService} = require('./ConfigService');
const {eventService, EventType} = require('./EventService');

/**
 * Cache service
 */
class CacheService{
  constructor(){
    this.initEvents();
    this.initConnection().catch(console.log);
  }

  /**
   * Initalize Connection
   * @return {void}
   */
  async initConnection(){
    this.TTL = ConfigService.Cache.CACHE_TTL;

    this.redis = Redis.createClient(ConfigService.Cache.CACHE_PORT, ConfigService.Cache.CACHE_HOST);

    this.redis.on('error', console.log);
    this.redis.on('connect', async () => {
      eventService.emit(EventType.ON_CACHE_CONNECT,{
        host: this.redis.connection_options.host,
        port: this.redis.connection_options.port
      });
    });

    await eventService.waitEvent(EventType.ON_CACHE_CONNECT);

    this.models = await this.initModels();
  }

  /**
   * initalize Events
   * @return {void}
   */
  initEvents(){
    eventService.on(EventType.ON_CACHE_CONNECT, (conf) => {
      const msgOnStart = `Client Redis DB is connected: ${JSON.stringify(conf)}`;
      console.log(msgOnStart);
    });

    eventService.on(EventType.ON_CACHE_CLOSED, () => {
      const msgOnStop = `Client Redis DB is closed...`;
      this.redis.quit();
      console.log(msgOnStop);
    });

  }

  /**
   * Initalize Models
   * @return {Object<Sequelize.Model>}
   */
  async initModels(){
    return {
      session: require('../models/SessionModel').SessionModel.init(this)
    };
  }

  /**
   * Method - Getting data of keys
   * @param  {String}    key       key of data
   * @return {Promise<any>}        result data
   * @example cacheService.keys('temp1').then(console.log).catch(console.log)
   */
  static async keys (keyPattern) {
    return this.redis.keysAsync(keyPattern);
  }

  /**
   * Method - Check exist key
   * @param  {String}    key       key of data
   * @return {Promise<any>}        result data
   * @example cacheService.exists('temp1').then(console.log).catch(console.log)
   */
  static async exists (key) {
    return this.redis.existsAsync(key).then(result => result === 1);
  }

  /**
   * Method - Getting data by key (for strings and objects set from set method)
   * @param  {String}    key       key of data
   * @return {Promise<any>}        result data
   * @example cacheService.get('temp1').then(console.log).catch(console.log)
   */
  async get (key) {
    return this.redis.getAsync(key).then(JSON.parse);
  }

  /**
   * Method - Set data by key in seconds interval(for strings and objects)
   * @param  {String}  key                 key of data
   * @param  {Any}     obj                 value
   * @param  {Number}  [ttlInSec=this.TTL] expiring time  in seconds
   * @return {Promise<Boolean>}            result operation
   * @example cacheService.setex('temp1',{ type:1, name:'test'}).then(console.log).catch(console.log)
   */
  async setex (key, obj, ttlInSec = this.TTL ) {
    return this.redis.setexAsync(key, ttlInSec, JSON.stringify(obj)).then(result => result === 'OK');
  }

  /**
   * Method - Set data by key (for strings and objects)
   * @param  {String}  key                 key of data
   * @param  {Any}     obj                 value
   * @return {Promise<Boolean>}            result operation
   * @example cacheService.set('temp1',{ type:1, name:'test'}).then(console.log).catch(console.log)
   */
  async set (key, obj) {
    return this.redis.setAsync(key, JSON.stringify(obj)).then(result => result === 'OK');
  }

  /**
   * Method - Delete data by key (for all)
   * @param  {String}  key                 key of data
   * @return {Promise<Boolean>}            result operation
   * @example cacheService.del('temp1').then(console.log).catch(console.log)
   */
  async del (key) {
    return this.redis.delAsync(key).then(result => result === 'OK');
  }

  /**
   * Method - Setting expire time by key (for all)
   * @param  {String}    key            key of data
   * @param  {Number}    [ttl=300]      expiring time in seconds
   * @return {Promise<Boolean>}         result operation
   * @example cacheService.expire('temp1',3600).then(console.log).catch(console.log)
   */
   async expire (key, ttl = this.TTL) {
    return this.redis.expireAsync(key, ttl).then(result => result === 1);
  }

}

const cacheService = new CacheService();
module.exports.cacheService = cacheService;
