const fs = require('fs');
const ruleArr = [];

const rulesFile = fs.readFileSync('rules.txt', 'utf-8');
rulesFile.split(/\r?\n/).forEach(line =>  {
  let rule = line.split("-");
  ruleArr.push({source:rule[0] , dest:rule[1]});
});

let dest;
let sourceFile = fs.readFileSync('source.txt','utf-8');
dest = sourceFile.split(/\r?\n/).map(line =>  {
	ruleArr.forEach(rule=>{
		if(line.includes(rule.source)){
			line = line.replaceAll(rule.source,rule.dest);
		}
	})
	return line;
});
