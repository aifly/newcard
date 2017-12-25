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

			<audio src='../assets/bg.mp3'  ref='audio'></audio>

			<div v-if='showDoBtn' @click='showUploadDialog=true' class="zmiti-do-btn">制作语音贺卡</div>


      <Dialog @get-headimg='getHeadimg' @show-record='showRecord' @close-dialog='closeDialog' :show='showUploadDialog' text='上传头像'></Dialog>
      <Dialog  @close-dialog='closeDialog' :show='showRecordDialog'  text='录制语音'>
        <div class="zmiti-record-img " @click="playVoice"  slot='zmiti-dialog-img'>
            <img src="../assets/record.png" alt="">
            <div :class="{'animate':beginRecord}"></div>
            <div :class="{'animate':beginRecord}"></div>
            <div :class="{'animate':beginRecord}"></div>
            <div></div>
          </div>
          <div class="zmiti-dialog-tip" slot='zmiti-tip' v-html='seconds+"s"'></div>
          <div class="zmiti-dialog-btn" :class="{'scale':beginRecord}" slot='zmiti-btn1' v-html='recordState' @touchstart='beginRead($event)' @touchend='stopRead'></div>
          <div class="zmiti-dialog-btn" slot='zmiti-btn2' @click='saveVoice' :class="{'disabled':!localId}">保存语音</div>
      </Dialog>
			<img src='../assets/letter.gif' class="zmiti-letter" />
			<img src='../assets/bg.jpg' ref='bg' class="zmiti-cache-img" />
			<img src='../assets/title.png' ref='title' class="zmiti-cache-img" />
			<img src='../assets/lantern.png' ref='lantern' class="zmiti-cache-img" />
			<img src='../assets/particle1.png' ref='particle1' class="zmiti-cache-img" />
			<img src='../assets/particle2.png' ref='particle2' class="zmiti-cache-img" />
		</div>

    <Result :nickname='nickname' :src='src' :recordStoped='recordStoped' :localId="localId" :serverId='serverId' :show='showResultPage'></Result>

	</div>
