<template>
  <div class="login" ref="loginheight">
    <div class="login-particles" >
      <particles></particles>
    </div>
    <div class="login-container">
      <div class="login-form-card">
        <div class="login-title">
          自动化运维管理平台
        </div>
        <div class="login-form">
          <el-form ref="ruleForm" :model="ruleForm" :rules="rules" @submit.native.prevent>
            <el-form-item  prop="account" class="login-form-item">
              <div class="item-icon">
                <i class="fa fa-user" aria-hidden="true" ></i>
              </div>
              <el-input v-model.trim="ruleForm.account" :autofocus="true"  placeholder="账号"></el-input>
            </el-form-item>
            <el-form-item  prop="password" class="login-form-item">
              <div class="item-icon">
                <i class="fa fa-lock" aria-hidden="true"></i>
              </div>
              <el-input v-model.trim="ruleForm.password" type="password"  @keyup.enter.native.prevent= "login('ruleForm')" placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="submit" @click="login('ruleForm')" :loading="loading">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { login } from '@/api/login.js'
  import { checkEmail } from '@/utils/validator'
  import { mapMutations } from 'vuex'
  import { get_csrf }  from  '@/api/csrf.js'
  import particles from './particles' 

  export default {
    name: 'login',
    components:{
        particles
    },
    // directives: {
    //   focus(el){
    //     el.focus()
    //   }
    // },
    data() {
      // const validateEmail = (rule, value, callback) => {
      //   if (value == '') {
      //     callback(new Error('请输入邮箱'))
      //   } else {
      //     if (!checkEmail(value)) {
      //       callback(new Error('请输入正确的邮箱地址'))
      //     } else {
      //       callback()
      //     }
      //   }
      // }
      return {
        ruleForm: {
          account: '',
          password: ''
        },
        rules: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 8, max: 30, message: '长度在 8 到 30 个字符', trigger: 'blur' }
          ]
        },
        loading: false
      }
    },
    created() {

      let a={};
      let b=[]
      this.setUserInfo(a);
      this.setMenuList(b);
      this.setTopActiveIndex('0');
      this.setLeftActiveIndex('');
    },
    mounted () {
      this.$refs.loginheight.style.height='${document.documentElement.clientHeight}px' //解决出现的滚动条
      console.log(  this.$refs.clcheight)
      console.log(`${document.documentElement.clientHeight}` ) //获取屏幕可视化区域的高度

    },
    methods: {
      login (formName) {
        let self = this;
        let obj = {
          account: self.ruleForm.account,
          password: self.ruleForm.password,
          // email: 'opencmdb@devopsedu.com'
        };
        self.$refs[formName].validate( (valid) => {
          if (valid) {
            self.loading = true

            get_csrf().then( res => {
              return login(obj)
            })
            .then(res => {
              self.loading = false;
              if (res.status == 200 && res.data.status == 1) {
                let userinfo = res.data.userinfo
                userinfo.menu.unshift({id:-1,permission_name:"主页",route_uri:"/layout/home",order_num:-1})
                this.setUserInfo(userinfo);
                self.$message({
                  message: res.data.message,
                  type: 'success'
                })
                self.$router.push({path: '/layout/home'})
              }else if (res.status == 200 && res.data.status == 0){
                self.$message({
                  message: res.data.message,
                  type: 'warning'
                })

              }

            },err => {
              self.loading = false
              console.log('error',err)
            })
          } else {
            self.$message({
              message: '请输入正确的账号或密码',
              type: 'warning'
            })
            return false
          }
        })
      },
      ...mapMutations ({
        setUserInfo: 'SET_USER_INFO',
        setMenuList: 'SET_MENU_LIST',
        setTopActiveIndex: 'SET_TOP_ACTIVE_INDEX',
        setLeftActiveIndex: 'SET_LEFT_ACTIVE_INDEX'
      })
    },
  }
</script>

<!-- 覆盖element的样式 -->
<style type="text/css" lang="less">
 .login {
   .login-form-item {
      input {
        padding-left: 40px;
        border: none;
        box-shadow: 0 0 0 40px #fff inset;
      }
    }
 }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  // @import "src/styles/mixin.scss";

  body{
    overflow: hidden;
  }

  .login {
      // @include relative;
      position: relative;   //修复边框滑块出现问题
      //  width: 100%;
      // background: linear-gradient(to bottom right,#4a69d8,#52b3c6);
      background: url('../../../src/assets/home_images/home-bg2.jpg') center;
      overflow-y: hidden;
      height: 100%;
      padding: 0;
      margin: 0;
    // @include relative;
     position:fixed;   //修复边框滑块出现问题
    // background: linear-gradient(to bottom right,#4a69d8,#52b3c6);
     background: url('../../../src/assets/home_images/home-bg2.jpg') center;
     overflow-y: hidden;
     width:100%;
     height: 100%;
     padding: 0;
     margin: 0;
    .login-container {
      height: 100%;
      background-repeat: no-repeat;
      background-position: 50% 50px;
    }
    .login-form-card {
      width: 500px;
      background: rgba(212, 204, 204, 0.5);
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
      padding: 20px 40px;
      border-radius: 20px;
      //阴影
      box-shadow: #3a7dc2 10px 10px 30px 5px ;
      .login-form {
        width: 80%;
        margin: 0 auto;
      }
      .login-title {
        text-align: center;
        font-size: 28px;
        color: #fff;
        margin-bottom: 20px;
      }
      .login-form-item {
        position: relative;
      }
      .submit {
        width: 100%;
      }
    }
    .item-icon {
      position: absolute;
      left: 12px;
      top: 0px;
      font-size: 20px;
      color: #6791CE;
      z-index: 100;
    }
  }
</style>
