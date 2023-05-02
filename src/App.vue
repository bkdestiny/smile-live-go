<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>


export default {
  name: 'App',
  components: {
  	
  },
  mounted(){
  	this.initSocketIO()
  },
  methods:{
  	initSocketIO(){
  		this.$socket.on('connect',()=>{
  			console.log('连接成功')
  		});
  		this.$socket.on('disconnect',()=>{
  			console.log('连接断开')
  		});
  	},
  }
}
</script>

<style>
</style>
