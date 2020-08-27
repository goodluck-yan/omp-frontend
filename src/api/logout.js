import request from '@/utils/apiInterceptor'

export function logout() {
  return request({
    url: 'api/auth/logout',
    method: 'get'
  })
}
