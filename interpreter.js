let programStack = [];
let functionMap = {};

let program = "111++;";

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

    case ':':
    case ';':
      x = programStack.pop();
      console.log(x);
      break;

    default:
      break;
  }
}
