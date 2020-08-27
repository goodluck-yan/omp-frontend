<template>
  <div class="container-warp">
		<div class="content"  v-loading="loading">
	  	<div class="header">
	  		<div class="search-warp">
	  			<el-input size="small" v-model="searchForm.name" placeholder="请输入实体名称"></el-input>
	  		</div>
	  		<el-button 
	        type="primary"
	        size="small"
	        @click="addInstance">
	        数据录入
	      </el-button>
	  	</div>
	  	<div class="table-wrap">
	  		<el-table 
	        :data="instanceList" 
	        border 
	        style="width: 100%" 
	        align="center" 
	        size="small"
	        :fit="true">
	        <el-table-column v-if="basePropertyList.length > 0" type="index" label="序号" align="center"></el-table-column>
	        <el-table-column 
	        	v-for="column in basePropertyList" :key="column.attribute_code" 
	        	:prop="column.attribute_code" 
	        	:label="column.attribute_name" 
	        	align="center"
	        	show-overflow-tooltip>
	        </el-table-column>
	        <el-table-column
		        prop="action"
		        label="操作"
		        align="center"
		        width="160px"
            v-if="instanceList.length > 0">
			      <template slot-scope="scope">
			        <el-button type="text" size="small" @click="handleEditInstance(scope.row)">编辑</el-button>
			        <el-button type="text" size="small" @click="handleDeleteIntance(scope.row)">删除</el-button>
			      </template>
		      </el-table-column>
	      </el-table>
	  	</div>
	  	<div class="pagination-wrapper">
	      <el-pagination
	        layout="total, sizes, prev, pager, next, jumper"
	        :total="pageTotle"
	        :page-size="pageSize"
	        :current-page.sync="currentPage"
	        @size-change="handlesSizeChange"
	        @current-change="handleCurrentPageChange"
	        @prev-click="handlePrevPageChange"
	        @next-click="handleNextPageChange">
	      </el-pagination>
	    </div>
		</div>
		<!-- 添加实体的弹出层 -->
    <my-dialog
      :visible.sync="dialogVisible"
      :title="dialogTitle">
      <div slot="content" class="instance-form theme-instance-form">
        <el-form
          :model="form"
          :rules="rules"
          ref="form" 
          label-width="120px" 
          class="demo-form">
          <el-row type="flex" class="row-bg" justify="center">
            <el-col :span="16">
            	<el-collapse v-model="activeNames" @change="changeCollapse">
							  <el-collapse-item 
							  	v-for="property in propertyList" 
							  	:key="property.matrix_code"
							  	:title="property.matrix_name"
							  	:name="property.matrix_code">
							    <div 
							    	v-for="item in property.attributes"
							    	:key="item.attribute_code"
							    	class="item-row">
                    <el-form-item 
                      :label="item.attribute_name + '：'" 
                      :prop="item.attribute_code">
                      <!-- 单行文本 -->
                      <el-input 
                        v-model.trim="form[item.attribute_code]"
                        v-if="item.front_type === 'singleRowText'"
                        type="text"
                        :minlength="item.min_length"
                        :maxlength="item.max_length"
                        size="small">
                      </el-input>
                      <!-- 多行文本 -->
                      <el-input
                      	v-model.trim="form[item.attribute_code]"
                        v-if="item.front_type === 'multiRowText'"
                        type="textarea" 
                        :rows="2"
                        size="small">
                      </el-input>
                      <!-- 整数 -->
          						<el-input-number
          							v-model.trim="form[item.attribute_code]"
          							v-if="item.front_type === 'int'"
          							:min="item.min_value"
                        :max="item.max_value"
                        size="small">
                        <template v-if="item.unit" slot="append">{{ item.unit }}</template>
          						</el-input-number>
          						<!-- 小数 -->
          						<el-input-number
          							v-model.trim="form[item.attribute_code]"
          							v-if="item.front_type === 'float'"
          							:precision="item.precision"
          							:step="0.1"
          							:max="item.max_value"
          							:min="item.min_value"
          							size="small">
          							<template v-if="item.unit" slot="append">{{ item.unit }}</template>
          						</el-input-number>
                      <!-- 日期 -->
                      <el-date-picker
                        v-model="form[item.attribute_code]"
                        v-if="item.front_type === 'dateTime'"
                        type="date"
                        style="width: 100%"
                        placeholder="选择日期"
                        clearable
                        size="small">
                      </el-date-picker>
                      <!-- 下拉菜单 -->
                      <el-select 
                        v-model="form[item.attribute_code]"
                        v-if="item.front_type === 'listSel'"
                        style="width: 100%;"
                        placeholder="请选择"
                        clearable
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
                        v-model="form[item.attribute_code]"
                        v-if="item.front_type === 'singleSel'">
                        <el-radio 
                          v-for="optionObj in item.options"
                          :key="optionObj.code"
                          :label="optionObj.code">
                          {{ optionObj.name }}
                        </el-radio>
                      </el-radio-group>
                      <!-- 多选 -->
                      <el-checkbox-group 
                        v-model="form[item.attribute_code]"
                        v-if="item.front_type === 'multiSel'">
                        <el-checkbox 
                          v-for="optionObj in item.options" 
                          :label="optionObj.code" 
                          :key="optionObj.code">{{ optionObj.name }}
                        </el-checkbox>
                      </el-checkbox-group>
                      <!-- 关联模型 -->
                      <el-select
                      	v-if="item.front_type === 'belongReference' || item.front_type === 'linkReference'"
						            style="width: 100%"
						            filterable
						            clearable
						            v-model="form[item.attribute_code]"
						            size="small"
                        @change="handleChangeRef">
						            <el-option
						              v-for="resInstance in refInstanceInfo[item.attribute_code]"
						              :key="resInstance.id"
						              :label="resInstance.name"
						              :value="resInstance.id">
						            </el-option>
						          </el-select>
                    </el-form-item>
							    </div>
							  </el-collapse-item>
						  </el-collapse>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="small" plain @click="cancelAddInstance">取 消</el-button>
        <el-button size="small" type="primary" @click="saveInstance('form')" :loading="confirmLoading">确 定</el-button>
      </div>
    </my-dialog>
    <!-- 删除实体对话框 -->
    <el-dialog
		  title="删除确认"
		  :visible.sync="deleteDialogVisible"
		  width="30%">
		  <span>确认删除实体吗？</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button size="small" @click="deleteDialogVisible = false">取 消</el-button>
		    <el-button size="small" type="primary" @click="handleDeleteIntanceConfirm" :loading="deleteLoading">确 定</el-button>
		  </span>
		</el-dialog>
  </div>
