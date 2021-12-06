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
    TREE_COUNT
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
    generateRandomMatrix
} from './utils.js';

const gameGrid = document.querySelector('.game-container');
const inventoryToolGrid = document.querySelector('.ic__tool-container');
const inventoryResourceGrid = document.querySelector('.ic__resource-container');
const resetButton = document.querySelector('#reset-button');
const randomButton = document.querySelector('#random-button');
const saveButton = document.querySelector('#save-button');
const loadButton = document.querySelector('#load-button');
let loadedMatrix;
const RESET_TYPE = {
    RESET: 'RESET',
    RANDOM: 'RANDOM',
    LOADING: 'LOADING',
}

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

function resetGame(resetType) {
    clearChildren(gameGrid);
    clearChildren(inventoryToolGrid);
    clearChildren(inventoryResourceGrid);
    switch (resetType) {
        case RESET_TYPE.RESET:
            setCurrentMatrix(cloneArray(initialMatrix));
            break;
        case RESET_TYPE.RANDOM:
            setCurrentMatrix(randomGridGenerator());
            break;
        case RESET_TYPE.LOADING:
            setCurrentMatrix(loadedMatrix);
            break;
        default:
            setCurrentMatrix(randomGridGenerator());
            break;
    }

    init();
}

resetButton.addEventListener('click', () => { resetGame(RESET_TYPE.RESET); });

resetGame(RESET_TYPE.RESET); //draws the initial game

randomButton.addEventListener('click', () => { resetGame(RESET_TYPE.RANDOM); });

//*****************************************************************************
// Save Functionality
//*****************************************************************************

// Initialize the local storage
function initStorage() {
    if (!localStorage.getItem('Initial Matrix')) {
        localStorage.clear();
        saveGame('Initial Matrix');
    }
}
initStorage();

saveButton.addEventListener('click', () => {
    saveGame(new Date().getTime());
});

function saveGame(savedGameKey) {
    let resourceArray = [];
    resourceMap.forEach((resource) => {
        resourceArray[resource.type] = resource.amountCollected;
    });
    let saved = {
        matrix: getCurrentMatrix(),
        resources: resourceArray,
    };
    localStorage.setItem(savedGameKey, JSON.stringify(saved));
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
        li.dataset.key = key;
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
    selectedLoadKey = e.target.dataset.key;
}

confirmLoadButton.addEventListener('click', () => {
    if (selectedLoadKey !== '') {
        let loadedState = JSON.parse(localStorage.getItem(selectedLoadKey));
        loadedMatrix = loadedState.matrix;
        resetGame(RESET_TYPE.LOADING);
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

function randomGridGenerator() {
    return generateRandomMatrix(GRID_ROWS, GRID_COLS, TREE_COUNT);
}


