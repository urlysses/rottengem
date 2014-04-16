/*global THREE, Coordinates, document, window, CANNON*/
"use strict";
var camera, scene, renderer;
var cameraControls;
var clock = new THREE.Clock();
var gridX = true;
var gridY = false;
var gridZ = false;
var axes = true;
var camlight, i, j;
var rock;
var keys = [];

var hitGem = [];
var render, gemCollisions;
// CANNON:
//var world, body, groundBody, ground;

function fillScene() {
    /////// CANNON
   /* world = new CANNON.World();
    world.quatNormalizeSkip = 0;
    world.quatNormalizeFast = false;

    var solver = new CANNON.GSSolver();

    world.defaultContactMaterial.contactEquationStiffness = 1e9;
    world.defaultContactMaterial.contactEquationRegularizationTime = 4;

    solver.iterations = 7;
    solver.tolerance = 0.1;
    var split = true;
    if(split) {
        world.solver = new CANNON.SplitSolver(solver);
    } else {
        world.solver = solver;
    }
    world.gravity.set(0,-20,-10);
    world.broadphase = new CANNON.NaiveBroadphase();

    var physicsMaterial = new CANNON.Material();
    var physicsContactMaterial = new CANNON.ContactMaterial(physicsMaterial,
                                                    physicsMaterial,
                                                    0.3, // friction coefficient
                                                    0.0  // restitution
                                                    );
    // We must add the contact materials to the world
    world.addContactMaterial(physicsContactMaterial);
    
    var shape = new CANNON.Sphere(100);
    var mass = 10;
    body = new CANNON.RigidBody(mass, shape);
    body.position.set(80,120,0);
    body.linearDamping = 0.01;
    world.add(body);

    var groundShape = new CANNON.Plane();
    groundBody = new CANNON.RigidBody(0,groundShape,physicsMaterial);
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
    world.add(groundBody);*/
    ////// END CANNON

    // THREEJS
	scene = new THREE.Scene();

	// LIGHTS
	var ambientLight = new THREE.AmbientLight( 0x222222 );

	var light = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
	light.position.set( 200, 400, 500 );

	var light2 = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
	light2.position.set( -500, 250, -200 );
    
    camlight = new THREE.PointLight( 0xffffff, 1.0);
    camlight.position.set( -40, 200, 650 );
    scene.add(camlight);

	scene.add(ambientLight);
	scene.add(light);
	//scene.add(light2);

    var plane = new THREE.PlaneGeometry(10000, 10000);
    var ground = new THREE.Mesh(plane, new THREE.MeshLambertMaterial({color: 0xffffff, side: THREE.DoubleSide}));
    ground.rotation.x = - Math.PI / 2;
    scene.add(ground);
    hitGem.push(ground);
    // ROCK
    var rockTexture = new THREE.ImageUtils.loadTexture("/stone.png");
    rockTexture.wrapS = rockTexture.wrapT = THREE.RepeatWrap;
    rockTexture.repeat.set(1, 1);
	var rockMaterial1 = new THREE.MeshBasicMaterial( { color: 0xfbd743, wireframe: true, wireframeLinewidth: 2} );
    var rockMaterial2 = new THREE.MeshPhongMaterial( { color: 0xffffff, shinines: 10, ambient: 0xa2a2a2, specular: 0xa2a2a2, side: THREE.DoubleSide, shading: THREE.FlatShading, map: rockTexture} );
    var rockMaterial3 = new THREE.MeshPhongMaterial( { ambient: 0xa2a2a2, specular: 0x3f3e3f, shininess: 10, color: 0x747474} );
    var rockMaterial4 = new THREE.MeshNormalMaterial({shading: THREE.FlatShading});
    var rockMaterial5 = new THREE.MeshNormalMaterial({shading: THREE.FlatShading, wireframe: true, wireframeLinewidth: 2});
	var rockHeight = 429;
	var rockWidth = 261;
    var geo = new THREE.Geometry();
    var normal = new THREE.Vector3(0, 0, 1);
    var uvs = [];

    // front
    geo.vertices.push(new THREE.Vector3(99, 279, 60)); // 0
    geo.vertices.push(new THREE.Vector3(114, 409, 0)); // 1
    geo.vertices.push(new THREE.Vector3(10, 275, 0)); // 2

    geo.vertices.push(new THREE.Vector3(43, 223, 60)); // 3
    geo.vertices.push(new THREE.Vector3(2, 262, 20)); // 4
    geo.vertices.push(new THREE.Vector3(0, 87, 33)); // 5

    geo.vertices.push(new THREE.Vector3(100, 105, 102)); // 6
    geo.vertices.push(new THREE.Vector3(24, 51, 0)); // 7
    geo.vertices.push(new THREE.Vector3(42, 29, 0)); // 8

    geo.vertices.push(new THREE.Vector3(77, 23, 42)); // 9
    geo.vertices.push(new THREE.Vector3(112, 71, 102)); // 10
    geo.vertices.push(new THREE.Vector3(74, 0, 0)); // 11

    geo.vertices.push(new THREE.Vector3(91, 0, 0)); // 12
    geo.vertices.push(new THREE.Vector3(175, 0, 0)); // 13
    geo.vertices.push(new THREE.Vector3(181, 14, 20)); // 14

    geo.vertices.push(new THREE.Vector3(162, 144, 66)); // 15 TODO: eventual center of rock?
    geo.vertices.push(new THREE.Vector3(183, 6, 0)); // 16
    geo.vertices.push(new THREE.Vector3(197, 6, 0)); // 17

    geo.vertices.push(new THREE.Vector3(217, 23, 0)); // 18
    geo.vertices.push(new THREE.Vector3(203, 38, 42)); // 19
    geo.vertices.push(new THREE.Vector3(243, 49, 0)); // 20

    geo.vertices.push(new THREE.Vector3(225, 144, 20)); // 21
    geo.vertices.push(new THREE.Vector3(261, 214, 0)); // 22
    geo.vertices.push(new THREE.Vector3(253, 250, 0)); // 23

    geo.vertices.push(new THREE.Vector3(162, 208, 86)); // 24
    geo.vertices.push(new THREE.Vector3(242, 329, 66)); // 25
    geo.vertices.push(new THREE.Vector3(195, 429, 66)); // 26
 
    // back
    geo.vertices.push(new THREE.Vector3(150, 214, -72)); // 27

    for (i = 0; i < geo.vertices.length; i++) {
        // "center" the object on x-axis
        // geo.vertices[i].x -= 130;

        // Compute U & V by dividing current position with max x & y positions
        var u = geo.vertices[i].x / rockWidth;
        var v = geo.vertices[i].y / rockHeight;
        uvs.push(new THREE.Vector2(u, v));
    }

    var matrix = [
        [0, 1, 2],
        [3, 0, 2],
        [3, 2, 4],
        [5, 3, 4],
        [6, 3, 5],
        [6, 0, 3],
        [7, 6, 5],
        [7, 8, 9],
        [9, 10, 7],
        [10, 6, 7],
        [11, 9, 8],
        [12, 9, 11],
        [12, 13, 9],
        [13, 10, 9],
        [13, 14, 10],
        [14, 15, 10],
        [10, 15, 6],
        [16, 14, 13],
        [16, 17, 14],
        [17, 18, 14], // face 19
        [18, 19, 14], // face 20
        [18, 20, 19], // face 21
        [20, 21, 19], // face 22
        [19, 21, 15], // face 23
        [19, 15, 14], // face 24
        [20, 22, 21], // face 25
        [22, 23, 21], // face 26
        [21, 23, 24], // face 27
        [15, 21, 24], // face 28
        [15, 24, 6], // face 29
        [23, 25, 24], // face 30
        [24, 25, 26], // face 31
        [6, 24, 26], // face 32
        [6, 26, 0], // face 33
        [0, 26, 1], // face 34
        // backside
        [27, 26, 25],
        [27, 25, 23],
        [27, 23, 22],
        [27, 22, 20],
        [27, 20, 18],
        [27, 18, 17],
        [27, 17, 16],
        [27, 16, 13],
        [27, 13, 12],
        [27, 12, 11],
        [27, 11, 8],
        [27, 8, 7],
        [27, 7, 5],
        [27, 5, 4],
        [27, 4, 2],
        [27, 2, 1],
        [27, 1, 26]
        ];
   for (i = 0; i < matrix.length; i++) {
        // Current triangluar face vertices
        var curr = matrix[i];
        // Get the 3 vertices
        var v0 = curr[0];
        var v1 = curr[1];
        var v2 = curr[2];
        // Get face normals
        var n0 = geo.vertices[v0].clone().normalize();
        var n1 = geo.vertices[v1].clone().normalize();
        var n2 = geo.vertices[v2].clone().normalize();
        // Build and push face
        var face = new THREE.Face3(v0, v1, v2, [n0, n1, n2]);
        geo.faces.push(face);
        // Push computed UVs
        geo.faceVertexUvs[0].push([uvs[v0], uvs[v1], uvs[v2]]);
    }

    // geo.mergeVertices();
    geo.computeFaceNormals();
    geo.computeCentroids();
    geo.computeVertexNormals();
    
    // .obj exporter
    //var exporter = new THREE.OBJExporter();
    //var obj = exporter.parse(geo);
    //document.getElementById("container").innerHTML += "<pre>"+obj+"</pre>";

    
    // Import hi res rock
    var manager = new THREE.LoadingManager();
    var loader = new THREE.OBJLoader(manager);
    loader.load("/HiResGem.obj", function (object) {
        object.children[0].material = rockMaterial4;
        object.children[0].scale.set(1.1, 1.1, 1.1);
        //scene.add(object);
        THREE.GeometryUtils.merge(geo, object.children[0]);
        geo.computeFaceNormals();
        geo.computeCentroids();
        geo.computeVertexNormals();
  
        var preRock = new THREE.Mesh(geo, rockMaterial4);
        preRock.position.y -= rockHeight * 0.25;
        preRock.position.x -= rockWidth * 0.5;
        rock = new THREE.Object3D();
        rock.position.y += rockHeight * 0.5;
        rock.position.x += rockWidth * 0.5;
        rock.add(preRock);
        scene.add(rock);
        // wireframe
        //scene.add(new THREE.Mesh(geo, rockMaterial1)); 
    });

    // debugging materials with a simple shape
	var stamen = new THREE.Mesh(new THREE.CubeGeometry( 200, 600, 20 ), rockMaterial2 );
	stamen.position.y = 120;
    stamen.position.x = 60;
    stamen.position.z = -600;
    scene.add(stamen);
    hitGem.push(stamen);
}

