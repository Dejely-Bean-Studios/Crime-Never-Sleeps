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
            

            if (this.tick === 0) {
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
            }


            if (TouchInput.isReleased() && (this.mirror_1.x - 100 < TouchInput.x) && (TouchInput.x < this.mirror_1.x + 100) && 
            (this.mirror_1.y - 100 < TouchInput.y) && (TouchInput.y < this.mirror_1.y + 100) && (this.input_buffer == 0)) {
                //console.log("Crystal", "x:", TouchInput.x, this.mirror_1.x, "y:", TouchInput.y, this.mirror_1.y);
                this.input_buffer = 10;

                if ((this.angle_1 % (5 * Math.PI / 8)) < (Math.PI/8)) this.angle_1 = 0;
                
                var angle = ((this.angle_1 += (Math.PI / 8)) % (5 * Math.PI / 8));
                this.mirror_1.rotation = angle;
                this.mirror_1_glow.rotation = angle;
                this.laser_2.rotation = ((this.angle_1 % (5 * Math.PI / 8)) + (Math.PI / 2));
            }

            if (TouchInput.isReleased() && (this.mirror_2.x - 100 < TouchInput.x) && (TouchInput.x < this.mirror_2.x + 100) && 
            (this.mirror_2.y - 100 < TouchInput.y) && (TouchInput.y < this.mirror_2.y + 100) && (this.input_buffer == 0)) {
                //console.log("Crystal", "x:", TouchInput.x, this.mirror_1.x, "y:", TouchInput.y, this.mirror_1.y);
                this.input_buffer = 10;

                if ((this.angle_2 % (5 * Math.PI / 8)) > (-Math.PI/8)) this.angle_2 = 0;

                angle = ((this.angle_2 -= (Math.PI / 8)) % (5 * Math.PI / 8));
                this.mirror_2.rotation = angle;
                this.mirror_2_glow.rotation = angle;
                this.laser_3.rotation = ((this.angle_2 % (5 * Math.PI / 8)) + (Math.PI / 2));
            }

            if ((((Math.PI / 2) - (Math.PI / 12)) < this.angle_1) && (this.angle_1 < ((Math.PI / 2) + (Math.PI / 12)))) {
                this.laser_3.visible = true;
                this.mirror_2_glow.visible = true;
                this.laser_2.scale.x = 0.25;

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
                }

            } else {
                this.laser_3.visible = false;
                this.mirror_2_glow.visible = false;
                this.laser_2.scale.x = 0.3;
            }

            
        }

        this.scene_lockpick_1.prototype.create = function() {
            Scene_MenuBase.prototype.create.call(this);
            //console.log(Graphics.height)
            this._lockpick_window_1 = new Window_Lockpick_1(0, 0, Graphics.width, Graphics.height);
            this.addWindow(this._lockpick_window_1);

            this.bit_laser_1 = create_bitmap("img/pictures/", "laser-0");
            this.bit_laser_2 = create_bitmap("img/pictures/", "laser-1");
            this.bit_laser_3 = create_bitmap("img/pictures/", "laser-2");
            this.bit_laser_4 = create_bitmap("img/pictures/", "laser-3");

            this.bit_mirror = create_bitmap("img/pictures/", "crystal");


            this.laser_1 = new My_Sprite(this.bit_laser_1, 100, 15, 0.9, 0.5, 0.2, 0.2);
            this.addChild(this.laser_1);
            this.laser_1.rotation = (3 * Math.PI / 2);

            this.laser_2 = new My_Sprite(this.bit_laser_1, 100, 500, 0.9, 0.5, 0.3, 0.2);
            this.addChild(this.laser_2);
            this.laser_2.rotation = (Math.PI / 2);

            this.laser_3 = new My_Sprite(this.bit_laser_1, (Graphics.width - 100), 500, 0.9, 0.5, 0.3, 0.2);
            this.addChild(this.laser_3);
            this.laser_3.rotation = (Math.PI / 2);
            this.laser_3.setColorTone([-50, 0, 200, 0]);

            this.mirror_1_glow = new My_Sprite(this.bit_mirror, 100, 500);
            this.addChild(this.mirror_1_glow);
            this.mirror_1_glow.scale.x = 1.1;
            this.mirror_1_glow.scale.y = 1.1;
            this.mirror_1_glow.setColorTone([100, 100, 100, 100]);

            this.mirror_1 = new My_Sprite(this.bit_mirror, 100, 500);
            this.addChild(this.mirror_1);
            
            this.mirror_2_glow = new My_Sprite(this.bit_mirror, (Graphics.width - 100), 500);
            this.addChild(this.mirror_2_glow);
            this.mirror_2_glow.scale.x = 1.1;
            this.mirror_2_glow.scale.y = 1.1;
            this.mirror_2_glow.setColorTone([0, 100, 200, 100]);
            this.mirror_2_glow.visible = false;

            this.mirror_2 = new My_Sprite(this.bit_mirror, (Graphics.width - 100), 500);
            this.addChild(this.mirror_2);
            this.mirror_2.setColorTone([-100, 70, 150, 0]);
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