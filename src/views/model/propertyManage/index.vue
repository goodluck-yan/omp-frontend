<template>
  <div style="height: 100%">
  	<div v-if="isShowTable" class="container">
	  	<div class="properties-action-btn">
	  		<el-button type="primary" size="small" @click="handleClickPropertyManageBtn">属性管理</el-button>
	  	</div>
	  	<!--属性列表展示-->
	    <div class="properties-table">
	      <el-table :data="propertyList" border style="width: 100%" align="center" size="small">
	        <el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
	        <el-table-column prop="name" label="属性名称" align="center"></el-table-column>
	        <el-table-column prop="defaultValue" label="属性默认值" align="center">
	          <template slot-scope="scope">{{scope.row.defaultValue || '无'}}</template>
	        </el-table-column>
	        <el-table-column prop="code" label="属性编码" align="center"></el-table-column>
	        <el-table-column prop="type" label="属性类型" align="center"></el-table-column>
	        <el-table-column prop="required" label="是否必填" align="center">
	        	<template slot-scope="scope">{{String(scope.row.required)}}</template>
	        </el-table-column>
	      </el-table>
	    </div>
  	</div>
  	<!-- 属性编辑 -->
  	<div class="edit-wrap" v-else>
      <div class="content">
        <div class="left" id="leftWrap">
          <div class="left-action">
          	<el-button size="small" @click="handleClickCancelAllEdit">取 消</el-button>
      			<el-button type="primary" size="small" @click="handleClickSaveAllEdit">保 存</el-button>
          </div>
          <el-form ref="propertyListForm" :model="propertyListForm" label-width="130px">
          	<div ref="formContainer">
	            <div
	            	v-for="(item,index) in propertyList" 
	            	:key="item.code"
	            	@dragenter="dragenter($event,index)"
	            	@click="handleClickPropertyItem(item, index)"
	            	class="left-item">
	              <div class="item-mask"></div>
	              <div class="item-row">
                  <!-- 非分组 -->
		              <el-form-item 
                    :label="item.name + '：'" 
                    :prop="item.code" 
                    v-show="item.type !== 'group'">
		                <el-input 
		                	v-model="propertyListForm[item.code]"
		                	v-show="item.type === 'singleRowText' || item.type === 'int' || item.type === 'double' || item.type === 'belongReference' || item.type === 'linkReference'" :placeholder="item.type === 'belongReference' || item.type === 'linkReference'? '请选择关联模型' : ''"
                      size="small">
		                </el-input>
		                <!-- 多行文本 -->
					          <el-input
					          	v-show="item.type === 'multiRowText'"
					          	type="textarea" 
					          	:rows="2"
					          	v-model="propertyListForm[item.code]">
					          </el-input>
					          <!-- 日期 -->
					          <el-date-picker
								      v-model="propertyListForm[item.code]"
								      v-show="item.type === 'dateTime'"
								      type="date"
								      style="width: 100%"
								      placeholder="选择日期"
                      size="small">
								    </el-date-picker>
		                <!-- 下拉菜单 -->
		                <el-select 
		                	v-model="propertyListForm[item.code]"
		                	v-show="item.type === 'listSel'"
		                	style="width: 100%;"
		                	placeholder="请选择"
                      size="small">
									    <el-option value="" label=""></el-option>
									  </el-select>
									  <!-- 单选 -->
										<el-radio-group 
											v-model="propertyListForm[item.code]"
											v-show="item.type === 'singleSel'">
									    <el-radio label=""></el-radio>
									  </el-radio-group>
									  <!-- 多选 -->
									  <el-checkbox 
									  	v-model="propertyListForm[item.code]"
									  	v-show="item.type === 'multiSel'">
									  </el-checkbox>
		              </el-form-item>
                   <!-- 属性分组 -->
                  <div v-show="item.type === 'group'" class="group">
                    <span><i class="el-icon-caret-bottom"></i></span>
                    <span>{{ item.name }}</span>
                  </div>
		              <span class="item-delete" @click.stop="deletepre(index)">
		                <i class="fa fa-trash-o"></i>
		              </span>
	              </div>
	            </div>
          	</div>
          </el-form>
        </div>
        <div class="right">
          <div class="right-content">
            <div class="right-head font">属性类型</div>
            <div class="right-tips font">属性类型可拖动到左侧编辑区哦！</div>
            <div class="right-wrap">
              <div
              	class="options font"
              	:draggable="isDraggable"
              	:data-type-index="index"
              	@dragstart="dragstart"
              	@dragend="dragend"
                v-for="(item,index) in typeList"
                :key="item.type">
                <span>{{ item.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
  	</div>
  	<!-- 属性编辑弹出层 -->
		<el-dialog
			:close-on-click-modal="false"
			:show-close="false"
			:close-on-press-escape="false"
			title="编辑属性"
			width="500px"
      :visible.sync="dialogFormVisible">
      <el-form
      	:rules="singlePropertyFormRules"
      	:model="singlePropertyForm"
      	labelPosition="right"
      	label-width="120px"
      	ref="singlePropertyForm">
      	<!-- 属性名称 -->
        <el-form-item prop="name" label="属性名称：">
          <el-input v-model="singlePropertyForm.name"></el-input>
        </el-form-item>
        <!-- 属性编码 -->
        <el-form-item class="form-item-code" prop="code" label="属性编码：">
          <el-input v-model="singlePropertyForm.code"></el-input>
        </el-form-item>
        <el-form-item 
        	prop="defaultValue" 
        	label="默认值："
          v-show="currentPropertyType === 'singleRowText' || currentPropertyType === 'multiRowText' || currentPropertyType === 'int' || currentPropertyType === 'double'">
          <!-- 多行文本 -->
          <el-input
          	v-if="currentPropertyType === 'multiRowText'"
          	type="textarea" 
          	:rows="2" 
          	v-model="singlePropertyForm.defaultValue">
          </el-input>
          <!-- 整数 -->
          <el-input-number v-else-if="currentPropertyType === 'int'" v-model="singlePropertyForm.defaultValue"></el-input-number>
          <el-input v-else v-model="singlePropertyForm.defaultValue"></el-input>
        </el-form-item>
        <!-- 单位 -->
        <el-form-item
        	prop="unit"
        	label="单位："
        	v-show="currentPropertyType === 'int' || currentPropertyType === 'double'">
          <el-input v-model="singlePropertyForm.unit"></el-input>
        </el-form-item>
        <!-- 是否必填 -->
        <el-form-item
        	prop="required"
        	label="必填：">
          <el-checkbox style="margin-right: 40px;" v-model="singlePropertyForm.required"></el-checkbox>
        </el-form-item>
        <!-- 校验规则 -->
        <el-form-item
        	v-show="currentPropertyType === 'singleRowText'"
        	prop="verify"
        	label="校验规则：">
          <el-select v-model="singlePropertyForm.verify">
            <el-option label="无校验" value=""></el-option>
            <el-option label="IP" value="ip"></el-option>
            <el-option label="邮箱" value="email"></el-option>
          </el-select>
        </el-form-item>
        <!-- 保留几位小数 -->
        <el-form-item 
        	prop="precision"
        	label="小数位数："
        	v-show="currentPropertyType === 'double'">
          <el-input-number v-model="singlePropertyForm.precision"></el-input-number>
        </el-form-item>
        <!--文本最小长度   最小值-->
        <el-form-item
          v-show="currentPropertyType === 'singleRowText' || currentPropertyType === 'multiRowText' || currentPropertyType === 'int' || currentPropertyType === 'double'"
        	:prop="(currentPropertyType === 'singleRowText' || currentPropertyType === 'multiRowText')? 'minLength' : 'min'"
          :label="(currentPropertyType === 'singleRowText' || currentPropertyType === 'multiRowText')? '文本最小长度：' : '最小值：'">
          <el-input-number
          	v-show="currentPropertyType === 'singleRowText' || currentPropertyType === 'multiRowText'"
            v-model="singlePropertyForm.minLength">
           </el-input-number>
          <el-input-number
          	v-show="currentPropertyType === 'int' || currentPropertyType == 'double'" 
          	v-model="singlePropertyForm.min">
          </el-input-number>
        </el-form-item>
				<!--文本最大长度  最大值-->
        <el-form-item
        	:prop="(currentPropertyType === 'singleRowText' || currentPropertyType === 'multiRowText')? 'maxLength' : 'max'"
          v-show="currentPropertyType ==='singleRowText' || currentPropertyType === 'multiRowText' || currentPropertyType === 'int' || currentPropertyType === 'double'"
          :label="(currentPropertyType === 'singleRowText' || currentPropertyType === 'multiRowText') ? '文本最大长度：' : '最大值：'">
          <el-input-number
          	v-show="currentPropertyType ==='singleRowText' || currentPropertyType === 'multiRowText'"
            v-model="singlePropertyForm.maxLength">
          </el-input-number>
          <el-input-number
          	v-show="currentPropertyType ==='int' || currentPropertyType === 'double'" 
          	v-model="singlePropertyForm.max">
          </el-input-number>
        </el-form-item>
        <!-- 单选、多选、下拉列表 添加选项 -->
				<el-form-item 
					v-if="currentPropertyType === 'singleSel' || currentPropertyType === 'multiSel' || currentPropertyType === 'listSel'"
					prop="options"
					label="选项：">
          <el-col :span="2" :offset="18">
	          <el-button 
	          	type="primary"
	          	size="mini"
	          	icon="el-icon-plus"
	          	@click="addOption">
	          	添加
	          </el-button>
					</el-col>
        </el-form-item>
        <!-- 单选、多选、下拉列表 选项列表 -->
        <div class="options-container">
	        <el-row
	        	class="options-row"
	          :gutter="20"
	        	v-for="(item, index) in singlePropertyForm.options" 
					  :key="index"
					  v-if="currentPropertyType === 'singleSel' || currentPropertyType === 'multiSel' || currentPropertyType == 'listSel'">
					  <el-col :span="2">
              <el-form-item  label-width="1px">
                <span class="self-required">*</span>
					  		<el-tooltip content="设为默认值" placement="left">
								  <el-checkbox v-model="item.checked" @change="checkboxChange(item, index)"></el-checkbox>
								</el-tooltip>
					  	</el-form-item>
					  </el-col>
					  <el-col :span="9">
					  	<el-form-item :prop="item.name" label-width="1px">
			          <el-input size="small" v-model="item.name" placeholder="选项名称"></el-input>
			        </el-form-item>
					  </el-col>
					  <el-col :span="9">
					  	<el-form-item :prop="item.code" label-width="1px">
			          <el-input size="small" v-model="item.code" placeholder="选项编码"></el-input>
			        </el-form-item>
					  </el-col>
					  <el-col :span="4">
					  	<span class="options-delete-icon" @click="deleteOption(index)">
	          		<i class="fa fa-trash-o" aria-hidden="true"></i>
	          	</span>
					  </el-col>
					</el-row>
        </div>
        <!-- 日期 -->
        <el-form-item
        	v-if="currentPropertyType === 'dateTime'"
        	prop="date"
        	label="默认值：">
         	<el-date-picker
			      v-model="singlePropertyForm.date"
			      v-show="currentPropertyType === 'dateTime'"
			      type="date"
			      style="width: 100%"
			      placeholder="选择默认值">
			    </el-date-picker>
        </el-form-item>
        <!-- 引用对象 -->
        <el-form-item
        	v-if="currentPropertyType === 'belongReference' || currentPropertyType === 'linkReference'"
        	prop="refModelCode"
        	label="引用对象：">
          <el-select
          	style="width: 100%"
          	v-model="singlePropertyForm.refModelCode"
          	placeholder="请选择关联模型">
            <el-option
            	v-for="model in modelAll"
            	:key="model.code"
            	:label="model.name"
            	:value="model.code">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClickCancelEdit">取 消</el-button>
        <el-button type="primary" size="small" @click="handleClickConfirmEdit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
	let inner = document.createElement('div')
  inner.innerHTML = '文字拖放到这里'
  inner.className = 'inner'
	export default {
	  data () {
	    return {
	     	propertyList: [
          {
            "sortIndex": 10, 
            "code": "Rack_ID", 
            "name": "机柜编号", 
            "min": 0, 
            "max": 200, 
            "defaultValue": "", 
            "required": true, 
            "precision": 1, 
            "unit": "", 
            "verify": "IP", 
            "hidden": true, 
            "maxLength": 100, 
            "type": "singleRowText", 
            "id": "d5919c028ecd6355a0893037", 
            "minLength": 0
          },
          {
            "sortIndex": 0, 
            "max": 200, 
            "code": "baseInfo", 
            "name": "名称", 
            "min": 0, 
            "minLength": 0, 
            "defaultValue": "", 
            "required": true, 
            "precision": 1, 
            "verify": "", 
            "hidden": "false", 
            "maxLength": 200, 
            "type": "singleRowText", 
            "id": "bff069a99ea64a82a27a4506", 
            "unit": ""
          }, 
          {
            "sortIndex": 40, 
            "code": "maximum_A", 
            "name": "最高电流", 
            "min": 0, 
            "max": 200, 
            "defaultValue": "", 
            "required": false, 
            "precision": 1, 
            "unit": "", 
            "verify": "", 
            "hidden": true, 
            "maxLength": 200, 
            "type": "double", 
            "id": "f858da3273a49935e0de43fd", 
            "minLength": 0
          }, 
          {
            "sortIndex": 30, 
            "code": "available_power_ports", 
            "name": "可用电源接口数", 
            "min": 0, 
            "max": 200, 
            "defaultValue": "", 
            "required": false, 
            "precision": 1, 
            "unit": "", 
            "verify": "", 
            "hidden": true, 
            "maxLength": 200, 
            "type": "int", 
            "id": "c712c506acc402347aa2a216", 
            "minLength": 0
          }, 
          {
            "sortIndex": 20, 
            "code": "Available_unit", 
            "name": "可扩展U数", 
            "min": 0, 
            "max": 200, 
            "defaultValue": "", 
            "required": false, 
            "precision": 1, 
            "unit": "", 
            "verify": "", 
            "hidden": true, 
            "maxLength": 200, 
            "type": "int", 
            "id": "c8b8bfa31ac968752aad6fc6", 
            "minLength": 0
          },
          {
            "sortIndex": 20, 
            "code": "description", 
            "name": "多行文本", 
            "min": 0, 
            "max": 200, 
            "defaultValue": "", 
            "required": false, 
            "precision": 1, 
            "unit": "", 
            "verify": "", 
            "hidden": true, 
            "maxLength": 200, 
            "type": "multiRowText", 
            "id": "c8b8bfa31ac968752aad6faa", 
            "minLength": 0
          },
          {
            "sortIndex": 20, 
            "code": "sex", 
            "name": "单行文本", 
            "min": 0, 
            "max": 200, 
            "defaultValue": "", 
            "required": false, 
            "precision": 1, 
            "unit": "", 
            "verify": "", 
            "hidden": true, 
            "maxLength": 200, 
            "type": "singleSel", 
            "id": "c8b8bfa31ac968752aad6fbb", 
            "minLength": 0
          },
          {
            "sortIndex": 20, 
            "code": "belongReference", 
            "name": "引用", 
            "min": 0, 
            "max": 200, 
            "defaultValue": "", 
            "required": false, 
            "precision": 1, 
            "unit": "", 
            "verify": "", 
            "hidden": true, 
            "maxLength": 200, 
            "type": "belongReference", 
            "id": "c8b8bfa31ac968752aad6fcc", 
            "minLength": 0
          },
          {
            "sortIndex": 20, 
            "code": "listSel", 
            "name": "下拉菜单", 
            "min": 0, 
            "max": 200, 
            "defaultValue": "", 
            "required": false, 
            "precision": 1, 
            "unit": "", 
            "verify": "", 
            "hidden": true, 
            "maxLength": 200, 
            "type": "listSel", 
            "id": "c8b8bfa31ac968752aad6fdd", 
            "minLength": 0
          }
        ],
	     	isShowTable: true,
	     	isDraggable: true,
	     	typeList: [
          {name: '单行文本', type: 'singleRowText'},
          {name: '多行文本',type: 'multiRowText'},
          {name: '整数', type: 'int'},
          {name: '小数', type: 'double'},
          {name: '日期', type: 'dateTime'},
          {name: '下拉菜单', type: 'listSel'},
          {name: '单选', type: 'singleSel'},
          {name: '多选', type: 'multiSel'},
          {name: '从属关系', type: 'belongReference'},
          {name: '连接关系', type: 'linkReference'},
          {name: '属性分组', type: 'group'}
	     	],
        propertyListForm: {},
        propertyListFormRules: {},
        currentPropertyType: '',
        currentPropertyTypeName: '',
        singlePropertyForm: {
        	name: '',
          code: '',
          required: false,
          defaultValue: '',
          unit: '',
          minLength: 0,
          maxLength: 200,
          min: 0,
          max: 200,
          options: [{name: '', code: '', checked: false}],
          verify: '',
          precision: 1,
          refModelCode: '',
          date: ''
        },
        singlePropertyFormRules: {
        	name: [{required: true, message: '请填写属性名称', trigger: 'change'}],
        	code: [{required: true, message: '请填写属性编码', trigger: 'change'}]
        },
        dialogFormVisible: false,
        modelAll: []
	    }
	  },
	  mounted () {
	  	inner.ondragover = (e) => {
        e.preventDefault()
      }
      inner.ondrop = (e) => {
        e.preventDefault()
        this.handleDropToMindElement()
        this.dialogFormVisible = true
      }
	  },
	  methods:{
	  	// 获取属性列表
	  	getPropertyList () {

	  	},
	  	handleClickPropertyManageBtn () {
	  		this.isShowTable = false
	  	},
	  	dragenter (event, index) {
        this.number = index + 1
        const target = event.target
        target.parentNode.parentNode.insertBefore(inner, target.parentNode.nextElementSibling)
      },
      //删除属性
      deletepre (index) {
        //分离删除的属性
        // this.separateDeleteProperty(index)
        //删除数据
        this.propertyList.splice(index, 1)
        //操作codelist
        this.codeList = this.propertyList.map((item) => {
          return item.code
        })
      },
      getTypeInfoByIndex (index) {
      	let obj = {}
      	this.typeList.forEach((item, i) => {
      		if (index === i) {
      			obj = Object.assign({}, item)
      		}
      	})
      	return obj
      },
      dragstart (ev) {
      	let index = Number(ev.target.dataset.typeIndex)
      	if (window.navigator.userAgent.indexOf('Firefox') > -1) {
      		ev.dataTransfer.setData('typeIndex', index)  // 为了兼容火狐浏览器，火狐浏览器上必须携带dataTransfer，拖拽才有效
      	}
      	let currentTypeObj = this.getTypeInfoByIndex(index)
        this.currentPropertyType = currentTypeObj.type
        this.currentPropertyTypeName = currentTypeObj.name
      },
      // 处理被拖拽元素放置到右侧提示元素上时的处理
      handleDropToMindElement () {
      	// 删除拖拽提示元素
        let container = this.$refs.formContainer
        let index // 记录拖拽提示元素的索引
        for (let i = 0; i < container.children.length; i++) {
          if (container.children[i].className === 'inner') {
          	index = i
            container.removeChild(inner)
          }
        }
        // 在属性类表中添加拖拽过来的元素
        let addObj = {
        	"sortIndex": 10, 
          "code": "",
          "name": this.currentPropertyTypeName, 
          "min": 0, 
          "max": 200, 
          "defaultValue": "", 
          "required": false, 
          "precision": 1, 
          "unit": "", 
          "verify": "", 
          "hidden": true, 
          "maxLength": 200, 
          "type": this.currentPropertyType,
          "id": "d5919c028ecd6355a08930fgadg", 
          "minLength": 0
        }
        this.propertyList.splice(index, 0, addObj) // 将拖拽提示元替换
      },
      dragend (ev) {
      	
      },
      // 属性编辑
      handleClickPropertyItem (item, index) {
      	this.currentPropertyType = item.type
      	for (let key in item) { // 给弹出层表单设置默认值
      		if (key in this.singlePropertyForm) {
      			this.singlePropertyForm[key] = item[key]
      		}
      	}
      	this.dialogFormVisible = true
      },
      handleClickConfirmEdit () {
      	this.dialogFormVisible = false
      },
      handleClickCancelEdit () {
      	this.dialogFormVisible = false
      },
      addOption () {
      	this.singlePropertyForm.options.push({name: '', code: '', checked: false})
      },
      deleteOption (index) {
      	this.singlePropertyForm.options.splice(index, 1)
      },
      handleClickSaveAllEdit () {
      	this.isShowTable = true
      },
      handleClickCancelAllEdit () {
      	this.isShowTable = true
      },
      checkboxChange (item, index) {
      	// 设置每次只能选中一个
      	this.singlePropertyForm.options.forEach((option, i) => {
      		if (!(i === index && option.checked)) {
      			option.checked = false
      		}
      	})
      }
	  }
	}
</script>
<style lang="less">
	.item-row {
		.el-form-item {
    	margin-bottom: 0px;
    }
	}
	.inner {
  	height: 50px;
    line-height: 50px;
    border: 1px dashed #ccc;
    text-align: center;
    background: #ecf5ff;
    border-radius: 6px;
  }
</style>

<style lang="less" scoped>
	.container {
		padding: 20px 0;
	}
  .properties-action-btn {
  	text-align: right;
  }
  .properties-table {
  	margin: 20px 0;
  }
  .edit-wrap {
  	height: 100%;
	  .content {
	    width: 100%;
	    height: 100%;
	    display: flex;
	    font-size: 14px;
	    .left {
	      flex: 1;
	      padding: 10px 40px;
	      box-sizing: border-box;
	      .left-item {
	        position: relative;
			    margin-left: 0;
			    margin-right: 0;
			    height: auto;
			    zoom: 1;
			    display: block;
			    padding: 10px 40px 6px 0;
	        .item-row {
	        	position: relative;
		        .item-delete {
		          position: absolute;
		          right: -30px;
		          top: 8px;
		          font-size: 22px;
		          cursor: pointer;
		          z-index: 1001;
		        }
	        }
	        .item-mask {
	          position: absolute;
	          top: 0;
	          right: 0;
	          bottom: 0;
	          left: 0;
	          background: transparent;
	          z-index: 1000;
	          cursor: move;
	        }
	      }
	      .left-action {
	      	text-align: right;
	      }
        .group {
          border-bottom: 1px solid #ccc;
          margin: 8px 0;
          color: #606266;
          height: 42px;
          line-height: 42px;
          font-size: 16px;
        }
	    }
	    .right {
	      width: 300px;
		    box-sizing: border-box;
		    padding-top: 10px;
        height: 100%;
        .right-content {
          position: fixed;
          width: 280px;
          right: 14px;
        }
	      .right-head, .right-tips {
	        width: 100%;
	        padding: 0 15px;
	        box-sizing: border-box;
	        height: 30px;
	        line-height: 30px;
	        margin-bottom: 10px;
	        background-color: #ecf5ff;
			    margin-bottom: 10px;
	      }
	      .right-tips {
	        border: 1px dashed #1681C4
	      }
	      .right-wrap {
	        display: flex;
	        justify-content: space-between;
	        flex-wrap: wrap;
	      }
	      .options {
	        width: 135px;
	        height: 28px;
	        text-align: center;
	        line-height: 28px;
	        background-color: #4082e6;
	        margin-bottom: 5px;
	        color: #fff;
	        cursor: move;
	      }
	    }
	  }
  }
  .options-container {
  	margin-left: 120px;
  	.options-row {
  		position: relative
  	}
  	.options-delete-icon {
  		padding: 10px;
  		font-size: 20px;
  		position: absolute;
  		cursor: pointer;
  	}
  }
  .self-required {
    &:before {
      content: '*';
      color: #f56c6c;
      margin-right: 4px;
    }
  }
</style>