</template>

<script>
	import { instancesAction, singleInstanceAction } from '@/api/repository.js'
	import { modelAction, getAllModels } from '@/api/model.js'
	import { formateTime } from '@/utils/date.js'
	import MyDialog from '@/components/MyDialog'
	import { mapMutations, mapGetters } from 'vuex'
	export default {
		components: {
      MyDialog
    },
	  data () {
	    return {
	      instanceList: [],
	      propertyList: [],
	      basePropertyList: [],
	      refInstanceInfo: {},
	      refInstanceList: [],
	      activeNames: [],
	      loading: false,
	      dialogVisible: false,
	      searchForm: {
	       name: ''
	      },
	      form: {},
	      rules: {},
	      confirmLoading: false,
	      currentPage: 1,
	      pageTotle: 0,
	      pageSize: 10,
	      deleteDialogVisible: false,
	      currentInstanceInfo: {},
	      dialogTitle: '',
	      currentAction: '',
	      currentInstanceInfo: {},
	      deleteLoading: false,
        parent_id: ''
	    }
	  },
	  computed: {
      ...mapGetters([
        'treeList'
      ])
    },
	  mounted () {
	  	this.getPropertyList()
	  },
	  methods:{
	  	getInstanceList () {
	  		let params = {}
	      params.page = this.currentPage
	      params.per_page = this.pageSize
	  		let obj = {
	  			method: 'get',
	  			modelId: this.$route.params.modelId,
	  			params: params
	  		}
	  		instancesAction(obj).then(res => {
	  			this.loading = false
	  			if (res.status === 200) {
	  				let list = res.data
	  				this.instanceList = this.doInstanceList(list)
	  			}
	  		}, err => {
	  			this.loading = false
	  			console.log('error', err)
	  		})
	  	},
	  	// 构造实例列表
	  	doInstanceList (list) {
	  		let self = this
	  		let instanceList = []
	  		list.forEach(item => {
	  			let obj = {}
	  			obj.created_at = item.created_at
	  			obj.updated_at = item.updated_at
	  			obj.id = item.id
	  			obj.matrix = item.matrix
	  			let propertyObj = self.doTableData(item.matrix, item.parent)
	  			obj = Object.assign({}, obj, propertyObj)
	  			instanceList.push(obj)
	  		})
	  		return instanceList
	  	},
	  	// 将属性列表转换位键值对
	  	doTableData (matrixList, parentObj) {
	  		let obj = {}
	  		let basePropertyList = this.excludeGroup(matrixList)
	  		basePropertyList.forEach(item => {
	  			if (item.front_type === 'dateTime') {
	  				obj[item.attribute_code] = formateTime(item.attribute_value) // 保存过滤值
	  				obj['filter_'+ item.attribute_code] = item.attribute_value // 保存原始值
	  			} else if (item.front_type === 'singleSel' || item.front_type === 'multiSel' || item.front_type === 'listSel') {
	  				let filterValue = ''
	  				item.options.forEach(option => {
	  					if (option.code === item.attribute_value) {
	  						filterValue = option.name
	  					}
	  				})
	  				obj[item.attribute_code] = filterValue // 保存过滤值
	  				obj['filter_'+ item.attribute_code] = item.attribute_value // 保存原始值
	  			} else if (parentObj && item.front_type === 'belongReference') { // 暂时考虑从属引用
            obj[item.attribute_code] = parentObj.matrix[0].attributes[0].attribute_value
          } else {
	  				obj[item.attribute_code] = item.attribute_value
	  			}
	  		})
	  		return obj
	  	},
	  	getActiveNames (propertyList) {
	  		propertyList.forEach(item => {
	  			this.activeNames.push(item.matrix_code)
	  		})
	  	},
	  	// 获取属性列表
	  	getPropertyList () {
        let obj = {
          method: 'get',
          modelId: this.$route.params.modelId
        }
        this.loading = true
        modelAction(obj).then(res => {
          if (res.status === 200) {
            let list = res.data.matrix
            this.propertyList = list
            this.doTableColumns(list) // 设置columns
            this.getInstanceList() // 获取实体列表
          }
        }, err => {
          console.log('error', err)
        })
      },
      // 从属性中排除分组属性
      excludeGroup (list) {
      	let arr = []
      	list.forEach(group => {
      		if (group.attributes && group.attributes.length > 0) {
      			group.attributes.forEach(attribute => {
      				arr.push(attribute)
      			})
      		}
      	})
      	return arr
      },
      // 除去分组之后的所有属性
      doTableColumns (list) {
      	this.basePropertyList = this.excludeGroup(list) 
      },
      addInstance () {
      	this.form = {} // 清空form
      	this.currentAction = 'create' // 保存当前操作是创建还是编辑
      	this.dialogTitle = '添加实体'
      	let propertyList = this.propertyList
      	let basePropertyList = this.basePropertyList
      	this.getActiveNames(propertyList) // 设置折叠面板的打开项
      	this.doForm(basePropertyList, this.currentAction) // 设置form默认值
      	this.dialogVisible = true
      },
      cancelAddInstance () {
      	this.dialogVisible = false
      },
      saveInstance (formName) {
      	this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.currentAction === 'create') {
            	this.postCreateInstance(this.form)
            } else if (this.currentAction === 'edit') {
            	this.updateSingleInstance(this.form)
            }
          } else {
            return false
          }
        })
      },
      // 创建实体
      postCreateInstance (form) {
      	let obj = {
      		method: 'post',
          modelId: this.$route.params.modelId,
          data: {
            parent_id: this.parent_id,
          	abilities: form
          }
      	}
      	this.confirmLoading = true
      	instancesAction(obj).then(res => {
      		this.dialogVisible = false
      		this.confirmLoading = false
      		if (res.status === 201) {
      			this.getInstanceList() // 重新获取实例列表
      			this.$message({
      				type: 'success',
      				message: '实体创建成功'
      			})
      		}
      	}, err => {
      		this.confirmLoading = false
      		console.log('error', err)
      	})
      },
      // 获取关联模型的modelId
      getModelIdByRefCode (refCode) {
      	let refModelId = ''
      	this.treeList.forEach(item => {
      		if(item.moulds && item.moulds.length > 0) {
      			item.moulds.forEach(model => {
      				if (model.code === refCode) {
      					refModelId = model.id
      				}
      			})
      		}
      	})
      	return refModelId
      },
      
      // 构造form的属性
      doForm (basePropertyList, flag) {
      	basePropertyList.forEach(item => {
      		if (flag === 'create') {
      			if (item.front_type === 'belongReference' || item.front_type === 'linkReference') {
      				this.$set(this.form, item.attribute_code, '')
      			} else {
      				this.$set(this.form, item.attribute_code, item.value)
      			}
      		} else if (flag === 'edit') {
      			this.$set(this.form, item.attribute_code, item.attribute_value)
      		}
      		// 添加验证规则
          if (item.required || item.regexp) {
            let rules = []
            if (item.required) {
              let rule = { required: true, message: `请输入${item.attribute_name}`, trigger: 'blur' }
              switch (item.font_type) {
                case 'dateTime':
                  rule.type = 'date'
                  break
                case 'int':
                case 'double':
                  rule.type = 'number'
                  break
                default:
              }
              if (item.front_type === 'singleSel' || item.front_type === 'multiSel' || item.listSel) {
              	rule.trigger = 'change'
              }
              rules.push(rule)
            }
            if (item.regexp) {
              let rule = {message: `请输入正确的 ${item.regexp} 格式`, trigger: 'blur'}
              switch (item.regexp) {
                case 'ip':
                  rule.pattern = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
                  break
                case 'email':
                  rule.type = 'email'
                  break
                default:
              }
              if (item.front_type === 'singleSel' || item.front_type === 'multiSel' || item.listSel) {
              	rule.trigger = 'change'
              }
              rules.push(rule)
            }
            this.$set(this.rules, item.attribute_code, rules)
          }
      	})
      	let haveRefList = basePropertyList.filter(item => {
      		return item.front_type === 'belongReference' || item.front_type === 'linkReference'
      	})
      	if (haveRefList.length > 0) {
	      	// 获取引用实体列表
	      	this.getRefInstanceList(basePropertyList, flag)
      	}
      },
      // 获取引用实体列表
      getRefInstanceList (basePropertyList, flag) {
      	let self = this;
      	self.refInstanceInfo = {};
      	(function iterator(i) {
          if (i === basePropertyList.length ) {
            return
          }
          let basePropertyObj = basePropertyList[i]
          if (basePropertyObj.front_type === 'belongReference' || basePropertyObj.front_type === 'linkReference') {
          	let refCode = basePropertyObj.value // value中存储的是属性的默认值
          	let modelId = self.getModelIdByRefCode(refCode)
		      	let obj = {
			  			method: 'get',
			  			modelId: modelId
			  		}
		        instancesAction(obj).then(res => {
		          if (res.status === 200) {
		          	let list = res.data
		          	let instanceList = self.doInstanceList(list)
		          	// attribute_code 作为引用列表的索引，便于表单上进行匹配是谁的引用列表
		          	let autoAttrCode = basePropertyObj.attribute_code
		          	self.$set(self.refInstanceInfo, autoAttrCode, instanceList)
		          	iterator(i+1)
		          }
		        },err => {
		          console.log('error', err)
		        })
          } else {
          	iterator(i+1)
          }
        })(0)
      },
      changeCollapse (activeNames) {
      	let self = this
      },
      // 分页相关方法
      handlesSizeChange () {

      },
      handleCurrentPageChange () {

      },
      handlePrevPageChange () {

      },
      handleNextPageChange () {

      },
      // 编辑实体
      handleEditInstance (row) {
      	this.form = {}
      	this.currentInstanceInfo = row // 保存当前编辑的实体信息
      	this.dialogTitle = '编辑实体'
      	this.currentAction = 'edit' // 保存当前操作是创建还是编辑
      	this.dialogVisible = true
      	let obj = {
      		method: 'get',
      		instance_id: row.id
      	}
      	singleInstanceAction(obj).then(res => {
      		if (res.status === 200) {
	      		let propertyList = res.data.matrix
	      		let basePropertyList = this.excludeGroup(propertyList)
	      		this.getActiveNames(propertyList) // 设置折叠面板的打开项
	      		this.doForm(basePropertyList, this.currentAction) // form设置默认值
      		}
      	}, err => {
      		console.log('error', err)
      	})
      },

      // 更新实体
      updateSingleInstance (form) {
      	let obj = {
      		method: 'put',
      		instance_id: this.currentInstanceInfo.id,
      		data: {
            parent_id: this.parent_id,
      			abilities: form
      		}
      	}
      	this.confirmLoading = true
      	singleInstanceAction(obj).then(res => {
      		this.dialogVisible = false
      		this.confirmLoading = false
      		if (res.status === 200) {
      			this.getInstanceList() // 重新获取实例列表
      			this.$message({
      				message: '修改成功',
      				type: 'success'
      			})
      		}
      	},err => {
      		this.confirmLoading = false
      		console.log('error', err)
      	})
      },
      // 删除实体
      handleDeleteIntance (row) {
      	this.deleteDialogVisible = true
      	this.currentInstanceInfo = row
      },
      // 确认删除实体
      handleDeleteIntanceConfirm () {
      	let obj = {
      		method: 'delete',
      		instance_id: this.currentInstanceInfo.id
      	}
      	this.deleteLoading = true
      	singleInstanceAction(obj).then(res => {
      		this.deleteDialogVisible = false
      		this.deleteLoading = false
      		if (res.status === 204) {
      			this.getInstanceList() // 重新获取实体列表
      			this.$message({
      				type: 'success',
      				message: '删除成功'
      			})
      		}
      	},err => {
      		this.deleteDialogVisible = false
      		this.deleteLoading = false
      		console.log('error', err)
      	})
      },
      // 保存选中的父引用
      handleChangeRef (value) {
        this.parent_id = value
      }
	  },
	  watch: {
      '$route' (to, from) {
        this.dialogVisible = false
        this.form = {}
        this.getPropertyList()
      }
    }
	}
</script>
<style lang="less">
	.container-warp {
		.instance-form {
			.el-collapse-item__header {
				font-size: 16px;
				padding-left: 20px;
				// background: #ecf5ff;
				height: 40px;
				line-height: 40px;
				border-bottom: 0 none;
				.el-collapse-item__arrow {
					line-height: 40px;
				}
			}
			.el-collapse-item__wrap {
				margin-top: 10px;
			}
			.el-collapse-item {
				margin-bottom: 10px;
			}
			.el-collapse-item__wrap {
				border-bottom: 0 none;
			}
			.el-collapse {
		    border-top: 0 none;
		    border-bottom: 0 none;
			}
    }
	}
</style>

<style scoped lang="less">
	.container-warp {
		width: 100%;
    position: relative;
    .content {
    	padding: 20px 0;
	    .header {
	    	display: flex;
	    	justify-content: space-between;
	    	margin-bottom: 20px;
	    }
	    .pagination-wrapper {
	    	text-align: right;
	    	margin-top: 20px;
	    }
    }
  }
</style>