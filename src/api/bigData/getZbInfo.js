import request from '@/utils/apiInterceptor'


export function get_info_alarm(){
    return request({
        url:'api/bigData/get_info_alarm',
        method:'get',
    })
}