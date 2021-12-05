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
import { clearChildren, retrieveAllLocalStorageItems } from './utils.js';

const gameGrid = document.querySelector('.game-container');
const inventoryToolGrid = document.querySelector('.ic__tool-container');
const inventoryResourceGrid = document.querySelector('.ic__resource-container');
const resetButton = document.querySelector('#reset-button');
const saveButton = document.querySelector('#save-button');
// const loadButton = document.querySelector('#load-button');

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

// Initialize the local storage
localStorage.clear();
localStorage.setItem('InitialMatrix', JSON.stringify(getCurrentMatrix()));
// console.log(retrieveAllLocalStorageItems());

resetButton.addEventListener('click', () => {
    clearChildren(gameGrid);
    clearChildren(inventoryToolGrid);
    clearChildren(inventoryResourceGrid);
    init();
});

saveButton.addEventListener('click', () => {
    localStorage.setItem(
        new Date().toJSON(),
        JSON.stringify(getCurrentMatrix())
    );
});

/* TODO
loadButton.addEventListener('click', () => {
    const loadMap = retrieveAllLocalStorageItems();
    let ul = document.createElement('ul');
    loadMap.forEach((item) => {
        let li = document.createElement('li');
        li.innerText = item;
        ul.appendChild(li);
    });
    document.body.appendChild(ul);
}); */
