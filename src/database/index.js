import Sequelize from 'sequelize';

import User from '../app/models/users';
import Recipients from '../app/models/recipients';
import Couriers from '../app/models/couriers';
import Avatars from '../app/models/avatars';
import Orders from '../app/models/orders';

import dbConfig from '../config/dbConfig';

const models = [User, Recipients, Couriers, Avatars, Orders];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.conn = new Sequelize(dbConfig);

    models
      .map(model => model.init(this.conn))
      .map(model => model.associate && model.associate(this.conn.models));
  }
}

export default new Database();
