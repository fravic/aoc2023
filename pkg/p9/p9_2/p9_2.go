package p9_2

import (
	"aoc2023/pkg/p9"
	"fmt"
	"strconv"
	"strings"
)

func Run() {
  lines := p9.ReadInput()
  sum := 0
  for _, line := range lines {
    numbers := strings.Split(line, " ")
    var intSlice []int
    for _, strNum := range numbers {
      num, _ := strconv.Atoi(strNum)
      intSlice = append(intSlice, num)
    }
    sum += calculateNextInSequence(intSlice)
  }
  fmt.Println("Result: ", sum)
}

func calculateNextInSequence(seq []int) int {
  curSeq := &seq
  var resultSeq []int
  for p9.HasNonZero(*curSeq) {
    resultSeq = append(resultSeq, (*curSeq)[0])
    curSeq = p9.DiffSequence(*curSeq)
  }
  p9.Reverse(resultSeq)
  for i := 1; i < len(resultSeq); i++ {
    resultSeq[i] = resultSeq[i] - resultSeq[i - 1]
  }
  return resultSeq[len(resultSeq) - 1]
}

