/**
 * Created by DrTone on 04/12/2014.
 */
//Visualisation framework
var NUM_DAYS = 7;
var FLOOR_WIDTH = 800;
var FLOOR_HEIGHT = 600;
var SEGMENTS = 8;
var NODE_RADIUS = 5;
var NODE_SEGMENTS = 24;

//Init this app from base
function Finance() {
    BaseApp.call(this);
}

Finance.prototype = new BaseApp();

Finance.prototype.init = function(container) {
    BaseApp.prototype.init.call(this, container);
    //GUI
    this.guiControls = null;
    this.gui = null;
};

Finance.prototype.createScene = function() {
    //Create scene
    BaseApp.prototype.createScene.call(this);

    //Floor
    var planeGeom = new THREE.PlaneBufferGeometry(FLOOR_WIDTH, FLOOR_HEIGHT, SEGMENTS, SEGMENTS);
    var planeMat = new THREE.MeshLambertMaterial( {color: 0xb5b5b5});
    var plane = new THREE.Mesh(planeGeom, planeMat);
    plane.rotation.x = -Math.PI/2;
    this.scene.add(plane);

    //Create weeks worth of data
    var label;
    var pos = new THREE.Vector3(0, 50, -50);
    var monthScale = new THREE.Vector3(80, 60, 1);
    var dayLabelOffset = new THREE.Vector3(0, -15, 10);
    var sphereGeom = new THREE.SphereBufferGeometry(NODE_RADIUS, NODE_SEGMENTS, NODE_SEGMENTS);
    var sphereMat = new THREE.MeshPhongMaterial({color: 0xfed600});
    var sphereMatSelected = new THREE.MeshPhongMaterial( {color: 0xffffff} );
    var i, xStart=-100, xInc=35, yStart=10, zStart=0;
    var node;
    this.nodes = [];
    label = spriteManager.create("October 2016", pos, monthScale, 32, 1, true, false);
    this.scene.add(label);

    var dayScale = new THREE.Vector3(30, 30, 1);
    for(i=0; i<NUM_DAYS; ++i) {
        node = new THREE.Mesh(sphereGeom, i===0 ? sphereMatSelected : sphereMat);
        node.position.set(xStart+(xInc*i), yStart, zStart);
        this.nodes.push(node);
        this.scene.add(node);
        pos.copy(node.position);
        pos.add(dayLabelOffset);
        label = spriteManager.create(DATES.DayNumbers[i], pos, dayScale, 32, 1, true, false);
        this.scene.add(label);
    }


};

Finance.prototype.createGUI = function() {
    //GUI - using dat.GUI
    this.guiControls = new function() {

    };

    var gui = new dat.GUI();

    //Add some folders
    this.guiAppear = gui.addFolder("Appearance");
    this.guiData = gui.addFolder("Data");
    this.gui = gui;
};

Finance.prototype.update = function() {
    //Perform any updates

    BaseApp.prototype.update.call(this);
};

$(document).ready(function() {
    //Initialise app
    var container = document.getElementById("WebGL-output");
    var app = new Finance();
    app.init(container);
    app.createScene();
    app.createGUI();

    //GUI callbacks

    app.run();
});