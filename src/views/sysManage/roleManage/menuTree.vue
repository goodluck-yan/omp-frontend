<template>
  <div>
    <div class="tree-content">
    <el-tree
        :data="treeData"
        :default-checked-keys="rolePermissionIDList"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="tree"
        highlight-current
        :props="defaultProps"
        @check-change="checkChange">
    </el-tree>
    </div>
    <div class="tree-button">
      <h3>
        增加的权限
      </h3>
      
      <el-input
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4}"
        :readonly="true"
        v-model="add_permission.value_list.join('\n')">
      </el-input>
      <br/>
      <br/>
      <h3>
        删除的权限
      </h3>
      
      <el-input
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4}"
        :readonly="true"
        v-model="del_permission.value_list.join('\n')">
      </el-input>
      <br/>
      <br/>
      <el-button type="primary" @click="confPermission" >保存</el-button>

    </div>
  </div>
</template>

<script>
import {edit_role_permission} from '@/api/sysManage/roleManage.js'
export default {
  name: 'menuTree',
  props: ['treeData','rolePermissionIDList','roleId'],
  watch: {
    // rolePermissionIDList: function(newVal,oldVal) {//监听不同角色权限之间的切换
    //   this.NewRolePermissionIDList=newVal;//修改后的权限id列表
    //   this.confPermission();
    // }    
    // drawer1: function(newVal,oldVal) {//监听不同角色权限之间的切换
      // this.add_permission=[]//增加的权限
      // this.del_permission=[]//删除的权限
      // console.log(newVal,oldVal)
    // },
  },
  data() {
    return {
      defaultProps: {//定义树组件所需字段与提供的数据绑定关系
        children: 'children',
        label: 'permission_name',
      },
      NewRolePermissionIDList: this.rolePermissionIDList,//接收从父组件传递过来的角色权限id列表
      add_permission: {id_list:[],value_list:[]},//增加的权限
      del_permission: {id_list:[],value_list:[]},//删除的权限

    }
  },
  computed: {
    // 'add_permission': function() {
    //   let rolePermissionIDList=this.rolePermissionIDList
    //   return this.NewRolePermissionIDList.filter(function(v){ return rolePermissionIDList.indexOf(v) == -1 })
    // },
    // 'del_permission': function() {
    //   let NewRolePermissionIDList=this.NewRolePermissionIDList
    //   return this.rolePermissionIDList.filter(function(v){ return NewRolePermissionIDList.indexOf(v) == -1 })
    // },
  },

  created() {
    // console.log('我创建好了')
  },
  mounted() {
    // console.log('我的标签挂载上去了')
    // this.NewRolePermissionIDList=this.rolePermissionIDList
    // this.confPermission()
    // this.$refs.tree.setCheckedKeys(this.NewRolePermissionIDList);
  },
  beforeUpdate() {
    // console.log('我准备跟新了',this.drawer1)

  },

  methods: {
    //角色授权按钮保存方法
    confPermission() {

      let res_data = {
        role_id:this.roleId,
        add_permission_id_list:this.add_permission.id_list,
        del_permission_id_list:this.del_permission.id_list,
      }

      if (this.add_permission.id_list.length>0 || this.del_permission.id_list.length>0) {
        this.$confirm('确认修改角色权限吗？', '提示', {type: 'warning'}).then(() => {
          edit_role_permission(res_data).then(res => {

            this.$message({
              message: '保存成功',
              type: 'success'
            });

            this.add_permission={id_list:[],value_list:[]};
            this.del_permission={id_list:[],value_list:[]};
            this.NewRolePermissionIDList=this.$refs.tree.getCheckedKeys();
          });
        }).catch(()=>{

        });
      }else {
        this.$alert('不存在需要添加或删除的权限', '提示', {})
      }



      console.log(this.$refs.tree.getCheckedKeys());
      // console.log(this.NewRolePermissionIDList);

      // this.$refs.tree.setCheckedKeys(this.NewRolePermissionIDList);

      this.NewRolePermissionIDList=this.$refs.tree.getCheckedKeys()
      console.log(this.add_permission,this.del_permission)
      
    },
    // 节点选中状态发生变化(节点数据对象，是否选中，是否包含子节点)
    checkChange(data,status,ifchild){
      console.log(data['id'],status,ifchild)
      console.log(this.NewRolePermissionIDList)


      if(data['type'] == 3 && status && this.NewRolePermissionIDList.indexOf(data['id']) == -1 ){//当权限被选中，且不在已分配的权限中时
        if(this.add_permission.id_list.indexOf(data['id']) == -1){
          this.add_permission.id_list.push(data['id'])
          this.add_permission.value_list.push(data['permission_name'])
        }
        
        console.log(this.add_permission)
      }else if(data['type'] == 3 && !status && this.NewRolePermissionIDList.indexOf(data['id']) == -1){//当权限被取消选中，且不在已分配的权限中时
        let index = this.add_permission.id_list.indexOf(data['id'])
        if(index > -1){//从待添加权限中，删除已分配的权限
          this.add_permission.id_list.splice(index,1)
          this.add_permission.value_list.splice(index,1)
        }
      }else if(data['type'] == 3 && !status && this.NewRolePermissionIDList.indexOf(data['id']) > -1 ){//当权限被取消选中，且在已分配的权限中时
        if(this.del_permission.id_list.indexOf(data['id']) == -1){
          this.del_permission.id_list.push(data['id'])
          this.del_permission.value_list.push(data['permission_name'])
        }
        console.log( this.del_permission)
      }else if(data['type'] == 3 && status && this.NewRolePermissionIDList.indexOf(data['id']) > -1 ){//当权限被选中，且在已分配的权限中时
        let index = this.del_permission.id_list.indexOf(data['id'])
        if(index > -1){//从待删除权限中，删除已分配的权限
          this.del_permission.id_list.splice(index,1)
          this.del_permission.value_list.splice(index,1)
        }
      }
    }
  },



}
</script>

<style lang="scss" scoped>
.tree-content{
  display: inline-block;
  overflow-y: auto;
  max-height: 400px;
  .el-tree.el-tree--highlight-current{
    width: 400px;
  }
}

.tree-button{
  display: inline-block;
  vertical-align: top; 
}
</style>