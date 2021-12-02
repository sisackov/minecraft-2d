# minecraft-2d

## Plan-out

### HTML/CSS

```
<div class="page-wrapper">
        <main class="world-container">
            <div class="tile">
                <img alt="">
            </div>
        </main>
        <div class="inventory-container">
            <div class="ic__tool-container">
                <div class="ic__tool">
                        <img alt="" class="ic__tool-image">
                    </div>
                </div>
            <div class="ic__resource-container">
                <div class="ic__resource">
                    <img alt="" class="tile__image tile-grass">
                    <span class="ic__resource--counter">23</span>
                </div>
            </div>
            <div class="ic__button-container">
                <button class="ic-button">Reset</button>
                <button class="ic-button">Back To Main</button>
            </div>
        </div>
    </div>
```

-   page-wrapper: flex-container
-   world-container: grid of 20x20 tiles
-   tile: div dynamically created in JS
-   tile\_\_image: image dynamically created in JS
-   inventory-container: flex-container column
-   ic\_\_tool-container: grid of 2x3
-   ic\_\_tool: div dynamically created in JS
-   ic\_\_tool-image: image dynamically created in JS
-   ic\_\_resource-container: grid of 2x3
-   ic\_\_resource: div dynamically created in JS
-   ic\_\_resource--counter: span dynamically created in JS
-   ic\_\_button-container: flex-container column
-   ic-button: html button

### JS

-   matrix - 2d array that holds the state of each element on the game grid
-   list of constants - represent element states
-   event listeners
    -   to each element in the grid
    -   to each tool in the inventory
    -   to each resource in the inventory
    -   to the reset buttons

## Schedule

### Total: 14 hours

-   HTML/CSS - 3 hours
-   collect resources - 1 hour
-   JS - 7 hours
-   testing - 4 hours
