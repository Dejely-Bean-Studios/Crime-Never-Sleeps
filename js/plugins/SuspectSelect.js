//=============================================================================
// SuspectSelect.js
//=============================================================================

/*:
 * @plugindesc Displays a window to select the suspects
 * @author Ethan Chung
 *
 * @help
 * Uses a switch to open the murder select window and activates switches
 * depending on what was selected.
 * 
 * Use plugin command suspect_select to open the window
 * 
 * 5 switches in a row are needed to determine the endings
 * They are in this order: Rellik, Finn, Daphne, Flora, No One
 * 
 * @param switchStart
 * @desc the first switch to activate an ending
 */


suspect_select_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    suspect_select_pluginCommand.call(this, command, args);
    if(command === "suspect_select") SceneManager.push(Scene_SuspectSelect);
}

var suspects = 5;

var selected = 0;

const faces = ["faceset_cleanup", "faceset_cop", "faceset_secretary", "faceset_wife"];

const names = ["Rellik", "Finn", "Daphne", "Flora", "No One"];

var parameters = PluginManager.parameters('SuspectSelect');

// ==================Scene========================
function Scene_SuspectSelect() {
    this.initialize.apply(this, arguments);
}

Scene_SuspectSelect.prototype = Object.create(Scene_MenuBase.prototype);
Scene_SuspectSelect.prototype.constructor = Scene_SuspectSelect;

Scene_SuspectSelect.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
}

Scene_SuspectSelect.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this._suspectselectwindow = new Window_SuspectSelect();
    for (var i = 0; i < suspects; i++) {
        this._suspectselectwindow.setHandler("command" + i, this.confirm.bind(this, i));
    }
    this.addWindow(this._suspectselectwindow);

    this._textwindow = new Window_Base(160, 35, 500, 72);
    this._textwindow.drawText("Who is the killer?", -18, 0, 500, "center");
    this.addWindow(this._textwindow);
    this._textwindow.setBackgroundType(-1);
}

Scene_SuspectSelect.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
    this._suspectselectwindow.refresh();
}

Scene_SuspectSelect.prototype.update = function() {
    Scene_MenuBase.prototype.update.call(this);
}

Scene_SuspectSelect.prototype.confirm = function(susNum) {
    selected = susNum;
    SceneManager.push(Scene_Confirm);
}

// ----------------confirmation-----------------
function Scene_Confirm() {
    this.initialize.apply(this, arguments);
}

Scene_Confirm.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Confirm.prototype.constructor = Scene_Confirm;

Scene_Confirm.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
}

Scene_Confirm.prototype.create = function() { 
    Scene_MenuBase.prototype.create.call(this);
    this._confirmwindow = new Window_Confirm;
    this._confirmwindow.setHandler("Yes", this.yes.bind(this));
    this._confirmwindow.setHandler("No", this.no.bind(this));
    this.addWindow(this._confirmwindow);

    this._textwindow = new Window_Base(290, 200, 240, 72);
    this._textwindow.drawText("Are you sure?", -18, 0, 240, "center");
    this.addWindow(this._textwindow);
    this._textwindow.setBackgroundType(-1);
}

Scene_Confirm.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
    this._confirmwindow.refresh();
}

Scene_Confirm.prototype.yes = function() {
    $gameSwitches.setValue(Number(parameters['switchStart']) + selected, true);
    this.popScene();
    this.popScene();
};

Scene_Confirm.prototype.no = function() {
    this.popScene();
}

// =================Window========================
function Window_SuspectSelect() {
    this.initialize.apply(this, arguments);
}

Window_SuspectSelect.prototype = Object.create(Window_HorzCommand.prototype);
Window_SuspectSelect.prototype.constructor = Window_SuspectSelect;

Window_SuspectSelect.prototype.initialize = function() {
    x = (Graphics.boxWidth / 2) - (this.windowWidth() / 2)
    y = (Graphics.boxHeight / 2) - (this.windowHeight() / 2)
    Window_HorzCommand.prototype.initialize.call(this, x, y);
}

Window_SuspectSelect.prototype.makeCommandList = function() {
    for (var i = 0; i < suspects; i++) {
        this.addCommand("suspect" + i, "command" + i);
    }
}

Window_SuspectSelect.prototype.drawItem = function (index) {
    var itemRect = this.itemRect(index);
    this.drawFace(faces[index], 0, itemRect.x + 10, itemRect.y - 5, itemRect.width - 20, itemRect.height - 20)
    this.drawText(names[index], itemRect.x, itemRect.y + 150, itemRect.width, 'center')
} 

Window_SuspectSelect.prototype.maxCols = function () {
    return 3;
}

Window_HorzCommand.prototype.numVisibleRows = function() {
    return 2;
};

Window_SuspectSelect.prototype.maxPageRows = function () {
    return 2;
}
Window_SuspectSelect.prototype.windowHeight = function() {
    return this.fittingHeight(this.numVisibleRows()) * 3.75;
};

Window_SuspectSelect.prototype.windowWidth = function() {
    return this.windowHeight() * (3/this.numVisibleRows()) + 15;
};


Window_SuspectSelect.prototype.itemHeight = function() {
    return (this.height - this.padding * 2) / this.maxPageRows();
};

Window_SuspectSelect.prototype.itemWidth = function() {
    return this.itemHeight()
}


// ----------------confirmation-----------------
function Window_Confirm() {
    this.initialize.apply(this, arguments);
}

Window_Confirm.prototype = Object.create(Window_HorzCommand.prototype);
Window_Confirm.prototype.constructor = Window_Confirm;

Window_Confirm.prototype.initialize = function() {
    x = (Graphics.boxWidth / 2) - (this.windowWidth() / 2)
    y = (Graphics.boxHeight / 2) - (this.windowHeight() / 2)
    Window_HorzCommand.prototype.initialize.call(this, x, y);
    this.select(1);
}

Window_Confirm.prototype.makeCommandList = function() {
    this.addCommand("Yes", "Yes");
    this.addCommand("No", "No");
}

Window_Confirm.prototype.maxCols = function () {
    return 2;
}

Window_Confirm.prototype.numVisibleRows = function() {
    return 1;
};

Window_Confirm.prototype.maxPageRows = function () {
    return 1;
}