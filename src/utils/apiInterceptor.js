import axios from 'axios'
import { MessageBox } from 'element-ui'
import { Message} from 'element-ui'
import store from '../store/index'
import router from '../router/index'

import {showFullScreenLoading, tryHideFullScreenLoading} from './globalLoding.js'






// 创建axios实例
const service = axios.create({
  // baseURL: process.env.BASE_API
  // timeout: 5000,
})

// service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';


// request拦截器
service.interceptors.request.use(
  config => {
    //除获取scrf的token之外所有的请求必须携带token
    if(!config.url.includes('get_csrf_token')){ 
      config.xsrfCookieName='csrftoken';
      config.xsrfHeaderName='X-CSRFtoken';
    }
    showFullScreenLoading();
    return config
  },
  error => {
    showFullScreenLoading();
    return Promise.reject(error)
  }
)

// respone拦截器
service.interceptors.response.use(
  response => {
    //判断session和token是否过期
    tryHideFullScreenLoading();
    if(response.data.status === 10001){
      router.push({path: '/login'});
      let a={};
      let b=[];

      store.commit('SET_USER_INFO',a);
      store.commit('SET_MENU_LIST',b);
      Message({
        message: response.data.message,
        type: 'warning'
      })
    }else if (response.data.status !== 1){
      Message({
        message: response.data.message,
        type: 'warning'
      })
    }

    return  response
  },
  error => {
    // 判断csrf认证失败，就返回登陆界面
    tryHideFullScreenLoading();
    if( error.response.status === 403){
      router.push({path: '/login'});
      return Promise.reject(error)
    }


    // 拦截响应的错误信息 统一提示
  	Message({
      message: '系统忙，请稍后再试！',
      type: 'warning',
      // duration: 3 * 1000
    })

    return Promise.reject(error)
  }
)
export default service
