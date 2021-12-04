import {
    getInitialMatrixCopy,
    initGameConstants,
    resourceMap,
    createGridElement,
} from './game.js';
import {
    initInventoryConstants,
    toolsMap,
    createToolElement,
    createResourceElement,
} from './inventory.js';

const gameGrid = document.querySelector('.game-container');
const inventoryContainer = document.querySelector('.inventory-container');
const inventoryToolGrid = document.querySelector('.ic__tool-container');
const inventoryResourceGrid = document.querySelector('.ic__resource-container');

let matrix = getInitialMatrixCopy();

function drawGame() {
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
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

function initConstants() {
    initGameConstants();
    initInventoryConstants();
}

initConstants();
drawGame();
drawInventory();
