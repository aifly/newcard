<template>
	<div class="zmiti-main-ui">
		<div class="zmiti-index-main-ui lt-full" ref='zmiti-scene'>
				<div class="zmiti-letter-C">
				<div></div>
				<div :class="{'step1':step2,'step2':step3,'step3':step4}"><img src="../assets/letter.jpg"></div>
				<div><img src="../assets/letter1.png"></div>
				<div :class="{'active':step1}"><img src="../assets/latter2.png"></div>
			</div>

			<div v-show='showAudioImg' class="zmiti-audio-img">
				<img src="../assets/audio.gif" >
			</div>

			<audio src='../assets/bg.mp3' ref='audio'></audio>

			<div v-if='showDoBtn' class="zmiti-do-btn">制作语音贺卡</div>
			<img src='../assets/letter.gif' class="zmiti-letter" />
			<img src='../assets/bg.jpg' ref='bg' class="zmiti-cache-img" />
			<img src='../assets/title.png' ref='title' class="zmiti-cache-img" />
			<img src='../assets/lantern.png' ref='lantern' class="zmiti-cache-img" />
			<img src='../assets/particle1.png' ref='particle1' class="zmiti-cache-img" />
			<img src='../assets/particle2.png' ref='particle2' class="zmiti-cache-img" />
		</div>


		

		
	</div>
