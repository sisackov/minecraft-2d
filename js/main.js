import {
    initGameConstants,
    resourceMap,
    createGridElement,
    GRID_ROWS,
    GRID_COLS,
    getCurrentMatrix,
} from './game.js';
import {
    initInventoryConstants,
    toolsMap,
    createToolElement,
    createResourceElement,
} from './inventory.js';
import { clearChildren } from './utils.js';

const gameGrid = document.querySelector('.game-container');
const inventoryToolGrid = document.querySelector('.ic__tool-container');
const inventoryResourceGrid = document.querySelector('.ic__resource-container');
const resetButton = document.querySelector('#reset-button');

function initConstants() {
    initGameConstants();
    initInventoryConstants();
}

function drawGame() {
    let matrix = getCurrentMatrix();
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
        if (resource.isMineable) {
            inventoryResourceGrid.appendChild(createResourceElement(resource));
        }
    });
}

function init() {
    initConstants();
    drawGame();
    drawInventory();
}

init();

resetButton.addEventListener('click', () => {
    clearChildren(gameGrid);
    clearChildren(inventoryToolGrid);
    clearChildren(inventoryResourceGrid);
    init();
});
