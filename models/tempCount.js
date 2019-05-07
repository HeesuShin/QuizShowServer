module.exports = (sequelize, DataTypes) => (
    sequelize.define('tempCount', {
      rightCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      wrongCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
    }, {
      timestamps: false
    })
  );