import {
    getInitialMatrixCopy,
    initGameConstants,
    resourceMap,
    createGridElement,
    GRID_ROWS,
    GRID_COLS,
} from './game.js';
import {
    initInventoryConstants,
    toolsMap,
    createToolElement,
    createResourceElement,
} from './inventory.js';

const gameGrid = document.querySelector('.game-container');
const inventoryToolGrid = document.querySelector('.ic__tool-container');
const inventoryResourceGrid = document.querySelector('.ic__resource-container');

let matrix = [];

function initConstants() {
    initGameConstants();
    initInventoryConstants();
}

function drawGame() {
    for (let row = 0; row < GRID_ROWS; row++) {
        for (let col = 0; col < GRID_COLS; col++) {
            gameGrid.appendChild(createGridElement(matrix[row][col], row, col));
            resourceMap.get(matrix[row][col]).maxItems++;
        }
    }
}

function drawInventory() {
    toolsMap.forEach((tool) => {
        inventoryToolGrid.appendChild(createToolElement(tool));
    });

    resourceMap.forEach((resource) => {
        console.log(resource);
        if (resource.isMineable) {
            inventoryResourceGrid.appendChild(createResourceElement(resource));
        }
    });
}

function init() {
    matrix = getInitialMatrixCopy();
    initConstants();
    drawGame();
    drawInventory();
}

init();
