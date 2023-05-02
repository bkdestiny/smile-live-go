<template>
	<div id="login-box">
		<div style="font-size: 20px;margin: 20px 0 50px 0;text-align: center;">用户登录</div>
		<div><div class="login-box-label">用户名:</div><el-input class="login-box-input" v-model="account" type="text" placeholder="输入用户名或手机号"/></div>
		<div><div class="login-box-label">密码:</div><el-input class="login-box-input" v-model="loginForm.password" type="password" placeholder="输入密码" /></div>
		<el-button @click="handlerLoginByPassword" 
			style="position: relative;left: 40%;top:10%;
			width: 120px;height: 40px;background: dodgerblue;color:white">登录</el-button>
	</div>
</template>

<script>
	import {mapState} from 'vuex'
	export default{
		name:'Login',
		data(){
			return{
				account:'',
				loginForm:{
					password:''
				}
			}
		},
		mounted(){
			this.autoLogin()
		},
		computed:{
			...mapState(['currentUser'])
		},
		methods:{
			autoLogin(){
				this.$store.dispatch('aCurrentUser')
			},
			handlerLoginByPassword(){
				if(this.account.length<1){
					this.$message.info("用户名或密码不能为空")
					return;
				}
				if(this.account.length==11){
					this.loginForm.phone=this.account
				}else{
					this.loginForm.username=this.account
				}
				this.$axios({
					method:'POST',
					url:'/api/user/loginByPassword',
					data:this.loginForm
				}).then(
					response=>{
						if(response.data.success){
							localStorage.setItem("token",response.data.data)
							this.$store.dispatch('aCurrentUser')
							this.$store.dispatch('aCurrentLiveRoom')
							this.$router.replace({
								name:'livego'
							})
						}else{
							console.log(response.data.message)
						}
					}
				)
			}
		}
	}
</script>

<style scoped>
#login-box{
	width: 460px;
	height: 360px;
	position: relative;
	left: 30%;
	top:200px;
	border:1px solid lightgray;
}
#login-box>div{
	display:block;
	float: left;
	width: 100%;
	margin-bottom: 20px;
}
.login-box-label{
	width: 160px;
	height: 50px;
	line-height: 50px;
	text-align: center;
	display: inline-block;
	float: left;
}
.login-box-input{
	display: inline-block;
	float: left;
	width: 250px;
}
</style>