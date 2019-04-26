const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config')[env];
const db = {};

const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = require('./user')(sequelize, Sequelize);
db.QuizInformation = require('./quizInformation')(sequelize, Sequelize);
db.QuizList = require('./quizList')(sequelize, Sequelize);
db.QuizAnswerList = require('./quizAnswerList')(sequelize, Sequelize);

db.QuizInformation.hasMany(db.QuizList, { foreignKey: 'round', sourceKey: 'id' })
db.QuizList.belongsTo(db.QuizInformation, { foreignKey: 'round', targetKey: 'id' });

db.QuizInformation.belongsToMany(db.User, { through: 'Winner' });
db.User.belongsToMany(db.QuizInformation, { through: 'Winner' });

db.QuizList.hasMany(db.QuizAnswerList, { foreignKey: 'quizListIndex', sourceKey: 'id' });
db.QuizAnswerList.belongsTo(db.QuizList, { foreighKey: 'quizListIndex', sourceKey: 'id'});

module.exports = db;
// User : index(PK), email(UK), nickname, pubKey, uid, deviceToken
// QuizInformation : index(PK), dbHash(FK), round, date, rewardToken, rewardAmount
// Winner : index(PK), dbHash, User - relation으로 
// QuizList : index(PK), round(FK), quiz, answer, difficulty, category
// QuizAnswerList : QuizListIndex(FK), case