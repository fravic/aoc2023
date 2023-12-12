import * as fs from "fs";
import { findIndex, repeat, sum, uniq } from "lodash";

const file = fs.readFileSync("./p12/input.txt", "utf8");
const lines = file.split("\n");

interface Possibility {
  filled: string;
  startIdx: number;
}

const counts = lines.map((l) => {
  console.log("--- input:", l);
  const startPoss = l.split(" ")[0];
  const groups = l.split(" ")[1];

  let possibilities: Array<Possibility> = [{ filled: startPoss, startIdx: 0 }];

  for (const g of groups.split(",")) {
    const gNum = Number(g);
    const newPossibilities: Array<Possibility> = [];
    for (const p of possibilities) {
      // Add new possibilities
      let newStartIdx = p.startIdx;
      while (newStartIdx <= p.filled.length - gNum) {
        // Can we slot in at this start idx?
        if (p.filled[newStartIdx - 1] === "#") {
          // No; need to start after a space. This is a dead end because there's
          // an extra group behind us.
          newStartIdx++;
          break;
        }
        if (p.filled.slice(newStartIdx, newStartIdx + gNum).indexOf(".") >= 0) {
          // No; there are known non-matches
          newStartIdx++;
          continue;
        }
        if (p.filled[newStartIdx + gNum] === "#") {
          // Nope; no room
          newStartIdx++;
          continue;
        }
        if (newStartIdx + gNum === p.filled.length) {
          // Exact fit at the end!
          newPossibilities.push({
            filled: p.filled.slice(0, newStartIdx) + repeat("#", gNum),
            startIdx: newStartIdx + gNum + 1,
          });
        } else if (
          p.filled[newStartIdx + gNum] === "?" ||
          p.filled[newStartIdx + gNum] === "."
        ) {
          // Yes!
          newPossibilities.push({
            filled:
              p.filled.slice(0, newStartIdx) +
              repeat("#", gNum) +
              "." +
              p.filled.slice(newStartIdx + gNum + 1),
            startIdx: newStartIdx + gNum + 1,
          });

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
    possibilities = newPossibilities;
  }

  // Pare out any possibilities that have extra groups after all groups have already matched
  // Replace any remaining "?" with "." and unique-ify
  const pared = possibilities
    .filter((p) => {
      return p.filled.slice(p.startIdx).indexOf("#") === -1;
    })
    .map((p) => p.filled.replace(/\?/g, "."));
  console.log(JSON.stringify(pared, null, 2));
  return uniq(pared).length;
});

console.log("Sum: " + sum(counts));
