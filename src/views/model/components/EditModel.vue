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
		    <el-select 
		    	v-model="form.model_group_id"
		    	placeholder="请选择模型分组">
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
	import { modelGroupAction , modelOfGroupAction, modelAction } from '@/api/model.js'
	import { checkCode } from '@/utils/validator.js'
	import { mapMutations, mapGetters } from 'vuex'

	export default {
		name: 'EditModel',
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
	        code: this.modelInfo.code,
	        name: this.modelInfo.name,
	        model_group_id: this.modelInfo.model_group_id
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
        loading: false,
        sourceModelId: '',
        sourceGroupIndex: '',
        targetGroupIndex: '',
        moveModel: {},
        moveModelIndex: ''
	    }
		},
		props: {
			dialogVisible: {
				type: Boolean,
				default: false
			},
			dialogTitle: {
				type: String,
				default: '编辑模型'
			},
			modelInfo: {
				type: Object,
				default: {}
			}
		},
		computed: {
      ...mapGetters([
        'treeList'
      ])
    },
		created () {
		},
		mounted () {
			this.sourceModelId = this.$route.params.modelId
			this.sourceGroupIndex = this.$route.params.groupIndex
		},
		methods: {
			// 根据分组的id获取分组的索引
			getGroupIndexById (id) {
				let i;
				this.treeList.forEach((item, index) => {
					if (item.id === id) {
						i = index
					}
				})
				return i
			},
			// 重组分组结构 - 移动模型到目标分组
			reorganizeTreeList () {
				let self = this;
				if(self.sourceGroupIndex !== self.targetGroupIndex) { // 移动
					self.treeList[self.sourceGroupIndex].moulds.splice(self.moveModelIndex, 1) // 从源分组上移除
					self.treeList[self.targetGroupIndex].moulds.push(self.moveModel) // 添加到目标分组
				}
			},
			updataModel (obj) {
				let self = this
				self.treeList.forEach(item => {
					if (item.moulds && item.moulds.length > 0) {
						item.moulds.forEach((child, index) => {
							if(child.id === self.sourceModelId) {
								self.moveModelIndex = index
								child.code = obj.code
								child.name = obj.name
								child.created_at = obj.created_at
								child.updated_at = obj.updated_at
								child.id = obj.id
								self.moveModel = Object.assign({}, child) // 保存要移动的model
							}
						})
					}
				})
			},
			// 提交
			submitForm (formName) {
				let self = this;
				self.$refs[formName].validate((valid) => {
	        if (valid) {
	        	let obj = {
	        		method: 'put',
	        		modelId: this.modelInfo.id,
    					data: {
    						name: self.form.name,
    						code: self.form.code,
    						aggregation_id: self.form.model_group_id
    					}
	        	}
	        	self.loading = true
	        	modelAction(obj).then(res => {
	        		self.loading = false
	        		if (res.status === 200) {
	        			let obj = res.data
	        			let modelId = obj.id
	        			let groupID = obj.aggregation.id
				        self.dialogStatus = false
				        self.targetGroupIndex = self.getGroupIndexById(groupID)
				        self.updataModel(obj) // 手动更新treeList
	        			self.$message({
				          message: '修改成功',
				          type: 'success'
				        })
				        this.$router.push({path: '/model/' + self.$route.params.modelManageType + '/group/' + self.targetGroupIndex + '/' + modelId}) // 自动跳转到该模型
				        self.reorganizeTreeList() // 路由跳转之后重组treeList
	        		}
	        	}, err => {
	        		console.log('error',err)
	        		self.dialogStatus = false
	        		self.loading = false
	        	})
	        } else {
	          return false
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
      },
      // 监听副本属性
      // 组件内对dialogStatus变更后向外部发送事件通知
      dialogStatus (val) {
        this.$emit('changeVisible', {
        	actionKey: 'editModel',
        	visible: val
        })
      }
    }
	}
</script>

<style lang="scss" scoped>
	.el-select {
	    width: 100%;
	}
</style>
