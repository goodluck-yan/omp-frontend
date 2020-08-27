export function filterPropertyType (type) {
  switch (type) {
    case 'singleRowText':
      return '单行文本'
    case 'multiRowText':
      return "多行文本"
    case 'int':
      return "整数"
    case 'float':
      return '小数'
    case 'dateTime':
      return '日期'
    case 'listSel':
      return '下拉菜单'
    case 'singleSel':
      return '单选'
    case 'multiSel':
      return '多选'
    case 'belongReference':
      return '从属关系'
    case 'linkReference':
      return '连接关系'
    case 'group':
      return '属性分组'
  }
}
