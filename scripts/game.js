// game.js
import { state, targetWord } from "./constants.js";
import { clearGrid, getRandomWordFromList } from "./utils.js";

export function generateGrid(gridContainer, cols, rows) {
  clearGrid(gridContainer);
  gridContainer.style.gridTemplateColumns = `repeat(${cols}, 50px)`;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.id = `cell-${row}-${col}`;
      gridContainer.appendChild(cell);
    }
  }
}

export function initializeGame(gridContainer, wordList, rows, cols) {
  targetWord = getRandomWordFromList(wordList, cols);
  console.log(`Target Word: ${targetWord}`);
  state.currentRow = 0;
  state.currentCol = 0;
  state.guessedCount = 0;

  generateGrid(gridContainer, cols, rows);
}
