//=============================================================================
// Inventory.js
//=============================================================================

/*:
 * @plugindesc Displays the inventory
 * @author Ethan Chung
 *
 * @param Placeholder
 * @desc This is a placeholder
 * @default ??????
 *
 * @help
 * Temp
 *
 */

// Map I to a command
Input.keyMapper["73"] = "I";

// Open the inventory on keypress
_alias_scene_map_update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
    _alias_scene_map_update.call(this);
    if (Input.isTriggered("I")) {
        SceneManager.push(Scene_Inventory)
    }
}

// Make the inventory scene
function Scene_Inventory() {
    this.initialize.apply(this, arguments);
}

Scene_Inventory.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Inventory.prototype.constructor = Scene_Inventory;

Scene_Inventory.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_Inventory.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this._inventorywindow = new Window_Inventory(50, 50, 480, 480);// TODO center inventory
    ImageManager.reserveFace("Actor2");
    this.addWindow(this._inventorywindow)
}

Scene_Inventory.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
    this._inventorywindow.refresh();
}


Scene_Inventory.prototype.update = function() {
    Scene_MenuBase.prototype.update.call(this);
    // Close the inventory on keypress
    if (Input.isTriggered('escape') || Input.isTriggered('I')) {
        this.popScene();
    }
}

// Create the inventory window
function Window_Inventory() {
    this.initialize.apply(this, arguments);
}

Window_Inventory.prototype = Object.create(Window_Selectable.prototype);
Window_Inventory.prototype.constructor = Window_Inventory;

// Initialize the inventory
Window_Inventory.prototype.initialize = function(x, y, width, height) {
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this.activate();
    this.setHandler("ok", this.moreInfo())
}

// Draw the contents of the inventory
Window_Inventory.prototype.drawInventory = function() {
    this.contents.clear();
    this.drawIcon(132, 1, 1)
    this.drawIcon(133, 50, 1)
}

Window_Inventory.prototype.update = function() {
    Window_Selectable.prototype.update.call(this);
    this.drawText("Inventory", 1, 1, 500, "left") // TODO implement title correctly
}

Window_Inventory.prototype.moreInfo = function() {
    // TODO make it so when an item is selected a zoomed in picture appears
}

// ------------------------------ other code ------------------------------

Window_Inventory.prototype.maxItems = function () {
    return 3;
}

Window_Inventory.prototype.maxPageRows = function () {
    return 3;
}
Window_Inventory.prototype.maxCols = function () {
    return 3;
}

Window_Inventory.prototype.maxPageItems = function () {
    return this.maxPageRows() * this.maxCols();
}

Window_Inventory.prototype.drawItem = function (index) {
    var itemRect = this.itemRect(index);
    this.drawFace("Actor2", 3 + index, itemRect.x, itemRect.y, itemRect.width / 2, itemRect.height / 2);
}

Window_Inventory.prototype.itemHeight = function() {
    return (this.height - this.padding * 2) / this.maxPageRows();
};