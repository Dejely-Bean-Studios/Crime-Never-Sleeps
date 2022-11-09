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
 * lockpick_0
 * (for tutorial)
 * 
 * lockpick_1
 * (for appartment puzzle)
 * 
 * lockpick_2
 * 
 * lockpick_3
 * 
 * lockpick_4
 * 
 * lockpick_5
 * 
*/


//Input.keyMapper["76"] = "lockpick_menu_1"; //L
// https://www.geeksforgeeks.org/check-if-two-given-line-segments-intersect/
// Javascript program to check if two given line segments intersect
  
/*class Point
{
    constructor(x, y)
    {
        this.x = x;
            this.y = y;
    }
}*/
  
// Given three collinear points p, q, r, the function checks if
// point q lies on line segment 'pr'
function onSegment(p, q, r)
{
    if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
        q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y))
    return true;
    
    return false;
}
  
// To find orientation of ordered triplet (p, q, r).
// The function returns following values
// 0 --> p, q and r are collinear
// 1 --> Clockwise
// 2 --> Counterclockwise
function Orientation(p, q, r)
{
  
    // See https://www.geeksforgeeks.org/orientation-3-ordered-points/
    // for details of below formula.
    let val = (q.y - p.y) * (r.x - q.x) -
            (q.x - p.x) * (r.y - q.y);
    
    if (val == 0) return 0; // collinear
    
    return (val > 0)? 1: 2; // clock or counterclock wise
}
  
// The main function that returns true if line segment 'p1q1'
// and 'p2q2' intersect.
function doIntersect(p1, q1, p2, q2)
{
  
    // Find the four orientations needed for general and
    // special cases
    let o1 = Orientation(p1, q1, p2);
    let o2 = Orientation(p1, q1, q2);
    let o3 = Orientation(p2, q2, p1);
    let o4 = Orientation(p2, q2, q1);
    
    // General case
    if (o1 != o2 && o3 != o4)
        return true;
    
    // Special Cases
    // p1, q1 and p2 are collinear and p2 lies on segment p1q1
    if (o1 == 0 && onSegment(p1, p2, q1)) return true;
    
    // p1, q1 and q2 are collinear and q2 lies on segment p1q1
    if (o2 == 0 && onSegment(p1, q2, q1)) return true;
    
    // p2, q2 and p1 are collinear and p1 lies on segment p2q2
    if (o3 == 0 && onSegment(p2, p1, q2)) return true;
    
    // p2, q2 and q1 are collinear and q1 lies on segment p2q2
    if (o4 == 0 && onSegment(p2, q1, q2)) return true;
    
    return false; // Doesn't fall in any of the above cases
}

// https://www.geeksforgeeks.org/program-for-point-of-intersection-of-two-lines/
function lineLineIntersection(A,B,C,D){
    // Line AB represented as a1x + b1y = c1
    var a1 = B.y - A.y;
    var b1 = A.x - B.x;
    var c1 = a1*(A.x) + b1*(A.y);
    
    // Line CD represented as a2x + b2y = c2
    var a2 = D.y - C.y;
    var b2 = C.x - D.x;
    var c2 = a2*(C.x)+ b2*(C.y);
    
    var determinant = a1*b2 - a2*b1;

    var x = (b2*c1 - b1*c2)/determinant;
    var y = (a1*c2 - a2*c1)/determinant;
    return new Point(x, y);
}

// https://math.stackexchange.com/questions/190111/how-to-check-if-a-point-is-inside-a-rectangle
function sign(p1, p2, p3){
  return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
}

function PointInTriangle(pt, v1, v2, v3){
  let b1, b2, b3;

  b1 = sign(pt, v1, v2) < 0;
  b2 = sign(pt, v2, v3) < 0;
  b3 = sign(pt, v3, v1) < 0;

  return ((b1 == b2) && (b2 == b3));
}




function in_rectangle (p1, p2, p3, p4) {
    let pos = new Point(TouchInput.x, TouchInput.y);
    return (PointInTriangle(pos, p1, p2, p3) || PointInTriangle(pos, p1, p2, p4) || PointInTriangle(pos, p1, p3, p4) || PointInTriangle(pos, p2, p3, p4));
}

function in_rectangle_sprite(sprite) {
    sprite.update_self();
    let p1 = sprite.point_1, p2 = sprite.point_2, p3, p4;

    let L_1 = (sprite.anchor.x) * sprite.width, L_2 = (1 - sprite.anchor.x) * sprite.width;

    let x = sprite.x + (sprite.anchor.y * sprite.height) * Math.cos(sprite.rotation + (Math.PI/2));
    let y = sprite.y + (sprite.anchor.y * sprite.height) * Math.sin(sprite.rotation + (Math.PI/2));

    x1 = x - (L_1 * Math.cos(sprite.rotation));
    x2 = x + (L_2 * Math.cos(sprite.rotation));
    y1 = y - (L_1 * Math.sin(sprite.rotation));
    y2 = y + (L_2 * Math.sin(sprite.rotation));

    p3 = new Point(x1, y1);
    p4 = new Point(x2, y2);

    //console.log(p1, p2, p3, p4);
    
    return in_rectangle(p1, p2, p3, p4);
}


function create_bitmap(folder, filename, hue = 0, extention = ".png", smooth = true) {
    var path = folder + encodeURIComponent(filename) + extention;
    var bitmap = ImageManager.loadNormalBitmap(path, hue || 0);
    bitmap.smooth = smooth;
    return bitmap;
}

function Window_Lockpick(x, y, width, height) {
    Window_Base.prototype.initialize.call(this, x, y, width, height)
}
Window_Lockpick.prototype = Object.create(Window_Base.prototype);
Window_Lockpick.prototype.constructor = Window_Lockpick;

function sprite(bitmap, x = 0, y = 0, angle = 0, anchor_x = 0.5, anchor_y = 0.5, scale_x = 1, scale_y = 1) {
    Sprite.prototype.initialize.call(this, bitmap);
    this.x = x;
    this.y = y;
    this.angle = angle;
    set_rotation(this, angle);
    this.anchor.x = anchor_x;
    this.anchor.y = anchor_y;
    this.scale.x = scale_x;
    this.scale.y = scale_y;

    this.point_1 = null, this.point_2 = null;

    this.children = [];
}
sprite.prototype = Object.create(Sprite_Button.prototype);
sprite.prototype.constructor = sprite;

sprite.prototype.add_child = function (child){
    this.children.push(child);
}

sprite.prototype.remove_children = function () {
    this.children = [];
}

sprite.prototype.update_self = function () {
    let L_1 = (this.anchor.x) * this.width, L_2 = (1 - this.anchor.x) * this.width;

    let x = this.x + (-this.anchor.y * this.height) * Math.cos(this.rotation + (Math.PI/2));
    let y = this.y + (-this.anchor.y * this.height) * Math.sin(this.rotation + (Math.PI/2));

    x1 = x - (L_1 * Math.cos(this.rotation));
    x2 = x + (L_2 * Math.cos(this.rotation));
    y1 = y - (L_1 * Math.sin(this.rotation));
    y2 = y + (L_2 * Math.sin(this.rotation));

    this.point_1 = new Point(x1, y1);
    this.point_2 = new Point(x2, y2);
}


function sprite_sensor(bitmap_sensor, bitmap_laser, x = 0, y = 0, angle = 0, anchor_x = 0.5, anchor_y = 0, scale_x = 1, scale_y = 1) {
    Sprite.prototype.initialize.call(this, bitmap_sensor);
    this.detect = bitmap_laser;

    this.detected = false;

    this.x = x;
    this.y = y;

    this.angle = angle;
    set_rotation(this, angle);

    this.anchor.x = anchor_x;
    this.anchor.y = anchor_y;
    this.scale.x = scale_x;
    this.scale.y = scale_y;

    this.point_1 = null, this.point_2 = null;
}
sprite_sensor.prototype = Object.create(Sprite_Button.prototype);
sprite_sensor.prototype.constructor = sprite;

sprite_sensor.prototype.update_self = function () {
    let L_1 = (this.anchor.x) * this.width, L_2 = (1 - this.anchor.x) * this.width;

    let x = this.x + (0.5 * this.height) * Math.cos(this.rotation + (Math.PI/2));
    let y = this.y + (0.5 * this.height) * Math.sin(this.rotation + (Math.PI/2));

    x1 = x - (L_1 * Math.cos(this.rotation));
    x2 = x + (L_2 * Math.cos(this.rotation));
    y1 = y - (L_1 * Math.sin(this.rotation));
    y2 = y + (L_2 * Math.sin(this.rotation));

    this.point_1 = new Point(x1, y1);
    this.point_2 = new Point(x2, y2);
}


function Laser_Sprite(bitmap, x = 0, y = 0, angle = 0, scale_y = 1, anchor_x = 0, anchor_y = 0.5) {
    Sprite.prototype.initialize.call(this, bitmap);
    this.x = x;
    this.y = y;
    this.angle = angle;
    set_rotation(this, angle);

    this.anchor.x = anchor_x;
    this.anchor.y = anchor_y;

    x1 = x - (anchor_x * this.width);
    y1 = y;

    this.point_1 = new Point(x1, y1);

    this.update_self();
    this.scale.y = scale_y;

    this.children = [];
}
Laser_Sprite.prototype = Object.create(Sprite_Button.prototype);
Laser_Sprite.prototype.constructor = Laser_Sprite;

Laser_Sprite.prototype.update_self = function(point = null){
    let arr = scale_x_laser(this, point);
    this.scale.x = arr[0], this.L = arr[1], this.point_2 = arr[2];
}

Laser_Sprite.prototype.add_child = function (child){
    this.children.push(child);
}

Laser_Sprite.prototype.remove_children = function () {
    this.children = [];
}

function set_rotation (sprite, angle) {
    angle_temp = angle % (2*Math.PI);
    //if (angle_temp < 0) angle_temp += 2*Math.PI;
    sprite.angle = angle_temp;

    sprite.rotation = (2*Math.PI - sprite.angle);
}

function scale_x_laser (sprite, point_2 = null) {
    let point_1 = sprite.point_1;
    let x2;
    let y2;
    let L;

    if (point_2 == null) {
        x2 = 0;
        let length_1 = (x2 - point_1.x) / Math.cos(sprite.rotation);
        length_1 = (length_1 > 0) ? length_1 : Infinity;

        x2 = Graphics.width;
        let length_2 = (x2 - point_1.x) / Math.cos(sprite.rotation);
        length_2 = (length_2 > 0) ? length_2 : Infinity;

        y2 = 0;
        let length_3 = (y2 - point_1.y) / Math.sin(sprite.rotation);
        length_3 = (length_3 > 0) ? length_3 : Infinity;

        y2 = Graphics.height;
        let length_4 = (y2 - point_1.y) / Math.sin(sprite.rotation);
        length_4 = (length_4 > 0) ? length_4 : Infinity;

        L = Math.min(length_1, length_2, length_3, length_4);

        if (L == length_1) {
            x2 = 0;
            y2 = point_1.y + (L * Math.sin(sprite.rotation));
        } else if (L == length_2) {
            x2 = Graphics.width;
            y2 = point_1.y + (L * Math.sin(sprite.rotation));
        } else if (L == length_3) {
            x2 = point_1.x + (L * Math.cos(sprite.rotation));
            y2 = 0;
        } else {
            x2 = point_1.x + (L * Math.cos(sprite.rotation));
            y2 = Graphics.height;
        }

        point_2 = new Point(x2, y2);

    } else {
        L = (point_2.x - point_1.x) / Math.cos(sprite.rotation);
    }

    let scale = Math.sqrt(Math.pow((point_2.x - point_1.x), 2) + Math.pow((point_2.y - point_1.y), 2)) / sprite.width;

    return [scale, L, point_2];
}

function get_reflection(laser, mirror) {
    let normal = mirror.angle + (Math.PI / 2);
    let angle;

    mirror.update_self();
    if ((laser.y < Math.max(mirror.point_1.y, mirror.point_2.y)) || (laser.x > Math.min(mirror.point_1.x, mirror.point_2.x))) angle = (Math.PI + normal) - laser.angle;
    else angle = (2*Math.PI) + normal - laser.angle;

    let reflection = normal + angle;

    //console.log(mirror.angle/Math.PI, laser.angle/Math.PI, normal/Math.PI, angle/Math.PI, reflection/Math.PI);

    return reflection;
}

function laser_intersect(laser, sprite) {
    let A = laser.point_1, B = laser.point_2;
    let C = sprite.point_1, D = sprite.point_2;

    return doIntersect(A, B, C, D);
}

function laser_intersect_with_points(laser, p1, p2) {
    let A = laser.point_1, B = laser.point_2;

    return doIntersect(A, B, p1, p2);
}

