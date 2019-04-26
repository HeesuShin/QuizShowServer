module.exports = (sequelize, DataTypes) => (
  sequelize.define('quizAnswerList', {
    case: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    timestamps: false,
    paranoid: false,
  })
);
// User : index(PK), email(UK), nickname, pubKey, uid, deviceToken
// QuizInformation : index(PK), dbHash(FK), round, date, rewardToken, rewardAmount
// Winner : index(PK), dbHash, User - relation으로 
// QuizList : index(PK), round(FK), quiz, answer, difficulty, category
// QuizAnswerList : QuizListIndex(FK), case