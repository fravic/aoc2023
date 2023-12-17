import * as fs from "fs";

const file = fs.readFileSync("./p3/input.txt", "utf8");
const grid = file.split("\n");

const get = (x: number, y: number) => {
  if (x < 0 || x >= grid[0].length || y < 0 || y >= grid.length) {
    return ".";
  }
  return grid[y][x];
};

function isPartNumber(x1: number, x2: number, y0: number): boolean {
  for (let x = x1 - 1; x <= x2 + 1; x++) {
    for (let y = y0 - 1; y <= y0 + 1; y++) {
      if (get(x, y) !== "." && Number.isNaN(Number(get(x, y)))) {
        return true;
      }
    }
  }
  return false;
}

let sum = 0;
for (let y = 0; y < grid.length; y++) {
  let x = 0;
  while (x < grid[0].length) {
    let numStr = "";
    while (!Number.isNaN(Number(get(x, y)))) {
      numStr += get(x, y);
      x++;
    }
    if (numStr.length && isPartNumber(x - numStr.length, x - 1, y)) {
      sum += Number(numStr);
    }
    x++;
  }
}
console.log("Sum", sum);