function laser_intersection_point(laser, sprite) {
    let A = laser.point_1, B = laser.point_2;
    let C = sprite.point_1, D = sprite.point_2;

    return lineLineIntersection(A, B, C, D);
}

function laser_intersection_point_with_points (laser, p1, p2) {
    let A = laser.point_1, B = laser.point_2;

    return lineLineIntersection(A, B, p1, p2);
}



class Lockpick_menu_10 {
    constructor() {
        this.init_scene();
    }
    init_scene() {
        function Scene_Lockpick() {
            Scene_MenuBase.prototype.initialize.call(this);
            this.tick = 0;
            this.game_finished = false;
            this.counter = 0;
            $gameSwitches.setValue(51, false);
        };
        Scene_Lockpick.prototype = Object.create(Scene_MenuBase.prototype);
        this.scene_lockpick = (Scene_Lockpick.prototype.constructor = Scene_Lockpick);

        this.scene_lockpick.prototype.update = function() {
            // frame counter
            this.tick += 1;
            this.tick %= 20;

            if (this.tick == 10) {
                let size = 1.1;
                this.lasers.forEach(laser => {
                    this.laser_rescale_y(laser, size);
                });
                //this.laser_1.scale.x = size;
            } else if (this.tick == 0) {
                let size = 1;
                this.lasers.forEach(laser => {
                    this.laser_rescale_y(laser, size);
                });
                //this.laser_1.scale.x = size;
            }

            // exits scene when esc key is pressed
            if (Input.isTriggered("cancel")) SceneManager.pop();

            if (this.game_finished) {
                this.counter += 1;

                if (this.counter >= 100) {
                    $gameSwitches.setValue(51, true);
                    SceneManager.pop();
                }
            } else {

                // rotate mirrors
                let step = Math.PI/16;
                this.rotate_mirror(this.mirror_2, step, -6*Math.PI/16, -2*Math.PI/16);
                this.rotate_mirror(this.mirror_3, step, 0, 6*Math.PI/16);
                
                // update mirrors
                this.mirrors.forEach(mirror => {
                    mirror.update_self();
                });

                // update lasers
                this.lasers.forEach(laser => {
                    this.update_laser(laser);
                });

                // update sensors
                this.sensors.forEach(sensor => {
                    sensor.update_self();
                    this.update_sensor(sensor);
                });

                if(this.sensor_blue.detected) {
                    this.game_finished = true;

                    this.mirrors.forEach(mirror => {
                        mirror.scale.x = 1;
                        mirror.children.forEach(child => {
                            child.visible = false;
                        });
                    });
                }
            }
            //console.log(this.laser_1.scale.x);
        };

        this.scene_lockpick.prototype.create = function() {
            Scene_MenuBase.prototype.create.call(this);

            // create window
            this._lockpick_window_0 = new Window_Lockpick(0, 0, Graphics.width, Graphics.height);
            this.addWindow(this._lockpick_window_0);

            this.tutorial_window = new Window_Lockpick(8, 7, Graphics.width/2 - 10, 145);
            this.tutorial_window.drawTextEx("\\fs[20]Mirrors deflect \\C[12]lasers\\C[0]. Click on a\n\\fi\\fs[21]pivoting mirror\\fi\\fs[20] to rotate it. Reach\nthe \\C[12]colour sensor\\C[0] at the end to pick\nthe lock.", -1, -7);
            this.addWindow(this.tutorial_window);

            this.start_window = new Window_Lockpick(12, 247, 93, 55);
            this.start_window.drawTextEx("\\fs[23]\\C[3]START", -1, -7);
            this.addWindow(this.start_window);

            this.end_window = new Window_Lockpick(Graphics.width - 210, 30, 70, 55);
            this.end_window.drawTextEx("\\fs[23]\\C[10]E\\C[10]N\\C[10]D", -1, -7);
            this.addWindow(this.end_window);

            // get images from files
            this.bit_laser_red = create_bitmap("img/pictures/", "laser_red_h");
            this.bit_laser_blue = create_bitmap("img/pictures/", "laser_blue_h");
            this.bit_laser_green = create_bitmap("img/pictures/", "laser_green_h");
            this.bit_laser_yellow = create_bitmap("img/pictures/", "laser_yellow_h");

            this.bit_sensor_red = create_bitmap("img/pictures/", "sensor_red");
            this.bit_sensor_blue = create_bitmap("img/pictures/", "sensor_blue");
            this.bit_sensor_green = create_bitmap("img/pictures/", "sensor_green");
            this.bit_sensor_yellow = create_bitmap("img/pictures/", "sensor_yellow");

            this.bit_prism = create_bitmap("img/pictures/", "laser_combined");

            this.bit_base = create_bitmap("img/pictures/", "sensor_base");

            this.bit_box_base = create_bitmap("img/pictures/", "box_base");
            this.bit_box_mirror = create_bitmap("img/pictures/", "box_mirror_2");
            //his.bit_box_mirror_2 = create_bitmap("img/pictures/", "box_mirror");
            
            this.bit_mirror = create_bitmap("img/pictures/", "mirror");
            this.bit_arrow_left = create_bitmap("img/pictures/", "arrow_left");
            this.bit_arrow_right = create_bitmap("img/pictures/", "arrow_right");


            // create sprites
            // lasers
            this.lasers = [];
            this.laser_1 = new Laser_Sprite(this.bit_laser_blue, 0, 200, 0*Math.PI/2);
            this._lockpick_window_0.addChild(this.laser_1);
            this.lasers.push(this.laser_1);

            // base or sensors
            this.sensors = [];
            this.sensor_blue = new sprite_sensor(this.bit_sensor_blue, this.bit_laser_blue, (Graphics.width - 101.5), 0);
            //this.sensor_red = new sprite(this.bit_sensor_red, (Graphics.width - 100), 0, 0, 0.5, 0);
            this._lockpick_window_0.addChild(this.sensor_blue);
            this.sensors.push(this.sensor_blue);

            this.base_blue = new sprite(this.bit_base, 0, 200, Math.PI/2, 0.5, 0);
            this._lockpick_window_0.addChild(this.base_blue);

            // mirrors
            this.mirrors = [];

            let angle_1 = 3*Math.PI/4;//-Math.PI/4;
            this.mirror_1 = new sprite(this.bit_box_mirror, 150, 200, angle_1);
            this._lockpick_window_0.addChild(this.mirror_1);
            this.mirrors.push(this.mirror_1);
            this.box = new sprite(this.bit_box_base, this.mirror_1.x, this.mirror_1.y, this.mirror_1.angle - Math.PI/4);
            this._lockpick_window_0.addChildAt(this.box, this._lockpick_window_0.children.indexOf(this.laser_1));
            this.box.opacity = 120;
            this.box.scale.x = 1.1;
            this.box.scale.y = 1.1;


            let angle_2 = -2*Math.PI/16;//2*Math.PI/5;
            this.mirror_2 = new sprite(this.bit_mirror, 130, 490, angle_2);
            this._lockpick_window_0.addChild(this.mirror_2);
            this.mirrors.push(this.mirror_2);

            this.add_child(this.mirror_2, new sprite(this.bit_arrow_right, this.mirror_2.x, this.mirror_2.y, this.mirror_2.angle, 0, 0.5));
            this.add_child(this.mirror_2, new sprite(this.bit_arrow_left, this.mirror_2.x, this.mirror_2.y, this.mirror_2.angle, 1, 0.5));

            let angle_3 = 6*Math.PI/16;//2*Math.PI/5;
            this.mirror_3 = new sprite(this.bit_mirror, (Graphics.width - 100), 500, angle_3);
            this._lockpick_window_0.addChild(this.mirror_3);
            this.mirrors.push(this.mirror_3);

            this.add_child(this.mirror_3, new sprite(this.bit_arrow_right, this.mirror_3.x, this.mirror_3.y, this.mirror_3.angle, 0, 0.5));
            this.add_child(this.mirror_3, new sprite(this.bit_arrow_left, this.mirror_3.x, this.mirror_3.y, this.mirror_3.angle, 1, 0.5));
        };

        this.scene_lockpick.prototype.update_laser = function(laser, object = null) {
            laser.update_self();
    
            for (let i = 0; i < this.mirrors.length; i++) {
                this.mirrors[i].update_self();
                if (this.mirrors[i] != object) {

                    if (laser_intersect(laser, this.mirrors[i])) {
                        //console.log(1);
                        let point = laser_intersection_point(laser, this.mirrors[i]);
                        //console.log(point);
                        let arr = scale_x_laser(laser, point);
                        let scale_temp = arr[0], L_temp = arr[1];
        
                        if (scale_temp < laser.scale.x) {
                            laser.scale.x = scale_temp;
                            laser.L = L_temp;
                            laser.point_2 = point;

                            let angle = get_reflection(laser, this.mirrors[i]);
                            //console.log(angle/Math.PI);
                            let child = new Laser_Sprite(laser.bitmap, laser.point_2.x, laser.point_2.y, angle);
                            this.add_child(laser, child);
                            this.update_laser(child, this.mirrors[i]);

                        } else {
                            this.remove_children(laser);
                        }
                    }
                }
            }
        }

        this.scene_lockpick.prototype.add_child = function (laser, child) {
            laser.add_child(child);
            let index = this._lockpick_window_0.children.indexOf(laser) + 1;
            this._lockpick_window_0.addChildAt(child, index);
        }

        this.scene_lockpick.prototype.remove_children = function (laser) {
            for (let i = 0; i < laser.children.length; i++) {
                this.remove_children(laser.children[i]);
                this._lockpick_window_0.removeChild(laser.children[i]);
            }

            laser.remove_children();
        }

        this.scene_lockpick.prototype.laser_rescale_y = function (laser, scale) {
            laser.scale.y = scale;
            laser.children.forEach(child => {
                this.laser_rescale_y(child, scale);
            });
        }

        this.scene_lockpick.prototype.rotate_mirror = function (mirror, step, min, max) {
            let left = mirror.children[0], right = mirror.children[1];

            if (in_rectangle_sprite(left)) {
                left.visible = true;
                right.visible = false;
                mirror.scale.x = 1.1;

                if (TouchInput.isTriggered()) {
                    let angle = Math.max(mirror.angle - step, min);

                    set_rotation(left, angle);
                    set_rotation(right, angle);
                    set_rotation(mirror, angle);

                    this.lasers.forEach(laser => {
                        this.remove_children(laser);
                    });
                }

            } else if (in_rectangle_sprite(right)) {
                left.visible = false;
                right.visible = true;
                mirror.scale.x = 1.1;

                if (TouchInput.isTriggered()) {
                    let angle = Math.min(mirror.angle + step, max);

                    set_rotation(left, angle);
                    set_rotation(right, angle);
                    set_rotation(mirror, angle);

                    this.lasers.forEach(laser => {
                        this.remove_children(laser);
                    });
                }

            } else {
                left.visible = false;
                right.visible = false;
                mirror.scale.x = 1;
            }
        }

        this.scene_lockpick.prototype.update_sensor = function (sensor) {
            for (let i = 0; i < this.lasers.length; i++) {
                if (this.sensor_laser_intersect(sensor, this.lasers[i]) == true) break;
                else sensor.detected = false;
            }
        }

        this.scene_lockpick.prototype.sensor_laser_intersect = function (sensor, laser) {
            //console.log(laser);
            if ((sensor.detect == laser.bitmap) && laser_intersect(laser, sensor)) {
                sensor.detected = true;
                return true;

            } else {
                for (let i = 0; i < laser.children.length; i++) {
                    //console.log(laser.children, i);
                    if (this.sensor_laser_intersect(sensor, laser.children[i])) return true;
                }

                return false;
            }
        }
    }
    
    get_scene_lockpick() {
        return this.scene_lockpick;
    }
}

