// utils.js
export function clearGrid(gridContainer) {
  gridContainer.innerHTML = "";
}

export function displayMessage(container, message, type) {
  container.textContent = message;
  container.className = type; // Use classes like .success, .error for styling
}

export function getRandomWordFromList(wordList, length) {
  const filteredWords = wordList.filter((word) => word.length === length);
  return filteredWords[Math.floor(Math.random() * filteredWords.length)].toLowerCase();
}
