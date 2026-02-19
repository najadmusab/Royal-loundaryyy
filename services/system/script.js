const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
75,
window.innerWidth/window.innerHeight,
0.1,
1000
);

const renderer = new THREE.WebGLRenderer({alpha:true});
renderer.setSize(
document.getElementById("canvas-container").clientWidth,
document.getElementById("canvas-container").clientHeight
);

document.getElementById("canvas-container").appendChild(renderer.domElement);

/* LIGHT */
const light = new THREE.PointLight(0x00eaff,2);
light.position.set(5,5,5);
scene.add(light);

/* WASHER SHAPE */
const geometry = new THREE.CylinderGeometry(1.5,1.5,2,32);
const material = new THREE.MeshStandardMaterial({
color:0x4fd1ff,
metalness:.7,
roughness:.2
});

const washer = new THREE.Mesh(geometry,material);
scene.add(washer);

camera.position.z =5;

/* ANIMATE */
function animate(){
requestAnimationFrame(animate);
washer.rotation.y +=0.01;
renderer.render(scene,camera);
}

animate();
