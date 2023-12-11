import * as fs from "fs";

const file = fs.readFileSync("./p11/input.txt", "utf8");
const lines = file.split("\n");

type Coords = { x: number; y: number };
const toCoords = (x: number, y: number): Coords => ({ x, y });

const expansionXs: Array<number> = [];
const expansionYs: Array<number> = [];
for (let y = 0; y < lines.length; y++) {
  if (lines[y].indexOf("#") === -1) {
    expansionYs.push(y);
  }
}
for (let x = 0; x < lines[0].length; x++) {
  let hasGalaxy = false;
  for (let y = 0; y < lines.length; y++) {
    if (lines[y][x] === "#") {
      hasGalaxy = true;
    }
  }
  if (!hasGalaxy) {
    expansionXs.push(x);
  }
}
const toExpandedCoords = (x: number, y: number) =>
  toCoords(
    x + expansionXs.filter((_x) => _x < x).length * 999999,
    y + expansionYs.filter((_y) => _y < y).length * 999999
  );

const galaxies: Array<Coords> = [];
for (let y = 0; y < lines.length; y++) {
  for (let x = 0; x < lines[0].length; x++) {
    if (lines[y][x] === "#") {
      galaxies.push(toExpandedCoords(x, y));
    }
  }
}

let sum = 0;
galaxies.forEach((g1, idx) => {
  galaxies.slice(idx).forEach((g2) => {
    sum += Math.abs(g2.x - g1.x) + Math.abs(g2.y - g1.y);
  });
});

console.log("Sum: " + sum);
