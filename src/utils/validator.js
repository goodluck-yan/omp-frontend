// 检测邮箱
export const checkEmail = (value) => {
  let reg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/
  return reg.test(value);
}

// IP校验规则
const IPReg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
// ip检测
export const validateIP = function(t){
  return IPReg.test(t);
}  

// 校验特殊字符
export const checkSpecialCharacter = (value) => {
  let reg = new RegExp("[`~!@#$%^&*()=|{}':;'\"\",\\[\\]<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
  return reg.test(value)
}

// 校验中文
export const checkChinese = (value) => {
  let reg = /[\u4e00-\u9fa5]/
  return reg.test(value)
}

// 编码的检验 只包含数字、字母、下划线，不能以数字或下划线开头
export const checkCode = (value) => {
	let reg = /^[a-zA-Z]+[a-zA-Z0-9_]*$/
	return reg.test(value)
}
