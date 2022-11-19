<template>
  <div class="home">
    <button @click="changeButtonStat()" :disabled="!isActive"> Add Water</button>
    <h1>Jumlah air : {{air}} </h1>

  </div>
</template>

<script type="module">
import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import back from '../assets/Daylight-Box_Back.png'
import bottom from '../assets/Daylight-Box_Bottom.png'
import front from '../assets/Daylight-Box_Front.png'
import left from '../assets/Daylight-Box_Left.png'
import right from '../assets/Daylight-Box_Right.png'
import top from '../assets/Daylight-Box_Top.png'

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
      this.camera.position.set(-900,-200,-900);

      this.renderer = new Three.WebGLRenderer({antialias: true});
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(this.renderer.domElement );
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.addEventListener('change',this.renderer);
      this.controls.minDistance = 500;
      this.controls.maxDistance = 1500;
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

      let skyboxGeo = new Three.BoxGeometry(10000,10000,10000);
      this.skybox = new Three.Mesh(skyboxGeo, materialArray);
      this.scene.add(this.skybox);

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
