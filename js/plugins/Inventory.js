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
    this._inventorywindow = new Window_Inventory(0, 0, 480, 480);
    this.addWindow(this._inventorywindow)
}


Scene_Inventory.prototype.update = function() {
    // Close the inventory on keypress
    if (Input.isTriggered('escape') || Input.isTriggered('I')) {
        SceneManager.pop();
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
    this.drawInventory()
    this.activate();
}

// Draw the contents of the inventory
Window_Inventory.prototype.drawInventory = function() {
    this.contents.clear();
    this.drawIcon(132, 1, 1)
    this.drawIcon(133, 50, 1)
}

Window_Inventory.prototype.update = function() {
    Window_Selectable.prototype.update.call(this);
    this.drawInventory();
}