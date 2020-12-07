//path common.js
const path = require("path");
console.log("项目的绝对路径", __dirname);
console.log(
  "项目中某个目录的绝对路径",
  path.resolve(__dirname, "./src/components")
); //获取绝对路径

// commonjs 规范 node.js的规范
module.exports = {
  // 基本路径
  publicPath: process.env.NODE_ENV === "production" ? "" : "/",
  lintOnSave: false, //是否开启语法检测
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
  configureWebpack: config => {
    config.resolve = {
      extensions: [".js", ".json", ".vue"], //引入文件的时候不写后缀名 默认加载的文件类型
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@c": path.resolve(__dirname, "./src/components"),
        "@a": path.resolve(__dirname, "./src/assets"), //获取assets路径
        public: path.resolve(__dirname, "./public"), //获取public路径
        vue$: "vue/dist/vue.esm.js"
      }
    };
  },
  // 代理
  devServer: {
    port: 8080, //接口
    open: true, //启动项目会自动打开浏览器
    // logLevel:'debug',	//打印代理日志
    proxy: {
      //代理
      //http://localhost:8010/api/getSms/
      //http://www.web-jshtml.cn/productapi/api/getSms/
      //http://www.web-jshtml.cn/productapi/getSms/
      "/api": {
        target: "http://www.web-jshtml.cn/productapi/", //目标接口
        changeOrigin: true, //是否跨域 生成一个localhost:8010 域名下一个node服务器，帮你做代理
        // 重写url
        pathRewrite: {
          "^/api": ""
        }
      }
    }
  }
};
