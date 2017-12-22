<template>
	<div class="zmiti-main-ui">
		<div class="zmiti-index-main-ui lt-full" ref='zmiti-scene'>
			
		</div>

		<img src='../assets/particle.jpg' ref='particle' class="zmiti-cache-img" />
	</div>
</template>
<script>
import './css/index.css';
 export default {
  name: 'index',
  data () {
    return {
      viewW:document.documentElement.clientWidth,
      viewH:document.documentElement.clientHeight
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
  		scene.background = new THREE.Color(0xda363d);

  		var renderer = new THREE.WebGLRenderer();
  		//renderer.setClearColor(new THREE.Color( 0xff0000,1.0 ))
  		renderer.setSize(this.viewW,this.viewH);
  		window.scene = scene;
	
		scene.add(camera)

		var group = this.createParticles(scene);

		this.$refs['zmiti-scene'].appendChild(renderer.domElement);

		var planeGeom = new THREE.PlaneGeometry( 30,30,100,100);
		var planeMaterial=  new THREE.MeshBasicMaterial( {map:new THREE.TextureLoader().load('./src/assets/300.jpg')});
		var plane = new THREE.Mesh(planeGeom,planeMaterial);

		scene.add(plane);

  		
  		var animation = requestAnimationFrame || webkitRequestAnimationFrame;
  		  var startTime = Date.now();
  		  var self=  this;
  		  var i = 0;
  		function render(){
  			i++
  			group.alpha = Math.sin(i%360*Math.PI/180)
  			
            renderer.render(scene,camera);
  			animation(render);
  		}
  		render();

  	},

  },
  mounted(){
  //	this.initWebgl();
  }
}

</script>

<style scoped>
	.zmiti-index-main-ui{
		background: url(../assets/bg.jpg) no-repeat center top;
		background-size: cover;
	}
</style>