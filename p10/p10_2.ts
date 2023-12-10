// Approach: Walk the loop and keep track of which tiles are on the "left-hand"
// vs "right-hand" side of the loop. Count up tiles by handedness and the lower
// count is probably the answer.
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

enum Direction {
  Up,
  Down,
  Left,
  Right,
}

const DIRECTIONS = [
  Direction.Up,
  Direction.Down,
  Direction.Left,
  Direction.Right,
];

const TILE_CONFIGS: Record<
  Tile,
  {
    inDirection: Direction;
    outDirection: Direction;
    handedness: Partial<Record<Direction, false /* left */ | true /* right */>>;
  } | null
> = {
  [Tile.Vertical]: {
    inDirection: Direction.Up,
    outDirection: Direction.Down,
    handedness: {
      [Direction.Right]: false,
      [Direction.Left]: true,
    },
  },
  [Tile.Horizontal]: {
    inDirection: Direction.Right,
    outDirection: Direction.Left,
    handedness: {
      [Direction.Up]: true,
      [Direction.Down]: false,
    },
  },
  [Tile.TopRight]: {
    inDirection: Direction.Right,
    outDirection: Direction.Up,
    handedness: {
      [Direction.Down]: false,
      [Direction.Left]: false,
    },
  },
  [Tile.TopLeft]: {
    inDirection: Direction.Up,
    outDirection: Direction.Left,
    handedness: {
      [Direction.Right]: false,
      [Direction.Down]: false,
    },
  },
  [Tile.BottomLeft]: {
    inDirection: Direction.Left,
    outDirection: Direction.Down,
    handedness: {
      [Direction.Up]: false,
      [Direction.Right]: false,
    },
  },
  [Tile.BottomRight]: {
    inDirection: Direction.Down,
    outDirection: Direction.Right,
    handedness: {
      [Direction.Left]: false,
      [Direction.Up]: false,
    },
  },
  [Tile.Ground]: null,
  [Tile.Start]: null,
};

const DIRECTION_TO_OFFSET: Record<Direction, { x: number; y: number }> = {
  [Direction.Up]: { x: 0, y: -1 },
  [Direction.Down]: { x: 0, y: 1 },
  [Direction.Right]: { x: 1, y: 0 },
  [Direction.Left]: { x: -1, y: 0 },
};

const DIRECTION_TO_OPPOSITE: Record<Direction, Direction> = {
  [Direction.Up]: Direction.Down,
  [Direction.Left]: Direction.Right,
  [Direction.Right]: Direction.Left,
  [Direction.Down]: Direction.Up,
};

type Coords = string;
const toCoords = (x: number, y: number): Coords => `${x}.${y}`;
const addCoords = (c: Coords, d: Direction): string => {
  const split = c.split(".");
  return toCoords(
    Number(split[0]) + DIRECTION_TO_OFFSET[d].x,
    Number(split[1]) + DIRECTION_TO_OFFSET[d].y
  );
};

// Construct the map
const map = new Map<Coords, Tile>();
let startCoord: Coords | undefined = undefined;
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

enum Stage {
  ConstructLoop,
  FillHandedness,
}

function getNextPos(
  curPos: Coords,
  cameFrom: Direction
): { curPos: Coords | null; cameFrom: Direction } {
  const tile = map.get(curPos);
  if (!tile) {
    throw "Walked off the map at " + curPos;
  }
  const config = TILE_CONFIGS[tile];
  if (!config) {
    // Done walking
    return { curPos: null, cameFrom };
  }
  if (cameFrom === config.inDirection) {
    return {
      curPos: addCoords(curPos, config.outDirection),
      cameFrom: DIRECTION_TO_OPPOSITE[config.outDirection],
    };
  } else if (cameFrom === config.outDirection) {
    return {
      curPos: addCoords(curPos, config.inDirection),
      cameFrom: DIRECTION_TO_OPPOSITE[config.inDirection],
    };
  }
  throw "Invalid loop " + curPos + " " + tile + " " + cameFrom;
}

function startWalking(): { curPos: Coords; cameFrom: Direction } {
  // Start off in a random direction from the start
  for (const d of DIRECTIONS) {
    const coords = addCoords(startCoord!, d);
    const tile = map.get(coords);
    if (
      tile &&
      (TILE_CONFIGS[tile]?.inDirection === DIRECTION_TO_OPPOSITE[d] ||
        TILE_CONFIGS[tile]?.outDirection === DIRECTION_TO_OPPOSITE[d])
    ) {
      // Let's go this way!
      return {
        curPos: coords,
        cameFrom: DIRECTION_TO_OPPOSITE[d],
      };
    }
  }
  throw "Couldn't find a direction to start walking in";
}

const isInLoopSet: Set<Coords> = new Set();

const handednessMap: Map<Coords, boolean> = new Map();
function fillHandedness(pos: Coords, handedness: boolean) {
  // Recursively fill the handedness of empty tiles
  if (handednessMap.has(pos) || isInLoopSet.has(pos) || !map.has(pos)) {
    return;
  }
  handednessMap.set(pos, handedness);
  fillHandedness(addCoords(pos, Direction.Up), handedness);
  fillHandedness(addCoords(pos, Direction.Down), handedness);
  fillHandedness(addCoords(pos, Direction.Left), handedness);
  fillHandedness(addCoords(pos, Direction.Right), handedness);
}

function walkTheLoop(stage: Stage) {
  let { curPos, cameFrom }: { curPos: string | null; cameFrom: Direction } =
    startWalking();
  while (curPos) {
    if (stage === Stage.ConstructLoop) {
      isInLoopSet.add(curPos);
    } else if (stage === Stage.FillHandedness) {
      const config = TILE_CONFIGS[map.get(curPos)!];
      if (config) {
        const goingBackwards = cameFrom === config!.outDirection;
        Object.entries(config!.handedness).forEach(
          ([d, handedness]: [string, boolean]) => {
            fillHandedness(
              addCoords(curPos!, d as unknown as Direction),
              goingBackwards ? !handedness : handedness
            );
          }
        );
      }
    }
    const next = getNextPos(curPos, cameFrom);
    curPos = next.curPos;
    cameFrom = next.cameFrom;
  }
}

walkTheLoop(Stage.ConstructLoop);
walkTheLoop(Stage.FillHandedness);

let leftHandCount = 0;
let rightHandCount = 0;

for (const entry of handednessMap.entries()) {
  if (entry[1]) {
    rightHandCount++;
  } else {
    leftHandCount++;
  }
}

console.log({ leftHandCount, rightHandCount });
