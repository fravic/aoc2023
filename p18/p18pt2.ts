import * as fs from "fs";

const file = fs.readFileSync("./p18/input.txt", "utf8");
const instructions = file.split("\n");

type Point = { x: number; y: number };

let lastPoint: Point | null = { x: 0, y: 0 };
let areaInside = 0;
let perimeter = 0;

function addPoint(from: Point, add: Point): Point {
  return { x: from.x + add.x, y: from.y + add.y };
}

for (const line of instructions) {
  const split = line.split("(")[1];
  const distHex = split.slice(1, 6);
  const dir = split[6];
  let addVal = { x: 0, y: 0 };
  const val = parseInt(distHex, 16);
  console.log(distHex, val, dir);
  switch (dir) {
    case "0": // R
      addVal = { x: val, y: 0 };
      break;
    case "1": // D
      addVal = { x: 0, y: val };
      break;
    case "2": // L
      addVal = { x: -val, y: 0 };
      break;
    case "3": // U
      addVal = { x: 0, y: -val };
      break;
  }
  const point: Point = lastPoint ? addPoint(lastPoint, addVal) : addVal;

  // https://en.wikipedia.org/wiki/Shoelace_formula
  areaInside += (lastPoint.x * point.y - point.x * lastPoint.y) * 0.5;
  perimeter += val;

  lastPoint = point;
}

console.log({ lastPoint }); // Make sure we input correctly!
console.log(
  "Area: ",
  areaInside + perimeter / 2 + 1 /* +1 for starting point */
);
