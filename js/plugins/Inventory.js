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
    // TODO center inventory
    this._inventorywindow = new Window_Inventory(100, 100);
    this._inventorywindow.setHandler("command1", this.moreInfo.bind(this));
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
    this._item1 = new Window_MoreInfo(300, 200, 200, 200, 1);//TODO make scalable
    this._item2 = new Window_MoreInfo(300, 200, 200, 200, 2);
    this.addWindow(this._item1);
    this.addWindow(this._item2);
};

Scene_MoreInfo.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
    this._item1.drawAllItems();
    this._item2.drawAllItems();
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

//-----------------------Inventory Window-------------------------
function Window_Inventory() {
    this.initialize.apply(this, arguments);
}

Window_Inventory.prototype = Object.create(Window_HorzCommand.prototype);
Window_Inventory.prototype.constructor = Window_Inventory;

Window_Inventory.prototype.initialize = function(x, y) {
    Window_HorzCommand.prototype.initialize.call(this, x, y);
    this.activate();
}

Window_Inventory.prototype.makeCommandList = function() {
    this.addCommand("test1", "command1")
    this.addCommand("test2", "command1")
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



//-----------------------Experimental commands-------------------------

Window_Inventory.prototype.drawItem = function (index) {
    var itemRect = this.itemRect(index);
    this.drawFace("Actor2", 3 + index, itemRect.x + 10, itemRect.y + 10, itemRect.width - 20, itemRect.height - 20);
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
Window_MoreInfo.prototype.initialize = function(x, y, width, height, image) {
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.activate();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.image = image;
    // this.hide();
}

Window_MoreInfo.prototype.drawAllItems = function() {
    this.contents.clear();
    switch (this.image){
        case 1:
            this.drawFace("Actor2", 3, -20, -20, this.width, this.height);
            this.drawText("Test1", 0, 0, this.width, "left")
            break;
        case 2:
            this.drawFace("Actor2", 4, -20, -20, this.width, this.height);
            this.drawText("Test2", 0, 0, this.width, "left")
            break;
        default:
            break;
    }
}

// Window_MoreInfo.prototype.update = function() {
//     Window_Base.prototype.update.call(this);
// }


