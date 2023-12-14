import * as fs from "fs";
import { repeat } from "lodash";

const file = fs.readFileSync("./p14/input.txt", "utf8");
const rows = file.split("\n");

function column(x: number) {
  let column = "";
  for (let y = 0; y < rows[0].length; y++) {
    column += rows[y][x];
  }
  return column;
}

function count(str: string, char: string) {
  let count = 0;
  for (let i = 0; i < str.length; i++) {
    count += str[i] === char ? 1 : 0;
  }
  return count;
}

function tiltColumnNorth(column: string): string {
  const splits = column.split("#");
  let tilted = "";
  for (let i = 0; i < splits.length; i++) {
    const rockCount = count(splits[i], "O");
    tilted +=
      repeat("O", rockCount) +
      repeat(".", splits[i].length - rockCount) +
      (i === splits.length - 1 ? "" : "#");
  }
  return tilted;
}

function calculateLoad(column: string): number {
  let sum = 0;
  for (let y = 0; y < column.length; y++) {
    if (column[y] === "O") {
      sum += column.length - y;
    }
  }
  return sum;
}

let sum = 0;
for (let x = 0; x < rows[0].length; x++) {
  sum += calculateLoad(tiltColumnNorth(column(x)));
}

console.log("Sum: ", sum);
