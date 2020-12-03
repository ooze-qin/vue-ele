//path common.js
const path = require('path')
console.log('项目的绝对路径',__dirname)
console.log('项目中某个目录的绝对路径',path.resolve(__dirname,'./src/components')) //获取绝对路径

// commonjs 规范 node.js的规范
module.exports  = {
	lintOnSave:false, //是否开启语法检测
	css: {
		// 是否使用css分离插件 ExtractTextPlugin
		extract: true, 
		// 开启 CSS source maps?
		sourceMap: true,
		// css预设器配置项
		loaderOptions: {
			scss: {
				prependData: `@import "./src/styles/main.scss";`
			}
		}
	},
	// 配置目录的别名
	configureWebpack: (config) => {
		config.resolve = {
			extensions:['.js','.json','.vue'], //引入文件的时候不写后缀名 默认加载的文件类型
			alias:{
				'@':path.resolve(__dirname,'./src'),
				'@c':path.resolve(__dirname,'./src/components'),
				'@a':path.resolve(__dirname,'./src/assets'), //获取assets路径
				'public':path.resolve(__dirname,'./public'), //获取public路径
				'vue$':'vue/dist/vue.esm.js'
			}
		}
	}
}
