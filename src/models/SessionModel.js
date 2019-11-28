//const cert = fs.readFileSync('./public.pem');
const crypto = require('crypto');
const {ConfigService} = require('../services/ConfigService');
const jwt = require('jsonwebtoken');

const JWT_TTL = ConfigService.Jwt.JWT_TTL;
const privateKey = ConfigService.Jwt.JWT_KEY;


/**
 * Session Model
 */
class SessionModel  {

  /**
   * constructor - create Session Model
   * @param  {Object}    cache cache service
   * @return {String} token
   */
  constructor(cache){
    this.cache = cache;
  }

  /**
   * Internal Method - generate session id
   * @return {String} token
   */
  static newSessionId () {
   const sha = crypto.createHash('sha1');
   sha.update(Math.random().toString());
   return sha.digest('hex');
 };

 /**
  * Internal Method - Initialization model
  * @param  {Object}    cache cache service
  * @return {Object<Model>}
  */
  static init(cache) {
    return new this(cache);
  }

  /**
   * Internal Method - getting session key
   * @param  {Number}    sessionid session id
   * @return {String} key for cache
   */
  static sessionKey(sessionid){
    return 'sid:' + sessionid;
  }

  /**
   * Model Method - token generation  from session id
   * @param  {Number}    sessionid session id
   * @return {String} new token
   */
  static newToken(sessionid){
    return jwt.sign({id:sessionid}, privateKey, {expiresIn: JWT_TTL}); //  { algorithm: 'RS256'}
  }

  /**
   * Model Method - delete session in cache
   * @param  {Number}    sessionid session id
   * @return {void}
   */
  async del(sessionid){
    return await this.cache.del(SessionModel.sessionKey(sessionid));
  }

  /**
   * Model Method - Getting session data
   * @param  {Number}    sessionid session id
   * @return {Object} session data
   */
  async get(sessionid){
    return await this.cache.get(SessionModel.sessionKey(sessionid));
  }

  /**
   * Model Method - Create new session and token
   * @param  {Object}    data User data
   * @return {Object} token and session id
   */
  async create(data){
    const sessionid = SessionModel.newSessionId();
    const token = SessionModel.newToken(sessionid);
    if (await this.cache.setex(SessionModel.sessionKey(sessionid), data, JWT_TTL)) {
      return {token, sessionid};
    }
    return false;
  }

  /**
   * Model Method - check current token and return new token
   * @param  {String}    token current token
   * @return {Object} token and session id
   */
  async check(token){
    // get sessionid
    try{
      const sessionid = jwt.verify(token, privateKey).id;
      // expire sessionid
      if (await this.cache.expire(SessionModel.sessionKey(sessionid), JWT_TTL)) {
        const token = SessionModel.newToken(sessionid);
        return {token, sessionid};
      }
      return false;
    }catch(err){
      return false;
    }

  }
}


module.exports.SessionModel = SessionModel;
