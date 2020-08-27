<template>
  <div class="user-main">


    <!--工具条-->
			<el-form :inline="true">
				<el-form-item>
					<el-input v-model.trim="username"  placeholder="输入账号或昵称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary"  @click="getUserList()" >搜索</el-button>
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
        prop="account"
        label="账号"
        width="200"
        align="center">
      </el-table-column>
      <el-table-column
        prop="nickname"
        label="昵称"
        width="200"
        align="center">
      </el-table-column>
      <el-table-column
        label="状态"
        width="200"
        align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 1" type="success"  size="mini">
            启用
          </el-tag>
          <el-tag v-else type="warning"  size="mini">
            禁用
          </el-tag>
        </template>
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
          <el-button @click="modifyClick(scope.row)"   type="primary"  size="small" >修改</el-button>
          <el-button @click="delClick(scope.row)"   size="small" type="danger" :disabled="scope.row.id === 1" plain>删除</el-button>
        </template>
      </el-table-column>
    </el-table>


    <!--工具条-->


    <el-row class="user-bottom">
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
		<el-dialog title="创建用户" :visible.sync="addFormVisible" :close-on-click-modal="false" :width="'25%'">
			<el-form :model="addForm" label-width="100px" :rules="formRules" ref="addForm"  >
				<el-form-item label="账号" prop="account">
					<el-input v-model="addForm.account" :width="'20%'"></el-input>
				</el-form-item>
				<el-form-item label="昵称" prop="nickname">
					<el-input v-model="addForm.nickname" :width="'20%'"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input v-model="addForm.password" auto-complete="new-password" :width="'20%'" show-password></el-input>
				</el-form-item>
				<el-form-item label="状态" prop="status">
					<template>
            <el-radio v-model="addForm.status" label="1">启用</el-radio>
            <el-radio v-model="addForm.status" label="0">禁用</el-radio>
          </template>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="addSubmit" :width="'20%'">保存</el-button>
				<el-button @click.native="addFormVisible = false;$refs['addForm'].resetFields();" :width="'20%'">取消</el-button>
			</div>
		</el-dialog>


    <!--用户配置界面-->
    <el-drawer
      :title="confData.editForm.account+' - '+confData.editForm.nickname"
      :visible.sync="drawer"
      direction="rtl"
      :before-close="handleClose"
      size="50%"
      :wrapperClosable="false">

      <el-tabs v-if="drawer" type="border-card" v-model="confData.activeName" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="first" v-if="confData.editForm.id !== 1">
          <el-form :model="confData.editForm" label-width="80px" :rules="formRules" ref="editForm" style="width:460px">
            <el-form-item label="账号" prop="account" :disabled="true">
              <el-input v-model="confData.editForm.account"  :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="昵称" prop="nickname">
              <el-input v-model="confData.editForm.nickname"   ></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <template>
                <el-radio v-model="confData.editForm.status" label="1">启用</el-radio>
                <el-radio v-model="confData.editForm.status" label="0">禁用</el-radio>
              </template>
            </el-form-item>
            <el-form-item>
              <el-button type="primary"  @click="editSubmit" >保存</el-button>
            </el-form-item>
          </el-form>

        </el-tab-pane>

        <el-tab-pane  label="重置密码" name="second">
          <el-form :model="confData.passwordForm" label-width="80px" :rules="formRules" ref="passwordForm" style="width:460px">
            <el-form-item label="新密码" prop="new_password">
              <el-input v-model="confData.passwordForm.new_password"  show-password></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary"  @click="editPassword" >保存</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="分配角色" name="third" v-if="confData.editForm.id !== 1">
          <assign-role  :allRole="confData.allRoleList" :userRole="confData.userRoleIdList" :userId="confData.editForm.id"></assign-role>
        </el-tab-pane>
        
      </el-tabs>

    </el-drawer>


  </div>
</template>

<script>
import {get_user_list,add_user,del_user,edit_user,get_user_roleId_list,edit_user_role,reset_password} from '@/api/sysManage/userManage.js'
import {get_role_list} from '@/api/sysManage/roleManage.js'
import assignRole from './assignRole.vue'

