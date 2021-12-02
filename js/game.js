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

export const Resource = {
    SKY: 0,
    CLOUD: 1,
    TREE: 2,
    TRUNK: 3,
    ROCK: 4,
    GRASS: 5,
    DIRT: 6,
    // WATER: 7, !TODO implement water
};

export const resourceMap = new Map();

export function initGameConstants() {
    for (const [key, value] of Object.entries(Resource)) {
        let resourceObj = {
            name: key,
            value: value,
            maxItems: 0 /* TODO: update while drawing */,
            minItems: 0,
            classList: [],
        };

        switch (value) {
            case Resource.SKY:
                resourceObj.classList = ['sky'];
                break;
            case Resource.CLOUD:
                resourceObj.classList = ['cloud'];
                break;
            case Resource.TREE:
                resourceObj.classList = ['tile__image', 'tree'];
                break;
            case Resource.TRUNK:
                resourceObj.classList = ['tile__image', 'trunk'];
                break;
            case Resource.ROCK:
                resourceObj.classList = ['tile__image', 'rock'];
                break;
            case Resource.GRASS:
                resourceObj.classList = ['tile__image', 'grass'];
                break;
            case Resource.DIRT:
                resourceObj.classList = ['tile__image', 'dirt'];
                break;
        }
        resourceMap.set(value, resourceObj);
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
