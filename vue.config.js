const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
    lintOnSave:false,
  configureWebpack:{
  	externals:{
  		'electron':'require("electron")'
  	},
  },
	  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:9070',
       	pathRewrite:{'^/api':''},
	      ws: false,//用于支持websocket
	      secure: false,
        changeOrigin: true	//用于控制请求头中的host值
      }
    },
  }
})
