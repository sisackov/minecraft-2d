/**
 * method to remove al classes from an element
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
