//=============================================================================
// MurdererSelect.js
//=============================================================================

/*:
 * @plugindesc Displays a window to select the murderer suspects
 * @author Ethan Chung
 *
 * @help
 * Uses a switch to open the murder select window and activates switches
 * depending on what was selected.
 * 
 * Use plugin command muder_select to open the window
 */


murderer_select_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    murderer_select_pluginCommand.call(this, command, args);
    if(command === "murderer_select") SceneManager.push(Scene_MurdererSelect);
}


// ==================Scene========================
function Scene_MurdererSelect() {
    this.initialize.apply(this, arguments);
}

Scene_MurdererSelect.prototype = Object.create(Scene_MenuBase.prototype);
Scene_MurdererSelect.prototype.constructor = Scene_MurdererSelect;

Scene_MurdererSelect.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
}

Scene_MurdererSelect.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
}

Scene_MurdererSelect.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
}

// =================Window========================
function Window_MurdererSelect() {
    this.initialize.apply(this, arguments);
}

Window_MurdererSelect.prototype = Object.create(Window_HorzCommand.prototype);
Window_MurdererSelect.prototype.constructor = Window_MurdererSelect;

Window_MurdererSelect.prototype.initialize = function() {
    x = (Graphics.boxWidth / 2) - (this.windowWidth() / 2)
    y = (Graphics.boxHeight / 2) - (this.windowHeight() / 2)
    this._page = 1;
    Window_HorzCommand.prototype.initialize.call(this, x, y);
}

Window_MurdererSelect.prototype.makeCommandList = function() {
    for (var i = 0; i < clues; i++) {
        this.addCommand("Item" + (i + this.getClueStart()), "command" + (i + this.getClueStart()));
    }
}

Window_MurdererSelect.prototype.drawItem = function (index) {
    var itemRect = this.itemRect(index);
} 

Window_MurdererSelect.prototype.maxCols = function () {
    return 3;
}

Window_HorzCommand.prototype.numVisibleRows = function() {
    return 2;
};

Window_MurdererSelect.prototype.maxPageRows = function () {
    return 2;
}
Window_MurdererSelect.prototype.windowHeight = function() {
    return this.fittingHeight(this.numVisibleRows()) * 2;
};

Window_MurdererSelect.prototype.windowWidth = function() {
    return this.windowHeight() * (3/this.numVisibleRows()) + 15;
};


Window_MurdererSelect.prototype.itemHeight = function() {
    return (this.height - this.padding * 2) / this.maxPageRows();
};

Window_MurdererSelect.prototype.itemWidth = function() {
    return this.itemHeight()
}
