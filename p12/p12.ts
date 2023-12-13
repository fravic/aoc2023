import * as fs from "fs";
import { sum } from "lodash";

const file = fs.readFileSync("./p12/input.txt", "utf8");
const lines = file.split("\n");

const REPEATS = 5;

const counts = lines.map((l) => {
  const _groupMap = l.split(" ")[0];
  const _groups = l.split(" ")[1];

  const groupMap = Array(REPEATS)
    .fill(null)
    .map((_) => _groupMap)
    .join("?");
  const groups = Array(REPEATS)
    .fill(null)
    .map((_) => _groups)
    .join(",");

  // Is this fast enough?
  const cumulativePeriodCounts: { [idx: number]: number } = {
    [-1]: 0,
  };
  for (let i = 0; i < groupMap.length; i++) {
    cumulativePeriodCounts[i] =
      cumulativePeriodCounts[i - 1] + (groupMap[i] === "." ? 1 : 0);
  }
  function mapContainsPeriod(startIdx: number, endIdx: number) {
    return (
      cumulativePeriodCounts[endIdx - 1] > cumulativePeriodCounts[startIdx - 1]
    );
  }

  const cumulativeHashCounts: { [idx: number]: number } = {
    [-1]: 0,
  };
  for (let i = 0; i < groupMap.length; i++) {
    cumulativeHashCounts[i] =
      cumulativeHashCounts[i - 1] + (groupMap[i] === "#" ? 1 : 0);
  }
  function mapContainsHash(startIdx: number, endIdx: number) {
    return (
      cumulativeHashCounts[endIdx - 1] > cumulativeHashCounts[startIdx - 1]
    );
  }

  let nextGroupPossibilities: { [idx: number]: number } = { 0: 1 };
  const split = groups.split(",");
  for (const gIdx in split) {
    const g = split[gIdx];
    const gNum = Number(g);
    const newPossibilities: { [idx: number]: number } = {};
    for (const entry of Object.entries(nextGroupPossibilities)) {
      // Add new possibilities
      const [p, base] = entry;
      let newStartIdx = Number(p);
      while (newStartIdx <= groupMap.length - gNum) {
        // Can we slot in at this start idx?
        if (groupMap[newStartIdx - 1] === "#") {
          // No; need to start after a space. This is a dead end because there's
          // an extra group behind us.
          newStartIdx++;
          break;
        }
        if (mapContainsPeriod(newStartIdx, newStartIdx + gNum)) {
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
          newPossibilities[newStartIdx + gNum + 1] =
            (newPossibilities[newStartIdx + gNum + 1] ?? 0) + base;
        }
        newStartIdx++;
      }
    }
    nextGroupPossibilities = newPossibilities;
  }

  // Pare out any possibilities that have extra groups after all groups have already matched
  return Object.entries(nextGroupPossibilities)
    .filter(([p, count]) => !mapContainsHash(Number(p), groupMap.length))
    .reduce((soFar, [p, count]) => soFar + count, 0);
});

console.log("Sum: " + sum(counts));
