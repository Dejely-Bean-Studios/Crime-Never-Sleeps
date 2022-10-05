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


//=============================================================
//                              Scenes                        =
//=============================================================


//---------------------Inventory-----------------------
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
    this._inventorywindow.setHandler("ok", this.moreInfo.bind(this));
    this._cmd = new Window_CmdTest(100, 100);
    this._cmd.setHandler("command1", this.moreInfo.bind(this));

    ImageManager.reserveFace("Actor2");
    //this.addWindow(this._inventorywindow);
    this.addWindow(this._cmd);
}

Scene_Inventory.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
    this._inventorywindow.refresh();
    this._cmd.refresh();
}

Scene_Inventory.prototype.update = function() {
    Scene_MenuBase.prototype.update.call(this);
    // Close the inventory on keypress
    if (Input.isTriggered('escape') || Input.isTriggered('I')) {
        this.popScene();
    }
}

Scene_Inventory.prototype.moreInfo = function() {
    SceneManager.push(Scene_MoreInfo);
}

//------------------------MoreInfo Scene-------------------------------------------------

function Scene_MoreInfo() {
    this.initialize.apply(this, arguments);
}

Scene_MoreInfo.prototype = Object.create(Scene_MenuBase.prototype);
Scene_MoreInfo.prototype.constructor = Scene_MoreInfo;

Scene_MoreInfo.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_MoreInfo.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this._item1 = new Window_MoreInfo(100, 100, 200, 200);
    this.addWindow(this._item1);
};

Scene_MoreInfo.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
    this._item1.drawAllItems();
}

Scene_MoreInfo.prototype.update = function() {
    Scene_MenuBase.prototype.update.call(this);
    // Close zoomed in image on keypress
    if (Input.isTriggered('ok') || Input.isTriggered('cancel')) {
        this.popScene();
    }
}

//=============================================================
//                          Windows                           =
//=============================================================

function Window_CmdTest() {
    this.initialize.apply(this, arguments);
}

Window_CmdTest.prototype = Object.create(Window_HorzCommand.prototype);
Window_CmdTest.prototype.constructor = Window_CmdTest;

Window_CmdTest.prototype.initialize = function(x, y) {
    Window_HorzCommand.prototype.initialize.call(this, x, y);
    this.activate();
}

Window_CmdTest.prototype.makeCommandList = function() {
    this.addCommand("test", "command1")
    this.addCommand("test2", "command1")
};


//-----------------------Inventory-------------------------
function Window_Inventory() { //TODO convert thsi to Window_Inventory
    this.initialize.apply(this, arguments);
}

Window_Inventory.prototype = Object.create(Window_Selectable.prototype);
Window_Inventory.prototype.constructor = Window_Inventory;

// Initialize the inventory
Window_Inventory.prototype.initialize = function(x, y, width, height) {
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this.activate();
}

Window_Inventory.prototype.update = function() {
    Window_Selectable.prototype.update.call(this);
    this.drawText("Inventory", 1, 1, 500, "left") // TODO implement title correctly
}

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

//----------------------------MoreInfo Window------------------------------------
//when an item in the inventory is selected show a zoomed in icon and a short description

function Window_MoreInfo() { //TODO change name to moreInfo
    this.initialize.apply(this, arguments);
}

Window_MoreInfo.prototype = Object.create(Window_Base.prototype);
Window_MoreInfo.prototype.constructor = Window_MoreInfo;

// Initialize the inventory
Window_MoreInfo.prototype.initialize = function(x, y, width, height) {
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.drawAllItems();
    // this.hide();
}

Window_MoreInfo.prototype.drawAllItems = function() {
    this.drawFace("Actor2", 4, 50, 50, 200, 200);
}

Window_MoreInfo.prototype.update = function() {
    Window_Base.prototype.update.call(this);
}


