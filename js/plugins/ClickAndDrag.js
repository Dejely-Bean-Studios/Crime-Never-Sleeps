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
            this.grab_oven = false;
            this.grab_tv = false;
            this.grab_book = false;
            this.grab_dishes = false;
            this.grab_door = false;
            this.grab_dead = false;
            this.grab = [this.grab_oven, this.grab_tv, this.grab_book, this.grab_dishes, this.grab_door, this.grab_dead];

            this.box_1_occupied = false;
            this.box_2_occupied = false;
            this.box_3_occupied = false;
            this.box_4_occupied = false;
            this.box_5_occupied = false;
            this.box_6_occupied = false;
            this.occupied = [this.box_1_occupied, this.box_2_occupied, this.box_3_occupied, this.box_4_occupied, this.box_5_occupied, this.box_6_occupied];

        }
        Scene_drag.prototype = Object.create(Scene_MenuBase.prototype);
        this.scene_drag = (Scene_drag.prototype.constructor = Scene_drag);

        this.scene_drag.prototype.create = function() {
            Scene_MenuBase.prototype.create.call(this);

            // create window
            this._drag_window_1 = new Window_Drag(0, 0, Graphics.width, Graphics.height);
            this.addWindow(this._drag_window_1);

            // get images from files
            this.bit_box = create_bitmap("img/pictures/", "box_base");
            this.bit_book = create_bitmap("img/pictures/", "book");
            this.bit_tv = create_bitmap("img/pictures/", "tv");
            this.bit_oven = create_bitmap("img/pictures/", "oven");
            this.bit_dishes = create_bitmap("img/pictures/", "dishes");
            this.bit_dead = create_bitmap("img/pictures/", "dead");
            this.bit_buzzer = create_bitmap("img/pictures/", "buzzer");


            // create sprites
            // boxes
            this.shadow_box_1 = new My_Sprite(this.bit_box, (Graphics.width/7), (Graphics.height/3), 0.5, 0.5, 1.3, 1.3);
            this.shadow_box_1.opacity = 150;
            this.addChild(this.shadow_box_1);

            this.shadow_box_2 = new My_Sprite(this.bit_box, (2*Graphics.width/7), (Graphics.height/3), 0.5, 0.5, 1.3, 1.3);
            this.shadow_box_2.opacity = 150;
            this.addChild(this.shadow_box_2);

            this.shadow_box_3 = new My_Sprite(this.bit_box, (3*Graphics.width/7), (Graphics.height/3), 0.5, 0.5, 1.3, 1.3);
            this.shadow_box_3.opacity = 150;
            this.addChild(this.shadow_box_3);

            this.shadow_box_4 = new My_Sprite(this.bit_box, (4*Graphics.width/7), (Graphics.height/3), 0.5, 0.5, 1.3, 1.3);
            this.shadow_box_4.opacity = 150;
            this.addChild(this.shadow_box_4);

            this.shadow_box_5 = new My_Sprite(this.bit_box, (5*Graphics.width/7), (Graphics.height/3), 0.5, 0.5, 1.3, 1.3);
            this.shadow_box_5.opacity = 150;
            this.addChild(this.shadow_box_5);

            this.shadow_box_6 = new My_Sprite(this.bit_box, (6*Graphics.width/7), (Graphics.height/3), 0.5, 0.5, 1.3, 1.3);
            this.shadow_box_6.opacity = 150;
            this.addChild(this.shadow_box_6);

            this.shadow_boxes = [this.shadow_box_1, this.shadow_box_2, this.shadow_box_3, this.shadow_box_4, this.shadow_box_5, this.shadow_box_6]


            this.box_1 = new My_Sprite(this.bit_box, (Graphics.width/7), (2*Graphics.height/3), 0.5, 0.5);
            this.addChild(this.box_1);
            this.oven = new My_Sprite(this.bit_oven, (Graphics.width/7), (2*Graphics.height/3), 0.5, 0.5);
            this.addChild(this.oven);

            this.box_2 = new My_Sprite(this.bit_box, (2*Graphics.width/7), (2*Graphics.height/3), 0.5, 0.5);
            this.addChild(this.box_2);
            this.tv = new My_Sprite(this.bit_tv, (2*Graphics.width/7), (2*Graphics.height/3), 0.5, 0.5);
            this.addChild(this.tv);

            this.box_3 = new My_Sprite(this.bit_box, (3*Graphics.width/7), (2*Graphics.height/3), 0.5, 0.5);
            this.addChild(this.box_3);
            this.book = new My_Sprite(this.bit_book, (3*Graphics.width/7), (2*Graphics.height/3), 0.5, 0.5);
            this.addChild(this.book);

            this.box_4 = new My_Sprite(this.bit_box, (4*Graphics.width/7), (2*Graphics.height/3), 0.5, 0.5);
            this.addChild(this.box_4);
            this.dishes = new My_Sprite(this.bit_dishes, (4*Graphics.width/7), (2*Graphics.height/3), 0.5, 0.5);
            this.addChild(this.dishes);

            this.box_5 = new My_Sprite(this.bit_box, (5*Graphics.width/7), (2*Graphics.height/3), 0.5, 0.5);
            this.addChild(this.box_5);
            this.door = new My_Sprite(this.bit_buzzer, (5*Graphics.width/7), (2*Graphics.height/3), 0.5, 0.5);
            this.addChild(this.door);

            this.box_6 = new My_Sprite(this.bit_box, (6*Graphics.width/7), (2*Graphics.height/3), 0.5, 0.5);
            this.addChild(this.box_6);
            this.dead = new My_Sprite(this.bit_dead, (6*Graphics.width/7), (2*Graphics.height/3), 0.5, 0.5);
            this.addChild(this.dead);

            this.boxes = [this.box_1, this.box_2, this.box_3, this.box_4, this.box_5, this.box_6];
            this.items = [this.oven, this.tv, this.book, this.dishes, this.door, this.dead];
            this.boxes_x = [(Graphics.width/7), (2*Graphics.width/7), (3*Graphics.width/7), (4*Graphics.width/7), (5*Graphics.width/7), (6*Graphics.width/7)];
            this.boxes_y = [(2*Graphics.height/3), (2*Graphics.height/3), (2*Graphics.height/3), (2*Graphics.height/3), (2*Graphics.height/3), (2*Graphics.height/3)];
        }

        this.scene_drag.prototype.update = function() {
            // exits scene when esc key is pressed
            if (Input.isTriggered("cancel")) SceneManager.pop();

            for (let i = 0; i < this.occupied.length; i++) {
                for (let j = 0; j < this.items.length; j++) {
                    if ((this.shadow_boxes[i].x == this.items[j].x) && (this.shadow_boxes[i].y == this.items[j].y)) {
                        this.occupied[i] = true;
                        break;
                    } else this.occupied[i] = false;
                }
            }

            for (let i = 0; i < this.grab.length; i++){
                if (TouchInput.isTriggered() && (this.boxes[i].x - 50 < TouchInput.x) && (TouchInput.x < this.boxes[i].x + 50) && 
                (this.boxes[i].y - 50 < TouchInput.y) && (TouchInput.y < this.boxes[i].y + 50)) {
                    this.grab[i] = true;
                    this.addChild(this.boxes[i]);
                    this.addChild(this.items[i]);
                }

                if (this.grab[i]) {
                    this.boxes[i].x = TouchInput.x;
                    this.boxes[i].y = TouchInput.y;

                    this.items[i].x = TouchInput.x;
                    this.items[i].y = TouchInput.y;
                }

                if (this.grab[i] && TouchInput.isReleased()) {
                    for (let j = 0; j < this.shadow_boxes.length; j++) {
                        if ((this.shadow_boxes[j].x - 50 < TouchInput.x) && (TouchInput.x < this.shadow_boxes[j].x + 50) && 
                        (this.shadow_boxes[j].y - 50 < TouchInput.y) && (TouchInput.y < this.shadow_boxes[j].y + 50) && !this.occupied[j]) {
                            this.boxes[i].x = this.shadow_boxes[j].x;
                            this.boxes[i].y = this.shadow_boxes[j].y;

                            this.items[i].x = this.shadow_boxes[j].x;
                            this.items[i].y = this.shadow_boxes[j].y
                            
                            //this.occupied[j] = true;
                            break;
                        } else {
                            this.boxes[i].x = this.boxes_x[i];
                            this.boxes[i].y = this.boxes_y[i];

                            this.items[i].x = this.boxes_x[i];
                            this.items[i].y = this.boxes_y[i];
                        }
                    }

                    this.grab[i] = false;
                }
            }
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