//=============================================================================
// ClickAndDrag.js
//=============================================================================

/*:
 * @plugindesc Association Puzzle 1
 * @author Danic Crispin
 *
 * 
 *
 * @help
 * To close the inventory press esc
 *
 * To activate the menu through an event, create a plugin event
 * and type in:
 * ClickAndDrag_1
 */

//Input.keyMapper["68"] = "drag_1"; //d

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

            this.frames = 0;

            $gameSwitches.setValue(20, false);
        }
        Scene_drag.prototype = Object.create(Scene_MenuBase.prototype);
        this.scene_drag = (Scene_drag.prototype.constructor = Scene_drag);

        this.scene_drag.prototype.create = function() {
            Scene_MenuBase.prototype.create.call(this);

            // create window
            this._drag_window_1 = new Window_Drag(0, 0, Graphics.width, (3/8)*Graphics.height - 10);
            this._drag_window_2 = new Window_Drag(0, ((3/8)*Graphics.height) - 10, Graphics.width, ((5/8)*Graphics.height) + 10);
            this._score_window = this._score_window = new Window_Drag(0, 0, Graphics.width, (3/8)*Graphics.height - 10);
            
            this.addWindow(this._drag_window_1);
            this.addWindow(this._drag_window_2);

            // get images from files
            this.bit_box = create_bitmap("img/pictures/", "box_base");
            this.bit_book = create_bitmap("img/pictures/", "book");
            this.bit_tv = create_bitmap("img/pictures/", "tv");
            this.bit_oven = create_bitmap("img/pictures/", "oven");
            this.bit_dishes = create_bitmap("img/pictures/", "dishes");
            this.bit_dead = create_bitmap("img/pictures/", "dead");
            this.bit_buzzer = create_bitmap("img/pictures/", "buzzer");
            this.bit_text_box = create_bitmap("img/pictures/", "box");
            this.bit_check = create_bitmap("img/pictures/", "check")

            //this.text_box = new My_Sprite(this.bit_text_box, 0, 0, 0, 0, 1, 1);
            //this._drag_window_2.addChild(this.text_box);
            this.setBackgroundOpacity(100);
            this._drag_window_1.opacity = 255;
            this._drag_window_2.opacity = 0;

            // draw text
            let text = "\\fs[23]- At 11PM, Cyrus was \\fb\\C[1]pushed/fell\\fb\\C[0] out of the apartment.\n" +
            "- Cyrus washed the \\fb\\C[1]dishes\\fb\\C[0] sometime after he made dinner.\n" +
            "- Cyrus read a \\fb\\C[1]book\\fb\\C[0] sometime before he made dinner.\n" +
            "- Cyrus never watches \\fb\\C[1]TV\\fb\\C[0] immediately after he washes the dishes.\n" +
            "- Cyrus' wife mentions that he was\\fi extremely\\fi particular about\n  washing the \\fb\\C[1]dishes\\fb\\C[0] at 8pm, and he never failed to do so.\n\n";

            this._drag_window_1.drawTextEx(text, 5, -5);
            this._drag_window_2.drawTextEx("\\fs[23]\\C[2]With this in mind, what is a timeline of the events that occurred?\\C[0]", 6, -5);

            let height_ = (3.2/11)*((5/8)*(Graphics.height) + 10) - 40;
            this._drag_window_2.drawTextEx("\\fb6pm", ((Graphics.width/7) - 38), height_);
            this._drag_window_2.drawTextEx("\\fb7pm", ((2*Graphics.width/7) - 38), height_);
            this._drag_window_2.drawTextEx("\\fb8pm", ((3*Graphics.width/7) - 38), height_);
            this._drag_window_2.drawTextEx("\\fb9pm", ((4*Graphics.width/7) - 38), height_);
            this._drag_window_2.drawTextEx("\\fb10pm", ((5*Graphics.width/7) - 42), height_);
            this._drag_window_2.drawTextEx("\\fb11pm", ((6*Graphics.width/7) - 42), height_);

            height_ += 246;
            this._drag_window_2.drawTextEx("\\fb\\fs[22]\\C[1]Dinner", ((Graphics.width/7) - 49), height_);
            this._drag_window_2.drawTextEx("\\fb\\fs[22]\\C[1]TV", ((2*Graphics.width/7) - 31), height_);
            this._drag_window_2.drawTextEx("\\fb\\fs[22]\\C[1]Reading", ((3*Graphics.width/7) - 55), height_);
            this._drag_window_2.drawTextEx("\\fb\\fs[22]\\C[1]Dishes", ((4*Graphics.width/7) - 50), height_);
            this._drag_window_2.drawTextEx("\\fb\\fs[22]\\C[1]Door Bell", ((5*Graphics.width/7) - 64), height_);
            this._drag_window_2.drawTextEx("\\fb\\fs[22]\\C[1]Death", ((6*Graphics.width/7) - 44), height_);


            // create sprites
            // boxes
            let shadow_box_height = (6*(Graphics.height/3)/3)
            this.shadow_box_1 = new My_Sprite(this.bit_box, (Graphics.width/7), shadow_box_height, 0.5, 0.5, 1.3, 1.3);
            this.shadow_box_1.opacity = 150;
            this.addChild(this.shadow_box_1);

            this.shadow_box_2 = new My_Sprite(this.bit_box, (2*Graphics.width/7), shadow_box_height, 0.5, 0.5, 1.3, 1.3);
            this.shadow_box_2.opacity = 150;
            this.addChild(this.shadow_box_2);

            this.shadow_box_3 = new My_Sprite(this.bit_box, (3*Graphics.width/7), shadow_box_height, 0.5, 0.5, 1.3, 1.3);
            this.shadow_box_3.opacity = 150;
            this.addChild(this.shadow_box_3);

            this.shadow_box_4 = new My_Sprite(this.bit_box, (4*Graphics.width/7), shadow_box_height, 0.5, 0.5, 1.3, 1.3);
            this.shadow_box_4.opacity = 150;
            this.addChild(this.shadow_box_4);

            this.shadow_box_5 = new My_Sprite(this.bit_box, (5*Graphics.width/7), shadow_box_height, 0.5, 0.5, 1.3, 1.3);
            this.shadow_box_5.opacity = 150;
            this.addChild(this.shadow_box_5);

            this.shadow_box_6 = new My_Sprite(this.bit_box, (6*Graphics.width/7), shadow_box_height, 0.5, 0.5, 1.3, 1.3);
            this.shadow_box_6.opacity = 150;
            this.addChild(this.shadow_box_6);

            this.shadow_boxes = [this.shadow_box_1, this.shadow_box_2, this.shadow_box_3, this.shadow_box_4, this.shadow_box_5, this.shadow_box_6]

            let height_box = (7.5*(Graphics.height/3)/3);
            this.box_1_2 = new My_Sprite(this.bit_box, (Graphics.width/7), height_box, 0.5, 0.5);
            this.box_1_2.opacity = 50;
            this.addChild(this.box_1_2);

            this.box_2_2 = new My_Sprite(this.bit_box, (2*Graphics.width/7), height_box, 0.5, 0.5);
            this.box_2_2.opacity = 50;
            this.addChild(this.box_2_2);

            this.box_3_2 = new My_Sprite(this.bit_box, (3*Graphics.width/7), height_box, 0.5, 0.5);
            this.box_3_2.opacity = 50;
            this.addChild(this.box_3_2);

            this.box_4_2 = new My_Sprite(this.bit_box, (4*Graphics.width/7), height_box, 0.5, 0.5);
            this.box_4_2.opacity = 50;
            this.addChild(this.box_4_2);

            this.box_5_2 = new My_Sprite(this.bit_box, (5*Graphics.width/7), height_box, 0.5, 0.5);
            this.box_5_2.opacity = 50;
            this.addChild(this.box_5_2);

            this.box_6_2 = new My_Sprite(this.bit_box, (6*Graphics.width/7), height_box, 0.5, 0.5);
            this.box_6_2.opacity = 50;
            this.addChild(this.box_6_2);


            this.box_1 = new My_Sprite(this.bit_box, (Graphics.width/7), height_box, 0.5, 0.5);
            this.addChild(this.box_1);
            this.oven = new My_Sprite(this.bit_oven, (Graphics.width/7), height_box, 0.5, 0.5);
            this.addChild(this.oven);

            this.box_2 = new My_Sprite(this.bit_box, (2*Graphics.width/7), height_box, 0.5, 0.5);
            this.addChild(this.box_2);
            this.tv = new My_Sprite(this.bit_tv, (2*Graphics.width/7), height_box, 0.5, 0.5);
            this.addChild(this.tv);

            this.box_3 = new My_Sprite(this.bit_box, (3*Graphics.width/7), height_box, 0.5, 0.5);
            this.addChild(this.box_3);
            this.book = new My_Sprite(this.bit_book, (3*Graphics.width/7), height_box, 0.5, 0.5);
            this.addChild(this.book);

            this.box_4 = new My_Sprite(this.bit_box, (4*Graphics.width/7), height_box, 0.5, 0.5);
            this.addChild(this.box_4);
            this.dishes = new My_Sprite(this.bit_dishes, (4*Graphics.width/7), height_box, 0.5, 0.5);
            this.addChild(this.dishes);

            this.box_5 = new My_Sprite(this.bit_box, (5*Graphics.width/7), height_box, 0.5, 0.5);
            this.addChild(this.box_5);
            this.door = new My_Sprite(this.bit_buzzer, (5*Graphics.width/7), height_box, 0.5, 0.5);
            this.addChild(this.door);

            this.box_6 = new My_Sprite(this.bit_box, (6*Graphics.width/7), height_box, 0.5, 0.5);
            this.addChild(this.box_6);
            this.dead = new My_Sprite(this.bit_dead, (6*Graphics.width/7), height_box, 0.5, 0.5);
            this.addChild(this.dead);

            this.boxes = [this.box_1, this.box_2, this.box_3, this.box_4, this.box_5, this.box_6];
            this.items = [this.oven, this.tv, this.book, this.dishes, this.door, this.dead];
            this.boxes_x = [(Graphics.width/7), (2*Graphics.width/7), (3*Graphics.width/7), (4*Graphics.width/7), (5*Graphics.width/7), (6*Graphics.width/7)];
            this.boxes_y = [height_box, height_box, height_box, height_box, height_box, height_box];

            this.button = new My_Sprite(this.bit_check, ((20/22.5)*Graphics.width), (Graphics.height/2) - 17, 0.5, 0.5);
            this.addChild(this.button);
        }

        this.scene_drag.prototype.update = function() {
            this.frames += 1;
            this.frames %= 101;
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
                if ((this.boxes[i].x - 50 < TouchInput.x) && (TouchInput.x < this.boxes[i].x + 50) && 
                (this.boxes[i].y - 50 < TouchInput.y) && (TouchInput.y < this.boxes[i].y + 50)) {
                    if (TouchInput.isTriggered()) {
                        this.grab[i] = true;
                        this.addChild(this.boxes[i]);
                        this.addChild(this.items[i]);
                    } else if (this.grab.every((element) => element == false)) {
                        let scale = 1.1;
                        this.boxes[i].scale.x = scale;
                        this.boxes[i].scale.y = scale;

                        this.items[i].scale.x = scale;
                        this.items[i].scale.y = scale;
                    } 
                }  else {
                    let scale = 1;
                    this.boxes[i].scale.x = scale;
                    this.boxes[i].scale.y = scale;

                    this.items[i].scale.x = scale;
                    this.items[i].scale.y = scale;
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

            if ((this.button.x - 70 < TouchInput.x) && (TouchInput.x < this.button.x + 70) && 
            (this.button.y - 25 < TouchInput.y) && (TouchInput.y < this.button.y + 25) && this.grab.every((element) => element == false)) {
                this.button.scale.x = 1.1;
                this.button.scale.y = 1.1;

                if (TouchInput.isTriggered()) {
                    let right_answers = 0;
                    if ((this.items[0].x == this.shadow_boxes[1].x) && (this.items[0].y == this.shadow_boxes[1].y)){
                        right_answers += 1;
                    }
                    if ((this.items[1].x == this.shadow_boxes[4].x) && (this.items[1].y == this.shadow_boxes[4].y)){
                        right_answers += 1;
                    }
                    if ((this.items[2].x == this.shadow_boxes[0].x) && (this.items[2].y == this.shadow_boxes[0].y)){
                        right_answers += 1;
                    }
                    if ((this.items[3].x == this.shadow_boxes[2].x) && (this.items[3].y == this.shadow_boxes[2].y)) {
                        right_answers += 1;
                    }
                    if ((this.items[4].x == this.shadow_boxes[3].x) && (this.items[4].y == this.shadow_boxes[3].y)){
                        right_answers += 1;
                    }
                    if ((this.items[5].x == this.shadow_boxes[5].x) && (this.items[5].y == this.shadow_boxes[5].y)){
                        right_answers += 1;
                    }

                    if (right_answers == 6) {
                        $gameSwitches.setValue(20, true);
                        SceneManager.pop();
                    } else {
                        this._score_window = this._score_window = new Window_Drag(0, 0, Graphics.width, (3/8)*Graphics.height - 10);
                        this.addWindow(this._score_window);
                        this._score_window.drawText("You've correctly identified " + String(right_answers) + " event" + ((right_answers == 1) ? "." : "s."), 0, 50, Graphics.width, "center");
                        this.frames = 0;
                    }
                }
            } else {
                this.button.scale.x = 1;
                this.button.scale.y = 1;
            }
            if (this.frames == 100) {
                this._windowLayer.removeChild(this._score_window);
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

TouchInput._onMouseMove = function(event) {
    var x = Graphics.pageToCanvasX(event.pageX);
    var y = Graphics.pageToCanvasY(event.pageY);
    this._onMove(x, y);
};