import request from '@/utils/apiInterceptor'

// export function login(data) {

//   return request({
//     url: 'http://192.168.9.47/zabbix/index.php',
//     method: 'post',
//     data,
//     transformRequest: [function (data) {
//       // 将数据转换为表单数据
//       let ret = ''
//       for (let it in data) {
//         ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
//       }
//       return ret
//     }],
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//       'Origin': 'http://192.168.9.47',
//       'Referer': 'http://192.168.9.47/zabbix/'
//     }
//   })
// }