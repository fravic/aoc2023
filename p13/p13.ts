import * as fs from "fs";

const file = fs.readFileSync("./p13/input.txt", "utf8");
const lines = file.split("\n");

function diff(a: string, b: string): number {
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      diff++;
    }
  }
  return diff;
}

function column(lines: Array<string>, x: number): string {
  let column = "";
  for (let y = 0; y < lines.length; y++) {
    column += lines[y][x];
  }
  return column;
}

function solvePuzzle(lines: Array<string>): number {
  for (let x = 0; x < lines[0].length - 1; x++) {
    // Walk each column from this center and see if they're equal
    let size = 1;
    let totalDiff = 0;
    while (x + 1 - size >= 0 && x + size < lines[0].length) {
      totalDiff += diff(column(lines, x + 1 - size), column(lines, x + size));
      size++;
    }
    if (totalDiff === 1) {
      // It's a mirror!
      return x + 1;
    }
  }

  for (let y = 0; y < lines.length - 1; y++) {
    // Walk each row from this center and see if they're equal
    let size = 1;
    let totalDiff = 0;
    while (y + 1 - size >= 0 && y + size < lines.length) {
      totalDiff += diff(lines[y + 1 - size], lines[y + size]);
      size++;
    }
    if (totalDiff === 1) {
      // It's a mirror!
      return (y + 1) * 100;
    }
  }

  throw "No mirror";
}

let i = 0;
let sum = 0;
while (i < lines.length) {
  const puzzle = [];
  while (i < lines.length && lines[i].length > 0) {
    puzzle.push(lines[i]);
    i++;
  }
  sum += solvePuzzle(puzzle);
  i++;
}

console.log("Sum: ", sum);
