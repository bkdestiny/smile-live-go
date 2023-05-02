//引入V0+uex
import Vuex from 'vuex'
import Vue from 'vue'
import axios from 'axios'
import router from '../router'
Vue.use(Vuex)
//用于响应组件中的动作
const actions={
		aCurrentUser(context){
		if(localStorage.getItem("token")!=null){
  			axios({
  				method:'GET',
  				url:'/api/user/currentUser',
  				headers:{
  					authorization:localStorage.getItem("token")
  				}
  			}).then(
  				response=>{
  					if(response.data.success){
  						console.log('自动登录')
  						context.commit('mCurrentUser',response.data.data)
  						router.replace({
  							name:'livego'
  						})
  					}else{
  						localStorage.removeItem("token")
  						console.log(response.data.message)
  					}
  				}
  			)
  		}
	},
	aCurrentLiveRoom(context){
		if(localStorage.getItem("token")!=null){
			axios({
				method:'GET',
				url:'/api/liveroom/currentLiveRoom',
				headers:{
					authorization:localStorage.getItem("token")
				}
			}).then(
				response=>{
					if(response.data.success){
						console.log('data->',response.data)
						context.commit('mCurrentLiveRoom',response.data.data)
					}else{
						router.replace({
							name:'login'
						})
						alert('获取直播间信息失败')
					}
				}
			)
		}
	}
}
//用于操作数据
const mutations={
	mCurrentUser(state,data){
		state.currentUser=data
	},
	mCurrentLiveRoom(state,data){
		state.currentLiveRoom=data
	}
/*	SOCKET_chatevent(state,data){
		console.log('vuex -->',data)
		state.message.push(data)
	},*/
/*	SOCKET_currentUser(state,data){
		state.currentUser=data;
	}*/
}
//用于将state中的数据进行加工
const getters={
	
}
const state={
	currentUser:null,
	currentLiveRoom:null
}

export default new Vuex.Store({
	actions,mutations,state,getters
})

