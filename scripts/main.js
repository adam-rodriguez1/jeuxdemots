// main.js
import { rows, cols } from "./constants.js";
import { setupThemeToggle, setupModals } from "./dom.js";
import { initializeGame } from "./game.js";
import { setupGameModes, loadWordLists, activeWordList } from "./modes.js";

document.addEventListener("DOMContentLoaded", async () => {
  const gridContainer = document.getElementById("grid");
  const themeToggleButton = document.getElementById("theme-toggle");
  const modeButtons = document.querySelectorAll(".mode-button");
  const gameModesModal = document.getElementById("game-modes-modal");
  const closeGameModesButton = document.getElementById("close-game-modes");

  // Set up UI interactions
  setupThemeToggle(themeToggleButton);
  setupModals(gameModesModal, closeGameModesButton);

  // Load word lists
  await loadWordLists();

  // Set up game modes
  setupGameModes(modeButtons, gameModesModal, initializeGame, gridContainer);

  // Start default game
  initializeGame(gridContainer, activeWordList, rows, cols);
});
