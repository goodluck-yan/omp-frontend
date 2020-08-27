import Vue from 'vue'
import 'normalize.css/normalize.css'// A modern alternative to CSS resets
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // 定义全局样式

// 导入字体图标库
import 'font-awesome/less/font-awesome.less'
import "./theme/light.scss"//定义换皮肤的样式
import "./theme/dark.scss"//定义换皮肤的样式


Vue.use(Element)

// 导入登陆界面用的Vue粒子特效
import VueParticles from "vue-particles";
Vue.use(VueParticles);


import App from './App'
import router from './router'
import store from './store'

import 'xterm/dist/xterm.css'


//引入中国地图
import echarts from 'echarts'
import 'echarts/map/js/china'
import VCharts from "v-charts"
Vue.prototype.$echarts = echarts
Vue.use(VCharts); 

//注册全局事件对象
// window.eventBus=new Vue();
Vue.prototype.$bus=new Vue()

Vue.config.productionTip = false
document.body.ondrop = function (event) {
	event.preventDefault()
	event.stopPropagation()
}
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
