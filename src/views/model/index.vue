<template>
	<div class="page-container">
		<div class="page-title theme-bread-crumb clearfix">
			<div class="bread-crumb  fl">

			</div>
			<div class="page-title-btn fl">
				<el-button type="text" @click="actionBtn(currentAction.module, item.key)" v-for="item in currentAction.action" :key="item.key">
					<span><i :class="item.icon" aria-hidden="true"></i></span>
					<span>{{ item.name }}</span>
				</el-button>
			</div>
		</div>
		<div class="page-main theme-page">
			<el-tabs v-model="activeTabName" @tab-click="toggleTab">
			    <el-tab-pane label="分组管理" name="modelManagement">
			    	<!-- 这里需要加上判断，避免同时有三个router-view，接口会被调用多次的问题 -->
			    	<router-view v-if="$route.path.includes('/model/' + modelManageType + '/group')"></router-view>

			    </el-tab-pane>
				
			   <!--  <el-tab-pane label="模型模板" name="modelTemplate">
			    	<router-view v-if="$route.path.includes('/model/' + modelManageType + '/template')"></router-view>
			    </el-tab-pane> -->
			    <el-tab-pane label="模型关系" name="modelRelationship">
			    	<router-view v-if="$route.path.includes('/model/' + modelManageType + '/relation')"></router-view>
			    </el-tab-pane>


			</el-tabs>
		</div>
		<!-- 模型操作 -->
		<create-model
			:dialogVisible="createModelDialogVisible" 
			@changeVisible="changeVisible">
		</create-model>

		<!-- 模型分组操作 -->
		<create-model-group 
			:dialogVisible="createModelGroupDialogVisible" 
			@changeVisible="changeVisible">
		</create-model-group>

		<!-- 编辑模型 -->
		<edit-model
			v-if="modelInfo.code"
			:dialogVisible="editModelDialogVisible"
			:modelInfo="modelInfo"
			@changeVisible="changeVisible">
		</edit-model>
	</div>
</template>

