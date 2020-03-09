import Sequelize, { Model } from 'sequelize';

class Couriers extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        avatar_id: Sequelize.STRING,
        email: Sequelize.INTEGER,
      },
      { sequelize }
    );

    return this;
  }
}

export default Couriers;
