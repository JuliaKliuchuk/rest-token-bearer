const {once, EventEmitter} = require('events');

const ON_DB_CONNECT = Symbol('DB is connected:');
const ON_DB_CLOSED = Symbol('DB is closed:');
const ON_CACHE_CONNECT = Symbol('CACHE is connected:');
const ON_CACHE_CLOSED = Symbol('CACHE is closed:');

/**
 * Event service
 */
class EventService extends EventEmitter{
  constructor(){
    super();
    process.on('SIGINT', this.stopServices.bind(this));
  }

  /**
   * Wait Event once
   * @return {Promise}
   */
  async waitEvent(eventName){
    return once(this, eventName);
  }

  /**
   * Send STOP signal for all services
   * @return {void}
   */
  stopServices(){
    this.emit(ON_DB_CLOSED);
    this.emit(ON_CACHE_CLOSED);

    process.nextTick(()=>{
      console.log('STOP APP ...');
      process.exit(0);
    });
  }

}

module.exports.EventType = {
    ON_DB_CONNECT,
    ON_DB_CLOSED,
    ON_CACHE_CONNECT,
    ON_CACHE_CLOSED
};

const eventService = new EventService();

module.exports.eventService = eventService;
