<template>
<div id="livego">
	<div style="width: 100%;background: #24292F;height: 40px;">
		<img src="../assets/imgs/downPull.png" 
			@click="drawerVisible=true"
			style="cursor:pointer;width: 60px;height: 30px;position: relative;left: 45%;top:10px;color:white"/>
	</div>
<video ref="preview" autoplay width="1024" height="640" 
	style="display: inline-block;float: left;position: relative;left: 0;top:0;"></video>
<!--开启直播间信息-->
<el-dialog :visible.sync="startLiveVisible" width="50%" center append-to-body :show-close="false" :destroy-on-close="false">
	<div class="liveinfo">
	<div style="text-align: center;margin: 40px 0 30px 0;font-size: 20px;">开启直播</div>
	<div><div class="liveinfo-label">标题</div>
	<el-input type="text" style="width: 300px;" class="liveinfo-input" v-model="liveRoomForm.title"/>
	</div>
	<div>
		<div class="liveinfo-label">分类:</div>
	<el-select v-model="liveRoomForm.classtify" placeholder="请选择" class="liveinfo-input">
    	<el-option
     		 v-for="c in classtifies"
      		:key="c"
      		:label="c"
      		:value="c">
    		</el-option>
 		 </el-select>
		</div>
		<div>
			<div class="liveinfo-label">封面</div>
			<img style="width: 220px;height: 160px;" :src="coverUrl(currentLiveRoom.cover)" />
			<div class="liveinfo-input">
				<el-upload
					action="/api/liveroom/saveCover"
					:show-file-list="false"
					:data="currentLiveRoom"
					:headers="headers"
					accept=".jpg,.png,.jpeg"
					:limit="fileLimit" 
					:before-upload="beforeUpload"
					:auto-upload="true"
					:on-success="successUpload"
					ref="upload">
					<el-button size="small" type="primary" style="display: block;position: relative;left: 45%;">点击上传</el-button>
				</el-upload>
			</div>
		</div>
		<div><el-button @click="handlerLive" style="position: relative;left: 35%;">开启直播</el-button></div>
</div>
</el-dialog>
<!--选择直播录制方式-->
<el-dialog :visible.sync="liveModeVisible" 
	width="30%" center append-to-body 
	:close-on-click-modal="false" :show-close="false">
<div style="position: relative;height: 220px;width: 100%;">
	<div style="font-size: 20px;text-align: center;margin: 0 0 30px 0;">直播方式</div>
	<el-radio-group v-model="liveMode" style="display: block;margin: 30px 0px;position: relative;left: 25%;">
		<el-radio-button label="摄像头"></el-radio-button>
		<el-radio-button label="屏幕"></el-radio-button>
	</el-radio-group>
	<div v-if="liveMode=='屏幕'">
		<el-switch v-model="isScreenCamera" 
			active-color="#13ce66"
  			inactive-color="#ff4949"
  			active-text="右下方摄像头"
  			style="position: relative;left: 25%;"
  			></el-switch></div>
	<el-button style="margin: 30px 0 0 0px;width: 120px;height: 50px;position: relative;left:25%;"
		@click="handlerInitLive();liveModeVisible=false">确认设置</el-button>
</div>
</el-dialog>
<!--上方抽屉-->
<el-drawer :visible.sync="drawerVisible" direction="ttb" :size="80" :show-close="false" :withHeader="false">
	<div style="background:#24292F;width: 100%;height: 120px;">
	<div class="live-button-box">
	<el-button @click="startLiveVisible=true"
	:disabled="isLive" 
	class="live-button" 
	style="background: greenyellow;">START</el-button>
	<!--停止-->
	<el-button :disabled="!isLive"  
	class="live-button"
	style="background:orangered"
	@click="handlerDownLive"
	>STOP</el-button>
</div>
</div>
</el-drawer>
</div>
</template>

