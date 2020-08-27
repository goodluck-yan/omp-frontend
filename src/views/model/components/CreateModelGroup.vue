<!-- 创建和编辑模型分组 -->
<template>
	<el-dialog 
		:title="dialogTitle" 
		:visible.sync="dialogVisible" 
		:close-on-click-modal="false" 
		:show-close="false"
		width="500px">
		<el-form ref="form" :model="form"  :rules="rules" label-width="100px">
	    <el-form-item label="分组名称" prop="name" >
	      <el-input v-model="form.name" placeholder="中文名称"></el-input>
	    </el-form-item>
	    <el-form-item label="分组编码" prop="code">
	      <el-input v-model="form.code" placeholder="英文名称(*只能由数字、字母、下划线组成)"></el-input>
	    </el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
	    <el-button size="small" @click="cancelForm('form')">取 消</el-button>
	    <el-button size="small" type="primary" @click="submitForm('form')" :loading="loading">确 定</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import { modelGroupAction } from '@/api/model.js'
	import { checkCode } from '@/utils/validator.js'
	import { mapType } from '@/utils/config.js'
	import { mapMutations, mapGetters } from 'vuex'

	export default {
		data() {
			const validateCode = (rule,value, callback) => {
        if (!value) {
          callback(new Error('请输入分组编码'))
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
	        name: ''
      	},
      	rules: {
          code: [{ required: true, validator: validateCode, trigger: 'change' }],
      	  name: [{ required: true, message: '请输入分组名称', trigger: 'change' }]
        },
        // props的副本
        dialogStatus: this.dialogVisible,
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
				default: '创建模型分组'
			}
		},
		computed: {
      ...mapGetters([
        'treeList'
      ])
    },
		mounted(){
		},
		methods: {
			// 提交
			submitForm (formName) {
				let self = this;
				self.loading = true;
				self.$refs[formName].validate((valid) => {
	        if (valid) {
	        	let obj = {
	        		method: 'post',
	        		layer_id: mapType(self.$route.params.modelManageType),
        			data: {
        				name: self.form.name,
        				code: self.form.code
        			}
	        	}
	        	modelGroupAction(obj).then(res => {
	        		self.loading = false;
	        		if (res.status === 201) { //创建成功
	        			// 将先创建的分组添加到分组树形结构中
	        			let obj = res.data
	        			obj.moulds = []
	        			self.addGroupToTree(obj)
	        			self.$message({
                  message: '创建成功',
                  type: 'success'
              	})
	        		}
	        		self.dialogStatus = false
		          self.resetForm(formName) // 清空表单域
	        	}, err => {
	        		self.loading = false
	        		console.log('error',err)
	        	})
	        } else {
	          return false
	        }
        })
			},
			// 添加新创建的分组到分组树形结构
			addGroupToTree (obj) {
				this.treeList.push(obj)
			},
			// 取消表单的提交
			cancelForm (formName) {
				this.dialogStatus = false
				this.resetForm(formName)
			},
			// 清空表单域信息
			resetForm(formName) {
	      this.$refs[formName].resetFields()
	    },
	    ...mapMutations({
        'setTreeList': 'SET_TREE_LIST'
      })
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
        	actionKey: 'createModelGroup',
        	visible: val
        })
      }
    }
	}
</script>

<style lang="scss" scoped>
</style>
