module.exports = (sequelize, DataTypes) => (
  sequelize.define('user', {
    email: {
      type: DataTypes.STRING(40),
      allowNull: false,
      unique: true,
    },
    pubKey: {
      type: DataTypes.STRING(128),
      allowNull: true,
      unique: true,
    },
    uid: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    deviceToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    timestamps: true,
  })
);

// User : index(PK), email(UK), nickname, pubKey, uid, deviceToken
// QuizInformation : index(PK), dbHash(FK), round, date, rewardToken, rewardQuantity
// Winner : index(PK), dbHash, User - relation으로 
// QuizList : index(PK), round(FK), quiz, answer, difficulty, category