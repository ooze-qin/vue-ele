import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// 引入element-ul
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
// 依赖composition-api
import VueCompositionApi from '@vue/composition-api';
Vue.use(VueCompositionApi);
// 系统默认的环境变量
console.log(process.env.NODE_ENV)
// 自定义环境变量
/*
  如果是线下 npm run serve
    默认读取 .env.development
  如果是线上 npm run build
    默认读取 .env.production
*/ 


// 导入css 入口文件
// import './styles/main.scss'

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
