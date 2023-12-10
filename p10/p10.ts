import * as fs from "fs";

const file = fs.readFileSync("./p10/input.txt", "utf8");
const lines = file.split("\n");

enum Tile {
  Vertical = "|",
  Horizontal = "-",
  TopRight = "L",
  TopLeft = "J",
  BottomLeft = "7",
  BottomRight = "F",
  Ground = ".",
  Start = "S",
}

type Coords = string;
const toCoords = (x: number, y: number): Coords => `${x}.${y}`;
const addCoords = (c: Coords, { x, y }: { x: number; y: number }): string => {
  const split = c.split(".");
  return toCoords(Number(split[0]) + x, Number(split[1]) + y);
};

const map = new Map<Coords, Tile>();
let startCoord;
for (let y = 0; y < lines.length; y++) {
  for (let x = 0; x < lines[y].length; x++) {
    map.set(toCoords(x, y), lines[y][x] as Tile);
    if (lines[y][x] === Tile.Start) {
      startCoord = toCoords(x, y);
    }
  }
}

if (!startCoord) {
  throw "No starting coordinate";
}

let distMap = new Map<Coords, number>();
distMap.set(startCoord, 0);
let coordQueue: Array<Coords> = [startCoord];

function checkAdjacent(coord: Coords, tileGreenlist: Set<Tile>, dist: number) {
  const adjTile = map.get(coord);
  if (adjTile && !distMap.has(coord) && tileGreenlist.has(adjTile)) {
    distMap.set(coord, dist + 1);
    coordQueue.push(coord);
  }
}

// Perform BFS
while (coordQueue.length) {
  const coord = coordQueue.shift()!;
  const dist = distMap.get(coord) ?? 0;
  checkAdjacent(
    addCoords(coord, { x: 1, y: 0 }),
    new Set([Tile.Horizontal, Tile.BottomLeft, Tile.TopLeft]),
    dist
  );
  checkAdjacent(
    addCoords(coord, { x: -1, y: 0 }),
    new Set([Tile.Horizontal, Tile.BottomRight, Tile.TopRight]),
    dist
  );
  checkAdjacent(
    addCoords(coord, { x: 0, y: 1 }),
    new Set([Tile.Vertical, Tile.TopLeft, Tile.TopRight]),
    dist
  );
  checkAdjacent(
    addCoords(coord, { x: 0, y: -1 }),
    new Set([Tile.Vertical, Tile.BottomLeft, Tile.BottomRight]),
    dist
  );
}

console.log("Max dist: " + Math.max(...Array.from(distMap.values())));
