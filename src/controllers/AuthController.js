const {dbService} = require('../services/DBService');
const {cacheService} = require('../services/CacheService');
const headerKey = 'Bearer';


/**
 * Controller - Auth API
 */
class AuthController {

  /**
   * Getter of Session Model
   * @return {void}
   */
  static get Session(){
    return cacheService.models.session;
  }

  /**
   * Getter of User Model
   * @return {void}
   */
  static get User(){
    return dbService.models.User;
  }

  /**
   * auth - middleware controller of authorization
   * @param  {Object}    req  request
   * @param  {Object}    res  response
   * @return {void}
   */
  static async auth(req, res, next){

    // Getting token
    if (req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2 && parts[0] === headerKey) {
        req.token = parts[1];
      }
    }
    // Auth error
    if(!req.token) return res.status(403).send({error:'Unauthorized request'});
    // Check current token and return new token
    const {token, sessionid} =  await AuthController.Session.check(req.token);
    console.log({in_token:req.token,out_token:token, sessionid});

    if (!token) return res.status(403).send({error:'Token is invalid'});

    //setup current token
    res.set('authorization', headerKey + ' ' + token);

    res.sessionid = sessionid;
    next();
  }

  /**
   * signin - login request
   * @param  {Object}    req  request
   * @param  {Object}    res  response
   * @return {JSON}   token
   */
  static async signin(req, res,next){
    const {login, pass} = req.body;
    const invalidUserNmae = {error:'Invalid User name or Password!'};

    if(!(login && pass)) return res.status(400).send(invalidUserNmae);

    const user = await AuthController.User.getUserByEMailOrPhone(login);
    if(!user) return res.status(400).send(invalidUserNmae);
    const {user_id, email_id, phone_no} = user.get({plain:true});
    const {token, sessionid} = await AuthController.Session.create({user_id, email_id, phone_no});

    res.send({res:'ok',token});
  }

  /**
   * signup - signup request
   * @param  {Object}    req  request
   * @param  {Object}    res  response
   * @return {JSON}
   */
  static async signup(req, res) {
    const {phone, email, pass} = req.body;
    const example = {
      by_email: {email:'example@mail.com', pass:'pass'},
      by_phone: {phone:'+99999999999', pass:'pass'}
    };
    if(!pass) return res.status(400).send({error:'Missing user password', example});
    if(!(email || phone)) return res.status(400).send({error:'Missing user password', example});

    const exist = await AuthController.User.getUserByEMailOrPhone(email||phone);

    if(exist) return res.status(400).send({error:'User is already registered!'});

    const newUser = {
      email_id: email,
      phone_no: phone,
      password: pass
    };
    try{
      const user = await AuthController.User.create(newUser);
      return res.status(200).send({res:'ok'});
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    };

  }

  /**
   * logout - logout request
   * @param  {Object}    req  request
   * @param  {Object}    res  response
   * @return {JSON}
   */
  static async logout(req, res){
    await AuthController.Session.del(res.sessionid);
    return res.status(200).send({res:'ok'});
  }

  /**
   * info - user id request
   * @param  {Object}    req  request
   * @param  {Object}    res  response
   * @return {JSON}
   */
  static async info(req, res){
    const {user_id} = await AuthController.Session.get(res.sessionid);
    return res.send({res:'ok', user_id});
  }

}

module.exports.AuthController = AuthController;
