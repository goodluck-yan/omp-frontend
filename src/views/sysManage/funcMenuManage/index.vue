<template>
  <div class="func-main">
    <div class="tree-main">
      <div class="tree-head">
        功能菜单结构树
      </div>
      <div class="tree-content">
        <el-input
          placeholder="输入关键字进行过滤"
          v-model="filterText">
        </el-input>
        <el-tree
            class="filter-tree"
            :data="allTreeData"
            node-key="id"
            default-expand-all
            :filter-node-method="filterNode"
            ref="tree"
            highlight-current
            :expand-on-click-node="false"
            :props="defaultProps"
            @node-click="nodeClick">
            <span  class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }}--[{{ data.id }}]</span>
              <el-tag v-if="data.type == 0" type="info" size="mini">
                根
              </el-tag>
              <el-tag v-if="data.type == 1" size="mini">
                模块
              </el-tag>
              <el-tag v-if="data.type == 2" type="success" size="mini">
                菜单
              </el-tag>
              <el-tag v-else-if="data.type == 3" type="warning" size="mini">
                权限
              </el-tag>
            </span>
        </el-tree>
      </div>
    </div>
    <div v-show="treeManageShow" class="tree-manage">
      <div class="menu-head">
          <span>菜单基本信息</span>
          <el-button type="danger" @click="delFuncMenu(treeInfo)"  :disabled="treeInfo.id === 0 " size="small" plain>删除</el-button>
          <el-button type="primary" @click="editFuncMenu" :disabled="treeInfo.id === 0 " size="small">修改</el-button>
      </div>
        
      <el-form :inline="true" :model="treeInfo" class="menu-info"  :rules="formRules" label-width="100px" label-position="right">
        <el-form-item label="ID">
          <el-input v-model="treeInfo.id"  :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-input v-model="treeInfo.create_time"  :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="修改时间">
          <el-input v-model="treeInfo.modify_time"  :disabled="true"></el-input>
        </el-form-item>
        <br/>
        <el-form-item label="功能名称">
          <el-input v-model="treeInfo.permission_name" :disabled="treeInfo.id === 0 "></el-input>
        </el-form-item>
        <el-form-item label="父节点ID">
          <el-input v-model="treeInfo.father_id" :disabled="treeInfo.id === 0 "></el-input>
        </el-form-item>
        <el-form-item label="排序值">
          <el-input v-model="treeInfo.order_num" :disabled="treeInfo.id === 0 "></el-input>
        </el-form-item>
        <br/>
        <el-form-item label="类型">
          <el-select v-model="treeInfo.type" :disabled="treeInfo.id === 0 ">
            <el-option label="模块" value="1"></el-option>
            <el-option label="菜单" value="2"></el-option>
            <el-option label="权限" value="3"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="页面路由uri">
          <el-input v-model="treeInfo.route_uri" :disabled="treeInfo.id === 0 " style="width: 470px"></el-input>
        </el-form-item>
        <br/>
        <el-form-item label="接口请求uri">
          <el-input type="textarea" v-model="treeInfo.action_uri" :disabled="treeInfo.id === 0 " style="width: 785px"></el-input>
        </el-form-item>


      </el-form>

      
      <div v-show="['0','1','2'].indexOf(treeInfo.type) != -1" class="menu-head">
        <span>菜单子节点</span>
        <el-button type="primary" @click="addFuncMenu" size="small">新增</el-button>
      </div>
      <!-- <div v-show="['0','1','2'].indexOf(treeInfo.type) != -1" class="menu-child-table"> -->
        
        <el-table
          v-show="['0','1','2'].indexOf(treeInfo.type) != -1"

          :data="tableData"
          height="100%"
          stripe
          border
          highlight-current-row
          :header-cell-style="{padding:'5px 0'}"
          :cell-style="{padding:'0px'}">
          <el-table-column
            prop="id"
            label="ID"
            width="60"
            align="center">
          </el-table-column>
          <el-table-column
            label="功能名称"
            width="120"
            show-overflow-tooltip
            align="center">
            <template slot-scope="scope">
              <span v-on:click="handleClick(scope.row)" class="common-link">{{scope.row.permission_name}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="类型"
            width="80"
            show-overflow-tooltip
            align="center">
            <template slot-scope="scope">

              <el-tag v-if="scope.row.type == 1" size="mini">
                模块
              </el-tag>
              <el-tag v-if="scope.row.type == 2" type="success" size="mini">
                菜单
              </el-tag>
              <el-tag v-else-if="scope.row.type == 3" type="warning" size="mini">
                权限
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="action_uri"
            label="接口请求uri"
            width="160"
            show-overflow-tooltip
            align="center">
          </el-table-column>
          <el-table-column
            prop="route_uri"
            label="前端路由uri"
            width="160"
            show-overflow-tooltip
            align="center">
          </el-table-column>
          <el-table-column
            prop="order_num"
            label="排序值"
            width="120"
            align="center">
          </el-table-column>
          <el-table-column
            prop="create_time"
            label="创建时间"
            width="160"
            show-overflow-tooltip
            align="center">
          </el-table-column>
          <el-table-column
            prop="modify_time"
            label="修改时间"
            width="160"
            show-overflow-tooltip
            align="center">
          </el-table-column>
          <el-table-column
            label="操作"
            min-width="70"
            align="center">
            <template slot-scope="scope">
              <el-button @click="delFuncMenu(scope.row)"   size="small" type="danger" plain>删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      <!-- </div> -->

      <!--新增界面-->
      <el-dialog title="创建功能菜单" :visible.sync="addFormVisible" :close-on-click-modal="false">
        <el-form :model="addForm" label-width="100px" :rules="formRules" ref="addForm" style="width:460px">
          <el-form-item label="名称" prop="permission_name">
            <el-input v-model="addForm.permission_name" ></el-input>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <template>
              <el-radio v-model="addForm.type" label="1" :disabled="!(treeInfo.type == 0)">模块</el-radio>
              <el-radio v-model="addForm.type" label="2" :disabled="treeInfo.type == 0">菜单</el-radio>
              <el-radio v-model="addForm.type" label="3" :disabled="treeInfo.type == 0">权限</el-radio>
            </template>
          </el-form-item>
          <el-form-item label="接口请求uri" prop="action_uri">
            <el-input v-model="addForm.action_uri" ></el-input>
          </el-form-item>
          <el-form-item label="前端路由uri" prop="route_uri">
            <el-input v-model="addForm.route_uri"></el-input>
          </el-form-item>
          <el-form-item label="父节点Id" prop="father_id">
            <el-input v-model="addForm.father_id"></el-input>
          </el-form-item>
          <el-form-item label="排序值" prop="order_num">
            <el-input v-model="addForm.order_num"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addSubmit" >保存</el-button>
          <el-button @click.native="addFormVisible = false;$refs['addForm'].resetFields();">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>

import {get_all_menu_permission,add_func_menu,del_func_menu,edit_func_menu} from  '@/api/sysManage/funcMenuManage.js';

// import { mapGetters, mapMutations } from 'vuex';

export default {
  // name: 'menuTree',
  // props: ['treeData','rolePermissionIDList','roleId'],
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  data() {
    return {
      filterText: '',//菜单树过滤框绑定的id值
      defaultProps: {//定义树组件所需字段与提供的数据绑定关系
        children: 'children',
        label: 'permission_name',
      },

      allTreeData:[] ,//所有菜单树数据

      treeManageShow:false, //功能菜单管理界面是否显示

      treeInfoLink:{},//专门用来映射菜单树节点的原始data数据
      treeInfo:{ //基本信息页显示的数据
        // id: '1',
        // permission_name: '删除用户',
        // type: '2',
        // action_uri:'/sysManage/user/del',
        // route_uri: '/sysManage/user/del',
        // father_id: '22',
        // order_num: '2',
        // create_time: '2019-10-10 09:56:57',
        // modify_time: '2019-10-12 19:24:56'

      },

      tableData: [ //子节点列表显示的数据
      //   {
      //   date: '2016-05-03',
      //   name: '王小虎',
      //   address: '上海市普陀区金沙江路 1518 弄'
      // }, {
      //   date: '2016-05-02',
      //   name: '王小虎',
      //   address: '上海市普陀区金沙江路 1518 弄'
      // }, {
      //   date: '2016-05-04',
      //   name: '王小虎',
      //   address: '上海市普陀区金沙江路 1518 弄'
      // }, {
      //   date: '2016-05-01',
      //   name: '王小虎',
      //   address: '上海市普陀区金沙江路 1518 弄'
      // }, {
      //   date: '2016-05-08',
      //   name: '王小虎',
      //   address: '上海市普陀区金沙江路 1518 弄'
      // }, {
      //   date: '2016-05-06',
      //   name: '王小虎',
      //   address: '上海市普陀区金沙江路 1518 弄'
      // }, {
      //   date: '2016-05-07',
      //   name: '王小虎',
      //   address: '上海市普陀区金沙江路 1518 弄'
      // }
      ],


      addFormVisible: false, //新增窗口是否显示

      addForm:{//新增功能菜单的表单数据
        permission_name: '',
        type: '',
        action_uri:'',
        route_uri: '',
        father_id: '',
        order_num: ''
      },

      formRules: {//添加权限和修改权限表单校验
        permission_name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        father_id: [
          { required: true, message: '请输入父节点Id', trigger: 'blur' }
        ],
        order_num: [
          { required: true, message: '请输入排序值', trigger: 'blur' }
        ]
      },

    }
  },
  computed: {
    // ...mapGetters([
    //   'permissionTreeList',
    // ])
  },

  created() {
    this.getAllMenuPermission()
  },

  methods: {

    filterNode(value, data) {
      if (!value) return true;
      // console.log(data.permission_name +"--["+data.id.toString()+"]", (data.permission_name +"--["+data.id.toString()+"]").indexOf(value) !== -1)
      return (data.permission_name +"--["+data.id.toString()+"]").indexOf(value) !== -1;
    },

    getAllMenuPermission() {//获取所有菜单权限树结构数据。
      get_all_menu_permission().then(
        res => {
          if (res.status == 200 && res.data.status == 1){
            // this.defaultRoot[0].children=res.data.all_tree_data
            this.allTreeData=res.data.all_tree_data
            console.log(this.allTreeData)
          } else {
            console.log(res.data.message)
          }
        }
      )
    },

    nodeClick(data,node,VC){//节点被点击时的回调
      console.log(data,node,VC)
      
      this.treeInfoLink = data;
      this.treeInfo = JSON.parse(JSON.stringify(data));// 赋值后原数据随赋值后的数据的变化而变化

      this.treeInfo.type = this.treeInfo.type.toString();

      
      this.treeManageShow = true;

      if (this.treeInfo.children){
        this.tableData = data.children;
      }else {
        this.tableData = [];
      }
      

    },

    handleClick(data){//处理列表中子菜单被点击的事件 。
      this.nodeClick(data,null,null)
      this.$refs.tree.setCurrentKey(data.id)
      // console.log(this.$refs.tree)

    },

    editFuncMenu(){
      this.$confirm('确认修改功能菜单吗？', '提示', {type: 'warning'}).then(() => {
        edit_func_menu(this.treeInfo).then(
          res => {
            if (res.data.status == 1){
              this.treeInfoLink.action_uri=this.treeInfo.action_uri
              this.treeInfoLink.father_id=this.treeInfo.father_id
              this.treeInfoLink.order_num=this.treeInfo.order_num
              this.treeInfoLink.permission_name=this.treeInfo.permission_name
              this.treeInfoLink.route_uri=this.treeInfo.route_uri
              this.treeInfoLink.type=this.treeInfo.type



              this.$message({
                message: '修改成功',
                type: 'success'
              })
            }else{
              this.$message({
                message: res.data.message,
                type: 'warning'
              })
            }
          }
        )
      }).catch(()=>{})
    },

    addFuncMenu(){
      this.addForm.father_id=this.treeInfo.id;
      this.addFormVisible=true
    },

    addSubmit(){
        add_func_menu(this.addForm).then(
          res => {
            if (res.data.status == 1){
              this.$message({
                message: '保存成功',
                type: 'success'
              })
              this.addFormVisible=false
              this.treeInfoLink.children=res.data.data
              this.tableData = res.data.data
              this.$refs['addForm'].resetFields();
            }else{
              this.$message({
                message: res.data.message,
                type: 'warning'
              })
            }
          }
        )
    },

    delFuncMenu(obj){
      console.log(obj)
      if (obj.children.length == 0){
        this.$confirm('确认删除功能菜单吗？', '提示', {type: 'warning'}).then(() => {
          del_func_menu(obj).then(
            res => {
              if (res.data.status == 1){
                this.$message({
                  message: '删除成功',
                  type: 'success'
                })
                
                
                this.$refs.tree.remove(obj)
                if( obj.children.length == 0 ){
                  let node = this.$refs.tree.getNode(obj.father_id)
                  this.nodeClick(node.data,null,null)
                  this.$refs.tree.setCurrentKey(obj.father_id)

                }

              }else{
                this.$message({
                  message: res.data.message,
                  type: 'warning'
                })
              }
            }
          )
        }).catch(()=>{})
      } else{
        this.$message({
          message: '改节点存在子节点，请转移或删除后，再操作！',
          type: 'warning'
        })
      }


    },



  }
}
</script>

<style lang="scss" scoped>
.func-main {
  // overflow: hidden;
  height: 100%;
  // display: flex;
  // flex-direction:  row;
  // background-color: #fff;
  // position: relative;
  display: flex;
  padding-bottom: 10px;

  .tree-main{
    // order: 1;
    // display: inline-block;
    border: 1px solid #e2e2e2;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.3);
    background-color: #fff;
    // max-height: 100%;
    // height: auto;
    width: 300px;
    // position:absolute;
    position: relative;
    border-radius: 4px;
    // left: 0px;
    // top: 0px;
    // bottom: 0px;
    .tree-head{
      border-bottom: 1px solid #e2e2e2;
      text-align: center;
      line-height: 56px;
      // position: fixed;
      // float: left;
      // top: 0px;
      // left: 0px;
      // right: 0px;
      height: 56px;
      font-size: 24px;
      // font-weight: 600;
      background-color: #eee;
    }

    .tree-content{
      position: absolute;
      top: 56px;
      bottom: 0px;
      left: 0px;
      right: 0px;
      min-height: 300px;
      max-height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
    }

  }


  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }


  .tree-manage{
    // order: 2;
    // display: inline-block;
    // margin-left: 10px;
    // vertical-align: top; 
    border: 1px solid #e2e2e2;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.3);
    // width: 100%;
    margin-left: 10px;
    // min-height: 500px;
    // position: absolute;
    flex: 1;
    // right: 0px;
    // top: 0px;
    // left: 310px;

    background-color: #fff;
    border-radius: 4px;

    overflow: auto;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;

    .menu-head{
      background-color: #eee;
      height: 34px;
      line-height: 34px;
      padding-left: 5px;
      font-weight: bold;
      margin-bottom: 5px;
      button{
        float: right;
        margin-right: 15px;
      }
    }

    .menu-info >>> .el-form-item{
      margin-bottom: 5px;
    }
}

}


</style>