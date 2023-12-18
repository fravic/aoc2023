import * as fs from "fs";
import { chunk, repeat } from "lodash";

const file = fs.readFileSync("./p18/input.txt", "utf8");
const instructions = file.split("\n");

const grid = (() => {
  let grid: Array<Set<number>> = [new Set([0])];
  let pos = { x: 0, y: 0 };

  function set(x: number, y: number) {
    if (!grid[y]) {
      grid[y] = new Set();
    }
    grid[y].add(x);
  }

  for (const line of instructions) {
    const count = Number(line.split(" ")[1]);
    switch (line[0]) {
      case "R": {
        for (let x = pos.x + 1; x <= pos.x + count; x++) {
          set(x, pos.y);
        }
        pos = { x: pos.x + count, y: pos.y };
        break;
      }
      case "L": {
        for (let x = pos.x - 1; x >= pos.x - count; x--) {
          set(x, pos.y);
        }
        pos = { x: pos.x - count, y: pos.y };
        break;
      }
      case "D": {
        for (let y = pos.y + 1; y <= pos.y + count; y++) {
          set(pos.x, y);
        }
        pos = { x: pos.x, y: pos.y + count };
        break;
      }
      case "U": {
        for (let y = pos.y - 1; y >= pos.y - count; y--) {
          set(pos.x, y);
        }
        pos = { x: pos.x, y: pos.y - count };
        break;
      }
    }
  }
  return grid;
})();

let sum = 0;
const yCoords = Object.keys(grid)
  .map((y) => Number(y))
  .sort((a, b) => a - b);
let minX = 0;
let maxX = 0;
for (const y of yCoords) {
  const xCoords = Array.from(grid[y]).sort((a, b) => a - b);
  minX = Math.min(xCoords[0], minX);
  maxX = Math.max(xCoords[xCoords.length - 1], maxX);
}

for (const y of yCoords) {
  for (let x = minX; x <= maxX; x++) {
    process.stdout.write(grid[y].has(x) ? "#" : ".");
  }
  process.stdout.write("\n");

  const xCoords = Array.from(grid[y]).sort((a, b) => a - b);

  let lastInBoundsX = null;
  for (const x of xCoords) {
    sum += 1;

    if (lastInBoundsX !== null) {
      // Fill the gap between the last x we saw and this one
      sum += x - lastInBoundsX;
      lastInBoundsX = null;
    } else if (!grid[y].has(x + 1)) {
      // Do we need to fill in the next x coord?
      lastInBoundsX = x + 1;
    }
  }
}
console.log("Sum: ", sum);
