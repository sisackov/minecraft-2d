import {
    toolsMap,
    selectedInventoryItem,
    isToolSelected,
    isResourceSelected,
    setSelectedToolStyle,
    updateInventoryItemAmount,
    setSelectedResourceStyle,
} from './inventory.js';
import { clearElementClasses, cloneArray, prettyPrintArray } from './utils.js';

/** 2d array representation of the game board */
const initialMatrix = [
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
    // WATER: 7, !TODO implement water
};

export const TOOL = {
    PICKAXE: [RESOURCE.ROCK],
    SHOVEL: [RESOURCE.DIRT, RESOURCE.GRASS],
    AXE: [RESOURCE.TREE, RESOURCE.TRUNK],
};

export const GRID_ROWS = 20;
export const GRID_COLS = 20;
let currentMatrix = [];
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

export function initGameConstants() {
    currentMatrix = cloneArray(initialMatrix);
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
    gridElement.dataset.x = row; //TODO - do we need this?
    gridElement.dataset.y = col;
    gridElement.dataset.resourceType = resourceType;
    gridElement.addEventListener('click', onGridElementClick);
    return gridElement;
}

function updateGridElement(gridElement, resourceType, row, col) {
    clearElementClasses(gridElement);
    let resourceItem = resourceMap.get(resourceType);
    gridElement.classList.add(...resourceItem.gridClassList);

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

function handleResourceUse(gridElement) {
    const resourceType = parseInt(selectedInventoryItem);

    if (resourceMap.get(resourceType).amountCollected > 0) {
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
