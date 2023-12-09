package p9

import (
	"os"
	"strings"
)

func ReadInput() []string {
	content, _ := os.ReadFile("input/p9.txt")
	lines := strings.Split(string(content), "\n")
	return lines
}

func DiffSequence(seq []int) *[]int {
	var diffSlice []int
	for i := 1; i < len(seq); i++ {
		diffSlice = append(diffSlice, seq[i]-seq[i-1])
	}
	return &diffSlice
}

func HasNonZero(seq []int) bool {
	for _, num := range seq {
		if num != 0 {
			return true
		}
	}
	return false
}

func Reverse[T any](s []T) {
	last := len(s) - 1
	for i := 0; i < len(s)/2; i++ {
		s[i], s[last-i] = s[last-i], s[i]
	}
}
