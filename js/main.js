import {
    initialMatrix,
    initGameConstants,
    resourceMap,
    createGridElement,
    GRID_ROWS,
    GRID_COLS,
    getCurrentMatrix,
    setCurrentMatrix,
    RESOURCE,
} from './game.js';
import {
    initInventoryConstants,
    toolsMap,
    createToolElement,
    createResourceElement,
    updateInventoryItemAmount,
} from './inventory.js';
import {
    clearChildren,
    retrieveAllLocalStorageItems,
    cloneArray,
} from './utils.js';

const gameGrid = document.querySelector('.game-container');
const inventoryToolGrid = document.querySelector('.ic__tool-container');
const inventoryResourceGrid = document.querySelector('.ic__resource-container');
const resetButton = document.querySelector('#reset-button');
const saveButton = document.querySelector('#save-button');
const loadButton = document.querySelector('#load-button');

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

function resetGame(isReset = true) {
    clearChildren(gameGrid);
    clearChildren(inventoryToolGrid);
    clearChildren(inventoryResourceGrid);
    if (isReset) {
        // setCurrentMatrix(cloneArray(initialMatrix));

        setCurrentMatrix(randomizeMatrix());
    }
    init();
}

resetButton.addEventListener('click', resetGame);

resetGame(); //draws the initial game

//*****************************************************************************
// Save Functionality
//*****************************************************************************

// Initialize the local storage
localStorage.clear();
saveGame('InitialMatrix');

saveButton.addEventListener('click', () => {
    saveGame(new Date().getTime());
});

function saveGame(key) {
    let resourceArray = [];
    resourceMap.forEach((resource) => {
        resourceArray[resource.type] = resource.amountCollected;
    });
    let saved = {
        matrix: getCurrentMatrix(),
        resources: resourceArray,
    };
    localStorage.setItem(key, JSON.stringify(saved));
}

//*****************************************************************************
// Load Functionality
//*****************************************************************************
loadButton.addEventListener('click', displayLoadModal);

const modal = document.querySelector('.modal');
const confirmLoadButton = document.querySelector('#confirm-load-btn');
let selectedLoadKey = '';
let selectedLoadLink;

function displayLoadModal() {
    modal.style.display = 'block';
    const ulElement = document.querySelector('.modal__list');
    clearChildren(ulElement);
    const loadMap = retrieveAllLocalStorageItems();
    loadMap.forEach((value, key) => {
        let timestamp = parseInt(key);
        let li = document.createElement('li');
        li.innerText = timestamp ? new Date(timestamp).toLocaleString() : key;
        selectedLoadKey = key;
        li.addEventListener('click', onLoadLinkSelected);
        ulElement.appendChild(li);
    });
}

function onLoadLinkSelected(e) {
    if (selectedLoadLink) {
        selectedLoadLink.classList.remove('modal__list--selected');
    }
    selectedLoadLink = e.target;
    selectedLoadLink.classList.add('modal__list--selected');
}

confirmLoadButton.addEventListener('click', () => {
    if (selectedLoadKey !== '') {
        let loadedState = JSON.parse(localStorage.getItem(selectedLoadKey));
        setCurrentMatrix(loadedState.matrix);
        resetGame(false);
        updateResourceState(loadedState.resources);

        closeModal();
    }
});

function updateResourceState(loadedResources) {
    resourceMap.forEach((resource) => {
        if (resource.isMineable) {
            updateInventoryItemAmount(
                resource.type,
                loadedResources[resource.type]
            );
        }
    });
}

function closeModal() {
    modal.style.display = 'none';
    selectedLoadKey = '';
    selectedLoadLink = undefined;
}

document.querySelector('.close-modal').addEventListener('click', closeModal);

//***TODO - SET RANDOM MATRIX */
function getRandomResource(resourceTypes) {
    //returns a random resource from the resourceTypes array
    let randomIndex = Math.floor(Math.random() * resourceTypes.length);
    return resourceTypes[randomIndex];
}

