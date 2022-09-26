Input.keyMapper["76"] = "lockpick_menu_1"; //L

_alias_scene_map_update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
    _alias_scene_map_update.call(this);
    if (Input.isTriggered("lockpick_menu_1")) SceneManager.push(Scene_Lockpick_1);
}

function Scene_Lockpick_1() {
    this.initialize.apply(this, arguments);
}

Scene_Lockpick_1.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Lockpick_1.prototype.constructor = Scene_Lockpick_1;

Scene_Lockpick_1.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
}

Scene_Lockpick_1.prototype.update = function() {
    if (Input.isTriggered("cancel")) SceneManager.pop()
}

Scene_Lockpick_1.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this._lockpick_window_1 = new Window_Lockpick_1(0, 0, 816, 624);
    this.addWindow(this._lockpick_window_1);
}

function Window_Lockpick_1() {
    this.initialize.apply(this, arguments);
}

Window_Lockpick_1.prototype = Object.create(Window_Base.prototype);
Window_Lockpick_1.prototype.constructor = Window_Lockpick_1;

Window_Lockpick_1.prototype.initialize = function(x, y, width, hight) {
    Window_Base.prototype.initialize.call(this, x, y, width, hight);
    this.drawAllItems();
}

Window_Lockpick_1.prototype.drawAllItems = function() {
}