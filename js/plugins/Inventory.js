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
 * num Clues changes the number of clues in the inventory
 * 
 * Switches to activate clues must be sequential, switchStart can be changed to match the start number of the sequence
 * 
 * clue# can be changed to change the description of the clues
 *
 * @param numClues
 * @desc The number of clues in the game
 * @default 6
 * 
 * @param switchStart
 * @desc the number at which the switches for the clues start
 * 
 * @param clue1
 * @desc the description text for the clue
 * @default Stove: Still has stains
 * 
 * @param clue2
 * @desc the description text for the clue
 * @default Dishes: Squeaky clean
 * 
 * @param clue3
 * @desc the description text for the clue
 * @default Chalk Outline: My old friend
 * 
 * @param clue4
 * @desc the description text for the clue
 * @default Buzzer: Who was here?
 * 
 * @param clue5
 * @desc the description text for the clue
 * @default TV: Caught in 4K
 * 
 * @param clue6
 * @desc the description text for the clue
 * @default Book: Looks well loved
 * 
 * @param clue7
 * @desc the description text for the clue
 * @default New Tank: Fish were moved here
 * 
 * @param clue8
 * @desc the description text for the clue
 * @default Mop: Spilled by something
 * 
 * @param clue9
 * @desc the description text for the clue
 * @default Regulator: A system gone awry
 * 
 * @param clue10
 * @desc the description text for the clue
 * @default Cracked Tank: A desperate attempt
 * 
 * @param clue11
 * @desc the description text for the clue
 * @default TV: Nothing but static
 * 
 * @param clue12
 * @desc the description text for the clue
 * @default Unknown: You were kicked out
 * 
 * @param clue13
 * @desc the description text for the clue
 * @default Cloth: A suspicious scrap
 * 
 * @param clue14
 * @desc the description text for the clue
 * @default Rope: Broken and deadly
 * 
 * @param clue15
 * @desc the description text for the clue
 * @default Wallet: Leather, full of cash
 * 
 * @param clue16
 * @desc the description text for the clue
 * @default Dirt: Tracked in by boots
 * 
 * @param clue17
 * @desc the description text for the clue
 * @default Splatter: A blotch of blood
 * 
 * @param clue18
 * @desc the description text for the clue
 * @default Dead Man: A smashed corpse
 * 
 * @param clue19
 * @desc the description text for the clue
 * @default Camera: Tapes interrogations
 * 
 * @param clue20
 * @desc the description text for the clue
 * @default Lock: Records entries
 * 
 * @param clue21
 * @desc the description text for the clue
 * @default Finn: A warm, bloody corpse
 * 
 * @param clue22
 * @desc the description text for the clue
 * @default Vent: Brings in fresh air
 * 
 * @param clue23
 * @desc the description text for the clue
 * @default Table: A hiding place?
 * 
 * @param clue24
 * @desc the description text for the clue
 * @default Glass: Another entrance?
 */

var Inventory = Inventory || {};

var parameters = PluginManager.parameters('Inventory');

var back_blur = true;

var selected_item = 0;
// Map I to a command
Input.keyMapper["73"] = "I";
var clues = Number(parameters['numClues']);

// Tracks which command is pressed and is used to display the correct image in more info
var itemID = 0;

var numMurders = 4;

var inventory_background = 'notebook'

var notebook_page = 0

var picture_ID = 14

var inventory_width = 315

// Open the inventory on keypress
_alias_map_update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
    _alias_map_update.call(this);
    if (Input.isTriggered("I")) {
        SceneManager.push(Scene_Inventory);
    }
}

SceneManager.snapForBackground = function() {
    this._backgroundBitmap = this.snap();
    if (back_blur) {
        this._backgroundBitmap.blur();
    }
};

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
    ImageManager.reservePicture(inventory_background)
    ImageManager.reserveFace('inventoryclues1')
    ImageManager.reserveFace('inventoryclues2')
    ImageManager.reserveFace('inventoryclues3')
    ImageManager.reserveFace('inventoryclues4')

    if (SceneManager._scene instanceof Scene_MoreInfo) {
        this.inventory_activate = true;
    }
    picX = Graphics.boxWidth / 2
    picY = Graphics.boxHeight / 2
    $gameScreen.showPicture(picture_ID, inventory_background, 1, picX, picY, 100, 100, 255, 0);
    back_blur = false;
};

