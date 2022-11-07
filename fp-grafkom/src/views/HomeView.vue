<template>
  <div class="home">
    <button @click="changeButtonStat()" :disabled="!isActive"> Add Water</button>
    <h1>Jumlah air : {{air}} </h1>

  </div>
</template>

<script type="module">
import * as Three from 'three'
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

      this.camera = new Three.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.01, 10);
      this.camera.position.z = 1;

      this.scene = new Three.Scene();

      let geometry = new Three.BoxGeometry(0.2, 0.2, 0.2);
      let material = new Three.MeshNormalMaterial();

      this.mesh = new Three.Mesh(geometry, material);
      this.scene.add(this.mesh);

      this.renderer = new Three.WebGLRenderer({antialias: true});
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(this.renderer.domElement );

    },
    animate() {
        requestAnimationFrame(this.animate);
        this.mesh.rotation.x = this.mesh.rotation.x + 0.01;
        this.mesh.rotation.y += 0.02;
        this.renderer.render(this.scene, this.camera)
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
