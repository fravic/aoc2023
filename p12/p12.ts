import * as fs from "fs";
import { findIndex, repeat, sum, uniq } from "lodash";

const file = fs.readFileSync("./p12/input.txt", "utf8");
const lines = file.split("\n");

const counts = lines.map((l) => {
  console.log("--- input:", l);
  const groupMap = l.split(" ")[0];
  const groups = l.split(" ")[1];

  let possibilityCount = 0;
  let nextGroupPossibilities: Array<number> = [];

  for (const g of groups.split(",")) {
    const gNum = Number(g);
    for (const p of nextGroupPossibilities) {
      // Add new possibilities
      let newStartIdx = p;
      while (newStartIdx <= groupMap.length - gNum) {
        // Can we slot in at this start idx?
        if (groupMap[newStartIdx - 1] === "#") {
          // No; need to start after a space. This is a dead end because there's
          // an extra group behind us.
          newStartIdx++;
          break;
        }
        if (groupMap.slice(newStartIdx, newStartIdx + gNum).indexOf(".") >= 0) {
          // No; there are known non-matches
          newStartIdx++;
          continue;
        }
        if (groupMap[newStartIdx + gNum] === "#") {
          // Nope; no room
          newStartIdx++;
          continue;
        }
        if (newStartIdx + gNum === groupMap.length) {
          // Exact fit at the end!
          nextGroupPossibilities.push(newStartIdx + gNum + 1);
        } else if (
          groupMap[newStartIdx + gNum] === "?" ||
          groupMap[newStartIdx + gNum] === "."
        ) {
          // Yes!
          nextGroupPossibilities.push(newStartIdx + gNum + 1);

          // Is this the definitive spot?
          if (
            p.filled.slice(newStartIdx, newStartIdx + gNum) ===
            repeat("#", gNum)
          ) {
            // We MUST slot in here
            break;
          }
        }
        newStartIdx++;
      }
    }
  }
  return possibilityCount;
});

console.log("Sum: " + sum(counts));
