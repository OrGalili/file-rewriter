const fs = require('fs');
//npm i iconv-lite
const iconv = require('iconv-lite');

//---- 1.streaming rules file to string array object.
const ruleArr = [];
const rulesFile = fs.readFileSync('rules.txt', 'utf-8');
rulesFile.split(/\r?\n/).forEach(line =>  {
  let rule = line.split("-");
  ruleArr.push({source:rule[0] , dest:rule[1]});
});

//---- 2.Reading the source file and writing to a new file while preserving the encoding.
let sourceBuffer = fs.readFileSync('source.txt');// streaming the file to a buffer
const decoder = new TextDecoder('windows-1255'); // creating decoder with a selected encoding (in this case - windows1255).
let sourceStr = decoder.decode(sourceBuffer, { stream: true }); // decoding the buffer to a string.
sourceStr += decoder.decode(); // end-of-stream. result - a decoded string with source file content.

//---- 3.Replacing subtrings according to the rules.
ruleArr.forEach(rule=>{
	sourceStr = sourceStr.replaceAll(rule.source,rule.dest);//replaces all sub-strings found in the rules file.
})

//---- 4.Writing the change string to a new file while preserving the encoding.
fs.writeFileSync('intermediate.txt',sourceStr);// in nodejs the file that created is in UTF-8 encode.

fs.createReadStream('intermediate.txt') // Writing the intermediate file
    .pipe(iconv.decodeStream('utf8')) //from UTF-8 encode
    .pipe(iconv.encodeStream('win1255')) // to windows-1255 encode (in this case)
    .pipe(fs.createWriteStream('dest.txt')); // to a new file called dest.


//---- creating a log file- where the changes has been made and what rule has been applied for each line.
let log = "line          |  rule\n";
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
