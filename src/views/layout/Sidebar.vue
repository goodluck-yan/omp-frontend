<template>
  <scroll-bar>
    <div class="sidebar theme-sidebar">
 
      <el-menu 
        :default-active="leftActiveIndex"
        class="el-menu-vertical-demo" 
        @open="handleOpen" 
        @close="handleClose" 
        @select="handleSelect"

        :router="true"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="rgb(245, 165, 20)"
        :collapse-transition="false">
        <menu-tree :list="menuList"></menu-tree>
      </el-menu>
    </div>
  </scroll-bar>
</template>

<script>
  import ScrollBar from '@/components/ScrollBar'
  import MenuTree from './menuTree.vue'
  import {mapMutations,mapGetters} from 'vuex'

  export default {
    name: 'Sidebar',
    components: { 
      ScrollBar,
      MenuTree
    },
    computed: {
      ...mapGetters([
        'isCollapse',
        'menuList',
        'leftActiveIndex'
      ])
    },
    data() {
      return {
      }
    },
    created() {
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      handleSelect(key, keyPath) {
        // console.log(key, keyPath);
        console.log(111111,this.menuList,this.topActiveIndex)
      }
    },
  }
</script>

<style type="text/css" lang="less" scoped>
  .sidebar /deep/ .el-menu {
      border-right: 0 none;
    }
  // .sidebar /deep/ .el-menu-item-group {
  //     .el-menu-item-group__title {
  //       font-size: 14px;
  //       white-space: nowrap;
  //       padding: 0 0 0 20px !important;
  //       height: 56px;
  //       line-height: 56px;
  //     }
  //     ul {
  //       margin-left: 30px;
  //     }
  //   }


	// 强制设置菜单选中时的背景色
	.sidebar /deep/ .el-menu-item.is-active {
		background-color: rgb(67, 74, 80)!important;
	}

  //设置菜单的字体和行高
  .sidebar /deep/ .el-menu-item,.sidebar /deep/ .el-submenu__title {
		// font-size: 15px!important;
		height: 40px;
    line-height: 40px;
    box-shadow: rgba(84, 92, 100, 1) -1px -1px 0px 0px inset, rgba(0, 0, 0, 0.3) -2px -2px 0px 0px inset,rgba(84, 92, 100, 1) -3px -3px 0px 0px inset;
  }
  
  .sidebar /deep/ .el-submenu__title i {
      color: #fff;
  }


  .title-icon {
    margin-right: 5px;
    font-size: 18px;
    vertical-align: middle;
    width: 24px;
    text-align: center;
  }

</style>

