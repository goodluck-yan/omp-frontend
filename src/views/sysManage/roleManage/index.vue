<template>
  <div class="role-main">
    <!-- <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">

      <span>角色名称:</span>
      <el-input  v-model.trim="role_name"  placeholder="输入角色名称"></el-input>
      <el-button type="primary" @click="get_role_list()" >搜索</el-button>
    </el-col> -->

    <!--工具条-->

			<el-form :inline="true">
				<el-form-item>
					<el-input v-model.trim="role_name"  placeholder="输入角色名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary"  @click="get_role_list()" >搜索</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary"  @click="addFormVisible = true" >新增</el-button>
				</el-form-item>
			</el-form>






      <el-table
        :data="tableData"
        height="100%"
        stripe
        border
        highlight-current-row
        @selection-change="handleSelectionChange"
        :header-cell-style="{'background-color':'#409eff',color:'white',padding:'5px 0'}"

        :cell-style="{padding:'0px'}">
        <el-table-column type="selection" align="center" width="55">
        </el-table-column>
        <el-table-column
          prop="id"
          label="ID"
          width="80"
          align="center">
        </el-table-column>
        <el-table-column
          prop="role_name"
          label="角色名"
          width="200"
          align="center">
        </el-table-column>
        <el-table-column
          prop="desc"
          label="描述"
          width="250"
          align="center"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="创建时间"
          width="200"
          align="center">
        </el-table-column>
        <el-table-column
          prop="modify_time"
          label="修改时间"
          width="200"
          align="center">
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="200"
          align="center">
          <template slot-scope="scope">
            <el-button @click="confClick(scope.row)"  type="primary"  size="small">配置</el-button>
            <el-button @click="delClick(scope.row)"   size="small" type="danger" :disabled="scope.row.id === 1" plain>删除</el-button>
          </template>
        </el-table-column>
      </el-table>


    <!--工具条-->
    <el-row class="role-bottom">
      <el-col :span="12" >
        <el-button type="danger" size="small" @click="batchRemove" :disabled="this.multipleSelection.length===0" plain>批量删除</el-button>
      </el-col>
      <el-col :span="12">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="current_page"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="page_size"

          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-col>

    </el-row>
    




		<!--新增界面-->
		<el-dialog title="创建角色" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="formRules" ref="addForm">
				<el-form-item label="角色名" prop="role_name">
					<el-input v-model="addForm.role_name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="描述" prop="desc">
					<el-input v-model="addForm.desc" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false;$refs['addForm'].resetFields();">取消</el-button>
				<el-button type="primary" @click="addSubmit" >保存</el-button>
			</div>
		</el-dialog>


    <!--角色配置界面-->
    <el-drawer
      :title="confData.editForm.role_name"
      :visible.sync="drawer"
      direction="rtl"
      :before-close="handleClose"
      size="50%"
      :wrapperClosable="false">

      <el-tabs  v-if="drawer" type="border-card" v-model="confData.activeName" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="first">
          <el-form :model="confData.editForm" label-width="80px" :rules="formRules" ref="editForm" style="width:460px">
            <el-form-item label="角色名" prop="role_name">
              <el-input v-model="confData.editForm.role_name"   ></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="desc">
              <el-input  type="textarea" v-model="confData.editForm.desc"   ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary"  @click="editSubmit" >保存</el-button>
            </el-form-item>
          </el-form>

        </el-tab-pane>

        <el-tab-pane v-if="confData.editForm.id !== 1" label="角色授权" name="second">
          <menu-tree  :treeData="allTreeData" :rolePermissionIDList="confData.rolePermissionIDList" :roleId=confData.editForm.id ></menu-tree>
        </el-tab-pane>

        <el-tab-pane label="关联用户" name="third">
          <asscociation-user :allUser="confData.allUserList" :roleUser="confData.roleUserIdList" :roleId=confData.editForm.id></asscociation-user>
        </el-tab-pane>
        
      </el-tabs>

    </el-drawer>


  </div>
</template>

