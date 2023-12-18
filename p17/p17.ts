// Use A* (priority queue) heuristic modified such that movement in the same
// direction more than thrice is disallowed. Each node adds all three
// directional possibilities to the priority queue, rather than just the
// shortest.

import * as fs from "fs";

const file = fs.readFileSync("./p17/input.txt", "utf8");
const grid = file.split("\n");