Scene_Inventory.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createMurderSelectWindow();
    this.createInventoryWindow();
    if (this.inventory_activate) {
        this._inventorywindow.activate();
        this._murderselectwindow.deactivate();
        this._inventorywindow.select(selected_item);
    }
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
        $gameScreen.clearPictures();
        back_blur = true;
    }
}

Scene_Inventory.prototype.createMurderSelectWindow = function() {
    this._murderselectwindow = new Window_MurderSelect();
    this._murderselectwindow.select(notebook_page);
    this._murderselectwindow.setHandler('ok', this.onMurderOk.bind(this));
    this.addWindow(this._murderselectwindow);
};

Scene_Inventory.prototype.createInventoryWindow = function() {
    this._inventorywindow = new Window_Inventory();
    this._inventorywindow.setHandler('cancel', this.onClueCancel.bind(this));
    for (var i = 0; i < clues * numMurders; i++) {
        this._inventorywindow.setHandler("command" + i, this.moreInfo.bind(this, i));
    }
    this._inventorywindow.deselect();
    this.addWindow(this._inventorywindow);
    this._murderselectwindow.setInventoryWindow(this._inventorywindow);
}

Scene_Inventory.prototype.onMurderOk = function() {
    selected_item = 0
    this._inventorywindow.activate();
    this._inventorywindow.select(selected_item);
}

Scene_Inventory.prototype.onClueCancel = function() {
    this._inventorywindow.deselect();
    this._murderselectwindow.activate();
}

Scene_Inventory.prototype.moreInfo = function(itemNum) {
    itemID = itemNum;
    SceneManager.push(Scene_MoreInfo);
    selected_item = itemNum % 6;
}


//------------------------MoreInfo Scene-------------------------------------------------

function Scene_MoreInfo() {
    this.initialize.apply(this, arguments);
}

Scene_MoreInfo.prototype = Object.create(Scene_MenuBase.prototype);
Scene_MoreInfo.prototype.constructor = Scene_MoreInfo;

Scene_MoreInfo.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
    ImageManager.reserveFace('clues1')
    ImageManager.reserveFace('clues2')
    ImageManager.reserveFace('clues3')
    ImageManager.reserveFace('clues4')
    this.windows = {};
    back_blur = false;
};

Scene_MoreInfo.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
        this.windows["_item" + itemID] = new Window_MoreInfo(itemID);
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
        $gameScreen.clearPictures();
        back_blur = true;
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

Window_Inventory.prototype.initialize = function() {
    x = (Graphics.boxWidth / 2) - (this.windowWidth() / 2)
    y = (Graphics.boxHeight / 2) - (this.windowHeight() / 2)
    this._page = 1;
    Window_HorzCommand.prototype.initialize.call(this, x, y);
    this.setBackgroundType(-1);
    this.deactivate();
}

Window_Inventory.prototype.makeCommandList = function() {
    for (var i = 0; i < clues; i++) {
        this.addCommand("Item" + (i + this.getClueStart()), "command" + (i + this.getClueStart()));
    }
};

Window_Inventory.prototype.getClueStart = function() {
    return (this._page - 1) * clues
}

Window_Inventory.prototype.getPage = function() {
    return this._page;
}

Window_Inventory.prototype.setPage = function(page) {
    switch (page) {
        case 'murder1':
            if (this._page !== 1) {
                this._page = 1;
                this.refresh();
                notebook_page = 0;
            }
            break;
        case 'murder2':
            if (this._page !== 2) {
                this._page = 2;
                this.refresh();
                notebook_page = 1;
            }
            break;
        case 'murder3':
            if (this._page !== 3) {
                this._page = 3;
                this.refresh();
                notebook_page = 2;
            }
            break;
        case 'murder4':
            if (this._page !== 4) {
                this._page = 4;
                this.refresh();
                notebook_page = 3;
            }
            break;
    }
}

Window_Inventory.prototype.drawItem = function (index) {
    var itemRect = this.itemRect(index);
    if ($gameSwitches.value(index + (Number(parameters['switchStart'])) + this.getClueStart())) {
        this.drawFace("inventoryclues" + this.getPage(), index + 1, itemRect.x + 10, itemRect.y + 10, itemRect.width - 20, itemRect.height - 20); 
    }
    else {
        // replace 1 after clues with this.getPage() if different coloured question marks are used
        this.drawFace("inventoryclues" + 1, 0, itemRect.x + 10, itemRect.y + 10, itemRect.width - 20, itemRect.height - 20);
    }
}

