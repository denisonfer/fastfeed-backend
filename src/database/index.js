import Sequelize from 'sequelize';
import User from '../app/models/users';

import dbConfig from '../config/dbConfig';

const models = [User];

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
