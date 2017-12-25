<template>
	<div v-show='show' class="zmiti-result-main-ui lt-full">
		<div class="zmiti-result-main">
			<img class="zmiti-chuang" src="../assets/chuang.png">
			<img class="zmiti-chuang" src="../assets/chuang.png">
			<img class="zmiti-chuang" src="../assets/chuang.png">
			<img class="zmiti-chuang" src="../assets/chuang.png">
			<span class="zmiti-line"></span>
			<span class="zmiti-line"></span>
			<span class="zmiti-line"></span>
			<span class="zmiti-line"></span>

			<div class="zmiti-result-head-C">
				<img src="../assets/2018.png" >
				<div class="zmiti-result-head">
					<img :src='src'/>
				</div>
			</div>

			<div class="zmiti-result-music">
				<img @click='recordAction(false)' src='../assets/stop.png' v-if='recordPlay'/>
				<img @click='recordAction(true)' src='../assets/play.png' v-if='!recordPlay'/>
				<img v-if='recordPlay && !recordStoped' src="../assets/audio.gif">
				<img v-if='!recordPlay||recordStoped' src="../assets/music.png">
			</div>
			<div class="zmiti-result-text">
				<img src="../assets/text.png">
			</div>
			<div class="zmiti-result-username">
				<span v-html='nickname'></span>
			</div>
			<div class="zmiti-result-send">
				<span><a @click='redo'>我也来制作</a></span>
				<span>发送给朋友</span>
			</div>
		</div>
	</div>
</template>
<script>
	import './css/result.css';
	export default {
		props:['show','src','nickname','serverId','localId','recordStoped'],
		name:'zmiti-result',
		data(){
			return {
				recordPlay:false
			}
		},
		created(){},
		methods:{
			recordAction(flag){
				this.recordPlay = flag;
				if(flag){//play
					this.localId && wx.playVoice({
				       localId: this.localId // 需要播放的音频的本地ID，由stopRecord接口获得
				      });
				}else{
					wx.pauseVoice({
				       localId: this.localId // 需要播放的音频的本地ID，由stopRecord接口获得
				      });
				}
			},
			getQueryString: function(name) {
			    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
			    var r = window.location.search.substr(1).match(reg);
			    if (r != null) return (r[2]);
			    return null;
			},
			initParams(){
				 var s = this;
			    var nickname = s.getQueryString('nickname');
			    var src = s.getQueryString('src');
			    var serverId = s.getQueryString('serverId');

			    this.nickname = nickname;
			    this.src = src;
			    this.serverId = serverId;
			},
			redo(){
				window.location.href = location.href.split("?")[0]
			}
		},
		
		mounted(){
			//this.initParams();

			 var s = this;
			 wx.onVoicePlayEnd({
	            success: function (res) {
	               var localId = res.localId; // 返回音频的本地ID
	               s.recordStoped = true;  
	            }
	          });
			if(!this.localId){//没有本地的id,去服务器下载
				wx.downloadVoice({
					serverId: this.serverId, // 需要下载的音频的服务器端ID，由uploadVoice接口获得
					isShowProgressTips: 1, // 默认为1，显示进度提示
					success: function (res) {
						var localId = res.localId; // 返回音频的本地ID
						s.localId = localId;
					}
				});
			}
		}
	}
</script>