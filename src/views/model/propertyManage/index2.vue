<template>
  <div style="height: 100%">
  	<div v-if="isShowTable" class="container">
	  	<div class="properties-action-btn">
	  		<el-button type="primary" size="small" @click="handleClickPropertyManageBtn">属性管理</el-button>
	  	</div>
	  	<!--属性列表展示-->
	    <div class="properties-table">
	      <el-table :data="tableList" border style="width: 100%" align="center" size="small">
	        <el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
	        <el-table-column prop="attribute_name" label="属性名称" align="center"></el-table-column>
	        <el-table-column prop="value" label="属性默认值" align="center">
	          <template slot-scope="scope">{{scope.row.value || '无'}}</template>
	        </el-table-column>
	        <el-table-column prop="attribute_code" label="属性编码" align="center"></el-table-column>
	        <el-table-column prop="front_type" label="属性类型" align="center"></el-table-column>
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
              <draggable
                class="list-group" 
                element="ul" 
                v-model="propertyList" 
                :move="onMove" 
                :options="dragOptions1">
                <transition-group type="transition" :name="'flip-list'">
                  <li 
                    class="left-item"
                    v-for="(item,index) in propertyList" 
                    :key="index" 
                    @click="handleClickPropertyItem(item, index, 'edit')"> 
                    <div class="item-mask"></div>
                    <div class="item-row">
                      <!-- 非分组 -->
                      <el-form-item 
                        :label="item.attribute_name + '：'" 
                        :prop="item.attribute_code" 
                        v-show="item.front_type !== 'group'">
                        <el-input 
                          v-model="item.value"
                          v-show="item.front_type === 'singleRowText' || item.front_type === 'int' || item.front_type === 'float' || item.front_type === 'belongReference' || item.front_type === 'linkReference'" :placeholder="item.front_type === 'belongReference' || item.front_type === 'linkReference'? '请选择关联模型' : ''"
                          size="small">
                        </el-input>
                        <!-- 多行文本 -->
                        <el-input
                          v-show="item.front_type === 'multiRowText'"
                          type="textarea" 
                          :rows="2"
                          v-model="item.value">
                        </el-input>
                        <!-- 日期 -->
                        <el-date-picker
                          v-model="item.value"
                          v-show="item.front_type === 'dateTime'"
                          type="date"
                          style="width: 100%"
                          placeholder="选择日期"
                          size="small">
                        </el-date-picker>
                        <!-- 下拉菜单 -->
                        <el-select 
                          v-model="item.value"
                          v-show="item.front_type === 'listSel'"
                          style="width: 100%;"
                          placeholder="请选择"
                          size="small">
                          <el-option 
                            v-for="optionObj in item.options"
                            :key="optionObj.code"
                            :value="optionObj.code"
                            :label="optionObj.name">
                          </el-option>
                        </el-select>
                        <!-- 单选 -->
                        <el-radio-group 
                          v-model="item.value"
                          v-show="item.front_type === 'singleSel'">
                          <el-radio 
                            v-for="optionObj in item.options"
                            :key="optionObj.code"
                            :label="optionObj.code">
                            {{ optionObj.name }}
                          </el-radio>
                        </el-radio-group>
                        <!-- 多选 -->
                        <el-checkbox-group 
                          v-model="item.value"
                          v-show="item.front_type === 'multiSel'">
                          <el-checkbox 
                            v-for="optionObj in item.options" 
                            :label="optionObj.code" 
                            :key="optionObj.code">{{ optionObj.name }}
                          </el-checkbox>
                        </el-checkbox-group>
                      </el-form-item>
                       <!-- 属性分组 -->
                      <div v-show="item.front_type === 'group'" class="group">
                        <span><i class="el-icon-caret-bottom"></i></span>
                        <span>{{ item.attribute_name }}</span>
                      </div>
                      <span  v-bind:class="['item-delete', item.attribute_code === 'group' ? 'item-delete-disabled' : '']" @click.stop="deleteProperty(index)">
                        <i class="fa fa-trash-o"></i>
                      </span>
                    </div>
                  </li> 
                </transition-group>
              </draggable>
          	</div>
          </el-form>
        </div>
        <div class="right">
          <div class="right-content">
            <div class="right-head font">属性类型</div>
            <div class="right-tips font">属性类型可拖动到左侧编辑区哦！</div>
            <div class="right-wrap">
              <draggable 
                element="span" 
                class="right-drag-container" 
                v-model="typeList" 
                :options="dragOptions2" 
                @start="onStart" 
                :move="onMove" 
                @end="onEnd"> 
                <div
                  class="options font"
                  v-for="(item,index) in typeList"
                  :key="item.front_type">
                  <span>{{ item.attribute_name }}</span>
                </div>
              </draggable>
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
        <el-form-item prop="attribute_name" label="属性名称：">
          <el-input v-model="singlePropertyForm.attribute_name"></el-input>
        </el-form-item>
        <!-- 属性编码-->
        <el-form-item class="form-item-code" prop="attribute_code" label="属性编码：">
          <el-input v-model="singlePropertyForm.attribute_code" :disabled="singlePropertyForm.attribute_code === 'group'"></el-input>
        </el-form-item>
        <el-form-item 
        	prop="value" 
        	label="默认值："
          v-show="currentPropertyType === 'singleRowText' || currentPropertyType === 'multiRowText' || currentPropertyType === 'int' || currentPropertyType === 'float'">
          <!-- 多行文本 -->
          <el-input
          	v-if="currentPropertyType === 'multiRowText'"
          	type="textarea" 
          	:rows="2" 
          	v-model="singlePropertyForm.value">
          </el-input>
          <!-- 整数 -->
          <el-input-number v-else-if="currentPropertyType === 'int'" v-model="singlePropertyForm.value"></el-input-number>
          <el-input v-else v-model="singlePropertyForm.value"></el-input>
        </el-form-item>
        <!-- 单位 -->
        <el-form-item
        	prop="unit"
        	label="单位："
        	v-show="currentPropertyType === 'int' || currentPropertyType === 'float'">
          <el-input v-model="singlePropertyForm.unit"></el-input>
        </el-form-item>
        <!-- 是否必填 -->
        <el-form-item
          v-show="currentPropertyType !== 'group'"
        	prop="required"
        	label="必填：">
          <el-checkbox style="margin-right: 40px;" v-model="singlePropertyForm.required"></el-checkbox>
        </el-form-item>
        <!-- 校验规则 -->
        <el-form-item
        	v-show="currentPropertyType === 'singleRowText'"
        	prop="regexp"
        	label="校验规则：">
          <el-select v-model="singlePropertyForm.regexp">
            <el-option label="无校验" value=""></el-option>
            <el-option label="IP" value="ip"></el-option>
            <el-option label="邮箱" value="email"></el-option>
          </el-select>
        </el-form-item>
        <!-- 保留几位小数 -->
        <el-form-item 
        	prop="precision"
        	label="小数位数："
        	v-show="currentPropertyType === 'float'">
          <el-input-number v-model="singlePropertyForm.precision"></el-input-number>
        </el-form-item>
        <!--文本最小长度   最小值-->
        <el-form-item
          v-show="currentPropertyType === 'singleRowText' || currentPropertyType === 'multiRowText' || currentPropertyType === 'int' || currentPropertyType === 'float'"
        	:prop="(currentPropertyType === 'singleRowText' || currentPropertyType === 'multiRowText')? 'min_length' : 'min_value'"
          :label="(currentPropertyType === 'singleRowText' || currentPropertyType === 'multiRowText')? '文本最小长度：' : '最小值：'">
          <el-input-number
          	v-show="currentPropertyType === 'singleRowText' || currentPropertyType === 'multiRowText'"
            v-model="singlePropertyForm.min_length">
           </el-input-number>
          <el-input-number
          	v-show="currentPropertyType === 'int' || currentPropertyType == 'float'" 
          	v-model="singlePropertyForm.min_value">
          </el-input-number>
        </el-form-item>
				<!--文本最大长度  最大值-->
        <el-form-item
        	:prop="(currentPropertyType === 'singleRowText' || currentPropertyType === 'multiRowText')? 'max_length' : 'max_value'"
          v-show="currentPropertyType ==='singleRowText' || currentPropertyType === 'multiRowText' || currentPropertyType === 'int' || currentPropertyType === 'float'"
          :label="(currentPropertyType === 'singleRowText' || currentPropertyType === 'multiRowText') ? '文本最大长度：' : '最大值：'">
          <el-input-number
          	v-show="currentPropertyType ==='singleRowText' || currentPropertyType === 'multiRowText'"
            v-model="singlePropertyForm.max_length">
          </el-input-number>
          <el-input-number
          	v-show="currentPropertyType ==='int' || currentPropertyType === 'float'" 
          	v-model="singlePropertyForm.max_value">
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
              <div class="self-required">*</div>
            </el-col>
					  <el-col :span="2">
              <el-form-item  label-width="1px">
					  		<el-tooltip content="设为默认值" placement="top">
								  <el-checkbox v-model="item.checked" @change="checkboxChange(item, index)" ></el-checkbox>
								</el-tooltip>
					  	</el-form-item>
					  </el-col>
					  <el-col :span="8">
					  	<el-form-item 
                :prop="'options.' + index + '.name'" 
                label-width="1px"
                :rules="[{required: true, message: '请输入选项名称'},{validator: validateOptionName, trigger: 'blur'}]">
			          <el-input size="small" v-model="item.name" placeholder="选项名称"></el-input>
			        </el-form-item>
					  </el-col>
					  <el-col :span="8">
					  	<el-form-item 
                :prop="'options.' + index + '.code'"  
                label-width="1px"
                :rules="{required: true, validator: validateOptionCode, message: '选项编码不能为空', trigger: 'blur'}">
			          <el-input size="small" v-model="item.code" placeholder="选项编码"></el-input>
			        </el-form-item>
					  </el-col>
					  <el-col :span="4">
					  	<span class="options-delete-icon" v-show="singlePropertyForm.options.length > 1" @click="deleteOption(index)">
	          		<i class="fa fa-trash-o" aria-hidden="true"></i>
	          	</span>
					  </el-col>
					</el-row>
        </div>
        <!-- 日期 -->
        <el-form-item
        	v-if="currentPropertyType === 'dateTime'"
        	prop="value"
        	label="默认值：">
         	<el-date-picker
			      v-model="singlePropertyForm.value"
			      v-show="currentPropertyType === 'dateTime'"
			      type="date"
			      style="width: 100%"
			      placeholder="选择默认值">
			    </el-date-picker>
        </el-form-item>
        <!-- 引用对象 -->
        <el-form-item
        	v-if="currentPropertyType === 'belongReference' || currentPropertyType === 'linkReference'"
        	prop="refCode"
        	label="关联模型：">
          <el-select
          	style="width: 100%"
          	v-model="singlePropertyForm.refCode"
          	placeholder="请选择关联模型">
            <el-option
            	v-for="model in allModuleList"
            	:key="model.code"
            	:label="model.name"
            	:value="model.code">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClickCancelEdit">取 消</el-button>
        <el-button type="primary" size="small" @click="handleClickConfirmEdit('singlePropertyForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'
  import { deepClone } from '@/utils/index.js'
  import { checkCode } from '@/utils/validator.js'
  import { modelAction, getAllModels } from '@/api/model.js'
  import { mapMutations, mapGetters } from 'vuex'
	export default {
    components: {
      draggable
    },
	  data () {
      //属性code验证规则
      let validateCode = (rule, value, callback) => {
        const reg = /^[a-zA-Z]+[a-zA-Z0-9_]*$/
        if (!value) {
          return callback(new Error('属性编码不能为空'));
        }
        // 编辑操作时可以不修改编码，校验通过
        if (this.operateFlag === 'edit' && this.editCode === value) {
          callback()
        }
        if (!checkCode(value)) {
          return callback(new Error('只包含数字、字母、下划线，不能以数字或下划线开头'))
        }
        this.getCodeList()
        if (this.codeList.includes(value)) {
          return callback(new Error('属性编码重复'))
        } else {
          return callback()
        }
      }

      //属性name验证规则
      let validateName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('属性编码不能为空'));
        }
        // 编辑操作时可以不修改编码，校验通过
        if (this.operateFlag === 'edit' && this.editName === value) {
          callback()
        }
        this.getNameList()
        if (this.nameList.includes(value)) {
          return callback(new Error('属性名称重复'))
        } else {
          return callback()
        }
      }
	    return {
        isDragging: false,
        tableList: [], // 不包含分组的属性列表
	     	propertyList: [],
	     	isShowTable: true,
	     	isDraggable: true,
        // 静态的属性类型类表，避免拖拽之后，被克隆的元素被修改，typeList同时也会被修改
        constTypeList: [
          {
            attribute_name: "单行文本", 
            front_type: 'singleRowText',
            attribute_code: "",
            max_value: 200, 
            min_value: 0, 
            min_length: 0, 
            value: "", 
            required: false, 
            precision: 1, 
            regexp: "",  
            max_length: 200, 
            unit: "",
            options: [{name: '', code: '', checked: false}],
            refCode: '',
          },
          {
            attribute_name: "多行文本", 
            front_type: 'multiRowText',
            attribute_code: "",
            max_value: 200, 
            min_value: 0, 
            min_length: 0, 
            value: "", 
            required: false, 
            precision: 1, 
            regexp: "",  
            max_length: 200, 
            unit: "",
            options: [{name: '', code: '', checked: false}],
            refCode: ''
          },
          {
            attribute_name: "整数", 
            front_type: 'int',
            attribute_code: "",
            max_value: 200, 
            min_value: 0, 
            min_length: 0, 
            value: "", 
            required: false, 
            precision: 1, 
            regexp: "",  
            max_length: 200, 
            unit: "",
            options: [{name: '', code: '', checked: false}],
            refCode: ''
          },
          {
            attribute_name: "小数", 
            front_type: 'float',
            attribute_code: "",
            max_value: 200, 
            min_value: 0, 
            min_length: 0, 
            value: "", 
            required: false, 
            precision: 1, 
            regexp: "",  
            max_length: 200, 
            unit: "",
            options: [{name: '', code: '', checked: false}],
            refCode: ''
          },
          {
            attribute_name: "日期", 
            front_type: 'dateTime',
            attribute_code: "",
            max_value: 200, 
            min_value: 0, 
            min_length: 0, 
            value: "", 
            required: false, 
            precision: 1, 
            regexp: "",  
            max_length: 200, 
            unit: "",
            options: [{name: '', code: '', checked: false}],
            refCode: ''
          },
          {
            attribute_name: "下拉菜单", 
            front_type: 'listSel',
            attribute_code: "",
            max_value: 200, 
            min_value: 0, 
            min_length: 0, 
            value: "", 
            required: false, 
            precision: 1, 
            regexp: "",  
            max_length: 200, 
            unit: "",
            options: [{name: '', code: '', checked: false}],
            refCode: ''
          },
          { 
            attribute_name: "单选",
            front_type: 'singleSel',
            attribute_code: "",
            max_value: 200, 
            min_value: 0, 
            min_length: 0, 
            value: "", 
            required: false, 
            precision: 1, 
            regexp: "",  
            max_length: 200, 
            unit: "",
            options: [{name: '', code: '', checked: false}],
            refCode: ''
          },
          {
            attribute_name: "多选",
            front_type: 'multiSel',
            attribute_code: "",
            max_value: 200, 
            min_value: 0, 
            min_length: 0, 
            value: "", 
            required: false, 
            precision: 1, 
            regexp: "",  
            max_length: 200, 
            unit: "",
            options: [{name: '', code: '', checked: false}],
            refCode: ''
          },
          {
            attribute_name: "从属关系",
            front_type: 'belongReference',
            attribute_code: "",
            max_value: 200, 
            min_value: 0, 
            min_length: 0, 
            value: "", 
            required: false, 
            precision: 1, 
            regexp: "",  
            max_length: 200, 
            unit: "",
            options: [{name: '', code: '', checked: false}],
            refCode: ''
          },
          {
            attribute_name: "连接关系",
            front_type: 'linkReference',
            attribute_code: "",
            max_value: 200, 
            min_value: 0, 
            min_length: 0, 
            value: "", 
            required: false, 
            precision: 1, 
            regexp: "",  
            max_length: 200, 
            unit: "",
            options: [{name: '', code: '', checked: false}],
            refCode: ''
          },
          {
            attribute_name: "属性分组",
            front_type: 'group',
            attribute_code: "",
            max_value: 200, 
            min_value: 0, 
            min_length: 0, 
            value: "", 
            required: false, 
            precision: 1, 
            regexp: "",  
            max_length: 200, 
            unit: "",
            options: [{name: '', code: '', checked: false}],
            refCode: ''
          }
        ],
        // propertyList 和 typeList的数据结构必须一致，才能拖拽添加成功
	     	typeList: [
          {
            attribute_name: "单行文本", 
            front_type: 'singleRowText',
            attribute_code: "",
            max_value: 200, 
            min_value: 0, 
            min_length: 0, 
            value: "", 
            required: false, 
            precision: 1, 
            regexp: "",  
            max_length: 200, 
            unit: "",
            options: [{name: '', code: '', checked: false}],
            refCode: ''
          },
          {
            attribute_name: "多行文本", 
            front_type: 'multiRowText',
            attribute_code: "",
            max_value: 200, 
            min_value: 0, 
            min_length: 0, 
            value: "", 
            required: false, 
            precision: 1, 
            regexp: "",  
            max_length: 200, 
            unit: "",
            options: [{name: '', code: '', checked: false}],
            refCode: ''
          },
          {
            attribute_name: "整数", 
            front_type: 'int',
            attribute_code: "",
            max_value: 200, 
            min_value: 0, 
            min_length: 0, 
            value: "", 
            required: false, 
            precision: 1, 
            regexp: "",  
            max_length: 200, 
            unit: "",
            options: [{name: '', code: '', checked: false}],
            refCode: ''
          },
          {
            attribute_name: "小数", 
            front_type: 'float',
            attribute_code: "",
            max_value: 200, 
            min_value: 0, 
            min_length: 0, 
            value: "", 
            required: false, 
            precision: 1, 
            regexp: "",  
            max_length: 200, 
            unit: "",
            options: [{name: '', code: '', checked: false}],
            refCode: ''
          },
          {
            attribute_name: "日期", 
            front_type: 'dateTime',
            attribute_code: "",
            max_value: 200, 
            min_value: 0, 
            min_length: 0, 
            value: "", 
            required: false, 
            precision: 1, 
            regexp: "",  
            max_length: 200, 
            unit: "",
            options: [{name: '', code: '', checked: false}],
            refCode: ''
          },
          {
            attribute_name: "下拉菜单", 
            front_type: 'listSel',
            attribute_code: "",
            max_value: 200, 
            min_value: 0, 
            min_length: 0, 
            value: "", 
            required: false, 
            precision: 1, 
            regexp: "",  
            max_length: 200, 
            unit: "",
            options: [{name: '', code: '', checked: false}],
            refCode: ''
          },
          { 
            attribute_name: "单选",
            front_type: 'singleSel',
            attribute_code: "",
            max_value: 200, 
            min_value: 0, 
            min_length: 0, 
            value: "", 
            required: false, 
            precision: 1, 
            regexp: "",  
            max_length: 200, 
            unit: "",
            options: [{name: '', code: '', checked: false}],
            refCode: ''
          },
          {
            attribute_name: "多选",
            front_type: 'multiSel',
            attribute_code: "",
            max_value: 200, 
            min_value: 0, 
            min_length: 0, 
            value: "", 
            required: false, 
            precision: 1, 
            regexp: "",  
            max_length: 200, 
            unit: "",
            options: [{name: '', code: '', checked: false}],
            refCode: ''
          },
          {
            attribute_name: "从属关系",
            front_type: 'belongReference',
            attribute_code: "",
            max_value: 200, 
            min_value: 0, 
            min_length: 0, 
            value: "", 
            required: false, 
            precision: 1, 
            regexp: "",  
            max_length: 200, 
            unit: "",
            options: [{name: '', code: '', checked: false}],
            refCode: ''
          },
          {
            attribute_name: "连接关系",
            front_type: 'linkReference',
            attribute_code: "",
            max_value: 200, 
            min_value: 0, 
            min_length: 0, 
            value: "", 
            required: false, 
            precision: 1, 
            regexp: "",  
            max_length: 200, 
            unit: "",
            options: [{name: '', code: '', checked: false}],
            refCode: ''
          },
          {
            attribute_name: "属性分组",
            front_type: 'group',
            attribute_code: "",
            max_value: 200, 
            min_value: 0, 
            min_length: 0, 
            value: "", 
            required: false, 
            precision: 1, 
            regexp: "",  
            max_length: 200, 
            unit: "",
            options: [{name: '', code: '', checked: false}],
            refCode: ''
          }
	     	],
        propertyListForm: {},
        propertyListFormRules: {},
        currentPropertyType: '',
        currentPropertyTypeName: '',
        singlePropertyForm: {
        	attribute_name: '',
          attribute_code: '',
          front_type: '',
          required: false,
          value: '',
          unit: '',
          min_length: 0,
          max_length: 200,
          min_value: 0,
          max_value: 200,
          options: [{name: '', code: '', checked: false}],
          refCode: '',
          regexp: '',
          precision: 1
        },
        singlePropertyFormRules: {
        	attribute_name: [
           {validator: validateName, trigger: 'blur'},
           {required: true, message: '请输入属性名称'}
          ],
        	attribute_code: [
           {validator: validateCode, trigger: 'blur'},
           {required: true, message: '请输入属性编码'}
          ]
        },
        dialogFormVisible: false,
        currentDragTypeObj: {}, //当前被拖动的属性类型
        newIndex: 0,
        oldIndex: 0,
        editIndex: 0,
        codeList: [],
        nameList: [],
        operateFlag: '', //操作： 编辑 创建
        editCode: '',
        editName: '',
        allModuleList: []
	    }
	  },
    computed: {
      dragOptions1 () {
        return  {
          animation: 100,
          draggable: '.left-item',
          group: {
            name: 'advanced',
            pull: true,
            put: true
          }
        }
      },
      dragOptions2 () {
        return  {
          animation: 100,
          group: {
            name: 'advanced',
            pull: 'clone',
            put: false
          },
          sort: false,
          ghostClass: 'ghost'
        };
      },
      ...mapGetters([
        'treeList'
      ])
    },
    mounted () {
      // this.getAllModuleList()
      this.getPropertyList()
    },
	  methods:{
      // 获取所有模型
      // getAllModuleList () {
      //   let self = this
      //   self.treeList.forEach(item => {
      //     if (item.moulds && item.moulds.length > 0) {
      //       item.moulds.forEach(child => {
      //         self.allModuleList.push(child)
      //       })
      //     }
      //   })
      // },

      validateOptionCode (rule, value, callback) {
        if (!value) {
          return callback(new Error('选项编码不能为空'));
        }
        let optionCodeList = this.singlePropertyForm.options.map(item => {
          return item.code
        })
        let num = 0
        optionCodeList.forEach(item => {
          if (item === value) {
            num++
          }
        })
        if (num > 1) {
          return callback(new Error('选项编码不能为空重复'))
        } else {
          return callback()
        }
      },

      validateOptionName (rule, value, callback) {
        if (!value) {
          return callback(new Error('选项名称不能为空'));
        }
        let optionNameList = this.singlePropertyForm.options.map(item => {
          return item.name
        })
        let num = 0
        optionNameList.forEach(item => {
          if (item === value) {
            num++
          }
        })
        if (num > 1) {
          return callback(new Error('选项名称不能重复'))
        } else {
          return callback()
        }
      },

	  	// 获取属性列表
	  	getPropertyList () {
        let obj = {
          method: 'get',
          modelId: this.$route.params.modelId
        }
        modelAction(obj).then(res => {
          if (res.status === 200) {
            let list = res.data.matrix
            if (list.length === 0) {
              list = this.doDefaultList()
            }
            this.propertyList = this.splitGroupToProperty(list)
            this.tableList = this.getTableData(this.propertyList)
          }
        }, err => {
          console.log('error', err)
        })
	  	},
      // 排除分组属性
      getTableData (list) {
        let arr =[]
        let newList = list.concat()
        newList.forEach(item => {
          if (item.front_type !== 'group') {
            arr.push(item)
          }
        })
        return arr
      },
      // 构造默认分组和默认属性
      doDefaultList () {
        let list = [
          {
            matrix_code : 'group',
            matrix_name: '基本属性',
            attributes: [
              {
                attribute_name: "名称",
                attribute_code: "name",
                front_type: 'singleRowText',
                max_value: 200, 
                min_value: 0, 
                min_length: 0, 
                value: "", 
                required: true, 
                precision: 1, 
                regexp: "",  
                max_length: 200, 
                unit: "",
                options: [{name: '', code: '', checked: false}],
                refCode: ''
              }
            ]
          }
        ]
        return list
      },
      // 将group拆分为一个属性
      splitGroupToProperty (list) {
        let arr = list.concat()
        let propertList = []
        arr.forEach(item => { // 分组
          if (item.matrix_code) {
            let groupObj = {
              attribute_name: item.matrix_name,
              front_type: 'group',
              attribute_code: item.matrix_code,
              value: item.matrix_name,
              max_value: 200,
              min_value: 0,
              min_length: 0,
              max_length: 200,
              required: false,
              precision: 1, 
              regexp: '',  
              unit: '',
              options: [{name: '', code: '', checked: false}],
              refCode: ''
            }
            propertList.push(groupObj)
            if (item.attributes && item.attributes.length > 0) {
              item.attributes.forEach(attributeObj => {
                propertList.push(attributeObj)
              })
            }
          }
        })
        return propertList
      },
      getCodeList () {
        this.codeList = this.propertyList.map((item) => {
          return item.attribute_code
        })
      },
      getNameList () {
        this.nameList = this.propertyList.map((item) => {
          return item.attribute_name
        })
      },
      // 点击属性管理按钮
	  	handleClickPropertyManageBtn () {
	  		this.isShowTable = false
	  	},
      //删除属性
      deleteProperty (index) {
        if (this.propertyList[index].attribute_code === 'group') {
          this.$message({
            message: '该属性不能删除',
            type: 'warning'
          })
          return
        }
        this.propertyList.splice(index, 1)
      },
      // 获取被拖拽属性类型的信息
      getDragTypeInfoByIndex (index) {
      	let obj = {}
      	this.typeList.forEach((item, i) => {
      		if (index === i) {
      			obj = Object.assign({}, item)
      		}
      	})
      	return obj
      },
      // 拖拽开始
      onStart (ev) {
        this.operateFlag = 'create' // 设置当前操作是创建属性
      	let index = Number(ev.oldIndex) // 当前拖动的属性类型的索引
      	if (window.navigator.userAgent.indexOf('Firefox') > -1) {
      		ev.dataTransfer.setData('typeIndex', index)  // 为了兼容火狐浏览器，火狐浏览器上必须携带dataTransfer，拖拽才有效
      	}
      	this.currentDragTypeObj = this.getDragTypeInfoByIndex(index)
        this.currentPropertyType = this.currentDragTypeObj.type
        this.currentPropertyTypeName = this.currentDragTypeObj.name
      },
      // 清空表单
      resetEditForm () {
        for (let key in this.singlePropertyForm) {
          this.singlePropertyForm[key] = ''
        }
      },
      // 属性编辑 给弹出层表单设置默认值
      handleClickPropertyItem (item, index, operateFlag) {
        this.operateFlag = operateFlag
        this.editCode = item.attribute_code // 用于code去重
        this.editName = item.attribute_name // 用于name去重
        this.resetEditForm() // 清空表单域
      	this.currentPropertyType = item.front_type
        this.singlePropertyForm = deepClone(item)
        this.editIndex = index // 保存当前点击的mask的索引
      	this.dialogFormVisible = true
        if (this.currentPropertyType === 'belongReference' || this.currentPropertyType === 'linkReference') {
          this._getAllModels()
        }
      },
      // 获取所有模型
      _getAllModels () {
        getAllModels().then(res => {
          if (res.status === 200) {
            this.allModuleList = res.data
          }
        },err => {
          console.log('error', err)
        })
      },
      // 处理单选、多选、下拉列表的默认选项
      handleOptionList () {
        this.propertyList.forEach(item => {
          if (item.front_type === 'listSel' || item.front_type === 'singleSel' || item.front_type === 'multiSel') {
            let value = ''
            item.options.forEach(optionItem => {
              if (optionItem.checked) {
                value = optionItem.code
              }
            })
            item.value = value
          }
        })
      },
      // 处理确定编辑
      handleClickConfirmEdit (formName) {
        let self = this
        self.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(self.newIndex)
            // 手动修改propertyList中元素的属性值
            let obj = deepClone(self.singlePropertyForm)
            self.propertyList.splice(self.editIndex, 1, obj) // 替换
            self.typeList = deepClone(self.constTypeList) // 手动恢复属性类型列表
            this.handleOptionList() // 处理单选、多选、下拉列表默认值
            self.dialogFormVisible = false
          } else {
            return false
          }
        })
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
      // 转转换提交的结构
      transformPropertyList () {
        let newPropertyList = []
        let groupIndexList = [];
        // 找到group属性所在的索引
        this.propertyList.forEach((item, index) => {
          if (item.front_type === 'group') {
            groupIndexList.push(index)
          }
        })
        if (groupIndexList.length === 1) {
          let groupObj = {
            matrix_name: this.propertyList[0].attribute_name,
            matrix_code: this.propertyList[0].attribute_code,
            attributes: []
          }
          for(let i = 1; i < this.propertyList.length; i++) {
            let propertyObj = this.propertyList[i]
            if (propertyObj.front_type !== 'group') {
              groupObj.attributes.push(propertyObj)
            }
          }
          newPropertyList.push(groupObj)
        } else {
          // 构造分组
          for(let i = 0; i < groupIndexList.length; i++) {
            let groupIndex = groupIndexList[i]
            let groupObj = {
              matrix_name: this.propertyList[groupIndex].attribute_name,
              matrix_code: this.propertyList[groupIndex].attribute_code,
              attributes: []
            }
            newPropertyList.push(groupObj)
          }
          // 构造分组中的属性
          for(let i = 0; i < groupIndexList.length; i++) {
            let groupIndex =  groupIndexList[i] + 1
            let nextGroupIndex = groupIndexList[i+1] ? groupIndexList[i+1] : this.propertyList.length
            for(let j = groupIndex; j < nextGroupIndex; j++) {
              let propertyObj = this.propertyList[j]
              newPropertyList[i].attributes.push(propertyObj)
            }
          }
        }
        return newPropertyList
      },
      // 校验提交的数据
      validateSubmit () {
        for(let i = 0; i < this.propertyList.length; i++) {
          let propertyObj = this.propertyList[i]
          if (!propertyObj.attribute_name) {
            this.handleClickPropertyItem(propertyObj, i, 'edit')
            return false
          }
          if (!propertyObj.attribute_code) {
            this.handleClickPropertyItem(propertyObj, i, 'edit')
            return false
          }
        }
        return true
      },
      // 校验未分组属性
      validateUngroupedProperty (list) {
        let distList = this.splitGroupToProperty(list) 
        if (this.propertyList.length !== distList.length) {
          this.$message({
            type: 'warning',
            message: '存在未分组属性，请拖动属性进行分组'
          })
          return false
        }
        return true
      },
      // 保存所有属性编辑
      handleClickSaveAllEdit () {
        let newPropertyList = this.transformPropertyList()
        if (this.validateSubmit() && this.validateUngroupedProperty(newPropertyList)) {
          let obj = {
            method: 'put',
            modelId: this.$route.params.modelId,
            data: {
              matrix: newPropertyList
            }
          }
          modelAction(obj).then(res => {
            if (res.status === 200) {
              this.isShowTable = true
              this.getPropertyList() // 重新拉取属性列表
              this.$message({
                message: '编辑成功',
                type: 'success'
              });
            }
          },err => {
            consoleg.log('error', err)
          })
        } else {
          return
        }
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
      },
      onMove ({relatedContext, draggedContext}) {

      },
      // 拖拽结束
      onEnd (evt) {
        if (evt.newIndex !== evt.oldIndex) {// 确保是属性类型列表向属性列表拖拽，阻止属性类型列表在自身区域drop
          this.newIndex = evt.newIndex //保存被拖拽元素在propertyList中的位置
          this.oldIndex = evt.oldIndex // 保存被拖拽元素的索引
          this.handleClickPropertyItem(this.currentDragTypeObj, this.newIndex, 'create') // 给属性编辑弹出赋初始值
          this.dialogFormVisible = true
        }
      }
	  },
    watch: {
      '$route' (to, from) {
        this.getPropertyList()
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
  .ghost {
    height: 50px;
    line-height: 50px;
    border: 1px dashed #ccc;
    text-align: center;
    background: #ecf5ff;
    border-radius: 6px;
  }
  .flip-list-move {
    transition: transform 0.5s;
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
            .item-delete-disabled {
              cursor: not-allowed;
              color: #ccc;
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
          .right-drag-container {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
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
    color: #f56c6c;
    margin-right: 4px;
    height: 40px;
    line-height: 40px;
    font-weight: 700;
  }
</style>
