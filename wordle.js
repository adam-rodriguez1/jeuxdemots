let rows = 6;
let cols = 5;
let targetWord = "";
let guessedCount = 0;
let currentRow = 0;
let currentCol = 0;
let rareWordsWithDefinitions = [];

const messageContainer = document.getElementById("message");
const gridContainer = document.getElementById("grid");
const restartButton = document.querySelector(".restartbutton");
const themeToggleButton = document.getElementById("theme-toggle");

themeToggleButton.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
});

const gameModesButton = document.getElementById("game-modes-button");
const gameModesModal = document.getElementById("game-modes-modal");
const closeGameModesButton = document.getElementById("close-game-modes");
const rulesModal = document.getElementById("rules-modal");
const openRulesButton = document.getElementById("open-rules-button");
const closeButton = document.getElementById("close-rules");

//a faire fonction modale
gameModesButton.addEventListener("click", () => {
  gameModesModal.style.display = "block";
});

closeGameModesButton.addEventListener("click", () => {
  gameModesModal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target === gameModesModal) {
    gameModesModal.style.display = "none";
  }
});

openRulesButton.addEventListener("click", () => {
  rulesModal.style.display = "block";
});

closeButton.addEventListener("click", () => {
  rulesModal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target === rulesModal) {
    rulesModal.style.display = "none";
  }
});

// a faire cree une foction reset avec  currentRow = 0;  currentCol = 0;  guessedCount = 0,
function clearGrid() {
  gridContainer.innerHTML = "";
}

function getRandomWord(length) {
  const filteredWords = window.validWords.filter((word) => word.length === length);
  return filteredWords[Math.floor(Math.random() * filteredWords.length)].toLowerCase();
}

function displayMessage(message, type) {
  messageContainer.textContent = message;
  messageContainer.className = type;
}
function loadRareWord() {
  cols = 8;

  if (rareWordsWithDefinitions.length > 0) {
    const randomIndex = Math.floor(Math.random() * rareWordsWithDefinitions.length);
    const selectedWordObj = rareWordsWithDefinitions[randomIndex];

    targetWord = selectedWordObj.word.toLowerCase();
    const definition = selectedWordObj.definition;

    const definitionContainer = document.querySelector("#mot-complique-mode p");
    definitionContainer.textContent = `Définition : ${definition}`;
  } else {
    console.error("Erreur : aucun mot rare disponible.");
    displayMessage("Erreur : Impossible de charger les mots rares.", "error");
    return;
  }

  currentRow = 0;
  currentCol = 0;
  guessedCount = 0;
  displayMessage("", "");

  generateGrid();

  console.log(`Mode Mots Rares activé : ${targetWord}`);
}

let activeMode = "libre";
updateGameModeUI();
function updateGameModeUI() {
  const timeAttackMode = document.getElementById("time-attack-mode");
  const motCompliqueMode = document.getElementById("mot-complique-mode");
  const wordLengthDropdown = document.getElementById("word-length-dropdown");
  const attemptDropdown = document.getElementById("attempt-dropdown");

  rows = 6;
  cols = 5;

  if (activeMode === "libre") {
    timeAttackMode.style.display = "none";

    motCompliqueMode.style.display = "none";
    wordLengthDropdown.parentElement.style.display = "block";
    attemptDropdown.parentElement.style.display = "block";
  } else if (activeMode === "Mots Rares") {
    timeAttackMode.style.display = "none";

    motCompliqueMode.style.display = "block";
    wordLengthDropdown.parentElement.style.display = "block";
    attemptDropdown.parentElement.style.display = "block";
  } else if (activeMode === "Contre la Montre") {
    timeAttackMode.style.display = "flex";

    motCompliqueMode.style.display = "none";
    wordLengthDropdown.parentElement.style.display = "none";
    attemptDropdown.parentElement.style.display = "none";
  } else {
    console.error(`Unknown game mode: ${activeMode}`);
  }

  console.log(`Game mode set to: ${activeMode}`);
}

