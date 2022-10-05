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
            this.angle_1 = 0;
            this.angle_2 = 0;
            this.input_buffer = 0;
        }
        Scene_Lockpick_1.prototype = Object.create(Scene_MenuBase.prototype);
        this.scene_lockpick_1 = (Scene_Lockpick_1.prototype.constructor = Scene_Lockpick_1);

        this.scene_lockpick_1.prototype.update = function() {
            this.tick += 1;
            this.tick %= 20;
            if (this.input_buffer > 0) this.input_buffer -= 1;

            if (Input.isTriggered("cancel")) SceneManager.pop();
            

            /*if (this.tick === 0) {
                this.laser_1.bitmap = this.bit_laser_1;
                this.laser_2.bitmap = this.bit_laser_1;
                this.mirror_1_glow.setColorTone([100, 100, 100, 100]);

            } else if (this.tick === 5) {
                this.laser_1.bitmap = this.bit_laser_2;
                this.laser_2.bitmap = this.bit_laser_2;
                this.mirror_1_glow.setColorTone([150, 100, 100, 100]);

            } else if (this.tick === 10) {
                this.laser_1.bitmap = this.bit_laser_3;
                this.laser_2.bitmap = this.bit_laser_3;
                this.mirror_1_glow.setColorTone([250, 150, 100, 100]);

            } else if (this.tick === 15) {
                this.laser_1.bitmap = this.bit_laser_4;
                this.laser_2.bitmap = this.bit_laser_4;
                this.mirror_1_glow.setColorTone([150, 100, 100, 100]);
            }*/


            if (TouchInput.isReleased() && (this.mirror_1.x - 100 < TouchInput.x) && (TouchInput.x < this.mirror_1.x + 100) && 
            (this.mirror_1.y - 100 < TouchInput.y) && (TouchInput.y < this.mirror_1.y + 100) && (this.input_buffer == 0)) {
                //console.log("Crystal", "x:", TouchInput.x, this.mirror_1.x, "y:", TouchInput.y, this.mirror_1.y);
                this.input_buffer = 10;

                if ((this.angle_1 % (5 * Math.PI / 8)) < (Math.PI/8)) this.angle_1 = 0;
                
                var angle = ((this.angle_1 += (Math.PI / 8)) % (5 * Math.PI / 8));
                this.mirror_1.rotation = angle * 0.5;
                //this.mirror_1_glow.rotation = angle * 0.5;
                this.laser_2.rotation = ((this.angle_1 % (5 * Math.PI / 8)));
            }

            if (TouchInput.isReleased() && (this.mirror_2.x - 100 < TouchInput.x) && (TouchInput.x < this.mirror_2.x + 100) && 
            (this.mirror_2.y - 100 < TouchInput.y) && (TouchInput.y < this.mirror_2.y + 100) && (this.input_buffer == 0)) {
                //console.log("Crystal", "x:", TouchInput.x, this.mirror_1.x, "y:", TouchInput.y, this.mirror_1.y);
                this.input_buffer = 10;

                if ((this.angle_2 % (5 * Math.PI / 8)) > (-Math.PI/8)) this.angle_2 = 0;

                angle = ((this.angle_2 -= (Math.PI / 8)) % (5 * Math.PI / 8));
                this.mirror_2.rotation = (angle * 0.5) - (Math.PI/4);
                //this.mirror_2_glow.rotation = angle * 0.5;
                this.laser_3.rotation = ((this.angle_2 % (5 * Math.PI / 8)));
            }

            if ((((Math.PI / 2) - (Math.PI / 12)) < this.angle_1) && (this.angle_1 < ((Math.PI / 2) + (Math.PI / 12)))) {
                this.laser_3.visible = true;
                //this.mirror_2_glow.visible = true;
                this.laser_2.scale.y = 1.05;
                /*
                if (this.tick === 0) {
                    this.laser_3.bitmap = this.bit_laser_1;
                    this.mirror_2_glow.setColorTone([0, 100, 200, 100]);
    
                } else if (this.tick === 5) {
                    this.laser_3.bitmap = this.bit_laser_2;
                    this.mirror_2_glow.setColorTone([100, 100, 100, 100]);
    
                } else if (this.tick === 10) {
                    this.laser_3.bitmap = this.bit_laser_3;
                    this.mirror_2_glow.setColorTone([200, 100, 200, 100]);
    
                } else if (this.tick === 15) {
                    this.laser_3.bitmap = this.bit_laser_4;
                    this.mirror_2_glow.setColorTone([100, 100, 100, 100]);
                }*/

            } else {
                this.laser_3.visible = false;
                //this.mirror_2_glow.visible = false;
                this.laser_2.scale.y = 1.3;
            }

            
        }

        this.scene_lockpick_1.prototype.create = function() {
            Scene_MenuBase.prototype.create.call(this);
            //console.log(Graphics.height)
            this._lockpick_window_1 = new Window_Lockpick_1(0, 0, Graphics.width, Graphics.height);
            this.addWindow(this._lockpick_window_1);

            this.bit_laser_red = create_bitmap("img/pictures/", "laser_red");
            this.bit_laser_blue = create_bitmap("img/pictures/", "laser_blue");
            this.bit_laser_green = create_bitmap("img/pictures/", "laser_green");
            this.bit_laser_yellow = create_bitmap("img/pictures/", "laser_yellow");

            this.bit_sensor_red = create_bitmap("img/pictures/", "sensor_red");
            this.bit_sensor_blue = create_bitmap("img/pictures/", "sensor_blue");
            this.bit_sensor_green = create_bitmap("img/pictures/", "sensor_green");
            this.bit_sensor_yellow = create_bitmap("img/pictures/", "sensor_yellow");

            this.bit_base = create_bitmap("img/pictures/", "sensor_base");

            this.bit_box_base = create_bitmap("img/pictures/", "box_base");
            this.bit_box_mirror_1 = create_bitmap("img/pictures/", "box_mirror_top_left");
            this.bit_box_mirror_2 = create_bitmap("img/pictures/", "box_mirror_top_right");
            

            this.bit_mirror = create_bitmap("img/pictures/", "mirror");


            this.left_box = new My_Sprite(this.bit_box_base, ((Graphics.width/2) - 27), 500, 1, 0.5);
            this.addChild(this.left_box);
            this.left_box.opacity = 100;

            this.right_box = new My_Sprite(this.bit_box_base, ((Graphics.width/2) + 27), 500, 0, 0.5);
            this.addChild(this.right_box);
            this.right_box.opacity = 100;

            
            this.laser_1 = new My_Sprite(this.bit_laser_yellow, 100, 0, 0.5, 0, 1, 0.85);
            this.addChild(this.laser_1);
            //this.laser_1.rotation = (3 * Math.PI / 2);

            this.laser_2 = new My_Sprite(this.bit_laser_yellow, 100, 500, 0.5, 1, 1, 1.3);
            this.addChild(this.laser_2);
            //this.laser_2.rotation = (Math.PI / 2);

            this.laser_3 = new My_Sprite(this.bit_laser_yellow, (Graphics.width - 100), 500, 0.5, 1, 1, 1.3);
            this.addChild(this.laser_3);
            //this.laser_3.rotation = (Math.PI / 2);
            //this.laser_3.setColorTone([-50, 0, 200, 0]);

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

            this.laser_8 = new My_Sprite(this.bit_laser_green, (Graphics.width/2), 89, 0.5, 0, 1, 1.3);
            this.addChild(this.laser_8);
            this.laser_8.visible = false;


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

            this.base = new My_Sprite(this.bit_base, (Graphics.width / 2), 80, 0.5, 0);
            this.addChild(this.base);
            this.base.opacity = 100;


            this.left_pane = new My_Sprite(this.bit_box_mirror_1, ((Graphics.width/2) - 27), 0, 1, 0);
            this.addChild(this.left_pane);
            this.left_pane.opacity = 100;

            this.right_pane = new My_Sprite(this.bit_box_mirror_2, ((Graphics.width/2) + 27), 0, 0, 0);
            this.addChild(this.right_pane);
            this.right_pane.opacity = 100;

            this.left_box_mirror = new My_Sprite(this.bit_box_mirror_2, ((Graphics.width/2) - 27), 500, 1, 0.5);
            this.addChild(this.left_box_mirror);
            this.left_box_mirror.visible = false;

            this.right_box_mirror = new My_Sprite(this.bit_box_mirror_1, ((Graphics.width/2) + 27), 500, 0, 0.5);
            this.addChild(this.right_box_mirror);
            this.right_box_mirror.visible = false;

           /* this.mirror_1_glow = new My_Sprite(this.bit_mirror, 100, 500);
            this.addChild(this.mirror_1_glow);
            this.mirror_1_glow.scale.x = 1.1;
            this.mirror_1_glow.scale.y = 1.1;
            this.mirror_1_glow.setColorTone([100, 100, 100, 100]);*/

            this.mirror_1 = new My_Sprite(this.bit_mirror, 100, 500);
            this.addChild(this.mirror_1);
            
            /*this.mirror_2_glow = new My_Sprite(this.bit_mirror, (Graphics.width - 100), 500);
            this.addChild(this.mirror_2_glow);
            this.mirror_2_glow.rotation = (-Math.PI/4);
            this.mirror_2_glow.scale.x = 1.1;
            this.mirror_2_glow.scale.y = 1.1;
            this.mirror_2_glow.setColorTone([0, 100, 200, 100]);
            this.mirror_2_glow.visible = false;*/

            this.mirror_2 = new My_Sprite(this.bit_mirror, (Graphics.width - 100), 500);
            this.addChild(this.mirror_2);
            this.mirror_2.rotation = (-Math.PI/4);
            //this.mirror_2.setColorTone([-100, 70, 150, 0]);
        }

    }
    get_scene_lockpick_1() {
        return this.scene_lockpick_1;
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
