const fs = require("fs");
var readline = require("readline");

async function readStep() {
  return new Promise(resolve => {
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    });

    rl.on("line", function(cmd) {
      resolve(cmd);
      rl.close();
    });
  });
}

let program = fs.readFileSync(`${process.argv[2]}`).toString();

let programStack = [];
let functionMap = {};

let PC = 0;

checkStackFiller();
program = removeComments(program);

let comment = false;
(async () => {
  let before = new Date();

  while (PC < program.length) {
    let command = program[PC++];
    let x, y;

    if (parseInt(process.env.DEBUG)) {
      if (parseInt(process.env.STEP)) await readStep();
      console.log(`PC: ${PC - 1}`);
      console.log(`STACK: ${programStack}`);
      console.log(`COMMAND: ${command}`);
    }

    if (comment) {
      if (command == "]") comment = false;
      continue;
    } else if (command == "[") {
      comment = true;
      continue;
    }

    switch (command) {
      case "1":
        programStack.push(1);
        break;

      case "+":
        x = programStack.pop();
        y = programStack.pop();
        programStack.push(x + y);
        break;

      case "-":
        x = programStack.pop();
        y = programStack.pop();
        programStack.push(x - y);
        break;

      case "*":
        x = programStack.pop();
        y = programStack.pop();
        programStack.push(parseInt(x * y));
        break;

      case "|":
        x = programStack.pop();
        y = programStack.pop();
        programStack.push(parseInt(x / y));
        break;

      case "/":
        x = programStack.pop();
        programStack.unshift(x);
        break;

      case "\\":
        x = programStack.shift();
        programStack.push(x);
        break;

      case "^":
        x = programStack.pop();
        y = programStack.pop();
        programStack.push(x);
        programStack.push(y);
        break;

      case "<":
        x = programStack.pop();
        y = programStack.pop();
        programStack.push(x >= y ? 1 : 0);
        break;

      case "#":
        x = programStack.pop();
        PC += x;
        break;

      case '"':
        x = programStack.pop();
        programStack.push(x);
        programStack.push(x);
        break;

      case ":":
      case ";":
        x = programStack.pop();
        console.log(x);
        break;

      case ".":
      case ",":
        x = parseInt(await readStep());
        programStack.push(x);
        break;

      default:
        break;
    }
  }

  console.log(`Time: ${new Date() - before}ms`);
})();

function removeComments(text = "") {
  let start, end;

  while (text.indexOf(" ") != -1) text = text.replace(" ", "");

  while (text.indexOf("\n") != -1) text = text.replace("\n", "");

  while (text.indexOf("\r") != -1) text = text.replace("\r", "");

  do {
    start = text.indexOf("[");
    end = text.indexOf("]");
    text = text.substring(0, start) + text.substring(end + 1);
  } while (start != -1);

  return text;
}

function checkStackFiller() {
  if (process.argv[3]) {
    let stackFiller = fs.readFileSync(`${process.argv[3]}`).toString();
    programStack = stackFiller.split("\n").map(a => parseInt(a));
  }
}
