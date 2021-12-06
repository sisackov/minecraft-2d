import {
    RESOURCE,
    GRID_ROWS,
    GRID_COLS,
    TRUNK_HEIGHT,
    TREE_HEIGHT,
    TREE_WIDTH,
    TREE_SPACE,
} from './game.js';

/**
 * method to remove all classes from an element
 */
export function clearElementClasses(element) {
    let classes = element.className.split(' ');
    classes.forEach(function (c) {
        element.classList.remove(c);
    });
}

/**
 * method to copy 2D array
 */
export function cloneArray(array) {
    return array.map((arr) => arr.slice());
}

export function prettyPrintArray(array) {
    array.forEach((arr) => {
        console.log(arr);
    });
}

/**
 * method to empty an element of all its children
 */
export function clearChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

/**
 *
 * @returns {Map} a map of all the keys and values in local storage
 */
export function retrieveAllLocalStorageItems() {
    let keys = Object.keys(localStorage);
    let itemsMap = new Map();
    keys.forEach((key) => {
        itemsMap.set(key, localStorage.getItem(key));
    });
    return itemsMap;
}


//***********************************************************************/
//**                Random matrix generation                            */
//***********************************************************************/
export function generateRandomMatrix(rows, cols, treeCount) {
    let matrix = getEmptyMatrix(GRID_ROWS, GRID_COLS, RESOURCE.SKY);
    setRandomGridBottom(matrix, rows, cols);
    fillGrass(matrix, cols);
    insertTrees(matrix, treeCount, cols,);

    return matrix;
}

export function getEmptyMatrix(rows, cols, defaultValue) {
    return Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => defaultValue));
}

export function randomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function insertTrees(matrix, treeCount, cols) {
    let col = Math.floor(TREE_WIDTH / 2);
    let colEnd = cols - Math.ceil(TREE_WIDTH / 2);
    while (col < colEnd && treeCount > 0) {
        let grassIndex = getTopResourceIndex(matrix, RESOURCE.GRASS, col);
        let treeStartCol = col - Math.floor(TREE_WIDTH / 2);
        let treeEndCol = col + Math.ceil(TREE_WIDTH / 2);
        if (checkTreeLocation(matrix, grassIndex, treeStartCol, treeEndCol)) {
            paintTree(matrix, grassIndex, col, treeStartCol, treeEndCol);
            treeCount--;
            col += TREE_SPACE + Math.ceil(TREE_WIDTH / 2);
        } else {
            col++;
        }
    }
}

function checkTreeLocation(matrix, rootRow, treeStartCol, treeEndCol) {
    if (!rootRow) return false;

    let eligible = true;
    let row = rootRow - (TRUNK_HEIGHT + TREE_HEIGHT);
    while (row < rootRow - TRUNK_HEIGHT && eligible) {
        for (let col = treeStartCol; col < treeEndCol && eligible; col++) {
            eligible = matrix[row][col] === RESOURCE.SKY;
        }
        row++
    }
    return eligible;
}

function paintTree(matrix, rootRow, rootCol, treeStartCol, treeEndCol) {
    for (let row = rootRow - (TRUNK_HEIGHT + TREE_HEIGHT); row < rootRow; row++) {
        if (row < rootRow - TRUNK_HEIGHT) {
            for (let col = treeStartCol; col < treeEndCol; col++) {
                matrix[row][col] = RESOURCE.TREE;
            }
        } else {
            matrix[row][rootCol] = RESOURCE.TRUNK;
        }
    }
}


/**
 * method to fill the grass in the matrix.
 * grass can only be placed on the ground(dirt)
 */
function fillGrass(matrix, cols) {
    for (let col = 0; col < cols; col++) {
        let grassIndex = getTopResourceIndex(matrix, RESOURCE.DIRT, col);
        if (grassIndex) {
            matrix[grassIndex][col] = RESOURCE.GRASS;
        }
    }
}

/**
 * 
 * @param {Array} matrix 
 * @param {number} resource 
 * @param {number} col column in the matrix
 * @returns the index of the first row with above the queried resource type or undefined if none found
 */
function getTopResourceIndex(matrix, resource, col) {
    let index;
    for (let row = 0; row < matrix.length && !index; row++) {
        if (matrix[row][col] === resource) {
            index = row;
        }
    }
    return index;
}

function setRandomGridBottom(matrix, rows, cols) {
    let startRow = rows / 2;
    let endRow = rows;

    for (let col = 0; col < cols; col++) {
        let waterStart = randomInRange((startRow + startRow * 0.6), endRow - 1);
        let stoneStart = randomInRange((startRow + startRow * 0.4), waterStart);
        let dirtStart = randomInRange(startRow, stoneStart);

        for (let row = startRow; row < endRow; row++) {
            let randomResource = RESOURCE.SKY;
            if (row > waterStart) {
                randomResource = RESOURCE.WATER;
            } else if (row > stoneStart) {
                randomResource = RESOURCE.ROCK;
            } else if (row > dirtStart) {
                randomResource = RESOURCE.DIRT;
            }
            matrix[row][col] = randomResource;
        }
    }
}
