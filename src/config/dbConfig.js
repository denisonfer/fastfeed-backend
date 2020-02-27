module.exports = {
  dialect: 'postgres',
  database: 'fastfeet',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
