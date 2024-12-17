// modes.js
export let activeWordList = [];
export const commonWords = [];
export const rareWords = [];

export function setupGameModes(modeButtons, modal, initializeGame, gridContainer) {
  modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      modeButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      const activeMode = button.textContent.trim();

      if (activeMode === "Mots Rares") {
        activeWordList = rareWords;
      } else {
        activeWordList = commonWords;
      }

      initializeGame(gridContainer, activeWordList);
      modal.style.display = "none";
    });
  });
}

export async function loadWordLists() {
  try {
    const commonResponse = await fetch("/data/mots.txt");
    const rareResponse = await fetch("/data/rare_words.txt");

    const commonText = await commonResponse.text();
    const rareText = await rareResponse.text();

    commonWords.push(...commonText.split("\n").map((word) => word.trim()));
    rareWords.push(...rareText.split("\n").map((word) => word.trim()));

    activeWordList = commonWords; // Default word list
  } catch (error) {
    console.error("Error loading word lists:", error);
  }
}
