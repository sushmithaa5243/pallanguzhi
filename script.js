let pits = Array(14).fill(5);
let currentPlayer = 1;

let score1 = 0;
let score2 = 0;

let gameOver = false;

const board = document.getElementById("board");
const statusText = document.getElementById("status");

// Create Board
function createBoard() {
    board.innerHTML = "";

    // Player 2 (top)
    for (let i = 13; i >= 7; i--) {
        let pit = document.createElement("div");
        pit.classList.add("pit");

        // add seeds visually
        for (let s = 0; s < pits[i]; s++) {
            let seed = document.createElement("div");
            seed.classList.add("seed");
            pit.appendChild(seed);
        }

        if (!gameOver && currentPlayer === 2 && pits[i] > 0) {
            pit.onclick = () => makeMove(i);
        }

        board.appendChild(pit);
    }

    // Player 1 (bottom)
    for (let i = 0; i < 7; i++) {
        let pit = document.createElement("div");
        pit.classList.add("pit");

        for (let s = 0; s < pits[i]; s++) {
            let seed = document.createElement("div");
            seed.classList.add("seed");
            pit.appendChild(seed);
        }

        if (!gameOver && currentPlayer === 1 && pits[i] > 0) {
            pit.onclick = () => makeMove(i);
        }

        board.appendChild(pit);
    }

    if (!gameOver) {
        statusText.innerText =
            `Player ${currentPlayer} Turn | P1: ${score1} | P2: ${score2}`;
    }
}

// Animated Move
function makeMove(index) {
    if (gameOver) return;

    let stones = pits[index];
    if (stones === 0) return;

    pits[index] = 0;
    createBoard();

    let i = index;

    function dropSeeds() {
        if (stones > 0) {
            i = (i + 1) % 14;
            pits[i]++;
            stones--;

            createBoard();
            setTimeout(dropSeeds, 250);
        } else {
            handleNext(i);
        }
    }

    function handleNext(lastIndex) {
        let next = (lastIndex + 1) % 14;

        if (pits[next] > 0) {
            stones = pits[next];
            pits[next] = 0;
            i = next;

            setTimeout(dropSeeds, 250);
        } else {
            let nextNext = (lastIndex + 2) % 14;

            if (pits[nextNext] > 0) {
                let captured = pits[nextNext];
                pits[nextNext] = 0;

                if (currentPlayer === 1) {
                    score1 += captured;
                } else {
                    score2 += captured;
                }
            }

            checkGameEnd();

            if (!gameOver) {
                currentPlayer = currentPlayer === 1 ? 2 : 1;
            }

            createBoard();
        }
    }

    dropSeeds();
}

// Game End
function checkGameEnd() {
    let p1Empty = pits.slice(0, 7).every(p => p === 0);
    let p2Empty = pits.slice(7).every(p => p === 0);

    if (p1Empty || p2Empty) {
        gameOver = true;

        let remaining = pits.reduce((a, b) => a + b, 0);

        if (p1Empty) score2 += remaining;
        else score1 += remaining;

        pits = Array(14).fill(0);

        if (score1 > score2) {
            statusText.innerText = `🏆 Player 1 Wins! (${score1}-${score2})`;
        } else if (score2 > score1) {
            statusText.innerText = `🏆 Player 2 Wins! (${score2}-${score1})`;
        } else {
            statusText.innerText = `Draw! (${score1}-${score2})`;
        }
    }
}

// Restart
function restartGame() {
    pits = Array(14).fill(5);
    currentPlayer = 1;
    score1 = 0;
    score2 = 0;
    gameOver = false;

    createBoard();
}

createBoard();