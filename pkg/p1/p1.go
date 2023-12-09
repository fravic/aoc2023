package p1

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

var (
  wordToNumber = map[string]string {
    "one": "1",
    "two": "2",
    "three": "3",
    "four": "4",
    "five": "5",
    "six": "6",
    "seven": "7",
    "eight": "8",
    "nine": "9",
  }
)

func Run() {
  lines := readInput()
  sum := 0
  for _, line := range lines {
    convertedLine := insertNumeric(line)
    fmt.Println(convertedLine)
    numbers := filterToNumericCharacters(convertedLine)
    result := string(numbers[0]) + string(numbers[len(numbers) - 1])
    num, _ := strconv.Atoi(result)
    sum = sum + num
  }
  fmt.Println("Result:", sum)
}

func readInput() []string {
  content, _ := os.ReadFile("input/p1.txt")
  lines := strings.Split(string(content), "\n")
  return lines
}

func filterToNumericCharacters(line string) string {
  var builder strings.Builder
  for _, r := range line {
    if (r >= '0' && r <= '9') {
      builder.WriteRune(r)
    }
  }
  return builder.String()
}

func insertNumeric(line string) string {
  var builder strings.Builder
  for i := 0; i < len(line); i++ {
    sliced := line[i:]
    for word, number := range wordToNumber {
      if strings.HasPrefix(sliced, word) {
        builder.WriteString(number)
      }
    }
    builder.WriteRune(rune(sliced[0]))
  }
  return builder.String()
}
