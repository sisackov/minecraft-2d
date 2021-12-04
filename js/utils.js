/**
 * method to remove al classes from an element
 */
export function clearElementClasses(element) {
    let classes = element.className.split(' ');
    classes.forEach(function (c) {
        element.classList.remove(c);
    });
}
