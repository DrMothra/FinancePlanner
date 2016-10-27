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

    //Date info
    this.currentDay = 0;
};

Finance.prototype.createScene = function() {
    //Create scene
    BaseApp.prototype.createScene.call(this);

    //Floor
    var planeGeom = new THREE.PlaneBufferGeometry(FLOOR_WIDTH, FLOOR_HEIGHT, SEGMENTS, SEGMENTS);
    var planeMat = new THREE.MeshLambertMaterial( {color: 0x444444});
    var plane = new THREE.Mesh(planeGeom, planeMat);
    plane.rotation.x = -Math.PI/2;
    this.scene.add(plane);

    //Create weeks worth of data
    var label;
    var pos = new THREE.Vector3(0, 50, -50);
    var monthScale = new THREE.Vector3(80, 60, 1);
    var dayLabelOffset = new THREE.Vector3(0, -15, 10);
    var expendLabelOffset = new THREE.Vector3(0, 2, 0);
    var sphereGeom = new THREE.SphereBufferGeometry(NODE_RADIUS, NODE_SEGMENTS, NODE_SEGMENTS);
    this.sphereMat = new THREE.MeshPhongMaterial({color: 0xfed600});
    this.sphereMatSelected = new THREE.MeshPhongMaterial( {color: 0xffffff, emissive: 0xfed600} );
    var i, xStart=-100, xInc=35, yStart=10, zStart=0;
    var node;
    this.nodes = [];
    label = spriteManager.create("October 2016", pos, monthScale, 32, 1, true, false);
    this.scene.add(label);

    var dayScale = new THREE.Vector3(30, 30, 1);
    for(i=0; i<NUM_DAYS; ++i) {
        node = new THREE.Mesh(sphereGeom, i===this.currentDay ? this.sphereMatSelected : this.sphereMat);
        node.position.set(xStart+(xInc*i), yStart, zStart);
        this.nodes.push(node);
        this.scene.add(node);
        pos.copy(node.position);
        pos.add(dayLabelOffset);
        label = spriteManager.create(DATES.DayNumbers[i], pos, dayScale, 32, 1, true, false);
        this.scene.add(label);
        pos.copy(node.position);
        pos.add(expendLabelOffset);
        label = spriteManager.create("£0.00", pos, dayScale, 32, 1, true, false);
        this.scene.add(label);
    }
};

Finance.prototype.createGUI = function() {
    //GUI - using dat.GUI
    var _this = this;
    this.guiControls = new function() {
        this.Background = '#5c5f64';
    };

    var gui = new dat.GUI();

    //Add some folders
    this.guiAppear = gui.addFolder("Appearance");
    this.guiAppear.addColor(this.guiControls, 'Background').onChange(function (value) {
        _this.renderer.setClearColor(value, 1.0);
    });

    this.guiData = gui.addFolder("Data");
    this.gui = gui;
};

Finance.prototype.update = function() {
    //Perform any updates

    BaseApp.prototype.update.call(this);
};

Finance.prototype.nextDay = function() {
    if(++this.currentDay > 30) {
        this.currentDay = 30;
        return;
    }
    this.nodes[this.currentDay].material = this.sphereMatSelected;
    this.nodes[this.currentDay].material.needsUpdate = true;
    this.nodes[this.currentDay-1].material = this.sphereMat;
    this.nodes[this.currentDay-1].material.needsUpdate = true;
};

Finance.prototype.previousDay = function() {
    if(--this.currentDay < 0) {
        this.currentDay = 0;
        return;
    }
    this.nodes[this.currentDay].material = this.sphereMatSelected;
    this.nodes[this.currentDay].material.needsUpdate = true;
    this.nodes[this.currentDay+1].material = this.sphereMat;
    this.nodes[this.currentDay+1].material.needsUpdate = true;
};

Finance.prototype.showAddExpense = function() {
    $('#addForm').show();
};

Finance.prototype.validateExpense = function() {
    var form = document.forms["addExpenseForm"];
    var amount = form["amount"].value;
    var item = form["item"].value;
    var tags = form["tags"].value;
    var amountElem = $('#inputAmount');
    var errorElem = $('#errorText');
    var label;

    if(isNaN(amount)) {
        console.log("Invalid number");
        amountElem.addClass("has-error");
        errorElem.html("Invalid number!");
        errorElem.show();
    } else {
        if(amount <= 0) {
            console.log("Invalid number");
            amountElem.addClass("has-error");
            errorElem.html("Invalid number!");
            errorElem.show();
        } else {
            amountElem.removeClass("has-error");
            errorElem.hide();
            amount = parseFloat(amount);
            label = spriteManager.getSpriteByIndex(2);
            //Ensure text is valid as well
            if(item === "") {
                errorElem.html("No item text!");
                errorElem.show();
                return;
            }
            var date = {};
            date.year = 2016;
            date.month = 9;
            date.day = 26;
            var expense = ExpenseManager.updateExpense(date, amount, item, tags);
            var total = expense.getTotal();
            label.position.y = 10 + total;
            spriteManager.setText(label, '£'+total);
            this.nodes[0].position.y = 10 + total;
            $('#addForm').hide();
        }
    }
};

$(document).ready(function() {
    //Initialise app
    var container = document.getElementById("WebGL-output");
    var app = new Finance();
    app.init(container);
    app.createScene();
    app.createGUI();

    //GUI callbacks
    $('#right').on("click", function(event) {
       app.nextDay();
    });
    $('#left').on("click", function(event) {
        app.previousDay();
    });

    $('#addExpense').on("click", function() {
        app.showAddExpense();
    });

    $('#addExpenseForm').submit(function(event) {
        event.preventDefault();
        app.validateExpense();
    });

    app.run();
});