Window_Inventory.prototype.maxCols = function () {
    return 3;
}

Window_HorzCommand.prototype.numVisibleRows = function() {
    return 2;
};

Window_Inventory.prototype.maxPageRows = function () {
    return 2;
}
Window_Inventory.prototype.windowHeight = function() {
    return this.fittingHeight(this.numVisibleRows()) * 2;
};

Window_Inventory.prototype.windowWidth = function() {
    return this.windowHeight() * (3/this.numVisibleRows()) + 15;
};


Window_Inventory.prototype.itemHeight = function() {
    return (this.height - this.padding * 2) / this.maxPageRows();
};

Window_Inventory.prototype.itemWidth = function() {
    return this.itemHeight()
}

//----------------------------MoreInfo Window------------------------------------
//when an item in the inventory is selected show a zoomed in icon and a short description

function Window_MoreInfo() {
    this.initialize.apply(this, arguments);
}

Window_MoreInfo.prototype = Object.create(Window_Base.prototype);
Window_MoreInfo.prototype.constructor = Window_MoreInfo;

// Initialize the inventory
Window_MoreInfo.prototype.initialize = function(image) {
    var width = 300;
    var height = 800
    var x = (Graphics.boxWidth / 2) - (width / 2)
    var y = (Graphics.boxHeight / 3) - (height / 2)
    this._page = 1;
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.setBackgroundType(-1);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.image = image;
    this.changeTextColor(this.textColor(15));
}

Window_MoreInfo.prototype.drawAllItems = function() {
    this.contents.clear(); 
    if ($gameSwitches.value(this.image + (Number(parameters['switchStart']) + this.getClueStart()))) {
        this.drawFace("clues" + this.getPage(), (this.image % 6) + 1, -18, 30, this.width, this.height)
        this.drawText(parameters["clue" + ((this.image + 1) + this.getClueStart())], 0, this.height / 1.5, this.width - 36, 'center');
    }
    else {
        // replace 1 after clues with this.getPage() if different coloured question marks are used
        this.drawFace("clues" + 1, 0, -18, 30, this.width, this.height)
        this.drawText("You haven't found this clue yet", 1, this.height / 1.5, this.width - 36, 'center');
    }
}

Window_MoreInfo.prototype.getPage = function() {
    return Math.floor(this.image / 6) + 1;
}

Window_MoreInfo.prototype.getClueStart = function() {
    return (this._page - 1) * clues
}


//---------------------MurderSelect Window------------------------
// Select which murder you want to look at

function Window_MurderSelect() {
    this.initialize.apply(this, arguments);
}

Window_MurderSelect.prototype = Object.create(Window_ItemCategory.prototype);
Window_MurderSelect.prototype.constructor = Window_MurderSelect;

Window_MurderSelect.prototype.initialize = function() {
    Window_ItemCategory.prototype.initialize.call(this, arguments);
    this.width = inventory_width;
    this.x = (Graphics.boxWidth / 2) - (this.windowWidth() / 2)
    this.y = 120
    this.move(this.x, this.y, this.width, this.windowHeight())
    this.setBackgroundType(-1);
}

Window_MurderSelect.prototype.windowWidth = function() {
    return inventory_width
};

Window_MurderSelect.prototype.maxCols = function() {
    return 4;
};

Window_MurderSelect.prototype.update = function() {
    Window_HorzCommand.prototype.update.call(this);
    if (this._inventorywindow) {
        this._inventorywindow.setPage(this.currentSymbol());
    }
};

Window_MurderSelect.prototype.drawItem = function(index) {
    var rect = this.itemRectForText(index);
    var align = this.itemTextAlign();
    this.changeTextColor(this.textColor(15));
    this.changePaintOpacity(this.isCommandEnabled(index));
    this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
};

Window_MurderSelect.prototype.makeCommandList = function() {
    this.addCommand("I", "murder1");
    this.addCommand("II", "murder2");
    this.addCommand("III", "murder3");
    this.addCommand("IV", "murder4");
};

Window_MurderSelect.prototype.setInventoryWindow = function(inventorywindow) {
    this._inventorywindow = inventorywindow;
}