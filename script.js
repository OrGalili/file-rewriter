const fs = require('fs');
const util = require('util');
const ruleArr = [];

//---- streaming rules file to string array object.
const rulesFile = fs.readFileSync('rules.txt', 'utf-8');
rulesFile.split(/\r?\n/).forEach(line =>  {
  let rule = line.split("-");
  ruleArr.push({source:rule[0] , dest:rule[1]});
});

//---- Reading the source file and writing to a new file according to the rules.
let sourceBuffer = fs.readFileSync('source.txt');// streaming the file to a buffer
const decoder = new TextDecoder('windows-1255'); // creating decoder with a selected encoding (in this case - windows1255).
let sourceStr = decoder.decode(sourceBuffer, { stream: true }); // decoding the buffer to a string.
sourceStr += decoder.decode(); // end-of-stream. result - a decoded string with source file content.
ruleArr.forEach(rule=>{
	sourceStr = sourceStr.replaceAll(rule.source,rule.dest);//replaces all sub-strings found in the rules file.
})
fs.writeFileSync('dest.txt',sourceStr);

//---- creating a log file- where the changes has been made and what rule has been applied for each line.
let log = "line |  rule\n";
let sourceFile = fs.readFileSync('source.txt','utf-8');
sourceFile.split(/\r?\n/).map((line,index) =>  {
	ruleArr.forEach(rule=>{
		if(line.includes(rule.source))
			log+=index+1+"	 |  "+rule.source+"-"+rule.dest+"\n";
	})
});
fs.writeFileSync('log.txt',log);

//---- executing vscode diff tool comparing the source file to the destination.
let exec = require('child_process').exec;
exec('code --diff source.txt dest.txt');
