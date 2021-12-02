import {
    getInitialMatrixCopy,
    initGameConstants,
    // RESOURCE,
    resourceMap,
    createGridElement,
} from './game.js';
import {
    initInventoryConstants,
    inventoryMap,
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
            let resourceType = matrix[row][col];
            gameGrid.appendChild(createGridElement(row, col, resourceType));
            resourceMap.get(resourceType).maxItems++;
        }
    }
}

function drawInventory() {
    inventoryMap.forEach((inventoryItem) => {
        if (inventoryItem.isTool) {
            inventoryToolGrid.appendChild(createToolElement(inventoryItem));
        } else if (inventoryItem.isMineable) {
            inventoryResourceGrid.appendChild(
                createResourceElement(inventoryItem)
            );
        }
    });

    console.log(inventoryResourceGrid);
}

function initConstants() {
    initGameConstants();
    initInventoryConstants();
}

initConstants();
drawGame();
drawInventory();
