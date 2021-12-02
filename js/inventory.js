import { Resource } from './game.js';
export const inventoryMap = new Map();

function initInventoryTools() {
    for (const tool of ['PICKAXE', 'SHOVEL', 'AXE']) {
        let toolObj = {
            name: tool,
            mineableItems: [],
            classList: [],
            isTool: true,
        };

        switch (tool) {
            case 'PICKAXE':
                toolObj.mineableItems = [Resource.ROCK];
                toolObj.classList = ['ic__tool-image', 'pickaxe'];
                break;
            case 'SHOVEL':
                toolObj.mineableItems = [Resource.DIRT, Resource.GRASS];
                toolObj.classList = ['ic__tool-image', 'shovel'];
                break;
            case 'AXE':
                toolObj.mineableItems = [Resource.TREE, Resource.TRUNK];
                toolObj.classList = ['ic__tool-image', 'axe'];
                break;
        }
        inventoryMap.set(tool, toolObj);
    }
}

function initInventoryItems() {
    for (const [key, value] of Object.entries(Resource)) {
        let resourceObj = {
            name: key,
            amount: 0,
            classList: [],
        };

        switch (value) {
            case Resource.TREE:
                resourceObj.classList = ['ic__resource-image', 'tree'];
                break;
            case Resource.TRUNK:
                resourceObj.classList = ['ic__resource-image', 'trunk'];
                break;
            case Resource.ROCK:
                resourceObj.classList = ['ic__resource-image', 'rock'];
                break;
            case Resource.GRASS:
                resourceObj.classList = ['ic__resource-image', 'grass'];
                break;
            case Resource.DIRT:
                resourceObj.classList = ['ic__resource-image', 'dirt'];
                break;
            default:
                break;
        }
        inventoryMap.set(value, resourceObj);
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
