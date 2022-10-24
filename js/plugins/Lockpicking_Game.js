//=============================================================================
// LockPicking_Game.js
//=============================================================================

/*:
 * @plugindesc Opens a laser puzzle
 * @author Danic Crispin
 *
 * 
 *
 * @help
 * To close the puzzle press esc
 * 
 * To rotate the mirrors, click on them.
 * To complete the puzzle, get the green sensor activated.
 * 
 * To activate the puzzle through an event, create a plugin event
 * and type in:
 * Lockpick_0
 * (for tutorial)
 * 
 * LockPick_1
 * (for appartment puzzle)
 * 
 */
//Input.keyMapper["76"] = "lockpick_menu_1"; //L

class Lockpick_menu_1 {
    constructor() {
        this.init_scene();
    }
    init_scene() {
        function Scene_Lockpick_1() {
            Scene_MenuBase.prototype.initialize.call(this);
            this.tick = 0;
            this.angle_1 = Math.PI/8;
            this.angle_2 = Math.PI/8;
            this.input_buffer = 0;
            this.mirror_1_square = false;
            this.mirror_2_square = false;
            this.mirror_2_blue = false;
            this.yellow_activated = false;
            this.adder = false;
            this.game_finished = false;
            this.counter = 0;
            $gameSwitches.setValue(18, false);
        }
        Scene_Lockpick_1.prototype = Object.create(Scene_MenuBase.prototype);
        this.scene_lockpick_1 = (Scene_Lockpick_1.prototype.constructor = Scene_Lockpick_1);

        this.scene_lockpick_1.prototype.update = function() {
            // frame counter
            this.tick += 1;
            this.tick %= 20;

            if (this.tick == 10) {
                let size = 1.1;
                this.laser_1.scale.x = size;
                this.laser_2.scale.x = size;
                this.laser_3.scale.x = size;
                this.laser_4.scale.x = size;
                this.laser_5.scale.x = size;
                this.laser_6.scale.x = size;
                this.laser_7.scale.x = size;
                this.laser_8.scale.x = size;
            } else if (this.tick == 0) {
                let size = 1;
                this.laser_1.scale.x = size;
                this.laser_2.scale.x = size;
                this.laser_3.scale.x = size;
                this.laser_4.scale.x = size;
                this.laser_5.scale.x = size;
                this.laser_6.scale.x = size;
                this.laser_7.scale.x = size;
                this.laser_8.scale.x = size;
            }

            // buffer prevents accidental double_clicks
            if (this.input_buffer > 0) this.input_buffer -= 1;

            // exits scene when esc key is pressed
            if (Input.isTriggered("cancel")) SceneManager.pop();

            if (this.game_finished) {
                this.counter += 1;

                if (this.counter >= 100) {
                    $gameSwitches.setValue(18, true);
                    SceneManager.pop();
                }
            }

            if (!this.game_finished) {

                if (this.yellow_activated) {
                    this.sensor_yellow.visible = false;
                    this.left_box_mirror.visible = true;
                    this.right_box_mirror.visible = true;
                    this.left_box.opacity = 255;
                    this.right_box.opacity = 255;
                    this.laser_3.visible = false;
                    this.laser_4.visible = true;
                    this.laser_5.visible = true;
                }


                // base angle
                var angle_unit = Math.PI/8;
                
                let hitbox = 25;
                // if mirror 1 gets clicked
                if ((this.mirror_1.x - hitbox < TouchInput.x) && (TouchInput.x < this.mirror_1.x + hitbox) && 
                (this.mirror_1.y - hitbox < TouchInput.y) && (TouchInput.y < this.mirror_1.y + hitbox) && (this.input_buffer == 0)) {

                    let scale = 1.1;
                    this.mirror_1.scale.x = scale;
                    this.mirror_1.scale.y = scale;

                    if (TouchInput.isReleased()) {
                        // reset buffer to avoid double-clicking
                        this.input_buffer = 10;

                        // resets angle to 0 when angle should be 0 (to prevent overshooting after multiple cycles)
                        if (((this.angle_1 % (5 * angle_unit)) < angle_unit)) this.angle_1 = 0;

                        //angle moves to the next state
                        this.angle_1 = (this.angle_1 % (4 * angle_unit)) + angle_unit;

                        this.mirror_1.rotation = this.angle_1 * 0.5;
                        this.laser_2.rotation = this.angle_1;
                        console.log(this.mirror_1.rotation/(Math.PI/8));
                    }
                } else {
                    let scale = 1;
                    this.mirror_1.scale.x = scale;
                    this.mirror_1.scale.y = scale;
                }

                // if mirror 2 gets clicked
                if ((this.mirror_2.x - hitbox < TouchInput.x) && (TouchInput.x < this.mirror_2.x + hitbox) && 
                (this.mirror_2.y - hitbox < TouchInput.y) && (TouchInput.y < this.mirror_2.y + hitbox) && (this.input_buffer == 0)) {

                    let scale = 1.1;
                    this.mirror_2.scale.x = scale;
                    this.mirror_2.scale.y = scale;

                    if (TouchInput.isReleased()) {

                        // reset buffer to avoid double-clicking
                        this.input_buffer = 10;

                        // resets angle to 0 when angle should be 0 (to prevent overshooting after multiple cycles)
                        if (((this.angle_2 % (5 * angle_unit)) < angle_unit)) this.angle_2 = 0;

                        //angle moves to the next state
                        this.angle_2 = (this.angle_2 % (4 * angle_unit)) + angle_unit;
                        
                        if (!this.yellow_activated){
                            this.mirror_2.rotation = (this.angle_2 * 0.5) - (4 * angle_unit);
                            this.laser_3.rotation = this.angle_2 - (4 * angle_unit);
                        } else {
                            if (!this.adder) {
                                this.angle_2 += angle_unit;
                                this.adder = true;
                            }
                            this.mirror_2.rotation = (this.angle_2 - (5 * angle_unit)) * 0.5;
                            this.laser_5.rotation = this.angle_2 - (5 * angle_unit);
                        }
                        console.log(this.angle_2/angle_unit);
                    }
                } else {
                    let scale = 1;
                    this.mirror_2.scale.x = scale;
                    this.mirror_2.scale.y = scale;
                }

                // if mirror 1 is at the correct angle
                if ((this.mirror_1.rotation / angle_unit) == 2) {
                    this.mirror_1_square = true;
                    if (!this.yellow_activated) {
                        this.laser_3.visible = true;
                        this.laser_2.scale.y = 1.05;
                    } else {
                        this.laser_2.scale.y = 0.4;
                        this.laser_6.visible = true;
                    }
                } else {
                    this.mirror_1_square = false;
                    this.laser_3.visible = false;
                    this.laser_2.scale.y = 1.3;
                    this.laser_6.visible = false;
                }

                // if mirror 2 is at the correct angle
                if ((this.mirror_2.rotation / angle_unit) == -2){
                    this.mirror_2_square = true;
                    if (this.yellow_activated){
                        this.laser_5.scale.y = 0.4;
                        this.laser_7.visible = true;
                    }
                } else {
                    this.mirror_2_square = false;
                    this.laser_7.visible = false;
                    this.laser_5.scale.y = 1.3;
                }

                // if yellow sensor activated and mirror 2 at the correct angle
                if (this.yellow_activated && ((this.mirror_2.rotation / angle_unit) == -1)) {
                    this.mirror_2_blue = true;
                    //this.left_pane.opacity = 255;
                    //this.right_pane.opacity = 255;
                    this.prism.opacity = 255;
                    this.addChild(this.prism);
                    this.laser_6.scale.y = 0.68;
                    this.laser_7.scale.y = 0.68;
                }

                // if any of the lasers are hitting the center
                if ((this.laser_6.visible || this.laser_7.visible) && this.mirror_2_blue){
                    this.laser_8.visible = true;

                    // combine colours
                    if (this.laser_6.visible && this.laser_7.visible) {
                        this.laser_8.bitmap = this.bit_laser_green;
                        this.game_finished = true;
                        
                    } else if (this.laser_6.visible) {
                        this.laser_8.bitmap = this.bit_laser_yellow;
                    } else {
                        this.laser_8.bitmap = this.bit_laser_blue;
                    }
                } else {
                    this.laser_8.visible = false;
                }

                // detect whether the yellow sensor has been activated
                if (this.mirror_1_square && this.mirror_2_square) this.yellow_activated = true;
            }
        }

        this.scene_lockpick_1.prototype.create = function() {
            Scene_MenuBase.prototype.create.call(this);

            // create window
            this._lockpick_window_1 = new Window_Lockpick_1(0, 0, Graphics.width, Graphics.height);
            this.addWindow(this._lockpick_window_1);

            // get images from files
            this.bit_laser_red = create_bitmap("img/pictures/", "laser_red");
            this.bit_laser_blue = create_bitmap("img/pictures/", "laser_blue");
            this.bit_laser_green = create_bitmap("img/pictures/", "laser_green");
            this.bit_laser_yellow = create_bitmap("img/pictures/", "laser_yellow");

            this.bit_sensor_red = create_bitmap("img/pictures/", "sensor_red");
            this.bit_sensor_blue = create_bitmap("img/pictures/", "sensor_blue");
            this.bit_sensor_green = create_bitmap("img/pictures/", "sensor_green");
            this.bit_sensor_yellow = create_bitmap("img/pictures/", "sensor_yellow");

            this.bit_prism = create_bitmap("img/pictures/", "laser_combined");

            this.bit_base = create_bitmap("img/pictures/", "sensor_base");

            this.bit_box_base = create_bitmap("img/pictures/", "box_base");
            this.bit_box_mirror_1 = create_bitmap("img/pictures/", "box_mirror_top_left");
            this.bit_box_mirror_2 = create_bitmap("img/pictures/", "box_mirror_top_right");
            
            this.bit_mirror = create_bitmap("img/pictures/", "mirror");


            // create sprites
            // boxes
            this.left_box = new My_Sprite(this.bit_box_base, ((Graphics.width/2) - 27), 500, 1, 0.5);
            this.addChild(this.left_box);
            this.left_box.opacity = 100;

            this.right_box = new My_Sprite(this.bit_box_base, ((Graphics.width/2) + 27), 500, 0, 0.5);
            this.addChild(this.right_box);
            this.right_box.opacity = 100;

            
            // prism
            this.prism = new My_Sprite(this.bit_prism, Graphics.width/2, 0, 0.5, 0, 1, 1);
            this.prism.opacity = 100;
            this.addChild(this.prism);


            // lasers
            this.laser_1 = new My_Sprite(this.bit_laser_yellow, 100, 0, 0.5, 0, 1, 0.85);
            this.addChild(this.laser_1);

            this.laser_2 = new My_Sprite(this.bit_laser_yellow, 100, 500, 0.5, 1, 1, 1.3);
            this.addChild(this.laser_2);
            this.laser_2.rotation = Math.PI/8;

            this.laser_3 = new My_Sprite(this.bit_laser_yellow, (Graphics.width - 100), 500, 0.5, 1, 1, 1.3);
            this.addChild(this.laser_3);
            this.laser_3.rotation = (-3 * Math.PI/8);

            this.laser_4 = new My_Sprite(this.bit_laser_blue, (Graphics.width - 100), 0, 0.5, 0, 1, 0.85);
            this.addChild(this.laser_4);
            this.laser_4.visible = false;

            this.laser_5 = new My_Sprite(this.bit_laser_blue, (Graphics.width - 100), 500, 0.5, 1, 1, 1.3);
            this.addChild(this.laser_5);
            this.laser_5.rotation = -Math.PI/2;
            this.laser_5.visible = false;

            this.laser_6 = new My_Sprite(this.bit_laser_yellow, ((Graphics.width/2) - 27 - 45), 500, 0.5, 1, 1, 1.3);
            this.addChild(this.laser_6);
            this.laser_6.visible = false;

            this.laser_7 = new My_Sprite(this.bit_laser_blue, ((Graphics.width/2) + 27 + 45), 500, 0.5, 1, 1, 1.3);
            this.addChild(this.laser_7);
            this.laser_7.visible = false;

            this.laser_8 = new My_Sprite(this.bit_laser_green, (Graphics.width/2), 130, 0.5, 0, 1, 1.3);
            this.addChild(this.laser_8);
            this.laser_8.visible = false;


            // base or sensors
            this.base_blue = new My_Sprite(this.bit_base, (Graphics.width - 100), 0, 0.5, 0);
            this.addChild(this.base_blue);


            this.sensor_yellow = new My_Sprite(this.bit_sensor_yellow, (Graphics.width - 100), 0, 0.5, 0);
            this.addChild(this.sensor_yellow);

            this.sensor_blue = new My_Sprite(this.bit_sensor_blue, (Graphics.width * 0.27), 0, 0.5, 0);
            this.addChild(this.sensor_blue);

            this.sensor_green = new My_Sprite(this.bit_sensor_green, (Graphics.width / 2), Graphics.height, 0.5, 0);
            this.addChild(this.sensor_green);
            this.sensor_green.rotation = Math.PI;


            this.base_yellow = new My_Sprite(this.bit_base, 100, 0, 0.5, 0);
            this.addChild(this.base_yellow);

            /*this.base = new My_Sprite(this.bit_base, (Graphics.width / 2), 80, 0.5, 0);
            this.addChild(this.base);
            this.base.opacity = 100;*/

            // mirrors
            /*this.left_pane = new My_Sprite(this.bit_box_mirror_1, ((Graphics.width/2) - 27), 0, 1, 0);
            this.addChild(this.left_pane);
            this.left_pane.opacity = 100;

            this.right_pane = new My_Sprite(this.bit_box_mirror_2, ((Graphics.width/2) + 27), 0, 0, 0);
            this.addChild(this.right_pane);
            this.right_pane.opacity = 100;*/

            this.left_box_mirror = new My_Sprite(this.bit_box_mirror_2, ((Graphics.width/2) - 27), 500, 1, 0.5);
            this.addChild(this.left_box_mirror);
            this.left_box_mirror.visible = false;

            this.right_box_mirror = new My_Sprite(this.bit_box_mirror_1, ((Graphics.width/2) + 27), 500, 0, 0.5);
            this.addChild(this.right_box_mirror);
            this.right_box_mirror.visible = false;

            this.mirror_1 = new My_Sprite(this.bit_mirror, 100, 500);
            this.addChild(this.mirror_1);
            this.mirror_1.rotation = Math.PI/16;

            this.mirror_2 = new My_Sprite(this.bit_mirror, (Graphics.width - 100), 500);
            this.addChild(this.mirror_2);
            this.mirror_2.rotation = -7 * Math.PI/16;
        }

    }
    get_scene_lockpick_1() {
        return this.scene_lockpick_1;
    }
}


