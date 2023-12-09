package main

import (
	"aoc2023/pkg/p1"
	"aoc2023/pkg/p9/p9_1"
	"aoc2023/pkg/p9/p9_2"
	"fmt"
	"os"
)

func main() {
	problem := os.Args[1]
	switch problem {
	case "p1":
		p1.Run()
	case "p9_1":
		p9_1.Run()
	case "p9_2":
		p9_2.Run()
	default:
		fmt.Println("Could not find problem:", problem)
	}
}