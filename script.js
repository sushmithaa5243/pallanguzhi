let pits = Array(14).fill(5);
let currentPlayer = 1;

let score1 = 0;
let score2 = 0;

const board = document.getElementById("board");
const statusText = document.getElementById("status");

function createBoard() {
    board.innerHTML = "";

    // Player 2 (top row)
    for (let i = 13; i >= 7; i--) {
        let pit = document.createElement("div");
        pit.classList.add("pit");
        pit.innerText = pits[i];

        if (currentPlayer === 2 && pits[i] > 0) {
            pit.onclick = () => makeMove(i);
        }

        board.appendChild(pit);
    }

    // Player 1 (bottom row)
    for (let i = 0; i < 7; i++) {
        let pit = document.createElement("div");
        pit.classList.add("pit");
        pit.innerText = pits[i];

        if (currentPlayer === 1 && pits[i] > 0) {
            pit.onclick = () => makeMove(i);
        }

        board.appendChild(pit);
    }

    statusText.innerText =
        `Player ${currentPlayer} Turn | P1: ${score1} P2: ${score2}`;
}

function makeMove(index) {
    let i = index;
    let stones = pits[i];

    if (stones === 0) return;

    pits[i] = 0;

    while (true) {
        // Distribute
        while (stones > 0) {
            i = (i + 1) % 14;
            pits[i]++;
            stones--;
        }

        // Relay move
        if (pits[i] > 1) {
            stones = pits[i];
            pits[i] = 0;
        } else {
            break;
        }
    }

    // 🔥 Tamil Nadu capture rule
    let next = (i + 1) % 14;
    let nextNext = (i + 2) % 14;

    if (pits[next] === 0 && pits[nextNext] > 0) {
        let captured = pits[nextNext];
        pits[nextNext] = 0;

        if (currentPlayer === 1) {
            score1 += captured;
        } else {
            score2 += captured;
        }
    }

    // 🔄 Switch player
    currentPlayer = currentPlayer === 1 ? 2 : 1;

    createBoard();
}

createBoard();