document.addEventListener("DOMContentLoaded", () => {
  const modeButtons = document.querySelectorAll(".mode-button");
  const gameModesModal = document.getElementById("game-modes-modal");
  const timeAttackMode = document.getElementById("time-attack-mode");
  const motCompliqueMode = document.getElementById("mot-complique-mode");
  const wordLengthDropdown = document.getElementById("word-length-dropdown");
  const attemptDropdown = document.getElementById("attempt-dropdown");
  const restartButton = document.querySelector(".restartbutton");
  const keyAndMessage = document.querySelector(".key-and-message");

  // Enhanced toggleDisplay function
  function toggleDisplay(element, show, displayType = "block") {
    element.style.display = show ? displayType : "none";
  }

  modeButtons.forEach((button) => {
    if (button.textContent.trim() === activeMode) {
      button.classList.add("active");
      console.log(activeMode);
      button.disabled = true;
    }
  });

  modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      modeButtons.forEach((btn) => {
        btn.classList.remove("active");
        btn.disabled = false;
      });

      button.classList.add("active");
      button.disabled = true;

      activeMode = button.textContent.trim();
      updateGameModeUI();
      if (activeMode === "Mots Rares") {
        loadRareWord();
      } else {
        resetGridAndWord();
      }

      if (activeMode === "Contre la Montre") {
        toggleDisplay(timeAttackMode, true, "flex");
        toggleDisplay(motCompliqueMode, false);
        toggleDisplay(wordLengthDropdown, false);
        toggleDisplay(attemptDropdown, false);
        restartButton.textContent = "Redémarrer";
        toggleDisplay(keyAndMessage, true, "flex");
      } else if (activeMode === "libre") {
        toggleDisplay(timeAttackMode, false);
        toggleDisplay(motCompliqueMode, false);
        toggleDisplay(wordLengthDropdown, true);
        toggleDisplay(attemptDropdown, true);
        restartButton.textContent = "Suivant";
        toggleDisplay(keyAndMessage, true, "flex");
      } else if (activeMode === "Mots Compliqué" || activeMode === "Mots Rares") {
        toggleDisplay(timeAttackMode, false);
        toggleDisplay(motCompliqueMode, true);
        toggleDisplay(wordLengthDropdown, false);
        toggleDisplay(attemptDropdown, false);
        restartButton.textContent = "Suivant";
        toggleDisplay(keyAndMessage, true, "flex");
      }

      gameModesModal.style.display = "none";

      console.log(`Game mode changed to: ${activeMode}`);
    });
  });
});

const timerDisplay = document.getElementById("timer-display");
const startButton = document.getElementById("start-timer-button");
const scoreDisplay = document.getElementById("score-display");
let countdown;
let timer;
let timeLeft = 60;
let score = 0;
let isGameActive = false;
function startCountdown() {
  const countdown = document.getElementById("countdown");
  const countdownNumber = document.getElementById("countdown-number");
  const goMessage = document.getElementById("go-message");
  let countdownTime = 3;

  // Reset states
  countdownNumber.textContent = countdownTime;
  goMessage.classList.remove("show");
  countdown.classList.add("show");

  const interval = setInterval(() => {
    countdownTime--;

    if (countdownTime > 0) {
      countdownNumber.textContent = countdownTime;

      // Restart animation
      countdownNumber.style.animation = "none";
      void countdownNumber.offsetWidth; // Trigger reflow
      countdownNumber.style.animation = "";
    } else {
      clearInterval(interval);

      // Show "GO!" message
      countdownNumber.style.display = "none";
      goMessage.classList.add("show");

      setTimeout(() => {
        goMessage.classList.remove("show");
        countdown.classList.remove("show");
        countdownNumber.style.display = ""; // Reset for next use
        startGame(); // Start the game
      }, 500); // Match this with the "GO" animation duration
    }
  }, 1000);
}
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const themeToggleMobile = document.getElementById("theme-toggle-mobile");
  const gameModesButtonMobile = document.getElementById("game-modes-button-mobile");
  const openRulesButtonMobile = document.getElementById("open-rules-button-mobile");

  // Toggle the mobile menu
  menuToggle.addEventListener("click", () => {
    mobileMenu.style.display = mobileMenu.style.display === "flex" ? "none" : "flex";
  });

  // Mobile theme toggle
  themeToggleMobile.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
  });

  // Mobile game modes button
  gameModesButtonMobile.addEventListener("click", () => {
    const gameModesModal = document.getElementById("game-modes-modal");
    gameModesModal.style.display = "block";
    mobileMenu.style.display = "none"; // Hide menu after clicking
  });

  // Mobile rules button
  openRulesButtonMobile.addEventListener("click", () => {
    const rulesModal = document.getElementById("rules-modal");
    rulesModal.style.display = "block";
    mobileMenu.style.display = "none"; // Hide menu after clicking
  });
});

