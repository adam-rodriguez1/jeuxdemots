// grid.js
export function generateGrid(container, rows, cols) {
  container.innerHTML = "";
  container.style.gridTemplateColumns = `repeat(${cols}, 50px)`;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.id = `cell-${row}-${col}`;
      container.appendChild(cell);
    }
  }
}