function moveGem(e) {
    // list of valid movement key codes (right, up, left, down)
    var use = [37, 38, 39, 40];
    if (use.indexOf(e.keyCode) >= 0) {
        e.preventDefault();
        keys[e.keyCode] = true;
    }
}

function stopGem(e) {
    keys[e.keyCode] = false;
}

gemCollisions = function () {
    var originPoint = rock.position.clone();
    var ray = new THREE.Raycaster();
    var g = rock.children[0].geometry;
    for (i = 0; i < g.vertices.length; i++) {
        var localVertex = g.vertices[i].clone();
        var globalVertex = localVertex.applyMatrix4(rock.matrix);
        var directionVector = globalVertex.sub(rock.position);
        ray.set(originPoint, directionVector.clone().normalize());
        var collisions = ray.intersectObjects(hitGem);
        if (collisions.length > 0 && collisions[0].distance < directionVector.length()) {
            // this returns too soon.
            return true;
        }
    }
};

function init() {
	var canvasWidth = window.innerWidth - 20;
	var canvasHeight = window.innerHeight - 20;
	var canvasRatio = canvasWidth / canvasHeight;

	// RENDERER
	renderer = new THREE.WebGLRenderer( { antialias: false } );
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.setSize(canvasWidth, canvasHeight);
	renderer.setClearColor( 0xeeeeee, 1.0 );

	// CAMERA
	camera = new THREE.PerspectiveCamera( 38, canvasRatio, 1, 10000 );
    //camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	// CONTROLS
	cameraControls = new THREE.OrbitAndPanControls(camera, renderer.domElement);
	camera.position.set(130, 254, 690);
	cameraControls.target.set(130, 214, 0);
	fillScene();

    // listen for key presses
    document.addEventListener("keydown", moveGem, false);
    document.addEventListener("keyup", stopGem, false);
}

