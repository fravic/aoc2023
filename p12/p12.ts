import * as fs from "fs";
import { findIndex, repeat, sum, uniq } from "lodash";

const file = fs.readFileSync("./p12/input.txt", "utf8");
const lines = file.split("\n");

const counts = lines.map((l) => {
  const groupMap = l.split(" ")[0];
  const groups = l.split(" ")[1];

  // Is this fast enough?
  function mapContains(char: string, startIdx: number, endIdx: number) {
    for (let i = startIdx; i < endIdx; i++) {
      if (groupMap[i] === char) {
        return true;
      }
    }
    return false;
  }

  let nextGroupPossibilities: Array<number> = [0];
  const split = groups.split(",");
  for (const gIdx in split) {
    const g = split[gIdx];
    const gNum = Number(g);
    const collectForNextGroup = [];
    for (const p of nextGroupPossibilities) {
      // Add new possibilities
      let newStartIdx = p;
      while (newStartIdx <= groupMap.length - gNum) {
        // Can we slot in at this start idx?
        if (groupMap[newStartIdx - 1] === "#") {
          // No; need to start after a space. This is a dead end because there's
          // an extra group behind us.
          break;
        }
        if (mapContains(".", newStartIdx, newStartIdx + gNum)) {
          // No; there are known non-matches
          newStartIdx++;
          continue;
        }
        if (groupMap[newStartIdx + gNum] === "#") {
          // Nope; no room
          newStartIdx++;
          continue;
        }
        if (
          newStartIdx + gNum === groupMap.length ||
          groupMap[newStartIdx + gNum] === "?" ||
          groupMap[newStartIdx + gNum] === "."
        ) {
          // Yes!
          collectForNextGroup.push(newStartIdx + gNum + 1);
        }
        newStartIdx++;
      }
    }
    nextGroupPossibilities = collectForNextGroup;
  }
  return nextGroupPossibilities.length;
});

console.log("Sum: " + sum(counts));
