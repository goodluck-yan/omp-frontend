import request from '@/utils/apiInterceptor'

// 实体操作
export function instancesAction (obj) {
	return request({
    url: `api/v0.1/moulds/${obj.modelId}/instances`,
    method: obj.method,
    data: obj.data,
    params: obj.params
	})
}
// 单个实体操作
export function singleInstanceAction (obj) {
	return request({
    url: `api/v0.1/instances/${obj.instance_id}`,
    method: obj.method,
    data: obj.data,
    params: obj.params
	})
}