class Lockpick_menu_11 {
    constructor() {
        this.init_scene();
    }
    init_scene() {
        function Scene_Lockpick_1() {
            Scene_MenuBase.prototype.initialize.call(this);
            this.tick = 0;
            this.game_finished = false;
            this.counter = 0;
            $gameSwitches.setValue(52, false);
        };
        Scene_Lockpick_1.prototype = Object.create(Scene_MenuBase.prototype);
        this.scene_lockpick = (Scene_Lockpick_1.prototype.constructor = Scene_Lockpick_1);

        this.scene_lockpick.prototype.update = function() {
            // frame counter
            this.tick += 1;
            this.tick %= 20;

            if (this.tick == 10) {
                let size = 1.1;
                this.lasers.forEach(laser => {
                    this.laser_rescale_y(laser, size);
                });
                //this.laser_1.scale.x = size;
            } else if (this.tick == 0) {
                let size = 1;
                this.lasers.forEach(laser => {
                    this.laser_rescale_y(laser, size);
                });
                //this.laser_1.scale.x = size;
            }

            // exits scene when esc key is pressed
            if (Input.isTriggered("cancel")) SceneManager.pop();

            if (this.game_finished) {
                this.counter += 1;

                if (this.counter >= 100) {
                    $gameSwitches.setValue(52, true);
                    SceneManager.pop();
                }
            } else {

                // rotate mirrors
                let step = Math.PI/16;
                this.rotate_mirror(this.mirror_2, step, -6*Math.PI/16, -2*Math.PI/16);
                this.rotate_mirror(this.mirror_3, step, 0, 6*Math.PI/16);
                
                // update mirrors
                this.mirrors.forEach(mirror => {
                    mirror.update_self();
                });

                // update lasers
                this.lasers.forEach(laser => {
                    this.update_laser(laser);
                });

                // update sensors
                this.sensors.forEach(sensor => {
                    sensor.update_self();
                    this.update_sensor(sensor);
                });

                if(this.sensor_yellow.detected) {
                    this.game_finished = true;

                    this.mirrors.forEach(mirror => {
                        mirror.scale.x = 1;
                        mirror.children.forEach(child => {
                            child.visible = false;
                        });
                    });
                }
            }
            //console.log(this.laser_1.scale.x);
        };

        this.scene_lockpick.prototype.create = function() {
            Scene_MenuBase.prototype.create.call(this);

            // create window
            this._lockpick_window_0 = new Window_Lockpick(0, 0, Graphics.width, Graphics.height);
            this.addWindow(this._lockpick_window_0);

            // get images from files
            this.bit_laser_red = create_bitmap("img/pictures/", "laser_red_h");
            this.bit_laser_blue = create_bitmap("img/pictures/", "laser_blue_h");
            this.bit_laser_green = create_bitmap("img/pictures/", "laser_green_h");
            this.bit_laser_yellow = create_bitmap("img/pictures/", "laser_yellow_h");

            this.bit_sensor_red = create_bitmap("img/pictures/", "sensor_red");
            this.bit_sensor_blue = create_bitmap("img/pictures/", "sensor_blue");
            this.bit_sensor_green = create_bitmap("img/pictures/", "sensor_green");
            this.bit_sensor_yellow = create_bitmap("img/pictures/", "sensor_yellow");

            this.bit_prism = create_bitmap("img/pictures/", "laser_combined");

            this.bit_base = create_bitmap("img/pictures/", "sensor_base");

            this.bit_box_base = create_bitmap("img/pictures/", "box_base");
            this.bit_box_mirror = create_bitmap("img/pictures/", "box_mirror_2");
            //his.bit_box_mirror_2 = create_bitmap("img/pictures/", "box_mirror");
            
            this.bit_mirror = create_bitmap("img/pictures/", "mirror");
            this.bit_arrow_left = create_bitmap("img/pictures/", "arrow_left");
            this.bit_arrow_right = create_bitmap("img/pictures/", "arrow_right");


            // create sprites
            // lasers
            this.lasers = [];
            this.laser_1 = new Laser_Sprite(this.bit_laser_yellow, 0, 100, 0*Math.PI/2);
            this._lockpick_window_0.addChild(this.laser_1);
            this.lasers.push(this.laser_1);

            // base or sensors
            this.sensors = [];
            this.sensor_yellow = new sprite_sensor(this.bit_sensor_yellow, this.bit_laser_yellow, (Graphics.width), 124, -Math.PI/2);
            //this.sensor_red = new sprite(this.bit_sensor_red, (Graphics.width - 100), 0, 0, 0.5, 0);
            this._lockpick_window_0.addChild(this.sensor_yellow);
            this.sensors.push(this.sensor_yellow);

            this.base_yellow = new sprite(this.bit_base, 0, 100, Math.PI/2, 0.5, 0);
            this._lockpick_window_0.addChild(this.base_yellow);

            // mirrors
            this.mirrors = [];

            let angle_1 = 3*Math.PI/4;//-Math.PI/4;
            this.mirror_1 = new sprite(this.bit_box_mirror, 150, 100, angle_1);
            this._lockpick_window_0.addChild(this.mirror_1);
            this.mirrors.push(this.mirror_1);
            this.box = new sprite(this.bit_box_base, this.mirror_1.x, this.mirror_1.y, this.mirror_1.angle - Math.PI/4);
            this._lockpick_window_0.addChildAt(this.box, this._lockpick_window_0.children.indexOf(this.laser_1));
            this.box.opacity = 120;
            this.box.scale.x = 1.1;
            this.box.scale.y = 1.1;

            let angle_4 = -3*Math.PI/4 + Math.PI/8;
            this.mirror_4 = new sprite(this.bit_box_mirror, 260, 100, angle_4);
            this._lockpick_window_0.addChild(this.mirror_4);
            this.mirrors.push(this.mirror_4);
            this.box = new sprite(this.bit_box_base, this.mirror_4.x, this.mirror_4.y, this.mirror_4.angle - Math.PI/4);
            this._lockpick_window_0.addChildAt(this.box, this._lockpick_window_0.children.indexOf(this.laser_1));
            this.box.opacity = 120;
            this.box.scale.x = 1.1;
            this.box.scale.y = 1.1;


            let angle_2 = -2*Math.PI/16;//2*Math.PI/5;
            this.mirror_2 = new sprite(this.bit_mirror, 130, 490, angle_2);
            this._lockpick_window_0.addChild(this.mirror_2);
            this.mirrors.push(this.mirror_2);

            this.add_child(this.mirror_2, new sprite(this.bit_arrow_right, this.mirror_2.x, this.mirror_2.y, this.mirror_2.angle, 0, 0.5));
            this.add_child(this.mirror_2, new sprite(this.bit_arrow_left, this.mirror_2.x, this.mirror_2.y, this.mirror_2.angle, 1, 0.5));

            let angle_3 = 1*Math.PI/16;//2*Math.PI/5;
            this.mirror_3 = new sprite(this.bit_mirror, (Graphics.width - 200), 500, angle_3);
            this._lockpick_window_0.addChild(this.mirror_3);
            this.mirrors.push(this.mirror_3);

            this.add_child(this.mirror_3, new sprite(this.bit_arrow_right, this.mirror_3.x, this.mirror_3.y, this.mirror_3.angle, 0, 0.5));
            this.add_child(this.mirror_3, new sprite(this.bit_arrow_left, this.mirror_3.x, this.mirror_3.y, this.mirror_3.angle, 1, 0.5));
        };

        this.scene_lockpick.prototype.update_laser = function(laser, object = null) {
            laser.update_self();
    
            for (let i = 0; i < this.mirrors.length; i++) {
                this.mirrors[i].update_self();
                if (this.mirrors[i] != object) {

                    if (laser_intersect(laser, this.mirrors[i])) {
                        //console.log(1);
                        let point = laser_intersection_point(laser, this.mirrors[i]);
                        //console.log(point);
                        let arr = scale_x_laser(laser, point);
                        let scale_temp = arr[0], L_temp = arr[1];
        
                        if (scale_temp < laser.scale.x) {
                            laser.scale.x = scale_temp;
                            laser.L = L_temp;
                            laser.point_2 = point;
                            //console.log(point);

                            let angle = get_reflection(laser, this.mirrors[i]);
                            //if (this.mirrors[i] == this.mirror_4) angle = angle ;//- Math.PI;
                            //console.log(angle/Math.PI);
                            let child = new Laser_Sprite(laser.bitmap, laser.point_2.x, laser.point_2.y, angle);
                            this.add_child(laser, child);
                            this.update_laser(child, this.mirrors[i]);

                        } else {
                            this.remove_children(laser);
                        }
                    }
                }
            }
        }

        this.scene_lockpick.prototype.add_child = function (laser, child) {
            laser.add_child(child);
            let index = this._lockpick_window_0.children.indexOf(laser) + 1;
            this._lockpick_window_0.addChildAt(child, index);
        }

        this.scene_lockpick.prototype.remove_children = function (laser) {
            for (let i = 0; i < laser.children.length; i++) {
                this.remove_children(laser.children[i]);
                this._lockpick_window_0.removeChild(laser.children[i]);
            }

            laser.remove_children();
        }

        this.scene_lockpick.prototype.laser_rescale_y = function (laser, scale) {
            laser.scale.y = scale;
            laser.children.forEach(child => {
                this.laser_rescale_y(child, scale);
            });
        }

        this.scene_lockpick.prototype.rotate_mirror = function (mirror, step, min, max) {
            let left = mirror.children[0], right = mirror.children[1];

            if (in_rectangle_sprite(left)) {
                left.visible = true;
                right.visible = false;
                mirror.scale.x = 1.1;

                if (TouchInput.isTriggered()) {
                    let angle = Math.max(mirror.angle - step, min);

                    set_rotation(left, angle);
                    set_rotation(right, angle);
                    set_rotation(mirror, angle);

                    this.lasers.forEach(laser => {
                        this.remove_children(laser);
                    });
                }

            } else if (in_rectangle_sprite(right)) {
                left.visible = false;
                right.visible = true;
                mirror.scale.x = 1.1;

                if (TouchInput.isTriggered()) {
                    let angle = Math.min(mirror.angle + step, max);

                    set_rotation(left, angle);
                    set_rotation(right, angle);
                    set_rotation(mirror, angle);

                    this.lasers.forEach(laser => {
                        this.remove_children(laser);
                    });
                }

            } else {
                left.visible = false;
                right.visible = false;
                mirror.scale.x = 1;
            }
        }

        this.scene_lockpick.prototype.update_sensor = function (sensor) {
            for (let i = 0; i < this.lasers.length; i++) {
                if (this.sensor_laser_intersect(sensor, this.lasers[i]) == true) break;
                else sensor.detected = false;
            }
        }

        this.scene_lockpick.prototype.sensor_laser_intersect = function (sensor, laser) {
            //console.log(laser);
            if ((sensor.detect == laser.bitmap) && laser_intersect(laser, sensor)) {
                sensor.detected = true;
                return true;

            } else {
                for (let i = 0; i < laser.children.length; i++) {
                    //console.log(laser.children, i);
                    if (this.sensor_laser_intersect(sensor, laser.children[i])) return true;
                }

                return false;
            }
        }
    }
    
    get_scene_lockpick() {
        return this.scene_lockpick;
    }
}

