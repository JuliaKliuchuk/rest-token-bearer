const Sequelize = require('sequelize');
const Op = Sequelize.Op;

/**
 * User Model
 */
class UserModel extends Sequelize.Model {

  /**
   * Method - Initialize model
   * @param  {Object}    sequelize
   * @param  {Object}    DataTypes
   * @return {Object<Model>}        result data
   */
  static init(sequelize, DataTypes) {
    return super.init(
      {
        user_id: {
          type: Sequelize.CHAR(36),
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4
        },
        user_name: {
          type: Sequelize.STRING,
          defaultValue: null
        },
        email_id: {
          type: Sequelize.STRING,
          unique: 'email_id'
        },
        phone_no: {
          type: Sequelize.STRING,
          unique: 'phone_no',
          defaultValue: null
        },
        password: {
          type: Sequelize.STRING
        }
      },
      {

        hooks: {
          beforeCreate: (user, options) => {
            user.phone_no = user.phone_no || user.email_id;
          }
        },
        tableName: 'users',
        sequelize
      }
    );
  }

  /**
   * Find User by Email or Phone
   * @param {String} value Email or Phone string
   * @return {Promise<UserModel>}
   */
  static getUserByEMailOrPhone(value){
    return this.findOne({
      where:{
        [Op.or]: [{email_id: value}, {phone_no: value}]
      }
    });
  }
}


module.exports.UserModel = UserModel;
