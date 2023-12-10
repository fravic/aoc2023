import * as fs from "fs";

const file = fs.readFileSync("./p8/input.txt", "utf8");
const lines = file.split("\n");

const directions = lines[0];

interface MapNode {
  left: string;
  right: string;
}

const map = new Map<string, MapNode>();
lines.slice(2).forEach((l) => {
  const regex = /(\w{3}) = \((\w{3}), (\w{3})\)/;
  const groups = regex.exec(l);
  if (!groups) {
    throw "Malformed input: " + l;
  }
  map.set(groups[1], { left: groups[2], right: groups[3] });
});

function getPathLength(startPos: string): number {
  let curPos = startPos;
  let stepCount = 0;
  while (curPos[2] !== "Z") {
    const mapLookup = map.get(curPos)!;
    const d = directions.charAt(stepCount % directions.length);
    curPos = d === "L" ? mapLookup.left : mapLookup?.right;
    stepCount++;
  }
  return stepCount;
}

const startPositions = Array.from(map.keys()).filter((k) => k[2] === "A");
const pathLengths = startPositions.map((p) => getPathLength(p));

function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) {
    return 0;
  }
  return (a * b) / gcd(a, b);
}

function gcd(a: number, b: number): number {
  if (b === 0) {
    return a;
  }
  return gcd(b, a % b);
}

let lcmAll = lcm(pathLengths[0], pathLengths[1]);
for (let i = 1; i < pathLengths.length; i++) {
  lcmAll = lcm(lcmAll, pathLengths[i]);
}

console.log("Step count:", lcmAll);