class Lockpick_menu_12 {
    constructor() {
        this.init_scene();
    }
    init_scene() {
        function Scene_Lockpick_2() {
            Scene_MenuBase.prototype.initialize.call(this);
            this.tick = 0;
            this.game_finished = false;
            this.counter = 0;
            $gameSwitches.setValue(53, false);
        };
        Scene_Lockpick_2.prototype = Object.create(Scene_MenuBase.prototype);
        this.scene_lockpick = (Scene_Lockpick_2.prototype.constructor = Scene_Lockpick_2);


        this.scene_lockpick.prototype.update = function() {
            if (TouchInput.isTriggered()) console.log(TouchInput.x, TouchInput.y);

            // frame counter
            this.tick += 1;
            this.tick %= 20;

            if (this.tick == 10) {
                let size = 1.1;
                this.lasers.forEach(laser => {
                    this.laser_rescale_y(laser, size);
                });
                //this.laser_1.scale.x = size;
            } else if (this.tick == 0) {
                let size = 1;
                this.lasers.forEach(laser => {
                    this.laser_rescale_y(laser, size);
                });
                //this.laser_1.scale.x = size;
            }

            // exits scene when esc key is pressed
            if (Input.isTriggered("cancel")) SceneManager.pop();

            if (this.game_finished) {
                this.counter += 1;

                if (this.counter >= 100) {
                    $gameSwitches.setValue(53, true);
                    SceneManager.pop();
                }
            } else {

                // rotate mirrors
                let step = Math.PI/16;
                this.rotate_mirror(this.mirror_1, step, 7*Math.PI/16, 14*Math.PI/16);
                this.rotate_mirror(this.mirror_2, step, 4*Math.PI/16, 9*Math.PI/16);
                this.rotate_mirror(this.mirror_3, step, -21*Math.PI/32, -11*Math.PI/32);
                this.rotate_mirror(this.mirror_4, step, -37*Math.PI/32, -29*Math.PI/32);
                
                // update mirrors
                this.mirrors.forEach(mirror => {
                    mirror.update_self();
                });

                // update lasers
                this.lasers.forEach(laser => {
                    this.update_laser(laser);
                });

                // update sensors
                this.sensors.forEach(sensor => {
                    sensor.update_self();
                    this.update_sensor(sensor);
                });

                if(this.sensor.detected) {
                    this.game_finished = true;

                    this.mirrors.forEach(mirror => {
                        mirror.scale.x = 1;
                        mirror.children.forEach(child => {
                            child.visible = false;
                        });
                    });
                }
            }
            //console.log(this.laser_1.scale.x);
        };

        this.scene_lockpick.prototype.create = function() {
            Scene_MenuBase.prototype.create.call(this);

            // create window
            this._lockpick_window_0 = new Window_Lockpick(0, 0, Graphics.width, Graphics.height);
            this.addWindow(this._lockpick_window_0);

            // get images from files
            this.bit_laser_red = create_bitmap("img/pictures/", "laser_red_h");
            this.bit_laser_blue = create_bitmap("img/pictures/", "laser_blue_h");
            this.bit_laser_green = create_bitmap("img/pictures/", "laser_green_h");
            this.bit_laser_yellow = create_bitmap("img/pictures/", "laser_yellow_h");

            this.bit_sensor_red = create_bitmap("img/pictures/", "sensor_red");
            this.bit_sensor_blue = create_bitmap("img/pictures/", "sensor_blue");
            this.bit_sensor_green = create_bitmap("img/pictures/", "sensor_green");
            this.bit_sensor_yellow = create_bitmap("img/pictures/", "sensor_yellow");

            this.bit_prism = create_bitmap("img/pictures/", "laser_combined");

            this.bit_base = create_bitmap("img/pictures/", "sensor_base");

            this.bit_box_base = create_bitmap("img/pictures/", "box_base");
            this.bit_box_mirror = create_bitmap("img/pictures/", "box_mirror_2");
            //his.bit_box_mirror_2 = create_bitmap("img/pictures/", "box_mirror");
            
            this.bit_mirror = create_bitmap("img/pictures/", "mirror");
            this.bit_arrow_left = create_bitmap("img/pictures/", "arrow_left");
            this.bit_arrow_right = create_bitmap("img/pictures/", "arrow_right");


            // create sprites
            // lasers
            this.lasers = [];
            this.laser_1 = new Laser_Sprite(this.bit_laser_green, 0, 100, 0*Math.PI/2);
            this._lockpick_window_0.addChild(this.laser_1);
            this.lasers.push(this.laser_1);

            // base or sensors
            this.sensors = [];
            this.sensor = new sprite_sensor(this.bit_sensor_green, this.bit_laser_green, 32, Graphics.height, Math.PI);
            //this.sensor_red = new sprite(this.bit_sensor_red, (Graphics.width - 100), 0, 0, 0.5, 0);
            this._lockpick_window_0.addChild(this.sensor);
            this.sensors.push(this.sensor);

            this.base = new sprite(this.bit_base, 0, 100, Math.PI/2, 0.5, 0);
            this._lockpick_window_0.addChild(this.base);

            // mirrors
            this.mirrors = [];

            let angle_1 = 9*Math.PI/16;//2*Math.PI/5;
            this.mirror_1 = new sprite(this.bit_mirror, Graphics.width - 150, this.laser_1.y - 10, angle_1);
            this._lockpick_window_0.addChild(this.mirror_1);
            this.mirrors.push(this.mirror_1);

            this.add_child(this.mirror_1, new sprite(this.bit_arrow_right, this.mirror_1.x, this.mirror_1.y, this.mirror_1.angle, 0, 0.5));
            this.add_child(this.mirror_1, new sprite(this.bit_arrow_left, this.mirror_1.x, this.mirror_1.y, this.mirror_1.angle, 1, 0.5));



            let angle_2 = Math.PI/4;
            this.mirror_2 = new sprite(this.bit_mirror, Graphics.width - 50, 345, angle_2);
            this._lockpick_window_0.addChild(this.mirror_2);
            this.mirrors.push(this.mirror_2);

            this.add_child(this.mirror_2, new sprite(this.bit_arrow_right, this.mirror_2.x, this.mirror_2.y, this.mirror_2.angle, 0, 0.5));
            this.add_child(this.mirror_2, new sprite(this.bit_arrow_left, this.mirror_2.x, this.mirror_2.y, this.mirror_2.angle, 1, 0.5));

            let angle_3 = -19*Math.PI/32;//2*Math.PI/5;
            this.mirror_3 = new sprite(this.bit_mirror, 50, 346, angle_3);
            this._lockpick_window_0.addChild(this.mirror_3);
            this.mirrors.push(this.mirror_3);

            this.add_child(this.mirror_3, new sprite(this.bit_arrow_right, this.mirror_3.x, this.mirror_3.y, this.mirror_3.angle, 0, 0.5));
            this.add_child(this.mirror_3, new sprite(this.bit_arrow_left, this.mirror_3.x, this.mirror_3.y, this.mirror_3.angle, 1, 0.5));


            let angle_4 = -31*Math.PI/32;//2*Math.PI/5;
            this.mirror_4 = new sprite(this.bit_mirror, 257, 31, angle_4);
            this._lockpick_window_0.addChild(this.mirror_4);
            this.mirrors.push(this.mirror_4);

            this.add_child(this.mirror_4, new sprite(this.bit_arrow_right, this.mirror_4.x, this.mirror_4.y, this.mirror_4.angle, 0, 0.5));
            this.add_child(this.mirror_4, new sprite(this.bit_arrow_left, this.mirror_4.x, this.mirror_4.y, this.mirror_4.angle, 1, 0.5));
        };

        this.scene_lockpick.prototype.update_laser = function(laser, object = null) {
            laser.update_self();
    
            for (let i = 0; i < this.mirrors.length; i++) {
                this.mirrors[i].update_self();
                if (this.mirrors[i] != object) {

                    if (laser_intersect(laser, this.mirrors[i])) {
                        //console.log(1);
                        let point = laser_intersection_point(laser, this.mirrors[i]);
                        //console.log(point);
                        let arr = scale_x_laser(laser, point);
                        let scale_temp = arr[0], L_temp = arr[1];
        
                        if (scale_temp < laser.scale.x) {
                            laser.scale.x = scale_temp;
                            laser.L = L_temp;
                            laser.point_2 = point;
                            //console.log(point);

                            let angle = get_reflection(laser, this.mirrors[i]);
                            if (this.mirrors[i] == this.mirror_4) angle = angle + Math.PI;
                            //console.log(angle/Math.PI);
                            let child = new Laser_Sprite(laser.bitmap, laser.point_2.x, laser.point_2.y, angle);
                            this.add_child(laser, child);
                            this.update_laser(child, this.mirrors[i]);

                        } else {
                            this.remove_children(laser);
                        }
                    }
                }
            }
        }

        this.scene_lockpick.prototype.add_child = function (laser, child) {
            laser.add_child(child);
            let index = this._lockpick_window_0.children.indexOf(laser) + 1;
            this._lockpick_window_0.addChildAt(child, index);
        }

        this.scene_lockpick.prototype.remove_children = function (laser) {
            for (let i = 0; i < laser.children.length; i++) {
                this.remove_children(laser.children[i]);
                this._lockpick_window_0.removeChild(laser.children[i]);
            }

            laser.remove_children();
        }

        this.scene_lockpick.prototype.laser_rescale_y = function (laser, scale) {
            laser.scale.y = scale;
            laser.children.forEach(child => {
                this.laser_rescale_y(child, scale);
            });
        }

        this.scene_lockpick.prototype.rotate_mirror = function (mirror, step, min, max) {
            let left = mirror.children[0], right = mirror.children[1];

            if (in_rectangle_sprite(left)) {
                left.visible = true;
                right.visible = false;
                mirror.scale.x = 1.1;

                if (TouchInput.isTriggered()) {
                    let angle = Math.max(mirror.angle - step, min);

                    set_rotation(left, angle);
                    set_rotation(right, angle);
                    set_rotation(mirror, angle);

                    this.lasers.forEach(laser => {
                        this.remove_children(laser);
                    });
                }

            } else if (in_rectangle_sprite(right)) {
                left.visible = false;
                right.visible = true;
                mirror.scale.x = 1.1;

                if (TouchInput.isTriggered()) {
                    let angle = Math.min(mirror.angle + step, max);

                    set_rotation(left, angle);
                    set_rotation(right, angle);
                    set_rotation(mirror, angle);

                    this.lasers.forEach(laser => {
                        this.remove_children(laser);
                    });
                }

            } else {
                left.visible = false;
                right.visible = false;
                mirror.scale.x = 1;
            }
        }

        this.scene_lockpick.prototype.update_sensor = function (sensor) {
            for (let i = 0; i < this.lasers.length; i++) {
                if (this.sensor_laser_intersect(sensor, this.lasers[i]) == true) break;
                else sensor.detected = false;
            }
        }

        this.scene_lockpick.prototype.sensor_laser_intersect = function (sensor, laser) {
            //console.log(laser);
            if ((sensor.detect == laser.bitmap) && laser_intersect(laser, sensor)) {
                sensor.detected = true;
                return true;

            } else {
                for (let i = 0; i < laser.children.length; i++) {
                    //console.log(laser.children, i);
                    if (this.sensor_laser_intersect(sensor, laser.children[i])) return true;
                }

                return false;
            }
        }
    }
    
    get_scene_lockpick() {
        return this.scene_lockpick;
    }
}


