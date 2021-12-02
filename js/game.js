import { inventoryMap } from './inventory.js';

/** 2d array representation of the game board */
const initialMatrix = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 4, 4, 0, 0, 0, 3, 0, 0, 0, 0],
    [0, 0, 0, 0, 3, 3, 3, 0, 0, 0, 4, 4, 0, 0, 0, 3, 0, 0, 0, 0],
    [0, 0, 0, 3, 3, 3, 3, 3, 0, 0, 4, 4, 0, 0, 0, 3, 0, 0, 0, 4],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
    [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
    [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
    [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
    [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
    [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
];

export const RESOURCE = {
    SKY: 0,
    CLOUD: 1,
    TREE: 2,
    TRUNK: 3,
    ROCK: 4,
    GRASS: 5,
    DIRT: 6,
    // WATER: 7, !TODO implement water
};

export const TOOL = {
    PICKAXE: {
        imgClass: 'pickaxe',
        mineableItems: [RESOURCE.ROCK],
    },
    SHOVEL: {
        imgClass: 'shovel',
        mineableItems: [RESOURCE.DIRT, RESOURCE.GRASS],
    },
    AXE: {
        imgClass: 'axe',
        mineableItems: [RESOURCE.TREE, RESOURCE.TRUNK],
    },
};

function ResourceItem(name, type) {
    this.type = type;
    if (type === RESOURCE.SKY || type === RESOURCE.CLOUD) {
        this.classList = [name.toLowerCase()];
    } else {
        this.classList = ['tile__image', name.toLowerCase()];
    }
    this.maxItems = 0;
    this.minItems = 0;
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

export function createGridElement(row, col, resourceType) {
    const gridElement = document.createElement('div');
    let resourceObj = resourceMap.get(resourceType);
    for (const cls of resourceObj.classList) {
        gridElement.classList.add(cls);
    }
    gridElement.dataset.row = row;
    gridElement.dataset.col = col;
    gridElement.dataset.resource = resourceType;
    gridElement.addEventListener('click', onGridElementClick);
    return gridElement;
}

function onGridElementClick(event) {
    const gridElement = event.target;
    console.log(gridElement.dataset.row, gridElement.dataset.col);
}
