import request from '@/utils/apiInterceptor'

export function post_translate_data(data) {
	return request({
    url: 'api/CMDB/post_translate_data',
    data,
    method: 'post'
	})
}