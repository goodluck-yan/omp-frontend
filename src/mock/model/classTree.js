// 模型和分组的层级结构
const classTree = {
  'code': 200,
  'data': [
    {
    	'id': 'Infrastructure',
    	'code': 'Infrastructure',
      'name': '基础设施层',
    	'children': [
    		{
          'id': '5a675a241637a2aa1673c944',
          'code': 'PCServer',
          'name': '服务器',
          'children': []
        },
        {
          'id': '5a675a241637a2aa1673c94c',
          'code': 'Router',
          'name': '服务器',
          'children': []
        },
        {
          'id': '5a675a241637a2aa1673c957',
          'code': 'Switch',
          'name': '交换机',
          'children': []
        }
    	]
    },
    {
      'id': 'Management Resource',
      'code': 'Management Resource',
      'name': '管理资源层',
      'children': [
        {
          'id': '5a675a241637a2aa1673c924',
          'code': 'IPAddress',
          'name': 'IP',
          'children': []
        },
        {
          'id': '5a675a241637a2aa1673c948',
          'code': 'Project',
          'name': '项目',
          'children': []
        }
      ]
    },
  ]
}

export default classTree