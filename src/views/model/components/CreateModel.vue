<!-- 创建和编辑模型 -->
<template>
	<el-dialog 
		:title="dialogTitle" 
		:visible.sync="dialogVisible" 
		:close-on-click-modal="false" 
		:show-close="false"
		width="500px">
		<el-form ref="form" :model="form"  :rules="rules" label-width="100px">
	    <el-form-item label="模型名称" prop="name" >
	      <el-input v-model="form.name" placeholder="中文名称"></el-input>
	    </el-form-item>
	    <el-form-item label="模型编码" prop="code">
	      <el-input v-model="form.code" placeholder="英文名称(*只能由数字、字母、下划线组成)"></el-input>
	    </el-form-item>
	    <el-form-item label="模型分组" prop="model_group_id">
		    <el-select v-model="form.model_group_id" placeholder="请选择模型分组">
	      	<el-option 
	      		v-for="modelGroup in treeList" 
	      		:key="modelGroup.id"
	      		:label="modelGroup.name" 
	      		:value="modelGroup.id">
	      	</el-option>
		    </el-select>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
	    <el-button size="small" @click="cancelForm('form')">取 消</el-button>
	    <el-button size="small" type="primary" @click="submitForm('form')" :loading="loading">确 定</el-button>
		</div>
	</el-dialog>
</template>
<script>
	import { modelGroupAction , modelOfGroupAction } from '@/api/model.js'
	import { checkCode } from '@/utils/validator.js'
	import { mapMutations, mapGetters } from 'vuex'
	import { mapType } from '@/utils/config.js'

	export default {
		data() {
			const validateCode = (rule,value, callback) => {
        if (!value) {
          callback(new Error('请输入模型编码'))
        } else {
          if (!checkCode(value)) {
            callback(new Error('编码只能由数字、字母、下划线组成'))
          } else {
            callback()
          }
        }
		  }
	    return {
	     	form: {
	        code: '',
	        name: '',
	        model_group_id: '',
        },
      	rules: {
          code: [{ required: true, validator: validateCode, trigger: 'change' }],
        	name: [{ required: true, message: '请输入模型名称', trigger: 'change' }],
        	model_group_id: [{ required: true, message: '请选择模型分组', trigger: 'change' }]
        },
        // props的副本
        dialogStatus: this.dialogVisible,
        // 模型分组列表
        modelGroupList: [],
        modelManageType: '',
        loading: false
	    }
		},
		props: {
			dialogVisible: {
				type: Boolean,
				default: false
			},
			dialogTitle: {
				type: String,
				default: '创建模型'
			}
		},
		computed: {
      ...mapGetters([
        'treeList'
      ])
    },
    created () {
	    this.modelManageType = this.$route.params.modelManageType
    },
    mounted () {
	  },
		methods: {
			// 获取分组的索引
			getGroupIndex (groupId) {
				let index
				this.treeList.forEach((item, i) => {
					if (item.id === groupId) {
						index = i
					}
				})
				return index
			},
			// 提交
			submitForm (formName) {
				let self = this;
				self.$refs[formName].validate((valid) => {
	        if (valid) {
	        	let obj = {
	        		method: 'post',
	        		model_group_id: self.form.model_group_id,
	        		layer_id: mapType(self.modelManageType),
    					data: {
    						name: self.form.name,
    						code: self.form.code
    					}
	        	}
	        	self.loading = true
	        	modelOfGroupAction(obj).then(res => {
	        		self.loading = false
	        		if (res.status === 201) {
	        			let backObj = res.data
	        			let modelId = res.data.id
	        			this.autoAddModuleToGroup(backObj) // 添加模块到分组
	        			self.$message({
				          message: '创建成功',
				          type: 'success'
				        });
				        self.dialogStatus = false
				        let groupIndex = this.getGroupIndex(self.form.model_group_id)
				        this.$router.push({path: '/model/' + self.modelManageType + '/group/' + groupIndex + '/' + modelId}) // 自动跳转到该模型
	        		}
	        	}, err => {
	        		console.log('error',err)
	        		self.loading = false
	        		self.dialogStatus = false
	        	})
	        } else {
	          return false
	        }
        })
			},
			// 添加模块到分组
			autoAddModuleToGroup (backObj) {
				this.treeList.forEach(item => {
					if (item.id === backObj.aggregation.id) {
						item.moulds.push({
							id: backObj.id,
							code: backObj.code,
							name: backObj.name,
							created_at: backObj.created_at,
							updated_at: backObj.updated_at
						})
					}
				})
			},
			// 取消表单的提交
			cancelForm (formName) {
				this.dialogStatus = false
				this.resetForm(formName)
			},
			// 清空表单域信息
			resetForm(formName) {
	      this.$refs[formName].resetFields()
	    }
		},
		watch: {
      // 监听props属性
      // 监听外部对props属性dialogVisible的变更，并同步到组件内的data属性dialogStatus副本属性中
      dialogVisible (val) {
        this.dialogStatus = val
        if (val) {
        	this.resetForm('form')
        }
      },
      // 监听副本属性
      // 组件内对dialogStatus变更后向外部发送事件通知
      dialogStatus (val) {
        this.$emit('changeVisible', {
        	actionKey: 'createModel',
        	visible: val
        })
      },
      '$route'(to) {
        this.modelManageType = this.$route.params.modelManageType
      }
    },
	}
</script>

<style lang="scss" scoped>
	.el-select {
	    width: 100%;
	}
</style>
