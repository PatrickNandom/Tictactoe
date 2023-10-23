const readline = require('readline');
const fs = require('fs')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const movesFile = 'moves.txt';
const store = fs.createWriteStream(movesFile, { flags: 'a' })

let board = [
    [' ', ' ', ' '],
    [' ', ' ', ' '],
    [' ', ' ', ' ']
];

let player = 'X';

function displayBoard() {
    console.log(board[0][0] + '|' + board[0][1] + '|' + board[0][2]);
    console.log('------');
    console.log(board[1][0] + '|' + board[1][1] + '|' + board[1][2]);
    console.log('------');
    console.log(board[2][0] + '|' + board[2][1] + '|' + board[2][2]);
}

function checkWin() {
    // Check rows
    for (let i = 0; i < 3; i++) {
        if (board[i][0] === player && board[i][1] === player && board[i][2] === player) {
            return true;
        }
    }

    // Check columns
    for (let i = 0; i < 3; i++) {
        if (board[0][i] === player && board[1][i] === player && board[2][i] === player) {
            return true;
        }
    }

    // Check diagonals
    if (board[0][0] === player && board[1][1] === player && board[2][2] === player) {
        return true;
    }

    if (board[0][2] === player && board[1][1] === player && board[2][0] === player) {
        return true;
    }

    return false;
}

function playTurn() {
    rl.question(`Player ${player}, enter row and column (e.g. 1 2): `, (input) => {
        const [row, col] = input.split(' ').map((x) => +x - 1);

        if (board[row][col] !== ' ') {
            console.log('That space is already taken!');
            playTurn();
        } else {
            board[row][col] = player;
            displayBoard();
            store.write(`Player ${player}: Row ${row + 1}, Column ${col + 1}\n`);

            if (checkWin()) {
                console.log(`Player ${player} wins!`);
                store.write(`Congratulations 🎉! Player ${player} wins!\n`);

                rl.close();
            } else if (board.flat().every((x) => x !== ' ')) {
                console.log('The bord is full...!');
                rl.close();
            } else {
                player = player === 'X' ? 'O' : 'X';
                playTurn();
            }
        }
    });
}

displayBoard();
playTurn();