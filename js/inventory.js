import { RESOURCE, TOOL } from './game.js';
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
    resourceElement.dataset.resource = resourceItem.name;
    resourceElement.addEventListener('click', onResourceClick);
    return resourceElement;
}

function createResourceCounterElement(resourceItem) {
    let span = document.createElement('span');
    span.classList.add('ic__resource-counter');
    span.dataset.resource = resourceItem.name; //TODO -do i need this?
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
    setSelectedToolStyle(toolElement, true);
    selectedInventoryItem = toolElement.dataset.tool;
    selectedToolElement = toolElement;
    selectedResourceElement = undefined;
}

function setSelectedToolStyle(toolElement, isActive) {
    if (isActive) {
        toolElement.classList.remove('ic__tool--wrong');
        toolElement.classList.add('ic__tool--active');
    } else {
        toolElement.classList.remove('ic__tool--active');
        toolElement.classList.add('ic__tool--wrong');
        setTimeout(setSelectedToolStyle, 600, toolElement, true); //clears the wrong style after a while
    }
}

function onResourceClick(e) {
    let resourceElement = e.target;
    clearPreviouslySelectedItem();
    resourceElement.classList.add('ic__resource--active');
    selectedInventoryItem = resourceElement.dataset.resource;
    selectedResourceElement = resourceElement;
}
