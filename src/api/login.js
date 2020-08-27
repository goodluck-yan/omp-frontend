import request from '@/utils/apiInterceptor'

export function login(data) {
  return request({
    url: 'api/auth/login',
    method: 'post',
    data,
    transformRequest: [function (data) {
      // 将数据转换为表单数据
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