class Lockpick_menu_13 {
    constructor() {
        this.init_scene();
    }
    init_scene() {
        function Scene_Lockpick_3() {
            Scene_MenuBase.prototype.initialize.call(this);
            this.tick = 0;
            this.game_finished = false;
            this.counter = 0;
            $gameSwitches.setValue(54, false);
        };
        Scene_Lockpick_3.prototype = Object.create(Scene_MenuBase.prototype);
        this.scene_lockpick = (Scene_Lockpick_3.prototype.constructor = Scene_Lockpick_3);


        this.scene_lockpick.prototype.update = function() {
            if (TouchInput.isTriggered()) console.log(TouchInput.x, TouchInput.y);

            // frame counter
            this.tick += 1;
            this.tick %= 20;

            if (this.tick == 10) {
                let size = 1.1;
                this.lasers.forEach(laser => {
                    this.laser_rescale_y(laser, size);
                });
                //this.laser_1.scale.x = size;
            } else if (this.tick == 0) {
                let size = 1;
                this.lasers.forEach(laser => {
                    this.laser_rescale_y(laser, size);
                });
                //this.laser_1.scale.x = size;
            }

            // exits scene when esc key is pressed
            if (Input.isTriggered("cancel")) SceneManager.pop();

            if (this.game_finished) {
                this.counter += 1;

                if (this.counter >= 100) {
                    $gameSwitches.setValue(54, true);
                    SceneManager.pop();
                }
            } else {

                // rotate mirrors
                let step = Math.PI/32;
                this.rotate_mirror(this.mirror_1, step, -4*Math.PI/32, 4*Math.PI/32);
                this.rotate_mirror(this.mirror_2, step, 12*Math.PI/32, 20*Math.PI/32);
                //this.rotate_mirror(this.mirror_3, step, -21*Math.PI/32, -11*Math.PI/32);
                //this.rotate_mirror(this.mirror_4, step, -37*Math.PI/32, -29*Math.PI/32);
                
                // update mirrors
                this.mirrors.forEach(mirror => {
                    mirror.update_self();
                });

                // update lasers
                this.lasers.forEach(laser => {
                    this.update_laser(laser);
                });

                // update sensors
                this.sensors.forEach(sensor => {
                    sensor.update_self();
                    this.update_sensor(sensor);
                });

                if(this.sensor_1.detected && this.sensor_2.detected) {
                    this.game_finished = true;

                    this.mirrors.forEach(mirror => {
                        mirror.scale.x = 1;
                        mirror.children.forEach(child => {
                            child.visible = false;
                        });
                    });
                }
            }
            //console.log(this.laser_1.scale.x);
        };

        this.scene_lockpick.prototype.create = function() {
            Scene_MenuBase.prototype.create.call(this);

            // create window
            this._lockpick_window_0 = new Window_Lockpick(0, 0, Graphics.width, Graphics.height);
            this.addWindow(this._lockpick_window_0);

            // get images from files
            this.bit_laser_red = create_bitmap("img/pictures/", "laser_red_h");
            this.bit_laser_blue = create_bitmap("img/pictures/", "laser_blue_h");
            this.bit_laser_green = create_bitmap("img/pictures/", "laser_green_h");
            this.bit_laser_yellow = create_bitmap("img/pictures/", "laser_yellow_h");

            this.bit_sensor_red = create_bitmap("img/pictures/", "sensor_red");
            this.bit_sensor_blue = create_bitmap("img/pictures/", "sensor_blue");
            this.bit_sensor_green = create_bitmap("img/pictures/", "sensor_green");
            this.bit_sensor_yellow = create_bitmap("img/pictures/", "sensor_yellow");

            this.bit_prism = create_bitmap("img/pictures/", "laser_combined");

            this.bit_base = create_bitmap("img/pictures/", "sensor_base");

            this.bit_box_base = create_bitmap("img/pictures/", "box_base");
            this.bit_box_mirror = create_bitmap("img/pictures/", "box_mirror_2");
            //his.bit_box_mirror_2 = create_bitmap("img/pictures/", "box_mirror");
            
            this.bit_mirror = create_bitmap("img/pictures/", "mirror");
            this.bit_arrow_left = create_bitmap("img/pictures/", "arrow_left");
            this.bit_arrow_right = create_bitmap("img/pictures/", "arrow_right");


            // create sprites
            // lasers
            this.lasers = [];
            this.laser_1 = new Laser_Sprite(this.bit_laser_yellow, Graphics.width/2 - 50, 0, -1*Math.PI/2);
            this._lockpick_window_0.addChild(this.laser_1);
            this.lasers.push(this.laser_1);

            this.laser_2 = new Laser_Sprite(this.bit_laser_green, 0, 350, 0);
            this._lockpick_window_0.addChild(this.laser_2);
            this.lasers.push(this.laser_2);

            // base or sensors
            this.sensors = [];
            this.sensor_1 = new sprite_sensor(this.bit_sensor_yellow, this.bit_laser_yellow, Graphics.width, 120, -Math.PI/2);
            this._lockpick_window_0.addChild(this.sensor_1);
            this.sensors.push(this.sensor_1);

            this.sensor_2 = new sprite_sensor(this.bit_sensor_green, this.bit_laser_green, 80, 0, 0);
            this._lockpick_window_0.addChild(this.sensor_2);
            this.sensors.push(this.sensor_2);

            this.base_1 = new sprite(this.bit_base, this.laser_1.x, this.laser_1.y, 0, 0.5, 0);
            this._lockpick_window_0.addChild(this.base_1);

            this.base_2 = new sprite(this.bit_base, this.laser_2.x, this.laser_2.y, Math.PI/2, 0.5, 0);
            this._lockpick_window_0.addChild(this.base_2);


            // mirrors
            this.mirrors = [];
            let angle_1 = 0;
            this.mirror_1 = new sprite(this.bit_mirror, Graphics.width/2 - 50, Graphics.height - 40, angle_1);
            this._lockpick_window_0.addChild(this.mirror_1);
            this.mirrors.push(this.mirror_1);

            this.add_child(this.mirror_1, new sprite(this.bit_arrow_right, this.mirror_1.x, this.mirror_1.y, this.mirror_1.angle, 0, 0.5));
            this.add_child(this.mirror_1, new sprite(this.bit_arrow_left, this.mirror_1.x, this.mirror_1.y, this.mirror_1.angle, 1, 0.5));



            let angle_2 = 16*Math.PI/32;
            this.mirror_2 = new sprite(this.bit_mirror, Graphics.width - 40, 350, angle_2);
            this._lockpick_window_0.addChild(this.mirror_2);
            this.mirrors.push(this.mirror_2);

            this.add_child(this.mirror_2, new sprite(this.bit_arrow_right, this.mirror_2.x, this.mirror_2.y, this.mirror_2.angle, 0, 0.5));
            this.add_child(this.mirror_2, new sprite(this.bit_arrow_left, this.mirror_2.x, this.mirror_2.y, this.mirror_2.angle, 1, 0.5));

            /*let angle_3 = -19*Math.PI/32;//2*Math.PI/5;
            this.mirror_3 = new sprite(this.bit_mirror, 50, 346, angle_3);
            this._lockpick_window_0.addChild(this.mirror_3);
            this.mirrors.push(this.mirror_3);

            this.add_child(this.mirror_3, new sprite(this.bit_arrow_right, this.mirror_3.x, this.mirror_3.y, this.mirror_3.angle, 0, 0.5));
            this.add_child(this.mirror_3, new sprite(this.bit_arrow_left, this.mirror_3.x, this.mirror_3.y, this.mirror_3.angle, 1, 0.5));


            let angle_4 = -31*Math.PI/32;//2*Math.PI/5;
            this.mirror_4 = new sprite(this.bit_mirror, 257, 31, angle_4);
            this._lockpick_window_0.addChild(this.mirror_4);
            this.mirrors.push(this.mirror_4);

            this.add_child(this.mirror_4, new sprite(this.bit_arrow_right, this.mirror_4.x, this.mirror_4.y, this.mirror_4.angle, 0, 0.5));
            this.add_child(this.mirror_4, new sprite(this.bit_arrow_left, this.mirror_4.x, this.mirror_4.y, this.mirror_4.angle, 1, 0.5));*/
        };

        this.scene_lockpick.prototype.update_laser = function(laser, object = null) {
            laser.update_self();
    
            for (let i = 0; i < this.mirrors.length; i++) {
                this.mirrors[i].update_self();
                if (this.mirrors[i] != object) {

                    if (laser_intersect(laser, this.mirrors[i])) {
                        //console.log(1);
                        let point = laser_intersection_point(laser, this.mirrors[i]);
                        //console.log(point);
                        let arr = scale_x_laser(laser, point);
                        let scale_temp = arr[0], L_temp = arr[1];
        
                        if (scale_temp < laser.scale.x) {
                            laser.scale.x = scale_temp;
                            laser.L = L_temp;
                            laser.point_2 = point;
                            //console.log(point);
                            //this.remove_children(laser);

                            let angle = get_reflection(laser, this.mirrors[i]);
                            if (this.mirrors[i] == this.mirror_4) angle = angle + Math.PI;
                            //console.log(angle/Math.PI);
                            let child = new Laser_Sprite(laser.bitmap, laser.point_2.x, laser.point_2.y, angle);
                            this.add_child(laser, child);
                            this.update_laser(child, this.mirrors[i]);

                        } else {
                            this.remove_children(laser);
                        }
                    }
                }
            }
        }

        this.scene_lockpick.prototype.add_child = function (laser, child) {
            laser.add_child(child);
            let index = this._lockpick_window_0.children.indexOf(laser) + 1;
            this._lockpick_window_0.addChildAt(child, index);
        }

        this.scene_lockpick.prototype.remove_children = function (laser) {
            for (let i = 0; i < laser.children.length; i++) {
                this.remove_children(laser.children[i]);
                this._lockpick_window_0.removeChild(laser.children[i]);
            }

            laser.remove_children();
        }

        this.scene_lockpick.prototype.laser_rescale_y = function (laser, scale) {
            laser.scale.y = scale;
            laser.children.forEach(child => {
                this.laser_rescale_y(child, scale);
            });
        }

        this.scene_lockpick.prototype.rotate_mirror = function (mirror, step, min, max) {
            let left = mirror.children[0], right = mirror.children[1];

            if (in_rectangle_sprite(left)) {
                left.visible = true;
                right.visible = false;
                mirror.scale.x = 1.1;

                if (TouchInput.isTriggered()) {
                    let angle = Math.max(mirror.angle - step, min);

                    set_rotation(left, angle);
                    set_rotation(right, angle);
                    set_rotation(mirror, angle);

                    this.lasers.forEach(laser => {
                        this.remove_children(laser);
                    });
                }

            } else if (in_rectangle_sprite(right)) {
                left.visible = false;
                right.visible = true;
                mirror.scale.x = 1.1;

                if (TouchInput.isTriggered()) {
                    let angle = Math.min(mirror.angle + step, max);

                    set_rotation(left, angle);
                    set_rotation(right, angle);
                    set_rotation(mirror, angle);

                    this.lasers.forEach(laser => {
                        this.remove_children(laser);
                    });
                }

            } else {
                left.visible = false;
                right.visible = false;
                mirror.scale.x = 1;
            }
        }

        this.scene_lockpick.prototype.update_sensor = function (sensor) {
            for (let i = 0; i < this.lasers.length; i++) {
                if (this.sensor_laser_intersect(sensor, this.lasers[i]) == true) break;
                else sensor.detected = false;
            }
        }

        this.scene_lockpick.prototype.sensor_laser_intersect = function (sensor, laser) {
            //console.log(laser);
            if ((sensor.detect == laser.bitmap) && laser_intersect(laser, sensor)) {
                sensor.detected = true;
                return true;

            } else {
                for (let i = 0; i < laser.children.length; i++) {
                    //console.log(laser.children, i);
                    if (this.sensor_laser_intersect(sensor, laser.children[i])) return true;
                }

                return false;
            }
        }
    }
    
    get_scene_lockpick() {
        return this.scene_lockpick;
    }
}

