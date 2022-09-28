//import Scene_MenuBase  from ".\\rpg_scenes";
Input.keyMapper["76"] = "lockpick_menu_1"; //L

class Lockpick_menu_1 {
    constructor() {
        this.init_scene();
    }
    init_scene() {
        function Scene_Lockpick_1() {
            Scene_MenuBase.prototype.initialize.call(this);
            this.tick = 0;
        }
        Scene_Lockpick_1.prototype = Object.create(Scene_MenuBase.prototype);
        this.scene_lockpick_1 = (Scene_Lockpick_1.prototype.constructor = Scene_Lockpick_1);

        this.scene_lockpick_1.prototype.update = function() {
            this.tick += 1;
            this.tick %= 40;
            if (Input.isTriggered("cancel")) SceneManager.pop();
            
            if (this.tick === 0) {
                this.addChildAt(this.laser_1_0, 2);
                this.laser_1_0.rotation = this.removeChild(this.laser_1_3).rotation;
            } else if (this.tick === 10) {
                this.addChildAt(this.laser_1_1, 2);
                this.laser_1_1.rotation = this.removeChild(this.laser_1_0).rotation;
            } else if (this.tick === 20) {
                this.addChildAt(this.laser_1_2, 2);
                this.laser_1_2.rotation = this.removeChild(this.laser_1_1).rotation;
            } else if (this.tick === 30) {
                this.addChildAt(this.laser_1_3, 2);
                this.laser_1_3.rotation = this.removeChild(this.laser_1_2).rotation;
            }

            if (this.tick === 0) {
                this.addChildAt(this.laser_2_0, 4);
                this.laser_2_0.rotation = this.removeChild(this.laser_2_3).rotation;
                this.laser_2 = this.laser_2_0;
            } else if (this.tick === 10) {
                this.addChildAt(this.laser_2_1, 4);
                this.laser_2_1.rotation = this.removeChild(this.laser_2_0).rotation;
                this.laser_2 = this.laser_2_1;
            } else if (this.tick === 20) {
                this.addChildAt(this.laser_2_2, 4);
                this.laser_2_2.rotation = this.removeChild(this.laser_2_1).rotation;
                this.laser_2 = this.laser_2_2;
            } else if (this.tick === 30) {
                this.addChildAt(this.laser_2_3, 4);
                this.laser_2_3.rotation = this.removeChild(this.laser_2_2).rotation;
                this.laser_2 = this.laser_2_3;
            }

            if (TouchInput.isTriggered() && (this.mirror_1.x - 100 < TouchInput.x) && (TouchInput.x < this.mirror_1.x + 100) && (this.mirror_1.y - 100 < TouchInput.y) && (TouchInput.y < this.mirror_1.y + 256)) {
                //console.log("Crystal", "x:", TouchInput.x, this.mirror_1.x, "y:", TouchInput.y, this.mirror_1.y);
                this.mirror_1.rotation += (Math.PI / 4);
                this.laser_2.rotation += (Math.PI / 4);
            }
            
        }

        this.scene_lockpick_1.prototype.create = function() {
            Scene_MenuBase.prototype.create.call(this);
            //console.log(Graphics.height)
            this._lockpick_window_1 = new Window_Lockpick_1(0, 0, Graphics.width, Graphics.height);
            this.addWindow(this._lockpick_window_1);

            this.laser_1_0 = new My_Sprite(create_bitmap("img/pictures/", "laser-0", ".png"), 100, 15, 0.9, 0.5, 0.2, 0.2);
            this.laser_1_1 = new My_Sprite(create_bitmap("img/pictures/", "laser-1", ".png"), 100, 15, 0.9, 0.5, 0.2, 0.2);
            this.laser_1_2 = new My_Sprite(create_bitmap("img/pictures/", "laser-2", ".png"), 100, 15, 0.9, 0.5, 0.2, 0.2);
            this.laser_1_3 = new My_Sprite(create_bitmap("img/pictures/", "laser-3", ".png"), 100, 15, 0.9, 0.5, 0.2, 0.2);
            this.addChild(this.laser_1_0);
            this.laser_1_0.rotation = (3 * Math.PI / 2);

            this.laser_2_0 = new My_Sprite(create_bitmap("img/pictures/", "laser-0", ".png"), 100, 500, 0.9, 0.5, 0.3, 0.2);
            this.laser_2_1 = new My_Sprite(create_bitmap("img/pictures/", "laser-1", ".png"), 100, 500, 0.9, 0.5, 0.3, 0.2);
            this.laser_2_2 = new My_Sprite(create_bitmap("img/pictures/", "laser-2", ".png"), 100, 500, 0.9, 0.5, 0.3, 0.2);
            this.laser_2_3 = new My_Sprite(create_bitmap("img/pictures/", "laser-3", ".png"), 100, 500, 0.9, 0.5, 0.3, 0.2);
            this.addChild(this.laser_2_0);
            this.laser_2 = this.laser_2_0;
            this.laser_2.rotation = (Math.PI / 2);
            this.mirror_1 = new My_Sprite(create_bitmap("img/pictures/", "crystal"), 100, 500);
            this.addChild(this.mirror_1);
        }

    }
    get_scene_lockpick_1() {
        return this.scene_lockpick_1;
    }
}

function create_bitmap(folder, filename, extention = ".png", hue = 0, smooth = true) {
    var path = folder + encodeURIComponent(filename) + extention;
    var bitmap = ImageManager.loadNormalBitmap(path, hue || 0);
    bitmap.smooth = smooth;
    return bitmap;
}

function Window_Lockpick_1(x, y, width, height) {
    Window_Base.prototype.initialize.call(this, x, y, width, height)
}
Window_Lockpick_1.prototype = Object.create(Window_Base.prototype);
Window_Lockpick_1.prototype.constructor = Window_Lockpick_1;

function My_Sprite(bitmap, x = 0, y = 0, anchor_x = 0.5, anchor_y = 0.5, scale_x = 1, scale_y = 1) {
    Sprite.prototype.initialize.call(this, bitmap);
    this.x = x;
    this.y = y;
    this.anchor.x = anchor_x;
    this.anchor.y = anchor_y;
    this.scale.x = scale_x;
    this.scale.y = scale_y;
}
My_Sprite.prototype = Object.create(Sprite_Button.prototype);
My_Sprite.prototype.constructor = My_Sprite;


let lockpick_menu_1 = new Lockpick_menu_1();

_alias_scene_map_update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
    _alias_scene_map_update.call(this);
    if (Input.isTriggered("lockpick_menu_1")) SceneManager.push(lockpick_menu_1.get_scene_lockpick_1());
}

_alias_custom_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _alias_custom_pluginCommand.call(this, command, args);
    if(command === "LockPick_1") SceneManager.push(lockpick_menu_1.get_scene_lockpick_1());
};
