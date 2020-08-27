<template>

  <div class="user-role">
    <el-transfer
      style="text-align: left; display: inline-block"
      v-model="value"
      filterable
      :titles="['可选角色', '已分配角色']"
      :button-texts="['移出', '添加']"
      :format="{
        noChecked: '${total}',
        hasChecked: '${checked}/${total}'
      }"
      @change="handleChange"
      :data="data">
      <span slot-scope="{ option }">{{ option.label }}</span>
      <!-- <el-button class="transfer-footer" slot="left-footer" size="small">操作</el-button>
      <el-button class="transfer-footer" slot="right-footer" size="small">操作</el-button> -->
    </el-transfer>
  </div>
</template>


<script>
import {edit_user_role} from  '@/api/sysManage/userManage.js'
export default {
    name: 'assignRole',
    props:['allRole','userRole','userId'],
    data() {
      const generateData = (allRole) => {
        const data = [];
        
        for ( let i in allRole) {

          data.push({
            key: allRole[i].id,
            label: allRole[i].role_name,
          });
        }
        return data;
      };
      return {
        data: generateData(this.allRole),//全部角色信息列表
        value: this.userRole,//已关联角色ID列表

      };
    },
    created() {
      // console.log(this.allRole,this.userRole,this.userId)
    },
    methods: {


      handleChange(value, direction, movedKeys) {
        // console.log(value, direction, movedKeys);
        let req_data={
          user_id:this.userId,
          add_role_id_list:[],
          del_role_id_list:[]
        }


        if (direction == 'right') {
          req_data.add_role_id_list = movedKeys
        }else if (direction == 'left'){
          req_data.del_role_id_list = movedKeys
        }

        edit_user_role(req_data).then(
          res => {
            if (res.data.status == 1){
              this.$message({
                message: '操作成功',
                type: 'success'
              })
            }else {
              this.$message({
                message: res.data.message,
                type: 'warning'
              })
            }
          },
          err =>{
          }
        ).catch(()=>{

        })

      },

    },

}
</script>


<style lang="scss" scoped>

  .user-role{
    text-align: center;

  }


  .user-role /deep/  .el-transfer-panel__body {
    height: 348px;
    .el-transfer-panel__list.is-filterable {
      height: 301px;
    }
  }
</style>



