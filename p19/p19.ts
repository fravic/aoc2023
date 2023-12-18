import * as fs from "fs";

const file = fs.readFileSync("./p19/input.txt", "utf8");
const lines = file.split("\n");

type Instruction = {
  field?: "x" | "m" | "a" | "s";
  comparator?: ">" | "<";
  value?: number;
  next: "A" | "R" | string;
};
type Workflow = Array<Instruction>;
const workflows: { [name: string]: Workflow } = {};

const REGEX = /^([A-Za-z]+)\{(.+)\}$/;

let i;
for (i = 0; i < lines.length; i++) {
  const l = lines[i];
  if (l.length === 0) {
    break;
  }

  const matches = REGEX.exec(l)!;
  const name = matches[1];
  const instrs = matches[2].split(",");
  workflows[name] = instrs.map((instr) => {
    if (instr.includes(">") || instr.includes("<")) {
      const INSTR_REGEX = /^(x|m|a|s)(\<|\>)(\d+)\:(.+)$/;
      const parsed = INSTR_REGEX.exec(instr)!;
      return {
        field: parsed[1] as "x" | "m" | "a" | "s",
        comparator: parsed[2] as "<" | ">",
        value: Number(parsed[3]),
        next: parsed[4],
      };
    }
    return {
      next: instr,
    };
  });
}

const PART_REGEX = /^\{x=(\d+),m=(\d+),a=(\d+),s=(\d+)\}$/;
type Part = { x: number; m: number; a: number; s: number };

function run(name: string, part: Part): string {
  const w = workflows[name];
  for (let i = 0; i < w.length; i++) {
    const res = rulePasses(w[i], part);
    if (res[0]) {
      //console.log(res[1]);
      if (res[1] === "A" || res[1] === "R") {
        return res[1];
      }
      return run(res[1], part);
    }
  }
  throw "No matching rule";
}

function rulePasses(rule: Instruction, part: Part): [boolean, string] {
  if (!rule.field) {
    return [true, rule.next];
  }
  if (rule.comparator === ">") {
    return [part[rule.field] > rule.value!, rule.next];
  } else if (rule.comparator === "<") {
    return [part[rule.field] < rule.value!, rule.next];
  }
  throw "What";
}

let sum = 0;
for (i = i + 1; i < lines.length; i++) {
  const counts = PART_REGEX.exec(lines[i])!;
  const part = {
    x: Number(counts[1]),
    m: Number(counts[2]),
    a: Number(counts[3]),
    s: Number(counts[4]),
  };
  //console.log("----", part);
  const START_W = "in";
  if (run(START_W, part) === "A") {
    sum += part.x + part.m + part.a + part.s;
  }
}
console.log("Sum", sum);
