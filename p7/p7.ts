import * as fs from "fs";
import { maxBy } from "lodash";

const file = fs.readFileSync("./p7/input.txt", "utf8");
const lines = file.split("\n");

const CARDS = [
  "A",
  "K",
  "Q",
  "T",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
  "J",
] as const;
type Card = (typeof CARDS)[number];

enum HandType {
  FiveOfAKind = 0,
  FourOfAKind = 1,
  FullHouse = 2,
  ThreeOfAKind = 3,
  TwoPair = 4,
  OnePair = 5,
  HighCard = 6,
}

interface Hand {
  cards: Array<Card>;
  bid: number;
}

const hands: Array<Hand> = [];
for (const line of lines) {
  const split = line.split(" ");
  hands.push({
    cards: split[0].split("") as Array<Card>,
    bid: Number(split[1]),
  });
}

// Sort fn: better hands later in array
function compareHands(h1: Hand, h2: Hand) {
  const h1Type = typeOfHand(h1);
  const h2Type = typeOfHand(h2);
  if (h1Type < h2Type) {
    return 1;
  } else if (h2Type < h1Type) {
    return -1;
  }
  for (const i in h1.cards) {
    if (CARDS.indexOf(h1.cards[i]) < CARDS.indexOf(h2.cards[i])) {
      return 1;
    } else if (CARDS.indexOf(h2.cards[i]) < CARDS.indexOf(h1.cards[i])) {
      return -1;
    }
  }
  return 0;
}

function typeOfHand(h: Hand): HandType {
  const counts: Map<Card, number> = new Map();
  for (const c of h.cards.filter((c) => c !== "J")) {
    const cur = counts.get(c);
    counts.set(c, cur ? cur + 1 : 1);
  }
  const jokerCount = h.cards.filter((c) => c === "J").length;
  // Joker is most efficiently used by adding it to the highest count.
  // If all Js, set to all As.
  const mostFreqCard =
    maxBy(Array.from(counts.keys()), (k) => counts.get(k)) ?? "A";
  counts.set(mostFreqCard, (counts.get(mostFreqCard) ?? 0) + jokerCount);
  const countValues = Array.from(counts.values());
  const values = new Set(countValues);
  if (values.has(5)) {
    return HandType.FiveOfAKind;
  } else if (values.has(4)) {
    return HandType.FourOfAKind;
  } else if (values.has(3) && values.has(2)) {
    return HandType.FullHouse;
  } else if (values.has(3)) {
    return HandType.ThreeOfAKind;
  } else if (countValues.filter((c) => c === 2).length === 2) {
    return HandType.TwoPair;
  } else if (values.has(2)) {
    return HandType.OnePair;
  }
  return HandType.HighCard;
}

hands.sort(compareHands);
let winnings = 0;
for (const idx in hands) {
  winnings += hands[idx].bid * (Number(idx) + 1);
}
console.log("Winnings:", winnings);
