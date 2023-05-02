class PlayerCanvas{
	constructor(width,height){
		this.canvas=document.createElement("canvas");
		this.context2d=this.canvas.getContext("2d");
		this.canvas.width=width;
		this.canvas.height=height;
		//摄像头长宽
		this.CAMERA_VIDEO_WIDTH=300;
		this.CAMERA_VIDEO_HEIGHT=200;
		this.canvasWidth=width;
		this.canvasHeight=height;
		//根据屏幕刷新频率执行该方法
		requestAnimationFrame(this.animationFrameHandler.bind(this))
	}
	/*
	 	@params video{HTMLVideoElement}
	 * */
	//屏幕录制组件
	setScreenVideo(video){
		this.screenVideo=video;
	}
	//摄像头组件
	setCameraVideo(video){
		this.cameraVideo=video;
	}
	//根据屏幕刷新频率执行该方法
	animationFrameHandler(){
		if(this.screenVideo){
			//屏幕录制存在,则画入这一帧屏幕录制
			this.context2d.drawImage(this.screenVideo,0,0,this.canvasWidth,this.canvasHeight)
		}
		if(this.cameraVideo){
			//摄像头存在,则画入摄像头的一帧到右下角
			this.context2d.drawImage(this.cameraVideo,
				this.canvasWidth-this.CAMERA_VIDEO_WIDTH,this.canvasHeight-this.CAMERA_VIDEO_HEIGHT,
			this.CAMERA_VIDEO_WIDTH,this.CAMERA_VIDEO_HEIGHT
			)
		}
		//重复调用该方法
		requestAnimationFrame(this.animationFrameHandler.bind(this))
	}
		/*
	 	@returns {HTMLCanvasElement}
	 * */
}
module.exports = PlayerCanvas;