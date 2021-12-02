/** 2d array representation of the game board */
const initialMatrix = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0],
    [0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 3, 0, 0, 0, 0],
    [0, 0, 0, 3, 3, 3, 0, 0, 0, 0, 4, 0, 0, 0, 0, 3, 0, 0, 0, 0],
    [0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 4, 0, 0, 0, 0, 3, 0, 0, 0, 4],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
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
    STONE: 4,
    GRASS: 5,
    DIRT: 6,
};

export const resourceMap = new Map();

function initGame() {
    for (const [key, value] of Object.entries(Resource)) {
        let resourceObj = {
            name: key,
            value: value,
        };

        let list;
        switch (value) {
            case Resource.SKY:
                list = ['sky'];
                break;
            case Resource.CLOUD:
                list = ['cloud'];
                break;
            case Resource.TREE:
                list = ['tile__image', 'tree'];
                break;
            case Resource.TRUNK:
                list = ['tile__image', 'trunk'];
                break;
            case Resource.STONE:
                list = ['tile__image', 'stone'];
                break;
            case Resource.GRASS:
                list = ['tile__image', 'grass'];
                break;
            case Resource.DIRT:
                list = ['tile__image', 'dirt'];
                break;
            default:
                list = [];
                break;
        }
        resourceObj['classList'] = list;
        resourceMap.set(value, resourceObj);
    }
}
initGame();

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