class Lockpick_menu_14 {
    constructor() {
        this.init_scene();
    }
    init_scene() {
        function Scene_Lockpick_4() {
            Scene_MenuBase.prototype.initialize.call(this);
            this.tick = 0;
            this.game_finished = false;
            this.counter = 0;
            $gameSwitches.setValue(55, false);
        };
        Scene_Lockpick_4.prototype = Object.create(Scene_MenuBase.prototype);
        this.scene_lockpick = (Scene_Lockpick_4.prototype.constructor = Scene_Lockpick_4);


        this.scene_lockpick.prototype.update = function() {
            if (TouchInput.isTriggered()) console.log(TouchInput.x, TouchInput.y);

            // frame counter
            this.tick += 1;
            this.tick %= 20;

            if (this.tick == 10) {
                let size = 1.1;
                this.lasers.forEach(laser => {
                    this.laser_rescale_y(laser, size);
                });
                //this.laser_1.scale.x = size;
            } else if (this.tick == 0) {
                let size = 1;
                this.lasers.forEach(laser => {
                    this.laser_rescale_y(laser, size);
                });
                //this.laser_1.scale.x = size;
            }

            // exits scene when esc key is pressed
            if (Input.isTriggered("cancel")) SceneManager.pop();

            if (this.game_finished) {
                this.counter += 1;

                if (this.counter >= 100) {
                    $gameSwitches.setValue(55, true);
                    SceneManager.pop();
                }
            } else {

                // rotate mirrors
                let step = Math.PI/32;
                this.rotate_mirror(this.mirror_1, step, -4*Math.PI/32, 4*Math.PI/32);
                this.rotate_mirror(this.mirror_2, step, 12*Math.PI/32, 20*Math.PI/32);
                //this.rotate_mirror(this.mirror_3, step, -21*Math.PI/32, -11*Math.PI/32);
                //this.rotate_mirror(this.mirror_4, step, -37*Math.PI/32, -29*Math.PI/32);
                
                // update mirrors
                this.mirrors.forEach(mirror => {
                    mirror.update_self();
                });

                // update lasers
                this.lasers.forEach(laser => {
                    this.update_laser(laser);
                });

                // update sensors
                this.sensors.forEach(sensor => {
                    sensor.update_self();
                    this.update_sensor(sensor);
                });

                if(this.sensor_1.detected && this.sensor_2.detected) {
                    this.game_finished = true;

                    this.mirrors.forEach(mirror => {
                        mirror.scale.x = 1;
                        mirror.children.forEach(child => {
                            child.visible = false;
                        });
                    });
                }
            }
            //console.log(this.laser_1.scale.x);
        };

        this.scene_lockpick.prototype.create = function() {
            Scene_MenuBase.prototype.create.call(this);

            // create window
            this._lockpick_window_0 = new Window_Lockpick(0, 0, Graphics.width, Graphics.height);
            this.addWindow(this._lockpick_window_0);

            // get images from files
            this.bit_laser_red = create_bitmap("img/pictures/", "laser_red_h");
            this.bit_laser_blue = create_bitmap("img/pictures/", "laser_blue_h");
            this.bit_laser_green = create_bitmap("img/pictures/", "laser_green_h");
            this.bit_laser_yellow = create_bitmap("img/pictures/", "laser_yellow_h");

            this.bit_sensor_red = create_bitmap("img/pictures/", "sensor_red");
            this.bit_sensor_blue = create_bitmap("img/pictures/", "sensor_blue");
            this.bit_sensor_green = create_bitmap("img/pictures/", "sensor_green");
            this.bit_sensor_yellow = create_bitmap("img/pictures/", "sensor_yellow");

            this.bit_prism = create_bitmap("img/pictures/", "laser_combined");

            this.bit_base = create_bitmap("img/pictures/", "sensor_base");

            this.bit_box_base = create_bitmap("img/pictures/", "box_base");
            this.bit_box_mirror = create_bitmap("img/pictures/", "box_mirror_2");
            //his.bit_box_mirror_2 = create_bitmap("img/pictures/", "box_mirror");
            
            this.bit_mirror = create_bitmap("img/pictures/", "mirror");
            this.bit_arrow_left = create_bitmap("img/pictures/", "arrow_left");
            this.bit_arrow_right = create_bitmap("img/pictures/", "arrow_right");


            // create sprites
            // lasers
            this.lasers = [];
            this.laser_1 = new Laser_Sprite(this.bit_laser_yellow, Graphics.width/2 - 50, 0, -1*Math.PI/2);
            this._lockpick_window_0.addChild(this.laser_1);
            this.lasers.push(this.laser_1);

            this.laser_2 = new Laser_Sprite(this.bit_laser_green, 0, 350, 0);
            this._lockpick_window_0.addChild(this.laser_2);
            this.lasers.push(this.laser_2);

            // base or sensors
            this.sensors = [];
            this.sensor_1 = new sprite_sensor(this.bit_sensor_yellow, this.bit_laser_yellow, 463, 0, 0);
            this._lockpick_window_0.addChild(this.sensor_1);
            this.sensors.push(this.sensor_1);

            this.sensor_2 = new sprite_sensor(this.bit_sensor_green, this.bit_laser_green, 0, 160, Math.PI/2);
            this._lockpick_window_0.addChild(this.sensor_2);
            this.sensors.push(this.sensor_2);

            this.base_1 = new sprite(this.bit_base, this.laser_1.x, this.laser_1.y, 0, 0.5, 0);
            this._lockpick_window_0.addChild(this.base_1);

            this.base_2 = new sprite(this.bit_base, this.laser_2.x, this.laser_2.y, Math.PI/2, 0.5, 0);
            this._lockpick_window_0.addChild(this.base_2);


            // mirrors
            this.mirrors = [];
            let angle_1 = 0;
            this.mirror_1 = new sprite(this.bit_mirror, Graphics.width/2 - 50, Graphics.height - 40, angle_1);
            this._lockpick_window_0.addChild(this.mirror_1);
            this.mirrors.push(this.mirror_1);

            this.add_child(this.mirror_1, new sprite(this.bit_arrow_right, this.mirror_1.x, this.mirror_1.y, this.mirror_1.angle, 0, 0.5));
            this.add_child(this.mirror_1, new sprite(this.bit_arrow_left, this.mirror_1.x, this.mirror_1.y, this.mirror_1.angle, 1, 0.5));



            let angle_2 = 16*Math.PI/32;
            this.mirror_2 = new sprite(this.bit_mirror, Graphics.width - 40, 350, angle_2);
            this._lockpick_window_0.addChild(this.mirror_2);
            this.mirrors.push(this.mirror_2);

            this.add_child(this.mirror_2, new sprite(this.bit_arrow_right, this.mirror_2.x, this.mirror_2.y, this.mirror_2.angle, 0, 0.5));
            this.add_child(this.mirror_2, new sprite(this.bit_arrow_left, this.mirror_2.x, this.mirror_2.y, this.mirror_2.angle, 1, 0.5));

            /*let angle_3 = -19*Math.PI/32;//2*Math.PI/5;
            this.mirror_3 = new sprite(this.bit_mirror, 50, 346, angle_3);
            this._lockpick_window_0.addChild(this.mirror_3);
            this.mirrors.push(this.mirror_3);

            this.add_child(this.mirror_3, new sprite(this.bit_arrow_right, this.mirror_3.x, this.mirror_3.y, this.mirror_3.angle, 0, 0.5));
            this.add_child(this.mirror_3, new sprite(this.bit_arrow_left, this.mirror_3.x, this.mirror_3.y, this.mirror_3.angle, 1, 0.5));


            let angle_4 = -31*Math.PI/32;//2*Math.PI/5;
            this.mirror_4 = new sprite(this.bit_mirror, 257, 31, angle_4);
            this._lockpick_window_0.addChild(this.mirror_4);
            this.mirrors.push(this.mirror_4);

            this.add_child(this.mirror_4, new sprite(this.bit_arrow_right, this.mirror_4.x, this.mirror_4.y, this.mirror_4.angle, 0, 0.5));
            this.add_child(this.mirror_4, new sprite(this.bit_arrow_left, this.mirror_4.x, this.mirror_4.y, this.mirror_4.angle, 1, 0.5));*/
        };

        this.scene_lockpick.prototype.update_laser = function(laser, object = null) {
            laser.update_self();
    
            for (let i = 0; i < this.mirrors.length; i++) {
                this.mirrors[i].update_self();
                if (this.mirrors[i] != object) {

                    if (laser_intersect(laser, this.mirrors[i])) {
                        //console.log(1);
                        let point = laser_intersection_point(laser, this.mirrors[i]);
                        //console.log(point);
                        let arr = scale_x_laser(laser, point);
                        let scale_temp = arr[0], L_temp = arr[1];
        
                        if (scale_temp < laser.scale.x) {
                            laser.scale.x = scale_temp;
                            laser.L = L_temp;
                            laser.point_2 = point;
                            //console.log(point);
                            //this.remove_children(laser);

                            let angle = get_reflection(laser, this.mirrors[i]);
                            if (this.mirrors[i] == this.mirror_4) angle = angle + Math.PI;
                            //console.log(angle/Math.PI);
                            let child = new Laser_Sprite(laser.bitmap, laser.point_2.x, laser.point_2.y, angle);
                            this.add_child(laser, child);
                            this.update_laser(child, this.mirrors[i]);

                        } else {
                            this.remove_children(laser);
                        }
                    }
                }
            }
        }

        this.scene_lockpick.prototype.add_child = function (laser, child) {
            laser.add_child(child);
            let index = this._lockpick_window_0.children.indexOf(laser) + 1;
            this._lockpick_window_0.addChildAt(child, index);
        }

        this.scene_lockpick.prototype.remove_children = function (laser) {
            for (let i = 0; i < laser.children.length; i++) {
                this.remove_children(laser.children[i]);
                this._lockpick_window_0.removeChild(laser.children[i]);
            }

            laser.remove_children();
        }

        this.scene_lockpick.prototype.laser_rescale_y = function (laser, scale) {
            laser.scale.y = scale;
            laser.children.forEach(child => {
                this.laser_rescale_y(child, scale);
            });
        }

        this.scene_lockpick.prototype.rotate_mirror = function (mirror, step, min, max) {
            let left = mirror.children[0], right = mirror.children[1];

            if (in_rectangle_sprite(left)) {
                left.visible = true;
                right.visible = false;
                mirror.scale.x = 1.1;

                if (TouchInput.isTriggered()) {
                    let angle = Math.max(mirror.angle - step, min);

                    set_rotation(left, angle);
                    set_rotation(right, angle);
                    set_rotation(mirror, angle);

                    this.lasers.forEach(laser => {
                        this.remove_children(laser);
                    });
                }

            } else if (in_rectangle_sprite(right)) {
                left.visible = false;
                right.visible = true;
                mirror.scale.x = 1.1;

                if (TouchInput.isTriggered()) {
                    let angle = Math.min(mirror.angle + step, max);

                    set_rotation(left, angle);
                    set_rotation(right, angle);
                    set_rotation(mirror, angle);

                    this.lasers.forEach(laser => {
                        this.remove_children(laser);
                    });
                }

            } else {
                left.visible = false;
                right.visible = false;
                mirror.scale.x = 1;
            }
        }

        this.scene_lockpick.prototype.update_sensor = function (sensor) {
            for (let i = 0; i < this.lasers.length; i++) {
                if (this.sensor_laser_intersect(sensor, this.lasers[i]) == true) break;
                else sensor.detected = false;
            }
        }

        this.scene_lockpick.prototype.sensor_laser_intersect = function (sensor, laser) {
            //console.log(laser);
            if ((sensor.detect == laser.bitmap) && laser_intersect(laser, sensor)) {
                sensor.detected = true;
                return true;

            } else {
                for (let i = 0; i < laser.children.length; i++) {
                    //console.log(laser.children, i);
                    if (this.sensor_laser_intersect(sensor, laser.children[i])) return true;
                }

                return false;
            }
        }
    }
    
    get_scene_lockpick() {
        return this.scene_lockpick;
    }
}

