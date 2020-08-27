import request from '@/utils/apiInterceptor'


export function post_token(){
    return request({
        url:'api/bigData/post_token',
        method:'get',
       
    })
}