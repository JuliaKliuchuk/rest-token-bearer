const {dbService} = require('../services/DBService');

const request = require('request-promise');

/**
 * Controller - External API
 */
class ExternalController {

  /**
   * latency - return latency of google.com
   * @param  {Object}    req  request
   * @param  {Object}    res  response
   * @return {JSON}     latency in seconds
   */
  static async latency(req, res){

    const options = {
      uri: 'http://google.com'
    };

    const start = process.hrtime.bigint();

    try{
      await request(options);
      const interval = (Number(process.hrtime.bigint() - start) /1000000000.0);
      res.send({'google.com':interval});

    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    };

  }

}

module.exports.ExternalController = ExternalController;
