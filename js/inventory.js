import { RESOURCE, TOOL } from './game.js';

function InventoryItem(key, isTool, name = undefined) {
    this.name = key;
    this.classList = [];
    this.isTool = isTool;
    if (isTool) {
        this.classList.push('ic__tool-image');
        this.classList.push(TOOL[this.name].imgClass);
        this.mineableItems = TOOL[this.name].mineableItems;
    } else {
        this.name = name;
        this.amount = 0;
        this.isMineable = key !== RESOURCE.SKY && key !== RESOURCE.CLOUD;
        if (this.isMineable) {
            this.classList.push('ic__resource-image');
            this.classList.push(name.toLowerCase());
        }
    }
}

export const inventoryMap = new Map();

function initInventoryTools() {
    for (const key in TOOL) {
        inventoryMap.set(key, new InventoryItem(key, true));
    }
}

function initInventoryItems() {
    for (const [key, value] of Object.entries(RESOURCE)) {
        inventoryMap.set(value, new InventoryItem(value, false, key));
    }
}

export function initInventoryConstants() {
    initInventoryTools();
    initInventoryItems();
}

function createInventoryDiv(item) {
    let divElement = document.createElement('div');
    for (const cls of item.classList) {
        divElement.classList.add(cls);
    }
    return divElement;
}

export function createToolElement(tool) {
    let toolElement = createInventoryDiv(tool);
    toolElement.addEventListener('click', onToolClick);
    return toolElement;
}

export function createResourceElement(tool) {
    let toolElement = createInventoryDiv(tool);
    let span = document.createElement('span');
    span.classList.add('ic__resource-counter');
    span.textContent = tool.amount;
    toolElement.appendChild(span);
    toolElement.addEventListener('click', onToolClick);
    return toolElement;
}

function onToolClick(e) {
    let toolElement = e.target;
    toolElement.style.backgroundColor = '#00ff00';
    // let tool = inventoryMap.get(toolName);
    // if (tool.isTool) {
    //     let toolElement = createInventoryDiv(tool);
    //     toolElement.addEventListener('click', onToolClick);
    //     document.getElementById('inventory').appendChild(toolElement);
    // }
}
