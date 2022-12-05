import "./styles/styles.css"
<template>
    <button @click="changeButtonStat()" :disabled="!isActive" class="btn"> Add Water</button>
    <div class="row box">
      <div class="column"><h1 class="puppy"> PUPPY </h1></div>
      <div class="column jumlah-air"><h1>Jumlah Air: {{ air }} </h1></div>
    </div>
  <div class="welcome-text">
  <h2 class="welcome-back">Welcome Back,</h2>
  <h1 class="name">Fadhil</h1>
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
      this.camera.position.set(0, 10,45);

      this.renderer = new Three.WebGLRenderer({antialias: true});
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(this.renderer.domElement );
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);

      this.controls.update();

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
      mainLight.position.set(15, 8, 10)
      this.scene.add(ambientLight, mainLight)

      loader.load(
        '/three-assets/dog1.gltf',
        gltf => {
          var doggo = gltf.scene;
          doggo.scale.set(200, 200, 200);
          // doggo.rotateY(-Math.PI/7)
          doggo.rotateY(-600)
          this.scene.add(doggo)
          doggo.position.y = -17;
        },
        undefined,
        undefined
      )

      let skyboxGeo = new Three.BoxGeometry(10000,10000,10000);
      this.skybox = new Three.Mesh(skyboxGeo, materialArray);
      this.scene.add(this.skybox);
      
      // Make the water-o-meter
      // const geometry = new Three.SphereGeometry( 25 , 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      const material = new Three.MeshPhysicalMaterial({
        metalness: 0.888,
        roughness: .05,
        envMapIntensity: 0.9,
        clearcoat: 1,
        transparent: true,
        // transmission: .95,
        opacity: .5,
        reflectivity: 0.2,
        refractionRatio: 0.985,
        ior: 0.9,
        side: Three.BackSide,
      });
      material.transparent = true;
      material.opacity = 0.3;
      // const sphere1 = new Three.Mesh( geometry, material );
      // const sphere2 = new Three.Mesh( geometry, material );
      // sphere1.translateY(200).translateX( -100 );
      // sphere2.translateY(-100).translateX( -100 ).rotateX(Math.PI);
      // this.scene.add( sphere1 );
      // this.scene.add( sphere2 );

      // const cylGeometry1 = new Three.CylinderGeometry(25, 25, 200, 32, 16, true, );
      const cylGeometry1 = new Three.CapsuleGeometry(25, 200, 32, 16 );
      // const cylMaterial1 = new Three.MeshBasicMaterial( { color: 0xff00ff, side: Three.BackSide, wireframe: true } );
      const cylinder1 = new Three.Mesh( cylGeometry1, material );
      cylinder1.translateY( 50 );
      cylinder1.translateX( -280 );
      // cylinder1.translateZ( 100 );
      this.scene.add( cylinder1 );
      let height = this.air/8 * 200;
      // const waterGeo = new Three.CylinderGeometry(20, 20, height, 32, 16 );
      const waterGeo = new Three.CapsuleGeometry(20, height, 32, 16 );
      const cylMaterial2 = new Three.MeshBasicMaterial( { color: 0xa9dcec, 
        transparent: true,
        opacity: 0.7,
        reflectivity: 0.2,
        refractionRatio: 0.5,
        side: Three.BackSide 
      } );
      waterometer = new Three.Mesh( waterGeo, cylMaterial2 );
      waterometer.translateY(-(100 - height)/2);
      waterometer.translateX( -280 );
      // waterometer
      this.scene.add( waterometer );

      this.drawGround();
      this.drawMountain();


      // Button
      var airY, airZ;
      airY = -100;
      airZ = 120;
      var airAtasRad = 92.364
      var airBawah = new Three.SphereGeometry(50/4 , 32, 16, 0);
      var airAtas = new Three.ConeGeometry(airAtasRad/8, 111.48/4, 32);
      const airMat = new Three.MeshBasicMaterial( { color: 0xa9dcec } );
      const airBawahMesh = new Three.Mesh( airBawah, airMat );
      const airAtasMesh = new Three.Mesh( airAtas, airMat );
      airBawahMesh.translateY(airY).translateZ(airZ);
      airAtasMesh.translateY(airY + 19.129/4 + (111.48/8)).translateZ(airZ);

      this.scene.add( airBawahMesh );
      this.scene.add( airAtasMesh );

      const buttonGeo = new Three.SphereGeometry( 35 , 32, 16, 0)
      const buttonMat = material;
      const button = new Three.Mesh( buttonGeo, buttonMat);

      button.translateY(airY+10).translateZ(airZ);

      this.scene.add( button );
      
      this.animate();
    },
    drawGround() {


      // remap value from the range of [smin,smax] to [emin,emax]
      const map = (val, smin, smax, emin, emax) => (emax-emin)*(val-smin)/(smax-smin) + emin
      const jitter = (geo, per) => {
      var vertices = geo.geometry.attributes.position.array;
      
      for (let i = 0; i < vertices.length; i=i+3) {
        vertices[i] += map(Math.random(),0,1,-per,per)
        vertices[i+1]+= map(Math.random(),0,1,-per,per)
        vertices[i+2] += map(Math.random(),0,1,-per,per)    
      }
      };
      //randomly displace the x,y,z coords by the `per` value

      this.ground = new Three.Group();
      const tanah = new Three.CylinderGeometry( 3.45, 11.42,12.642, 15);


     const earthMaterial = new Three.MeshPhongMaterial({ color: 0x9d3f60, flatShading: true });
      
      const dasar = new Three.Mesh(tanah, earthMaterial)
      jitter(dasar, 0.6)





      const tanah_atas = new Three.CylinderGeometry(8.43, 11.42, 2.8, 24, 2);
      const atasMaterial = new Three.MeshPhongMaterial({ color: 0xec74c6, flatShading: true });
      const atas = new Three.Mesh(tanah_atas, atasMaterial)
      jitter(atas, 0)
      atas.scale.set(1.1, 1.2, 1.2)
      atas.translateY(-5.298)

      const tanah_bawah = new Three.TetrahedronGeometry(1.311, 2);
      const bawah = new Three.Mesh(tanah_bawah, earthMaterial)
      jitter(bawah, 0);
      bawah.scale.set(3.4, 1.3, 3);
      bawah.translateY(6.0)

      this.ground.add(atas);
      this.ground.add(dasar);
      this.ground.add(bawah);

      this.scene.add(this.ground);

      this.ground.scale.set(15,15, 15)
      this.ground.rotateX(Math.PI)
      this.ground.translateY(117)
      // this.ground.translateY(7)
      this.ground.translateZ(80)
    },
    animate() {
        this.renderer.render(this.scene, this.camera)
        requestAnimationFrame(this.animate);
        // this.skybox.rotation.x = this.skybox.rotation.x + 0.01;
        // this.skybox.rotation.y += 0.02;
        this.controls.update()
        // console.log( this.mesh.rotation.y += 0.02)
    },
  drawMountain() {
      // remap value from the range of [smin,smax] to [emin,emax]
      const map = (val, smin, smax, emin, emax) => (emax-emin)*(val-smin)/(smax-smin) + emin
      const jitter = (geo, per) => {
      var vertices = geo.geometry.attributes.position.array;
      
      for (let i = 0; i < vertices.length; i=i+3) {
        vertices[i] += map(Math.random(),0,1,-per,per)
        vertices[i+1]+= map(Math.random(),0,1,-per,per)
        vertices[i+2] += map(Math.random(),0,1,-per,per)    
      }
      };

      const chopBottom = (geo, bottom) => {
      var vertices = geo.geometry.attributes.position.array;
      
      for (let i = 0; i < vertices.length; i=i+3) {
        vertices[i+2] = Math.max(vertices[i+2], bottom)
      }
    };

      this.mountains = new Three.Group();
      const gunung1 = new Three.CylinderGeometry(0.5, 2, 13, 6)
      const gunungMaterial = new Three.MeshPhongMaterial({ color: 0x232323, flatShading: true });
      const gunung_satu = new Three.Mesh(gunung1, gunungMaterial);

      const gunung2 = new Three.ConeGeometry(4, 8)

      const gunung_dua = new Three.Mesh(gunung2, gunungMaterial);
      chopBottom(gunung_dua, 0.5)

     
      gunung_dua.translateY(-1.6)
      // gunung_dua.translateZ(3)
      // gunung_dua.translateX(-10)
      // gunung_dua.rotateY(Math.PI/4)
      gunung_dua.rotateY(Math.PI/2)
      gunung_dua.translateZ(-8)
      gunung_dua.translateX(-5)

      jitter(gunung_satu, 0.05)

      this.mountains.add(gunung_satu);
      this.mountains.add(gunung_dua);
      this.scene.add(this.mountains);

      this.mountains.scale.set(15,15, 15)
      this.mountains.translateZ(-140)
      this.mountains.translateY(50)
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
      // waterometer.geometry = new Three.CylinderGeometry(20, 20, this.air/8 * 200, 32, 16 );
      waterometer.geometry = new Three.CapsuleGeometry(20, this.air/8 * 200, 32, 16 );
      waterometer.position.y = (-(100 - this.air/8 * 200)/2);
    }

    // this.isActive = false;
    // var x = setInterval(() => {    
    //            this.isActive = false;
    //            this.count++;
    //            if (this.count == 3) {
    //             this.count = 0;
    //             this.isActive = true;
    //             clearInterval(x);
    //            }  
    //       }, 1000);        
     },
},
}
</script>