</template>
<script>
import './css/index.css';
import SpotLight from './SpotLight.js'
import ZmitiBg from './bg.js'
 export default {
  name: 'index',
  data () {
    return {
      viewW:document.documentElement.clientWidth,
      viewH:document.documentElement.clientHeight,
      step1:false,
      step2:false,
      step3:false,
      step4:false,
      showAudioImg:false,
      showDoBtn:false
    }
  },
  methods:{

  	createSprite(option={size:10,transparent:true,opacity:1,color:0xffffff,spriteNum:100,range:500}){
  		var {size,transparent,opacity,color,spriteNum,range} = option;
		var loader = new THREE.TextureLoader();
		var self = this;
		var texture = loader.load('./src/assets/particle.png');

		var spriteMaterial = new THREE.SpriteMaterial({
  			opacity,
  			color,
  			transparent,
  			map:texture
  		});
  		//spriteMaterial.map.offset = new THREE.Vector2( .2*spriteNum, 0 );
  		spriteMaterial.map.repeat = new THREE.Vector2(1,1);
  		spriteMaterial.depthTest = false;
  		spriteMaterial.transparent = true;
  		spriteMaterial.blending = THREE.AdditiveBlending;
  		var sprite = new THREE.Sprite(spriteMaterial);
  		sprite.scale.set(size,size,size);
  		sprite.rotation.x = 10;
  		sprite.rotation.y = .5*Math.PI;
  		sprite.position.set(Math.random()*range - range / 2,Math.random()*range - range / 2,Math.random()*range - range / 2);
  		return sprite;
  	},

  	createParticles(scene){

  		if(this.cloud){
            scene.remove(this.cloud);
  		}

  		var group = new THREE.Object3D();
  		var range = 200;
  		//group.add(this.createSprite({}))
  		for(var i =0;i<500;i++){
  			group.add(this.createSprite({size:2,transparent:false,opacity:1,color:0xffffff,spriteNum:i/10,range:300}))
  		}
  		scene.add(group);

  		return group


  	},
  	initWebgl(){
  		var scene = new THREE.Scene();
  		var camera = new THREE.PerspectiveCamera( 45, this.viewW/this.viewH, 0.1, 1000 );
  		camera.position.set(0,0,100);
  		camera.lookAt(scene.position);
  		var bgSrc = this.$refs['bg'].src;

  		var self = this;

  		scene.background = new THREE.TextureLoader().load(bgSrc);// new THREE.Color(0xda363d);// 

  		var renderer = new THREE.WebGLRenderer();
  		//renderer.setClearColor(new THREE.Color( 0xff0000,1.0 ))
  		renderer.setSize(this.viewW,this.viewH);
  		window.scene = scene;
	
		scene.add(camera)

		this.$refs['zmiti-scene'].appendChild(renderer.domElement);

		var planeGeom = new THREE.PlaneGeometry( 30,20,100,100);
		var planeMaterial=  new THREE.MeshLambertMaterial( {map:new THREE.TextureLoader().load(this.$refs['title'].src)});
		var plane = new THREE.Mesh(planeGeom,planeMaterial);
		plane.position.set(2,15,5)
		planeMaterial.transparent = true;
  		scene.add(plane);
		

		var ambLight = new THREE.AmbientLight( 0xecde56);//0xfefbc8
		scene.add(ambLight);

		

		var bg1 = new ZmitiBg({
			vue:this,
			scene
		});

		var bg2 = new ZmitiBg({
			vue:this,
			scene,
			key:'particle'
		})
		var bg3 = new ZmitiBg({
			vue:this,
			scene,
			key:'particle'
		})

		
	
	 	var spotArr = [];
	 	for(var k = 0;k<4;k++){
			spotArr.push(new SpotLight({
	 		scene,
	 		vue:this
	 	}))	 		
	 	}

  		var animation = requestAnimationFrame || webkitRequestAnimationFrame;
  		 
  		 var i=0;
  		function render(){
  			bg1.bg.position.y-=.34;
  			if(bg1.bg.position.y<=-150){
  				bg1.bg.position.y = 150;
  			}
  			bg2.bg.position.y-=.1;

  			if(bg2.bg.position.y<=-130){
  				bg2.bg.position.y = 150;
  			}

  			bg3.bg.position.y-=.05;

  			if(bg3.bg.position.y<=-130){
  				bg3.bg.position.y = 150;

  			}
  			spotArr.forEach((spotLightObj)=>{
  				spotLightObj.iNow+=spotLightObj.k;
	  			spotLightObj.spotLight.position.y += spotLightObj.speedY;
	  			if(spotLightObj.spotLight.position.y > spotLightObj.alive){
	  				spotLightObj.spotLight.position.y = 0;
	  			}
	  			spotLightObj.spotLight.position.x += Math.sin(spotLightObj.iNow%360*Math.PI/180)/(spotLightObj.k+3);
	  			spotLightObj.spotLight.position.z += Math.sin(spotLightObj.iNow%360*Math.PI/180)/(spotLightObj.k+3);
	  			spotLightObj.cube.position.set(spotLightObj.spotLight.position.x-20,spotLightObj.spotLight.position.y,spotLightObj.spotLight.position.z)
  			})
            renderer.render(scene,camera);
  			animation(render);
  		}
  		render();

  	},
  	initLetter(){
  		this.step1 = true;
  		var self = this;
  		setTimeout(()=>{
  			this.step2=true;
  			setTimeout(()=>{
  				this.step3 = true;
  				setTimeout(()=>{
  					this.step4 = true;
  					var audio = this.$refs['audio']
  					
  					audio.addEventListener('play',()=>{
  						this.showAudioImg = true;
  					});
  					audio.addEventListener('pause',()=>{
  						this.showAudioImg = false;
  					});
  					setTimeout(()=>{
  						audio.play();
  						this.showDoBtn = true;
	  					document.addEventListener("WeixinJSBridgeReady", function() {
				         WeixinJSBridge.invoke('getNetworkType', {}, function(e) {
				             audio.play();
				         });
				     }, false);
  					},1000)
  				},1000)
  			},1000)
  		},1000)
  	}

  },
  mounted(){
  	this.initWebgl();
  	
  	setTimeout(()=>{
  		this.initLetter();
  	},1000)

  }
}

</script>

<style scoped>
	.zmiti-index-main-ui{
		background: url(../assets/bg.jpg) no-repeat center top;
		background-size: cover;
	}
</style>