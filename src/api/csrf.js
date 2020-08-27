import request from '@/utils/apiInterceptor'

export function  get_csrf(){

    return request({
        url: 'api/auth/get_csrf_token',
        method: 'get'
      })

}

