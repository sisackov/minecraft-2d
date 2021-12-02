import {
    getInitialMatrixCopy,
    Resource,
    resourceMap,
    createGridElement,
} from './game.js';

const gameGrid = document.querySelector('.game-container');
let matrix = getInitialMatrixCopy();

function drawGame() {
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
            gameGrid.appendChild(createGridElement(row, col, matrix[row][col]));
        }
    }
}

drawGame();