function resetGridAndWord() {
  clearGrid();
  generateGrid();
  targetWord = getRandomWord(cols);
  console.log(`Nouveau mot : ${targetWord}`);
}
const passButton = document.getElementById("pass-button");
const gameContainer = document.getElementById("game-container");

passButton.addEventListener("click", async (e) => {
  e.preventDefault();
  passButton.blur();

  if (isGameActive) {
    resetCurrentRowState();

    currentRow = 0;
    currentCol = 0;
    guessedCount = 0;

    clearGrid();
    generateGrid();
    targetWord = await getRandomWord(cols);
    console.log(`Nouveau mot après "Passer" : ${targetWord}`);

    setTimeout(() => {
      gameContainer.focus();
    }, 0);
  }
});

function resetCurrentRowState() {
  for (let col = 0; col < cols; col++) {
    const cell = document.getElementById(`cell-${currentRow}-${col}`);
    if (cell) {
      cell.textContent = "";
      cell.className = "cell";
    }
  }
}

function startGame() {
  isGameActive = true;
  timeLeft = 60;
  score = 0;
  scoreDisplay.textContent = `Score: ${score}`;
  timerDisplay.textContent = `${timeLeft}s`;
  startButton.disabled = true;
  resetGridAndWord();
  console.log("le jeu contre la montre est" + isGameActive);

  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `${timeLeft}s`;
    console.log(score);
    if (timeLeft === 0) {
      console.log("time left fonctionne");
      endGame();
    }
  }, 1000);
}

function endGame() {
  clearInterval(timer);
  isGameActive = false;
  alert(`Temps écoulé ! Votre score est de ${score}`);
}

function wordGuessedCorrectly() {
  if (isGameActive) {
    score++; // Augmente le score
    scoreDisplay.textContent = `Score: ${score}`;
    currentRow = 0;
    currentCol = 0;
    guessedCount = 0;
    resetGridAndWord();
  }
}

startButton.addEventListener("click", () => {
  if (!isGameActive) {
    startCountdown();
    setTimeout(() => {
      restartButton.style.display = "block";
    }, "3500");
  }
});

function setupCustomDropdown(dropdownId, callback) {
  const dropdown = document.getElementById(dropdownId);
  const header = dropdown.querySelector(".dropdown-header");
  const list = dropdown.querySelector(".dropdown-list");
  const chevron = header.querySelector("i");

  header.addEventListener("click", () => {
    list.classList.toggle("active");
    chevron.classList.toggle("rotate");
  });

  list.addEventListener("click", (event) => {
    if (event.target.tagName === "LI") {
      const value = event.target.getAttribute("data-value");
      const text = event.target.textContent;
      header.textContent = text;

      list.classList.remove("active");
      chevron.classList.remove("active");

      if (callback) callback(value);
    }
  });

  document.addEventListener("click", (event) => {
    if (!dropdown.contains(event.target)) {
      list.classList.remove("active");
    }
  });
}

setupCustomDropdown("word-length-dropdown", (value) => {
  cols = value === "Random Length" ? Math.floor(Math.random() * (10 - 5 + 1)) + 5 : parseInt(value, 10);
  initializeGame();
});

setupCustomDropdown("attempt-dropdown", (value) => {
  rows = parseInt(value, 10);
  initializeGame();
});

function checkAndColorWord(guessedWord) {
  const targetArray = targetWord.split("");
  const guessedArray = guessedWord.split("");
  const tempTarget = [...targetArray];

  guessedArray.forEach((letter, index) => {
    const cell = document.getElementById(`cell-${currentRow}-${index}`);
    if (letter === targetArray[index]) {
      cell.classList.add("correct");
      tempTarget[index] = null;
    }
  });

  guessedArray.forEach((letter, index) => {
    const cell = document.getElementById(`cell-${currentRow}-${index}`);
    if (!cell.classList.contains("correct") && tempTarget.includes(letter)) {
      cell.classList.add("present");
      tempTarget[tempTarget.indexOf(letter)] = null;
    }
  });
  if (guessedWord === targetWord) {
    displayMessage("Mot correct !", "success");
  } else {
    displayMessage("Essayez encore !", "error");
  }
}

