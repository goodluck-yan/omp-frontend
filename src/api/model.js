import request from '@/utils/apiInterceptor'

// 模型分组相关操作
export function modelGroupAction (obj) {
	return request({
    url: `api/v0.1/layers/${obj.layer_id}/aggregations`,
    method: obj.method,
    data: obj.data
	})
}
// 单个分组操作 put delete
export function groupAction (obj) {
	return request({
    url: `api/v0.1/aggregations/${obj.id}`,
    method: obj.method,
    data: obj.data
	})
}
// 模型分组中的模型操作
export function modelOfGroupAction (obj) {
	return request({
    url: `api/v0.1/layers/${obj.layer_id}/aggregations/${obj.model_group_id}/moulds`,
    method: obj.method,
    data: obj.data
	})
}
// 获取模型分组树形结构 Mock
export function getClassTree () {
	return request({
    url: `/api/v0.1/classTree`,
    method: 'get'
	})
}
// 获取分组下的所有模型
export function getModelsByGroupId (id) {
	return request({
    url: `api/v0.1/aggregations/${id}/moulds`,
    method: 'get'
	})
}
// 模型相关操作
export function modelAction (obj) {
  return request({
    url: `api/v0.1/moulds/${obj.modelId}`,
    method: obj.method,
    data: obj.data
  })
}
// 获取所有模型
export function getAllModels () {
  return request({
    url: 'api/v0.1/moulds',
    method: 'get'
  })
}

// 模型关系
export function getModelRelationTree (obj) {
  return request({
    url: `api/v0.1/layers/${obj.layer_id}/moulds/tree`,
    method: obj.method
  })
}
