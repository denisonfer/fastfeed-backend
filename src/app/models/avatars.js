import Sequelize, { Model } from 'sequelize';

class Avatars extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `http://localhost:3000/avatars/${this.path}`;
          },
        },
      },
      { sequelize }
    );

    return this;
  }
}

export default Avatars;