<script>
	import {mapState} from 'vuex'
	import PlayerCanvas from "../js/PlayerCanvas"
	export default{
		name:'LiveGo',
		data(){
			return{
				//开始直播信息对话框
				startLiveVisible:false,
				//直播方式对话框
				liveModeVisible:true,
				//是否正在直播
				isLive:false,
				//上方抽屉
				drawerVisible:false,
				classtifies:['游戏','户外','娱乐','舞蹈'],
        		fileType: ["png","jpg", "jpeg"],
				// 运行上传文件大小，单位 M
				fileSize: 5,
				// 附件数量限制
				fileLimit: 1,
				headers:{
					authorization:localStorage.getItem("token")
				},
				screen_width:1024,
				screen_height:640,
				liveMode:'摄像头',
				isScreenCamera:false,
			}
		},
		computed:{
			...mapState(['currentUser','currentLiveRoom']),
			liveRoomForm(){
				return this.currentLiveRoom
			}
		},
		mounted(){
			this.initLiveRoom()
			this.initSocketIO()
		},
		beforeDestroy(){
			this.$socket.emit('downLive',this.liveRoom)
		},
		methods:{
			handlerInitLive(){
				if(this.liveMode=='摄像头'){
					this.initCamera()
				}else if(this.liveMode=='屏幕'){
					if(this.isScreenCamera){
						this.initScreenAndCamera()
					}else{
						this.initScreen()
					}
				}
			},
			initLiveRoom(){
				if(this.currentLiveRoom==null){
					this.$store.dispatch('aCurrentLiveRoom')	
				}
			},
			async initCamera(){
				this.stream=await navigator.mediaDevices.getUserMedia({
					audio:true,
					video:true
				});
				this.$refs.preview.srcObject=this.stream;
			},
			async initScreen(){
				this.stream=await navigator.mediaDevices.getUserMedia({
					audio:false,
					video:{
						mandatory:{
							chromeMediaSource:'desktop',//桌面
							minWidth:this.screen_width,
							maxWidth:this.screen_width,
							minHeight:this.screen_height,
							maxHeight:this.screen_height
						}
					}
				});
				await this.attachAudioStream()
				this.$refs.preview.srcObject=this.stream
			},
			//开启屏幕和摄像头录制
			async initScreenAndCamera(e){
				this.playerCanvas = new PlayerCanvas(this.screen_width,this.screen_height);
				this.stream=new MediaStream();
				//附加音频轨道
				await this.attachAudioStream();
				//摄像头
				this.cameraVideoStream=await navigator.mediaDevices.getUserMedia({
					video:true,
					audio:false
				});
				this.playerCanvas.setCameraVideo(this.createVideoElementWithStream(this.cameraVideoStream))
				
				//屏幕
				this.screenStream=await navigator.mediaDevices.getUserMedia({
					audio:false,
					video:{
						mandatory:{
							chromeMediaSource:'desktop',//桌面
							minWidth:this.screen_width,
							maxWidth:this.screen_width,
							minHeight:this.screen_height,
							maxHeight:this.screen_height
						}
					}
				})
				this.playerCanvas.setScreenVideo(this.createVideoElementWithStream(this.screenStream))
				//将屏幕的视频轨道 添加到 音频流中
				//this.screenStream.getVideoTracks().forEach(value=>this.audioStream.addTrack(value))
				this.playerCanvasStream=this.playerCanvas.canvas.captureStream()
				//将屏幕和摄像头合成的视频轨道添加到 stream流
				this.playerCanvasStream.getTracks().forEach(t=>this.stream.addTrack(t))
				//预览
				//this.$refs.preview.srcObject=this.screenStream;
				this.$refs.preview.srcObject=this.stream
				/*录制视频 MediaRecorder*/
				//this.startRecord()
			},
			initSocketIO(){
				this.$socket.open()
				this.$socket.on('connect',(e)=>{
					console.log('连接成功')
				})
				this.$socket.on('disconnect',(e)=>{
					console.log('断开连接')
				})
				this.sockets.subscribe('publishStream', (res)=>{
        			console.log("res2 -->",res)
       			});
			},
			async attachAudioStream(){
				//麦克风
				this.audioStream=await navigator.mediaDevices.getUserMedia({
					video:false,
					audio:true
				});		
				//将音频轨道 加入到stream流中
				this.audioStream.getAudioTracks().forEach(value=>this.stream.addTrack(value))
			},
			createVideoElementWithStream(stream){
				let video=document.createElement("video");
				video.autoplay=true;
				video.srcObject=stream;
				return video;
			},
			/*开启直播*/
			async handlerLive(){
				console.log('开启直播')
				this.$socket.emit('publishStream',this.currentLiveRoom.id,(res)=>{
					console.log('res-->',res)
					if(res.success){
						this.isLive=true;
						this.startLiveVisible=false
						this.mr=new MediaRecorder(this.stream,{mimetype:"video/webm;codec=h264"})
						//侦听函数
						this.mr.ondataavailable=async (e)=>{
							if(!this.isLive){
								return;
							}
							console.log('data-->',e.data)
							this.$socket.emit('streamData',
							await {id:this.currentLiveRoom.id,data:e.data},
						(res)=>{
							if(!res.success){
								this.mr.stop();
								this.isLive=false;
							}
						}
							)
						}
						//每40毫秒传输一份数据
						this.mr.start(40);
					}
				})
		},
		handlerDownLive(){	
			this.$socket.emit('downLive',this.currentLiveRoom.id,(res)=>{
				if(res.success){
				this.isLive=false;
				this.mr.stop()
				}else{
					this.$message.info(res.message)
				}
			});
		},
		avatarUrl(filename){
				return "/api/user/avatar?filename="+filename;
		},
		coverUrl(filename){
			return "http://localhost:9070/liveroom/cover?filename="+filename;
		},
		//封面上次成功回调
		successUpload(response,file,filelist){
				console.log("res--》",response)
				if(response.success){
					//this.$message.success("上传成功")
					location.reload()
					this.startLiveVisible=false
				}else{
					this.$message.error(response.message)
				}
			},
     	 	beforeUpload(file){
			if (file.type == "" || file.type == null || file.type == undefined){
			this.$message.error("文件类型错误！")	
			return false;
			}
	    	//截取文件的后缀，判断文件类型
			const FileExt = file.name.replace(/.+\./, "").toLowerCase();
			//计算文件的大小
			const isLimit= file.size / 1024 / 1024 < this.fileSize; //这里做文件大小限制
			//如果大于2M
			if (!isLimit) {
				this.$message.error('上传文件大小不能超过 5MB!');
				return false;
			}
			//如果文件类型不在允许上传的范围内
			if(!this.fileType.includes(FileExt)){
				this.$message.error("不支持上传改文件类型!");
				return false;
			}

			},
		}
	}
</script>

<style scoped>
	#livego{
		width: 100%;
		height: 640px;
		background: #FAFAFA;
	}
	.liveinfo{
		height: 500px;
		background: white;
		position: relative;
	}
	.liveinfo>div{
		display: block;
		margin: 20px 0;
	}
	.liveinfo-label{
		display: inline-block;
		text-align: center;
		width: 120px;
		height: 50px;
		line-height: 50px;
	}
	.liveinfo-input{
		display: inline-block;
		width: 230px;
	}
	.live-button-box{
		display: inline-block;
		height:100%;
		width: 250px;
		position: relative;
		left: 40%;
	}
	.live-button{
		width: 70px;
		height: 70px;
		border: 1px solid gray;
		display: inline-block;
		float: left;
		border-radius: 100px;
		color:white;
		text-align: center;
		font-size: 14px;
		font-weight: 600;
		text-align: center;
	}
	.live-control-video{
		width: 100%;
		height: 60px;
		color:white;
		position: relative;
	}
	.live-control-video>div{
		display: inline-block;
		float: left;
		width: 50%;
		height: 60px;
		line-height: 60px;
		text-align: center;
		background: gray;
		cursor: pointer;
	}
</style>