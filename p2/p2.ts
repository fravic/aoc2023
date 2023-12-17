import * as fs from "fs";

const file = fs.readFileSync("./p2/input.txt", "utf8");
const lines = file.split("\n");

function power(line: string): number {
  const parts = line.split(": ");
  const pulls = parts[1].split("; ");
  const colorMap: { [color: string]: number } = {};
  for (const pull of pulls) {
    const colors = pull.split(", ");
    for (const colorStr of colors) {
      const colorSplit = colorStr.split(" ");
      colorMap[colorSplit[1]] = Math.max(
        Number(colorSplit[0]),
        colorMap[colorSplit[1]] ?? 0
      );
    }
  }
  return colorMap["red"] * colorMap["green"] * colorMap["blue"];
}

let sum = 0;
for (const line of lines) {
  sum += power(line);
}

console.log("Sum: ", sum);
