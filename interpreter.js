const fs = require("fs");
var readline = require("readline");

const DEBUG = false;

async function readStep() {
  return new Promise(resolve => {
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    });

    rl.on("line", function(cmd) {
      resolve();
      rl.close();
    });
  });
}

let program = fs.readFileSync(`${process.argv[2]}`).toString();

let programStack = [];
let functionMap = {};

let PC = 0;

function removeComments(text = "") {
  let start, end;

  while (text.indexOf(" ") != -1) text = text.replace(" ", "");

  while (text.indexOf("\n") != -1) text = text.replace("\n", "");

  do {
    start = text.indexOf("[");
    end = text.indexOf("]");
    text = text.substring(0, start) + text.substring(end + 1);
  } while (start != -1);

  return text;
}

program = removeComments(program);

let comment = false;
(async () => {
  while (PC < program.length) {
    let command = program[PC++];
    let x, y;

    if (DEBUG) {
      await readStep();
      console.log(`PC: ${PC}`);
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

      default:
        break;
    }
  }
})();
