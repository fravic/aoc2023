import * as fs from "fs";

const file = fs.readFileSync("./p10/input.txt", "utf8");
const lines = file.split("\n");
const width = lines[0].length;
const height = lines.length;

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

const distMap = new Map<Coords, number>();
distMap.set(startCoord, 0);
const coordQueue: Array<Coords> = [startCoord];

function checkAdjacent(coord: Coords, tileGreenlist: Set<Tile>, dist: number) {
  const adjTile = map.get(coord);
  if (adjTile && !distMap.has(coord) && tileGreenlist.has(adjTile)) {
    distMap.set(coord, dist + 1);
    coordQueue.push(coord);
  }
}

// Perform BFS -- figure out which tiles are in the loop
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

// Perform DFS to check if tiles are enclosed
const TOP_ENCLOSURE: Set<Tile | undefined> = new Set([
  Tile.Horizontal,
  Tile.TopRight,
  Tile.TopLeft,
]);
const BOTTOM_ENCLOSURE: Set<Tile | undefined> = new Set([
  Tile.Horizontal,
  Tile.BottomRight,
  Tile.BottomLeft,
]);
const RIGHT_ENCLOSURE: Set<Tile | undefined> = new Set([
  Tile.Vertical,
  Tile.TopRight,
  Tile.BottomRight,
]);
const LEFT_ENCLOSURE: Set<Tile | undefined> = new Set([
  Tile.Vertical,
  Tile.TopLeft,
  Tile.BottomLeft,
]);

const isEnclosedMap = new Map<Coords, boolean>();
function floodIsEnclosed(coord: Coords, parentCoords: Array<Coords>): boolean {
  if (isEnclosedMap.has(coord)) {
    return isEnclosedMap.get(coord)!;
  }

  // This tile is enclosed if all surrounding tiles exist + (are enclosed or are enclosures)
  const top = addCoords(coord, { x: 0, y: -1 });
  const topTile = map.get(top);
  const bottom = addCoords(coord, { x: 0, y: 1 });
  const bottomTile = map.get(bottom);
  const left = addCoords(coord, { x: -1, y: 0 });
  const leftTile = map.get(left);
  const right = addCoords(coord, { x: 1, y: 0 });
  const rightTile = map.get(right);

  if (!topTile || !bottomTile || !leftTile || !rightTile) {
    isEnclosedMap.set(coord, false);
    return false;
  }

  if (!parentCoords.includes(top)) {
    const topEnclosed =
      (distMap.has(top) && TOP_ENCLOSURE.has(topTile)) ||
      (!distMap.has(top) && floodIsEnclosed(top, [...parentCoords, coord]));
    if (!topEnclosed) {
      isEnclosedMap.set(coord, false);

      return false;
    }
  }
  if (!parentCoords.includes(bottom)) {
    const bottomEnclosed =
      (distMap.has(bottom) && BOTTOM_ENCLOSURE.has(bottomTile)) ||
      (!distMap.has(bottom) &&
        floodIsEnclosed(bottom, [...parentCoords, coord]));
    if (!bottomEnclosed) {
      isEnclosedMap.set(coord, false);

      return false;
    }
  }
  if (!parentCoords.includes(left)) {
    const leftEnclosed =
      (distMap.has(left) && LEFT_ENCLOSURE.has(leftTile)) ||
      (!distMap.has(left) && floodIsEnclosed(left, [...parentCoords, coord]));
    if (!leftEnclosed) {
      isEnclosedMap.set(coord, false);

      return false;
    }
  }
  if (!parentCoords.includes(right)) {
    const rightEnclosed =
      (distMap.has(right) && RIGHT_ENCLOSURE.has(rightTile)) ||
      (!distMap.has(right) && floodIsEnclosed(right, [...parentCoords, coord]));
    if (!rightEnclosed) {
      isEnclosedMap.set(coord, false);

      return false;
    }
  }

  isEnclosedMap.set(coord, true);
  return true;
}
for (let x = 0; x < width; x++) {
  for (let y = 0; y < height; y++) {
    // Check any tile that's not part of the main loop
    const coords = toCoords(x, y);
    if (!distMap.has(coords) && !isEnclosedMap.has(coords)) {
      floodIsEnclosed(coords, []);
    }
  }
}

console.log(
  "Count enclosed: " +
    Array.from(isEnclosedMap.values()).filter((e) => e).length
);
