<template>
  <div class="home">
    <button @click="changeButtonStat()" :disabled="!isActive"> Add Water</button>
    <h1>Jumlah Air: {{air}} </h1>

  </div>
</template>

<script type="module">
import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import back from '../assets/Daylight-Box_Back.png'
import bottom from '../assets/Daylight-Box_Bottom.png'
import front from '../assets/Daylight-Box_Front.png'
import left from '../assets/Daylight-Box_Left.png'
import right from '../assets/Daylight-Box_Right.png'
import top from '../assets/Daylight-Box_Top.png'

var waterometer;

export default {
  data() {
    return {
      renderer : null,
      air : 0,
      count : 0,
      isActive : true,
    };
  },
  mounted() {
    this.init();
    this.animate();
  },
  updated() {
    this.gettingBigger();
  },
  methods: {
    init() {
      this.scene = new Three.Scene();

      this.camera = new Three.PerspectiveCamera(55, window.innerWidth/window.innerHeight, 45, 30000);
      // this.camera.position.z = 0.5;
      this.camera.position.set(45,30,45);

      this.renderer = new Three.WebGLRenderer({antialias: true});
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(this.renderer.domElement );
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.addEventListener('change',this.renderer);
      this.controls.minDistance = 500;
      this.controls.maxDistance = 1500;
      this.controls.rotateSpeed = 0.25;
      // this.camera = new Three.PerspectiveCamera(55, window.innerWidth/window.innerHeight, 45, 30000);

      // let geometry = new Three.BoxGeometry(0.2, 0.2, 0.2);
      // let material = new Three.MeshNormalMaterial();

      // this.mesh = new Three.Mesh(geometry, material);
      // this.scene.add(this.mesh);

      // this.controls.addEventListener(this.camera,this.renderer);

      let materialArray = [];
      let texture_bk = new Three.TextureLoader().load(back);
      let texture_bt = new Three.TextureLoader().load(bottom);
      let texture_ft = new Three.TextureLoader().load(front);
      let texture_lf = new Three.TextureLoader().load(right);
      let texture_rt = new Three.TextureLoader().load(left);
      let texture_tp = new Three.TextureLoader().load(top);
      
      materialArray.push(new Three.MeshBasicMaterial({map: texture_ft}));
      materialArray.push(new Three.MeshBasicMaterial({map: texture_bk}));
      materialArray.push(new Three.MeshBasicMaterial({map: texture_tp}));
      materialArray.push(new Three.MeshBasicMaterial({map: texture_bt}));
      materialArray.push(new Three.MeshBasicMaterial({map: texture_rt}));
      materialArray.push(new Three.MeshBasicMaterial({map: texture_lf}));

      for(let i=0;i<6;i++)
        materialArray[i].side = Three.BackSide;

        const loader = new GLTFLoader()

      const ambientLight = new Three.HemisphereLight(
        0xffffff, // bright sky color
        0x222222, // dim ground color
        1 // intensity
      )
      const mainLight = new Three.DirectionalLight(0xffffff, 4.0)
      mainLight.position.set(10, 10, 10)
      this.scene.add(ambientLight, mainLight)

      loader.load(
        '/three-assets/temp_dog1.glb',
        gltf => {
          var doggo = gltf.scene;
          doggo.scale.set(50, 50, 50);
          this.scene.add(doggo)
          // doggo.position.y = 150;
        },
        undefined,
        undefined
      )

      let skyboxGeo = new Three.BoxGeometry(10000,10000,10000);
      this.skybox = new Three.Mesh(skyboxGeo, materialArray);
      this.scene.add(this.skybox);
      
      // Make the water-o-meter
      const geometry = new Three.SphereGeometry( 25 , 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      const material = new Three.MeshBasicMaterial( { color: 0xE8FFFF, side: Three.BackSide, wireframe: false } );
      material.transparent = true;
      material.opacity = 0.2;
      const sphere1 = new Three.Mesh( geometry, material );
      const sphere2 = new Three.Mesh( geometry, material );
      sphere1.translateY(200).translateX( -100 ).translateZ( 100 );
      sphere2.translateY(-100).translateX( -100 ).translateZ( 100 ).rotateX(Math.PI);
      this.scene.add( sphere1 );
      this.scene.add( sphere2 );

      const cylGeometry1 = new Three.CylinderGeometry(25, 25, 300, 32, 16, true, );
      // const cylMaterial1 = new Three.MeshBasicMaterial( { color: 0xff00ff, side: Three.BackSide, wireframe: true } );
      const cylinder1 = new Three.Mesh( cylGeometry1, material );
      cylinder1.translateY( 50 );
      cylinder1.translateX( -100 );
      cylinder1.translateZ( 100 );
      this.scene.add( cylinder1 );
      let height = this.air/8 * 300;
      const cylGeometry2 = new Three.CylinderGeometry(20, 20, height, 32, 16 );
      const cylMaterial2 = new Three.MeshBasicMaterial( { color: 0x0000ff, side: Three.BackSide } );
      waterometer = new Three.Mesh( cylGeometry2, cylMaterial2 );
      waterometer.translateY( 50 );
      waterometer.translateY(-(300 - height)/2);
      waterometer.translateX( -100 );
      waterometer.translateZ( 100 );
      // waterometer
      this.scene.add( waterometer );

      // const buttonGeometry = new Three.CylinderGeometry(0.1, 0.1, 0.07, 32, 16)
      // const buttonMaterial1 = new Three.MeshBasicMaterial( { color: 0x00ff00, side: Three.BackSide } );
      // const button1 = new Three.Mesh( buttonGeometry, buttonMaterial1 );
      // button1.translateX(-0.4);
      // button1.rotateX(Math.PI/2);
      // this.scene.add( button1 );

      // const buttonMaterial2 = new Three.MeshBasicMaterial( { color: 0xff0000, side: Three.BackSide } );
      // const button2 = new Three.Mesh( buttonGeometry, buttonMaterial2 );
      // button2.translateX(-0.7);
      // button2.rotateX(Math.PI/2);
      // this.scene.add( button2 );

      this.animate();
    },
    animate() {
        this.renderer.render(this.scene, this.camera)
        requestAnimationFrame(this.animate);
        // this.skybox.rotation.x = this.skybox.rotation.x + 0.01;
        // this.skybox.rotation.y += 0.02;
        this.controls.update()
        // console.log( this.mesh.rotation.y += 0.02)
    },
  gettingBigger() {
    console.log(this.air)
    if (this.air == 4) {
      this.renderer.clear();
      this.scene.remove(this.mesh);
      let geometry = new Three.CircleGeometry( 1, 8, 0, 6.283185307179586 );
      let material = new Three.MeshBasicMaterial( { color: 0xffff00 } );

      this.mesh = new Three.Mesh(geometry, material);
      this.scene.add(this.mesh);

      this.animate();

    }
  },
  changeButtonStat() {
    this.air += 1;
    console.log(this.air);
    if(this.air <= 8) {
      waterometer.geometry.dispose();
      waterometer.geometry = new Three.CylinderGeometry(20, 20, this.air/8 * 300, 32, 16 );
      waterometer.position.y = (-(200 - this.air/8 * 300)/2);
    }

    this.isActive = false;
    var x = setInterval(() => {    
               this.isActive = false;
               this.count++;
               if (this.count == 3) {
                this.count = 0;
                this.isActive = true;
                clearInterval(x);
               }  
          }, 1000);        
     },
},
}
</script>
