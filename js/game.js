import { toolsMap } from './inventory.js';

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

export const resourceMap = new Map();

export function initGameConstants() {
    for (const [key, value] of Object.entries(RESOURCE)) {
        resourceMap.set(value, new ResourceItem(key, value));
    }
}

export function getInitialMatrixCopy() {
    return initialMatrix.map((arr) => arr.slice());
}

export function createGridElement(resourceType, row, col) {
    const gridElement = document.createElement('div');
    gridElement.classList.add(...resourceMap.get(resourceType).gridClassList);
    gridElement.dataset.position = { x: row, y: col };
    gridElement.dataset.resourceType = resourceType;
    gridElement.addEventListener('click', onGridElementClick);
    return gridElement;
}

function onGridElementClick(event) {
    const gridElement = event.target;
    console.dir(
        gridElement.style.gridRowStart,
        gridElement.style.gridColumnStart
    );
}
