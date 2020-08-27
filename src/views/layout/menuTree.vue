<template>
  <div>
    <div v-for="item in list">
      <el-submenu v-if="item.children && item.children.length>0" :index="item.id.toString()">
        <template slot="title"> {{item.permission_name}} </template>
        <menu-tree :list="item.children" ></menu-tree>
      </el-submenu>
      <el-menu-item v-else  :index="item.id.toString()" :route="item.route_uri"> {{item.permission_name}}  </el-menu-item>
    </div>
  </div>
</template>

<script>
  export default {
    name: "menu-tree",
    props: ['list', 'path'],
    data() {
      return {
        // headUrl: '/main/',
        // strUrl: '',
      }
    },
    created() {
    //用于拼接url
      // if (this.path) {
      //   this.strUrl += this.path + '/';
      // }
    },
  }
</script>