export default {
  name: 'userManage',
  data() {
    return {
      username: '',//用户搜索框中的内容

      multipleSelection: [],//用户列表批量选中内容
      tableData: [],//用户列表数据内容

      page_size:10,//每页显示条数
      current_page:1,//当前页
      total: 0,//总数据条数



      formRules: {//新增用户和修改用户表单校验
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输密码', trigger: 'blur' },
          { min: 8, max: 20, message: '长度在 8 到 20 个字符', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输密码', trigger: 'blur' },
          { min: 8, max: 20, message: '长度在 8 到 20 个字符', trigger: 'blur' }
        ],
      },
      //新增界面数据
      addForm: {
        account: '',
        nickname: '',
        password:'',
        status: '1',
      },


      drawer: false,//修改界面是否显示
      confData: {//修改控件所需数据
        activeName: 'first',//当前激活的tabs页签
        editForm: {},//用户基本信息内容
        userRoleIdList: [],//用户角色id列表
        allRoleList:[],//所有角色列表数据
        passwordForm:{
          new_password:'',//新密码
          user_id: 0,
        },
      },
      addFormVisible: false,//新增界面是否显示

    }
  },

  created() {
    this.getUserList()
    this.getAllRoleList()
  },



  computed: {
    // ...mapGetters([
    //   'permissionTreeList',
    // ])
  },

  components:{
    assignRole,
  },

  methods: {

    handleSelectionChange(val) {//多选框回调函数
      this.multipleSelection = val;
    },

    modifyClick(row) {//点击用户修改按钮回调函数

      let req_data={
        user_id:row.id
      }
      if (row.id == 1){
        this.confData.activeName='second';

      }else{
        this.confData.activeName='first';
      }

      this.confData.editForm = {};
      this.confData.passwordForm.new_password = '';
      this.confData.passwordForm.user_id = 0;

      get_user_roleId_list(req_data).then(//获取用户对应的角色列表
        res => {
          if (res.status == 200 && res.data.status == 1){
            this.confData.userRoleIdList = res.data.data;
            this.confData.editForm = row;
            this.confData.editForm.status = this.confData.editForm.status.toString();

            this.confData.passwordForm.user_id = row.id;

            this.drawer = true;
          } else {
            console.log(res.data.message)
          }

        },
        err => {

        }
      ).catch(()=>{

      })

    },

    delClick(row){//点击删除用户按钮回调事件
      let req_data={
        user_id:row.id
      }

      this.$confirm('确认删除用户吗？', '提示', {type: 'warning'}).then(() => {
        del_user(req_data).then(
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


          }
        );
      }).catch(()=>{

      });


    },



    handleClose(done) {//关闭配置框回调函数
      done();

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
      this.getUserList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.current_page=val
      this.getUserList()
    },


    getUserList() {//获取用户分页列表
      let ojb = {
        username: this.username,
        page_size: this.page_size,
        current_page: this.current_page
      }

      get_user_list(ojb).then(//查询用户列表信息
        res => {
          if (res.status == 200 && res.data.status == 1){
            this.tableData = res.data.data.user_list
            this.total = res.data.data.total
          } else {
            console.log(res.data.message)
          }
        },
        err => {
        }
      )

    },



    //批量删除用户
    batchRemove() {

    },


    //新增用户
    addSubmit() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认保存吗？', '提示', {}).then(() => {

            add_user(this.addForm).then(
              res => {
                this.$message({
                  message: '提交成功',
                  type: 'success'
                });
                this.$refs['addForm'].resetFields();
                this.addFormVisible = false;
                this.getUserList();
              },
              err => {
              }
            );
          }).catch(()=>{
          
          });
        }
      });
    },

    //修改用户基本信息
    editSubmit() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认修改用户基本信息吗？', '提示', {}).then(() => {
            edit_user(this.confData.editForm).then(res => {
              //NProgress.done();
              this.$message({
                message: '提交成功',
                type: 'success'
              });
              // this.$refs['addForm'].resetFields();
              // this.addFormVisible = false;
              this.getUserList();
            },err => {
            });
          }).catch(()=>{
          
        });
        }
      });
    },

    //重置用户密码
    editPassword(){

      this.$refs.passwordForm.validate((valid)=>{
        if (valid) {
          this.$confirm('确认重置密码吗？','提示',{type:'warning'}).then(()=>{
            reset_password(this.confData.passwordForm).then(
              res =>{
                if (res.data.status == 1){
                  this.$message({
                    message: '密码重置成功',
                    type: 'success'
                  });
                  this.$refs.passwordForm.resetFields();
                } else{
                  this.$message({
                    message: res.data.message,
                    type: 'warning'
                  });
                }
              },
              err =>{}
            )
          })
        }
      })
    },


    //获取所有角色信息列表
    getAllRoleList(){

      let req_data = {
        role_name: ''
      }
      get_role_list(req_data).then(
        res => {
          this.confData.allRoleList=res.data.data
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

  .user-main{
    overflow: auto;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;

    .user-bottom{
      padding-top: 5px;
    }
  }


</style>