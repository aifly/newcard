<template>
	<div v-if='show' class="zmiti-dialog-main-ui lt-full">
		<div class="zmiti-dialog-C">
			<header>
				<img src="../assets/dialog-top.png" alt="">
				<span v-html='text'></span>
				<label @click='closeDialog'></label>
			</header>
			<slot name='zmiti-dialog-img'>
				<div class="zmiti-upload-img">
					<img :src="headimg" v-if='headimg' alt="">
					<img v-if='!headimg' src='../assets/default-head.png'  alt="">
				</div>
			</slot>
			<slot name='zmiti-tip'>
				<div class="zmiti-dialog-tip">点击上传头像</div>
				<input class="zmiti-file" accept="image/*" type='file' ref='file' @change="upload"/>
			</slot>

			<slot name='zmiti-btn1'>
				<div class="zmiti-dialog-btn" :class="{'disabled':!headimg}" @click="reupload">重新上传</div>
			</slot>
			<slot name='zmiti-btn2'>
				<div  :class="{'disabled':!headimg}" class="zmiti-dialog-btn" @click='saveimg'>保存图片</div>
			</slot>
		</div>

	</div>
</template>

<script>
	import './css/dialog.css';
	import $ from 'jquery';

	export default {
		name:'zmiti-dialog',
		props:['show','text'],
		data(){
			return {
				headimg:''
			}
		},
		created(){
			///alert('created1')
		},
		methods:{

			 upload(){
				       var formData = new FormData();
		  		      var s = this;
		  
				      formData.append('setupfile', this.$refs['file'].files[0]);
				      formData.append('uploadtype', 0);
				      $.ajax({
				        type: "POST",
				        contentType: false,
				        processData: false,
				        url: 'http://api.zmiti.com/v2/share/upload_file/',
				        data: formData
				      }).done((data) => {
				        console.log(data)
				        if (data.getret === 0) {
				          var url = data.getfileurl[0].datainfourl;
				          this.headimg = url;


				        }
				      });
		    },

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
			closeDialog(){
				this.$emit('close-dialog');
				this.headimg = '';
			},
			saveimg(){
				if(!this.headimg){
					return;
				}
				this.$emit('close-dialog');
				this.$emit('show-record');
				this.$emit('get-headimg',this.headimg);

			},
			reupload(){
				if(!this.headimg){
					return;
				}
				this.$refs['file'].click();
			}
		},
		mounted(){

		}
	}
</script>