function addToDOM() {
	var container = document.getElementById('container');
	var canvas = container.getElementsByTagName('canvas');
	if (canvas.length>0) {
		container.removeChild(canvas[0]);
	}
	container.appendChild( renderer.domElement );
}

function drawHelpers() {
	if (gridX) {
		Coordinates.drawGrid({size:10000,scale:0.01});
	}
	if (gridY) {
		Coordinates.drawGrid({size:10000,scale:0.01, orientation:"y"});
	}
	if (gridZ) {
		Coordinates.drawGrid({size:10000,scale:0.01, orientation:"z"});
	}
	if (axes) {
		Coordinates.drawAllAxes({axisLength:200,axisRadius:1,axisTess:50});
	}
}

render = function () {
	var delta = clock.getDelta();
	cameraControls.update(delta);

    camlight.position.copy(camera.position);

    keys.forEach(function (value, index) {
        if (value === true) {
            if (index === 38 && !gemCollisions()) {// up or forward
                rock.position.z -= 5;
                //rock.rotation.x -= 0.1;
                
                //body.position.z -=5;
            }
            if (index === 40) {// down or back
                rock.position.z += 5;
                //rock.rotation.x += 0.1;
               
                // body.position.z +=5;
            }
            if (index === 37) {// left
                rock.position.x -= 5;
                //rock.rotation.y -= 0.1;
                
                //body.position.x -= 5;
            }
            if (index === 39) {// right
                rock.position.x += 5;
                //rock.rotation.y += 0.1;
                
                //body.position.x += 5;
            }
        }
    });

	renderer.render(scene, camera);
};

function animate() {
	window.requestAnimationFrame(animate);
    // CANNON
    /*world.step(1/12);
    body.position.copy(rock.position);
    body.quaternion.copy(rock.quaternion);
    groundBody.position.copy(ground.position);
    groundBody.quaternion.copy(ground.quaternion);*/
    // end CANNON
	render();
}

try {
	init();
	//drawHelpers();
	addToDOM();
	animate();
} catch(e) {
	console.log(e);
}
