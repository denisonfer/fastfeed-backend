import Sequelize, { Model } from 'sequelize';

class Delivery_problems extends Model {
  static init(sequelize) {
    super.init(
      {
        description: Sequelize.STRING,
      },
      { sequelize }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Orders, {
      foreignKey: 'order_id',
      as: 'order',
    });
  }
}

export default Delivery_problems;