export function randomizeMatrix() {
    const resourceTypes = Array.from(Object.values(RESOURCE));
    const maxAllowed = [];
    const total = GRID_ROWS * GRID_COLS;
    maxAllowed[RESOURCE.SKY] = total * 0.175;
    maxAllowed[RESOURCE.CLOUD] = total * 0.025;
    maxAllowed[RESOURCE.TREE] = total * 0.25;
    maxAllowed[RESOURCE.TRUNK] = total * 0.2;
    maxAllowed[RESOURCE.ROCK] = total * 0.25;
    maxAllowed[RESOURCE.GRASS] = total * 0.15;
    maxAllowed[RESOURCE.DIRT] = total * 0.2;
    maxAllowed[RESOURCE.WATER] = total * 0.15;

    const matrix = [];

    debugger;

    for (let row = GRID_ROWS - 1; row >= 0; row--) {
        matrix[row] = [];
        for (let col = GRID_COLS - 1; col >= 0; col--) {
            let arr = resourceTypes.slice();
            let randomResource = getRandomResource(arr);
            while (!isPositioned(randomResource, matrix, row, col)) {
                arr.splice(arr.indexOf(randomResource), 1);
                randomResource = getRandomResource(arr);
            }
            matrix[row][col] = randomResource;
            // if (maxAllowed[randomResource] === 1) {TODO
            //     resourceTypes.splice(resourceTypes.indexOf(randomResource), 1);
            // }
            maxAllowed[randomResource]--;
        }
    }
    return matrix;
}

function isPositioned(resource, matrix, row, col) {
    //checks if the random resource is positioned in the matrix
    let isPositionCorrect = false;
    switch (resource) {
        case RESOURCE.SKY:
            //position SKY at the top half
            isPositionCorrect = row < GRID_ROWS / 2;
            break;
        case RESOURCE.CLOUD:
            isPositionCorrect = row < GRID_ROWS / 10;
            break;
        case RESOURCE.TREE:
            isPositionCorrect =
                row === GRID_ROWS - 1 ||
                matrix[row + 1][col] === RESOURCE.DIRT ||
                matrix[row + 1][col] === RESOURCE.GRASS ||
                matrix[row + 1][col] === RESOURCE.TREE ||
                matrix[row + 1][col] === RESOURCE.TRUNK ||
                matrix[row][col + 1] === RESOURCE.TREE ||
                // matrix[row][col + 1] === RESOURCE.TRUNK ||
                matrix[row][col - 1] === RESOURCE.TREE; //||
            // matrix[row][col - 1] === RESOURCE.TRUNK
            break;
        case RESOURCE.TRUNK:
            isPositionCorrect =
                row === GRID_ROWS - 1 ||
                matrix[row + 1][col] === RESOURCE.DIRT ||
                matrix[row + 1][col] === RESOURCE.GRASS ||
                matrix[row + 1][col] === RESOURCE.TRUNK ||
                matrix[row][col + 1] === RESOURCE.TRUNK ||
                matrix[row][col - 1] === RESOURCE.TRUNK;
            break;
        case RESOURCE.ROCK:
            isPositionCorrect =
                row === GRID_ROWS - 1 ||
                matrix[row + 1][col] === RESOURCE.DIRT ||
                matrix[row + 1][col] === RESOURCE.GRASS ||
                matrix[row + 1][col] === RESOURCE.ROCK;
            break;
        case RESOURCE.GRASS:
            isPositionCorrect =
                row === GRID_ROWS - 1 ||
                matrix[row + 1][col] === RESOURCE.DIRT ||
                matrix[row + 1][col] === RESOURCE.GRASS;
            break;
        case RESOURCE.DIRT:
            isPositionCorrect =
                row === GRID_ROWS - 1 || matrix[row + 1][col] === RESOURCE.DIRT;
            break;
        case RESOURCE.WATER:
            isPositionCorrect =
                row === GRID_ROWS - 1 ||
                matrix[row + 1][col] === RESOURCE.WATER ||
                matrix[row + 1][col] === RESOURCE.ROCK ||
                matrix[row + 1][col] === RESOURCE.DIRT ||
                matrix[row + 1][col] === RESOURCE.TRUNK;
            break;
    }
    return isPositionCorrect;
}

console.log(randomizeMatrix());
