import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueRouter from 'vue-router'
import router from './router'
import VueSocketIO from 'vue-socket.io'
import Vuex from 'vuex'
import store from './store'
import "./plugins/element"
import './assets/css/reset.css'
Vue.prototype.$axios=axios
Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(new VueSocketIO({
	debug:true,
	options:{
		autoConnect:true
	},
	connection:'ws://localhost:9092',
}))

new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app')
