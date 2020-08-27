import request  from '@/utils/apiInterceptor'

// 获取用户信息列表
export function get_user_list(data){
    return request({
        url: 'api/sysManage/get_user_list',
        data,
        method: 'post'
    })
}


// 添加用户
export function add_user(data){
    return request({
        url: 'api/sysManage/add_user',
        data,
        method: 'post'
    })
}


// 删除用户
export function del_user(data){
    return request({
        url: 'api/sysManage/del_user',
        data,
        method: 'post'
    })
}


// 修改用户基本信息
export function edit_user(data){
    return request({
        url: 'api/sysManage/edit_user_info',
        data,
        method: 'post'
    })
}


//获取用户关联的角色ID列表
export function get_user_roleId_list(data){
    return request({
        url: 'api/sysManage/get_user_roleId_list',
        data,
        method: 'post'
    })  
}


//修改用户角色
export function edit_user_role(data){
    return request({
        url: 'api/sysManage/edit_user_role',
        data,
        method: 'post'
    })
}


//重置用户密码
export function reset_password(data){
    return request({
        url: 'api/sysManage/reset_password',
        data,
        method: 'post'
    })
}