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
 * Use plugin command muder_select to open the window
 */


suspect_select_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    suspect_select_pluginCommand.call(this, command, args);
    if(command === "suspect_select") SceneManager.push(Scene_SuspectSelect);
}

var suspects = 6;


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
    this._muredererselectwindow = new Window_SuspectSelect();
    for (var i = 0; i < clues * numMurders; i++) {
        this._suspectselectwindow.setHandler("command" + i, this.moreInfo.bind(this, i));
    }
    this.addWindow(this._muredererselectwindow)
}

Scene_SuspectSelect.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
    this._muredererselectwindow.refresh();
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
}

Scene_Confirm.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
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
    return this.fittingHeight(this.numVisibleRows()) * 2;
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
}

Window_Confirm.prototype.makeCommandList = function() {
    // for (var i = 0; i < clues; i++) {
    //     this.addCommand("Item" + (i + this.getClueStart()), "command" + (i + this.getClueStart()));
    // }
}

Window_Confirm.prototype.drawItem = function (index) {
    var itemRect = this.itemRect(index);
} 

Window_Confirm.prototype.maxCols = function () {
    return 3;
}

Window_HorzCommand.prototype.numVisibleRows = function() {
    return 2;
};

Window_Confirm.prototype.maxPageRows = function () {
    return 2;
}
Window_Confirm.prototype.windowHeight = function() {
    return this.fittingHeight(this.numVisibleRows()) * 2;
};

Window_Confirm.prototype.windowWidth = function() {
    return this.windowHeight() * (3/this.numVisibleRows()) + 15;
};