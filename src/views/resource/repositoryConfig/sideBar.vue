<template>
  <div >
    <el-menu
      class="el-menu-vertical-demo"
      :default-active="$route.path"
      :router='true'
      @open="handleOpen"
      @close="handleOpen"
      v-if="repositoryManageType">
      <el-submenu  
        v-for="(item, index) in treeList" 
        :key="item.id" 
        :index="item.id">
        <template slot="title">
          <span class="sidebar-title" :title="item.name">{{ item.name }}</span>
        </template>
        <template 
          v-for="child in item.moulds" 
          v-if="item.moulds && item.moulds.length > 0">
          <el-menu-item
            :index="'/resource/' + repositoryManageType + '/list/' + index + '/' + child.id"
            :key="child.id">
            {{ child.name }}
          </el-menu-item>
        </template>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
  import { modelGroupAction } from '@/api/model.js'
  import { mapMutations, mapGetters } from 'vuex'
  import { mapType } from '@/utils/config.js'

	export default {
    name: 'repositoryMenus',
	  data () {
	    return {
        repositoryManageType: ''
	    }
	  },
    computed: {
      ...mapGetters([
        'treeList'
      ])
    },
	  mounted () {
      this.repositoryManageType = this.$route.params.repositoryManageType
	    this.getTree()
	  },
	  methods:{
	    // 获取模型分组列表
      getTree () {
        let self = this
        let obj = {
          method: 'get',
          layer_id: mapType(self.repositoryManageType)
        }
        modelGroupAction(obj).then(res => {
          if (res.status === 200) {
            let list = res.data
            this.setTreeList(list) // 保存到vuex
          }
        }, err => {
          console.log('error',err)
        })
      },
      handleOpen (key, keyPat) {
      },
      ...mapMutations({
        'setTreeList': 'SET_TREE_LIST'
      })
	  },
    watch: {
      '$route'(to) {
        this.repositoryManageType = this.$route.params.repositoryManageType
        this.getTree()
      }
    }
	}
</script>

<style lang="less" scoped>
	.public-sidebar {
		.el-menu {
		  border-right: 0 none;
		}
	}
  .group-icon {
    position: absolute;
    display: none;
    right: 46px;
    top: 0px;
  }
  .el-submenu__title {
    &:hover {
      .group-icon {
        display: block;
      }
    } 
  }
  .group-from {
    margin-top: 50px;
    transform: translateY(50%)
  }
  .sidebar-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
    width: 80px;
  }
</style>
