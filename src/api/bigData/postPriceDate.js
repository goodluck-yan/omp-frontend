import request from '@/utils/apiInterceptor'

export function post_price_data(data) {
	return request({
    url: 'api/bigData/post_price_data',
    data,
    method: 'post'
	})
}