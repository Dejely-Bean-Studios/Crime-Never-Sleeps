//import Scene_MenuBase  from ".\\rpg_scenes";
Input.keyMapper["76"] = "lockpick_menu_1"; //L
_alias_scene_map_update = Scene_Map.prototype.update;

class Lockpick_menu_1 {
    constructor() {
        this.init_scene();
    }
    init_scene() {
        function Scene_Lockpick_1() {
            Scene_MenuBase.prototype.initialize.call(this);
        }
        Scene_Lockpick_1.prototype = Object.create(Scene_MenuBase.prototype);
        this.scene_lockpick_1 = (Scene_Lockpick_1.prototype.constructor = Scene_Lockpick_1);

        this.scene_lockpick_1.prototype.update = function() {
            if (Input.isTriggered("cancel"))
            SceneManager.pop();

            if (TouchInput.isTriggered() && (TouchInput.x > Graphics.boxWidth - 256) && (TouchInput.y < 256)) {
                //console.log("Crystal", "x:", TouchInput.x, "y:", TouchInput.y);
                this.mirror_1.rotation += (Math.PI / 3);
            }
        }

        this.scene_lockpick_1.prototype.create = function() {
            Scene_MenuBase.prototype.create.call(this);
            //console.log(Graphics.height)
            this._lockpick_window_1 = new Window_Lockpick_1(0, 0, Graphics.width, Graphics.height);
            this.addWindow(this._lockpick_window_1);

            this.mirror_1 = new Sprite_mirror(ImageManager.loadBitmap("img/pictures/", "crystal", 0, true));
            this.mirror_1.anchor.x = 0.5;
            this.mirror_1.anchor.y = 0.5;
            this.addChild(this.mirror_1);
        }

    }
    get_scene_lockpick_1() {
        return this.scene_lockpick_1;
    }
}

function Window_Lockpick_1(x, y, width, height) {
    Window_Base.prototype.initialize.call(this, x, y, width, height)
}
Window_Lockpick_1.prototype = Object.create(Window_Base.prototype);
Window_Lockpick_1.prototype.constructor = Window_Lockpick_1;

function Sprite_mirror(bitmap) {
    Sprite.prototype.initialize.call(this, bitmap);
    this.x = Graphics.boxWidth - 128;
    this.y = 128;
}
Sprite_mirror.prototype = Object.create(Sprite.prototype);
Sprite_mirror.prototype.constructor = Sprite_mirror;


let lockpick_menu_1 = new Lockpick_menu_1();

Scene_Map.prototype.update = function() {
    _alias_scene_map_update.call(this);
    if (Input.isTriggered("lockpick_menu_1")) SceneManager.push(lockpick_menu_1.get_scene_lockpick_1());
}