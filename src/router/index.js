import VueRouter from 'vue-router'
import Login from '../views/Login'
import LiveGo from '../views/LiveGo'
const router=new VueRouter({
	routes:[
	{
		name:'login',
		path:'/',
		component:Login,
	},
	{
		name:'livego',
		path:'/livego',
		component:LiveGo
	},
	
	]
})
export default router
