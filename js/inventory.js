import { RESOURCE, resourceMap, TOOL } from './game.js';
import { clearElementClasses } from './utils.js';

function ToolItem(name) {
    this.name = name;
    this.inventoryClassList = ['ic__tool-image', name.toLowerCase()];
    this.mineableItems = [...TOOL[name]];
}

export const toolsMap = new Map();

export let selectedInventoryItem;
let selectedToolElement;
let selectedResourceElement;

function initInventoryTools() {
    for (const key in TOOL) {
        toolsMap.set(key, new ToolItem(key));
    }
}

export function initInventoryConstants() {
    initInventoryTools();
}

export function createToolElement(toolItem) {
    let toolElement = document.createElement('div');
    toolElement.classList.add(...toolItem.inventoryClassList);
    toolElement.dataset.tool = toolItem.name;
    toolElement.addEventListener('click', onToolClick);
    return toolElement;
}

function createResourceDivElement(resourceItem) {
    let resourceElement = document.createElement('div');
    resourceElement.classList.add(...resourceItem.inventoryClassList);
    resourceElement.dataset.resourceType = resourceItem.type;
    resourceElement.addEventListener('click', onResourceClick);
    return resourceElement;
}

function createResourceCounterElement(resourceItem) {
    let span = document.createElement('span');
    span.classList.add('ic__resource-counter');
    span.dataset.resourceType = resourceItem.type;
    span.textContent = resourceItem.amountCollected;
    return span;
}

export function createResourceElement(resourceItem) {
    let resourceDiv = document.createElement('div');
    resourceDiv.classList.add('ic__resource');
    resourceDiv.appendChild(createResourceDivElement(resourceItem));
    resourceDiv.appendChild(createResourceCounterElement(resourceItem));
    return resourceDiv;
}

function clearPreviouslySelectedItem() {
    if (selectedToolElement) {
        selectedToolElement.classList.remove('ic__tool--active');
        selectedToolElement = undefined;
    }
    if (selectedResourceElement) {
        selectedResourceElement.classList.remove('ic__resource--active');
        selectedResourceElement = undefined;
    }
}

function onToolClick(e) {
    let toolElement = e.target;
    clearPreviouslySelectedItem();
    selectedInventoryItem = toolElement.dataset.tool;
    selectedToolElement = toolElement;
    selectedResourceElement = undefined;
    setSelectedToolStyle(true);
}

export function setSelectedToolStyle(isActive) {
    if (isActive) {
        selectedToolElement.classList.remove('ic__tool--wrong');
        selectedToolElement.classList.add('ic__tool--active');
    } else {
        selectedToolElement.classList.remove('ic__tool--active');
        selectedToolElement.classList.add('ic__tool--wrong');
        setTimeout(setSelectedToolStyle, 600, true); //clears the wrong style after a while
    }
}

function onResourceClick(e) {
    let resourceElement = e.target;
    clearPreviouslySelectedItem();
    resourceElement.classList.add('ic__resource--active');
    selectedInventoryItem = resourceElement.dataset.resourceType;
    selectedResourceElement = resourceElement;
}

export function setSelectedResourceStyle(isActive) {
    if (isActive) {
        selectedResourceElement.classList.remove('ic__resource--wrong');
        selectedResourceElement.classList.add('ic__resource--active');
    } else {
        selectedResourceElement.classList.remove('ic__resource--active');
        selectedResourceElement.classList.add('ic__resource--wrong');
        setTimeout(setSelectedResourceStyle, 600, true); //clears the wrong style after a while
    }
}

export function isToolSelected() {
    return selectedToolElement !== undefined;
}

export function isResourceSelected() {
    return selectedResourceElement !== undefined;
}

export function updateInventoryItemAmount(resourceType, amount) {
    let span = document.querySelector(
        `span[data-resource-type="${resourceType}"]`
    );
    let resourceItem = resourceMap.get(resourceType);
    resourceItem.amountCollected += amount;
    span.textContent = resourceItem.amountCollected;
}
