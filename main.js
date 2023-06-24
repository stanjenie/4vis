import * as THREE from 'https://threejs.org/build/three.module.js';
import { GUI } from 'https://threejs.org/examples/jsm/libs/lil-gui.module.min.js';

var camera, scene, renderer, facemesh, material, stats, options;
var cube = [[100,100,100,100],
  [100,100,-100,100],
  [100,-100,100,100],
  [100,-100,-100,100],
  [-100,100,-100,100],
  [-100,100,100,100],
  [-100,-100,-100,100],
  [-100,-100,100,100]];
var simplex = [[Math.sqrt(5)*25,Math.sqrt(5)*25,Math.sqrt(5)*25,-25],
[Math.sqrt(5)*25,-Math.sqrt(5)*25,-Math.sqrt(5)*25,-25],
[-Math.sqrt(5)*25,Math.sqrt(5)*25,-Math.sqrt(5)*25,-25],
[-Math.sqrt(5)*25,-Math.sqrt(5)*25,Math.sqrt(5)*25,-25],
[0,0,0,100]];
options = {
  rotation: {xw: 0.25, yw: 0.25, zw: 0.25},
};
init();
animate();
function rotate(a,b,angle) {
  var x = Math.cos(angle) * a - Math.sin(angle) * b;
  var y = Math.sin(angle) * a + Math.cos(angle) * b;
  return [x,y];
}


function init() {
  // Renderer.
  renderer = new THREE.WebGLRenderer();
  //renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  // Add renderer to page
  document.body.appendChild(renderer.domElement);

  // Create camera.
  //camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
  camera = new THREE.OrthographicCamera(200 * window.innerWidth / -window.innerHeight, 200 * window.innerWidth / window.innerHeight, -200, 200, 1, 1000)
  camera.position.z = 400;

  // Create scene.
  scene = new THREE.Scene();

  // Create material
  material = new THREE.MeshBasicMaterial({
  wireframe:true,
  transparent: true,
  opacity: 0.5,
  depthTest: false
  });


  var facegeom = new Array(10);
  for (let i = 0; i < facegeom.length; i++) {
  	facegeom[i] = new THREE.BufferGeometry();
  }
  const vertices = new Float32Array([
	-100, -100, 100,
  100, -100, 100,
  100, 100, 100,
    100, 100, 100,
  100, -100, 100,
  -100, -100, 100,
  100, 100, 100,
  -100, 100, 100,
  -100, -100, 100,
  -100, -100, 100,
  -100, 100, 100,
  100, 100, 100,
  ]);
  const indices = [
 		[0,1,2],
    [0,1,3],
    [0,1,4],
    [0,2,3],
    [0,2,4],
    [0,3,4],
    [1,2,3],
    [1,2,4],
    [1,3,4],
    [2,3,4]
  ];
  const verticesb = new Float32Array(6 * indices.length).fill(0);
  
  console.log(indices[5]);
  for (let j = 0; j < indices.length; j++) {
    facegeom[j].setAttribute('position',new THREE.BufferAttribute(new Float32Array(6 * indices.length).fill(0),3));
  	for (let i = 0; i < 3; i++) {
      var [a,b,c] = indices[j];
  		facegeom[j].attributes.position.array[0+i] = simplex[a][i];
    	facegeom[j].attributes.position.array[15+i] = simplex[a][i];
    	facegeom[j].attributes.position.array[3+i] = simplex[b][i];
    	facegeom[j].attributes.position.array[12+i] = simplex[b][i];
    	facegeom[j].attributes.position.array[6+i] = simplex[c][i];
    	facegeom[j].attributes.position.array[9+i] = simplex[c][i];
  	}
 }
  console.log(facegeom[0].attributes.position.array[0]);
  facemesh = new Array(10);
  for (let i = 0; i < 10; i++) {
  	facemesh[i] = new THREE.Mesh(facegeom[i], material);
  	facemesh[i].frustumCulled = false;
  	facemesh[i].traverse(function(obj) { obj.frustumCulled = false; });
  	// const positionAttribute = geometry.getAttribute( 'position' );
  	scene.add(facemesh[i]);
  }
  const gui = new GUI({closed:true});
  const rotgui = gui.addFolder('rotation');
  rotgui.add(options.rotation, 'xw', 0.0, 1.0).name('XW');
  rotgui.add(options.rotation, 'yw', 0.0, 1.0).name('YW');
  rotgui.add(options.rotation, 'zw', 0.0, 1.0).name('ZW');

  // Create ambient light and add to scene.
  var light = new THREE.AmbientLight(0x404040); // soft white light
  scene.add(light);

  // Create directional light and add to scene.
  var directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  // Add listener for window resize.
  window.addEventListener('resize', onWindowResize, false);

  // Add stats to page.
  //stats = new Stats();
  //document.body.appendChild(stats.dom);
}

function animate() {
  requestAnimationFrame(animate);
  for (let i = 0; i < facemesh.length; i++) {
  facemesh[i].rotation.x += 0.005;
  facemesh[i].rotation.y += 0.01;
  renderer.render(scene, camera);
  //mesh.geometry.attributes.position.array[0] = 200;
  //geometry.attributes.position.array[30] = 200;
  //mesh.geometry.attributes.position.array[33] = 200;
  //mesh.geometry.attributes.position.array[51] = 200;
  facemesh[i].geometry.attributes.position.needsUpdate = true;
  }
  const indices = [
 		[0,1,2],
    [0,1,3],
    [0,1,4],
    [0,2,3],
    [0,2,4],
    [0,3,4],
    [1,2,3],
    [1,2,4],
    [1,3,4],
    [2,3,4]
  ];
  for (let j = 0; j < indices.length; j++) {
  	for (let i = 0; i < 3; i++) {
      var [a,b,c] = indices[j];
  		facemesh[j].geometry.attributes.position.array[0+i] = simplex[a][i];
    	facemesh[j].geometry.attributes.position.array[15+i] = simplex[a][i];
    	facemesh[j].geometry.attributes.position.array[3+i] = simplex[b][i];
    	facemesh[j].geometry.attributes.position.array[12+i] = simplex[b][i];
    	facemesh[j].geometry.attributes.position.array[6+i] = simplex[c][i];
    	facemesh[j].geometry.attributes.position.array[9+i] = simplex[c][i];
  	}
 }
 for (let i = 0; i < simplex.length; i++) {
 	  var [x, y] = rotate(simplex[i][0],simplex[i][3],options.rotation.xw / 10);
    simplex[i][0] = x;
    simplex[i][3] = y;
    var [x, y] = rotate(simplex[i][1],simplex[i][3],options.rotation.yw / 10);
    simplex[i][1] = x;
    simplex[i][3] = y;
    var [x, y] = rotate(simplex[i][2],simplex[i][3],options.rotation.zw / 10);
    simplex[i][2] = x;
    simplex[i][3] = y;
 }
  //stats.update();
}

function onWindowResize() {
  const aspect = window.innerWidth / window.innerHeight;
  camera.left = - 200 * aspect;
	camera.right = 200 * aspect;
	camera.top = -200;
	camera.bottom = 200;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
