let  camera, renderer, cube, sphere1, sphere2, cylinder1, cylinder2, controls, cylMaterial2;
let defHeight = 0;
let hScale = 1;
const delta = 6;
let startX;
let startY;
let rotateX = 0;
let rotateY = 0;

let value = 0;
function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    // controls = new OrbitControls( camera, renderer.domElement);

    camera.position.set( 0, 0, 1 );
    // controls.update();

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    document.body.appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry( 0.1 , 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const material = new THREE.MeshBasicMaterial( { color: 0xE8FFFF, side: THREE.BackSide, wireframe: false } );
    material.transparent = true;
    material.opacity = 0.2;
    sphere1 = new THREE.Mesh( geometry, material );
    sphere2 = new THREE.Mesh( geometry, material );
    sphere1.translateY(0.5);
    sphere2.translateY(-0.5).rotateX(Math.PI);
    scene.add( sphere1 );
    scene.add( sphere2 );

    const cylGeometry1 = new THREE.CylinderGeometry(0.1, 0.1, 1, 32, 16, openEnded=true, );
    // const cylMaterial1 = new THREE.MeshBasicMaterial( { color: 0xff00ff, side: THREE.BackSide, wireframe: true } );
    cylinder1 = new THREE.Mesh( cylGeometry1, material );
    scene.add( cylinder1 );

    const cylGeometry2 = new THREE.CylinderGeometry(0.08, 0.08, defHeight, 32, 16 );
    cylMaterial2 = new THREE.MeshBasicMaterial( { color: 0x0000ff, side: THREE.BackSide } );
    cylinder2 = new THREE.Mesh( cylGeometry2, cylMaterial2 );
    cylinder2.translateY(-(1 - defHeight)/2);
    // cylinder2
    scene.add( cylinder2 );

}

function animate() {
    requestAnimationFrame(animate);
    // value = document.querySelector('input[name="value"]:checked').value;
    if(value != document.querySelector('input[name="value"]:checked').value) {
        value = document.querySelector('input[name="value"]:checked').value;
        defHeight = value / 8;
        console.log(defHeight);
        cylinder2.geometry.dispose();
        cylinder2.geometry = new THREE.CylinderGeometry(0.08, 0.08, defHeight, 32, 16 );
        cylinder2.position.y = (-(1 - defHeight)/2);
    }
    cylinder2.hei
    // sphere.rotation.y = rotateX;
    // sphere.rotation.x = -rotateY;
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

}

window.addEventListener('resize', onWindowResize);

// window.addEventListener('mousedown', function (event) {
//     startX = event.pageX;
//     startY = event.pageY;
//   });
  
//   window.addEventListener('mouseup', function (event) {
//     const diffX = event.pageX - startX;
//     const diffY = event.pageY - startY;
//     console.log("diffX", diffX)
//     console.log("diffY", diffY)
//     rotateX += diffX / 1000;
//     rotateY -= diffY / 1000;
//     if (diffX < delta && diffY < delta) {
//       // Click!
//     }
//   });

init();

animate();