// constants.js
export const rows = 6; // Default rows
export const cols = 5; // Default word length
export let targetWord = "";
export let guessedCount = 0;
export let currentRow = 0;
export let currentCol = 0;

export const state = {
  isGameActive: false,
  timeLeft: 60,
  score: 0,
};
