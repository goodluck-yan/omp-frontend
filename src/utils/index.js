// 提取对象类型
const isType = (obj, type) => {
  if (typeof obj !== 'object') return false;
  const typeString = Object.prototype.toString.call(obj); // 检测对象类型
  let flag;
  switch (type) {
    case 'Array':
      flag = typeString === '[object Array]';
      break;
    case 'Date':
      flag = typeString === '[object Date]';
      break;
    case 'RegExp':
      flag = typeString === '[object RegExp]';
      break;
    default:
      flag = false;
  }
  return flag;
};

// 正则表达式提取 flags
const getRegExp = re => {
  var flags = '';
  if (re.global) flags += 'g';
  if (re.ignoreCase) flags += 'i';
  if (re.multiline) flags += 'm';
  return flags;
};
// 深度克隆
export const deepClone = parent => {
  // 基本类型直接返回
  if (parent === null) return null;
  if (typeof parent !== 'object') return parent;
  let child, proto;
  // 根据类型创建一个相应类型的child 并进行初始化  -- 避免复杂数据类型直接复制地址，保证每次都被拷贝到一个新的地址中
  if (isType(parent, 'Array')) {
    // 对数组做特殊处理  -- 创建一个空数组
    child = [];
  } else if (isType(parent, 'RegExp')) {
    // 对正则对象做特殊处理  -- 复制正则表达式
    child = new RegExp(parent.source, getRegExp(parent));
    if (parent.lastIndex) child.lastIndex = parent.lastIndex;
  } else if (isType(parent, 'Date')) {
    // 对Date对象做特殊处理 -- 复制日期
    child = new Date(parent.getTime());
  } else {
    // 处理对象原型  -- 创建一个空对象
    proto = Object.getPrototypeOf(parent);
    // 利用Object.create切断原型链  根据指定的原型创建对象
    child = Object.create(proto);
  }
  for (let i in parent) {
    // 递归
    child[i] = deepClone(parent[i]);
  }
  return child;  // child为最终克隆的结果
};
