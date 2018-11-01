let programStack = [];
let functionMap = {};

let program = "11-1;#";

let PC = 0;

while (PC < program.length) {
  let command = program[PC++];
  let x, y;

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
      PC = x;
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
