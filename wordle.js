// Constants and Initial Setup
let rows = 6; // Default rows
let cols = 5; // Default word length
let targetWord = "";
let guessedCount = 0;
let currentRow = 0;
let currentCol = 0;

// DOM Elements
const messageContainer = document.getElementById("message");
const gridContainer = document.getElementById("grid");
const svgContainer = document.getElementById("svg-container");
const restartButton = document.createElement("button");
const wordLengthSelector = document.createElement("select");

// Add a restart button
restartButton.textContent = "Restart";
restartButton.id = "restart";
restartButton.style.display = "none"; // Initially hidden
document.body.appendChild(restartButton);

// Add the SVG indicator
const svgElement = document.createElement("img");
svgElement.src = "/data/arrow-right-svgrepo-com.svg"; // Replace with the actual SVG path
svgElement.classList.add("row-indicator");
svgContainer.appendChild(svgElement);

const themeToggleButton = document.createElement("button");
themeToggleButton.textContent = "Toggle Theme";
document.body.insertBefore(themeToggleButton, gridContainer);

themeToggleButton.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
});

// Add Word Length Selector
wordLengthSelector.id = "word-length-selector";
const lengths = ["Random", 5, 6, 7, 8, 9, 10];
lengths.forEach((length) => {
  const option = document.createElement("option");
  option.value = length;
  option.textContent = length === "Random" ? "Random Length" : `${length} Letters`;
  wordLengthSelector.appendChild(option);
});
document.body.insertBefore(wordLengthSelector, gridContainer);

// Utility Functions
function clearGrid() {
  gridContainer.innerHTML = "";
}

function getRandomWord(length) {
  const filteredWords = window.validWords.filter((word) => word.length === length);
  return filteredWords[Math.floor(Math.random() * filteredWords.length)].toLowerCase();
}

function updateSVGIndicator(row) {
  const firstCell = document.getElementById(`cell-${row}-0`);
  const cellRect = firstCell.getBoundingClientRect();
  svgContainer.style.position = "absolute";
  svgContainer.style.left = `${cellRect.left - 40}px`; // Adjust as needed
  svgContainer.style.top = `${cellRect.top}px`;
}

function displayMessage(message, type) {
  messageContainer.textContent = message;
  messageContainer.className = type; // Use classes like .success, .error for styling
}

// Grid and Game Initialization
function generateGrid() {
  clearGrid();
  gridContainer.style.gridTemplateColumns = `repeat(${cols}, 50px)`; // Adjust the number of columns dynamically
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.id = `cell-${row}-${col}`;
      gridContainer.appendChild(cell);
    }
  }
}

function initializeGame() {
  // Get selected word length or randomize
  const selectedLength = wordLengthSelector.value;
  cols = selectedLength === "Random" ? Math.floor(Math.random() * (10 - 5 + 1)) + 5 : parseInt(selectedLength, 10);

  targetWord = getRandomWord(cols);
  console.log("Target word:", targetWord); // Debugging

  currentRow = 0;
  currentCol = 0;
  guessedCount = 0;
  displayMessage("", "");
  restartButton.style.display = "none";

  generateGrid(); // Regenerate grid with updated columns
  updateSVGIndicator(0); // Update SVG position
}

// Word Validation and Coloring
function checkAndColorWord(guessedWord) {
  const targetArray = targetWord.split("");
  const guessedArray = guessedWord.split("");
  const tempTarget = [...targetArray];

  // Check for correct position (green)
  guessedArray.forEach((letter, index) => {
    const cell = document.getElementById(`cell-${currentRow}-${index}`);
    if (letter === targetArray[index]) {
      cell.classList.add("correct");
      tempTarget[index] = null;
    }
  });

  // Check for correct letters but wrong positions (yellow)
  guessedArray.forEach((letter, index) => {
    const cell = document.getElementById(`cell-${currentRow}-${index}`);
    if (!cell.classList.contains("correct") && tempTarget.includes(letter)) {
      cell.classList.add("present");
      tempTarget[tempTarget.indexOf(letter)] = null;
    }
  });
}

// Event Handlers
function handleKeyPress(event) {
  if (currentRow >= rows) return;

  const key = event.key;

  // Handle letters (A-Z)
  if (/^[a-z]$/i.test(key) && currentCol < cols) {
    const cell = document.getElementById(`cell-${currentRow}-${currentCol}`);
    cell.textContent = key.toUpperCase();
    currentCol++;
  }

  // Handle backspace
  if (key === "Backspace" && currentCol > 0) {
    currentCol--;
    const cell = document.getElementById(`cell-${currentRow}-${currentCol}`);
    cell.textContent = "";
  }

  // Handle Enter key
  if (key === "Enter" && currentCol === cols) {
    guessedCount++;
    const guessedWord = Array.from(
      { length: cols },
      (_, i) => document.getElementById(`cell-${currentRow}-${i}`).textContent
    )
      .join("")
      .toLowerCase();

    if (!window.validWords.includes(guessedWord)) {
      displayMessage(`The word "${guessedWord}" does not exist.`, "error");
      return;
    }

    // Animate the valid word
    animateWord(currentRow, guessedWord);

    // Check for a win after animations
    setTimeout(() => {
      if (guessedWord === targetWord) {
        displayMessage(`Congratulations! You guessed the word in ${guessedCount} attempt(s).`, "success");
        restartButton.style.display = "block";
        return;
      }

      // If no more rows, end the game
      if (currentRow >= rows) {
        displayMessage(`Game over! The word was "${targetWord}".`, "error");
        restartButton.style.display = "block";
      }
    }, guessedWord.length * 200); // Wait until animations complete
  }
}

function animateWord(row, guessedWord) {
  if (row !== currentRow) return; // Ensure only the current row is animated

  const targetArray = targetWord.split(""); // Split target word into an array
  const guessedArray = guessedWord.split(""); // Split guessed word into an array
  const tempTarget = [...targetArray]; // Temporary array to track used letters

  // Hide all letters initially
  for (let i = 0; i < guessedArray.length; i++) {
    const cell = document.getElementById(`cell-${row}-${i}`);
    cell.style.display = "none"; // Hide the letter
  }

  // Reveal letters one by one with appropriate colors
  for (let i = 0; i < guessedArray.length; i++) {
    const cell = document.getElementById(`cell-${row}-${i}`);

    setTimeout(() => {
      cell.style.display = ""; // Make the letter visible

      // Check for correct position (green)
      if (guessedArray[i] === targetArray[i]) {
        cell.classList.add("correct");
        tempTarget[i] = null; // Mark as used
      }
      // Check for correct letter but wrong position (yellow)
      else if (tempTarget.includes(guessedArray[i])) {
        cell.classList.add("present");
        tempTarget[tempTarget.indexOf(guessedArray[i])] = null; // Mark as used
      }
    }, i * 200); // Stagger the reveal by 200ms per letter
  }

  // Ensure row state updates only after animations complete
  setTimeout(() => {
    currentRow++;
    currentCol = 0;
    updateSVGIndicator(currentRow);
  }, guessedArray.length * 200); // Wait until all animations are done
}

// Event Listener Setup
document.addEventListener("keydown", handleKeyPress);
restartButton.addEventListener("click", initializeGame);
wordLengthSelector.addEventListener("change", initializeGame);

// Load Words and Start the Game
fetch("/data/mots.txt")
  .then((response) => response.text())
  .then((data) => {
    const words = data.split("\n").map((word) => word.trim());

    window.validWords = words;
    initializeGame();
  })
  .catch((error) => console.error("Error loading words:", error));
