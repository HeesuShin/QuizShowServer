// 2_deploy_contracts.js
var quizshow = artifacts.require("./QuizShowToken.sol");

module.exports = function(deployer) {
  deployer.deploy(quizshow);   //from을 생략하면 account[0] 주소로 배포한다.
};