</template>
<script>
import './css/index.css';
import SpotLight from './SpotLight.js'
import ZmitiBg from './bg.js';
import Dialog from '@/components/dialog';
import Result from '@/components/result';
import $  from 'jquery';
 export default {
  name: 'index',
  components:{
    Dialog,
    Result
  },
  data () {
    return {
      localId:'',
      sendNickname:'',
      nickname:'',
      src:'',
      seconds:0,
      recordStoped:false,
      serverId:'',
      recordState:"按住录音",
      beginRecord:false,
      showResultPage:false,
      showUploadDialog:false,
      showRecordDialog:false,
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


    beginRead(e){
      e.preventDefault();
      this.recordState = "松开结束";
      this.beginRecord = true;
      wx.startRecord({
        fail(){
          
        },
        success(){
         // alert('开始成功')
        }
      }); //开始朗读

      this.seconds  = 0;
      this.timer = setInterval(() => {
        this.seconds++;
        if(this.seconds>=60){
          this.stopRead();
          return;
        }
      
      }, 1000);
      return false;
    },

    stopRead(){
      var s = this;
        clearInterval(this.timer);
        this.recordState = "按住录音";
        this.beginRecord = false;
        wx.stopRecord({
        fail() {
          //alert('end error');
        },
        success: function(res) {
          //alert(res.localId);
          s.localId = res.localId;

          wx.onVoicePlayEnd({
            success: function (res) {
               var localId = res.localId; // 返回音频的本地ID
               s.beginRecord = false;
               s.recordStoped = true;
            }
          });
        }
      });
    },
    playVoice(){
      this.beginRecord = true;
      wx.playVoice({
       localId: this.localId // 需要播放的音频的本地ID，由stopRecord接口获得
      });
    },

    getHeadimg(src){
      this.src = src;
    },

    saveVoice(){
      if(!this.localId){
        return;
      }
      var  _this = this;
      wx.uploadVoice({
          localId: _this.localId, // 需要上传的音频的本地ID，由stopRecord接口获得
          isShowProgressTips: 1, // 默认为1，显示进度提示
          success:function(res) {
            var serverId = res.serverId; // 返回音频的服务器端ID
            _this.serverId = serverId;
            _this.closeDialog();
            _this.showResultPage = true;
             var nickname = _this.nickname;
             var src = _this.src;
             var serverId = _this.localId;


             var URI = window.location.href.split('#')[0];
            URI = _this.changeURLPar(URI, 'nickname', nickname);
            URI = _this.changeURLPar(URI, 'src', src);
            URI = _this.changeURLPar(URI, 'serverId', serverId);
            
           _this.wxConfig('收到'+_this.nickname+'为你制作的新年贺卡','快打开看看吧',URI);

          }
      });
    },

    wxConfig: function(title, desc,  url) {
    var s = this;
    var img = 'http://h5.zmiti.com/public/newcard/300.jpg';
    var appId = 'wxfacf4a639d9e3bcc'; //'wxfacf4a639d9e3bcc'; // data.wxappid; // 'wxfacf4a639d9e3bcc'; //data.wxappid;

    var durl = url || location.href.split('#')[0];
    var code_durl = encodeURIComponent(durl);

    $.ajax({
      type: 'get',
      url: "http://api.zmiti.com/weixin/jssdk.php?type=signature&durl=" + code_durl,
      dataType: 'jsonp',
      jsonp: "callback",
      jsonpCallback: "jsonFlickrFeed",
      error: function() {

      },
      success: function(data) {
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: appId, // 必填，公众号的唯一标识
          timestamp: '1488558145', // 必填，生成签名的时间戳
          nonceStr: 'Wm3WZYTPz0wzccnW', // 必填，生成签名的随机串
          signature: data.signature, // 必填，签名，见附录1
          jsApiList: ['checkJsApi',
              'onMenuShareTimeline',
              'onMenuShareAppMessage',
              'onMenuShareQQ',
              'onMenuShareWeibo',
              'hideMenuItems',
              'showMenuItems',
              'hideAllNonBaseMenuItem',
              'showAllNonBaseMenuItem',
              'startRecord',
              'stopRecord',
              'onRecordEnd',
              'playVoice',
              'pauseVoice',
              'stopVoice',
              'uploadVoice',
              'downloadVoice',
            ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });

        wx.ready(function() {

          //朋友圈

          wx.onMenuShareTimeline({
            title: title, // 分享标题
            link: durl, // 分享链接
            imgUrl: img, // 分享图标
            desc: desc,
            success: function() {},
            cancel: function() {}
          });
          //朋友
          wx.onMenuShareAppMessage({
            title: title, // 分享标题
            link: durl,
            imgUrl: img, // 分享图标
            type: "link",
            dataUrl: "",
            desc: desc,
            success: function() {},
            cancel: function() {}
          });
          //qq
          wx.onMenuShareQQ({
            title: title, // 分享标题
            link: durl, // 分享链接
            imgUrl: img, // 分享图标
            desc: desc,
            success: function() {},
            cancel: function() {}
          });
        });
      }
    });

  },
  getQueryString: function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return (r[2]);
    return null;
  },

  getOauthurl: function() {
    var s = this;
    var data = {
      wxappid: 'wxfacf4a639d9e3bcc',
      wxappsecret: "149cdef95c99ff7cab523d8beca86080"
    }
    $.ajax({
      type: 'post',
      url: 'http://api.zmiti.com/v2/weixin/getwxuserinfo/',
      data: {
        code: s.getQueryString('code'),
        wxappid: data.wxappid,
        wxappsecret: data.wxappsecret
      },
      error: function() {},
      success: function(dt) {

        if (dt.getret === 0) {


          s.openid = dt.userinfo.openid;
          s.nickname = dt.userinfo.nickname;
          s.headimgurl = dt.userinfo.headimgurl;

          window.nickname = s.nickname;
          window.headimgurl = s.headimgurl;

          var opt = {
            nickname: s.nickname,
            headimgurl: s.headimgurl
          }

         s.wxConfig('收到'+s.nickname+'为你制作的新年贺卡','快打开看看吧');
          
        } else {
          if (s.isWeiXin()) {
            var nickname = s.getQueryString('nickname');
            var src = s.getQueryString('src');
            var serverId = s.getQueryString('serverId');

            var redirect_uri = window.location.href.split('?')[0];

            if (nickname) {
              redirect_uri = s.changeURLPar(redirect_uri, 'nickname', (nickname));
            }
            if(src){
              redirect_uri = s.changeURLPar(redirect_uri, 'src', (src));  
            }
            if(serverId){
             redirect_uri = s.changeURLPar(redirect_uri, 'serverId', (serverId));   
            }

            $.ajax({
              url: 'http://api.zmiti.com/v2/weixin/getoauthurl/',
              type: 'post',
              data: {
                redirect_uri: redirect_uri,
                scope: 'snsapi_userinfo',
                worksid: 31,
                state: new Date().getTime() + ''
              },
              error: function() {},
              success: function(dt) {
                if (dt.getret === 0) {

                  window.location.href = dt.url;

                }
              }
            })
          } else {}

        }


      }
    });
  },
  changeURLPar: function(url, arg, val) {
    var pattern = arg + '=([^&]*)';
    var replaceText = arg + '=' + val;
    return url.match(pattern) ? url.replace(eval('/(' + arg + '=)([^&]*)/gi'), replaceText) : (url.match('[\?]') ? url + '&' + replaceText : url + '?' + replaceText);
  },
  isWeiXin: function() {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
      return true;
    } else {
      return false;
    }
  },
  initParams(){
    var s = this;
    var nickname = s.getQueryString('nickname');
    var src = s.getQueryString('src');
    var serverId = s.getQueryString('serverId');

    this.sendNickname = nickname;
    this.nickname = nickname;
    this.src = src;
    this.serverId = serverId;
    if(this.nickname && this.src && this.serverId){
      this.showResultPage = true;
    }
  },

  	createParticles(scene){

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
		plane.position.set(2,20,5)
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
    closeDialog(){
      this.showUploadDialog = false;
      this.showRecordDialog = false;
    },
    showRecord(){
      this.showRecordDialog = true;
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
  				  $(audio).on('play',()=>{
  						this.showAudioImg = true;
            }).on('pause',()=>{
  						this.showAudioImg = false;
            })
       
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
    this.getOauthurl();
    this.initParams();

    if(this.src && this.serverId && this.nickname){
      this.showResultPage = true;
    }else{
     this.initWebgl();
  	setTimeout(()=>{
  		this.initLetter();
  	},1000)
    }


    

  }
}

</script>

<style scoped>
	.zmiti-index-main-ui{
		background: url(../assets/bg.jpg) no-repeat center top;
		background-size: cover;
	}
</style>