function generateGrid() {
  clearGrid();
  gridContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.id = `cell-${row}-${col}`;
      gridContainer.appendChild(cell);
    }
  }
}
function updateCellDimensions(cols, rows) {
  document.documentElement.style.setProperty("--cell-count", cols);
  document.documentElement.style.setProperty("--row-count", rows);

  generateGrid();
}
function initializeGame() {
  if (activeMode === "libre") {
    const lengthHeader = document.querySelector("#word-length-dropdown .dropdown-header");
    const selectedLength = lengthHeader.textContent.trim();
    cols =
      selectedLength === "Random Length" ? Math.floor(Math.random() * (10 - 5 + 1)) + 5 : parseInt(selectedLength, 10);

    const attemptsHeader = document.querySelector("#attempt-dropdown .dropdown-header");
    rows = parseInt(attemptsHeader.textContent.trim(), 10);
    console.log("Initialisation du jeu...");
    console.log("Mode actif :", activeMode);
    console.log("Colonnes (cols) :", cols);
    console.log("Lignes (rows) :", rows);

    targetWord = getRandomWord(cols);
    console.log(targetWord);
    currentRow = 0;
    currentCol = 0;
    guessedCount = 0;
    displayMessage("", "");
    generateGrid();
  } else if (activeMode === "Mots Rares") {
    cols = 8;

    const attemptsHeader = document.querySelector("#attempt-dropdown .dropdown-header");
    rows = parseInt(attemptsHeader.textContent.trim(), 10);

    if (rareWordsWithDefinitions.length > 0) {
      const randomIndex = Math.floor(Math.random() * rareWordsWithDefinitions.length);
      const selectedWordObj = rareWordsWithDefinitions[randomIndex];

      targetWord = selectedWordObj.word.toLowerCase();
      const definition = selectedWordObj.definition;
      console.log("le mot rare est " + targetWord);

      const definitionContainer = document.querySelector("#mot-complique-mode p");
      definitionContainer.textContent = `Définition : ${definition}`;
    } else {
      console.error("La liste des mots rares est vide ou introuvable.");
      displayMessage("Erreur : Impossible de charger les mots rares.", "error");
      return;
    }

    currentRow = 0;
    currentCol = 0;
    guessedCount = 0;
    displayMessage("", "");
    generateGrid();
  } else if (activeMode === "Contre la Montre") {
    cols = 5;
    rows = 6;
    targetWord = getRandomWord(cols);
    currentRow = 0;
    currentCol = 0;
    guessedCount = 0;
    displayMessage("", "");

    generateGrid();
  }
}
const virtualKeys = document.querySelectorAll(".key");

virtualKeys.forEach((key) => {
  key.addEventListener("click", (event) => {
    const keyPressed = event.target.textContent.trim();
    handleKeyPress({ key: keyPressed });
  });
});

function handleKeyPress(event) {
  if (currentRow >= rows) return;

  const key = event.key || event; // Accept `event.key` for physical and `event` for virtual keys
  console.log("Key pressed:", key);

  if (/^[a-z]$/i.test(key) && currentCol < cols) {
    const cell = document.getElementById(`cell-${currentRow}-${currentCol}`);
    cell.textContent = key.toUpperCase();
    currentCol++;
  }

  if (key === "Backspace" || key === "⌫") {
    if (currentCol > 0) {
      currentCol--;
      const cell = document.getElementById(`cell-${currentRow}-${currentCol}`);
      if (cell) cell.textContent = "";
    }
  }

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

    animateWord(currentRow, guessedWord);

    setTimeout(() => {
      if (guessedWord === targetWord) {
        displayMessage(`Congratulations! You guessed the word in ${guessedCount} attempt(s).`, "success");
        return;
      }

      if (currentRow >= rows) {
        if (activeMode === "Contre la Montre") {
          displayMessage(`The word was "${targetWord}".`, "error");
          currentRow = 0;
          currentCol = 0;
          guessedCount = 0;
          resetGridAndWord();
        } else {
          displayMessage(`Game over! The word was "${targetWord}".`, "error");
        }
      }
    }, guessedWord.length * 200);
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const modeButtons = document.querySelectorAll(".mode-button");
  const gameModesModal = document.getElementById("game-modes-modal");
  let activeMode = "libre";

  modeButtons.forEach((button) => {
    if (button.textContent.trim() === activeMode) {
      button.classList.add("active");
    }
  });

  modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      modeButtons.forEach((btn) => btn.classList.remove("active"));

      button.classList.add("active");

      activeMode = button.textContent.trim();

      gameModesModal.style.display = "none";

      console.log(`Game mode changed to: ${activeMode}`);
    });
  });
});

