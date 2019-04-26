module.exports = (sequelize, DataTypes) => (
  sequelize.define('quizInformation', {
    dbHash: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    rewardToken: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rewardAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    state: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: 0,
    }
  }, {
    timestamps: true,
    paranoid: false,
  })
);

// User : index(PK), email(UK), nickname, pubKey, uid, deviceToken
// QuizInformation : index(PK), dbHash(FK), round, date, rewardToken, rewardAmount
// Winner : index(PK), dbHash, User - relation으로 
// QuizList : index(PK), round(FK), quiz, answer, difficulty, category