<script>
	// 组件
	// import Breadcrumb from '@/views/layout/Breadcrumb.vue'
	import CreateModelGroup from './components/CreateModelGroup.vue'
	import CreateModel from './components/CreateModel.vue'
	import EditModel from './components/EditModel.vue'

	import { modelAction } from '@/api/model.js'
	import { mapMutations, mapGetters } from 'vuex'

	export default {
		components: {
			// Breadcrumb,
			CreateModelGroup,
			CreateModel,
			EditModel
		},
		data() {
	    return {
      	createModelGroupDialogVisible: false,
      	createModelDialogVisible: false,
      	editModelDialogVisible: false,
      	activeTabName: 'modelManagement',
      	currentAction: {},
      	actionList: [
      		{
      			module: 'modelManagement',
      			action: [
      				{
      					key: 'createModelGroup',
      					name: '新建模型分组',
      					icon: 'fa fa-plus'
      				},
      				{
      					key: 'createModel',
      					name: '新建模型',
      					icon: 'fa fa-plus'
      				}
      			]
      		},
      		{
      			module: 'modelTemplate',
      			action: [
      				{
      					key: 'addModelTemplate',
      					name: '添加模板',
      					icon: 'fa fa-plus'
      				}
      			]
      		},
      		{
      			module: 'modelRelationship',
      			action: [
      				{
      					key: 'addModelRelationship',
      					name: '添加关系',
      					icon: 'fa fa-plus'
      				}
      			]
      		}
      	],
      	modelInfo: {},
      	modelManageType: ''
	    }
	  },
		computed: {
      ...mapGetters([
        'treeList'
      ])
    },
    created () {
			this.modelManageType = this.$route.params.modelManageType;
    },
		mounted() {
			this.setActiveTabName()
			this.getAction(this.activeTabName)
		},
		methods: {
			// 设置默认激活的tab
			setActiveTabName () {
				if (this.modelManageType) {
	    		if (this.$route.path.includes('relation')) {
	    			this.activeTabName = 'modelRelationship'
	    		} else if (this.$route.path.includes('group')) {
	    			this.activeTabName = 'modelManagement'
	    		}
	    	}
			},
			// 获取操作权限
			getAction (name) {
				if (this.$route.params.groupIndex && this.$route.params.modelId) { // 点击了模型，添加模型的操作
					this.actionList[0].action = [
						{
    					key: 'createModel',
    					name: '新建模型',
    					icon: 'fa fa-plus'
    				},
    				{
    					key: 'editModel',
    					name: '编辑模型',
    					icon: 'fa fa-pencil-square-o'
    				},
    				{
    					key: 'deleteModel',
    					name: '删除模型',
    					icon: 'fa fa-trash'
    				}
					];
				} else { // 关闭了分组 删除模型的操作
					this.actionList[0].action = [
						{
    					key: 'createModelGroup',
    					name: '新建模型分组',
    					icon: 'fa fa-plus'
    				},
    				{
    					key: 'createModel',
    					name: '新建模型',
    					icon: 'fa fa-plus'
    				}
					];
				}
				let arr = this.actionList.filter(item => {
					return item.module === name
				})
				this.currentAction = arr[0]
			},
			// 删除模型的对话框
			deleteModelDialog () {
				this.$confirm('此操作将永久删除该模型, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        	let groupIndex = this.$route.params.groupIndex
        	let modelId = this.$route.params.modelId
        	let obj = {
						method: 'delete',
						modelId: modelId,
						data: {}
					}
        	modelAction(obj).then(res => {
        		if (res.status === 204) {
        			this.deleteModelFromTree(groupIndex, modelId)
        			this.$router.push({path: '/model/' + this.$route.params.modelManageType})
		          this.$message({
		            type: 'success',
		            message: '删除成功!'
		          })
        		}
        	})
        }).catch(() => {
        })
			},
			// 获取分组的id
			getGroupIdByIndex (groupIndex) {
				let obj = this.treeList[groupIndex]
				return obj.id
			},
			// 获取模型信息
			getModelInfoById () {
				let modelId = this.$route.params.modelId
				let groupIndex = Number(this.$route.params.groupIndex)
				this.modelInfo = {} // 每次清空值
				let obj = {
					method: 'get',
					modelId: modelId,
					data: {}
				}
				modelAction(obj).then(res => {
					if (res.status === 200) {
						this.modelInfo = res.data
						this.modelInfo.model_group_id = this.getGroupIdByIndex(groupIndex)
						this.editModelDialogVisible = true
					}
				}, err => {
					console.log('error', err)
				})
			},
			actionBtn (actionModule, actionKey) {
				if (actionKey === 'deleteModel') {
					this.deleteModelDialog()
				} else if (actionKey === 'editModel') {
					this.getModelInfoById()
				} else {
					this[actionKey + 'DialogVisible'] = true
				}
			},
			// 手动删除模型
			deleteModelFromTree (groupIndex, modelId) {
				let index = ''
				this.treeList.forEach((group, i) => {
					if (group.moulds && group.moulds.length > 0) {
						group.moulds.forEach((child, j) => {
							if (child.id === modelId) {
								index = j
							}
						})
					}
				})
				this.treeList[groupIndex].moulds.splice(index, 1)
			},
	    // 同步dialogVisible的状态
	    changeVisible (obj) {
	    	this[obj.actionKey + 'DialogVisible'] = obj.visible
	    },
	    // 切换tab
	    toggleTab (tab) {
	    	// 获取操作权限
	    	this.getAction(tab.name)
	    	if (tab.name === 'modelManagement') {
	    		this.$router.push({path: '/model/'+ this.modelManageType +'/group'})
	    	} else if (tab.name === 'modelTemplate') {
	    		this.$router.push({path: '/model/' + this.modelManageType  + '/template'})
	    	} else if (tab.name === 'modelRelationship') {
	    		this.$router.push({path: '/model/' + this.modelManageType + '/relation'})
	    	}
	    },
	    ...mapMutations({
        'setTreeList': 'SET_TREE_LIST'
      })
		},
		watch: {
	    '$route'(to) {
	    	this.modelManageType = this.$route.params.modelManageType
			console.log(this.modelManageType)
			this.setActiveTabName()
	      this.getAction(this.activeTabName)
	    }
 	  }
	}
</script>
<style lang="scss">
	
</style>

<style lang="scss">
	// @import "src/styles/mixin.scss";
	
	.page-title-btn {
		line-height: 50px;
		margin-left: 50px;
		font-size: 16px;
		.el-button {
			font-size: 16px;
			margin-right: 30px;
		}
	}
	.page-main {
		margin-right: 15px;
		.el-tabs {
			height: 100%;
		}
		.el-tabs__content {
		  height: calc(100% - 25px);
		}
		.el-tab-pane {
			height: 100%;
		}
		.el-tabs__header {
		  margin: 0;
		}
	}
	
</style>