module.exports = (sequelize, DataTypes) => (
  sequelize.define('quizList', {
    quiz: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    difficulty: {
      type: DataTypes.INTEGER(2),
      allowNull: false,
      default: 5,
    },
    category: {
      type: DataTypes.STRING(15),
      allowNull: false,
      defaultValue: 'common',
    },
  }, {
    timestamps: true,
    paranoid: false,
  })
);

// User : index(PK), email(UK), nickname, pubKey, uid, deviceToken
// QuizInformation : index(PK), dbHash(FK), round, date, rewardToken, rewardAmount
// Winner : index(PK), dbHash, User - relation으로 
// QuizList : index(PK), round(FK), quiz, answer, difficulty, category
// QuizAnswerList : QuizListIndex(FK), case