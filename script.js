const fs = require('fs');
const ruleArr = [];

const rulesFile = fs.readFileSync('rules.txt', 'utf-8');
rulesFile.split(/\r?\n/).forEach(line =>  {
  let rule = line.split("-");
  ruleArr.push({source:rule[0] , dest:rule[1]});
});