class Lockpick_menu_0 {
    constructor() {
        this.init_scene();
    }
    init_scene() {
        function scene_lockpick_0() {
            Scene_MenuBase.prototype.initialize.call(this);
            this.tick = 0;
            this.angle_1 = Math.PI/8;
            this.angle_2 = Math.PI/8;
            this.input_buffer = 0;
            this.mirror_1_square = false;
            this.mirror_2_square = false;
            this.game_finished = false;
            this.counter = 0;
            this.tutorial_counter = 0;
            $gameSwitches.setValue(19, false);
        }
        scene_lockpick_0.prototype = Object.create(Scene_MenuBase.prototype);
        this.scene_lockpick_0 = (scene_lockpick_0.prototype.constructor = scene_lockpick_0);

        this.scene_lockpick_0.prototype.update = function() {
            // frame counter
            this.tick += 1;
            this.tick %= 20;

            if (this.tick == 10) {
                let size = 1.2;
                this.laser_1.scale.x = size;
                this.laser_2.scale.x = size;
                this.laser_3.scale.x = size;
            } else if (this.tick == 0) {
                let size = 1;
                this.laser_1.scale.x = size;
                this.laser_2.scale.x = size;
                this.laser_3.scale.x = size;
            }

            // buffer prevents accidental double_clicks
            if (this.input_buffer > 0) this.input_buffer -= 1;

            // exits scene when esc key is pressed
            if (Input.isTriggered("cancel")) SceneManager.pop();

            if (this.game_finished) {
                this.counter += 1;

                if (this.counter >= 50) {
                    $gameSwitches.setValue(19, true);
                    SceneManager.pop();
                }
            }

            if (!this.game_finished) {

                // base angle
                var angle_unit = Math.PI/8;
                
                let hitbox = 25;
                // if mirror 1 gets clicked
                if ((this.mirror_1.x - hitbox < TouchInput.x) && (TouchInput.x < this.mirror_1.x + hitbox) && 
                (this.mirror_1.y - hitbox < TouchInput.y) && (TouchInput.y < this.mirror_1.y + hitbox) && (this.input_buffer == 0)) {

                    let scale = 1.1;
                    this.mirror_1.scale.x = scale;
                    this.mirror_1.scale.y = scale;

                    if (TouchInput.isReleased()) {
                        // reset buffer to avoid double-clicking
                        this.input_buffer = 10;

                        // resets angle to 0 when angle should be 0 (to prevent overshooting after multiple cycles)
                        if (((this.angle_1 % (5 * angle_unit)) < angle_unit)) this.angle_1 = 0;

                        //angle moves to the next state
                        this.angle_1 = (this.angle_1 % (4 * angle_unit)) + angle_unit;

                        this.mirror_1.rotation = this.angle_1 * 0.5;
                        this.laser_2.rotation = this.angle_1;
                        this.tutorial_counter += 1;
                    }
                } else {
                    let scale = 1;
                    this.mirror_1.scale.x = scale;
                    this.mirror_1.scale.y = scale;
                }

                // if mirror 2 gets clicked
                if ((this.mirror_2.x - hitbox < TouchInput.x) && (TouchInput.x < this.mirror_2.x + hitbox) && 
                (this.mirror_2.y - hitbox < TouchInput.y) && (TouchInput.y < this.mirror_2.y + hitbox) && (this.input_buffer == 0)) {

                    let scale = 1.1;
                    this.mirror_2.scale.x = scale;
                    this.mirror_2.scale.y = scale;

                    if (TouchInput.isReleased()) {

                        // reset buffer to avoid double-clicking
                        this.input_buffer = 10;

                        // resets angle to 0 when angle should be 0 (to prevent overshooting after multiple cycles)
                        if (((this.angle_2 % (5 * angle_unit)) < angle_unit)) this.angle_2 = 0;

                        //angle moves to the next state
                        this.angle_2 = (this.angle_2 % (4 * angle_unit)) + angle_unit;

                        this.mirror_2.rotation = (this.angle_2 * 0.5) - (4 * angle_unit);
                        this.laser_3.rotation = this.angle_2 - (4 * angle_unit);
                        this.tutorial_counter += 1;
                    }
                } else {
                    let scale = 1;
                    this.mirror_2.scale.x = scale;
                    this.mirror_2.scale.y = scale;
                }

                // if mirror 1 is at the correct angle
                if ((this.mirror_1.rotation / angle_unit) == 2) {
                    this.mirror_1_square = true;
                    this.laser_3.visible = true;
                    this.laser_2.scale.y = 1.05;
                } else {
                    this.mirror_1_square = false;
                    this.laser_3.visible = false;
                    this.laser_2.scale.y = 1.5;
                }

                // if mirror 2 is at the correct angle
                if ((this.mirror_2.rotation / angle_unit) == -2){
                    this.mirror_2_square = true;
                } else {
                    this.mirror_2_square = false;
                }

                // detect whether the yellow sensor has been activated
                if (this.mirror_1_square && this.mirror_2_square) {
                    this.game_finished = true;
                }

                if (this.tutorial_counter == 0) {
                    this.tutorial_window = new Window_Lockpick_1(185, 7*Graphics.height/9, Graphics.width - 350, Graphics.height/6);
                    this.tutorial_window.drawTextEx("Click on a \\C[1]mirror\\C[0] to rotate it.", 0, 15);
                    this.addWindow(this.tutorial_window);
                    this.tutorial_counter += 1;
                } else if ((this.tutorial_counter == 1) || (this.tutorial_counter == 4));
                else if (this.tutorial_counter == 3) {
                    this.tutorial_window = new Window_Lockpick_1(150, 10, Graphics.width - 300, Graphics.height/4);
                    this.tutorial_window.drawTextEx("Aim the laser at the \\C[2]\\fbred\\C[0]\\fb sensor\nto activate it. This will unlock\nthis lock.", 10, 10);
                    this.addWindow(this.tutorial_window);
                    this.tutorial_counter += 1;
                } else {
                    this._windowLayer.removeChild(this.tutorial_window);
                }
            }
        }

        this.scene_lockpick_0.prototype.create = function() {
            Scene_MenuBase.prototype.create.call(this);

            // create window
            this._lockpick_window_1 = new Window_Lockpick_1(0, 0, Graphics.width, Graphics.height);
            this.addWindow(this._lockpick_window_1);

            // get images from files
            this.bit_laser_red = create_bitmap("img/pictures/", "laser_red");
            this.bit_sensor_red = create_bitmap("img/pictures/", "sensor_red");
            this.bit_base = create_bitmap("img/pictures/", "sensor_base");
            this.bit_mirror = create_bitmap("img/pictures/", "mirror");


            // create sprites

            // lasers
            this.laser_1 = new My_Sprite(this.bit_laser_red, 100, 0, 0.5, 0, 1, 0.85);
            this._lockpick_window_1.addChild(this.laser_1);

            this.laser_2 = new My_Sprite(this.bit_laser_red, 100, 500, 0.5, 1, 1, 1.3);
            this._lockpick_window_1.addChild(this.laser_2);
            this.laser_2.rotation = Math.PI/8;

            this.laser_3 = new My_Sprite(this.bit_laser_red, (Graphics.width - 100), 500, 0.5, 1, 1, 1.5);
            this._lockpick_window_1.addChild(this.laser_3);
            this.laser_3.rotation = (-3 * Math.PI/8);


            // base or sensors
            this.sensor_yellow = new My_Sprite(this.bit_sensor_red, (Graphics.width - 100), 0, 0.5, 0);
            this._lockpick_window_1.addChild(this.sensor_yellow);


            this.base_yellow = new My_Sprite(this.bit_base, 100, 0, 0.5, 0);
            this._lockpick_window_1.addChild(this.base_yellow);


            this.mirror_1 = new My_Sprite(this.bit_mirror, 100, 500);
            this._lockpick_window_1.addChild(this.mirror_1);
            this.mirror_1.rotation = Math.PI/16;

            this.mirror_2 = new My_Sprite(this.bit_mirror, (Graphics.width - 100), 500);
            this._lockpick_window_1.addChild(this.mirror_2);
            this.mirror_2.rotation = -7 * Math.PI/16;
        }

    }
    get_scene_lockpick_0() {
        return this.scene_lockpick_0;
    }
}



function create_bitmap(folder, filename, hue = 0, extention = ".png", smooth = true) {
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

let lockpick_menu_0 = new Lockpick_menu_0();
let lockpick_menu_1 = new Lockpick_menu_1();

_alias_scene_map_update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
    _alias_scene_map_update.call(this);
    if (Input.isTriggered("lockpick_menu_0")) SceneManager.push(lockpick_menu_0.get_scene_lockpick_0());
    if (Input.isTriggered("lockpick_menu_1")) SceneManager.push(lockpick_menu_1.get_scene_lockpick_1());
}

_alias_custom_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _alias_custom_pluginCommand.call(this, command, args);
    if(command === "LockPick_0") SceneManager.push(lockpick_menu_0.get_scene_lockpick_0());
    if(command === "LockPick_1") SceneManager.push(lockpick_menu_1.get_scene_lockpick_1());
};

TouchInput._onMouseMove = function(event) {
    var x = Graphics.pageToCanvasX(event.pageX);
    var y = Graphics.pageToCanvasY(event.pageY);
    this._onMove(x, y);
};
