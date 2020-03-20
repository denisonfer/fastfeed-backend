module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      recipient_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'recipients',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      couriers_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'couriers',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      signature_id: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      product: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      canceled_at: {
        allowNull: true,
        type: Sequelize.DATEONLY,
      },
      start_date: {
        allowNull: true,
        type: Sequelize.DATEONLY,
      },
      end_date: {
        allowNull: true,
        type: Sequelize.DATEONLY,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('orders');
  },
};
