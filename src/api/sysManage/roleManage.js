import request from '@/utils/apiInterceptor'

// 获取头部菜单
// export function get_head_menu() {
// 	return request({
//     url: 'sysManage/get_head_menu',
//     method: 'get'
// 	})
// }


// // 获取左边菜单
// export function get_left_menu(obj) {
// 	return request({
//     url: 'sysManage/get_left_menu',
//     method: 'get',
//     data: obj.data
// 	})
// }

// 查询角色列表
export function get_role_list(data) {
	return request({
    url: 'api/sysManage/get_role_list',
    data,
    method: 'post'
	})
}
//添加角色
export function add_role(data) {
	return request({
    url: 'api/sysManage/add_role',
    data,
    method: 'post'
	})
}

//删除角色
export function del_role(data) {
	return request({
    url: 'api/sysManage/del_role',
    data,
    method: 'post'
	})
}

//修改角色基本信息
export function edit_role(data) {
	return request({
    url: 'api/sysManage/edit_role_info',
    data,
    method: 'post'
	})
}

// 获取角色权限ID列表
export function get_role_permissionID_list(data) {
	return request({
    url: 'api/sysManage/get_role_permissionID_list',
    data,
    method: 'post'
	})
}




//修改角色权限
export function edit_role_permission(data){
	return request({
        url: 'api/sysManage/edit_role_permission',
        data,
        method: 'post'
        })
}


//获取角色关联用户的ID列表
export function get_role_userID_list(data){
	return request({
        url: 'api/sysManage/get_role_userID_list',
        data,
        method: 'post'
        })
}


//修改角色关联的用户
export function edit_role_user(data){
	return request({
        url: 'api/sysManage/edit_role_user',
        data,
        method: 'post'
        })
}