import * as fs from "fs";
import { repeat, times } from "lodash";

const file = fs.readFileSync("./p14/input.txt", "utf8");
let grid = file.split("\n");

function rotateRight(grid: Array<string>) {
  let newGrid = [];
  for (let x = 0; x < grid[0].length; x++) {
    newGrid[x] = "";
    for (let y = grid.length - 1; y >= 0; y--) {
      newGrid[x] += grid[y][x];
    }
  }
  return newGrid;
}

function count(str: string, char: string) {
  let count = 0;
  for (let i = 0; i < str.length; i++) {
    count += str[i] === char ? 1 : 0;
  }
  return count;
}

function tiltRowLeft(row: string): string {
  const splits = row.split("#");
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

function calculateLoadOnLeft(row: string): number {
  let sum = 0;
  for (let x = 0; x < row.length; x++) {
    if (row[x] === "O") {
      sum += row.length - x;
    }
  }
  return sum;
}

// Rotate right 2 times to start so north is first
times(2, () => (grid = rotateRight(grid)));

const CYCLES = 1000;
for (let i = 0; i < CYCLES; i++) {
  // Perform a cycle
  times(4, () => {
    grid = rotateRight(grid);
    for (let y = 0; y < grid[0].length; y++) {
      grid[y] = tiltRowLeft(grid[y]);
    }
  });

  // After the end of the cycle, we're oriented with left = EAST, so rotate once more to get north
  let tempGrid = rotateRight(grid);
  let sum = 0;
  for (let y = 0; y < tempGrid[0].length; y++) {
    sum += calculateLoadOnLeft(tempGrid[y]);
  }

  // Look for the repeating pattern here
  console.log(`Sum (${i}): `, sum);
}
