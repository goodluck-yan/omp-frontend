import Vue from 'vue';
import VueRouter from 'vue-router';
import { homedir } from 'os';
Vue.use(VueRouter);

// 登录
// const login = r => require.ensure([], () => r(require('@/views/login/index.vue')), 'login')
import login from '@/views/login/index.vue'

// home
// const layout = r => require.ensure([], () => r(require('@/views/layout/index.vue')), 'layout')
import layout from  '@/views/layout/index.vue'

import home from  '@/views/layout/home.vue'

//角色管理
const roleManage = r => require.ensure([], () => r(require('@/views/sysManage/roleManage/index.vue')), 'roleManage')

//用户管理
const userManage = r => require.ensure([], () => r(require('@/views/sysManage/userManage/index.vue')), 'userManage')

//功能菜单管理
const funcMenuManage = r => require.ensure([], () => r(require('@/views/sysManage/funcMenuManage/index.vue')), 'funcMenuManage')

//运维大数据平台
const operations = r => require.ensure([], () => r(require('@/views/bigData/operations/index.vue')), 'operations')

//运维大数据-价格指数-周报提取
const weekly = r => require.ensure([], () => r(require('@/views/bigData/weekly/index.vue')), 'weekly')

//zabbix监控
const Zabbix = r => require.ensure([], () => r(require('@/views/monitor/Zabbix/index.vue')), 'Zabbix')

//PinPoint监控
const PinPoint = r => require.ensure([], () => r(require('@/views/monitor/PinPoint/index.vue')), 'PinPoint')

//cmdb-serverManage
const serverManage = r => require.ensure([], () => r(require('@/views/cmdb/serverManage/index.vue')), 'serverManage')

//cmdb-ssh
const WebSSH = r => require.ensure([], () => r(require('@/views/cmdb/WebSSH/index.vue')), 'WebSSH')



// 模型管理
const model = r => require.ensure([], () => r(require('@/views/model/index.vue')), 'model')

// 资源管理
const  resource = r => require.ensure([], () => r(require('@/views/resource/index.vue')), 'resource')

// 视图管理
const  view = r => require.ensure([], () => r(require('@/views/view/index.vue')), 'view')

// 分组管理
const groupManage = r => require.ensure([], () => r(require('@/views/model/modelManagement/index.vue')), 'groupManage')

// 模型模板
const modelTemplate = r => require.ensure([], () => r(require('@/views/model/modelTemplate/index.vue')), 'modelTemplate')

// 模型关系
const modelRelationship = r => require.ensure([], () => r(require('@/views/model/modelRelationship/index.vue')), 'modelRelationship')

// 属性列表
// const propertyList = r => require.ensure([], () => r(require('@/views/model/modelManagement/propertyList.vue')), 'propertyList')

// 仓库配置
const repositoryConfig = r => require.ensure([], () => r(require('@/views/resource/repositoryConfig/index.vue')), 'repositoryConfig')

// 仓库概览
const repositoryOverview = r => require.ensure([], () => r(require('@/views/resource/repositoryOverview/index.vue')), 'repositoryOverview')

// 仓库列表
const repositoryList = r => require.ensure([], () => r(require('@/views/resource/repositoryConfig/repositoryList.vue')), 'repositoryList')

// 404
const error404 = r => require.ensure([], () => r(require('@/components/ErrorPage/error404.vue')), 'error404')

// 401
const error401 = r => require.ensure([], () => r(require('@/components/ErrorPage/error401.vue')), 'error401')

const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: login
    },
    {
      path: '/layout',
      component: layout,
      name: '主页布局',
      children: [
        {
          path: '/layout/home',
          component: home,
          name: '渲染布局首页',

        }
      ]
    },
    {
      path: '/sysManage',
      component: layout,
      name: '系统管理',
      children: [
        {
          path: '/sysManage/roleManage',
          component: roleManage,
          name: '角色管理',
          
        },
        {
          path: '/sysManage/userManage',
          component: userManage,
          name: '用户管理',
          
        },
        {
          path: '/sysManage/funcMenuManage',
          component: funcMenuManage,
          name: '功能菜单管理',
          
        },
      ]
    },
    {
      path: '/bigData',
      component: layout,
      name: '大数据',
      children: [
        {
          path: '/bigData/weekly',
          component:weekly,
          name:'周报提取',
        },
      ]
    },
   
    // {
    //   path: '/bigData/weeky',
    //   component:weeky,
    //   name:'价格指数-周报提取',
    // },
    {
          path: '/bigData/operations',
          component: operations,
          name: '大数据平台',
    },
    {
      path: '/cmdb',
      component: layout,
      name: '资产管理',
      children: [
        {
          path: '/cmdb/serverManage',
          component:serverManage,
          name:'主机管理',
        },
      ]
    },
    {
      path: '/cmdb/WebSSH',
      component: WebSSH,
      name: 'SSH',
    },
    {
      path: '/dbmanage',
      component: layout,
      name: '数据库管理',
    },
    {
      path: '/monitor/Zabbix',
      component: Zabbix,
      name: 'Zabbix监控',
    },
    {
      path: '/monitor/PinPoint',
      component: PinPoint,
      name: 'PinPoint监控',
    },

    // {
    //   path: '/model',
    //   component: layout,
    //   name: '模型管理',
    //   children: [
    //     {
    //       path: '/model/:modelManageType',
    //       component: model,
    //       name: '模型资源层',
    //       redirect: '/model/:modelManageType/group',
    //       children: [
    //         {
    //           path: '/model/:modelManageType/group',
    //           component: groupManage,
    //           name: '分组管理',
    //           children: [
    //             {
    //               path: '/model/:modelManageType/group/:groupIndex/:modelId',
    //               component: propertyList,
    //               name: ''
    //             }
    //           ]
    //         },
    //         {
    //           path: '/model/:modelManageType/template',
    //           component: modelTemplate,
    //           name: '模型模板'
    //         },
    //         {
    //           path: '/model/:modelManageType/relation',
    //           component: modelRelationship,
    //           name: '模型关系'
    //         }
    //       ]
    //     }
    //   ]
    // },
    {
      path: '/resource',
      component: layout,
      name: '仓库管理',
      children: [
        {
          path: '/resource/:repositoryManageType',
          component: resource,
          name: '仓库资源层',
          redirect: '/resource/:repositoryManageType/list',
          children: [
            {
              path: '/resource/:repositoryManageType/list',
              component: repositoryConfig,
              name: '仓库配置',
              children: [
                {
                  path: '/resource/:repositoryManageType/list/:groupIndex/:modelId',
                  component: repositoryList,
                  name: ''
                }
              ]
            },
            {
              path: '/resource/:repositoryManageType/overview',
              component: repositoryOverview,
              name: '仓库总览'
            }
          ]
        }
      ]
    },
    {
      path: '/',
      component: layout,
      children: [
        {
          path: '/view',
          component: view,
          name: '视图管理'
        }
      ]
    }
  ]
})
export default router