class Lockpick_menu_15 {
    constructor() {
        this.init_scene();
    }
    init_scene() {
        function Scene_Lockpick_5() {
            Scene_MenuBase.prototype.initialize.call(this);
            this.tick = 0;
            this.game_finished = false;
            this.counter = 0;
            $gameSwitches.setValue(59, false);
        };
        Scene_Lockpick_5.prototype = Object.create(Scene_MenuBase.prototype);
        this.scene_lockpick = (Scene_Lockpick_5.prototype.constructor = Scene_Lockpick_5);


        this.scene_lockpick.prototype.update = function() {
            if (TouchInput.isTriggered()) console.log(TouchInput.x, TouchInput.y);

            // frame counter
            this.tick += 1;
            this.tick %= 20;

            if (this.tick == 10) {
                let size = 1.1;
                this.lasers.forEach(laser => {
                    this.laser_rescale_y(laser, size);
                });
                //this.laser_1.scale.x = size;
            } else if (this.tick == 0) {
                let size = 1;
                this.lasers.forEach(laser => {
                    this.laser_rescale_y(laser, size);
                });
                //this.laser_1.scale.x = size;
            }

            // exits scene when esc key is pressed
            if (Input.isTriggered("cancel")) SceneManager.pop();

            if (this.game_finished) {
                this.counter += 1;

                if (this.counter >= 100) {
                    $gameSwitches.setValue(59, true);
                    SceneManager.pop();
                }
            } else {

                // rotate mirrors
                let step = Math.PI/32;
                this.rotate_mirror(this.mirror_1, step, 28*Math.PI/32, 36*Math.PI/32);
                this.rotate_mirror(this.mirror_2, step, 12*Math.PI/32, 20*Math.PI/32);
                //this.rotate_mirror(this.mirror_3, step, -21*Math.PI/32, -11*Math.PI/32);
                //this.rotate_mirror(this.mirror_4, step, -37*Math.PI/32, -29*Math.PI/32);
                
                // update mirrors
                this.mirrors.forEach(mirror => {
                    mirror.update_self();
                });

                // update lasers
                this.lasers.forEach(laser => {
                    this.update_laser(laser);
                });

                // update sensors
                this.sensors.forEach(sensor => {
                    sensor.update_self();
                    this.update_sensor(sensor);
                });

                if(this.sensor_1.detected && this.sensor_2.detected) {
                    this.game_finished = true;

                    this.mirrors.forEach(mirror => {
                        mirror.scale.x = 1;
                        mirror.children.forEach(child => {
                            child.visible = false;
                        });
                    });
                }
            }
            //console.log(this.laser_1.scale.x);
        };

        this.scene_lockpick.prototype.create = function() {
            Scene_MenuBase.prototype.create.call(this);

            // create window
            this._lockpick_window_0 = new Window_Lockpick(0, 0, Graphics.width, Graphics.height);
            this.addWindow(this._lockpick_window_0);

            // get images from files
            this.bit_laser_red = create_bitmap("img/pictures/", "laser_red_h");
            this.bit_laser_blue = create_bitmap("img/pictures/", "laser_blue_h");
            this.bit_laser_green = create_bitmap("img/pictures/", "laser_green_h");
            this.bit_laser_yellow = create_bitmap("img/pictures/", "laser_yellow_h");

            this.bit_sensor_red = create_bitmap("img/pictures/", "sensor_red");
            this.bit_sensor_blue = create_bitmap("img/pictures/", "sensor_blue");
            this.bit_sensor_green = create_bitmap("img/pictures/", "sensor_green");
            this.bit_sensor_yellow = create_bitmap("img/pictures/", "sensor_yellow");

            this.bit_prism = create_bitmap("img/pictures/", "laser_combined");

            this.bit_base = create_bitmap("img/pictures/", "sensor_base");

            this.bit_box_base = create_bitmap("img/pictures/", "box_base");
            this.bit_box_mirror = create_bitmap("img/pictures/", "box_mirror_2");
            //his.bit_box_mirror_2 = create_bitmap("img/pictures/", "box_mirror");
            
            this.bit_mirror = create_bitmap("img/pictures/", "mirror");
            this.bit_arrow_left = create_bitmap("img/pictures/", "arrow_left");
            this.bit_arrow_right = create_bitmap("img/pictures/", "arrow_right");


            // create sprites
            // lasers
            this.lasers = [];
            this.laser_1 = new Laser_Sprite(this.bit_laser_red, Graphics.width/2 - 50, 0, -1*Math.PI/2);
            this._lockpick_window_0.addChild(this.laser_1);
            this.lasers.push(this.laser_1);

            this.laser_2 = new Laser_Sprite(this.bit_laser_blue, Graphics.width, 350, 2*Math.PI/2);
            this._lockpick_window_0.addChild(this.laser_2);
            this.lasers.push(this.laser_2);

            // base or sensors
            this.sensors = [];
            this.sensor_1 = new sprite_sensor(this.bit_sensor_red, this.bit_laser_red, 0, 507, Math.PI/2);
            this._lockpick_window_0.addChild(this.sensor_1);
            this.sensors.push(this.sensor_1);

            this.sensor_2 = new sprite_sensor(this.bit_sensor_blue, this.bit_laser_blue, 565, Graphics.height, Math.PI);
            this._lockpick_window_0.addChild(this.sensor_2);
            this.sensors.push(this.sensor_2);

            this.base_1 = new sprite(this.bit_base, this.laser_1.x, this.laser_1.y, 0, 0.5, 0);
            this._lockpick_window_0.addChild(this.base_1);

            this.base_2 = new sprite(this.bit_base, this.laser_2.x, this.laser_2.y, -Math.PI/2, 0.5, 0);
            this._lockpick_window_0.addChild(this.base_2);


            // mirrors
            this.mirrors = [];
            this.fixed_mirror_1 = new sprite(this.bit_box_mirror, Graphics.width/2 - 50, Graphics.height/2 - 50, -Math.PI/4);
            this.fixed_mirror_2 = new sprite(this.bit_box_mirror, Graphics.width/2 + 50, Graphics.height/2 + 50, -Math.PI/4);
            this._lockpick_window_0.addChild(this.fixed_mirror_1);
            this._lockpick_window_0.addChild(this.fixed_mirror_2);
            this.mirrors.push(this.fixed_mirror_1);
            this.mirrors.push(this.fixed_mirror_2);

            this.box_1 = new sprite(this.bit_box_base, this.fixed_mirror_1.x, this.fixed_mirror_1.y, this.fixed_mirror_1.angle - Math.PI/4);
            this._lockpick_window_0.addChildAt(this.box_1, this._lockpick_window_0.children.indexOf(this.laser_1));
            this.box_1.opacity = 120;
            this.box_1.scale.x = 1.1;
            this.box_1.scale.y = 1.1;

            this.box_2 = new sprite(this.bit_box_base, this.fixed_mirror_2.x, this.fixed_mirror_2.y, this.fixed_mirror_2.angle - Math.PI/4);
            this._lockpick_window_0.addChildAt(this.box_2, this._lockpick_window_0.children.indexOf(this.laser_1));
            this.box_2.opacity = 120;
            this.box_2.scale.x = 1.1;
            this.box_2.scale.y = 1.1;

            let angle_1 = Math.PI;
            this.mirror_1 = new sprite(this.bit_mirror, 455, 40, angle_1);
            this._lockpick_window_0.addChild(this.mirror_1);
            this.mirrors.push(this.mirror_1);

            this.add_child(this.mirror_1, new sprite(this.bit_arrow_right, this.mirror_1.x, this.mirror_1.y, this.mirror_1.angle, 0, 0.5));
            this.add_child(this.mirror_1, new sprite(this.bit_arrow_left, this.mirror_1.x, this.mirror_1.y, this.mirror_1.angle, 1, 0.5));



            let angle_2 = 16*Math.PI/32;
            this.mirror_2 = new sprite(this.bit_mirror, Graphics.width - 40, Graphics.height/2 - 60, angle_2);
            this._lockpick_window_0.addChild(this.mirror_2);
            this.mirrors.push(this.mirror_2);

            this.add_child(this.mirror_2, new sprite(this.bit_arrow_right, this.mirror_2.x, this.mirror_2.y, this.mirror_2.angle, 0, 0.5));
            this.add_child(this.mirror_2, new sprite(this.bit_arrow_left, this.mirror_2.x, this.mirror_2.y, this.mirror_2.angle, 1, 0.5));

            /*let angle_3 = -19*Math.PI/32;//2*Math.PI/5;
            this.mirror_3 = new sprite(this.bit_mirror, 50, 346, angle_3);
            this._lockpick_window_0.addChild(this.mirror_3);
            this.mirrors.push(this.mirror_3);

            this.add_child(this.mirror_3, new sprite(this.bit_arrow_right, this.mirror_3.x, this.mirror_3.y, this.mirror_3.angle, 0, 0.5));
            this.add_child(this.mirror_3, new sprite(this.bit_arrow_left, this.mirror_3.x, this.mirror_3.y, this.mirror_3.angle, 1, 0.5));


            let angle_4 = -31*Math.PI/32;//2*Math.PI/5;
            this.mirror_4 = new sprite(this.bit_mirror, 257, 31, angle_4);
            this._lockpick_window_0.addChild(this.mirror_4);
            this.mirrors.push(this.mirror_4);

            this.add_child(this.mirror_4, new sprite(this.bit_arrow_right, this.mirror_4.x, this.mirror_4.y, this.mirror_4.angle, 0, 0.5));
            this.add_child(this.mirror_4, new sprite(this.bit_arrow_left, this.mirror_4.x, this.mirror_4.y, this.mirror_4.angle, 1, 0.5));*/
        };

        this.scene_lockpick.prototype.update_laser = function(laser, object = null) {
            laser.update_self();
    
            for (let i = 0; i < this.mirrors.length; i++) {
                this.mirrors[i].update_self();
                if (this.mirrors[i] != object) {

                    if (laser_intersect(laser, this.mirrors[i])) {
                        //console.log(1);
                        let point = laser_intersection_point(laser, this.mirrors[i]);
                        //console.log(point);
                        let arr = scale_x_laser(laser, point);
                        let scale_temp = arr[0], L_temp = arr[1];
        
                        if (scale_temp < laser.scale.x) {
                            laser.scale.x = scale_temp;
                            laser.L = L_temp;
                            laser.point_2 = point;
                            //console.log(point);
                            //this.remove_children(laser);

                            let angle = get_reflection(laser, this.mirrors[i]);
                            if (this.mirrors[i] == this.mirror_4) angle = angle + Math.PI;
                            //console.log(angle/Math.PI);
                            let child = new Laser_Sprite(laser.bitmap, laser.point_2.x, laser.point_2.y, angle);
                            this.add_child(laser, child);
                            this.update_laser(child, this.mirrors[i]);

                        } else {
                            this.remove_children(laser);
                        }
                    }
                }
            }
        }

        this.scene_lockpick.prototype.add_child = function (laser, child) {
            laser.add_child(child);
            let index = this._lockpick_window_0.children.indexOf(laser) + 1;
            this._lockpick_window_0.addChildAt(child, index);
        }

        this.scene_lockpick.prototype.remove_children = function (laser) {
            for (let i = 0; i < laser.children.length; i++) {
                this.remove_children(laser.children[i]);
                this._lockpick_window_0.removeChild(laser.children[i]);
            }

            laser.remove_children();
        }

        this.scene_lockpick.prototype.laser_rescale_y = function (laser, scale) {
            laser.scale.y = scale;
            laser.children.forEach(child => {
                this.laser_rescale_y(child, scale);
            });
        }

        this.scene_lockpick.prototype.rotate_mirror = function (mirror, step, min, max) {
            let left = mirror.children[0], right = mirror.children[1];

            if (in_rectangle_sprite(left)) {
                left.visible = true;
                right.visible = false;
                mirror.scale.x = 1.1;

                if (TouchInput.isTriggered()) {
                    let angle = Math.max(mirror.angle - step, min);

                    set_rotation(left, angle);
                    set_rotation(right, angle);
                    set_rotation(mirror, angle);

                    this.lasers.forEach(laser => {
                        this.remove_children(laser);
                    });
                }

            } else if (in_rectangle_sprite(right)) {
                left.visible = false;
                right.visible = true;
                mirror.scale.x = 1.1;

                if (TouchInput.isTriggered()) {
                    let angle = Math.min(mirror.angle + step, max);

                    set_rotation(left, angle);
                    set_rotation(right, angle);
                    set_rotation(mirror, angle);

                    this.lasers.forEach(laser => {
                        this.remove_children(laser);
                    });
                }

            } else {
                left.visible = false;
                right.visible = false;
                mirror.scale.x = 1;
            }
        }

        this.scene_lockpick.prototype.update_sensor = function (sensor) {
            for (let i = 0; i < this.lasers.length; i++) {
                if (this.sensor_laser_intersect(sensor, this.lasers[i]) == true) break;
                else sensor.detected = false;
            }
        }

        this.scene_lockpick.prototype.sensor_laser_intersect = function (sensor, laser) {
            //console.log(laser);
            if ((sensor.detect == laser.bitmap) && laser_intersect(laser, sensor)) {
                sensor.detected = true;
                return true;

            } else {
                for (let i = 0; i < laser.children.length; i++) {
                    //console.log(laser.children, i);
                    if (this.sensor_laser_intersect(sensor, laser.children[i])) return true;
                }

                return false;
            }
        }
    }
    
    get_scene_lockpick() {
        return this.scene_lockpick;
    }
}
/*function sprite_prism(bitmap, laser, x = 0, y = 0, angle = 0, scale_x = 1, scale_y = 1) {
    Sprite.prototype.initialize.call(this, bitmap);
    this.x = x;
    this.y = y;
    this.angle = angle;
    set_rotation(this, angle);
    this.anchor.x = 0.5;
    this.anchor.y = 0;
    this.scale.x = scale_x;
    this.scale.y = scale_y;

    this.point_1 = null, this.point_2 = null, this.point_3 = null, this.point_4 = null, this.point_5 = null;

    this.laser = laser;
}
sprite_prism.prototype = Object.create(Sprite_Button.prototype);
sprite_prism.prototype.constructor = sprite_prism;

sprite_prism.prototype.update_self = function () {
    let x = this.x + ((1 - this.anchor.y) * this.height) * Math.cos(this.rotation + (Math.PI/2));
    let y = this.y + ((1 - this.anchor.y) * this.height) * Math.sin(this.rotation + (Math.PI/2));

    this.point_1 = new Point(x, y);

    let L_1 = (1/8) * this.width;

    x1 = x - (L_1 * Math.cos(this.rotation));
    x2 = x + (L_1 * Math.cos(this.rotation));
    y1 = y - (L_1 * Math.sin(this.rotation));
    y2 = y + (L_1 * Math.sin(this.rotation));

    this.point_3 = new Point(x1, y1);
    this.point_5 = new Point(x2, y2);


    x = this.x + (((1/2) - this.anchor.y) * this.height) * Math.cos(this.rotation + (Math.PI/2));
    y = this.y + (((1/2) - this.anchor.y) * this.height) * Math.sin(this.rotation + (Math.PI/2));

    L_1 = (1/2) * this.width;

    x1 = x - (L_1 * Math.cos(this.rotation));
    x2 = x + (L_1 * Math.cos(this.rotation));
    y1 = y - (L_1 * Math.sin(this.rotation));
    y2 = y + (L_1 * Math.sin(this.rotation));

    this.point_2 = new Point(x1, y1);
    this.point_4 = new Point(x2, y2);

    // lines with points 2-3, 4-5, and singular point 1.
}*/




