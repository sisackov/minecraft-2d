import {
    toolsMap,
    selectedInventoryItem,
    isToolSelected,
    isResourceSelected,
    setSelectedToolStyle,
    updateInventoryItemAmount,
    setSelectedResourceStyle,
} from './inventory.js';
import { clearElementClasses } from './utils.js';

/** 2d array representation of the game board */
export const initialMatrix = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 6, 6, 0, 0, 0, 5, 0, 0, 0, 0],
    [0, 0, 0, 0, 5, 5, 5, 0, 0, 0, 6, 6, 0, 0, 0, 5, 0, 0, 0, 0],
    [0, 0, 0, 5, 5, 5, 5, 5, 0, 0, 6, 6, 0, 0, 0, 5, 0, 0, 0, 6],
    [7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
    [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
    [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
    [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
    [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
    [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
    [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
];

export const RESOURCE = {
    SKY: 0,
    CLOUD: 1,
    TREE: 4,
    TRUNK: 5,
    ROCK: 6,
    GRASS: 7,
    DIRT: 8,
    WATER: 9, //!TODO implement water
};

export const TOOL = {
    PICKAXE: [RESOURCE.ROCK],
    SHOVEL: [RESOURCE.DIRT, RESOURCE.GRASS],
    AXE: [RESOURCE.TREE, RESOURCE.TRUNK],
    BUCKET: [RESOURCE.WATER],
};

export const GRID_ROWS = initialMatrix.length;
export const GRID_COLS = initialMatrix[0].length;

export const TREE_COUNT = 3;
export const TRUNK_HEIGHT = 4;
export const TREE_HEIGHT = 3;
export const TREE_WIDTH = 3;
export const TREE_SPACE = 6;

let currentMatrix = [];

//a map of resource types to resource items
export const resourceMap = new Map();

function ResourceItem(name, type) {
    this.name = name;
    this.type = type;
    this.isMineable = type >= RESOURCE.TREE;
    this.gridClassList = [name.toLowerCase()];
    this.inventoryClassList = [name.toLowerCase()];
    if (this.isMineable) {
        this.gridClassList.unshift('tile__image');
        this.inventoryClassList.unshift('ic__resource-image');
    }
    this.maxItems = 0;
    this.amountCollected = 0;
}

export function setCurrentMatrix(matrix) {
    currentMatrix = matrix;
}

export function initGameConstants() {
    resourceMap.clear();
    for (const [key, value] of Object.entries(RESOURCE)) {
        resourceMap.set(value, new ResourceItem(key, value));
    }
}

export function getCurrentMatrix() {
    return currentMatrix;
}

export function createGridElement(resourceType, row, col) {
    const gridElement = document.createElement('div');
    gridElement.classList.add(...resourceMap.get(resourceType).gridClassList);
    gridElement.dataset.x = row;
    gridElement.dataset.y = col;
    gridElement.dataset.resourceType = resourceType;
    gridElement.addEventListener('click', onGridElementClick);
    return gridElement;
}

function updateGridElement(gridElement, resourceType, row, col) {
    clearElementClasses(gridElement);
    let resourceItem = resourceMap.get(resourceType);
    gridElement.classList.add(...resourceItem.gridClassList);
    gridElement.dataset.resourceType = resourceType;

    currentMatrix[row][col] = resourceType; //update game state
}

function handleToolUse(gridElement) {
    const resourceType = parseInt(gridElement.dataset.resourceType);
    const tool = toolsMap.get(selectedInventoryItem);
    if (tool.mineableItems.includes(resourceType)) {
        updateInventoryItemAmount(resourceType, 1);
        updateGridElement(
            gridElement,
            RESOURCE.SKY,
            gridElement.dataset.x,
            gridElement.dataset.y
        );
    } else {
        setSelectedToolStyle(false); //wrong tool for the job
    }
}

/**
 * Updates the grid element only if it's currently
 * SKY(don't paint on other elements) and the selected
 * resource exists in inventory
 */
function handleResourceUse(gridElement) {
    const resourceType = parseInt(selectedInventoryItem);
    const gridResource = parseInt(gridElement.dataset.resourceType);
    if (
        resourceMap.get(resourceType).amountCollected > 0 &&
        gridResource === RESOURCE.SKY
    ) {
        updateInventoryItemAmount(resourceType, -1);
        updateGridElement(
            gridElement,
            resourceType,
            gridElement.dataset.x,
            gridElement.dataset.y
        );
    } else {
        setSelectedResourceStyle(false); //not enough resources
    }
}

function onGridElementClick(event) {
    const gridElement = event.target;

    if (isToolSelected()) {
        handleToolUse(gridElement);
    } else if (isResourceSelected()) {
        handleResourceUse(gridElement);
    }
}
