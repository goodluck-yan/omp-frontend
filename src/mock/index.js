import Mock from 'mockjs'
import classTree from './model/classTree.js'

Mock.mock('/\/api\/classTree', 'get', classTree)
