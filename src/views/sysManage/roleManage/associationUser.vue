<template>

  <div class="role-user">
    <el-transfer
      style="text-align: left; display: inline-block"
      v-model="value"
      filterable
      :titles="['可选用户', '已关联用户']"
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
import {edit_role_user} from  '@/api/sysManage/roleManage.js'
export default {
    name: 'asscociationUser',
    props:['allUser','roleUser','roleId'],
    data() {
      const generateData = (allUser) => {
        const data = [];
        
        for ( let i in allUser) {
          if ( allUser[i].status == 1){
            data.push({
              key: allUser[i].id,
              label: `${ allUser[i].account }--${ allUser[i].nickname }`,
              // disabled: true,
              // disabled: i % 4 === 0
            });
          };
        }
        return data;
      };
      return {
        data: generateData(this.allUser),//全部用户信息列表
        value: this.roleUser,//已关联用户ID列表

      };
    },
    created() {

    },
    methods: {


      handleChange(value, direction, movedKeys) {
        // console.log(value, direction, movedKeys);
        let req_data={
          role_id:this.roleId,
          add_user_id_list:[],
          del_user_id_list:[]
        }


        if (direction == 'right') {
          req_data.add_user_id_list = movedKeys
        }else if (direction == 'left'){
          req_data.del_user_id_list = movedKeys
        }

        edit_role_user(req_data).then(
          res => {
            if (res.data.status == 1){
              this.$message({
                message: '操作成功',
                type: 'success'
              })
            }else {
              console.log(res.data.message)
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

  .role-user{
    text-align: center;

  }


  .role-user /deep/  .el-transfer-panel__body {
    height: 348px;
    .el-transfer-panel__list.is-filterable {
      height: 301px;
    }
  }
</style>



