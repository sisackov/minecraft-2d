import {
    RESOURCE,
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
    let matrix = getEmptyMatrix(rows, cols, RESOURCE.SKY);
    setRandomGridBottom(matrix, rows, cols);
    fillGrass(matrix, cols);
    insertTrees(matrix, treeCount, cols);

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
    for (let col = 1; col < cols - 1 && treeCount > 0; col++) {
        let grassIndex = getTopResourceIndex(matrix, RESOURCE.GRASS, col);
        if (checkTreeLocation(matrix, grassIndex, col)) {
            paintTree(matrix, grassIndex, col);
            treeCount--;
        }
    }
}

function checkTreeLocation(matrix, rootRow, rootCol) {
    if (!rootRow) return false;

    let eligible = true;
    for (let row = rootRow - 6; row < rootRow - 3 && eligible; row++) {
        for (let col = rootCol - 1; col < rootCol + 2 && eligible; col++) {
            eligible = matrix[row][col] === RESOURCE.SKY;
        }
    }
    return eligible;
}

function paintTree(matrix, rootRow, rootCol) {
    for (let row = rootRow - 6; row < rootRow; row++) {
        if (row < rootRow - 3) {
            for (let col = rootCol - 1; col < rootCol + 2; col++) {
                matrix[row][col] = RESOURCE.TREE;
            }
        } else {
            matrix[row][rootCol] = RESOURCE.TRUNK;
        }
    }
}

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
