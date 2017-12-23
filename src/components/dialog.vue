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
					<img src="../assets/default-head.png" alt="">
				</div>
			</slot>
			<slot name='zmiti-tip'>
				<div class="zmiti-dialog-tip">点击上传头像</div>
			</slot>

			<slot name='zmiti-btn1'>
				<div class="zmiti-dialog-btn">重新上传</div>
			</slot>
			<slot name='zmiti-btn2'>
				<div class="zmiti-dialog-btn">保存图片</div>
			</slot>
		</div>

	</div>
</template>

<script>
	import './css/dialog.css'; 
	export default {
		name:'zmiti-dialog',
		props:['show','text'],
		data(){
			return {

			}
		},
		created(){
			///alert('created1')
		},
		methods:{
			closeDialog(){
				this.$emit('close-dialog');
			}
		},
		mounted(){

		}
	}
</script>