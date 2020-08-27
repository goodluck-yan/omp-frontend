import request from '@/utils/apiInterceptor'

//获取全量菜单+按钮权限结构树数据
export function get_all_menu_permission() {
	return request({
    url: 'api/sysManage/get_all_menu_permission',
    method: 'post'
	})
}

//增加功能菜单
export function add_func_menu(data) {
	return request({
    url: 'api/sysManage/add_func_menu',
    data,
    method: 'post'
	})
}

//删除功能菜单
export function del_func_menu(data) {
	return request({
    url: 'api/sysManage/del_func_menu',
    data,
    method: 'post'
	})
}


//修改功能菜单
export function edit_func_menu(data) {
	return request({
    url: 'api/sysManage/edit_func_menu',
    data,
    method: 'post'
	})
}