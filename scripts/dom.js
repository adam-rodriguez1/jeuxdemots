// dom.js
export function setupThemeToggle(themeToggleButton) {
  themeToggleButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
  });
}

export function setupModals(modalButton, modal, closeButton) {
  if (!modalButton || !modal || !closeButton) {
    console.error("One or more modal elements are undefined:", { modalButton, modal, closeButton });
    return; // Exit early if elements are missing
  }

  modalButton.addEventListener("click", () => {
    modal.style.display = "block";
  });

  closeButton.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
}
