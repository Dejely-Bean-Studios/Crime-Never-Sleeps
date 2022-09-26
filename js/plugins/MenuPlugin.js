function Scene_Lockpick_1() {
    this.initialize.apply(this, arguments);
}

Scene_Lockpick_1.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Lockpick_1.prototype.constructor = Scene_Lockpick_1;

Scene_Lockpick_1.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};