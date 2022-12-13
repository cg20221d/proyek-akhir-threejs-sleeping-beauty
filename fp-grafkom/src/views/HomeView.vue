<template>
  <!-- <button @click="changeButtonStat()" :disabled="!isActive" class="btn"> Add Water</button> -->
  <div class="row box">
    <!-- <div class="column"><h1 class="puppy"> PUPPY </h1></div>
      <div class="column jumlah-air"><h1>Jumlah Air: {{ air }} </h1></div> -->
  </div>
  <!-- <div class="welcome-text">
  <h2 class="welcome-back">Welcome Back,</h2>
  <h1 class="name">Fadhil</h1> 
  <audio 
  autoplay
  loop
  src="proyek-akhir-threejs-sleeping-beauty/fp-grafkom/src/assets/Dorothy (Remastered).mp3"></audio>
  </div> -->
</template>

<script type="module">
import * as Three from 'three'
import * as Tween from '@tweenjs/tween.js'
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import back from '../assets/Daylight-Box_Back.png'
import bottom from '../assets/Daylight-Box_Bottom.png'
import front from '../assets/Daylight-Box_Front.png'
import left from '../assets/Daylight-Box_Left.png'
import right from '../assets/Daylight-Box_Right.png'
import top from '../assets/Daylight-Box_Top.png'
import sun from '../assets/sun8.jpg'
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { EffectComposer } from "/node_modules/three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "/node_modules/three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "/node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js";