/*class Lockpick_menu_12 {
    constructor() {
        this.init_scene();
    }
    init_scene() {
        function Scene_Lockpick_2() {
            Scene_MenuBase.prototype.initialize.call(this);
            Scene_MenuBase.prototype.initialize.call(this);
            this.tick = 0;
            this.game_finished = false;
            this.counter = 0;
            $gameSwitches.setValue(18, false);
        };
        Scene_Lockpick_2.prototype = Object.create(Scene_MenuBase.prototype);
        this.scene_lockpick = (Scene_Lockpick_2.prototype.constructor = Scene_Lockpick_2);

        this.scene_lockpick.prototype.update = function() {
            // frame counter
            this.tick += 1;
            this.tick %= 20;

            if (this.tick == 10) {
                let size = 1.1;
                this.lasers.forEach(laser => {
                    this.laser_rescale_y(laser, size);
                });
                //this.laser_1.scale.x = size;
            } else if (this.tick == 0) {
                let size = 1;
                this.lasers.forEach(laser => {
                    this.laser_rescale_y(laser, size);
                });
                //this.laser_1.scale.x = size;
            }

            // exits scene when esc key is pressed
            if (Input.isTriggered("cancel")) SceneManager.pop();

            if (this.game_finished) {
                this.counter += 1;

                if (this.counter >= 100) {
                    $gameSwitches.setValue(18, true);
                    SceneManager.pop();
                }
            } else {

                // rotate mirrors
                let step = Math.PI/16;
                this.rotate_mirror(this.mirror_2, step, -6*Math.PI/16, -2*Math.PI/16);
                this.rotate_mirror(this.mirror_3, step, 0, 6*Math.PI/16);
                
                // update mirrors
                this.mirrors.forEach(mirror => {
                    mirror.update_self();
                });

                // update lasers
                this.lasers.forEach(laser => {
                    this.update_laser(laser);
                });

                // update sensors
                this.sensors.forEach(sensor => {
                    sensor.update_self();
                    this.update_sensor(sensor);
                });

                if(this.sensor_blue.detected) {
                    this.game_finished = true;

                    this.mirrors.forEach(mirror => {
                        mirror.scale.x = 1;
                        mirror.children.forEach(child => {
                            child.visible = false;
                        });
                    });
                }
            }
            //console.log(this.laser_1.scale.x);
        };

        this.scene_lockpick.prototype.create = function() {
            Scene_MenuBase.prototype.create.call(this);

            // create window
            this._lockpick_window_0 = new Window_Lockpick(0, 0, Graphics.width, Graphics.height);
            this.addWindow(this._lockpick_window_0);

            // get images from files
            this.bit_laser_red = create_bitmap("img/pictures/", "laser_red_h");
            this.bit_laser_blue = create_bitmap("img/pictures/", "laser_blue_h");
            this.bit_laser_green = create_bitmap("img/pictures/", "laser_green_h");
            this.bit_laser_yellow = create_bitmap("img/pictures/", "laser_yellow_h");

            this.bit_sensor_red = create_bitmap("img/pictures/", "sensor_red");
            this.bit_sensor_blue = create_bitmap("img/pictures/", "sensor_blue");
            this.bit_sensor_green = create_bitmap("img/pictures/", "sensor_green");
            this.bit_sensor_yellow = create_bitmap("img/pictures/", "sensor_yellow");

            this.bit_prism = create_bitmap("img/pictures/", "laser_combined");

            this.bit_base = create_bitmap("img/pictures/", "sensor_base");

            this.bit_box_base = create_bitmap("img/pictures/", "box_base");
            this.bit_box_mirror = create_bitmap("img/pictures/", "box_mirror_2");
            //his.bit_box_mirror_2 = create_bitmap("img/pictures/", "box_mirror");
            
            this.bit_mirror = create_bitmap("img/pictures/", "mirror");
            this.bit_arrow_left = create_bitmap("img/pictures/", "arrow_left");
            this.bit_arrow_right = create_bitmap("img/pictures/", "arrow_right");


            // create sprites
            this.objects = [];
            // lasers
            this.lasers = [];
            this.laser_1 = new Laser_Sprite(this.bit_laser_yellow, 0, 500, 0*Math.PI/2);
            this._lockpick_window_0.addChild(this.laser_1);
            this.lasers.push(this.laser_1);

            this.laser_2 = new Laser_Sprite(this.bit_laser_blue, Graphics.width, 500, 2*Math.PI/2);
            this._lockpick_window_0.addChild(this.laser_2);
            this.lasers.push(this.laser_2);

            this.laser_prism = new Laser_Sprite(this.bit_laser_green, 0, 100, 0*Math.PI/2);

            // prism
            this.prism = new sprite_prism(this.bit_prism, this.laser_prism, Graphics.width/2, 550, Math.PI);
            this.objects.push(this.prism);

            // base or sensors
            this.sensors = [];
            this.sensor = new sprite_sensor(this.bit_sensor_green, this.bit_laser_green, (Graphics.width), 124, -Math.PI/2);
            this._lockpick_window_0.addChild(this.sensor);
            this.sensors.push(this.sensor);

            this.base_yellow = new sprite(this.bit_base, this.laser_1.x, this.laser_1.y, Math.PI/2, 0.5, 0);
            this._lockpick_window_0.addChild(this.base_yellow);

            this.base_blue = new sprite(this.bit_base, this.laser_2.x, this.laser_2.y, -Math.PI/2, 0.5, 0);
            this._lockpick_window_0.addChild(this.base_blue);

            

            // mirrors
            this.mirrors = [];

            let angle_1 = 3*Math.PI/4;//-Math.PI/4;
            this.mirror_1 = new sprite(this.bit_box_mirror, 150, 100, angle_1);
            this._lockpick_window_0.addChild(this.mirror_1);
            this.mirrors.push(this.mirror_1);
            this.objects.push(this.mirror_1);
            this.box = new sprite(this.bit_box_base, this.mirror_1.x, this.mirror_1.y, this.mirror_1.angle - Math.PI/4);
            this._lockpick_window_0.addChildAt(this.box, this._lockpick_window_0.children.indexOf(this.laser_1));
            this.box.opacity = 120;
            this.box.scale.x = 1.1;
            this.box.scale.y = 1.1;

            let angle_4 = -3*Math.PI/4 + Math.PI/8;
            this.mirror_4 = new sprite(this.bit_box_mirror, 260, 100, angle_4);
            this._lockpick_window_0.addChild(this.mirror_4);
            this.mirrors.push(this.mirror_4);
            this.box = new sprite(this.bit_box_base, this.mirror_4.x, this.mirror_4.y, this.mirror_4.angle - Math.PI/4);
            this._lockpick_window_0.addChildAt(this.box, this._lockpick_window_0.children.indexOf(this.laser_1));
            this.box.opacity = 120;
            this.box.scale.x = 1.1;
            this.box.scale.y = 1.1;


            let angle_2 = -2*Math.PI/16;//2*Math.PI/5;
            this.mirror_2 = new sprite(this.bit_mirror, 130, 490, angle_2);
            this._lockpick_window_0.addChild(this.mirror_2);
            this.mirrors.push(this.mirror_2);

            this.add_child(this.mirror_2, new sprite(this.bit_arrow_right, this.mirror_2.x, this.mirror_2.y, this.mirror_2.angle, 0, 0.5));
            this.add_child(this.mirror_2, new sprite(this.bit_arrow_left, this.mirror_2.x, this.mirror_2.y, this.mirror_2.angle, 1, 0.5));

            let angle_3 = 1*Math.PI/16;//2*Math.PI/5;
            this.mirror_3 = new sprite(this.bit_mirror, (Graphics.width - 200), 500, angle_3);
            this._lockpick_window_0.addChild(this.mirror_3);
            this.mirrors.push(this.mirror_3);

            this.add_child(this.mirror_3, new sprite(this.bit_arrow_right, this.mirror_3.x, this.mirror_3.y, this.mirror_3.angle, 0, 0.5));
            this.add_child(this.mirror_3, new sprite(this.bit_arrow_left, this.mirror_3.x, this.mirror_3.y, this.mirror_3.angle, 1, 0.5));
        };

        this.scene_lockpick.prototype.update_laser = function(laser, object = null) {
            laser.update_self();
    
            for (let i = 0; i < this.objects.length; i++) {
                this.objects[i].update_self();

                if (this.objects[i] != object) {

                    if (this.mirrors.includes(this.objects[i])) {

                        if (laser_intersect(laser, this.objects[i])) {
                            //console.log(1);
                            let point = laser_intersection_point(laser, this.objects[i]);
                            //console.log(point);
                            let arr = scale_x_laser(laser, point);
                            let scale_temp = arr[0], L_temp = arr[1];
                
                            if (scale_temp < laser.scale.x) {
                                laser.scale.x = scale_temp;
                                laser.L = L_temp;
                                laser.point_2 = point;
                                //console.log(point);

                                let angle = get_reflection(laser, this.objects[i]);
                                //if (this.mirrors[i] == this.mirror_4) angle = angle ;//- Math.PI;
                                //console.log(angle/Math.PI);
                                let child = new Laser_Sprite(laser.bitmap, laser.point_2.x, laser.point_2.y, angle);
                                this.add_child(laser, child);
                                this.update_laser(child, this.objects[i]);

                            } else {
                                this.remove_children(laser);
                            }
                        }

                    } else if (this.objects[i] == this.prism) {
                        let A = this.objects[i].point_2, B = this.objects[i].point_3, C = this.objects[i].point_4, D = this.objects[i].point_5;

                        if (laser_intersect_with_points(laser, A, B)) {
                            //console.log(1);
                            let point = laser_intersection_point_with_points(laser, A, B);
                            //console.log(point);
                            let arr = scale_x_laser(laser, point);
                            let scale_temp = arr[0], L_temp = arr[1];
            
                            if (scale_temp < laser.scale.x) {
                                laser.scale.x = scale_temp;
                                laser.L = L_temp;
                                laser.point_2 = point;
                                //console.log(point);

                                this.objects.
                                this.update_laser(child, this.objects[i]);

                            } else {
                                this.remove_children(laser);
                            }
                        }

                        if (laser_intersect_with_points(laser, C, D)) {
                            //console.log(1);
                            let point = laser_intersection_point_with_points(laser, C, D);
                            //console.log(point);
                            let arr = scale_x_laser(laser, point);
                            let scale_temp = arr[0], L_temp = arr[1];
                
                            if (scale_temp < laser.scale.x) {
                                laser.scale.x = scale_temp;
                                laser.L = L_temp;
                                laser.point_2 = point;
                                //console.log(point);

                                let angle = get_reflection(laser, this.objects[i]);
                                //if (this.mirrors[i] == this.mirror_4) angle = angle ;//- Math.PI;
                                //console.log(angle/Math.PI);
                                let child = new Laser_Sprite(laser.bitmap, laser.point_2.x, laser.point_2.y, angle);
                                this.add_child(laser, child);
                                this.update_laser(child, this.objects[i]);

                            } else {
                                this.remove_children(laser);
                            }
                        }
                    }
                }
            }
        }

        this.scene_lockpick.prototype.add_child = function (laser, child) {
            laser.add_child(child);
            let index = this._lockpick_window_0.children.indexOf(laser) + 1;
            this._lockpick_window_0.addChildAt(child, index);
        }

        this.scene_lockpick.prototype.remove_children = function (laser) {
            for (let i = 0; i < laser.children.length; i++) {
                this.remove_children(laser.children[i]);
                this._lockpick_window_0.removeChild(laser.children[i]);
            }

            laser.remove_children();
        }

        this.scene_lockpick.prototype.laser_rescale_y = function (laser, scale) {
            laser.scale.y = scale;
            laser.children.forEach(child => {
                this.laser_rescale_y(child, scale);
            });
        }

        this.scene_lockpick.prototype.rotate_mirror = function (mirror, step, min, max) {
            let left = mirror.children[0], right = mirror.children[1];

            if (in_rectangle_sprite(left)) {
                left.visible = true;
                right.visible = false;
                mirror.scale.x = 1.1;

                if (TouchInput.isTriggered()) {
                    let angle = Math.max(mirror.angle - step, min);

                    set_rotation(left, angle);
                    set_rotation(right, angle);
                    set_rotation(mirror, angle);

                    this.lasers.forEach(laser => {
                        this.remove_children(laser);
                    });
                }

            } else if (in_rectangle_sprite(right)) {
                left.visible = false;
                right.visible = true;
                mirror.scale.x = 1.1;

                if (TouchInput.isTriggered()) {
                    let angle = Math.min(mirror.angle + step, max);

                    set_rotation(left, angle);
                    set_rotation(right, angle);
                    set_rotation(mirror, angle);

                    this.lasers.forEach(laser => {
                        this.remove_children(laser);
                    });
                }

            } else {
                left.visible = false;
                right.visible = false;
                mirror.scale.x = 1;
            }
        }

        this.scene_lockpick.prototype.update_sensor = function (sensor) {
            for (let i = 0; i < this.lasers.length; i++) {
                if (this.sensor_laser_intersect(sensor, this.lasers[i]) == true) break;
                else sensor.detected = false;
            }
        }

        this.scene_lockpick.prototype.sensor_laser_intersect = function (sensor, laser) {
            //console.log(laser);
            if ((sensor.detect == laser.bitmap) && laser_intersect(laser, sensor)) {
                sensor.detected = true;
                return true;

            } else {
                for (let i = 0; i < laser.children.length; i++) {
                    //console.log(laser.children, i);
                    if (this.sensor_laser_intersect(sensor, laser.children[i])) return true;
                }

                return false;
            }
        }

        this.scene_lockpick.prototype.update_prism = function (prism) {
            prism.update_self();

        }
    }
    
    get_scene_lockpick() {
        return this.scene_lockpick;
    }
}*/




let lockpick_menu_10 = new Lockpick_menu_10();
let lockpick_menu_11 = new Lockpick_menu_11();
let lockpick_menu_12 = new Lockpick_menu_12();
let lockpick_menu_13 = new Lockpick_menu_13();
let lockpick_menu_14 = new Lockpick_menu_14();
let lockpick_menu_15 = new Lockpick_menu_15();

_alias_scene_map_update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
    _alias_scene_map_update.call(this);
    if (Input.isTriggered("lockpick_menu_0")) SceneManager.push(lockpick_menu_10.get_scene_lockpick());
    if (Input.isTriggered("lockpick_menu_1")) SceneManager.push(lockpick_menu_11.get_scene_lockpick());
};

_alias_custom_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _alias_custom_pluginCommand.call(this, command, args);
    if(command === "lockpick_0") SceneManager.push(lockpick_menu_10.get_scene_lockpick());
    if(command === "lockpick_1") SceneManager.push(lockpick_menu_11.get_scene_lockpick());
    if(command === "lockpick_2") SceneManager.push(lockpick_menu_12.get_scene_lockpick());
    if(command === "lockpick_3") SceneManager.push(lockpick_menu_13.get_scene_lockpick());
    if(command === "lockpick_4") SceneManager.push(lockpick_menu_14.get_scene_lockpick());
    if(command === "lockpick_5") SceneManager.push(lockpick_menu_14.get_scene_lockpick());
};

TouchInput._onMouseMove = function(event) {
    var x = Graphics.pageToCanvasX(event.pageX);
    var y = Graphics.pageToCanvasY(event.pageY);
    this._onMove(x, y);
};