<script>
import {get_all_menu_permission,} from  '@/api/sysManage/funcMenuManage.js'
import {get_role_list,add_role,del_role,edit_role,get_role_permissionID_list,get_role_userID_list} from '@/api/sysManage/roleManage.js'
import {get_user_list} from '@/api/sysManage/userManage.js'
import MenuTree from './menuTree.vue'
import asscociationUser from './associationUser.vue'
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'roleManage',
  data() {
    return {
      role_name: '',//角色搜索框中的内容
      multipleSelection: [],//角色列表批量选中内容
      tableData: [],//角色列表数据内容

      page_size:10,//每页显示条数
      current_page:1,//当前页
      total: 0,//总数据条数
      // editFormRules: {
      //   name: [
      //     { required: true, message: '请输入姓名', trigger: 'blur' }
      //   ]
      // },

      drawer: false,//控制配置界面是否显示
      confData: {//配置界面数据
        activeName: 'first',//当前激活的tabs页签

        editForm: {},//角色基本信息内容


        rolePermissionIDList: [],//角色权限id列表

        roleUserIdList:[],//角色用户id列表
        allUserList:[]//所有用户列表数据
      },
      addFormVisible: false,//新增界面是否显示
      formRules: {//添加角色和修改角色表单校验
        role_name: [
          { required: true, message: '请输入角色名', trigger: 'blur' }
        ]
      },
      //新增界面数据
      addForm: {
        role_name: '',
        desc: ''
      },

      // 完整菜单树数据
      allTreeData: [],


    }
  },

  created() {
    this.get_role_list()
    this.get_all_menu_permission()
    this.get_all_user_list()
  },



  computed: {
    // ...mapGetters([
    //   'permissionTreeList',
    // ])
  },

  components:{
    MenuTree,
    asscociationUser
  },

  methods: {

    handleSelectionChange(val) {//多选框回调函数
      this.multipleSelection = val;
    },

    confClick(row) {//点击角色配置按钮回调函数
      // console.log(row);



      let req_data={
        role_id:row.id
      }
      get_role_permissionID_list(req_data).then(//获取权限对应的权限列表
        res => {
          if (res.status == 200 && res.data.status == 1){
            this.confData.rolePermissionIDList = res.data.data;
            this.confData.editForm = row;
            return get_role_userID_list(req_data)//获取权限关联的用户列表
          } else {
            console.log(res.data.message)
          }

        },
        err => {

        }
      ).then(
        res => {
          if (res.status == 200 && res.data.status == 1){
            this.confData.roleUserIdList = res.data.data;
            this.drawer = true;
            this.confData.editForm = row;
          } else {
            console.log(res.data.message)
          }

        },
        err => {

        }
      ).catch(()=>{

      })

    },

    delClick(row){//点击删除角色按钮回调事件
      let req_data={
        role_id:row.id
      }

      this.$confirm('确认删除角色吗？', '提示', {type: 'warning'}).then(() => {
        // let loading = this.$loading({ text:"拼命加载中",spinner:"el-icon-loading",background:"rgba(0, 0, 0, 0.6)"})
        del_role(req_data).then(
          res => {
            if (res.data.status == 1) {
              this.$message({
                message: '删除成功',
                type: 'success'
              });

              this.tableData.some((item,i)=>{
                if (item.id == row.id) {
                  this.tableData.splice(i,1);
                  return true;
                }
              });
            } else{
              this.$message({
                message: res.data.message,
                type: 'warning'
              });
            }
            // loading.close();

          }
        );
      }).catch(()=>{

      });


    },

    get_all_menu_permission() {//获取所有菜单权限树结构数据。
      // console.log(row);

      get_all_menu_permission().then(
        res => {
          if (res.status == 200 && res.data.status == 1){
            // this.treeData = res.data.message
            // this.setPermissionTreeList(res.data.message)
            this.allTreeData=res.data.all_tree_data
            // console.log(this.treeData)
          } else {
            console.log(res.data.message)
          }
        }

      )
    },

    handleClose(done) {//关闭配置框回调函数
      // this.$confirm('确认关闭？')
      //   .then(_ => {
      //     done();
      //   })
      //   .catch(_ => {});

      done();
      this.confData.activeName='first';
    },


    handleClick(tab, event) {//配置框tabs切换回调事件
      // console.log(tab, event);

      // if (tab.name == "second") {
      //   this.$refs.menuTree.setCheckedKeys([1,3])
      // }


    },

    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.page_size=val
      this.get_role_list()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.current_page=val
      this.get_role_list()
    },


    get_role_list() {//获取权限分页列表
      let ojb = {
        // user_id:this.userinfo.id,
        role_name: this.role_name,
        page_size: this.page_size,
        current_page: this.current_page
      }


      get_role_list(ojb).then(//查询角色列表信息
        res => {
          if (res.status == 200 && res.data.status == 1){
            this.tableData = res.data.data.role_list
            this.total = res.data.data.total
          } else {
            console.log(res.data.message)
          }
        },
        err => {
        }
      )

    },



    //批量删除
    batchRemove() {

    },


    //新增角色
    addSubmit() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认保存吗？', '提示', {}).then(() => {
            //NProgress.start();
            // let para = Object.assign({}, this.addForm);
            // para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
            add_role(this.addForm).then(res => {
              //NProgress.done();
              this.$message({
                message: '保存成功',
                type: 'success'
              });
              this.$refs['addForm'].resetFields();
              this.addFormVisible = false;
              this.get_role_list();
            },err => {
            });
          }).catch(()=>{
          
        });
        }
      });
    },

    //修改角色基本信息
    editSubmit() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认修改角色基本信息吗？', '提示', {}).then(() => {
            edit_role(this.confData.editForm).then(res => {
              //NProgress.done();
              this.$message({
                message: '保存成功',
                type: 'success'
              });
              // this.$refs['addForm'].resetFields();
              // this.addFormVisible = false;
              this.get_role_list();
            },err => {
            });
          }).catch(()=>{
          
        });
        }
      });
    },

    //获取所有用户信息列表
    get_all_user_list(){

      let req_data = {
        username: ''
      }
      get_user_list(req_data).then(
        res => {
          this.confData.allUserList=res.data.data
        }
      )
    },

    // ...mapMutations({
    //     setPermissionTreeList: 'SET_PERMISSION_TREE_LIST'
    // }),

  }

}
</script>

<style lang="scss" scoped>

  .role-main{
    overflow: auto;
    height: 100%;
    margin-bottom: 0px;
    margin-top: 0px;
    width: 100%;
    display: flex;
    flex-direction: column;

    // .role-list{
    //   width: 100%;
      
    // }



    // .role-list /deep/ .el-table{.has-gutter{

    //       background-color: #409eff !important;
    //       color: white !important;
    // }
      
    // }

    // .role-list >>> .el-table--border{
    //   th.gutter{
    //     display: none;
    //   }
    // }


    .role-bottom{
      padding-top: 5px;
    }
  }


  .role-main /deep/ .el-form-item {
    margin-bottom: 10px;
  }


// .el-drawer.rtl{
//   // width:50%;
//   // min-width: 600px;
// }





// .el-table tr:hover{
//     background: #f6faff; //鼠标移动到当前行的颜色
// }
 
// .el-table--striped{
//   .el-table__body{
//     tr.el-table__row--striped {
//       td {
//         background: #c9cbce; // 单数行的颜色
//       }
//     }
//   }
// }
</style>