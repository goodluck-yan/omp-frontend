<template>
	<div class="page-container">
		<div class="page-title theme-bread-crumb clearfix">
			<div class="bread-crumb  fl">
				<!-- <breadcrumb></breadcrumb> -->
			</div>
		</div>
		<div class="page-main theme-page">
			<el-tabs v-model="activeTabName" @tab-click="toggleTab">
		    <el-tab-pane label="仓库配置" name="repositoryConfig">
		    	<router-view v-if="$route.path.includes('/resource/' + repositoryManageType + '/list')"></router-view>
		    </el-tab-pane>
		    <!-- <el-tab-pane label="仓库总览" name="repositoryOverview">
		    	<router-view v-if="$route.path.includes('/resource/' + repositoryManageType + '/overview')"></router-view>
		    </el-tab-pane> -->
			</el-tabs>
		</div>
	</div>
</template>

<script>
	// 组件
	// import Breadcrumb from '@/views/layout/Breadcrumb.vue'
	import { mapMutations, mapGetters } from 'vuex'

	export default {
		components: {
			// Breadcrumb
		},
		data() {
	    return {
      	activeTabName: 'repositoryConfig',
      	repositoryManageType: ''
	    }
	  },
		computed: {
      ...mapGetters([
        'treeList'
      ])
    },
		mounted() {
			this.repositoryManageType = this.$route.params.repositoryManageType
		},
		methods: {
	    // 切换tab
	    toggleTab (tab) {
	    	if (tab.name === 'repositoryConfig') {
	    		this.$router.push({path: '/resource/' + this.repositoryManageType + '/list'})
	    	} else if (tab.name === 'repositoryOverview') {
	    		this.$router.push({path: '/resource/' + this.repositoryManageType + '/overview'})
	    	}
	    },
	    ...mapMutations({
        'setTreeList': 'SET_TREE_LIST'
      })
		},
		watch: {
	    '$route'(to) {
	    	this.repositoryManageType = this.$route.params.repositoryManageType
	    }
 	  }
	}
</script>
<style lang="scss">
	
</style>

<style lang="scss">
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