const firebaseConfig = {
  apiKey: "AIzaSyC0APgcvMKt4XU3jRB0fO9HAX3_doI3m48",
  authDomain: "minumbre-4fb57.firebaseapp.com",
  projectId: "minumbre-4fb57",
  storageBucket: "minumbre-4fb57.appspot.com",
  messagingSenderId: "74620809112",
  appId: "1:74620809112:web:a35484864d4da508f985ed"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let simpleNoise = `
    float N (vec2 st) { // https://thebookofshaders.com/10/
        return fract( sin( dot( st.xy, vec2(12.9898,78.233 ) ) ) *  43758.5453123);
    }
    
    float smoothNoise( vec2 ip ){ // https://www.youtube.com/watch?v=zXsWftRdsvU
    	vec2 lv = fract( ip );
      vec2 id = floor( ip );
      
      lv = lv * lv * ( 3. - 2. * lv );
      
      float bl = N( id );
      float br = N( id + vec2( 1, 0 ));
      float b = mix( bl, br, lv.x );
      
      float tl = N( id + vec2( 0, 1 ));
      float tr = N( id + vec2( 1, 1 ));
      float t = mix( tl, tr, lv.x );
      
      return mix( b, t, lv.y );
    }
  `;

import "./styles/styles.css"
// import { EffectComposer } from "/node_modules/three/examples/jsm/postprocessing/EffectComposer.js";
// import { RenderPass } from "/node_modules/three/examples/jsm/postprocessing/RenderPass.js";
// import { UnrealBloomPass } from "/node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js";

var waterometer;
var doggo;
var sphere;
var cloud;

const textureLoader = new Three.TextureLoader();

export default {
  data() {
    return {
      renderer: null,
      air: 0,
      count: 0,
      isActive: true,
      pointer: null,
      raycaster: null,
      user: [],
      username: "CNzGlvwWnNfZxzQW1Cz0",
      level: 0,
      mixer: 0,
      clock: new Three.Clock(),
    };
  },
  mounted() {
    this.load();
    this.init();
    this.animate();
  },

  methods: {
    async load() {
      try {
        //   const querySnapshot = await getDocs(collection(db, "TestCollection"));
        const querySnapshot = await getDocs(collection(db, "TestCollection", this.username, "animals"));
        querySnapshot.forEach((doc) => {
          console.log(doc.data());
          this.user.push(doc.data());
        })
        console.log(this.user);
      }
      catch {
        console.log("error");
      }
    },
    init() {
      this.scene = new Three.Scene();

      this.camera = new Three.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 45, 30000);
      // this.camera.position.z = 0.5;
      this.camera.position.set(0, 10, 45);

      this.renderer = new Three.WebGLRenderer({ antialias: true });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(this.renderer.domElement);
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

      materialArray.push(new Three.MeshBasicMaterial({ map: texture_ft }));
      materialArray.push(new Three.MeshBasicMaterial({ map: texture_bk }));
      materialArray.push(new Three.MeshBasicMaterial({ map: texture_tp }));
      materialArray.push(new Three.MeshBasicMaterial({ map: texture_bt }));
      materialArray.push(new Three.MeshBasicMaterial({ map: texture_rt }));
      materialArray.push(new Three.MeshBasicMaterial({ map: texture_lf }));

      for (let i = 0; i < 6; i++)
        materialArray[i].side = Three.BackSide;

      const loader = new GLTFLoader()

      const ambientLight = new Three.HemisphereLight(
        0xffffff, // bright sky color
        0x222222, // dim ground color
        1 // intensity
      )
      const mainLight = new Three.DirectionalLight(0xffffff, 4.0)
      mainLight.position.set(15, 8, -3)
      this.scene.add(ambientLight, mainLight)
      loader.load(
        '/three-assets/dog1.gltf',
        gltf => {
          doggo = gltf.scene;
          doggo.scale.set(120, 120, 120);
          // doggo.rotateY(-Math.PI/7)
          doggo.rotateY(-600)
          this.scene.add(doggo)
          doggo.position.y = -17;
          this.level = 1;

          this.mixer = new Three.AnimationMixer(doggo);

          const clips = gltf.animations;
          const clip = Three.AnimationClip.findByName(clips, 'ArmatureAction');
          const action = this.mixer.clipAction(clip);
          action.play();
        },
        undefined,
        undefined
      )


      let skyboxGeo = new Three.BoxGeometry(10000, 10000, 10000);
      this.skybox = new Three.Mesh(skyboxGeo, materialArray);
      this.skybox.name = "Skybox";
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
        ior: 0.9,
        side: Three.BackSide,
      });
      material.transparent = true;
      material.opacity = 0.3;

      // const cylGeometry1 = new Three.CylinderGeometry(25, 25, 200, 32, 16, true, );
      const cylGeometry1 = new Three.CapsuleGeometry(25, 200, 32, 16);
      // const cylMaterial1 = new Three.MeshBasicMaterial( { color: 0xff00ff, side: Three.BackSide, wireframe: true } );
      const cylinder1 = new Three.Mesh(cylGeometry1, material);
      cylinder1.translateY(50);
      cylinder1.translateX(-280);
      // cylinder1.translateZ( 100 );
      this.scene.add(cylinder1);
      let height = this.air / 8 * 200;
      // const waterGeo = new Three.CylinderGeometry(20, 20, height, 32, 16 );
      const waterGeo = new Three.CapsuleGeometry(20, height, 32, 16);
      const cylMaterial2 = new Three.MeshBasicMaterial({
        color: 0xa9dcec,
        transparent: true,
        opacity: 0.7,
        reflectivity: 0.2,
        refractionRatio: 0.5,
        side: Three.BackSide
      });
      waterometer = new Three.Mesh(waterGeo, cylMaterial2);
      waterometer.translateY(-(100 - height) / 2);
      waterometer.translateX(-280);
      // waterometer
      this.scene.add(waterometer);

      this.drawGround();
      this.drawMountain();

      // rumput
      const WIDTH = window.innerWidth;
      const HEIGHT = window.innerHeight;
      const camera = new Three.PerspectiveCamera(55, WIDTH / HEIGHT, 45, 30000);
      camera.position.set(100, 100, 100);

      const renderer = new Three.WebGLRenderer({ antialias: true });
      document.body.appendChild(renderer.domElement);

      ////////////
      // MATERIAL
      ////////////

      const vertexShader = `
  varying vec2 vUv;
  uniform float time;
  
  ${simpleNoise}
  
	void main() {

    vUv = uv;
    float t = time * 2.;
    
    // VERTEX POSITION
    
    vec4 mvPosition = vec4( position, 1.0 );
    #ifdef USE_INSTANCING
    	mvPosition = instanceMatrix * mvPosition;
    #endif
    
    // DISPLACEMENT
    
    float noise = smoothNoise(mvPosition.xz * 0.5 + vec2(0., t));
    noise = pow(noise * 0.5 + 0.5, 2.) * 2.;
    
    // here the displacement is made stronger on the blades tips.
    float dispPower = 1. - cos( uv.y * 3.1416 * 0.5 );
    
    float displacement = noise * ( 0.3 * dispPower );
    mvPosition.z -= displacement;
    
    //
    
    vec4 modelViewPosition = modelViewMatrix * mvPosition;
    gl_Position = projectionMatrix * modelViewPosition;

	}
`;

      const fragmentShader = `
  varying vec2 vUv;
  
  void main() {
  	vec3 baseColor = vec3( 0.41, 1.0, 0.5 );
    float clarity = ( vUv.y * 0.875 ) + 0.125;
    gl_FragColor = vec4( baseColor * clarity, 1 );
  }
`;

      const uniforms = {
        time: {
          value: 0
        }
      }

      const leavesMaterial = new Three.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        side: Three.DoubleSide
      });

      /////////
      // MESH
      /////////

      const instanceNumber = 100000;
      const dummy = new Three.Object3D();

      // const Tanah_Atas = new Three.CylinderGeometry(8.43, 11.42, 2.8, 24, 2);
      const Geometry = new Three.PlaneGeometry(0.1, 1, 1, 4);
      Geometry.translate(0, 0.5, 0); // move grass blade geometry lowest point at 0.

      const instancedMesh = new Three.InstancedMesh(Geometry, leavesMaterial, instanceNumber);


      // Position and scale the grass blade instances randomly.

      for (let i = 0; i < instanceNumber; i++) {
        var x = Math.random();
        var max = Math.sqrt(1 - (x * x));
        var z = Math.random() * max * 1.08;
        dummy.position.set(
          ((Math.random() < 0.5 ? -1 : 1) * x) * 190,
          -15,
          ((Math.random() < 0.5 ? -1 : 1) * z - 0.422) * 190
        );

        dummy.scale.setScalar(0.5 + Math.random() * 10);

        dummy.rotation.y = Math.random() * Math.PI;

        dummy.updateMatrix();
        instancedMesh.setMatrixAt(i, dummy.matrix);

      }
      this.scene.add(instancedMesh);

      //sphere

      const renderScene = new RenderPass(this.scene, this.camera);