function animateWord(row, guessedWord) {
  console.log(`Animating row: ${row}, Guessed Word: ${guessedWord}`);
  const targetArray = targetWord.split("");
  const guessedArray = guessedWord.split("");
  const tempTarget = [...targetArray];

  for (let i = 0; i < guessedArray.length; i++) {
    const cell = document.getElementById(`cell-${row}-${i}`);
    cell.style.display = "none";
  }
  console.log(`Animating row: ${row}, Current row: ${currentRow}`);

  for (let i = 0; i < guessedArray.length; i++) {
    const cell = document.getElementById(`cell-${row}-${i}`);
    console.log(`Animating row: ${row}, Current row: ${currentRow}`);
    setTimeout(() => {
      cell.style.display = "";

      if (guessedArray[i] === targetArray[i]) {
        cell.classList.add("correct");
        tempTarget[i] = null;
      } else if (tempTarget.includes(guessedArray[i])) {
        cell.classList.add("present");
        tempTarget[tempTarget.indexOf(guessedArray[i])] = null;
      } else {
        cell.classList.add("absent");
      }
    }, i * 200);
  }

  setTimeout(() => {
    if (guessedWord === targetWord) {
      displayMessage("Mot correct !", "success");
      if (activeMode === "Contre la Montre") {
        wordGuessedCorrectly();
      }
    } else if (activeMode !== "Contre la Montre") {
      currentRow++;
      currentCol = 0;
      displayMessage("Essayez encore !", "error");
    } else {
      currentRow++;
      currentCol = 0;
    }
  }, guessedArray.length * 200);
}

document.addEventListener("keydown", handleKeyPress);
restartButton.addEventListener("click", () => {
  if (activeMode === "Contre la Montre") {
    clearInterval(timer);
    timeLeft = 60;
    score = 0;
    isGameActive = false;
    gridContainer.innerHTML = "";
    timerDisplay.textContent = `${timeLeft}s`;
    scoreDisplay.textContent = `Score: ${score}`;
    startButton.disabled = false;
    console.log("Le mode Contre la Montre a été réinitialisé.");
    restartButton.style.display = "none";
  } else {
    initializeGame();
    console.log("Le jeu a été réinitialisé dans le mode :", activeMode);
  }
});

async function loadWords() {
  try {
    // Fetch standard words from mots.txt
    const wordsResponse = await fetch("./data/mots.txt"); // Relative path
    if (!wordsResponse.ok) throw new Error(`Failed to fetch mots.txt: ${wordsResponse.statusText}`);
    const wordsText = await wordsResponse.text();
    window.validWords = wordsText.split("\n").map((word) => word.trim());

    console.log("Mots standards chargés :", window.validWords);

    // Fetch rare words from motsdifficile.json
    const rareWordsResponse = await fetch("./data/motsdifficile.json"); // Relative path
    if (!rareWordsResponse.ok) throw new Error(`Failed to fetch motsdifficile.json: ${rareWordsResponse.statusText}`);
    const rareWordsData = await rareWordsResponse.json();
    rareWordsWithDefinitions = rareWordsData.words;

    const rareWords = rareWordsWithDefinitions.map((entry) => entry.word.toLowerCase());
    window.validWords = [...window.validWords, ...rareWords];

    console.log("Mots rares chargés :", rareWords);
    console.log("Tous les mots valides :", window.validWords);
  } catch (error) {
    console.error("Erreur lors du chargement des mots :", error);
  }
}

async function initializeGameAsync() {
  await loadWords();
  initializeGame();
}

document.addEventListener("DOMContentLoaded", () => {
  initializeGameAsync();
});
