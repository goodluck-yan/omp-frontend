<template>
  <div >
    <el-menu
      class="el-menu-vertical-demo"
      :default-active="$route.path"
      :router='true'
      @open="handleOpen"
      @close="handleClose">
      <el-submenu  
        v-for="item in treeList" 
        :key="item.id" 
        :index="item.id">
        <template slot="title">
          <span class="sidebar-title" :title="item.name">{{ item.name }}</span>
          <div 
            class="group-icon"
            @click.stop="handleClickGroupIcon(item)">
            <i class="fa fa-cog" aria-hidden="true"></i>
          </div>
        </template>
        <template 
          v-for="child in item.children" 
          v-if="item.children && item.children.length > 0">
          <el-menu-item 
            :index="'/model/group/' + child.id" 
            :key="child.id">
            {{ child.name }}
          </el-menu-item>
        </template>
      </el-submenu>
    </el-menu>
    <!-- 分组操作弹出层 -->
    <my-dialog
      :visible.sync="dialogVisible"
      title="设置分组"
      >
      <div slot="content" class="group-from">
         <el-form 
          :model="form"
          :rules="rules" 
          ref="form" 
          label-width="100px" 
          class="demo-form">
          <el-row type="flex" class="row-bg" justify="center">
            <el-col :span="8">
              <el-form-item label="分组名称" prop="name" >
                <el-input v-model="form.name" placeholder="中文名称"></el-input>
              </el-form-item>
              <el-form-item label="分组编码" prop="code">
                <el-input v-model="form.code" placeholder="英文名称(*只能由数字、字母、下划线组成)"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="small" type="primary" @click="editModelGroup" :loading="editLoading">编 辑</el-button>
        <el-button size="small" type="danger" @click="deleteModelGroup">删 除</el-button>
      </div>
    </my-dialog>
  </div>
</template>

<script>
  import { modelGroupAction, groupAction, modelOfGroupAction } from '@/api/model.js'
  import { checkCode } from '@/utils/validator.js'
  import { mapMutations, mapGetters } from 'vuex'
  import MyDialog from '@/components/MyDialog'
  import { checkCode } from '@/utils/validator.js'
  import { mapType } from '@/utils/config.js'

	export default {
    name: 'modelMenus',
    components: {
      MyDialog
    },
	  data () {
      const validateCode = (rule,value, callback) => {
        if (!value) {
          callback(new Error('请输入分组编码'))
        } else {
          if (!checkCode(value)) {
            callback(new Error('编码只能由数字、字母、下划线组成'))
          } else {
            callback()
          }
        }
      }
	    return {
        dialogVisible: false,
        form: {},
        rules: {
          name: [{ required: true, message: '请输入分组名称', trigger: 'change' }],
          code: [{ required: true, validator: validateCode, trigger: 'change' }]
        },
        editLoading: false,
	    }
	  },
    computed: {
      ...mapGetters([
        'treeList'
      ])
    },
	  mounted () {
	    this.getTree()
	  },
	  methods:{
	    // 获取模型分组列表
      getTree () {
        let self = this
        let obj = {
          method: 'get'
          layer_id: mapType(self.$route.params.modelManageType)
        }
        modelGroupAction(obj).then(res => {
          if (res.status === 200) {
            let list = res.data
            let newList = self.doTree(list)
            // 保存到vuex
            this.setTreeList(newList)
          }
        }, err => {
          console.log('error',err)
        })
      },
      // 构造树形结构
      doTree (list) {
        let arr = list.concat()
        arr.forEach(item => {
          item.children = []
        })
        return arr
      },
      // 动态将模型添加到分组中
      pushChildren (key, children) {
        this.treeList.forEach(item => {
          if (item.id === key) {
            item.children = children
          }
        })
      },
      // 动态将清空分组中的模型
      popChildren (key) {
        this.treeList.forEach(item => {
          if (item.id === key) {
            item.children = []
          }
        })
      },
      handleOpen (key, keyPat) {
        let obj = {
          method: 'get',
          layer_id: mapType(self.$route.params.modelManageType),
          model_group_id: key
        }
        modelOfGroupAction(obj).then(res => {
          if (res.status === 200) {
            let children = res.data
            this.pushChildren(key,children)
          }
        }, err => {
          console.log('error', err)
        })

      },
      handleClose (key, keyPat) {
        this.popChildren(key)
      },
      handleClickGroupIcon (item) {
        this.dialogVisible = true
        this.form = item
      },
      handleClose () {
        this.dialogVisible = false
      },
      // 编辑分组
      editModelGroup () {
        this.editLoading = true
        let obj = {
          method: 'put',
          id: this.form.id,
          data: {
            id: this.form.id,
            name: this.form.name,
            code: this.form.code
          }
        }
        groupAction(obj).then(res => {
          this.editLoading = false
          this.dialogVisible = false
          if (res.status === 200) {
            this.getTree() // 重新拉取分组结构
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
          }
        }, err => {
          this.editLoading = false
          this.dialogVisible = false
          console.log('error', err)
        })
      },
      // 删除分组
      deleteModelGroup () {
        this.$confirm('确认删除该分组吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let obj = {
            method: 'delete',
            id: this.form.id
          }
          groupAction(obj).then(res => {
            this.dialogVisible = false
            if (res.status === 204) {
              this.getTree() // 重新拉取分组结构
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            }
          }, err => {
            this.dialogVisible = false
            console.log('error', err)
          })
        })
      },
      ...mapMutations({
        'setTreeList': 'SET_TREE_LIST'
      })
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
