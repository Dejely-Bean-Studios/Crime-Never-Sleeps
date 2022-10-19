//=============================================================================
// Inventory.js
//=============================================================================

/*:
 * @plugindesc Displays the inventory
 * @author Ethan Chung
 *
 * 
 *
 * @help
 * To open and close the inventory on any screen press i
 * To close the inventory press i again or esc
 * 
 * Once in the inventory select an item using enter to view more details
 * To exit this screen press enter again or esc
 *
 * @param numClues
 * @desc The number of clues in the game
 * @default 6
 */

var parameters = PluginManager.parameters('Inventory');

var selected_item = 0;
// Map I to a command
Input.keyMapper["73"] = "I";
var clues = Number(parameters['numClues']);
// Tracks which command is pressed and is used to display the correct image in more info
var itemID = 0;

// Open the inventory on keypress
_alias_map_update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
    _alias_map_update.call(this);
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
    // TODO center inventory
    this._inventorywindow = new Window_Inventory(100, 100);
    for (var i = 0; i < clues; i++) {
        this._inventorywindow.setHandler("command" + i, this.moreInfo.bind(this, i));
    }
    this.addWindow(this._inventorywindow);
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

Scene_Inventory.prototype.moreInfo = function(itemNum) {
    itemID = itemNum
    SceneManager.push(Scene_MoreInfo);
    selected_item = itemNum;
}

//------------------------MoreInfo Scene-------------------------------------------------

function Scene_MoreInfo() {
    this.initialize.apply(this, arguments);
}

Scene_MoreInfo.prototype = Object.create(Scene_MenuBase.prototype);
Scene_MoreInfo.prototype.constructor = Scene_MoreInfo;

Scene_MoreInfo.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
    this.windows = {};
};

Scene_MoreInfo.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
        this.windows["_item" + itemID] = new Window_MoreInfo(300, 200, 200, 200, itemID);
        this.addWindow(this.windows["_item" + itemID]);
};

Scene_MoreInfo.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
        this.windows["_item" + itemID].drawAllItems();
    this.item()
}

Scene_MoreInfo.prototype.update = function() {
    Scene_MenuBase.prototype.update.call(this);
    // Close zoomed in image on keypress
    if (Input.isTriggered('ok') || Input.isTriggered('cancel')) {
        this.popScene();
    }
}

Scene_MoreInfo.prototype.item = function() {
    this.windows["_item" + itemID].show();
}

//=============================================================
//                          Windows                           =
//=============================================================

//-----------------------Inventory Window-------------------------
function Window_Inventory() {
    this.initialize.apply(this, arguments);
}

Window_Inventory.prototype = Object.create(Window_HorzCommand.prototype);
Window_Inventory.prototype.constructor = Window_Inventory;

Window_Inventory.prototype.initialize = function(x, y) {
    Window_HorzCommand.prototype.initialize.call(this, x, y);
    this.activate();
    this.select(selected_item);
    selected_item = 0
}

Window_Inventory.prototype.makeCommandList = function() {
    for (var i = 0; i < clues; i++) {
        this.addCommand("Item" + i, "command" + i); //TODO make text button into an image
    }
};

Window_Inventory.prototype.maxCols = function () {
    return 4;
}

Window_HorzCommand.prototype.numVisibleRows = function() {
    return 2;
};

Window_Inventory.prototype.maxPageRows = function () {
    return 2;
}

Window_Inventory.prototype.windowWidth = function() {
    return 480;
};

Window_Inventory.prototype.windowHeight = function() {
    return 240; // previously this.fittingHeight(this.numVisibleRows())
};

//*********** commands to be changed for final version *************

Window_Inventory.prototype.drawItem = function (index) {
    var itemRect = this.itemRect(index);
    this.drawFace("Actor1", index, itemRect.x + 10, itemRect.y + 10, itemRect.width - 20, itemRect.height - 20); //TODO change to item symbols
}

Window_Inventory.prototype.itemHeight = function() {
    return (this.height - this.padding * 2) / this.maxPageRows();
};


//----------------------------MoreInfo Window------------------------------------
//when an item in the inventory is selected show a zoomed in icon and a short description

function Window_MoreInfo() {
    this.initialize.apply(this, arguments);
}

Window_MoreInfo.prototype = Object.create(Window_Base.prototype);
Window_MoreInfo.prototype.constructor = Window_MoreInfo;

// Initialize the inventory
Window_MoreInfo.prototype.initialize = function(x, y, width, height, image) {
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.activate();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.image = image;
}

Window_MoreInfo.prototype.drawAllItems = function() {
    this.contents.clear(); 
    this.drawFace("Actor1", this.image, -20, -20, this.width, this.height)
}