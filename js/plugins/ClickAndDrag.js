//=============================================================================
// ClickAndDrag.js
//=============================================================================

/*:
 * @plugindesc Click and Drag prototype
 * @author Danic Crispin
 *
 * 
 *
 * @help
 * To open and close the Click and Drag menu on any screen press d
 * To close the inventory press esc
 * 
 * Once in the menu click on the small box and drag it onto the bigger box.
 *
 * To activate the menu through an event, create a plugin event
 * and type in:
 * ClickAndDrag_1
 */

Input.keyMapper["68"] = "drag_1"; //d

class Drag_1 {
    constructor() {
        this.init_scene();
    }
    init_scene() {
        function Scene_drag() {
            Scene_MenuBase.prototype.initialize.call(this);
            this.grab = false;

        }
        Scene_drag.prototype = Object.create(Scene_MenuBase.prototype);
        this.scene_drag = (Scene_drag.prototype.constructor = Scene_drag);

        this.scene_drag.prototype.update = function() {
            // exits scene when esc key is pressed
            if (Input.isTriggered("cancel")) SceneManager.pop();

            if (TouchInput.isTriggered() && (this.box.x - 50 < TouchInput.x) && (TouchInput.x < this.box.x + 50) && 
            (this.box.y - 50 < TouchInput.y) && (TouchInput.y < this.box.y + 50)) {
                this.grab = true;
            }

            if (this.grab) {
                this.box.x = TouchInput.x;
                this.box.y = TouchInput.y;
            }

            if (this.grab && TouchInput.isReleased()){
                if ((this.shadow_box.x - 50 < TouchInput.x) && (TouchInput.x < this.shadow_box.x + 50) && 
                (this.shadow_box.y - 50 < TouchInput.y) && (TouchInput.y < this.shadow_box.y + 50)) {
                    this.box.x = this.shadow_box.x;
                    this.box.y = this.shadow_box.y;
                } else {
                    this.box.x = (2*Graphics.width/3);
                    this.box.y = 500;
                }
                this.grab = false;
            }

        }

        this.scene_drag.prototype.create = function() {
            Scene_MenuBase.prototype.create.call(this);

            // create window
            this._drag_window_1 = new Window_Drag(0, 0, Graphics.width, Graphics.height);
            this.addWindow(this._drag_window_1);

            // get images from files
            this.bit_box = create_bitmap("img/pictures/", "box_base");


            // create sprites
            // boxes
            this.shadow_box = new My_Sprite(this.bit_box, (Graphics.width/3), 200, 0.5, 0.5, 1.3, 1.3);
            this.shadow_box.opacity = 150;
            this.addChild(this.shadow_box);

            this.box = new My_Sprite(this.bit_box, (2*Graphics.width/3), 500, 0.5, 0.5);
            this.addChild(this.box);
        }

    }
    get_scene_drag() {
        return this.scene_drag;
    }
}

function create_bitmap(folder, filename, hue = 0, extention = ".png", smooth = true) {
    var path = folder + encodeURIComponent(filename) + extention;
    var bitmap = ImageManager.loadNormalBitmap(path, hue || 0);
    bitmap.smooth = smooth;
    return bitmap;
}

function Window_Drag(x, y, width, height) {
    Window_Base.prototype.initialize.call(this, x, y, width, height)
}
Window_Drag.prototype = Object.create(Window_Base.prototype);
Window_Drag.prototype.constructor = Window_Drag;

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


let drag_1 = new Drag_1();

_alias_scene_map_update_2 = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
    _alias_scene_map_update_2.call(this);
    if (Input.isTriggered("drag_1")) SceneManager.push(drag_1.get_scene_drag());
}

_alias_custom_pluginCommand_drag = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _alias_custom_pluginCommand_drag.call(this, command, args);
    if(command === "ClickAndDrag_1") SceneManager.push(drag_1.get_scene_drag());
};