import Sequelize from 'sequelize';

import User from '../app/models/users';
import Recipients from '../app/models/recipients';
import Couriers from '../app/models/couriers';

import dbConfig from '../config/dbConfig';

const models = [User, Recipients, Couriers];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.conn = new Sequelize(dbConfig);

    models.map(model => model.init(this.conn));
  }
}

export default new Database();