const bloomPass = new UnrealBloomPass(
  new Three.Vector2(window.innerWidth, window.innerHeight),
  1.5,
  0.4,
  0.85
);
bloomPass.threshold = 10;
bloomPass.strength = 10; //intensity of glow
bloomPass.radius = 10;
const bloomComposer = new EffectComposer(this.renderer);
bloomComposer.setSize(window.innerWidth, window.innerHeight);
bloomComposer.renderToScreen = true;
bloomComposer.addPass(renderScene);
bloomComposer.addPass(bloomPass);

      const geometry = new Three.SphereGeometry(45, 62, 46);
      const material_sphr = new Three.MeshBasicMaterial({
        color: 0xfaeab1,
        map: textureLoader.load(sun)
      });
      sphere = new Three.Mesh(geometry, material_sphr);
      sphere.translateX(150);
      sphere.translateY(250);
      
      this.scene.add(sphere);
      bloomComposer.setSize(window.innerWidth, window.innerHeight);
      this.scene.add(bloomComposer);
      // const renderScene = new RenderPass(this.scene, this.camera);
      // const bloomPass = new UnrealBloomPass(
      //   new Three.Vector2(window.innerWidth, window.innerHeight),
      //   1.5,
      //   0.4,
      //   0.85
      // );
      // bloomPass.threshold = 0;
      // bloomPass.strength = 2; //intensity of glow
      // bloomPass.radius = 0;
      // const bloomComposer = new EffectComposer(this.renderer);
      // bloomComposer.setSize(window.innerWidth, window.innerHeight);
      // bloomComposer.renderToScreen = true;
      // bloomComposer.addPass(renderScene);
      // bloomComposer.addPass(bloomPass);

      // const color = new THREE.Color("#FDB813");
      // const geometry = new THREE.IcosahedronGeometry(1, 15);
      // const material = new THREE.MeshBasicMaterial({ color: color });
      // const sphere = new THREE.Mesh(geometry, material);
      // sphere.position.set(0, 0, 0);
      // sphere.layers.set(1);
      // scene.add(sphere);


      // environment
      var shapeOne = new Three.Mesh(
        new Three.OctahedronGeometry(20, 1),
        new Three.MeshStandardMaterial({
          color: 0xff0051,
          metalness: 0,
          roughness: 1
        })
      );
      shapeOne.position.y += 200;
      shapeOne.position.x += -40;

      var shapeTwo = new Three.Mesh(
        new Three.OctahedronGeometry(5, 1),
        new Three.MeshStandardMaterial({
          color: 0x47689b,
          metalness: 0,
          roughness: 0.8
        })
      );
      shapeTwo.position.y += 200;
      shapeTwo.position.x += -80;

      this.scene.add(shapeOne, shapeTwo);

      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = Three.PCFSoftShadowMap;

      var pointLight = new Three.PointLight(0xffffff, 1);
      pointLight.position.set(25, 50, 25);
      this.scene.add(pointLight);

      shapeOne.castShadow = true;
      shapeOne.receiveShadow = true;
      shapeTwo.castShadow = true;
      shapeTwo.receiveShadow = true;

      var shadowMaterial = new Three.ShadowMaterial({ color: 0xeeeeee });
      shadowMaterial.opacity = 0.5;

      //cloud
      // const geo = new Three.BufferGeometry()

      const tuft1 = new Three.SphereGeometry(15.5,21,10.5)
      tuft1.translate(-30,400,0)

      const tuft2 = new Three.SphereGeometry(15.5,21,10.5)
      tuft2.translate(30,400,0)

      const tuft3 = new Three.SphereGeometry(25.0,21,10.5)
      tuft3.translate(0,405,0)

      const geo_cld = BufferGeometryUtils.mergeBufferGeometries([tuft1, tuft2, tuft3]);

      cloud = new Three.Mesh(
          geo_cld,
          new Three.MeshLambertMaterial({
              color:'white',
              flatShading:true,
          })
      )

      this.scene.add(cloud);

      function animate_env() {
        shapeOne.rotateY(0.04);
        sphere.rotateY(0.004);
        cloud.rotateZ(0.004);
      }

      this.renderer.setAnimationLoop(animate_env);

      // Button
      var airY, airZ;
      airY = -100;
      airZ = 120;
      var airAtasRad = 92.364
      var airBawah = new Three.SphereGeometry(50 / 4, 32, 16, 0);
      var airAtas = new Three.ConeGeometry(airAtasRad / 8, 111.48 / 4, 32);
      const airMat = new Three.MeshBasicMaterial({ color: 0xa9dcec });
      const airBawahMesh = new Three.Mesh(airBawah, airMat);
      const airAtasMesh = new Three.Mesh(airAtas, airMat);
      airBawahMesh.translateY(airY).translateZ(airZ);
      airAtasMesh.translateY(airY + 19.129 / 4 + (111.48 / 8)).translateZ(airZ);

      this.scene.add(airBawahMesh);
      this.scene.add(airAtasMesh);

      const buttonGeo = new Three.SphereGeometry(35, 32, 16, 0)
      const buttonMat = material;
      const button = new Three.Mesh(buttonGeo, buttonMat);
      button.name = "button";
      button.translateY(airY + 10).translateZ(airZ);

      this.scene.add(button);

      // For mouse interaction
      this.pointer = new Three.Vector2();
      this.raycaster = new Three.Raycaster();

      const audio = new Audio("fp-grafkom/src/assets/Drinking sound effect.mp3");

      const onMouseDown = (event) => {
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.pointer, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children);
        // console.log(intersects.length);
        for (let i = 0; i < intersects.length; i++) {
          if (intersects[i].object.name == "button") {
            this.changeButtonStat();
            audio.play();
          }
        }
      };

      window.addEventListener("mousedown", onMouseDown);
      this.animate();
    },
    drawGround() {
      const rockTexture = new Three.TextureLoader().load('mountain.jpeg')
      const groundTexture = new Three.TextureLoader().load('ground.jpeg')

      rockTexture.wrapS = Three.RepeatWrapping;
      rockTexture.wrapT = Three.RepeatWrapping;
      rockTexture.repeat.set(2, 2);

      // remap value from the range of [smin,smax] to [emin,emax]
      const map = (val, smin, smax, emin, emax) => (emax - emin) * (val - smin) / (smax - smin) + emin
      const jitter = (geo, per) => {
        var vertices = geo.geometry.attributes.position.array;

        for (let i = 0; i < vertices.length; i = i + 3) {
          vertices[i] += map(Math.random(), 0, 1, -per, per)
          vertices[i + 1] += map(Math.random(), 0, 1, -per, per)
          vertices[i + 2] += map(Math.random(), 0, 1, -per, per)
        }
      };
      //randomly displace the x,y,z coords by the `per` value

      this.ground = new Three.Group();
      const tanah = new Three.CylinderGeometry(3.45, 11.42, 12.642, 15);


      const earthMaterial = new Three.MeshPhongMaterial({ color: 0x9d3f60, flatShading: true, map: rockTexture });

      const dasar = new Three.Mesh(tanah, earthMaterial)
      jitter(dasar, 0.6)

      const tanah_atas = new Three.CylinderGeometry(8.43, 11.42, 2.8, 24, 2);
      const atasMaterial = new Three.MeshPhongMaterial({ color: 0xec74c6, flatShading: true, map: groundTexture });
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

      this.ground.scale.set(15, 15, 15)
      this.ground.rotateX(Math.PI)
      this.ground.translateY(117)
      // this.ground.translateY(7)
      this.ground.translateZ(80)

    },
    animate() {
      Tween.update();
      if (this.mixer)
        this.mixer.update(this.clock.getDelta());
      this.renderer.render(this.scene, this.camera)
      requestAnimationFrame(this.animate);
      // this.skybox.rotation.x = this.skybox.rotation.x + 0.01;
      // this.skybox.rotation.y += 0.02;
      this.controls.update()
      // console.log( this.mesh.rotation.y += 0.02)
    },
    drawMountain() {
      const rockTexture = new Three.TextureLoader().load('mountain.jpeg')
      rockTexture.wrapS = Three.RepeatWrapping;
      rockTexture.wrapT = Three.RepeatWrapping;
      rockTexture.repeat.set(2, 2);
      // remap value from the range of [smin,smax] to [emin,emax]


      const chopBottom = (geo, bottom) => {
        var vertices = geo.geometry.attributes.position.array;

        for (let i = 0; i < vertices.length; i = i + 3) {
          vertices[i + 2] = Math.max(vertices[i + 2], bottom)
        }
      };

      const chopY = (geo, bottom) => {
        var vertices = geo.geometry.attributes.position.array;

        for (let i = 0; i < vertices.length; i = i + 3) {
          vertices[i + 1] = Math.max(vertices[i + 1], bottom)
        }
      };

      const chopX = (geo, bottom) => {
        var vertices = geo.geometry.attributes.position.array;

        for (let i = 0; i < vertices.length; i = i + 3) {
          vertices[i] = Math.max(vertices[i], bottom)
        }
      };
      this.mountains = new Three.Group();
      const gunung1 = new Three.CylinderGeometry(1.2, 3, 10, 8)
      const gunungMaterial = new Three.MeshPhongMaterial({ color: 0x232323, flatShading: true, map: rockTexture });
      const gunung_satu = new Three.Mesh(gunung1, gunungMaterial);
      chopY(gunung_satu, 0.5)
      gunung_satu.translateY(-5)
      gunung_satu.translateX(-1)

      const gunung2 = new Three.ConeGeometry(5, 8)

      const gunung_dua = new Three.Mesh(gunung2, gunungMaterial);
      chopBottom(gunung_dua, 0.5)

      gunung_dua.translateY(-0.55)
      gunung_dua.translateX(-6.1)

      gunung_dua.rotateY(Math.PI / 2)
      // gunung_dua.translateZ()
      gunung_dua.translateX(-3.35)


      // jitter(gunung_dua, 0.8)


      const gunung3 = new Three.ConeGeometry(4, 7.5)

      const gunung_tiga = new Three.Mesh(gunung3, gunungMaterial);
      chopBottom(gunung_tiga, 0.5)

      gunung_tiga.translateY(-0.6)
      gunung_tiga.translateX(-6.1)

      gunung_tiga.rotateY(Math.PI)

      gunung_tiga.translateZ(-3)

      gunung_tiga.rotateY(-Math.PI / 9)
      //  jitter(gunung_tiga, 0.8)


      const gunung4 = new Three.CylinderGeometry(2, 3.5, 8, 8)

      const gunung_empat = new Three.Mesh(gunung4, gunungMaterial);
      chopY(gunung_empat, 0.5)
      gunung_empat.translateX(-8)
      gunung_empat.translateZ(4.5)
      gunung_empat.translateY(-4.8)
      // jitter(gunung_empat, 0.008)

      const gunung5 = new Three.CylinderGeometry(0.5, 3.2, 14, 8)
      const gunung_lima = new Three.Mesh(gunung5, gunungMaterial);
      chopY(gunung_lima, 0.5)
      // jitter(gunung_lima, 0.08)
      gunung_lima.translateX(3)
      gunung_lima.translateY(-5)


      const gunung6 = new Three.ConeGeometry(4, 7.5)

      const gunung_enam = new Three.Mesh(gunung6, gunungMaterial);
      chopBottom(gunung_enam, 0.5)
      chopX(gunung_enam, 0.8)
      gunung_enam.translateY(-1.2)
      gunung_enam.translateX(7)
      gunung_enam.translateZ(5)
      gunung_enam.rotateY(Math.PI)


      const gunung7 = new Three.CylinderGeometry(0.5, 2.8, 18, 8)

      const gunung_tujuh = new Three.Mesh(gunung7, gunungMaterial);

      chopBottom(gunung_tujuh, 0.2)
      chopY(gunung_tujuh, 0.5)
      gunung_tujuh.translateY(-5)
      gunung_tujuh.translateX(7)
      gunung_tujuh.translateZ(4)
      gunung_tujuh.rotateY(Math.PI)

      const gunung8 = new Three.CylinderGeometry(0.5, 2.8, 16, 8)

      const gunung_delapan = new Three.Mesh(gunung8, gunungMaterial);

      chopBottom(gunung_delapan, 0.5)
      chopY(gunung_delapan, 0.5)
      gunung_delapan.translateY(-5)
      gunung_delapan.translateX(7.5)
      gunung_delapan.translateZ(4)
      gunung_delapan.rotateY(Math.PI / 2)

      const gunung9 = new Three.ConeGeometry(3, 5)

      const gunung_sembilan = new Three.Mesh(gunung9, gunungMaterial);
      gunung_sembilan.translateY(-2.5)
      gunung_sembilan.translateX(6.5)
      gunung_sembilan.translateZ(5.6)

      const gunung10 = new Three.CylinderGeometry(0.87, 3.09, 2.401, 8, 1)

      const gunung_sepuluh = new Three.Mesh(gunung10, gunungMaterial);
      gunung_sepuluh.translateY(-3.5)
      gunung_sepuluh.translateX(6)
      gunung_sepuluh.translateZ(7.5)

      this.mountains.add(gunung_satu);
      this.mountains.add(gunung_dua);
      this.mountains.add(gunung_tiga);
      this.mountains.add(gunung_empat);
      this.mountains.add(gunung_lima);
      this.mountains.add(gunung_tujuh);
      this.mountains.add(gunung_enam);
      this.mountains.add(gunung_delapan);
      this.mountains.add(gunung_sepuluh);
      this.mountains.add(gunung_sembilan);

      this.scene.add(this.mountains);

      this.mountains.scale.set(15, 15, 15)
      this.mountains.translateZ(-140)
      this.mountains.translateY(50)
    },
    level2() {
      this.air = 0;
      this.scene.remove(doggo);
      const loader = new GLTFLoader()
      loader.load(
        '/three-assets/dog2.gltf',
        gltf => {
          doggo = gltf.scene;
          doggo.scale.set(65, 65, 65);
          // doggo.rotateY(-Math.PI/7)
          doggo.rotateY(-600)
          this.scene.add(doggo)
          doggo.position.y = -17;
          this.mixer = new Three.AnimationMixer(doggo);

          const clips = gltf.animations;
          const clip = Three.AnimationClip.findByName(clips, 'ArmatureAction.001');
          const action = this.mixer.clipAction(clip);
          action.play();
        },
        undefined,
        undefined
      )
    },
    level3() {
      this.air = 0;
      this.scene.remove(doggo);
      const loader = new GLTFLoader()
      loader.load(
        '/three-assets/dog3.gltf',
        gltf => {
          doggo = gltf.scene;
          doggo.scale.set(50, 50, 50);
          // doggo.rotateY(-Math.PI/7)
          doggo.rotateY(-600)
          this.scene.add(doggo)
          doggo.position.y = -17;
          this.mixer = new Three.AnimationMixer(doggo);

          const clips = gltf.animations;
          const clip = Three.AnimationClip.findByName(clips, 'ArmatureAction.001');
          const action = this.mixer.clipAction(clip);
          action.play();
        },
        undefined,
        undefined
      )

    },
    level4() {
      this.air = 0;
      this.scene.remove(doggo);
      const loader = new GLTFLoader()
      loader.load(
        '/three-assets/dog4.gltf',
        gltf => {
          doggo = gltf.scene;
          doggo.scale.set(40, 40, 40);
          // doggo.rotateY(-Math.PI/7)
          // doggo.rotateY(-600)
          this.scene.add(doggo)
          doggo.position.y = -17;
          this.mixer = new Three.AnimationMixer(doggo);

          const clips = gltf.animations;
          const clip = Three.AnimationClip.findByName(clips, 'ArmatureAction');
          const action = this.mixer.clipAction(clip);
          action.play();
        },
        undefined,
        undefined
      )

    },
    level5() {
      this.air = 0;
      this.scene.remove(doggo);
      const loader = new GLTFLoader()
      loader.load(
        '/three-assets/dog5.gltf',
        gltf => {
          doggo = gltf.scene;
          doggo.scale.set(50, 50, 50);
          // doggo.rotateY(-Math.PI/7)
          doggo.rotateY(-600)
          this.scene.add(doggo)
          doggo.position.y = -17;
          this.mixer = new Three.AnimationMixer(doggo);

          const clips = gltf.animations;
          const clip = Three.AnimationClip.findByName(clips, 'ArmatureAction');
          const action = this.mixer.clipAction(clip);
          action.play();
        },
        undefined,
        undefined
      )

    },
    changeButtonStat() {
      this.air += 1;
      console.log(this.air);
      console.log("this.level =" + this.level)
      if (this.air <= 8) {
        waterometer.geometry.dispose();
        waterometer.geometry = new Three.CapsuleGeometry(20, this.air / 8 * 200, 32, 16);
        waterometer.position.y = (-(100 - this.air / 8 * 200) / 2);

        if (this.air == 4 && this.level == 1) {

          var tween1 = new Tween.Tween(doggo.scale).to({
            x: 150,
            y: 150,
            z: 150,
          }, 1500)
            .easing(Tween.Easing.Elastic.Out)
            .delay(100);

          tween1.start();
        }

        if (this.air == 4 && this.level == 2) {

          var tween2 = new Tween.Tween(doggo.scale).to({
            x: 85,
            y: 85,
            z: 85,
          }, 1500)
            .easing(Tween.Easing.Elastic.Out)
            .delay(100);

          tween2.start();
        }

        if (this.air == 4 && this.level == 3) {

          var tween3 = new Tween.Tween(doggo.scale).to({
            x: 70,
            y: 70,
            z: 70,
          }, 1500)
            .easing(Tween.Easing.Elastic.Out)
            .delay(100);

          tween3.start();
        }

        if (this.air == 4 && (this.level == 4 || this.level == 5)) {

          var tween4 = new Tween.Tween(doggo.scale).to({
            x: 65,
            y: 65,
            z: 65,
          }, 1500)
            .easing(Tween.Easing.Elastic.Out)
            .delay(100);

          tween4.start();
        }



      }
      if (this.air == 9) {
        this.level += 1;

        if (this.level == 2) {
          this.level2();
        }
        if (this.level == 3) {
          this.level3();
        }
        if (this.level == 4) {
          this.level4();
        }
        if (this.level == 5) {
          this.level5();
        }
      }
      if (this.air == 9) {
        this.level += 1;

        if (this.level == 2) {
          this.level2();
        }
        if (this.level == 3) {
          this.level3();
        }
        if (this.level == 4) {
          this.level4();
        }
        if (this.level == 5) {
          this.level5();
        }
      }
    },
  },
}
</script>