const {Sequelize} = require('sequelize');
const {ConfigService} = require('./ConfigService');
const {eventService, EventType} = require('./EventService');

/**
 * DB(ORM) service
 */
class DBService{
  constructor(){
    this.initEvents();
    this.initConnection().catch(console.log);
  }

  /**
   * Initalize Connection
   * @return {void}
   */
  async initConnection(){
    this.sequelize = await new Sequelize(
      ConfigService.MySQL.DB_NAME,
      ConfigService.MySQL.DB_USER ,
      ConfigService.MySQL.DB_PASS,
      {
        host: ConfigService.MySQL.DB_HOST,
        port: ConfigService.MySQL.DB_PORT,
        dialect: 'mariadb',
        dialectOptions: {
          timezone: 'Etc/GMT0',
        },
        logging: false,
        syncOnAssociation: true,
        pool: ConfigService.MySQL.DB_POOL,
        define: {
          charset: 'utf8',
          collate: 'utf8_unicode_ci',
          timestamps: false
        }
      });

      this.sequelize.authenticate()
        .then(async (conf) => {
          eventService.emit(EventType.ON_DB_CONNECT, {
            host: this.sequelize.config.host,
            port: this.sequelize.config.port,
            pool: this.sequelize.config.pool
          });
        })
        .catch(console.log);

      await eventService.waitEvent(EventType.ON_DB_CONNECT);

      this.models = await this.initModels();

      await this.sequelize.sync({alter: true});
  }

  /**
   * initalize Events
   * @return {void}
   */
  initEvents(){
    eventService.on(EventType.ON_DB_CONNECT, (conf) => {
      const msgOnStart = `Client Mysql DB is connected: ${JSON.stringify(conf)}`;
      console.log(msgOnStart);
    });

    eventService.on(EventType.ON_DB_CLOSED, () => {
      const msgOnStop = `Client Mysql DB is closed...`;
      this.sequelize.close();
      console.log(msgOnStop);
    });

  }

  /**
   * Initalize Models
   * @return {Object<Sequelize.Model>}
   */
  async initModels(){
    return {
      User: require('../models/UserModel').UserModel.init(this.sequelize, Sequelize)
    };
  }

}

const dbService = new DBService();
module.exports.dbService = dbService;
